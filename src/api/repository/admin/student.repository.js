// src/api/repository/student.repository.js
// import { apiClient } from "../../apiclient";

// export const studentRepository = {
//   // Get all students
//   getAllStudents: () => apiClient.get('/admin/students'),

//   // Update student status (e.g., approve, reject)
//   updateStudentStatus: (user_id, status) =>
//     apiClient.patch(`/admin/students/${user_id}/status`, { profile_status: status }),

//   // Delete student (from users table)
//   deleteStudent: (user_id) =>
//     apiClient.delete(`/admin/users/${user_id}`),

//   // Update student details (name, class, subjects, etc.)
//   updateStudent: (user_id, data) =>
//     apiClient.put(`/admin/students/${user_id}`, data),
// };

// src/api/repository/student.repository.js
import { apiClient } from "../../apiclient";

export const studentRepository = {
  // Get all students
  getAllStudents: () => apiClient.get("/admin/students"),

  // Update student status (e.g., approve, reject)
  updateStudentStatus: (user_id, status) =>
    apiClient.patch(`/admin/students/${user_id}/status`, { profile_status: status }),

  // FIXED: Use the correct endpoint that matches your backend
  deleteStudent: (user_id) => apiClient.delete(`/admin/users/${user_id}`),

  // Update student details (name, class, subjects, etc.)
  updateStudent: (user_id, data) =>
    apiClient.put(`/admin/students/${user_id}`, data),
};
