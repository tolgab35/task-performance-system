import api from "./api";

export const projectService = {
  async createProject(name, description) {
    const response = await api.post("/projects", { name, description });
    return response.data;
  },
};
