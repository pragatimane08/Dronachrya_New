// // src/api/repository/admin/ReferralCode.repository.js
// import { apiClient } from "../../apiclient";

// export const ReferralCodeRepository = {
//   // Admin: Fetch all referral codes
//   getAll: async () => {
//     const { data } = await apiClient.get("/referrals/all");
//     return data.referrals || [];
//   },

//   // Admin/User: Generate a new referral code
//   create: async () => {
//     const { data } = await apiClient.post("/referrals/generate");
//     return data.referral;
//   },

//   // Admin: Mark referral as rewarded
//   reward: async (id, payload) => {
//     const { data } = await apiClient.put(`/referrals/reward/${id}`, payload);
//     return data;
//   },

//   // User: Apply referral code
//   apply: async (code) => {
//     const { data } = await apiClient.post("/referrals/apply", { code });
//     return data;
//   },
// };


// src/api/repository/admin/ReferralCode.repository.js
import { apiClient } from "../../apiclient";

export const ReferralCodeRepository = {
  // Admin: Fetch all referral codes
  getAll: async () => {
    const { data } = await apiClient.get("/referrals/all");
    return data.data || []; // <- FIXED HERE
  },

  // Admin/User: Generate a new referral code
  create: async () => {
    const { data } = await apiClient.post("/referrals/generate");
    return data.referral;
  },

  // Admin: Mark referral as rewarded
  reward: async (id, payload) => {
    const { data } = await apiClient.put(`/referrals/reward/${id}`, payload);
    return data;
  },

  // User: Apply referral code
  apply: async (code) => {
    const { data } = await apiClient.post("/referrals/apply", { code });
    return data;
  },
};
