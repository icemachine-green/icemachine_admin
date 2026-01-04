import "./ReservationManagePage.css";

export default function ReservationManagePage() {
  return (
    <div className="reservationmanage-container">
      <h1 className="reservationmanage-greeting">접수된 예약을 확인하고, 진행 상태를 관리할 수 있습니다. </h1>

      <section className="reservationmanage-table-wrapper">
        <div className="reservationmanage-table">
        </div>
      </section>
    </div>
  )
} 