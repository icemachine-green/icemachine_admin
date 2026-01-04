import "./ReservationManagePage.css";

export default function ReservationManagePage() {
  return (
    <div className="reservationmanage-container">
      {/* 설명 문구 */}
      <h1 className="reservationmanage-greeting">
        접수된 예약을 확인하고, 진행 상태를 관리할 수 있습니다.
      </h1>

      {/* 흰 박스 */}
      <section className="reservationmanage-table-wrapper">
        <div className="reservationmanage-table">

          {/* 테이블 */}
          <table className="reservation-table">
            <thead>
              <tr>
                <th>예약ID</th>
                <th>고객명</th>
                <th>업체명</th>
                <th>기사명</th>
                <th>예약시작일자</th>
                <th>예약시작시간</th>
                <th>예약종료시간</th>
                <th>예약진행상태</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>홍길동</td>
                <td>한옥커피</td>
                <td>김정현</td>
                <td>2025-12-31</td>
                <td>09:15</td>
                <td>10:15</td>
                <td><span className="status-badge greencolor">작업중</span></td>
              </tr>

              <tr>
                <td>2</td>
                <td>홍길동</td>
                <td>커피명가</td>
                <td>김정현</td>
                <td>2025-12-31</td>
                <td>10:15</td>
                <td>12:15</td>
                <td><span className="status-badge redcolor">취소</span></td>
              </tr>

              <tr>
                <td>3</td>
                <td>홍길동</td>
                <td>Cafe Spell</td>
                <td>김정현</td>
                <td>2025-12-31</td>
                <td>10:15</td>
                <td>12:30</td>
                <td><span className="status-badge bluecolor">접수됨</span></td>
              </tr>

              <tr>
                <td>4</td>
                <td>홍길동</td>
                <td>아메리카노1000</td>
                <td>김정현</td>
                <td>2025-12-31</td>
                <td>11:32</td>
                <td>12:32</td>
                <td><span className="status-badge purplecolor">확정됨</span></td>
              </tr>

              <tr>
                <td>5</td>
                <td>홍길동</td>
                <td>패더밤</td>
                <td>김정현</td>
                <td>2025-12-31</td>
                <td>11:32</td>
                <td>12:32</td>
                <td><span className="status-badge orangecolor">완료됨</span></td>
              </tr>
            </tbody>
          </table>

          {/* 페이지네이션 */}
          <div className="pagination">
            <button className="page-btn">&lt;&lt;</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">4</button>
            <button className="page-btn">&gt;&gt;</button>
          </div>

        </div>
      </section>
    </div>
  );
}
