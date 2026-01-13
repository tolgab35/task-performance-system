import "../styles/Sidebar.css";

const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "tasks", label: "Tasks", icon: "📋" },
    { id: "team", label: "Team", icon: "👥" },
    { id: "reports", label: "Reports", icon: "📈" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">✓</span>
          <span className="logo-text">TaskFlow</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? "active" : ""}`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">DV</div>
          <div className="user-info">
            <div className="user-name">Demo User</div>
            <div className="user-email">demo@taskflow.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
