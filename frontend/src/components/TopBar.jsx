import { useState } from "react";
import ProjectCreateModal from "./ProjectCreateModal";
import "../styles/TopBar.css";

const TopBar = ({ userProjects = [], activeProject, onProjectChange, onProjectCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = () => {
    setIsModalOpen(true);
  };

  const handleProjectCreated = (newProject) => {
    if (onProjectCreated) {
      onProjectCreated(newProject);
    }
  };

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
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
            <button 
              className="project-tab create-project-btn" 
              onClick={handleCreateProject}
            >
              + Proje Oluştur
            </button>
          </div>

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

      <ProjectCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </>
  );
};

export default TopBar;
