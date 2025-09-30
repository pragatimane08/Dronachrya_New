// // src/api/repository/groupService.js
// import apiClient from "../apiclient";
// import { apiUrl } from "../apiUtl";

// const getAuthHeader = () => {
//   const token = localStorage.getItem("token") || sessionStorage.getItem("token");
//   if (!token) {
//     console.warn("⚠ No token found in localStorage or sessionStorage!");
//     return {};
//   }
//   return { headers: { Authorization: `Bearer ${token}` } };
// };

// export const groupService = {
//   // ✅ Create a new group
//   createGroup: async (data) => {
//     const res = await apiClient.post(apiUrl.groups.create, data, getAuthHeader());
//     return res.data;
//   },

//   // ✅ Get all groups of logged-in user (includes scheduled classes)
//   getUserGroups: async () => {
//     const res = await apiClient.get(apiUrl.groups.getUserGroups, getAuthHeader());
//     return res.data;
//   },

//   // ✅ Add members
//   addMembers: async (payload) => {
//     const res = await apiClient.post(apiUrl.groups.addMembers, payload, getAuthHeader());
//     return res.data;
//   },

//   // ✅ Get members of a specific group
//   getGroupMembers: async (groupId) => {
//     const res = await apiClient.get(apiUrl.groups.getMembers(groupId), getAuthHeader());
//     return res.data;
//   },

//   // ✅ Schedule a class for a group
//   scheduleClass: async (payload) => {
//     const res = await apiClient.post(apiUrl.groups.scheduleClass, payload, getAuthHeader());
//     return res.data;
//   },

//   // ✅ Get scheduled classes for calendar
//   getScheduledClasses: async () => {
//     const res = await apiClient.get("/groups/my-classes/scheduled", getAuthHeader());
//     return res.data;
//   },
//  // ✅ Update a group
//   updateGroup: async (groupId, payload) => {
//     const res = await apiClient.put(`/groups/${groupId}`, payload, getAuthHeader());
//     return res.data;
//   },

//   // ✅ Delete a group
//   deleteGroup: async (groupId) => {
//     const res = await apiClient.delete(`/groups/${groupId}`, getAuthHeader());
//     return res.data;
//   },
// // ✅ Remove a member from a group
// removeMember: async (groupId, userId) => {
//   const res = await apiClient.delete(
//     `/groups/${groupId}/remove-member/${userId}`,
//     getAuthHeader()
//   );
//   return res.data;
// },
// };


// src/api/repository/groupService.js
import apiClient from "../apiclient";
import { apiUrl } from "../apiUtl";

const getAuthHeader = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) {
    console.warn("⚠ No token found in localStorage or sessionStorage!");
    return {};
  }
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const groupService = {
  // ✅ Create a new group (Tutor/Admin)
  createGroup: async (data) => {
    const res = await apiClient.post(
      apiUrl.groups.create,
      data,
      getAuthHeader()
    );
    return res.data;
  },

  // ✅ Get all groups of logged-in user (Student/Tutor)
  getUserGroups: async () => {
    const res = await apiClient.get(
      apiUrl.groups.getUserGroups,
      getAuthHeader()
    );
    return res.data;
  },

  // ✅ Add members (Tutor/Admin)
  addMembers: async (payload) => {
    const res = await apiClient.post(
      apiUrl.groups.addMembers,
      payload,
      getAuthHeader()
    );
    return res.data;
  },

  // ✅ Get members of a specific group (Student/Tutor)
  getGroupMembers: async (groupId) => {
    const res = await apiClient.get(
      apiUrl.groups.getMembers(groupId),
      getAuthHeader()
    );
    return res.data;
  },

  // ✅ Schedule a class for a group (Tutor/Student)
  scheduleClass: async (payload) => {
    const res = await apiClient.post(
      apiUrl.groups.scheduleClass, // ✅ use apiUrl instead of hardcoded
      payload,
      getAuthHeader()
    );
    return res.data;
  },

  // ✅ Get scheduled classes for calendar (Student/Tutor)
  getScheduledClasses: async () => {
    const res = await apiClient.get(
      apiUrl.groups.getScheduledClasses, // ✅ use apiUrl instead of "/groups/my-classes/scheduled"
      getAuthHeader()
    );
    return res.data;
  },

  // ✅ Update a group (Tutor/Admin)
  updateGroup: async (groupId, payload) => {
    const res = await apiClient.put(
      apiUrl.groups.update(groupId),
      payload,
      getAuthHeader()
    );
    return res.data;
  },

  // ✅ Delete a group (Tutor/Admin)
  deleteGroup: async (groupId) => {
    const res = await apiClient.delete(
      apiUrl.groups.delete(groupId),
      getAuthHeader()
    );
    return res.data;
  },

  // ✅ Remove a member from a group (Tutor/Admin)
  removeMember: async (groupId, userId) => {
    const res = await apiClient.delete(
      apiUrl.groups.removeMember(groupId, userId),
      getAuthHeader()
    );
    return res.data;
  },

  // ✅ Get all groups (Admin)
  getAllGroups: async () => {
    const res = await apiClient.get(apiUrl.groups.getAll, getAuthHeader());
    return res.data;
  },

  // ✅ Get classes for a specific group (Student/Tutor)
  getClasses: async (groupId) => {
    const res = await apiClient.get(
      apiUrl.groups.getClasses(groupId),
      getAuthHeader()
    );
    return res.data;
  },
};
