import { apiClient } from "../apiclient";

const PROFILE_BASE = "/profile";

// ================== COMMON PROFILE ==================
export const getProfile = async () => {
  try {
    const res = await apiClient.get(PROFILE_BASE);
    console.log("Full API response:", res.data);
   
    const responseData = res.data;
   
    return {
      ...responseData.profile,
      subscription_status: responseData.subscription_status,
      plan_name: responseData.plan_name,
      remaining_days: responseData.remaining_days
    };
  } catch (error) {
    console.error("Error in getProfile:", error);
    throw error;
  }
};

// OTP Request and Verification functions for both tutor and student
export const requestOtp = async (field, value) => {
  const res = await apiClient.post(`${PROFILE_BASE}/field/request`, {
    action: "request",
    field: field === "mobile" ? "mobile_number" : field,
    value: value
  });
  return res.data;
};

export const verifyOtp = async (field, value, otp) => {
  const res = await apiClient.post(`${PROFILE_BASE}/field/verify`, {
    action: "verify",
    field: field === "mobile" ? "mobile_number" : field,
    value: value,
    otp: otp
  });
  return res.data;
};

export const updateUserContact = async (field, value) => {
  const res = await apiClient.put(`${PROFILE_BASE}/field`, { field, value });
  return res.data;
};

export const updateLocation = async (place_id) => {
  const res = await apiClient.put(`${PROFILE_BASE}/location`, { place_id });
  return res.data;
};

export const deleteProfilePhoto = async () => {
  const token = localStorage.getItem("token");
 
  const res = await apiClient.delete(`${PROFILE_BASE}/photo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
 
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

export const deleteTutorDocument = async (documentType) => {
  const res = await apiClient.delete(`${PROFILE_BASE}/documents/${documentType}`);
  return res.data;
};