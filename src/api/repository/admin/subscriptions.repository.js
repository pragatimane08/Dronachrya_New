// src/api/repository/admin/subscriptions.repository.js
import { apiClient } from "../../apiclient";

export const subscriptionRepository = {
  // ✅ Admin - Fetch all subscriptions (users subscribed)
  getAllSubscriptions: (token) =>
    apiClient.get("/admin/subscriptions", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // ✅ Admin - Fetch all subscription plans
  getAllPlans: (token) =>
    apiClient.get("/admin/subscriptions/plans", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // ✅ Admin - Create a new subscription plan
  createPlan: (payload, token) =>
    apiClient.post("/admin/subscriptions/plans", payload, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // ✅ Admin - Update a subscription plan by ID
  updatePlan: (id, payload, token) =>
    apiClient.put(`/admin/subscriptions/plans/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // ✅ Admin - Delete a subscription plan by ID
  deletePlan: (id, token) =>
    apiClient.delete(`/admin/subscriptions/plans/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // ✅ Admin - Update subscription status (activate/deactivate)
  updateStatus: (id, payload, token) =>
    apiClient.put(
      `/admin/subscriptions/status`,
      { id, ...payload },
      { headers: { Authorization: `Bearer ${token}` } }
    ),

  // ✅ Tutor - Fetch tutor subscriptions
  getTutorSubscriptions: (token) =>
    apiClient.get("/subscriptions/tutor", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // ✅ Student - Fetch student subscriptions
  getStudentSubscriptions: (token) =>
    apiClient.get("/subscriptions/student", {
      headers: { Authorization: `Bearer ${token}` },
    }),
};
