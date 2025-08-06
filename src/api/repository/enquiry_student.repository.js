// src/api/repository/enquiry.repository.js
import axios from '../../axiosInstance';

export const enquiryRepository = {
  getAll: () => axios.get('/enquiries'),

  getMessages: (enquiryId, params = {}) =>
    axios.get(`/enquiries/${enquiryId}/messages`, { params }),

  sendMessage: (enquiryId, payload) =>
    axios.post(`/enquiries/${enquiryId}/messages`, payload),
};s