import { BarChart3, Clock, CheckCircle, Target } from "lucide-react";
import "../styles/Reports.css";

const Reports = () => {
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
            <span className="metric-value">+24%</span>
            <span className="metric-label">artış</span>
          </div>
        </div>

        <div className="report-card">
          <div className="report-icon report-icon-orange">
            <Clock size={24} />
          </div>
          <h3>Zaman Takibi</h3>
          <p className="report-description">
            Görevlere harcanan toplam süre ve verimlilik analizi
          </p>
          <div className="report-metric">
            <span className="metric-value">156 saat</span>
            <span className="metric-label">bu hafta</span>
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
            <span className="metric-value">87%</span>
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
            <span className="metric-value">12/15</span>
            <span className="metric-label">tamamlandı</span>
          </div>
        </div>
      </div>

      <div className="report-details">
        <div className="detail-section">
          <h2>Takım Performansı</h2>
          <div className="performance-list">
            <div className="performance-item">
              <div className="perf-info">
                <div className="perf-avatar">AY</div>
                <div>
                  <p className="perf-name">Ali Yılmaz</p>
                  <p className="perf-role">Product Manager</p>
                </div>
              </div>
              <div className="perf-stats">
                <span className="perf-tasks">8 görev</span>
                <div className="perf-bar">
                  <div
                    className="perf-fill"
                    style={{ width: "95%", background: "#10b981" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="performance-item">
              <div className="perf-info">
                <div className="perf-avatar">AD</div>
                <div>
                  <p className="perf-name">Ayşe Demir</p>
                  <p className="perf-role">UI/UX Designer</p>
                </div>
              </div>
              <div className="perf-stats">
                <span className="perf-tasks">12 görev</span>
                <div className="perf-bar">
                  <div
                    className="perf-fill"
                    style={{ width: "88%", background: "#10b981" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="performance-item">
              <div className="perf-info">
                <div className="perf-avatar">MK</div>
                <div>
                  <p className="perf-name">Mehmet Kaya</p>
                  <p className="perf-role">Frontend Developer</p>
                </div>
              </div>
              <div className="perf-stats">
                <span className="perf-tasks">6 görev</span>
                <div className="perf-bar">
                  <div
                    className="perf-fill"
                    style={{ width: "75%", background: "#f59e0b" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="performance-item">
              <div className="perf-info">
                <div className="perf-avatar">ZÇ</div>
                <div>
                  <p className="perf-name">Zeynep Çelik</p>
                  <p className="perf-role">Backend Developer</p>
                </div>
              </div>
              <div className="perf-stats">
                <span className="perf-tasks">9 görev</span>
                <div className="perf-bar">
                  <div
                    className="perf-fill"
                    style={{ width: "92%", background: "#10b981" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h2>Proje İstatistikleri</h2>
          <div className="stats-list">
            <div className="stats-item">
              <span className="stats-label">Toplam Proje</span>
              <span className="stats-value">8</span>
            </div>
            <div className="stats-item">
              <span className="stats-label">Aktif Proje</span>
              <span className="stats-value">3</span>
            </div>
            <div className="stats-item">
              <span className="stats-label">Tamamlanan Proje</span>
              <span className="stats-value">5</span>
            </div>
            <div className="stats-item">
              <span className="stats-label">Toplam Görev</span>
              <span className="stats-value">124</span>
            </div>
            <div className="stats-item">
              <span className="stats-label">Ortalama Tamamlanma Süresi</span>
              <span className="stats-value">3.2 gün</span>
            </div>
            <div className="stats-item">
              <span className="stats-label">Takım Üyesi</span>
              <span className="stats-value">8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
