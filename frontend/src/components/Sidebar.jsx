import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, CheckSquare, Users, BarChart3, LogOut, CheckCircle } from "lucide-react";
import { useAuth } from "../context/useAuth";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { id: "dashboard", label: "Ana Sayfa", icon: LayoutDashboard, path: "/dashboard" },
    { id: "tasks", label: "Görevler", icon: CheckSquare, path: "/tasks" },
    { id: "team", label: "Takım", icon: Users, path: "/team" },
    { id: "reports", label: "Raporlar", icon: BarChart3, path: "/reports" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <CheckCircle size={20} className="logo-icon" />
          <span className="logo-text">TaskFlow</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              <IconComponent size={18} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            {user?.name?.substring(0, 2).toUpperCase() || "U"}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name || "User"}</div>
            <div className="user-email">{user?.email || ""}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
