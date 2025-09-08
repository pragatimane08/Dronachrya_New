// src/api/repository/groupService.js
import apiClient from "../apiclient";
import { apiUrl } from "../apiUtl";

const getAuthHeader = () => {
  // check both storages
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) {
    console.warn("⚠ No token found in localStorage or sessionStorage!");
    return {}; // no token, let caller handle unauthorized
  }

  console.log("🔑 Using token:", token);
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const groupService = {
  // ✅ Create a new group
  createGroup: (data) =>
    apiClient.post(apiUrl.groups.create, data, getAuthHeader()),

  // ✅ Get all groups of logged-in user
  getUserGroups: () =>
    apiClient.get(apiUrl.groups.getUserGroups, getAuthHeader()),

  // ✅ Add members (expects backend payload format)
  addMembers: (payload) =>
    apiClient.post(apiUrl.groups.addMembers, payload, getAuthHeader()),

  // ✅ Get members of a specific group
  getGroupMembers: (groupId) =>
    apiClient.get(apiUrl.groups.getMembers(groupId), getAuthHeader()),

  // ✅ Schedule a class for a group
  scheduleClass: (payload) =>
    apiClient.post(apiUrl.groups.scheduleClass, payload, getAuthHeader()),
};
