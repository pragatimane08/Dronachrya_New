import { apiClient } from "../apiclient";

const getTutors = () =>
  apiClient.get("/users?role=tutor").then((res) => {
    return res.data.data.map((tutor) => {
      const profile = tutor.profile || {};
      return {
        name: profile.name || tutor.name || "Unnamed Tutor",
        image: profile.image || "/default-avatar.png", // Fallback image
        subjects: profile.subjects?.join(", ") || "N/A",
        classes: profile.classes?.join(", ") || "N/A",
        experience: profile.experience || "N/A",
        pricing: profile.pricing_per_hour || "N/A",
        languages: profile.languages
          ?.map((lang) => `${lang.language} (${lang.proficiency})`)
          .join(", ") || "N/A",
        location: profile.Location?.city || "Unknown",
        email: profile.User?.email || "N/A",
        mobile: profile.User?.mobile_number || "N/A",
        verified: profile.profile_status === "approved",
      };
    });
  });

export const studentDashboardRepository = {
  getTutors,
};
