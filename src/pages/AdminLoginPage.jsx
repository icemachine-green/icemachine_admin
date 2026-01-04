import "./AdminLoginPage.css";

export default function AdminLoginPage() {
	return (
		<div className="admin-login-page">
			<div className="admin-login-card">
				<h1 className="admin-login-title">ADMINISTRATOR</h1>
				<p className="admin-login-desc">
					관리자 계정으로 로그인하여 시스템을 관리하세요.
				</p>

				<form className="admin-login-form">
					<div className="admin-login-input-group">
						<label>관리자 아이디</label>
						<input
							type="text"
							placeholder="admin_id"
						/>
					</div>

					<div className="admin-login-input-group">
						<label>비밀번호</label>
						<input
							type="password"
							placeholder="password"
						/>
					</div>

					<button
						type="button"
						className="admin-login-button"
					>
						로그인
					</button>
				</form>

				<p className="admin-login-footer">
					ⓒ Admin Management System
				</p>
			</div>
		</div>
	);
}
