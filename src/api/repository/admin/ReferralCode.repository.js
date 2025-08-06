// // // src/api/repository/admin/ReferralCode.repository.js
// // import { apiClient } from "../../apiclient";

// // export const ReferralCodeRepository = {
// //   // Admin: Fetch all referral codes
// //   getAll: async () => {
// //     const { data } = await apiClient.get("/referrals/all");
// //     return data.referrals || [];
// //   },

// //   // Admin/User: Generate a new referral code
// //   create: async () => {
// //     const { data } = await apiClient.post("/referrals/generate");
// //     return data.referral;
// //   },

// //   // Admin: Mark referral as rewarded
// //   reward: async (id, payload) => {
// //     const { data } = await apiClient.put(`/referrals/reward/${id}`, payload);
// //     return data;
// //   },

// //   // User: Apply referral code
// //   apply: async (code) => {
// //     const { data } = await apiClient.post("/referrals/apply", { code });
// //     return data;
// //   },
// // };


// // src/api/repository/admin/ReferralCode.repository.js
// // import { apiClient } from "../../apiclient";

// // export const ReferralCodeRepository = {
// //   // Admin: Fetch all referral codes
// //   getAll: async () => {
// //     const { data } = await apiClient.get("/referrals/all");
// //     return data.data || []; // <- FIXED HERE
// //   },

// //   // Admin/User: Generate a new referral code
// //   create: async () => {
// //     const { data } = await apiClient.post("/referrals/generate");
// //     return data.referral;
// //   },

// //   // Admin: Mark referral as rewarded
// //   reward: async (id, payload) => {
// //     const { data } = await apiClient.put(`/referrals/reward/${id}`, payload);
// //     return data;
// //   },

// //   // User: Apply referral code
// //   apply: async (code) => {
// //     const { data } = await apiClient.post("/referrals/apply", { code });
// //     return data;
// //   },
// // };



// // src/api/repository/admin/ReferralCode.repository.js
// import { apiClient } from "../../apiclient";

// export const ReferralCodeRepository = {
//   /**
//    * Fetch all referral codes (admin only)
//    * @returns {Promise<Array>} Array of referral codes
//    */
//   getAll: async () => {
//     try {
//       const { data } = await apiClient.get("/referrals/all");
//       return data.data || [];
//     } catch (error) {
//       console.error("Error fetching referrals:", error);
//       throw error;
//     }
//   },

//   /**
//    * Generate a new referral code
//    * @returns {Promise<Object>} The new referral code
//    */
//   create: async () => {
//     try {
//       const { data } = await apiClient.post("/referrals/generate");
//       return data.code || null;
//     } catch (error) {
//       console.error("Error generating referral code:", error);
//       throw error;
//     }
//   },

//   /**
//    * Mark referral as rewarded
//    * @param {string} id - Referral ID
//    * @param {Object} payload - Reward details
//    * @returns {Promise<Object>} Updated referral
//    */
//   reward: async (id, payload) => {
//     try {
//       const { data } = await apiClient.put(`/referrals/reward/${id}`, payload);
//       return data.referral || null;
//     } catch (error) {
//       console.error("Error rewarding referral:", error);
//       throw error;
//     }
//   },

//   /**
//    * Apply a referral code
//    * @param {string} code - Referral code to apply
//    * @returns {Promise<Object>} Application result
//    */
//   apply: async (code) => {
//     try {
//       const { data } = await apiClient.post("/referrals/apply", { code });
//       return data;
//     } catch (error) {
//       console.error("Error applying referral code:", error);
//       throw error;
//     }
//   },

//   /**
//    * Get current user's referral codes
//    * @returns {Promise<Object>} User's referrals and summary
//    */
//   getMyCodes: async () => {
//     try {
//       const { data } = await apiClient.get("/referrals/my-codes");
//       return {
//         data: data.data || [],
//         summary: data.summary || {}
//       };
//     } catch (error) {
//       console.error("Error fetching user referrals:", error);
//       throw error;
//     }
//   }
// };



import { apiClient } from "../../apiclient";

export const ReferralCodeRepository = {
  /**
   * Fetch all referral codes (admin only)
   */
  getAll: async () => {
    try {
      const { data } = await apiClient.get("/referrals/all");
      return data.data || []; // ✅ Returns list or empty array
    } catch (error) {
      console.error("Error fetching referrals:", error);
      throw error;
    }
  },

  /**
   * Generate a new referral code
   */
  create: async () => {
    try {
      const { data } = await apiClient.post("/referrals/generate");
      return data.code || null; // ✅ Make sure backend returns `code`
    } catch (error) {
      console.error("Error generating referral code:", error);
      throw error;
    }
  },

  /**
   * Mark referral as rewarded
   */
  reward: async (id, payload) => {
    try {
      const { data } = await apiClient.put(`/referrals/reward/${id}`, payload);
      return data.referral || null;
    } catch (error) {
      console.error("Error rewarding referral:", error);
      throw error;
    }
  },

  /**
   * Apply a referral code
   */
  apply: async (code) => {
    try {
      const { data } = await apiClient.post("/referrals/apply", { code });
      return data;
    } catch (error) {
      console.error("Error applying referral code:", error);
      throw error;
    }
  },

  /**
   * Get current user's referral codes
   */
  getMyCodes: async () => {
    try {
      const { data } = await apiClient.get("/referrals/my-codes");
      return {
        data: data.data || [],
        summary: data.summary || {}
      };
    } catch (error) {
      console.error("Error fetching user referrals:", error);
      throw error;
    }
  }
};
