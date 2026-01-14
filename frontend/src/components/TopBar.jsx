import "../styles/TopBar.css";

const TopBar = ({ userProjects = [], activeProject, onProjectChange }) => {
  return (
    <div className="topbar">
      <div className="topbar-left">
        {userProjects.length > 0 && (
          <div className="project-tabs">
            {userProjects.map((project) => (
              <button
                key={project._id}
                className={`project-tab ${
                  activeProject?._id === project._id ? "active" : ""
                }`}
                onClick={() => onProjectChange(project)}
              >
                {project.name}
              </button>
            ))}
          </div>
        )}

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
