// src/api/repository/enquiry.repository.js
import { apiClient } from '../apiclient';

export const enquiryRepository = {
  sendEnquiry: (payload) => apiClient.post('/enquiries', payload),

  getAll: () => apiClient.get('/enquiries'), // Returns { sent: [...], received: [...] }

  updateStatus: (enquiryId, payload) =>
    apiClient.patch(`/enquiries/${enquiryId}/status`, payload),

  getMessages: (enquiryId) =>
    apiClient.get(`/enquiries/${enquiryId}/messages`),

  sendMessage: (enquiryId, payload) =>
    apiClient.post(`/enquiries/${enquiryId}/messages`, payload),
};

