import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import TaskCreateModal from "./TaskCreateModal";
import { taskService } from "../services/taskService";
import { useAuth } from "../context/useAuth";
import "../styles/TaskBoard.css";

const TaskBoard = ({ activeProject, onInviteClick }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!activeProject) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await taskService.getTasksByProject(activeProject._id);
        setTasks(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Task'ler yüklenemedi");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [activeProject]);

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updatedTask = await taskService.updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map((t) => (t._id === taskId ? updatedTask : t)));
    } catch (err) {
      alert(err.response?.data?.message || "Status güncellenemedi");
    }
  };

  const handleAddTask = (status) => {
    setSelectedColumn(status);
    setIsModalOpen(true);
  };

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
    setSelectedColumn(null);
  };

  const columns = [
    {
      id: "To Do",
      title: "To Do",
      count: getTasksByStatus("To Do").length,
    },
    {
      id: "In Progress",
      title: "In Progress",
      count: getTasksByStatus("In Progress").length,
    },
    {
      id: "Done",
      title: "Done",
      count: getTasksByStatus("Done").length,
    },
  ];

  if (!activeProject) {
    return (
      <div className="task-board">
        <div className="board-header">
          <h1 className="board-title">TaskBoard</h1>
          <p className="subtitle">Lütfen bir proje seçin.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="task-board">
        <div className="board-header">
          <h1 className="board-title">{activeProject.name}</h1>
          <p className="subtitle">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-board">
        <div className="board-header">
          <h1 className="board-title">{activeProject.name}</h1>
          <p className="subtitle" style={{ color: "#ef4444" }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-board">
      <div className="board-header">
        <h1 className="board-title">{activeProject.name}</h1>
        <div className="board-actions">
          <div className="team-avatars">
            <div className="avatar avatar-1">AY</div>
            <div className="avatar avatar-2">AD</div>
            <div className="avatar avatar-3">MK</div>
            <div className="avatar avatar-4">+5</div>
          </div>
          {user && activeProject.createdBy === user.id && (
            <button className="btn-secondary" onClick={onInviteClick}>
              Invite
            </button>
          )}
          <button
            className="btn-primary"
            onClick={() => handleAddTask("To Do")}
          >
            <Plus size={16} />
            <span>Add New Task</span>
          </button>
        </div>
      </div>

      <div className="board-tabs">
        <button className="tab">Overview</button>
        <button className="tab tab-active">Board View</button>
        <button className="tab">Timeline</button>
        <button className="tab">Table</button>
      </div>

      <div className="board-columns">
        {columns.map((column) => (
          <div key={column.id} className="board-column">
            <div className="column-header">
              <h2 className="column-title">
                {column.title}
                <span className="column-count">{column.count}</span>
              </h2>
              <button className="column-menu">⋯</button>
            </div>

            <div className="column-tasks">
              {getTasksByStatus(column.id).map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>

            <button
              className="add-task-btn"
              onClick={() => handleAddTask(column.id)}
            >
              + Add New
            </button>
          </div>
        ))}
      </div>

      <TaskCreateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedColumn(null);
        }}
        projectId={activeProject._id}
        initialStatus={selectedColumn}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
};

export default TaskBoard;
