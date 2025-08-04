// src/features/verifications/VerificationService.js
import { apiClient } from "../../apiclient";

// ✅ Helper to attach token manually
const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ Fetch all pending verifications
export const getAllVerifications = async () => {
  const response = await apiClient.get("/admin/pending-verifications", getAuthHeader());
  return response.data;
};

// ✅ Approve a user by ID
export const approveUser = async (userId) => {
  return await apiClient.patch(
    `/admin/user/${userId}`,
    { profile_status: "approved" },
    getAuthHeader()
  );
};

// ✅ Reject a user by ID
export const rejectUser = async (userId) => {
  return await apiClient.patch(
    `/admin/user/${userId}`,
    { profile_status: "rejected" },
    getAuthHeader()
  );
};

// ✅ Delete a user by ID
export const deleteUser = async (userId) => {
  return await apiClient.delete(`/admin/user/${userId}`, getAuthHeader());
};
