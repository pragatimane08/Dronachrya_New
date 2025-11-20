

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
//   // Group Management
//   createGroup: async (data) => {
//     const res = await apiClient.post(apiUrl.groups.create, data, getAuthHeader());
//     return res.data;
//   },

//   getUserGroups: async () => {
//     const res = await apiClient.get(apiUrl.groups.getUserGroups, getAuthHeader());
//     return res.data;
//   },

//   addMembers: async (payload) => {
//     const res = await apiClient.post(apiUrl.groups.addMembers, payload, getAuthHeader());
//     return res.data;
//   },

//   getGroupMembers: async (groupId) => {
//     const res = await apiClient.get(apiUrl.groups.getMembers(groupId), getAuthHeader());
//     return res.data;
//   },

//   // Group Class Management
//   scheduleClass: async (payload) => {
//     const res = await apiClient.post(apiUrl.groups.scheduleClass, payload, getAuthHeader());
//     return res.data;
//   },

//   getScheduledClasses: async () => {
//     const res = await apiClient.get(apiUrl.groups.getScheduledClasses, getAuthHeader());
//     return res.data;
//   },
 

//   // ✅ CANCEL Group Class - Fixed: Added /api prefix to be consistent
//   cancelGroupClass: async (classId, cancellationReason = "") => {
//     const res = await apiClient.post(
//       `/api/groups/classes/${classId}/cancel`,
//       { cancellation_reason: cancellationReason },
//       getAuthHeader()
//     );
//     return res.data;
//   },
//   // ✅ COMPLETE Group Class - Using dedicated endpoint  
//   completeGroupClass: async (classId) => {
//     const res = await apiClient.put(
//       `/groups/classes/${classId}/complete`,
//       {},
//       getAuthHeader()
//     );
//     return res.data;
//   },

//   // ✅ RESCHEDULE Group Class
//   updateGroupClass: async (classId, payload) => {
//     const res = await apiClient.put(
//       `/groups/classes/${classId}`,
//       payload,
//       getAuthHeader()
//     );
//     return res.data;
//   },

//   // ✅ DELETE Group Class
//   deleteGroupClass: async (classId) => {
//     const res = await apiClient.delete(
//       `/groups/classes/${classId}`,
//       getAuthHeader()
//     );
//     return res.data;
//   },


//   // Individual Class Management
//   getClasses: async (groupId) => {
//     const res = await apiClient.get(apiUrl.groups.getClasses(groupId), getAuthHeader());
//     return res.data;
//   },

//   // ✅ CANCEL Individual Class
//   cancelIndividualClass: async (classId, cancellationReason = "") => {
//     const res = await apiClient.post(
//       `/classes/${classId}/cancel`,
//       { cancellation_reason: cancellationReason },
//       getAuthHeader()
//     );
//     return res.data;
//   },

//   // ✅ RESCHEDULE Individual Class
//   updateIndividualClass: async (classId, payload) => {
//     const res = await apiClient.patch(
//       `/classes/${classId}`,
//       payload,
//       getAuthHeader()
//     );
//     return res.data;
//   },

//   // ✅ DELETE Individual Class
//   deleteIndividualClass: async (classId) => {
//     const res = await apiClient.delete(
//       `/classes/${classId}/permanent`,
//       getAuthHeader()
//     );
//     return res.data;
//   },

//   // Group CRUD
//   updateGroup: async (groupId, payload) => {
//     const res = await apiClient.put(apiUrl.groups.update(groupId), payload, getAuthHeader());
//     return res.data;
//   },

//   deleteGroup: async (groupId) => {
//     const res = await apiClient.delete(apiUrl.groups.delete(groupId), getAuthHeader());
//     return res.data;
//   },

//   removeMember: async (groupId, userId) => {
//     const res = await apiClient.delete(apiUrl.groups.removeMember(groupId, userId), getAuthHeader());
//     return res.data;
//   },

//   getAllGroups: async () => {
//     const res = await apiClient.get(apiUrl.groups.getAll, getAuthHeader());
//     return res.data;
//   }
// };

