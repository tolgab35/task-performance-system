import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import api from "../services/api";
import invitationService from "../services/invitationService";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Dashboard from "./Dashboard";
import TaskBoard from "./TaskBoard";
import Team from "./Team";
import Reports from "./Reports";

function MainLayout() {
  const [activeProject, setActiveProject] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [invitations, setInvitations] = useState([]);
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

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const data = await invitationService.getMyInvitations();
        setInvitations(data);
      } catch (error) {
        console.error("Davetler yüklenemedi:", error);
      }
    };

    fetchInvitations();
  }, []);

  const handleProjectCreated = async (newProject) => {
    // Yeni projeyi listeye ekle
    setUserProjects((prev) => [...prev, newProject]);
    // Yeni projeyi aktif yap
    setActiveProject(newProject);
  };

  const handleInvitationProcessed = (action, result) => {
    // Remove invitation from list
    setInvitations((prev) => prev.filter((inv) => inv._id !== result._id));

    // If accepted, add project to userProjects and set as active
    if (action === "accepted" && result.project) {
      const newProject = result.project;
      setUserProjects((prev) => {
        const exists = prev.some((p) => p._id === newProject._id);
        return exists ? prev : [...prev, newProject];
      });
      setActiveProject(newProject);
    }
  };

  return (
    <div className="app">
      <Sidebar />
      <TopBar
        userProjects={userProjects}
        activeProject={activeProject}
        onProjectChange={setActiveProject}
        onProjectCreated={handleProjectCreated}
        invitations={invitations}
        onInvitationProcessed={handleInvitationProcessed}
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
