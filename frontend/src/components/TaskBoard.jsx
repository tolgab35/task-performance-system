import TaskCard from "./TaskCard";
import "../styles/TaskBoard.css";

const TaskBoard = () => {
  const columns = [
    {
      id: "todo",
      title: "To Do",
      count: 3,
      tasks: [
        {
          id: 1,
          title: "Review & Feedback",
          description:
            "Review and feedback from all related parties improve the ux of application",
          priority: "low",
          category: "ideation",
          assignee: { name: "Ali Yılmaz", initials: "AY" },
          comments: 4,
          attachments: 2,
          dueDate: "May 11",
        },
        {
          id: 2,
          title: "Design App",
          description:
            "Design the high fidelity of the application according to the wireframe",
          priority: "high",
          category: "design",
          assignee: { name: "Ayşe Demir", initials: "AD" },
          comments: 4,
          attachments: 2,
          dueDate: "May 11",
        },
        {
          id: 3,
          title: "Backend API Development",
          description:
            "Create REST API endpoints for user authentication and data management",
          priority: "low",
          category: "development",
          assignee: { name: "Mehmet Kaya", initials: "MK" },
          comments: 2,
          attachments: 1,
          dueDate: "May 13",
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      count: 2,
      tasks: [
        {
          id: 4,
          title: "Interview & Prototyping",
          description:
            "Do user interviews for several hours with several users who meet the criteria",
          priority: "high",
          category: "design",
          assignee: { name: "Zeynep Çelik", initials: "ZÇ" },
          comments: 4,
          attachments: 2,
          dueDate: "May 11",
        },
        {
          id: 5,
          title: "UX Copy & Content",
          description: "Design UX copy for all designed wireframe sections",
          priority: "medium",
          category: "research",
          assignee: { name: "Can Öztürk", initials: "CÖ" },
          comments: 4,
          attachments: 2,
          dueDate: "May 11",
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      count: 3,
      tasks: [
        {
          id: 6,
          title: "Flow Identification",
          description:
            "Identify the application flow for the sections mentioned below",
          priority: "high",
          category: "ideation",
          assignee: { name: "Fatma Şahin", initials: "FŞ" },
          comments: 4,
          attachments: 2,
          dueDate: "May 11",
        },
        {
          id: 7,
          title: "Create Wireframe",
          description:
            "Create multiple different wireframe options for the same section",
          priority: "low",
          category: "research",
          assignee: { name: "Ahmet Yıldız", initials: "AY" },
          comments: 4,
          attachments: 2,
          dueDate: "May 11",
        },
        {
          id: 8,
          title: "Database Design",
          description: "Design the database schema and relationships",
          priority: "medium",
          category: "development",
          assignee: { name: "Elif Arslan", initials: "EA" },
          comments: 3,
          attachments: 1,
          dueDate: "May 10",
        },
      ],
    },
  ];

  return (
    <div className="task-board">
      <div className="board-header">
        <h1 className="board-title">CRM Dashboard | Supplier Management</h1>
        <div className="board-actions">
          <div className="team-avatars">
            <div className="avatar avatar-1">AY</div>
            <div className="avatar avatar-2">AD</div>
            <div className="avatar avatar-3">MK</div>
            <div className="avatar avatar-4">+5</div>
          </div>
          <button className="btn-secondary">Invite</button>
          <button className="btn-primary">+ Add New Task</button>
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
              {column.tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>

            <button className="add-task-btn">+ Add New</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
