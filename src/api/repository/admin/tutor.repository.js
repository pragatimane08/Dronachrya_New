// src/api/repository/tutor.repository.js
import { apiClient } from "../../apiclient";

export const tutorRepository = {
  // ✅ Admin - Get all tutors
  getAllTutors: () => apiClient.get('admin/tutors'),

  // ✅ Admin - Update tutor status (approve/reject)
  updateTutorStatus: (user_id, status) =>
    apiClient.patch(`/admin/tutors/${user_id}/status`, { profile_status: status }),

  // ✅ Admin - Delete tutor (from users table)
  deleteTutor: (user_id) =>
    apiClient.delete(`/admin/users/${user_id}`),
  // Add to tutor.repository.js
createTutor: (tutorData) => apiClient.post('/admin/tutors', tutorData),

  // ✅ Admin - Get tutor's uploaded documents
  getTutorDocuments: (tutorId) =>
    apiClient.get(`/admin/tutors/${tutorId}/documents`),
  bulkUploadTutors: (formData) =>
    apiClient.post('/admin/tutors/bulk', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};
