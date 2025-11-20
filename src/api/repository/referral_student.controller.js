// src/api/repository/referral_tutor.controller.js
import { apiClient } from "../apiclient";

// Generate referral code for the current user
export const generateReferralCode = async () => {
  const response = await apiClient.post("/referrals/generate");

  const code =
    response.data?.code ||              
    response.data?.referral?.code ||   
    response.data?.referralCode ||      
    null;

  const message = response.data?.message || "";

  return {
    success: !!code,
    code,
    message,
  };
};
