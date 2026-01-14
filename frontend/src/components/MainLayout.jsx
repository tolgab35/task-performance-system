import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Dashboard from "./Dashboard";
import TaskBoard from "./TaskBoard";
import Team from "./Team";
import Reports from "./Reports";

function MainLayout() {
  return (
    <div className="app">
      <Sidebar />
      <TopBar />
      <main className="main-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<TaskBoard />} />
          <Route path="/team" element={<Team />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default MainLayout;
