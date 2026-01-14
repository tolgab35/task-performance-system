import api from "./api";

export const taskService = {
  /**
   * Proje task'lerini getir
   * GET /api/tasks?projectId=xxx
   */
  async getTasksByProject(projectId) {
    const response = await api.get(`/tasks?projectId=${projectId}`);
    return response.data.data;
  },

  /**
   * Yeni task oluştur
   * POST /api/tasks
   */
  async createTask(taskData) {
    const response = await api.post("/tasks", taskData);
    return response.data.data;
  },

  /**
   * Task status güncelle
   * PUT /api/tasks/:id
   */
  async updateTaskStatus(taskId, status) {
    const response = await api.put(`/tasks/${taskId}`, { status });
    return response.data.data;
  },

  /**
   * Task güncelle (tüm alanlar)
   * PUT /api/tasks/:id
   */
  async updateTask(taskId, taskData) {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data.data;
  },
};
