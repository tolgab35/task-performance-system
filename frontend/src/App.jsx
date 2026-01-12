import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Task Performance System</h1>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div>
          {tasks.map((task) => (
            <p key={task.id}>
              <strong>ID:</strong> {task.id} <br />
              <strong>Task:</strong> {task.title} <br />
              <strong>Status:</strong> {task.status}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
