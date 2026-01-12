import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLoginThunk } from "../store/thunks/authThunk.js";
import "./AdminLoginPage.css";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const [loginData, setLoginData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // unwrap()은 Thunk의 결과를 바로 반환하거나 에러를 throw합니다.
      const result = await dispatch(adminLoginThunk(loginData)).unwrap();

      if (result.code === "00") {
        console.log("로그인 성공! 유저 권한:", result.data.admin.role);
        navigate("/"); // 메인 페이지로 이동
      }
    } catch (err) {
      console.error("로그인 실패:", err);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1 className="admin-login-title">ADMINISTRATOR</h1>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-login-input-group">
            <label>ID</label>
            <input
              type="text"
              name="username"
              value={loginData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="admin-login-input-group">
            <label>PW</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && (
            <p className="error-message">
              {error.msg || "로그인 정보를 확인해주세요."}
            </p>
          )}
          <button
            type="submit"
            className="admin-login-button"
            disabled={status === "loading"}
          >
            {status === "loading" ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}
