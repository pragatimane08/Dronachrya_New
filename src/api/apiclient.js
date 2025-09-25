// import axios from "axios";
// import { apiUrl } from "./apiUtl";

// // ✅ Token utils
// export const getToken = () => {
//   return (
//     localStorage.getItem("authToken") ||
//     sessionStorage.getItem("authToken")
//   );
// };

// export const setToken = (token) => {
//   localStorage.setItem("authToken", token);
// };

// export const clearToken = () => {
//   localStorage.removeItem("authToken");
//   sessionStorage.removeItem("authToken");
// };

// // ✅ Axios instance
// const axiosInstance = axios.create({
//   baseURL: apiUrl.baseUrl,
//   timeout: 120000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // 🔐 Attach JWT automatically
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = getToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // 🚫 Auto logout on 401
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;
//     if (status === 401) {
//       console.warn("⚠️ Unauthorized. Clearing token.");
//       clearToken();
//       window.location.href = "/login"; // redirect to login
//     }
//     return Promise.reject(error);
//   }
// );

// // 🌐 Export reusable HTTP methods
// export const apiClient = {
//   get: (url, config = {}) => axiosInstance.get(url, config),
//   post: (url, data = {}, config = {}) => axiosInstance.post(url, data, config),
//   put: (url, data = {}, config = {}) => axiosInstance.put(url, data, config),
//   patch: (url, data = {}, config = {}) => axiosInstance.patch(url, data, config),
//   delete: (url, config = {}) => axiosInstance.delete(url, config),
// };

// export default axiosInstance;

//added classes
import axios from "axios";
import { apiUrl } from "./apiUtl";

// ✅ Token utils
export const getToken = () => {
  return (
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken")
  );
};

export const setToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const clearToken = () => {
  localStorage.removeItem("authToken");
  sessionStorage.removeItem("authToken");
};

// ✅ Axios instance
const axiosInstance = axios.create({
  baseURL: apiUrl.baseUrl,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach JWT automatically
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

// 🚫 Auto logout on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      console.warn("⚠️ Unauthorized. Clearing token.");
      clearToken();
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