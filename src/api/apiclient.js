// import axios from "axios";
// import { apiUrl } from "./apiUtl";

// const axiosInstance = axios.create({
//   baseURL: apiUrl.baseUrl,
//   timeout: 60000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // 🔐 Attach token from localStorage/sessionStorage
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token =
//       localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
//     // ✅ CORRECT
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // 🔁 Handle 401 with exclusions
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;
//     const requestUrl = error.config?.url;

//     const exclude401RedirectRoutes = [
//       "/api/auth/signup",
//       "/api/auth/verify-otp",
//       "/profile/student",
//       "/profile/tutor",
//       "/payments/create-order",
//       "/subscriptions/status",
//       "/subscriptions/student",
//       // "/payments/verify-payment", // ❌ Removed
//     ];


//     const shouldRedirect =
//       status === 401 &&
//       !exclude401RedirectRoutes.some((route) =>
//         requestUrl?.includes(route)
//       );

//     if (shouldRedirect) {
//       localStorage.removeItem("authToken");
//       localStorage.removeItem("user");
//       localStorage.removeItem("role");
//       localStorage.removeItem("user_id");
//       window.location.href = "/login";
//     }

//     return Promise.reject(error);
//   }
// );

// // 🔧 Export common API calls
// export const apiClient = {
//   get: (url, config) => axiosInstance.get(url, config),
//   post: (url, data, config) => axiosInstance.post(url, data, config),
//   put: (url, data, config) => axiosInstance.put(url, data, config),
//   patch: (url, data, config) => axiosInstance.patch(url, data, config),
//   delete: (url, config) => axiosInstance.delete(url, config),
// };

// export default axiosInstance;


// src/api/apiclient.js
import axios from "axios";
import { apiUrl } from "./apiUtl";

// ✅ Create Axios instance
const axiosInstance = axios.create({
  baseURL: apiUrl.baseUrl,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach JWT token from localStorage or sessionStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
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
  localStorage.setItem("authToken", response.data.token);

      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("user_id");
      window.location.href = "/login";
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
