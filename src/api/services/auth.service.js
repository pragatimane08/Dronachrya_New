import axios from "axios";
import { apiUtl } from "../apiUtl";

export const authService = {
  login: (emailOrMobile, password, role) => {
    return axios.post(`${apiUtl.baseUrl}/auth/login`, {
      emailOrMobile,
      password,
      role,
    });
  },

  register: (userData) => {
    return axios.post(`${apiUtl.baseUrl}/auth/signup`, userData);
  },

  forgotPassword: (emailOrMobile) => {
    return axios.post(`${apiUtl.baseUrl}/auth/forgot-password`, { emailOrMobile });
  },

  verifyOtp: (emailOrMobile, otp) => {
    return axios.post(`${apiUtl.baseUrl}/auth/login/verify-otp`, {
      emailOrMobile,
      otp,
    });
  },

  resetPassword: (emailOrMobile, newPassword, otp) => {
    return axios.post(`${apiUtl.baseUrl}/auth/reset-password`, {
      emailOrMobile,
      newPassword,
      otp,
    });
  },
};

export const updateLocation = async (placeId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const response = await axios.put(
      `${apiUtl.baseUrl}/profile/location`,
      { place_id: placeId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
};

