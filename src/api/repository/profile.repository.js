import { apiClient } from "../apiclient";

const PROFILE_BASE = "/profile";
const GOOGLE_MAPS_API_KEY = "AIzaSyB2fZzo4kGI7K1iOW_o1QkRItwScC4Ma-I";

// ================== COMMON PROFILE ==================
export const getProfile = async () => {
  const res = await apiClient.get(PROFILE_BASE);
  return res.data.profile;
};

export const updateUserContact = async (field, value) => {
  const res = await apiClient.put(`${PROFILE_BASE}/field`, { field, value });
  return res.data;
};

export const updateLocation = async (place_id) => {
  const res = await apiClient.put(`${PROFILE_BASE}/location`, { place_id });
  return res.data;
};

export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);

  const token = localStorage.getItem("token");

  const res = await apiClient.patch(`${PROFILE_BASE}/photo`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// ================== TUTOR PROFILE ==================
export const updateTutorProfile = async (payload) => {
  const res = await apiClient.put(`${PROFILE_BASE}/tutor`, payload);
  return res.data;
};

export const uploadTutorDocuments = async (files) => {
  const formData = new FormData();
  files.forEach(({ field, file }) => {
    formData.append(field, file);
  });

  const res = await apiClient.post(`${PROFILE_BASE}/documents`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// ================== STUDENT PROFILE ==================
export const updateStudentProfile = async (payload) => {
  const res = await apiClient.put(`${PROFILE_BASE}/student`, payload);
  return res.data;
};
