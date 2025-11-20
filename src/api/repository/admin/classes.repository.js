import { apiClient } from "../../apiclient";
import { apiUrl } from "../../apiUtl";

export const groupRepository = {
  // ✅ Fetch all groups (admin)
  getAllGroups: async () => {
    try {
      const res = await apiClient.get(apiUrl.groups.getAll);
      return res.data.groups || [];
    } catch (error) {
      console.error("Error fetching groups:", error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Fetch classes for a specific group
  getGroupClasses: async (groupId) => {
    try {
      const res = await apiClient.get(apiUrl.groups.getClasses(groupId));
      return res.data.classes || [];
    } catch (error) {
      console.error("Error fetching group classes:", error.response?.data || error.message);
      throw error;
    }
  },
};