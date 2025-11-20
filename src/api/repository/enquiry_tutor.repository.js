import { apiClient } from '../apiclient';

export const enquiryRepository = {
  // Send new enquiry
  sendEnquiry: (payload) => {
    console.log('📤 Sending enquiry:', payload);
    return apiClient.post('/enquiries', payload);
  },

  // Get all enquiries
  getAll: () => {
    console.log('📥 Fetching all enquiries');
    return apiClient.get('/enquiries');
  },

  // Get follow-up enquiries
  getFollowUp: () => {
    console.log('📥 Fetching follow-up enquiries');
    return apiClient.get('/enquiries/followup');
  },

  // Update enquiry status
  updateStatus: (enquiryId, payload) => {
    console.log(`🔄 PATCH /enquiries/${enquiryId}/status:`, payload);
    return apiClient.patch(`/enquiries/${enquiryId}/status`, payload);
  },

  // Check sender subscription
  checkSubscription: () => {
    console.log('💰 Checking subscription status');
    return apiClient.get('/enquiries/check-sender-subscription');
  },

  // Get recent enquiries
  getRecent: () => {
    console.log('📥 Fetching recent enquiries');
    return apiClient.get('/enquiries/recent');
  },

  // Accept enquiry
  acceptEnquiry: async (enquiryId, responseMessage = "Enquiry accepted") => {
    try {
      console.log(`✅ Accepting enquiry ${enquiryId}`);
      const response = await apiClient.patch(`/enquiries/${enquiryId}/status`, {
        status: "accepted",
        response_message: responseMessage,
      });
      console.log(`✅ Enquiry ${enquiryId} accepted successfully`);
      return response;
    } catch (error) {
      console.error(`❌ Failed to accept enquiry ${enquiryId}:`, error);
      throw error;
    }
  },

  // Reject enquiry
  rejectEnquiry: async (enquiryId, responseMessage = "Enquiry rejected") => {
    try {
      console.log(`❌ Rejecting enquiry ${enquiryId}`);
      const response = await apiClient.patch(`/enquiries/${enquiryId}/status`, {
        status: "rejected",
        response_message: responseMessage,
      });
      console.log(`❌ Enquiry ${enquiryId} rejected successfully`);
      return response;
    } catch (error) {
      console.error(`❌ Failed to reject enquiry ${enquiryId}:`, error);
      throw error;
    }
  },

  // ✅ CORRECTED: Get enquiry messages
  getMessages: (enquiryId) => {
    console.log(`📨 Fetching messages for enquiry ${enquiryId}`);
    return apiClient.get(`/enquiries/${enquiryId}/messages`);
  },

  // ✅ CORRECTED: Send message to enquiry
  sendMessage: (enquiryId, payload) => {
    console.log(`✉️ Sending message to enquiry ${enquiryId}:`, payload);
    return apiClient.post(`/enquiries/${enquiryId}/messages`, payload);
  }
};
