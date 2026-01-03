import "./DashboardPage.css";

export default function DashboardPage() {
  const stats = [
    { label: "접수됨", count: 5, color: "blue" },
    { label: "확정됨", count: 1, color: "purple" },
    { label: "작업중", count: 2, color: "green" },
    { label: "작업 완료", count: 4, color: "orange" },
    { label: "취소", count: 1, color: "red" },
  ];

  const reservations = [
    {
      customer: "홍길동",
      store: "한옥카페",
      service: "프리미엄 클린",
      date: "2026-01-31",
      engineer: "김정현",
      status: "작업중",
    },
    {
      customer: "홍길동",
      store: "커피명가",
      service: "팀 클린",
      date: "2026-01-31",
      engineer: "이태호",
      status: "취소",
    },
    {
      customer: "홍길동",
      store: "Cafe Spell",
      service: "스탠다드 클린",
      date: "2026-02-01",
      engineer: "이태호",
      status: "접수됨",
    },
    {
      customer: "홍길동",
      store: "아메리카노 1000",
      service: "팀 클린",
      date: "2026-02-05",
      engineer: "이태호",
      status: "확정됨",
    },
    {
      customer: "고길동",
      store: "맥다방",
      service: "구독 서비스",
      date: "2026-02-07",
      engineer: "정선민",
      status: "완료됨",
    },
		{
      customer: "고길동",
      store: "장미다방",
      service: "구독 서비스",
      date: "2026-02-10",
      engineer: "이태호",
      status: "완료됨",
    },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-greeting">안녕하세요, 관리자님! 대시보드입니다.</h1>

      {/* 통계 카드 */}
      <section className="dashboard-stats">
        {stats.map((item, idx) => (
          <div key={idx} className="stat-card">
            <strong>{item.count}</strong>
            <span className={item.color}>{item.label}</span>
          </div>
        ))}
      </section>

      {/* 최근 예약 */}
      <section className="dashboard-table-wrapper">
        <div className="table-header">
          <h2>최근 예약</h2>
          <span>오늘 예약 : <strong>12</strong> 건</span>
        </div>

        <div className="dashboard-table">
          <div className="table-row table-head">
            <div>고객명</div>
            <div>매장명</div>
            <div>서비스 타입</div>
            <div>예약 시작 날짜</div>
            <div>기사명</div>
            <div>상태</div>
          </div>

          {reservations.map((row, idx) => (
            <div key={idx} className="table-row">
              <div>{row.customer}</div>
              <div>{row.store}</div>
              <div>{row.service}</div>
              <div>{row.date}</div>
              <div>{row.engineer}</div>
              <div>
                <span className={`status-badge ${row.status}`}>
                  {row.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
