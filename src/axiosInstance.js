
// src/axiosInstance.js
import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://api.dronacharyatutorials.com/api" // ✅ Your hosted backend base URL
    : "/api"; // ✅ Local proxy path for development

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔐 Token attached:", token);
    } else {
      console.warn("⚠ No token found in localStorage/sessionStorage");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `❌ API Error [${error.response.status}]:`,
        error.response.data
      );
    } else if (error.request) {
      console.error("🚫 Network/Server Error: No response received");
    } else {
      console.error("⚙️ Request Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
