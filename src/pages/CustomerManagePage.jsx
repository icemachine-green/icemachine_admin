import "./CustomerManagePage.css";

export default function CustomerManagePage() {
  return (
    <div className="customermanage-container">
      {/* 설명 문구 */}
      <h1 className="customermanage-greeting">
        고객 정보를 확인하고 관리할 수 있습니다.
      </h1>

      {/* 흰색 박스 */}
      <section className="customermanage-table-wrapper">
        <div className="customermanage-table">

          {/* 테이블 헤더 */}
          <div className="customer-table-row customer-table-head">
            <div>사용자번호</div>
            <div>고객명</div>
            <div>연락처</div>
            <div>등록 매장 보유수</div>
            <div>예약 건수</div>
            <div>관리</div>
            <div>상태</div>
          </div>

          {/* row 1 */}
          <div className="customer-table-row">
            <div>1</div>
            <div>김길동</div>
            <div>010-3456-7821</div>
            <div>3곳</div>
            <div>5건</div>
            <div>
              <button className="detail-btn">상세보기</button>
            </div>
            <div>
              <span className="status-badge redcolor">탈퇴</span>
            </div>
          </div>

          {/* row 2 */}
          <div className="customer-table-row">
            <div>2</div>
            <div>이길동</div>
            <div>010-9821-3345</div>
            <div>2곳</div>
            <div>10건</div>
            <div>
              <button className="detail-btn">상세보기</button>
            </div>
            <div>
              <span className="status-badge greencolor">정상</span>
            </div>
          </div>

          {/* row 3 */}
          <div className="customer-table-row">
            <div>3</div>
            <div>박길동</div>
            <div>010-7741-9920</div>
            <div>1곳</div>
            <div>8건</div>
            <div>
              <button className="detail-btn">상세보기</button>
            </div>
            <div>
              <span className="status-badge greencolor">정상</span>
            </div>
          </div>

          {/* row 4 */}
          <div className="customer-table-row">
            <div>4</div>
            <div>고길동</div>
            <div>010-6612-1209</div>
            <div>1곳</div>
            <div>5건</div>
            <div>
              <button className="detail-btn">상세보기</button>
            </div>
            <div>
              <span className="status-badge greencolor">정상</span>
            </div>
          </div>

          {/* row 5 */}
          <div className="customer-table-row">
            <div>5</div>
            <div>신길동</div>
            <div>010-4309-1188</div>
            <div>2곳</div>
            <div>1건</div>
            <div>
              <button className="detail-btn">상세보기</button>
            </div>
            <div>
              <span className="status-badge greencolor">정상</span>
            </div>
          </div>

          {/* row 6 */}
          <div className="customer-table-row">
            <div>6</div>
            <div>홍길동</div>
            <div>010-9981-5523</div>
            <div>1곳</div>
            <div>3건</div>
            <div>
              <button className="detail-btn">상세보기</button>
            </div>
            <div>
              <span className="status-badge greencolor">정상</span>
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
