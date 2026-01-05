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
      id : "1",
      customer: "홍길동",
      store: "한옥카페",
      engineer: "김정현",
      date: "2026-01-31",
      time: "09:00~11:00",
      status: "취소",
    },
    {
      id : "2",
      customer: "홍길동",
      store: "커피명가",
      engineer: "이태호",
      date: "2026-01-31",
      time: "09:00~11:00",
      status: "확정됨",
    },
    {
      id : "3",
      customer: "홍길동",
      store: "Cafe Spell",
      engineer: "이태호",
      date: "2026-01-31",
      time: "09:00~11:00",
      status: "접수됨",
    },
    {
      id : "4",
      customer: "홍길동",
      store: "아메리카노 1000",
      engineer: "이태호",
      date: "2026-02-05",
      time: "09:00~11:00",
      status: "완료됨",      
    },
    {
      id : "5",
      customer: "고길동",
      store: "맥다방",
      engineer: "정선민",
      date: "2026-02-07",
      time: "09:00~11:00",
      status: "작업중",
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
          <h2>최근 예약 <span> (최근 5건씩 출력됩니다)</span></h2>
          <span>오늘 예약 : <strong>12</strong> 건</span>
        </div>

        <div className="dashboard-table">
          <div className="table-row table-head">
            <div>예약 ID</div>
            <div>고객명</div>
            <div>업체명</div>
            <div>기사명</div>
            <div>예약 날짜</div>
            <div>최근 예약</div>
            <div>상태</div>
          </div>

          {reservations.map((row, idx) => (
            <div key={idx} className="table-row">
              <div>{row.id}</div>
              <div>{row.customer}</div>
              <div>{row.store}</div>
              <div>{row.engineer}</div>
              <div>{row.date}</div>
              <div>{row.time}</div>
              <div>
                <span className={`status-badge ${row.status}`}>
                  {row.status}
                </span>
              </div>
            </div>
            
          ))}
        </div>
            <div className="pagination">
            <button className="page-btn">&lt;&lt;</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">4</button>
            <button className="page-btn">&gt;&gt;</button>
          </div>
      </section>
    </div>
  );
}
