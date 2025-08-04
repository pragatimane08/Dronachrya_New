// // src/api/repository/Filter_student.repository.js
// import { apiClient } from "../apiclient";

// export const searchStudents = async (filters) => {
//   const params = {};

//   if (filters.subjects?.length) params.subjects = filters.subjects.join(",");
//   if (filters.classes?.length) params.classes = filters.classes.join(",");
//   if (filters.locations?.length) params.locations = filters.locations.join(",");
//   if (filters.types?.length) params.class_modes = filters.types.join(",");
//   if (filters.startPlan) params.start_plan = filters.startPlan;
//   if (filters.verified) params.verified = true;

//   const res = await apiClient.get("/search/students", { params });
//   return res.data.students;
// };

// src/api/repository/Filter_student.repository.js
// import { apiClient } from "../apiclient";

// export const searchStudents = async (filters) => {
//   const params = {};

//   if (filters.subjects?.length) params.subjects = filters.subjects.join(",");
//   if (filters.classes?.length) params.classes = filters.classes.join(",");

//   // 🔧 FIXED: Use 'location' instead of 'locations'
//   if (filters.locations?.length) params.location = filters.locations[0];

//   // 🔧 FIXED: Use 'class_modes' instead of 'types'
//   if (filters.types?.length) params.class_modes = filters.types.join(",");

//   if (filters.startPlan) params.start_plan = filters.startPlan;
//   if (filters.verified) params.verified = true;

//   const res = await apiClient.get("/search/students", { params });
//   return res.data.students;
// };


// src/api/repository/Filter_student.repository.js
import { apiClient } from "../apiclient";

export const searchStudents = async (filters) => {
  const params = new URLSearchParams();

  if (filters.subjects?.length) {
    filters.subjects.forEach((subject) => params.append("subjects", subject));
  }

  // if (filters.classes?.length) {
  //   filters.classes.forEach((cls) => params.append("classes", cls));
  // }
  if (filters.class) {
  params.append("class", filters.class);
}


  if (filters.location) {
    params.append("location", filters.location);
  }

  if (filters.class_modes?.length) {
    filters.class_modes.forEach((mode) => params.append("class_modes", mode));
  }

  // ✅ Debug output
  console.log("Sending filters:", params.toString());

  try {
    const res = await apiClient.get(`/search/students?${params.toString()}`);
    return res.data.students;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};
