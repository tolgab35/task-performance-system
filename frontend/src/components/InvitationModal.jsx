import React, { useState } from "react";
import "../styles/Modal.css";
import invitationService from "../services/invitationService";

const InvitationModal = ({ isOpen, onClose, projectId, onInvitationSent }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("E-posta adresi gereklidir");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Lütfen geçerli bir e-posta adresi girin");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await invitationService.sendInvitation(email, projectId);
      setEmail("");
      onClose();
      if (onInvitationSent) {
        onInvitationSent();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Davet gönderilemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Takım Üyesi Davet Et</h2>
          <button className="modal-close" onClick={handleClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="email">E-posta Adresi</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@sirket.com"
              disabled={loading}
              autoFocus
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn-cancel"
              disabled={loading}
            >
              İptal
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Gönderiliyor..." : "Davet Gönder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvitationModal;
