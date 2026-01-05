import "./DriverManagePage.css";

export default function DriverManagePage() {
  return (
    <div className="driviermanage-container">
      {/* 설명 문구 */}
      <h1 className="driviermanage-greeting">
        기사 정보와 작업 현황을 관리할 수 있습니다.
      </h1>

      {/* 흰색 박스 */}
      <section className="driviermanage-table-wrapper">
        <div className="driviermanage-table">

          {/* 테이블 헤더 */}
          <div className="driver-table-row driver-table-head">
            <div>기사번호</div>
            <div>기사명</div>
            <div>기술등급</div>
            <div>연락처</div>
            <div>입사일</div>
            <div>퇴사일</div>
            <div>상태</div>
          </div>

          {/* row 1 */}
          <div className="driver-table-row">
            <div>1</div>
            <div>김정현</div>
            <div>Senior</div>
            <div>010-1234-0001</div>
            <div>2025-01-04</div>
            <div>-</div>
            <div>
              <span className="status-badge greencolor">활성</span>
            </div>
          </div>

          {/* row 2 */}
          <div className="driver-table-row">
            <div>2</div>
            <div>이태호</div>
            <div>Junior</div>
            <div>010-1234-0002</div>
            <div>2025-01-04</div>
            <div>-</div>
            <div>
              <span className="status-badge greencolor">활성</span>
            </div>
          </div>

          {/* row 3 */}
          <div className="driver-table-row">
            <div>3</div>
            <div>정선민</div>
            <div>Middle</div>
            <div>010-1234-0003</div>
            <div>2025-01-04</div>
            <div>-</div>
            <div>
              <span className="status-badge greencolor">활성</span>
            </div>
          </div>

          {/* row 4 (퇴사, 비활성) */}
          <div className="driver-table-row">
            <div>4</div>
            <div>김정현</div>
            <div>Senior</div>
            <div>010-1234-0004</div>
            <div>2025-01-04</div>
            <div>2025-01-05</div>
            <div>
              <span className="status-badge redcolor">비활성</span>
            </div>
          </div>

          {/* row 5 */}
          <div className="driver-table-row">
            <div>5</div>
            <div>이태호</div>
            <div>Junior</div>
            <div>010-1234-0005</div>
            <div>2025-01-04</div>
            <div>-</div>
            <div>
              <span className="status-badge greencolor">활성</span>
            </div>
          </div>

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
