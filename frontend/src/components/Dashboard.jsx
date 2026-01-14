import { useState, useEffect } from "react";
import { dashboardService } from "../services/dashboardService";
import "../styles/Dashboard.css";

const Dashboard = ({ activeProject }) => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    teamMembers: 0,
    projectProgress: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!activeProject) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await dashboardService.getDashboardStats(
          activeProject._id
        );
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Dashboard yüklenemedi");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [activeProject]);

  if (!activeProject) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p className="subtitle">Henüz bir projeniz yok.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p className="subtitle">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p className="subtitle" style={{ color: "#ef4444" }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="subtitle">
          Hoş geldiniz! İşte projenizin genel görünümü.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#eef2ff" }}>
            <span style={{ color: "#667eea" }}>📋</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalTasks}</h3>
            <p className="stat-label">Toplam Görev</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fef3c7" }}>
            <span style={{ color: "#f59e0b" }}>⏳</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.inProgressTasks}</h3>
            <p className="stat-label">Devam Eden</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#d1fae5" }}>
            <span style={{ color: "#10b981" }}>✓</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.completedTasks}</h3>
            <p className="stat-label">Tamamlanan</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fee2e2" }}>
            <span style={{ color: "#ef4444" }}>👥</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.teamMembers}</h3>
            <p className="stat-label">Takım Üyeleri</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-activity">
          <h2>Son Aktiviteler</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-avatar">AY</div>
              <div className="activity-details">
                <p>
                  <strong>Ali Yılmaz</strong> yeni bir görev ekledi
                </p>
                <span className="activity-time">2 saat önce</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-avatar">ZÇ</div>
              <div className="activity-details">
                <p>
                  <strong>Zeynep Çelik</strong> "Interview & Prototyping"
                  görevini tamamladı
                </p>
                <span className="activity-time">4 saat önce</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-avatar">MK</div>
              <div className="activity-details">
                <p>
                  <strong>Mehmet Kaya</strong> bir yorum ekledi
                </p>
                <span className="activity-time">5 saat önce</span>
              </div>
            </div>
          </div>
        </div>

        <div className="project-progress">
          <h2>Proje İlerlemesi</h2>
          {stats.projectProgress.length > 0 ? (
            stats.projectProgress.slice(0, 3).map((project) => (
              <div key={project.id} className="progress-item">
                <div className="progress-info">
                  <span>{project.name}</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${project.progress}%`,
                      background:
                        project.progress > 70
                          ? "#10b981"
                          : project.progress > 40
                          ? "#667eea"
                          : "#f59e0b",
                    }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              Henüz proje bulunmuyor
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
