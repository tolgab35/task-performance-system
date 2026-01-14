import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useAuth } from "../context/useAuth";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Giriş başarısız oldu");
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
            <h1>Tekrar Hoş Geldiniz</h1>
            <p>Hesabınıza giriş yapın</p>
          </div>
          
          <form onSubmit={handleSubmit}>
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
                placeholder="Şifrenizi girin"
                required
                disabled={loading}
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
          
          <div className="auth-divider">
            <span>veya</span>
          </div>
          
          <p className="auth-link">
            Hesabınız yok mu? <Link to="/register">Hemen kayıt olun</Link>
          </p>
        </div>
        
        <p className="auth-footer">
          <Link to="/">Ana sayfaya dön</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
