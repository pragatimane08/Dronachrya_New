// enquiryRepository.js
import { apiClient } from "../../apiclient";
import { apiUrl } from "../../apiUtl";
export const EnquiryRepository = {
  /**
   * Fetch all student enquiries
   */
  async fetchEnquiries() {
    try {
      const response = await apiClient.get('/admin/enquiries');
      return response.data;
    } catch (error) {
      console.error('Repository: Fetch enquiries error:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch student enquiries'
      );
    }
  },

  /**
   * Update enquiry status
   */
  async updateEnquiryStatus(enquiryId, statusData) {
    try {
      const response = await apiClient.patch(`/admin/enquiries/${enquiryId}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error('Repository: Update enquiry status error:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to update enquiry status'
      );
    }
  },

  /**
   * Delete an enquiry
   */
  async deleteEnquiry(enquiryId) {
    try {
      const response = await apiClient.delete(`/admin/enquiries/${enquiryId}`);
      return response.data;
    } catch (error) {
      console.error('Repository: Delete enquiry error:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to delete enquiry'
      );
    }
  },

  /**
   * Business Logic Methods
   */

  /**
   * Filter enquiries based on criteria
   */
  filterEnquiries(enquiries, filters) {
    if (!enquiries || !Array.isArray(enquiries)) {
      return [];
    }

    return enquiries.filter(enq => {
      // Search filter
      if (filters.search && filters.search.trim()) {
        const searchLower = filters.search.toLowerCase().trim();
        const nameMatch = enq.name?.toLowerCase().includes(searchLower);
        const subjectMatch = enq.subjects?.some(s => 
          s.toLowerCase().includes(searchLower)
        );
        const locationMatch = enq.location?.city?.toLowerCase().includes(searchLower) ||
                             enq.location?.state?.toLowerCase().includes(searchLower);
        
        if (!nameMatch && !subjectMatch && !locationMatch) {
          return false;
        }
      }

      // Status filter
      if (filters.status && filters.status !== 'all') {
        if (enq.user?.status !== filters.status) return false;
      }

      // Class filter
      if (filters.class && filters.class !== 'all') {
        if (!enq.class || !enq.class.toLowerCase().includes(filters.class.toLowerCase())) {
          return false;
        }
      }

      // Location filter
      if (filters.location && filters.location !== 'all') {
        if (!enq.location || enq.location.state !== filters.location) return false;
      }

      return true;
    });
  },

  /**
   * Sort enquiries
   */
  sortEnquiries(enquiries, sortBy) {
    if (!enquiries || !Array.isArray(enquiries)) {
      return [];
    }

    const sorted = [...enquiries];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case 'charges_high':
        return sorted.sort((a, b) => 
          parseFloat(b.hourly_charges || 0) - parseFloat(a.hourly_charges || 0)
        );
      case 'charges_low':
        return sorted.sort((a, b) => 
          parseFloat(a.hourly_charges || 0) - parseFloat(b.hourly_charges || 0)
        );
      case 'name_asc':
        return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'name_desc':
        return sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      default:
        return sorted;
    }
  },

  /**
   * Calculate statistics
   */
  getStats(enquiries) {
    if (!enquiries || !Array.isArray(enquiries)) {
      return { total: 0, verified: 0, pending: 0, notRegistered: 0 };
    }

    const total = enquiries.length;
    const verified = enquiries.filter(e => e.user?.status === 'verified').length;
    const pending = enquiries.filter(e => e.user?.status === 'pending').length;
    const notRegistered = enquiries.filter(e => 
      e.user?.status === 'not registered' || !e.user?.status
    ).length;

    return { total, verified, pending, notRegistered };
  },

  /**
   * Get unique locations from enquiries
   */
  getUniqueLocations(enquiries) {
    if (!enquiries || !Array.isArray(enquiries)) {
      return [];
    }

    const states = new Set();
    enquiries.forEach(enq => {
      if (enq.location?.state) {
        states.add(enq.location.state);
      }
    });
    return Array.from(states).sort();
  },

  /**
   * Get unique classes from enquiries
   */
  getUniqueClasses(enquiries) {
    if (!enquiries || !Array.isArray(enquiries)) {
      return [];
    }

    const classes = new Set();
    enquiries.forEach(enq => {
      if (enq.class) {
        classes.add(enq.class);
      }
    });
    return Array.from(classes).sort();
  },

  /**
   * Format enquiry for display
   */
  formatEnquiryForDisplay(enquiry) {
    return {
      ...enquiry,
      displayName: enquiry.name || 'Unknown Student',
      displayClass: enquiry.class || 'Not specified',
      displayLocation: enquiry.location ? 
        `${enquiry.location.city || ''}, ${enquiry.location.state || ''}`.replace(/^, |, $/g, '').trim() : 
        'Location not specified',
      displayCharges: `₹${parseFloat(enquiry.hourly_charges || 0).toFixed(2)}/hr`,
      formattedDate: new Date(enquiry.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };
  }
};

export default EnquiryRepository;
