// // src/api/services/authService.js
// import axios from "axios";
// import { apiUtl } from "../apiUtl";

// export const authService = {
//   login: (emailOrMobile, password, role) => {
//     return axios.post(`${apiUtl.baseUrl}/auth/login`, {
//       emailOrMobile,
//       password,
//       role,
//     });
//   },

//   register: (userData) => {
//     return axios.post(`${apiUtl.baseUrl}/auth/signup`, userData);
//   },

//   forgotPassword: (emailOrMobile) => {
//     return axios.post(`${apiUtl.baseUrl}/auth/forgot-password`, { emailOrMobile });
//   },

//   verifyOtp: (data) => {
//     // data = { user_id, otp }
//     return axios.post(`${apiUtl.baseUrl}/auth/login/verify-otp`, data);
//   },

//   resetPassword: (emailOrMobile, newPassword, otp) => {
//     return axios.post(`${apiUtl.baseUrl}/auth/reset-password`, {
//       emailOrMobile,
//       newPassword,
//       otp,
//     });
//   },

//   // ✅ Pre-register student (Book Demo)
//   preRegisterStudent: (data) => {
//     return axios.post(`${apiUtl.baseUrl}/auth/student/pre-register`, data);
//   },
// };

// // ✅ update location stays as is
// export const updateLocation = async (placeId) => {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) throw new Error("Authentication required");

//     const response = await axios.put(
//       `${apiUtl.baseUrl}/profile/location`,
//       { place_id: placeId },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     const message = error.response?.data?.message || error.message;
//     throw new Error(message);
//   }
// };

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
