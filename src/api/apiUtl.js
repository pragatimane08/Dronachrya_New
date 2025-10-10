export const apiUrl = {
  baseUrl: "http://15.206.81.98:3000/api",

  auth: {
    login: "/auth/login",
    register: "/auth/signup",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    changePassword: "/auth/change-password",

    // Pre-registration already handles OTP
    preRegisterStudent: "/auth/signup",
    verifyOtp: "/auth/login/verify-otp", // add this
    resendOtp: "/auth/signup/resend-otp",

    // Admin
    adminVerifyOtp: "/auth/verify-otp", // separate admin endpoint
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
    apply: "/referrals/apply", // Added missing apply endpoint
    reward: (id) => `/referrals/reward/${id}`,
    delete: (id) => `/referrals/${id}`,
  },

  notifications: {
    list: "/notifications/admin/all",
    sendSingle: "/admin/users/send-message",
    sendBulk: "/admin/users/send-bulk-message",
  },

  analytics: {
    summary: "/analytics/summary",
    classesChart: "/analytics/classes/chart",
    enquiriesChart: "/analytics/enquiries/chart",
    usersChart: "/analytics/users/chart",
  },

  invoices: {
    student: "/invoices/my",
    downloadPDF: (paymentId) => `/invoices/${paymentId}/pdf`,
  },

  search: {
    tutors: "/search/tutors", // GET with query params
  },
  recommendations: {
    tutors: "/recommendations/tutors/recommended", // GET with query params, requires auth
  },

  groups: {
    create: "/groups",
    getUserGroups: "/groups/my-groups",
    addMembers: "/groups/add-members",
    getMembers: (id) => `/groups/${id}/members`,
    scheduleClass: "/groups/schedule-class", // correct
    update: (id) => `/groups/${id}`,
    delete: (id) => `/groups/${id}`,
    removeMember: (groupId, userId) =>
      `/groups/${groupId}/remove-member/${userId}`, // added
    getAll: "/groups/admin/all", // <-- add this
    getClasses: (id) => `/groups/${id}/classes`,
      getScheduledClasses: "/groups/my-classes/scheduled"
  },
};

// ⚠️ This looks redundant. Keep only one (apiUrl). Remove this if not needed.
export const apiUtl = {
  baseUrl: "http://15.206.81.98:3000/api",
};
