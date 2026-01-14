import { useState } from "react";
import "../styles/TaskCard.css";

const TaskCard = ({ task, onStatusChange }) => {
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Bugün";
    if (diffDays === 1) return "Dün";
    if (diffDays < 7) return `${diffDays} gün önce`;

    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
    });
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === task.status) return;

    setIsChangingStatus(true);
    try {
      await onStatusChange(task._id, newStatus);
    } catch (error) {
      console.error("Status değiştirme hatası:", error);
    } finally {
      setIsChangingStatus(false);
    }
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <div className="task-badges">
          <span className={`task-priority priority-${task.priority?.toLowerCase() || 'medium'}`}>
            {task.priority === 'Low' ? 'Düşük' : task.priority === 'Medium' ? 'Orta' : task.priority === 'High' ? 'Yüksek' : 'Orta'}
          </span>
          <span className={`task-category category-${task.category?.toLowerCase() || 'development'}`}>
            {task.category === 'Ideation' ? 'Fikir' : task.category === 'Design' ? 'Tasarım' : task.category === 'Research' ? 'Araştırma' : task.category === 'Development' ? 'Geliştirme' : 'Geliştirme'}
          </span>
        </div>
        <select
          className="task-status-select"
          value={task.status}
          onChange={handleStatusChange}
          disabled={isChangingStatus}
        >
          <option value="To Do">Yapılacak</option>
          <option value="In Progress">Devam Ediyor</option>
          <option value="Done">Tamamlandı</option>
        </select>
      </div>

      <h3 className="task-title">{task.title}</h3>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-footer">
        <div className="task-assignee">
          <div className="assignee-avatar">
            {task.assignedUser
              ? getInitials(task.assignedUser.name)
              : "?"}
          </div>
          <span className="assignee-name">
            {task.assignedUser?.name || "Atanmamış"}
          </span>
        </div>

        <div className="task-date">
          <span>{formatDate(task.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
