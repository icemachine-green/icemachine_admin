import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { adminEngineerApi } from "../api/adminEngineerApi";
import { fetchEngineers } from "../store/thunks/adminEngineerThunk.js";
import "./EngineerDetailModal.css";

// 1. 모델 정의에 맞춘 매핑 (JUNIOR, SENIOR, MASTER)
const SKILL_MAP = {
  초급: "JUNIOR",
  중급: "SENIOR",
  고급: "MASTER",
  특급: "MASTER", // 모델에 특급이 없으므로 MASTER로 대응
};

const REVERSE_SKILL_MAP = {
  JUNIOR: "초급",
  SENIOR: "중급",
  MASTER: "고급",
};

export default function EngineerDetailModal({ isOpen, onClose, engineer }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    skillLevel: "초급",
    displayStatus: "활성",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (engineer) {
      setFormData({
        skillLevel: REVERSE_SKILL_MAP[engineer.skillLevel] || "초급",
        displayStatus: engineer.isActive ? "활성" : "비활성",
      });
    }
  }, [engineer]);

  if (!isOpen || !engineer) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);

      // 모델 규격에 맞게 변환 (JUNIOR/SENIOR/MASTER)
      const mappedSkill = SKILL_MAP[formData.skillLevel];

      // 1. 기술 등급 수정
      await adminEngineerApi.updateEngineer(engineer.id, {
        skillLevel: mappedSkill,
      });

      // 2. 상태 수정
      await adminEngineerApi.updateStatus(engineer.id, formData.displayStatus);

      alert("성공적으로 저장되었습니다.");
      dispatch(fetchEngineers({ page: 1, limit: 10 }));
      onClose(true);
    } catch (error) {
      console.error("Save Error:", error);
      alert(
        `저장 실패: ${error.response?.data?.msg || "데이터 형식을 확인하세요."}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mgr-modal-overlay" onClick={() => onClose(false)}>
      <div className="mgr-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 상단 띠 장식 및 헤더 */}
        <div className="mgr-modal-accent-bar"></div>
        <div className="mgr-modal-header">
          <div className="title-group">
            <span className="id-badge">기사 ID {engineer.id}</span>
            <h2>기사 프로필 관리</h2>
          </div>
          <button className="close-btn" onClick={() => onClose(false)}>
            &times;
          </button>
        </div>

        <div className="mgr-modal-body">
          {/* 아바타 섹션 */}
          <div className="mgr-profile-banner">
            <div className="mgr-avatar">{engineer.User?.name?.charAt(0)}</div>
            <div className="mgr-name-info">
              <div className="name-row">
                <span className="name-text">
                  {engineer.User?.name || "기사"}
                </span>
                <span
                  className={`status-pill ${
                    engineer.isActive ? "active" : "inactive"
                  }`}
                >
                  {engineer.isActive ? "배정가능" : "배정불가"}
                </span>
              </div>
              <p className="email-text">
                {engineer.User?.email || "No Email Provided"}
              </p>
            </div>
          </div>

          <div className="mgr-form-container">
            {/* 기본 정보 */}
            <div className="mgr-form-section">
              <h4 className="mgr-label">인적 사항</h4>
              <div className="mgr-read-only">
                <div className="read-row">
                  <label>연락처</label>
                  <span>{engineer.User?.phoneNumber || "-"}</span>
                </div>
                <div className="read-row">
                  <label>입사 일자</label>
                  <span>{engineer.createdAt?.split(" ")[0]}</span>
                </div>
              </div>
            </div>

            {/* 수정 가능 설정 */}
            <div className="mgr-form-section">
              <h4 className="mgr-label">운영 설정</h4>
              <div className="mgr-input-row">
                <div className="mgr-input-group">
                  <label>기술 등급</label>
                  <select
                    name="skillLevel"
                    value={formData.skillLevel}
                    onChange={handleChange}
                  >
                    <option value="초급">초급 (Junior)</option>
                    <option value="중급">중급 (Senior)</option>
                    <option value="고급">고급 (Master)</option>
                  </select>
                </div>
                <div className="mgr-input-group">
                  <label>활동 상태</label>
                  <select
                    name="displayStatus"
                    value={formData.displayStatus}
                    onChange={handleChange}
                  >
                    <option value="활성">활성 (Active)</option>
                    <option value="비활성">비활성 (Inactive)</option>
                    <option value="퇴사">퇴사 (Resigned)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mgr-modal-footer">
          <button className="mgr-btn secondary" onClick={() => onClose(false)}>
            취소
          </button>
          <button
            className="mgr-btn primary"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? "처리 중..." : "변경 내용 저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
