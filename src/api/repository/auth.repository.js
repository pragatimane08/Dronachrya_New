import { apiClient } from "../apiclient";
import { apiUrl } from "../apiUtl";

export const authRepository = {
  // Normal login/register
  login: (credentials) => apiClient.post(apiUrl.auth.login, credentials),
  register: (userData) => apiClient.post(apiUrl.auth.register, userData),
  forgotPassword: (data) => apiClient.post(apiUrl.auth.forgotPassword, data),
  resetPassword: (data) => apiClient.post(apiUrl.auth.resetPassword, data),

  // Student OTP login flow
  sendOtp: (data) => apiClient.post("/auth/login/send-otp", data),
  verifyOtp: (data) => apiClient.post("/auth/login/verify-otp", data),
  resendLoginOtp: (data) => apiClient.post("/auth/login/send-otp", data), // ✅ added correct resend for login

  // Tutor OTP verify (different endpoint)
  tutorVerifyOtp: (data) => apiClient.post("/auth/verify-otp", data),

  // Student signup flow
  preRegisterStudent: (data) => apiClient.post(apiUrl.auth.preRegisterStudent, data),
  resendPreRegisterOTP: (data) => apiClient.post("/auth/resend-otp", data), // keep for signup OTP resend

  // Admin OTP flow
  verifyAdminOtp: (data) => apiClient.post(apiUrl.auth.adminVerifyOtp, data),

  // Referral code check
  checkReferralCode: (referralCode) =>
    apiClient.get(`${apiUrl.baseUrl}/referral/verify/${referralCode}`),
};
