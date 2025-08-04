import { apiClient } from "../apiclient";

const PROFILE_BASE = "/profile";
export const getStudentProfile = async () => {
  try {
    const res = await apiClient.get(PROFILE_BASE);
    const profile = res.data?.profile;

    if (!profile) throw new Error("Profile not found");

    return {
      role: profile.role || null,
      subjects: profile.subjects || [],
      class_modes: profile.class_modes || [],
      location: profile.Location || null, // ✅ FIXED here
    };
  } catch (error) {
    console.error("getStudentProfile error:", error.message || error);
    throw error;
  }
};
