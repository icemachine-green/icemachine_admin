import "./ServicePolicyPage.css";

export default function ServicePolicy() {
  return (
    <div className="servicepolicy-container">
      {/* 설명 문구 */}
      <h1 className="servicepolicy-greeting">
        서비스 유형 및 기기 사이즈별 기준 정책을 확인할 수 있습니다.
      </h1>

      {/* 흰색 박스 */}
      <section className="servicepolicy-table-wrapper">
        <div className="servicepolicy-table">

          {/* 테이블 */}
          <table className="policy-table">
            <thead>
              <tr>
                <th>정책ID</th>
                <th>제빙기 사이즈</th>
                <th>서비스 타입</th>
                <th>표준작업시간</th>
                <th>서비스정책내용</th>
                <th>상태</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>소형</td>
                <td>프리미엄 클린</td>
                <td>180분</td>
                <td>완전분해세척</td>
                <td><span className="status-badge greencolor">활성</span></td>
              </tr>
              <tr>
                <td>2</td>
                <td>중형</td>
                <td>딥클린</td>
                <td>120분</td>
                <td>고급세척</td>
                <td><span className="status-badge greencolor">활성</span></td>
              </tr>
              <tr>
                <td>3</td>
                <td>대형</td>
                <td>스탠다드 클린</td>
                <td>60분</td>
                <td>내부세척포함</td>
                <td><span className="status-badge redcolor">비활성</span></td>
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

