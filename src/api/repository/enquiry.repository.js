// src/api/repository/enquiry.repository.js
import axios from '../../axiosInstance';
export const enquiryRepository = {
  getAll: () => axios.get('/enquiries'),
  getMessages: (enquiryId) => axios.get(`/enquiries/${enquiryId}/messages`),
  sendMessage: (enquiryId, payload) => axios.post(`/enquiries/${enquiryId}/messages`, payload),
  updateStatus: (enquiryId, payload) => axios.patch(`/enquiries/${enquiryId}/status`, payload)
};