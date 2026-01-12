import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchServicePolicies } from "../store/thunks/servicePolicyThunk.js";
import "./ServicePolicyPage.css";

export default function ServicePolicy() {
  const dispatch = useDispatch();

  const { policies, loading, error } = useSelector(
    (state) => state.servicePolicy
  );

  useEffect(() => {
    dispatch(fetchServicePolicies());
  }, [dispatch]);

  return (
    <div className="servicepolicy-container">
      <h1 className="servicepolicy-greeting">
        서비스 유형 및 기기 사이즈별 기준 정책을 확인할 수 있습니다.
      </h1>

      <section className="servicepolicy-table-wrapper">
        <div className="servicepolicy-table">
          <table className="policy-table">
            <colgroup>
              <col style={{ width: "80px" }} /> {/* 정책ID */}
              <col style={{ width: "130px" }} /> {/* 제빙기 사이즈 */}
              <col style={{ width: "150px" }} /> {/* 서비스 타입 */}
              <col style={{ width: "120px" }} /> {/* 표준작업시간 */}
              <col style={{ width: "auto" }} /> {/* 서비스 정책 내용 */}
              <col style={{ width: "140px" }} /> {/* 가격 */}
            </colgroup>
            <thead>
              <tr>
                <th>정책ID</th>
                <th>제빙기 사이즈</th>
                <th>서비스 타입</th>
                <th>표준작업시간</th>
                <th>서비스 정책 내용 (주요 점검 사항)</th>
                <th>가격</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="status-msg">
                    데이터를 불러오는 중입니다...
                  </td>
                </tr>
              ) : policies.length > 0 ? (
                policies.map((policy) => (
                  <tr key={policy.id}>
                    <td className="id-cell">{policy.id}</td>
                    <td>{policy.sizeType}</td>
                    <td className="type-text-cell">{policy.serviceType}</td>
                    <td>{policy.standardDuration}분</td>
                    <td className="note-full-cell">
                      <span>{policy.note}</span>
                    </td>

                    <td className="price-text">
                      {policy.price?.toLocaleString()}원
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="status-msg">
                    {error || "등록된 서비스 정책이 없습니다."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {policies.length > 0 && (
            <div className="pagination">
              <button className="page-btn" disabled>
                &lt;&lt;
              </button>
              <button className="page-btn active">1</button>
              <button className="page-btn" disabled>
                &gt;&gt;
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
