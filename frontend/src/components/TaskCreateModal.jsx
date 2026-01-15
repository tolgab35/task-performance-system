import { useState, useEffect } from "react";
import { X, ChevronDown, User, AlertCircle, Zap } from "lucide-react";
import { taskService } from "../services/taskService";
import { teamService } from "../services/teamService";
import "../styles/Modal.css";

const TaskCreateModal = ({ isOpen, onClose, projectId, onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Development");
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!isOpen || !projectId) return;

      try {
        const members = await teamService.getTeamMembers(projectId);
        setTeamMembers(members);
      } catch (err) {
        console.error("Takım üyeleri yüklenemedi:", err);
      }
    };

    fetchTeamMembers();
  }, [isOpen, projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Task başlığı zorunludur");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const taskData = {
        title,
        description,
        projectId,
        assignedUser: assignedUser || undefined,
        priority,
        category,
      };

      const newTask = await taskService.createTask(taskData);
      onTaskCreated(newTask);
      setTitle("");
      setDescription("");
      setAssignedUser("");
      setPriority("Medium");
      setCategory("Development");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Task oluşturulamadı");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setTitle("");
      setDescription("");
      setAssignedUser("");
      setPriority("Medium");
      setCategory("Development");
      setError("");
      setOpenDropdown(null);
      onClose();
    }
  };

  const priorityOptions = [
    { value: "Low", label: "Düşük", color: "#36B37E" },
    { value: "Medium", label: "Orta", color: "#FF991F" },
    { value: "High", label: "Yüksek", color: "#DE350B" },
  ];

  const categoryOptions = [
    { value: "Ideation", label: "Fikir", icon: "💡" },
    { value: "Design", label: "Tasarım", icon: "🎨" },
    { value: "Research", label: "Araştırma", icon: "🔍" },
    { value: "Development", label: "Geliştirme", icon: "⚙️" },
  ];

  const getAssignedUserName = () => {
    if (!assignedUser) return "Atanmamış";
    const member = teamMembers.find((m) => m.id === assignedUser);
    return member?.name || "Atanmamış";
  };

  const getPriorityLabel = () => {
    return priorityOptions.find((p) => p.value === priority)?.label || priority;
  };

  const getCategoryLabel = () => {
    return categoryOptions.find((c) => c.value === category)?.label || category;
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Yeni Task Oluştur</h2>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={loading}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="title">Task Başlığı *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Backend API geliştirme"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Açıklama</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task hakkında detaylar..."
              rows="4"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="assignedUser">Atanacak Kişi (Opsiyonel)</label>
            <div className="custom-select">
              <button
                type="button"
                className="select-button"
                onClick={() => toggleDropdown("assignedUser")}
                disabled={loading}
              >
                <div className="select-value">
                  <User size={16} />
                  <span>{getAssignedUserName()}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={openDropdown === "assignedUser" ? "rotate" : ""}
                />
              </button>
              {openDropdown === "assignedUser" && (
                <div className="select-dropdown">
                  <div
                    className="select-option"
                    onClick={() => {
                      setAssignedUser("");
                      setOpenDropdown(null);
                    }}
                  >
                    <User size={16} />
                    <span>Atanmamış</span>
                  </div>
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className={`select-option ${
                        assignedUser === member.id ? "selected" : ""
                      }`}
                      onClick={() => {
                        setAssignedUser(member.id);
                        setOpenDropdown(null);
                      }}
                    >
                      <div className="member-avatar-small">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span>{member.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Aciliyet *</label>
            <div className="custom-select">
              <button
                type="button"
                className="select-button"
                onClick={() => toggleDropdown("priority")}
                disabled={loading}
              >
                <div className="select-value">
                  <Zap size={16} />
                  <span>{getPriorityLabel()}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={openDropdown === "priority" ? "rotate" : ""}
                />
              </button>
              {openDropdown === "priority" && (
                <div className="select-dropdown">
                  {priorityOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`select-option ${
                        priority === option.value ? "selected" : ""
                      }`}
                      onClick={() => {
                        setPriority(option.value);
                        setOpenDropdown(null);
                      }}
                    >
                      <div
                        className="priority-dot"
                        style={{ backgroundColor: option.color }}
                      />
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Task Türü *</label>
            <div className="custom-select">
              <button
                type="button"
                className="select-button"
                onClick={() => toggleDropdown("category")}
                disabled={loading}
              >
                <div className="select-value">
                  <AlertCircle size={16} />
                  <span>{getCategoryLabel()}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={openDropdown === "category" ? "rotate" : ""}
                />
              </button>
              {openDropdown === "category" && (
                <div className="select-dropdown">
                  {categoryOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`select-option ${
                        category === option.value ? "selected" : ""
                      }`}
                      onClick={() => {
                        setCategory(option.value);
                        setOpenDropdown(null);
                      }}
                    >
                      <span className="category-icon">{option.icon}</span>
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-outline"
              onClick={handleClose}
              disabled={loading}
            >
              İptal
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Oluşturuluyor..." : "Task Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreateModal;
