

import axios from "axios";
import { apiUrl } from "../apiUrl";
import { setToken, clearToken } from "../session";

export const authService = {
  login: async (emailOrMobile, password, role, remember = true) => {
    const res = await axios.post(`${apiUrl.baseUrl}/auth/login`, {
      emailOrMobile,
      password,
      role,
    });

    const token = res.data?.token;
    if (token) setToken(token, remember);

    return res;
  },

  register: (userData) => {
    return axios.post(`${apiUrl.baseUrl}/auth/signup`, userData);
  },

  forgotPassword: (emailOrMobile) => {
    return axios.post(`${apiUrl.baseUrl}/auth/forgot-password`, {
      emailOrMobile,
    });
  },

  verifyOtp: (data) => {
    return axios.post(`${apiUrl.baseUrl}/auth/login/verify-otp`, data);
  },

  resetPassword: (emailOrMobile, newPassword, otp) => {
    return axios.post(`${apiUrl.baseUrl}/auth/reset-password`, {
      emailOrMobile,
      newPassword,
      otp,
    });
  },

  preRegisterStudent: (data) => {
    return axios.post(`${apiUrl.baseUrl}/auth/student/pre-register`, data);
  },

  logout: () => {
    clearToken();
    window.location.href = "/login";
  },
};
