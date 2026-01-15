import { useState } from "react";
import { Trash2 } from "lucide-react";
import "../styles/TaskCard.css";

const TaskCard = ({ task, onStatusChange, onDelete, isDragging = false }) => {
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Workflow kuralları: İzin verilen geçişler
  const allowedTransitions = {
    "To Do": ["In Progress"],
    "In Progress": ["Done"],
    Done: [], // Done'dan başka duruma geçilemez
  };

  const getAvailableStatuses = () => {
    const current = task.status;
    const allowed = allowedTransitions[current] || [];
    return [current, ...allowed];
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Tarih yok";

    const date = new Date(dateString);
    const now = new Date();

    // Gün başlangıçlarına göre hesapla
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = nowOnly.getTime() - dateOnly.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Bugün";
    if (diffDays === 1) return "Dün";
    if (diffDays > 1 && diffDays < 7) return `${diffDays} gün önce`;
    if (diffDays >= 7 && diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? "1 hafta önce" : `${weeks} hafta önce`;
    }

    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: diffDays > 365 ? "numeric" : undefined,
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

  const handleDelete = async (e) => {
    e.stopPropagation();

    if (
      !window.confirm(
        `"${task.title}" görevini silmek istediğinize emin misiniz?`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(task._id);
    } catch (error) {
      console.error("Task silme hatası:", error);
      alert("Task silinirken bir hata oluştu");
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`task-card ${isDragging ? "dragging" : ""} ${
        isDeleting ? "deleting" : ""
      }`}
    >
      <div className="task-header">
        <div className="task-badges">
          <span
            className={`task-priority priority-${
              task.priority?.toLowerCase() || "medium"
            }`}
          >
            {task.priority === "Low"
              ? "Düşük"
              : task.priority === "Medium"
              ? "Orta"
              : task.priority === "High"
              ? "Yüksek"
              : "Orta"}
          </span>
          <span
            className={`task-category category-${
              task.category?.toLowerCase() || "development"
            }`}
          >
            {task.category === "Ideation"
              ? "Fikir"
              : task.category === "Design"
              ? "Tasarım"
              : task.category === "Research"
              ? "Araştırma"
              : task.category === "Development"
              ? "Geliştirme"
              : "Geliştirme"}
          </span>
          <button
            className="task-delete-btn"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Görevi sil"
          >
            <Trash2 size={14} />
          </button>
        </div>
        <select
          className="task-status-select"
          value={task.status}
          onChange={handleStatusChange}
          disabled={isChangingStatus || task.status === "Done"}
        >
          {getAvailableStatuses().includes("To Do") && (
            <option value="To Do">Yapılacak</option>
          )}
          {getAvailableStatuses().includes("In Progress") && (
            <option value="In Progress">Devam Ediyor</option>
          )}
          {getAvailableStatuses().includes("Done") && (
            <option value="Done">Tamamlandı</option>
          )}
        </select>
      </div>

      <h3 className="task-title">{task.title}</h3>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-footer">
        <div className="task-assignee">
          <div className="assignee-avatar">
            {task.assignedUser ? getInitials(task.assignedUser.name) : "?"}
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
