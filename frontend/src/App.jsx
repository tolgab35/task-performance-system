import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import TaskBoard from "./components/TaskBoard";
import Team from "./components/Team";
import Reports from "./components/Reports";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("tasks");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "tasks":
        return <TaskBoard />;
      case "team":
        return <Team />;
      case "reports":
        return <Reports />;
      default:
        return <TaskBoard />;
    }
  };

  return (
    <div className="app">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">{renderPage()}</main>
    </div>
  );
}

export default App;
