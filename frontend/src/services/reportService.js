import api from "./api";

export const reportService = {
  /**
   * Proje bazlı detaylı rapor al
   */
  async getProjectReport(projectId) {
    const response = await api.get(`/reports/project/${projectId}`);
    return response.data.data;
  },

  /**
   * Genel kullanıcı raporu (tüm projeler özeti)
   */
  async getOverviewReport() {
    const response = await api.get("/reports/overview");
    return response.data.data;
  },
};
