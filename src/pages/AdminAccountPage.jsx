import "./AdminAccountPage.css";

export default function AdminAccountPage() {
  return (
    <div className="adminaccount-container">
      {/* 설명 문구 */}
      <h1 className="adminaccount-greeting">
        관리자 계정과 권한 정보를 확인하고 관리할 수 있습니다.
      </h1>

      {/* 흰색 박스 */}
      <section className="adminaccount-table-wrapper">
        <div className="adminaccount-table">

          {/* 테이블 헤더 */}
          <div className="adminaccount-row adminaccount-head">
            <div>관리자번호</div>
            <div>관리자 아이디</div>
            <div>관리자 이름</div>
            <div>역할</div>           
            <div>마지막로그인시간</div>
            <div>마지막로그인IP</div> 
            <div>계정 활성화 여부</div>
          </div>

          {/* rows */}
          <div className="adminaccount-row">
            <div>1</div>
            <div>admin_master</div>
            <div>강동원</div>
            <div>admin</div>
            <div>2025-12-30 09:10:37</div>
            <div>192.168.0.12</div>
            <div><span className="status-badge greencolor">활성</span></div>
          </div>

          <div className="adminaccount-row">
            <div>2</div>
            <div>admin01</div>
            <div>강동원</div>
            <div>admin</div>
            <div>2025-12-30 09:10:37</div>
            <div>192.168.0.12</div>
            <div><span className="status-badge greencolor">활성</span></div>
          </div>

          <div className="adminaccount-row">
            <div>3</div>
            <div>system_admin</div>
            <div>강동원</div>
            <div>admin</div>
            <div>2025-12-30 09:10:37</div>
            <div>192.168.0.12</div>
            <div><span className="status-badge greencolor">활성</span></div>
          </div>

          <div className="adminaccount-row">
            <div>4</div>
            <div>service_admin</div>
            <div>강동원</div>
            <div>admin</div>
            <div>2025-12-30 09:10:37</div>
            <div>192.168.0.12</div>
            <div><span className="status-badge graycolor">비활성</span></div>
          </div>

          <div className="adminaccount-row">
            <div>5</div>
            <div>manager_admin</div>
            <div>강동원</div>
            <div>super_admin</div>
            <div>2025-12-30 09:10:37</div>
            <div>172.16.1.42</div>
            <div><span className="status-badge greencolor">활성</span></div>
          </div>

          <div className="adminaccount-row">
            <div>6</div>
            <div>super_admin</div>
            <div>정우성</div>
            <div>super_admin</div>
            <div>2025-12-30 09:10:37</div>
            <div>172.16.1.42</div>
            <div><span className="status-badge greencolor">활성</span></div>
          </div>

          <div className="adminaccount-row">
            <div>7</div>
            <div>platform_admin</div>
            <div>정우성</div>
            <div>admin</div>
            <div>2025-12-30 09:10:37</div>
            <div>172.16.1.42</div>
            <div><span className="status-badge greencolor">활성</span></div>
          </div>

          <div className="adminaccount-row">
            <div>8</div>
            <div>platform_admin</div>
            <div>정우성</div>
            <div>admin</div>
            <div>2025-12-30 09:10:37</div>
            <div>10.0.0.21</div>
            <div><span className="status-badge greencolor">활성</span></div>
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
