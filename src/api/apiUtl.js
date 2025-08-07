// export const apiUrl = {
//   baseUrl: import.meta.env.VITE_API_URL || 'https://api.dronacharya.instagrp.in/api/',

//   auth: {
//     login: "/auth/login",
//     register: "/auth/signup",
//     forgotPassword: "/auth/forgot-password",
//     resetPassword: "/auth/reset-password",
//     verifyOtp: "/auth/login/verify-otp",
//     sendOtp: "/auth/login/send-otp",
//     changePassword: "/auth/change-password",
//   },
  
//   user: {
//     profile: "/user/profile",
//   },
  
//   // Add more groups and endpoints as needed
// };

// export const apiUtl = {
//   baseUrl: import.meta.env.VITE_API_URL || "https://api.dronacharya.instagrp.in/api/",
// };"http://192.168.1.4:3000/api"
// src/api/apiUrl.js or wherever this is defined


// export const apiUrl = {
//   baseUrl: "http://192.168.1.12:3000/api", // <-- Updated with backend laptop's IP and port

//   auth: {
//     login: "/auth/login",
//     register: "/auth/signup",
//     forgotPassword: "/auth/forgot-password",
//     resetPassword: "/auth/reset-password",
//     verifyOtp: "/auth/login/verify-otp",
//     sendOtp: "/auth/login/send-otp",
//     changePassword: "/auth/change-password",
//   },
  
//   user: {
//     profile: "/user/profile",
//   },
// };

// export const apiUtl = {
//   baseUrl: "http://192.168.1.12:3000/api", // <-- Updated too
// };https://b2ed85822fdf.ngrok-free.app/api

// export const apiUrl = {
//   baseUrl: "http://192.168.1.28:3000/api", 

//   auth: {
//     login: "/auth/login",
//     register: "/auth/signup",
//     forgotPassword: "/auth/forgot-password",
//     resetPassword: "/auth/reset-password",
//     verifyOtp: "/auth/login/verify-otp",
//     sendOtp: "/auth/login/send-otp",
//     changePassword: "/auth/change-password",
//   },
  
//   user: {
//     profile: "/user/profile",
//   },
// };

// export const apiUtl = {
//   baseUrl: "http://192.168.1.28:3000/api", 
// };

/**Before admin */
// export const apiUrl = {
//   baseUrl: "http://192.168.1.39:3000/api", // <-- Updated with backend laptop's IP and port

//   auth: {
//     login: "/auth/login",
//     register: "/auth/signup",
//     forgotPassword: "/auth/forgot-password",
//     resetPassword: "/auth/reset-password",
//     verifyOtp: "/auth/login/verify-otp",
//     sendOtp: "/auth/login/send-otp",
//     changePassword: "/auth/change-password",
//   },
  
//   user: {
//     profile: "/user/profile",
//   },
// };

// export const apiUtl = {
//   baseUrl: "http://192.168.1.39:3000/api", // <-- Updated too
// };



// src/api/apiUrl.js-after admin
export const apiUrl = {
  baseUrl: "http://192.168.1.19:3000/api", // ✅ Use your backend IP and port

  auth: {
    login: "/auth/login",
    register: "/auth/signup",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    verifyOtp: "/auth/login/verify-otp",
    sendOtp: "/auth/login/send-otp",
    changePassword: "/auth/change-password",
  },

  user: {
    profile: "/user/profile",
  },

  admin: {
    dashboardSummary: "/admin/dashboard-summary",
    coupons: {
      list: "/coupons",
      create: "/coupons",
      toggle: (id) => `/coupons/${id}/toggle`,
      delete: (id) => `/coupons/${id}`,
    },
  },

  coupon: {
    apply: "/coupons/apply", // user side
  },

  referrals: {
    all: "/referrals/all",
    generate: "/referrals/generate",
    reward: (id) => `/referrals/reward/${id}`, // <-- function
    delete: (id) => `/referrals/${id}`,
  },
  notifications: {
    list: "/notifications/admin/all",
    sendSingle: "/admin/users/send-message",
    sendBulk: "/admin/users/send-bulk-message",
  },


 analytics: {
    summary: '/analytics/summary',
    classesChart: '/analytics/classes/chart',
    enquiriesChart: '/analytics/enquiries/chart',
    usersChart: '/analytics/users/chart'
  }
};

export const apiUtl = {
  baseUrl: "http://192.168.1.19:3000/api",
};
