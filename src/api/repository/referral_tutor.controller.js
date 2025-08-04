// src/api/repository/referral_tutor.controller.js
import { apiClient } from "../apiclient";

// ✅ Generate referral code for the current user
export const generateReferralCode = async () => {
  const response = await apiClient.post("/referrals/generate");

  // Handle both cases: already exists or freshly generated
  const code =
    response.data?.referral?.code ||    // if referral already exists
    response.data?.referralCode ||      // if newly created
    null;

  return {
    success: true,
    code,
  };
};

// ✅ Refer a tutor by sending an invite to their email
export const referTutor = async ({ email }) => {
  const response = await apiClient.post("/referrals/apply", { email });
  return response.data;
};

// ✅ Fetch referral reward
export const getReferralReward = async (userId) => {
  const response = await apiClient.get(`/referrals/reward/${userId}`);
  return response.data;
};
