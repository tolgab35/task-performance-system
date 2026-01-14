import React from "react";
import { Check, X } from "lucide-react";
import "../styles/NotificationPanel.css";
import invitationService from "../services/invitationService";

const NotificationPanel = ({ invitations, onClose, onInvitationProcessed }) => {
  const [processing, setProcessing] = React.useState({});

  const handleAccept = async (invitationId) => {
    setProcessing({ ...processing, [invitationId]: "accepting" });
    try {
      const result = await invitationService.acceptInvitation(invitationId);
      onInvitationProcessed("accepted", result.invitation, result.project);
    } catch (error) {
      console.error("Error accepting invitation:", error);
      alert(error.response?.data?.message || "Davet kabul edilemedi");
      setProcessing({ ...processing, [invitationId]: null });
    }
  };

  const handleReject = async (invitationId) => {
    setProcessing({ ...processing, [invitationId]: "rejecting" });
    try {
      const result = await invitationService.rejectInvitation(invitationId);
      onInvitationProcessed("rejected", result.invitation);
    } catch (error) {
      console.error("Error rejecting invitation:", error);
      alert(error.response?.data?.message || "Davet reddedilemedi");
      setProcessing({ ...processing, [invitationId]: null });
    }
  };

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <h3>Davetler</h3>
        <button className="notification-close" onClick={onClose}>
          &times;
        </button>
      </div>

      <div className="notification-content">
        {invitations.length === 0 ? (
          <div className="no-invitations">
            <p>Bekleyen davet yok</p>
          </div>
        ) : (
          <div className="invitation-list">
            {invitations.map((invitation) => (
              <div key={invitation._id} className="invitation-card">
                <div className="invitation-info">
                  <p className="invitation-project">
                    {invitation.projectId?.name || "Proje"}
                  </p>
                  <p className="invitation-from">
                    <strong>{invitation.invitedBy?.name || "Bilinmeyen"}</strong> tarafından
                  </p>
                </div>
                <div className="invitation-actions">
                  <button
                    className="btn-accept"
                    onClick={() => handleAccept(invitation._id)}
                    disabled={processing[invitation._id]}
                    title="Kabul Et"
                  >
                    {processing[invitation._id] === "accepting" ? (
                      <span>...</span>
                    ) : (
                      <Check size={14} />
                    )}
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleReject(invitation._id)}
                    disabled={processing[invitation._id]}
                    title="Reddet"
                  >
                    {processing[invitation._id] === "rejecting" ? (
                      <span>...</span>
                    ) : (
                      <X size={14} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
