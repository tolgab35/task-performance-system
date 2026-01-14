import { useState, useEffect } from "react";
import { teamService } from "../services/teamService";
import InvitationModal from "./InvitationModal";
import "../styles/Team.css";

const Team = ({ activeProject }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!activeProject) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const members = await teamService.getTeamMembers(activeProject._id);
        setTeamMembers(members);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Takım üyeleri yüklenemedi");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [activeProject]);

  const handleInvitationSent = () => {
    // Optionally refresh team members or show success message
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (!activeProject) {
    return (
      <div className="team-page">
        <div className="team-header">
          <div>
            <h1>Takım</h1>
            <p className="subtitle">Henüz bir projeniz yok.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="team-page">
        <div className="team-header">
          <div>
            <h1>Takım</h1>
            <p className="subtitle">Yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="team-page">
        <div className="team-header">
          <div>
            <h1>Takım</h1>
            <p className="subtitle" style={{ color: "#ef4444" }}>
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="team-page">
      <div className="team-header">
        <div>
          <h1>Takım</h1>
          <p className="subtitle">Takım üyelerini görüntüleyin ve yönetin</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setIsInviteModalOpen(true)}
        >
          + Üye Ekle
        </button>
      </div>

      {teamMembers.length === 0 ? (
        <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
          Bu projede henüz üye yok.
        </div>
      ) : (
        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card">
              <div className="member-status">
                <span className="status-indicator online"></span>
              </div>
              <div className="member-avatar-large">
                {getInitials(member.name)}
              </div>
              <h3 className="member-name">{member.name}</h3>
              <p className="member-email">{member.email}</p>

              <div className="member-stats">
                <div className="stat">
                  <span className="stat-value">{member.tasksCount}</span>
                  <span className="stat-label">Görevler</span>
                </div>
              </div>

              <div className="member-actions">
                <button className="btn-outline">Profil</button>
                <button className="btn-outline">Mesaj</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <InvitationModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        projectId={activeProject._id}
        onInvitationSent={handleInvitationSent}
      />
    </div>
  );
};

export default Team;
