// // src/api/repository/student.repository.js
// import { apiClient } from "../../apiclient";

// export const studentRepository = {
//   // Get all students
//   getAllStudents: () => apiClient.get("/admin/students"),

//   // Create new student with proper data structure
//   createStudent: (studentData) => 
//     apiClient.post("/admin/students", studentData),

//   // Update student status
//   updateStudentStatus: (user_id, status) =>
//     apiClient.patch(`/admin/students/${user_id}/status`, { profile_status: status }),

//   // Delete student
//   deleteStudent: (user_id) => apiClient.delete(`/admin/users/${user_id}`),

//   // Update student details
//   updateStudent: (user_id, data) =>
//     apiClient.put(`/admin/students/${user_id}`, data),

//   // Bulk upload students
//   bulkUploadStudents: (formData) => 
//     apiClient.post("/admin/students/bulk-upload", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     }),
// };

// src/api/repository/student.repository.js
import { apiClient } from "../../apiclient";

export const studentRepository = {
  // Get all students
  getAllStudents: () => apiClient.get("/admin/students"),

  // Create new student with proper data structure
  createStudent: (studentData) => 
    apiClient.post("/admin/students", studentData),

  // Update student status
  updateStudentStatus: (user_id, status) =>
    apiClient.patch(`/admin/students/${user_id}/status`, { profile_status: status }),

  // Delete student
  deleteStudent: (user_id) => apiClient.delete(`/admin/users/${user_id}`),

  // Update student details
  updateStudent: (user_id, data) =>
    apiClient.put(`/admin/students/${user_id}`, data),

  // Bulk upload students
  bulkUploadStudents: (formData) => 
    apiClient.post("/admin/students/bulk-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};