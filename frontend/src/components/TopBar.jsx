import { useState } from "react";
import { Plus, Search, Bell } from "lucide-react";
import ProjectCreateModal from "./ProjectCreateModal";
import NotificationPanel from "./NotificationPanel";
import "../styles/TopBar.css";

const TopBar = ({
  userProjects = [],
  activeProject,
  onProjectChange,
  onProjectCreated,
  invitations = [],
  onInvitationProcessed,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

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
              <Plus size={16} />
              <span>Proje Oluştur</span>
            </button>
          </div>

          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Görev ara"
              className="search-input"
            />
            <span className="search-shortcut">⌘ K</span>
          </div>
        </div>

        <div className="topbar-right">
          <div className="notification-container">
            <button
              className="topbar-icon notification-btn"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <Bell size={18} />
              {invitations.length > 0 && (
                <span className="notification-badge">{invitations.length}</span>
              )}
            </button>

            {isNotificationOpen && (
              <NotificationPanel
                invitations={invitations}
                onClose={() => setIsNotificationOpen(false)}
                onInvitationProcessed={(action, invitation) => {
                  onInvitationProcessed(action, invitation);
                  setIsNotificationOpen(false);
                }}
              />
            )}
          </div>

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
