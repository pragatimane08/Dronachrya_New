// src/axiosInstance.js
import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
});

instance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken'); // ✅ FIXED

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ FIXED
      console.log('✅ Sending token:', token);
    } else {
      console.warn('⚠ No token found in localStorage or sessionStorage');
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
