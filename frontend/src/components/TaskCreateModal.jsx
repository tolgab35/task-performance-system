import { useState, useEffect } from "react";
import { X } from "lucide-react";
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
      onClose();
    }
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
            <select
              id="assignedUser"
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
              disabled={loading}
            >
              <option value="">Atanmamış</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Aciliyet *</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={loading}
            >
              <option value="Low">Düşük</option>
              <option value="Medium">Orta</option>
              <option value="High">Yüksek</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">Task Türü *</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
            >
              <option value="Ideation">Fikir</option>
              <option value="Design">Tasarım</option>
              <option value="Research">Araştırma</option>
              <option value="Development">Geliştirme</option>
            </select>
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
