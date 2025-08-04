// auth.repository.js
import apiClient from '../apiclient';
import { apiUrl } from '../apiUtl';

export const authRepository = {
  login: (credentials) => apiClient.post(apiUrl.auth.login, credentials),
  register: (userData) => apiClient.post(apiUrl.auth.register, userData),
  forgotPassword: (data) => apiClient.post(apiUrl.auth.forgotPassword, data),
  resetPassword: (data) => apiClient.post(apiUrl.auth.resetPassword, data),
  verifyOtp: (data) => apiClient.post(apiUrl.auth.verifyOtp, data),
  sendOtp: (data) => apiClient.post(apiUrl.auth.sendOtp, data),

  // ✅ Corrected API call for referral code check
  checkReferralCode: (referralCode) =>
    apiClient.get(`${apiUrl.baseUrl}/referral/verify/${referralCode}`),
};
