// // import { apiClient } from "../../apiclient";
// // import { apiUrl } from "../../apiUtl";

// // export const notificationRepository = {
// //   getAll: async () => {
// //     const { data } = await apiClient.get(apiUrl.notifications.list);
// //     return data.notifications || [];
// //   },

// //   sendSingle: async (payload) => {
// //     const { data } = await apiClient.post(apiUrl.notifications.sendSingle, payload);
// //     return data;
// //   },

// //   sendBulk: async (payload) => {
// //     const { data } = await apiClient.post(apiUrl.notifications.sendBulk, payload);
// //     return data;
// //   },
// // };

// import { apiClient } from "../../apiclient";
// import { apiUrl } from "../../apiUtl";

// export const notificationRepository = {
//   getAll: async () => {
//     const { data } = await apiClient.get(apiUrl.notifications.list);
//     return data.notifications || [];
//   },

//   sendSingle: async (payload) => {
//     const { data } = await apiClient.post(apiUrl.notifications.sendSingle, payload);
//     return data;
//   },

//   sendBulk: async (payload) => {
//     const { data } = await apiClient.post(apiUrl.notifications.sendBulk, payload);
//     return data;
//   },
// };

import { apiClient } from "../../apiclient";
import { apiUrl } from "../../apiUtl";

export const notificationRepository = {
  getAll: async () => {
    const { data } = await apiClient.get(apiUrl.notifications.list);
    return data.notifications || [];
  },

  sendSingle: async (payload) => {
    const { data } = await apiClient.post(apiUrl.notifications.sendSingle, payload);
    return data;
  },

  sendBulk: async (payload) => {
    const { data } = await apiClient.post(apiUrl.notifications.sendBulk, payload);
    return data;
  },
};
