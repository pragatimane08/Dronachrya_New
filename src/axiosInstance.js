// // // src/axiosInstance.js
// // import axios from 'axios';

// // const instance = axios.create({
// //   baseURL: '/api',
// // });

// // instance.interceptors.request.use(
// //   (config) => {
// //     const token =
// //       localStorage.getItem('authToken') || sessionStorage.getItem('authToken'); // ✅ FIXED

// //     if (token) {
// //       config.headers.Authorization = `Bearer ${token}`; // ✅ FIXED
// //       console.log('✅ Sending token:', token);
// //     } else {
// //       console.warn('⚠ No token found in localStorage or sessionStorage');
// //     }

// //     return config;
// //   },
// //   (error) => Promise.reject(error)
// // );

// // export default instance;



// // import axios from "axios";

// // const axiosInstance = axios.create({
// //   baseURL:
// //     import.meta.env.MODE === "production"
// //       ? "https://api.dronacharyatutorials.com/api"
// //       : "/api", // proxy for local dev
// //   timeout: 120000,
// //   headers: { "Content-Type": "application/json" },
// // });

// // axiosInstance.interceptors.request.use(
// //   (config) => {
// //     const token =
// //       localStorage.getItem("authToken") ||
// //       sessionStorage.getItem("authToken");
// //     if (token) config.headers.Authorization = `Bearer ${token}`;
// //     return config;
// //   },
// //   (error) => Promise.reject(error)
// // );

// // export default axiosInstance;


// // src/axiosInstance.js
// import axios from "axios";

// // ✅ Set base URL dynamically
// const BASE_URL =
//   import.meta.env.MODE === "production"
//     ? "https://api.dronacharyatutorials.com/api" // 🌐 Hosted backend
//     : "/api"; // 💻 Local development (Vite proxy)

// // ✅ Create a single axios instance
// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   timeout: 120000, // 2 minutes
//   headers: { "Content-Type": "application/json" },
// });

// // ✅ Attach token for every request
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token =
//       localStorage.getItem("authToken") ||
//       sessionStorage.getItem("authToken");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//       console.log("🔐 Token attached:", token);
//     } else {
//       console.warn("⚠ No auth token found (localStorage/sessionStorage)");
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ✅ Handle all API / Network errors globally
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       console.error(
//         `❌ API Error [${error.response.status}]:`,
//         error.response.data
//       );
//     } else if (error.request) {
//       console.error("🚫 Network/Server Error: No response received");
//     } else {
//       console.error("⚙️ Request Error:", error.message);
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


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
