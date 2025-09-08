
// // src/api/apiclient.js
// import axios from "axios";
// import { apiUrl } from "./apiUtl";

// // ✅ Create Axios instance
// const axiosInstance = axios.create({
//   baseURL: apiUrl.baseUrl,
//   timeout: 60000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // 🔐 Attach JWT token from localStorage or sessionStorage
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token =
//       localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // 🚫 Auto logout on 401 (except allowed routes)
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;
//     const requestUrl = error.config?.url;

//     const excludedRoutes = [
//       "/auth/signup",
//       "/auth/verify-otp",
//       "/profile/student",
//       "/profile/tutor",
//       "/payments/create-order",
//       "/payments/verify-payment",
//     ];

//     const shouldRedirect =
//       status === 401 &&
//       !excludedRoutes.some((route) => requestUrl?.includes(route));

//     if (shouldRedirect) {
//       const token =
//         localStorage.getItem("authToken") ||
//         sessionStorage.getItem("authToken");

//       if (token) {
//         // ✅ Only clear if user actually had a token
//         localStorage.clear();
//         sessionStorage.clear();
//         window.location.href = "/login";
//       }
//     }

//     // 🔎 Better error logging
//     if (error.response) {
//       console.error("API Error:", error.response.data);
//     } else {
//       console.error("API Error:", error.message);
//     }

//     return Promise.reject(error);
//   }
// );

// // 🌐 Export reusable HTTP methods
// export const apiClient = {
//   get: (url, config = {}) => axiosInstance.get(url, config),
//   post: (url, data, config = {}) => axiosInstance.post(url, data, config),
//   put: (url, data, config = {}) => axiosInstance.put(url, data, config),
//   patch: (url, data, config = {}) => axiosInstance.patch(url, data, config),
//   delete: (url, config = {}) => axiosInstance.delete(url, config),
// };

// export default axiosInstance;

import axios from "axios";
import { apiUrl } from "./apiUtl";
import { getToken, clearToken } from "./session";

// ✅ Create Axios instance
const axiosInstance = axios.create({
  baseURL: apiUrl.baseUrl,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚫 Auto logout on 401 (except allowed routes)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;

    const excludedRoutes = [
      "/auth/signup",
      "/auth/login",
      "/auth/verify-otp",
      "/profile/student",
      "/profile/tutor",
      "/payments/create-order",
      "/payments/verify-payment",
    ];

    const shouldRedirect =
      status === 401 &&
      !excludedRoutes.some((route) => requestUrl?.includes(route));

    if (shouldRedirect) {
      if (getToken()) {
        clearToken();
        window.location.href = "/login";
      }
    }

    if (error.response) {
      console.error("API Error:", error.response.data);
    } else {
      console.error("API Error:", error.message);
    }

    return Promise.reject(error);
  }

  
);

// 🌐 Export reusable HTTP methods
export const apiClient = {
  get: (url, config = {}) => axiosInstance.get(url, config),
  post: (url, data, config = {}) => axiosInstance.post(url, data, config),
  put: (url, data, config = {}) => axiosInstance.put(url, data, config),
  patch: (url, data, config = {}) => axiosInstance.patch(url, data, config),
  delete: (url, config = {}) => axiosInstance.delete(url, config),
};

export default axiosInstance;
