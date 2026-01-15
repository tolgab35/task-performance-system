import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
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
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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

  // Workflow kuralları: İzin verilen geçişler
  const allowedTransitions = {
    "To Do": ["In Progress"],
    "In Progress": ["Done"],
    Done: [], // Done'dan başka duruma geçilemez
  };

  const isTransitionAllowed = (fromStatus, toStatus) => {
    if (fromStatus === toStatus) return true; // Aynı kolon içinde sıralama her zaman ok
    return allowedTransitions[fromStatus]?.includes(toStatus) || false;
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    // Workflow kontrolü
    if (!isTransitionAllowed(task.status, newStatus)) {
      alert(
        `"${task.status}" durumundan "${newStatus}" durumuna geçiş yapılamaz.`
      );
      return;
    }

    try {
      const updatedTask = await taskService.updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map((t) => (t._id === taskId ? updatedTask : t)));
    } catch (err) {
      alert(err.response?.data?.message || "Status güncellenemedi");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Task silme hatası:", err);
      throw err;
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t._id === active.id);
    setActiveTask(task);
    // Sürükleme başladığındaki orijinal status'u kaydet
    if (task) {
      task._originalStatus = task.status;
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t._id === activeId);
    const overTask = tasks.find((t) => t._id === overId);

    if (!activeTask) return;

    // Eğer over bir task ise (aynı veya farklı kolonda)
    if (overTask) {
      const activeStatus = activeTask.status;
      const overStatus = overTask.status;

      // Farklı kolonlar arası taşıma
      if (activeStatus !== overStatus) {
        // Workflow kontrolü - izin verilmeyen geçişte UI güncellemesi yapma
        if (!isTransitionAllowed(activeStatus, overStatus)) {
          return;
        }

        setTasks((tasks) => {
          const activeIndex = tasks.findIndex((t) => t._id === activeId);
          const overIndex = tasks.findIndex((t) => t._id === overId);

          // Aktif task'in status'unu değiştir
          const updatedTasks = tasks.map((task) =>
            task._id === activeId ? { ...task, status: overStatus } : task
          );

          // Yeni sıraya göre arrange et
          return arrayMove(updatedTasks, activeIndex, overIndex);
        });
      } else {
        // Aynı kolon içinde sıralama
        setTasks((tasks) => {
          const oldIndex = tasks.findIndex((t) => t._id === activeId);
          const newIndex = tasks.findIndex((t) => t._id === overId);

          return arrayMove(tasks, oldIndex, newIndex);
        });
      }
    } else if (["To Do", "In Progress", "Done"].includes(overId)) {
      // Kolon header'ına veya boş alana bırakma
      const activeStatus = activeTask.status;

      if (activeStatus !== overId) {
        // Workflow kontrolü - izin verilmeyen geçişte UI güncellemesi yapma
        if (!isTransitionAllowed(activeStatus, overId)) {
          return;
        }

        setTasks((tasks) =>
          tasks.map((task) =>
            task._id === activeId ? { ...task, status: overId } : task
          )
        );
      }
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    const originalStatus = activeTask?._originalStatus || activeTask?.status;
    setActiveTask(null);

    if (!over) {
      // Bırakma iptal edildi, orijinal duruma döndür
      if (originalStatus) {
        setTasks((tasks) =>
          tasks.map((t) =>
            t._id === active.id ? { ...t, status: originalStatus } : t
          )
        );
      }
      return;
    }

    const taskId = active.id;
    const task = tasks.find((t) => t._id === taskId);

    if (!task) return;

    const overTask = tasks.find((t) => t._id === over.id);
    const newStatus = overTask ? overTask.status : over.id;

    // Status değişikliği varsa backend'e gönder
    if (["To Do", "In Progress", "Done"].includes(newStatus)) {
      const oldStatus = originalStatus || task.status;

      if (oldStatus !== newStatus) {
        // Workflow kontrolü
        if (!isTransitionAllowed(oldStatus, newStatus)) {
          // İzin verilmeyen geçiş, orijinal duruma döndür
          setTasks((tasks) =>
            tasks.map((t) =>
              t._id === taskId ? { ...t, status: oldStatus } : t
            )
          );
          return;
        }

        try {
          const updatedTask = await taskService.updateTaskStatus(
            taskId,
            newStatus
          );
          // Backend'den gelen güncel task ile güncelle
          setTasks((tasks) =>
            tasks.map((t) => (t._id === taskId ? updatedTask : t))
          );
        } catch (err) {
          // Hata durumunda orijinal duruma geri al
          setTasks((tasks) =>
            tasks.map((t) =>
              t._id === taskId ? { ...t, status: oldStatus } : t
            )
          );
          alert(err.response?.data?.message || "Status güncellenemedi");
        }
      }
    }
  };

  const handleDragCancel = () => {
    // İptal edildiğinde orijinal duruma döndür
    if (activeTask && activeTask._originalStatus) {
      setTasks((tasks) =>
        tasks.map((t) =>
          t._id === activeTask._id
            ? { ...t, status: activeTask._originalStatus }
            : t
        )
      );
    }
    setActiveTask(null);
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
      title: "Yapılacak",
      count: getTasksByStatus("To Do").length,
    },
    {
      id: "In Progress",
      title: "Devam Ediyor",
      count: getTasksByStatus("In Progress").length,
    },
    {
      id: "Done",
      title: "Tamamlandı",
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

  // Takım üyelerinin avatarlarını oluştur
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const renderTeamAvatars = () => {
    if (!activeProject.members || activeProject.members.length === 0) {
      return null;
    }

    const maxVisible = 4;
    const visibleMembers = activeProject.members.slice(0, maxVisible);
    const remainingCount = activeProject.members.length - maxVisible;

    return (
      <div className="team-avatars">
        {visibleMembers.map((member, index) => (
          <div
            key={member._id}
            className={`avatar avatar-${(index % 4) + 1}`}
            title={member.name}
          >
            {getInitials(member.name)}
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="avatar avatar-4" title={`${remainingCount} kişi daha`}>
            +{remainingCount}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="task-board">
      <div className="board-header">
        <h1 className="board-title">{activeProject.name}</h1>
        <div className="board-actions">
          {renderTeamAvatars()}
          {user &&
            activeProject.createdBy &&
            (activeProject.createdBy === user._id ||
              activeProject.createdBy._id === user._id) && (
              <button className="btn-secondary" onClick={onInviteClick}>
                Davet Et
              </button>
            )}
          <button
            className="btn-primary"
            onClick={() => handleAddTask("To Do")}
          >
            <Plus size={16} />
            <span>Yeni Görev Ekle</span>
          </button>
        </div>
      </div>

      <div className="board-tabs">
        <button className="tab">Genel Bakış</button>
        <button className="tab tab-active">Tahta Görünümü</button>
        <button className="tab">Zaman Çizelgesi</button>
        <button className="tab">Tablo</button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="board-columns">
          {columns.map((column) => (
            <DroppableColumn
              key={column.id}
              column={column}
              tasks={getTasksByStatus(column.id)}
              onAddTask={handleAddTask}
              onStatusChange={handleStatusChange}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              onStatusChange={() => {}}
              onDelete={() => {}}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>

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

// Droppable Column Component
function DroppableColumn({
  column,
  tasks,
  onAddTask,
  onStatusChange,
  onDeleteTask,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`board-column ${isOver ? "drag-over" : ""}`}
    >
      <div className="column-header">
        <h2 className="column-title">
          {column.title}
          <span className="column-count">{column.count}</span>
        </h2>
        <button className="column-menu">⋯</button>
      </div>

      <SortableContext
        items={tasks.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="column-tasks">
          {tasks.map((task) => (
            <SortableTaskCard
              key={task._id}
              task={task}
              onStatusChange={onStatusChange}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      </SortableContext>

      <button className="add-task-btn" onClick={() => onAddTask(column.id)}>
        + Yeni Ekle
      </button>
    </div>
  );
}

// Sortable Task Card Wrapper
function SortableTaskCard({ task, onStatusChange, onDeleteTask }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        onStatusChange={onStatusChange}
        onDelete={onDeleteTask}
      />
    </div>
  );
}

export default TaskBoard;
