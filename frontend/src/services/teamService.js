import api from './api';

export const teamService = {
  async getTeamMembers(projectId) {
    if (!projectId) {
      return [];
    }

    // Projeyi getir (members populate edilmiş olarak)
    const response = await api.get(`/projects/${projectId}`);
    const project = response.data.data;

    // Task'leri getir (görev sayısı hesaplamak için)
    const tasksResponse = await api.get('/tasks');
    const allTasks = tasksResponse.data.data;

    // Proje üyelerini formatla
    const teamMembers = project.members.map(member => {
      // Bu üyeye atanmış ve bu projedeki task sayısı
      const memberTasks = allTasks.filter(
        task => 
          (task.assignedUser?._id === member._id || task.assignedUser === member._id) &&
          (task.projectId?._id === projectId || task.projectId === projectId)
      );

      return {
        id: member._id,
        name: member.name,
        email: member.email,
        tasksCount: memberTasks.length,
      };
    });

    return teamMembers;
  },
};
