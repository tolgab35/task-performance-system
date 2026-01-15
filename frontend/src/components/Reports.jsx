import { useState, useEffect } from "react";
import { BarChart3, Clock, CheckCircle, Target } from "lucide-react";
import { reportService } from "../services/reportService";
import "../styles/Reports.css";

const Reports = ({ activeProject }) => {
  const [projectReport, setProjectReport] = useState(null);
  const [overviewReport, setOverviewReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);

        // Genel raporu her zaman al
        const overview = await reportService.getOverviewReport();
        setOverviewReport(overview);

        // Aktif proje varsa proje raporunu da al
        if (activeProject) {
          const report = await reportService.getProjectReport(
            activeProject._id
          );
          setProjectReport(report);
        }
      } catch (err) {
        console.error("Rapor yüklenemedi:", err);
        setError(err.response?.data?.message || "Rapor yüklenemedi");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [activeProject]);

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getPerformanceColor = (rate) => {
    if (rate >= 80) return "#10b981"; // green
    if (rate >= 50) return "#f59e0b"; // orange
    return "#ef4444"; // red
  };

  if (loading) {
    return (
      <div className="reports-page">
        <div className="reports-header">
          <div>
            <h1>Raporlar</h1>
            <p className="subtitle">Yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-page">
        <div className="reports-header">
          <div>
            <h1>Raporlar</h1>
            <p className="subtitle" style={{ color: "#ef4444" }}>
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const summary = projectReport?.summary || {
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    completionRate: 0,
    weeklyPerformanceChange: 0,
    tasksCompletedThisWeek: 0,
    avgCompletionTime: 0,
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Raporlar</h1>
          <p className="subtitle">
            Proje performansını ve metrikleri görüntüleyin
          </p>
        </div>
        <button className="btn-primary">
          <BarChart3 size={16} />
          <span>Rapor Oluştur</span>
        </button>
      </div>

      {!activeProject ? (
        <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
          Raporları görüntülemek için bir proje seçin.
        </div>
      ) : (
        <>
          <div className="report-cards">
            <div className="report-card">
              <div className="report-icon report-icon-blue">
                <BarChart3 size={24} />
              </div>
              <h3>Haftalık Performans</h3>
              <p className="report-description">
                Son 7 günlük görev tamamlama oranları ve takım performansı
              </p>
              <div className="report-metric">
                <span className="metric-value">
                  {summary.weeklyPerformanceChange >= 0 ? "+" : ""}
                  {summary.weeklyPerformanceChange}%
                </span>
                <span className="metric-label">
                  {summary.weeklyPerformanceChange >= 0 ? "artış" : "düşüş"}
                </span>
              </div>
            </div>

            <div className="report-card">
              <div className="report-icon report-icon-orange">
                <Clock size={24} />
              </div>
              <h3>Zaman Takibi</h3>
              <p className="report-description">
                Görevlerin ortalama tamamlanma süresi
              </p>
              <div className="report-metric">
                <span className="metric-value">
                  {summary.avgCompletionTime} gün
                </span>
                <span className="metric-label">ortalama</span>
              </div>
            </div>

            <div className="report-card">
              <div className="report-icon report-icon-green">
                <CheckCircle size={24} />
              </div>
              <h3>Tamamlanma Oranı</h3>
              <p className="report-description">
                Planlanan görevlerin tamamlanma yüzdesi
              </p>
              <div className="report-metric">
                <span className="metric-value">{summary.completionRate}%</span>
                <span className="metric-label">başarı oranı</span>
              </div>
            </div>

            <div className="report-card">
              <div className="report-icon report-icon-red">
                <Target size={24} />
              </div>
              <h3>Proje Hedefleri</h3>
              <p className="report-description">
                Belirlenen hedeflere ulaşma durumu
              </p>
              <div className="report-metric">
                <span className="metric-value">
                  {summary.completedTasks}/{summary.totalTasks}
                </span>
                <span className="metric-label">tamamlandı</span>
              </div>
            </div>
          </div>

          <div className="report-details">
            <div className="detail-section">
              <h2>Takım Performansı</h2>
              <div className="performance-list">
                {projectReport?.teamPerformance?.length > 0 ? (
                  projectReport.teamPerformance.map((member) => (
                    <div key={member.user._id} className="performance-item">
                      <div className="perf-info">
                        <div className="perf-avatar">
                          {getInitials(member.user.name)}
                        </div>
                        <div>
                          <p className="perf-name">{member.user.name}</p>
                          <p className="perf-role">{member.user.email}</p>
                        </div>
                      </div>
                      <div className="perf-stats">
                        <span className="perf-tasks">
                          {member.totalTasks} görev
                        </span>
                        <div className="perf-bar">
                          <div
                            className="perf-fill"
                            style={{
                              width: `${member.performanceRate}%`,
                              background: getPerformanceColor(
                                member.performanceRate
                              ),
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      padding: "20px",
                      color: "#6b7280",
                      textAlign: "center",
                    }}
                  >
                    Henüz atanmış görev bulunmuyor.
                  </div>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h2>Proje İstatistikleri</h2>
              <div className="stats-list">
                <div className="stats-item">
                  <span className="stats-label">Toplam Proje</span>
                  <span className="stats-value">
                    {overviewReport?.totalProjects || 0}
                  </span>
                </div>
                <div className="stats-item">
                  <span className="stats-label">Aktif Proje</span>
                  <span className="stats-value">
                    {overviewReport?.activeProjects || 0}
                  </span>
                </div>
                <div className="stats-item">
                  <span className="stats-label">Tamamlanan Proje</span>
                  <span className="stats-value">
                    {overviewReport?.completedProjects || 0}
                  </span>
                </div>
                <div className="stats-item">
                  <span className="stats-label">Toplam Görev</span>
                  <span className="stats-value">
                    {overviewReport?.totalTasks || 0}
                  </span>
                </div>
                <div className="stats-item">
                  <span className="stats-label">
                    Ortalama Tamamlanma Süresi
                  </span>
                  <span className="stats-value">
                    {overviewReport?.avgCompletionTime || 0} gün
                  </span>
                </div>
                <div className="stats-item">
                  <span className="stats-label">Takım Üyesi</span>
                  <span className="stats-value">
                    {overviewReport?.teamMemberCount || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
