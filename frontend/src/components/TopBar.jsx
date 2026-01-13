import "../styles/TopBar.css";

const TopBar = () => {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search tasks"
            className="search-input"
          />
          <span className="search-shortcut">⌘ K</span>
        </div>
      </div>

      <div className="topbar-right">
        <button className="topbar-icon notification-btn">
          <span>🔔</span>
          <span className="notification-badge">3</span>
        </button>

        <button className="topbar-profile">
          <div className="profile-avatar">DV</div>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
