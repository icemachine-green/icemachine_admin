/**
 * [Vworld API Key]
 * 태호님이 발급받으신 키를 직접 할당했습니다.
 * .env 설정 없이도 이 파일만 있으면 즉시 작동합니다.
 */
const VWORLD_KEY = import.meta.env.VITE_VWORLD_API_KEY;

/**
 * 1. 주소를 위도/경도 좌표로 변환 (Vworld API)
 */
const getCoords = async (address) => {
  if (!address) return null;
  try {
    const url = `https://api.vworld.kr/req/address?service=address&request=getcoord&version=2.0&crs=epsg:4326&address=${encodeURIComponent(
      address
    )}&refine=true&simple=false&format=json&type=road&key=${VWORLD_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.response && data.response.status === "OK") {
      return {
        lat: parseFloat(data.response.result.point.y),
        lng: parseFloat(data.response.result.point.x),
      };
    }
    console.warn(`주소 변환 실패 (${address}):`, data.response?.status);
    return null;
  } catch (error) {
    console.error("Vworld API 호출 오류:", error);
    return null;
  }
};

/**
 * 2. 하버사인 공식 (두 좌표 사이의 직선 거리 km 계산)
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // 지구 반지름
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * 3. [메인 로직] 가까운 기사 추천 리스트 생성
 * @param {Object} targetRes - 지연된 현재 예약 데이터
 * @param {Array} allItems - 전체 예약 리스트 (기사 동선 파악용)
 */
export const getRecommendedEngineers = async (targetRes, allItems) => {
  if (!targetRes || !allItems) return [];

  // A. 지연된 매장의 좌표 가져오기
  const targetCoord = await getCoords(targetRes.business.address);
  if (!targetCoord) {
    console.error("대상 매장의 좌표를 찾을 수 없습니다.");
    return [];
  }

  // B. 각 기사별로 '가장 최근에 완료/진행 중인' 위치 찾기
  const engineerMap = {};
  allItems.forEach((item) => {
    if (item.engineer && item.engineer.name) {
      const name = item.engineer.name;
      const serviceTime = new Date(item.serviceStartTime);

      // 기사별로 가장 늦은 시간의 예약지를 현재 위치로 간주
      if (
        !engineerMap[name] ||
        serviceTime > new Date(engineerMap[name].time)
      ) {
        engineerMap[name] = {
          ...item.engineer,
          lastStoreName: item.business.name,
          lastAddress: item.business.address,
          time: item.serviceStartTime,
        };
      }
    }
  });

  // C. 각 기사의 위치와 지연 매장 사이의 거리 계산
  const engineeersList = Object.values(engineerMap);
  const results = await Promise.all(
    engineeersList.map(async (eng) => {
      const engCoord = await getCoords(eng.lastAddress);

      let distance = 999; // 좌표 못 찾을 경우 후순위로 밀림
      if (engCoord) {
        distance = calculateDistance(
          targetCoord.lat,
          targetCoord.lng,
          engCoord.lat,
          engCoord.lng
        );
      }

      return {
        ...eng,
        distance: parseFloat(distance.toFixed(2)), // 소수점 둘째자리까지
      };
    })
  );

  // D. 거리순으로 정렬 (가까운 기사가 0번 인덱스)
  return results.sort((a, b) => a.distance - b.distance);
};
