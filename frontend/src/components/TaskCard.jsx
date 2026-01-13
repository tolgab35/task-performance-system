import "../styles/TaskCard.css";

const TaskCard = ({ task }) => {
  const priorityColors = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#6b7280",
  };

  const categoryColors = {
    design: "#8b5cf6",
    development: "#3b82f6",
    research: "#10b981",
    ideation: "#06b6d4",
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <span
          className="task-priority"
          style={{ backgroundColor: priorityColors[task.priority] }}
        >
          {task.priority}
        </span>
        <span
          className="task-category"
          style={{
            backgroundColor: `${categoryColors[task.category]}20`,
            color: categoryColors[task.category],
          }}
        >
          {task.category}
        </span>
      </div>

      <h3 className="task-title">{task.title}</h3>
      <p className="task-description">{task.description}</p>

      <div className="task-footer">
        <div className="task-assignee">
          <div className="assignee-avatar">{task.assignee.initials}</div>
          <span className="assignee-name">{task.assignee.name}</span>
        </div>

        <div className="task-meta">
          <span className="task-comments">💬 {task.comments}</span>
          <span className="task-attachments">📎 {task.attachments}</span>
        </div>
      </div>

      {task.dueDate && (
        <div className="task-date">
          <span>📅 {task.dueDate}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
