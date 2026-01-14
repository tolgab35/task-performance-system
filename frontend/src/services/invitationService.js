import api from "./api";

export const invitationService = {
  // Send invitation to email for project
  sendInvitation: async (email, projectId) => {
    const response = await api.post("/invitations", { email, projectId });
    return response.data;
  },

  // Get user's pending invitations
  getMyInvitations: async () => {
    const response = await api.get("/invitations/my");
    return response.data;
  },

  // Accept invitation
  acceptInvitation: async (invitationId) => {
    const response = await api.post(`/invitations/${invitationId}/accept`);
    return response.data;
  },

  // Reject invitation
  rejectInvitation: async (invitationId) => {
    const response = await api.post(`/invitations/${invitationId}/reject`);
    return response.data;
  },
};

export default invitationService;
