import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useAuth } from "../context/useAuth";
import "../styles/Login.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Kayıt başarısız oldu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="auth-logo">
          <CheckCircle size={32} className="logo-icon" />
          <span>TaskFlow</span>
        </Link>
        
        <div className="auth-box">
          <div className="auth-header">
            <h1>Hesap Oluşturun</h1>
            <p>Ücretsiz başlayın, kredi kartı gerekmez</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Ad Soyad</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız Soyadınız"
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">E-posta</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@sirket.com"
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Şifre</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="En az 6 karakter"
                required
                disabled={loading}
                minLength={6}
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Hesap oluşturuluyor..." : "Kayıt Ol"}
            </button>
          </form>
          
          <p className="auth-terms">
            Kayıt olarak <a href="#">Kullanım Koşulları</a>'nı kabul etmiş olursunuz.
          </p>
          
          <div className="auth-divider">
            <span>veya</span>
          </div>
          
          <p className="auth-link">
            Zaten hesabınız var mı? <Link to="/login">Giriş yapın</Link>
          </p>
        </div>
        
        <p className="auth-footer">
          <Link to="/">Ana sayfaya dön</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
