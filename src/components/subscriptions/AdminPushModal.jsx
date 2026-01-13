import "./AdminPushModal.css";
import useAdminPush from "../../hooks/useAdminPush.jsx";
import { useSelector } from "react-redux";

export default function AdminPushModal() {
  const { isReady, isSubscribed, hasChecked, subscribeAdmin } = useAdminPush();
  const { isLoggedIn } = useSelector((state) => state.auth);

  if (!isLoggedIn || !isReady || isSubscribed || hasChecked) return null;

  return (
    <div className="notification-info-container">
      <div className="notification-info-content-box">
        <div className="notification-info-content-info">
          <p className="title">실시간 업무 알림 활성화</p>
          <p className="desc">
            예약 취소, 신규 접수 등 <strong>중요 업무 상태</strong>를<br />
            데스크톱 알림으로 즉시 확인하실 수 있습니다.
          </p>
          <p className="sub">
            * 원활한 관제 업무를 위해 알림 허용을 권장합니다.
          </p>
        </div>
        <div className="notification-info-btn-box">
          <button
            type="button"
            className="btn-primary"
            onClick={subscribeAdmin}
          >
            알림 수신 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