// src/api/repository/groupService.js
import apiClient from "../apiclient";
import { apiUrl } from "../apiUtl";

const getAuthHeader = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) {
    console.warn("⚠ No token found in localStorage or sessionStorage!");
    return {};
  }
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const groupService = {
  // Group Management
  createGroup: async (data) => {
    const res = await apiClient.post(apiUrl.groups.create, data, getAuthHeader());
    return res.data;
  },

  getUserGroups: async () => {
    const res = await apiClient.get(apiUrl.groups.getUserGroups, getAuthHeader());
    return res.data;
  },

  addMembers: async (payload) => {
    const res = await apiClient.post(apiUrl.groups.addMembers, payload, getAuthHeader());
    return res.data;
  },

  getGroupMembers: async (groupId) => {
    const res = await apiClient.get(apiUrl.groups.getMembers(groupId), getAuthHeader());
    return res.data;
  },

  // Group Class Management
  scheduleClass: async (payload) => {
    const res = await apiClient.post(apiUrl.groups.scheduleClass, payload, getAuthHeader());
    return res.data;
  },

  getScheduledClasses: async () => {
    const res = await apiClient.get(apiUrl.groups.getScheduledClasses, getAuthHeader());
    return res.data;
  },

  // ✅ FIXED: Remove the duplicate /api prefix
  cancelGroupClass: async (classId, cancellationReason = "") => {
    const res = await apiClient.post(
      `/groups/classes/${classId}/cancel`,
      { cancellation_reason: cancellationReason },
      getAuthHeader()
    );
    return res.data;
  },

  // ✅ FIXED: Remove the duplicate /api prefix
  completeGroupClass: async (classId) => {
    const res = await apiClient.put(
      `/groups/classes/${classId}/complete`,
      {},
      getAuthHeader()
    );
    return res.data;
  },

  // ✅ FIXED: Remove the duplicate /api prefix
  updateGroupClass: async (classId, payload) => {
    const res = await apiClient.put(
      `/groups/classes/${classId}`,
      payload,
      getAuthHeader()
    );
    return res.data;
  },

  // ✅ FIXED: Remove the duplicate /api prefix
  deleteGroupClass: async (classId) => {
    const res = await apiClient.delete(
      `/groups/classes/${classId}`,
      getAuthHeader()
    );
    return res.data;
  },

  // Individual Class Management
  getClasses: async (groupId) => {
    const res = await apiClient.get(apiUrl.groups.getClasses(groupId), getAuthHeader());
    return res.data;
  },

  // ✅ FIXED: Remove the duplicate /api prefix
  cancelIndividualClass: async (classId, cancellationReason = "") => {
    const res = await apiClient.post(
      `/classes/${classId}/cancel`,
      { cancellation_reason: cancellationReason },
      getAuthHeader()
    );
    return res.data;
  },

  // ✅ FIXED: Remove the duplicate /api prefix
  updateIndividualClass: async (classId, payload) => {
    const res = await apiClient.patch(
      `/classes/${classId}`,
      payload,
      getAuthHeader()
    );
    return res.data;
  },

  // ✅ FIXED: Remove the duplicate /api prefix
  deleteIndividualClass: async (classId) => {
    const res = await apiClient.delete(
      `/classes/${classId}/permanent`,
      getAuthHeader()
    );
    return res.data;
  },

  // Group CRUD
  updateGroup: async (groupId, payload) => {
    const res = await apiClient.put(apiUrl.groups.update(groupId), payload, getAuthHeader());
    return res.data;
  },

  deleteGroup: async (groupId) => {
    const res = await apiClient.delete(apiUrl.groups.delete(groupId), getAuthHeader());
    return res.data;
  },

  removeMember: async (groupId, userId) => {
    const res = await apiClient.delete(apiUrl.groups.removeMember(groupId, userId), getAuthHeader());
    return res.data;
  },

  getAllGroups: async () => {
    const res = await apiClient.get(apiUrl.groups.getAll, getAuthHeader());
    return res.data;
  }
};