// import { apiClient } from "../apiclient";
// import { apiUrl } from "../apiUtl";

// export const studentInvoiceRepository = {
//   getMyInvoices: async () => {
//     try {
//       const response = await apiClient.get(apiUrl.invoices.student);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   downloadInvaoicePDF: async (paymentId) => {
//     try {
//       const response = await apiClient.get(apiUrl.invoices.downloadPDF(paymentId), {
//         responseType: "blob",
//       });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
// };

import { apiClient } from "../apiclient";
import { apiUrl } from "../apiUtl";

export const studentInvoiceRepository = {
  getMyInvoices: async () => {
    try {
      const response = await apiClient.get(apiUrl.invoices.student);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  downloadInvoicePDF: async (paymentId) => {
    try {
      const response = await apiClient.get(apiUrl.invoices.downloadPDF(paymentId), {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
