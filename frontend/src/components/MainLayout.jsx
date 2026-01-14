import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Dashboard from "./Dashboard";
import TaskBoard from "./TaskBoard";
import Team from "./Team";
import Reports from "./Reports";

function MainLayout() {
  const [activeProject, setActiveProject] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const response = await api.get("/projects");
        const projects = response.data.data;
        setUserProjects(projects);

        // Varsayılan aktif proje: kullanıcının dahil olduğu ilk proje
        if (projects.length > 0) {
          setActiveProject(projects[0]);
        }
      } catch (error) {
        console.error("Projeler yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProjects();
  }, []);

  return (
    <div className="app">
      <Sidebar />
      <TopBar
        userProjects={userProjects}
        activeProject={activeProject}
        onProjectChange={setActiveProject}
      />
      <main className="main-content">
        {loading ? (
          <div style={{ padding: "20px" }}>Yükleniyor...</div>
        ) : (
          <Routes>
            <Route
              path="/dashboard"
              element={<Dashboard activeProject={activeProject} />}
            />
            <Route path="/tasks" element={<TaskBoard />} />
            <Route 
              path="/team" 
              element={<Team activeProject={activeProject} />} 
            />
            <Route path="/reports" element={<Reports />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default MainLayout;
