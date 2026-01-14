import api from "./api";

export const dashboardService = {
  async getDashboardStats(projectId) {
    if (!projectId) {
      return {
        totalTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
        teamMembers: 0,
        projectProgress: [],
      };
    }

    const [tasksRes, projectRes] = await Promise.all([
      api.get("/tasks"),
      api.get(`/projects/${projectId}`),
    ]);

    const allTasks = tasksRes.data.data;
    const project = projectRes.data.data;

    // Sadece seçili projeye ait task'leri filtrele
    const projectTasks = allTasks.filter(
      (t) => t.projectId?._id === projectId || t.projectId === projectId
    );

    // Task istatistikleri (sadece bu proje için)
    const totalTasks = projectTasks.length;
    const inProgressTasks = projectTasks.filter(
      (t) => t.status === "In Progress"
    ).length;
    const completedTasks = projectTasks.filter(
      (t) => t.status === "Done"
    ).length;

    // Takım üyesi sayısı (sadece bu projenin üyeleri)
    const teamMembers = project.members?.length || 0;

    // Proje ilerlemesi (sadece bu proje)
    const progress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const projectProgress = [
      {
        id: project._id,
        name: project.name,
        progress,
      },
    ];

    return {
      totalTasks,
      inProgressTasks,
      completedTasks,
      teamMembers,
      projectProgress,
    };
  },
};
