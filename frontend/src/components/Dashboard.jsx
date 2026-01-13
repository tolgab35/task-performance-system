import "../styles/Dashboard.css";

const Dashboard = () => {
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
            <h3 className="stat-value">24</h3>
            <p className="stat-label">Toplam Görev</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fef3c7" }}>
            <span style={{ color: "#f59e0b" }}>⏳</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">8</h3>
            <p className="stat-label">Devam Eden</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#d1fae5" }}>
            <span style={{ color: "#10b981" }}>✓</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">12</h3>
            <p className="stat-label">Tamamlanan</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fee2e2" }}>
            <span style={{ color: "#ef4444" }}>👥</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">8</h3>
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
          <div className="progress-item">
            <div className="progress-info">
              <span>CRM Dashboard</span>
              <span>75%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: "75%", background: "#667eea" }}
              ></div>
            </div>
          </div>
          <div className="progress-item">
            <div className="progress-info">
              <span>Mobile App Design</span>
              <span>45%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: "45%", background: "#f59e0b" }}
              ></div>
            </div>
          </div>
          <div className="progress-item">
            <div className="progress-info">
              <span>Backend API</span>
              <span>90%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: "90%", background: "#10b981" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
