import axios from "axios";
import { apiUrl } from "./apiUtl";

// Token utils
export const getToken = () => {
  return (
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken")
  );
};

export const setToken = (token, rememberMe = false) => {
  if (rememberMe) {
    localStorage.setItem("authToken", token);
  } else {
    sessionStorage.setItem("authToken", token);
  }
};

export const clearToken = () => {
  localStorage.removeItem("authToken");
  sessionStorage.removeItem("authToken");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("role");
};

export const getUser = () => {
  const user = localStorage.getItem("user") || sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const setUser = (userData, rememberMe = false) => {
  if (rememberMe) {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userData.role);
  } else {
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("role", userData.role);
  }
};

export const checkSenderSubscription = async () => {
  try {
    const response = await axiosInstance.get("/enquiries/check-sender-subscription");
    return response.data;
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

// Enhanced response interceptor with better session handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      console.warn("⚠️ Unauthorized. Clearing token and redirecting to login.");
      
      // Get current path and role before clearing
      const currentPath = window.location.pathname;
      const role = localStorage.getItem("role") || sessionStorage.getItem("role");

      // Clear all auth data
      clearToken();

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

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Get user role
export const getUserRole = () => {
  return localStorage.getItem("role") || sessionStorage.getItem("role");
};
// Enhanced role-based session management
export const getCurrentUserRole = () => {
  return localStorage.getItem("userRole") || sessionStorage.getItem("userRole") ||
         localStorage.getItem("role") || sessionStorage.getItem("role");
};
// Add this function to your apiclient.js file
export const refreshToken = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axiosInstance.post('/auth/refresh', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.token) {
      setToken(response.data.token);
      return response.data.token;
    }
    
    throw new Error('No new token received');
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearToken();
    throw error;
  }
};

// Enhanced token validation with role check
export const validateToken = async () => {
  const token = getToken();
  const userRole = getCurrentUserRole();
 
  if (!token || !userRole) {
    return false;
  }
 
  try {
    // Just check if token exists and is not expired (basic validation)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return false;
    }
   
    const payload = JSON.parse(atob(tokenParts[1]));
    const currentTime = Date.now() / 1000;
   
    if (payload.exp && payload.exp < currentTime) {
      console.warn("Token expired");
      clearToken();
      return false;
    }
   
    return true;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
  
};

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



