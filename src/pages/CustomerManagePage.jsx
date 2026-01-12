import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminUsers,
  fetchAdminUserDetail,
} from "../store/thunks/adminUserManageThunk";
import {
  setUserFilters,
  setCurrentPage,
} from "../store/slices/adminUserManageSlice";
import UserDetailModal from "./UserDetailModal.jsx";
import "./CustomerManagePage.css";

export default function CustomerManagePage() {
  const dispatch = useDispatch();

  const { users, totalCount, loading, currentPage, filters } = useSelector(
    (state) => state.adminUserManage
  );

  const [searchInput, setSearchInput] = useState({
    userName: filters.userName || "",
    businessName: filters.businessName || "",
    address: filters.address || "",
    sort: filters.sort || "latest",
  });

  const limit = 8;
  const pageGroupSize = 5;

  useEffect(() => {
    dispatch(fetchAdminUsers({ page: currentPage, limit, ...filters }));
  }, [dispatch, currentPage, filters]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    dispatch(setCurrentPage(1));
    dispatch(setUserFilters(searchInput));
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    const newFilters = { ...searchInput, sort: newSort };
    setSearchInput(newFilters);
    dispatch(setCurrentPage(1));
    dispatch(setUserFilters(newFilters));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchInput((prev) => ({ ...prev, [name]: value }));
  };

  const totalPages = Math.ceil((totalCount || 0) / limit) || 1;
  const startPage =
    (Math.ceil(currentPage / pageGroupSize) - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const handlePageChange = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    dispatch(setCurrentPage(pageNum));
  };

  return (
    <div className="customermanage-container">
      <h1 className="customermanage-greeting">
        고객 정보를 확인하고 관리할 수 있습니다.
      </h1>

      <section className="search-filter-wrapper">
        <form className="search-filter-form" onSubmit={handleSearch}>
          <div className="filter-group">
            <label>고객명</label>
            <input
              type="text"
              name="userName"
              placeholder="이름 입력"
              value={searchInput.userName}
              onChange={handleInputChange}
            />
          </div>
          <div className="filter-group">
            <label>매장명</label>
            <input
              type="text"
              name="businessName"
              placeholder="매장명 입력"
              value={searchInput.businessName}
              onChange={handleInputChange}
            />
          </div>
          <div className="filter-group">
            <label>지역(동/구)</label>
            <input
              type="text"
              name="address"
              placeholder="예: 역삼동"
              value={searchInput.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="filter-group select-group">
            <label>정렬 기준</label>
            <select
              name="sort"
              value={searchInput.sort}
              onChange={handleSortChange}
            >
              <option value="latest">고객 ID 순</option>
              <option value="reservation">예약 많은순</option>
              <option value="business">매장 많은순</option>
            </select>
          </div>
          <button type="submit" className="search-submit-btn">
            검색
          </button>
        </form>
      </section>

      <section className="customermanage-table-wrapper">
        <div className="customermanage-table">
          <div className="customer-table-row customer-table-head">
            <div>고객 ID</div>
            <div>고객명</div>
            <div>연락처</div>
            <div>등록 매장</div>
            <div>예약 건수</div>
            <div>관리</div>
            <div>상태</div>
          </div>

          {/* 🚩 정렬값이나 페이지가 바뀔 때 애니메이션을 트리거하기 위해 key 부여 */}
          <div
            className={`table-content-area ${loading ? "is-loading" : ""}`}
            key={`${filters.sort}-${currentPage}-${filters.userName}`}
          >
            {users && users.length > 0
              ? users.map((user) => (
                  <div
                    className="customer-table-row highlight-fade"
                    key={user.id}
                  >
                    <div>{user.id}</div>
                    <div>{user.name}</div>
                    <div>{user.phoneNumber}</div>
                    <div>{user.businessCount || 0}곳</div>
                    <div>{user.reservationCount || 0}건</div>
                    <div>
                      <button
                        className="detail-btn"
                        onClick={() => dispatch(fetchAdminUserDetail(user.id))}
                      >
                        상세보기
                      </button>
                    </div>
                    <div>
                      <span
                        className={`status-badge ${
                          user.deletedAt ? "redcolor" : "greencolor"
                        }`}
                      >
                        {user.deletedAt ? "탈퇴" : "가입"}
                      </span>
                    </div>
                  </div>
                ))
              : !loading && (
                  <div className="no-data-row">검색 결과가 없습니다.</div>
                )}
          </div>

          {totalPages > 0 && (
            <div className="pagination">
              <button
                className="arrow-btn"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                &lt;&lt;
              </button>
              <button
                className="arrow-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i
              ).map((num) => (
                <button
                  key={num}
                  className={`page-btn ${currentPage === num ? "active" : ""}`}
                  onClick={() => handlePageChange(num)}
                >
                  {num}
                </button>
              ))}
              <button
                className="arrow-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
              <button
                className="arrow-btn"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                &gt;&gt;
              </button>
            </div>
          )}
          <UserDetailModal />
        </div>
      </section>
    </div>
  );
}
