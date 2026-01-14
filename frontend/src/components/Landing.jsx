import { Link } from "react-router-dom";
import {
  CheckCircle,
  FolderKanban,
  Users,
  BarChart3,
  Layers,
  ArrowRight,
} from "lucide-react";
import "../styles/Landing.css";

const Landing = () => {
  const features = [
    {
      icon: FolderKanban,
      title: "Proje Tabanlı Çalışma Alanları",
      description: "Projelerinizi ayrı ayrı yönetin ve organize edin.",
    },
    {
      icon: Layers,
      title: "Kanban Görev Tahtaları",
      description: "Görevlerinizi sürükle-bırak ile kolayca yönetin.",
    },
    {
      icon: Users,
      title: "Takım İşbirliği",
      description: "Ekibinizi davet edin ve birlikte çalışın.",
    },
    {
      icon: BarChart3,
      title: "İlerleme Takibi",
      description: "Proje performansınızı anlık olarak izleyin.",
    },
  ];

  return (
    <div className="landing-page">
      {/* Top Bar */}
      <header className="landing-header">
        <div className="landing-header-content">
          <Link to="/" className="landing-logo">
            <CheckCircle size={24} className="logo-icon" />
            <span>TaskFlow</span>
          </Link>
          <nav className="landing-nav">
            <Link to="/login" className="nav-link">
              Giriş Yap
            </Link>
            <Link to="/register" className="nav-link nav-link-primary">
              Kayıt Ol
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Proje ve Görev Yönetimi,
            <br />
            <span className="hero-highlight">Basitleştirildi.</span>
          </h1>
          <p className="hero-description">
            Projelerinizi planlayın, görevlerinizi takip edin ve ekibinizle
            verimli bir şekilde işbirliği yapın. Tek bir platformda tüm iş
            akışınızı yönetin.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-hero-primary">
              Hemen Başla
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-hero-secondary">
              Giriş Yap
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-content">
          <h2 className="features-title">Özellikler</h2>
          <p className="features-subtitle">
            TaskFlow ile projelerinizi daha verimli yönetin.
          </p>
          <div className="features-grid">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    <IconComponent size={24} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="preview-section">
        <div className="preview-content">
          <h2 className="preview-title">Çalışma Alanınız Böyle Görünecek</h2>
          <p className="preview-subtitle">
            Sade ve kullanımı kolay arayüz ile işlerinizi hızla halledin.
          </p>
          <div className="preview-mockup">
            <div className="mockup-sidebar">
              <div className="mockup-logo">
                <div className="mockup-logo-icon"></div>
                <div className="mockup-logo-text"></div>
              </div>
              <div className="mockup-nav-item active"></div>
              <div className="mockup-nav-item"></div>
              <div className="mockup-nav-item"></div>
              <div className="mockup-nav-item"></div>
            </div>
            <div className="mockup-main">
              <div className="mockup-topbar">
                <div className="mockup-tabs">
                  <div className="mockup-tab active"></div>
                  <div className="mockup-tab"></div>
                  <div className="mockup-tab"></div>
                </div>
                <div className="mockup-search"></div>
              </div>
              <div className="mockup-board">
                <div className="mockup-column">
                  <div className="mockup-column-header"></div>
                  <div className="mockup-card"></div>
                  <div className="mockup-card"></div>
                  <div className="mockup-card short"></div>
                </div>
                <div className="mockup-column">
                  <div className="mockup-column-header"></div>
                  <div className="mockup-card"></div>
                  <div className="mockup-card short"></div>
                </div>
                <div className="mockup-column">
                  <div className="mockup-column-header"></div>
                  <div className="mockup-card short"></div>
                  <div className="mockup-card"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <CheckCircle size={20} />
            <span>TaskFlow</span>
          </div>
          <nav className="footer-nav">
            <Link to="/login">Giriş Yap</Link>
            <Link to="/register">Kayıt Ol</Link>
          </nav>
          <p className="footer-copyright">
            © {new Date().getFullYear()} TaskFlow. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
