// api/repository/admin/dashboard.repository.js
import { apiClient } from "../../apiclient"; // Adjust this if needed

export const getDashboardSummary = async () => {
  const response = await apiClient.get("/admin/dashboard-summary");
  return response.data;
};