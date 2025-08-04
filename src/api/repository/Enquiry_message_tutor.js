// src/api/repository/enquiry.repository.js
import { apiClient } from '../apiclient';

export const enquiryRepository = {
  // Create a new enquiry
  createEnquiry: (payload) => apiClient.post('/enquiries', payload),

  // Get all enquiries (both sent and received)
  getAllEnquiries: () => apiClient.get('/enquiries'),

  // Get messages for a specific enquiry
  getEnquiryMessages: (enquiryId) => 
    apiClient.get(`/enquiries/${enquiryId}/messages`),

  // Send a new message in an enquiry thread
  sendEnquiryMessage: (enquiryId, message) => 
    apiClient.post(`/enquiries/${enquiryId}/messages`, { content: message }),

  // Update enquiry status (accept/reject)
  updateEnquiryStatus: (enquiryId, status, responseMessage) =>
    apiClient.patch(`/enquiries/${enquiryId}/status`, {
      status,
      response_message: responseMessage
    }),

  // Get conversation list (for sidebar)
  getConversations: () => apiClient.get('/conversations'),

  // Start or get existing conversation
  getOrCreateConversation: (otherUserId) =>
    apiClient.post('/conversations', { other_user_id: otherUserId }),

  // Get conversation messages
  getConversationMessages: (conversationId) =>
    apiClient.get(`/conversations/${conversationId}/messages`),

  // Send message in conversation
  sendConversationMessage: (conversationId, message) =>
    apiClient.post(`/conversations/${conversationId}/messages`, { content: message })
};