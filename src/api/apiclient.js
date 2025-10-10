//added classes
import axios from "axios";
import { apiUrl } from "./apiUtl";

// Token utils
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

export const checkSenderSubscription = async () => {
  try {
    const response = await axiosInstance.get("/enquiries/check-sender-subscription");
    return response.data; // { allowed: true/false, message: ... }
  } catch (error) {
    console.error("Failed to check sender subscription:", error);
    return { allowed: false, message: error.response?.data?.message || "Subscription check failed" };
  }
};

// Axios instance
const axiosInstance = axios.create({
  baseURL: apiUrl.baseUrl,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT automatically
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

// In your axios instance file
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      console.warn("⚠️ Unauthorized. Clearing token.");

      // Get current path and role before clearing
      const currentPath = window.location.pathname;
      const role = localStorage.getItem("role") || sessionStorage.getItem("role");

      // Clear tokens
      clearToken();
      localStorage.removeItem("role");
      sessionStorage.removeItem("role");

      // Redirect based on current path OR role
      if (currentPath.includes('/admin') || role === 'admin') {
        window.location.href = "/admin-login";
      } else {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Export reusable HTTP methods
export const apiClient = {
  get: (url, config = {}) => axiosInstance.get(url, config),
  post: (url, data, config = {}) => axiosInstance.post(url, data, config),
  put: (url, data, config = {}) => axiosInstance.put(url, data, config),
  patch: (url, data, config = {}) => axiosInstance.patch(url, data, config),
  delete: (url, config = {}) => axiosInstance.delete(url, config),
  checkSenderSubscription,
};

export default axiosInstance;