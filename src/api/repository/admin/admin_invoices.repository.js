// src/api/repository/admin/admin_invoices.repository.js
import { apiClient } from "../../apiclient";
import Papa from "papaparse";

export const adminInvoiceRepository = {
  /**
   * Get all invoices by parsing CSV.
   */
  async getAllInvoices() {
    try {
      const response = await apiClient.get("/invoices/admin/csv", {
        responseType: "blob",
      });

      const text = await response.data.text(); // Convert blob to text
      const result = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
      });

      return { success: true, data: result.data };
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return { success: false, error };
    }
  },

  /**
   * Download invoice CSV file as blob.
   * Used for export only.
   */
  async downloadInvoiceCSV() {
    try {
      const response = await apiClient.get("/invoices/admin/csv", {
        responseType: "blob",
      });
      return response.data; // Blob object
    } catch (error) {
      console.error("Error downloading invoice CSV:", error);
      return null;
    }
  },
};
