
import React, { useState, useEffect } from "react";
import { ArrowLeft, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../../../../api/apiclient";
import { apiUrl } from "../../../../../../api/apiUtl";
import Layout from "../../../layout/MainLayout";
import EnquiryFilterSidebar from "./EnuiryFilterSidebar";
import StudentCard from "./StudentCard";

const ShowAllEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    name: "",
    subjects: [],
    class: [],
    board: [],
    class_modes: [],
    location: "",
    hourly_charges_min: "",
    hourly_charges_max: "",
    gender: "Any",
  });
  const [showFilters, setShowFilters] = useState(false);
  const enquiriesPerPage = 9; // Show 9 cards per page
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnquiries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, enquiries]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`${apiUrl.baseUrl}/public/students`);
      
      // Handle different API response structures
      let enquiriesData = [];
      
      if (Array.isArray(response.data)) {
        enquiriesData = response.data;
      } else if (response.data && Array.isArray(response.data.enquiries)) {
        enquiriesData = response.data.enquiries;
      } else if (response.data && Array.isArray(response.data.students)) {
        enquiriesData = response.data.students;
      } else if (response.data && Array.isArray(response.data.data)) {
        enquiriesData = response.data.data;
      } else {
        console.warn("Unexpected API response structure:", response.data);
        enquiriesData = [];
      }
      
      setEnquiries(enquiriesData);
      setFilteredEnquiries(enquiriesData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(`Failed to load enquiries: ${err.response?.data?.message || err.message}`);
      setEnquiries([]);
      setFilteredEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...enquiries];

    // Filter by name
    if (filters.name) {
      filtered = filtered.filter(enquiry =>
        enquiry.name?.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    // Filter by subjects
    if (filters.subjects.length > 0) {
      filtered = filtered.filter(enquiry =>
        filters.subjects.some(subject =>
          enquiry.subjects?.some(s => s.toLowerCase().includes(subject.toLowerCase()))
        )
      );
    }

    // Filter by class
    if (filters.class.length > 0) {
      filtered = filtered.filter(enquiry =>
        filters.class.includes(enquiry.class)
      );
    }

    // Filter by board
    if (filters.board.length > 0) {
      filtered = filtered.filter(enquiry =>
        filters.board.includes(enquiry.board)
      );
    }

    // Filter by class modes
    if (filters.class_modes.length > 0) {
      filtered = filtered.filter(enquiry =>
        filters.class_modes.some(mode =>
          enquiry.class_modes?.some(cm => cm.toLowerCase().includes(mode.toLowerCase()))
        )
      );
    }

    // Filter by location - handle both string and object formats
    if (filters.location) {
      filtered = filtered.filter(enquiry => {
        const locationStr = formatLocation(enquiry.location).toLowerCase();
        // Handle location filter that could be string or object
        const filterLocation = typeof filters.location === 'string' 
          ? filters.location 
          : filters.location?.name || filters.location?.city || '';
        return locationStr.includes(filterLocation.toLowerCase());
      });
    }

    // Filter by budget range
    if (filters.hourly_charges_min) {
      filtered = filtered.filter(enquiry =>
        parseFloat(enquiry.hourly_charges || 0) >= parseFloat(filters.hourly_charges_min)
      );
    }

    if (filters.hourly_charges_max) {
      filtered = filtered.filter(enquiry =>
        parseFloat(enquiry.hourly_charges || 0) <= parseFloat(filters.hourly_charges_max)
      );
    }

    // Filter by gender
    if (filters.gender !== "Any") {
      filtered = filtered.filter(enquiry =>
        enquiry.gender?.toLowerCase() === filters.gender.toLowerCase()
      );
    }

    setFilteredEnquiries(filtered);
    setCurrentPage(1);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      name: "",
      subjects: [],
      class: [],
      board: [],
      class_modes: [],
      location: "",
      hourly_charges_min: "",
      hourly_charges_max: "",
      gender: "Any",
    };
    setFilters(clearedFilters);
  };

  const formatLocation = (location) => {
    if (!location) return "Location not specified";
    
    // Handle both object and string locations
    if (typeof location === 'object') {
      const { city, state } = location;
      if (!city && !state) return "Location not specified";
      return `${city || ""}${city && state ? ", " : ""}${state || ""}`;
    }
    
    // If location is a string
    return location || "Location not specified";
  };

  // Helper function to format location for display in active filters
  const formatFilterLocation = (location) => {
    if (!location) return "";
    
    if (typeof location === 'string') {
      return location;
    }
    
    // Handle location object
    if (location.city || location.state) {
      return `${location.city || ''}${location.city && location.state ? ', ' : ''}${location.state || ''}`;
    }
    
    return location.name || "";
  };

  // Pagination logic - with safe array access
  const indexOfLast = currentPage * enquiriesPerPage;
  const indexOfFirst = indexOfLast - enquiriesPerPage;
  const currentEnquiries = Array.isArray(filteredEnquiries) 
    ? filteredEnquiries.slice(indexOfFirst, indexOfLast)
    : [];
  const totalPages = Math.ceil((Array.isArray(filteredEnquiries) ? filteredEnquiries.length : 0) / enquiriesPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Render pagination buttons
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
        {/* Page Info */}
        <div className="text-sm text-gray-600">
          Showing {indexOfFirst + 1}-{Math.min(indexOfLast, filteredEnquiries.length)} of {filteredEnquiries.length} students
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>

          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              // Show first page, last page, and pages around current page
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border min-w-[40px] ${
                      currentPage === page
                        ? "bg-[#35BAA3] text-white border-[#35BAA3]"
                        : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2 py-2 text-gray-500">...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    );
  };

  // ✅ Loading State
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading all enquiries...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-xl shadow-md border border-red-200 max-w-md">
            <p className="text-lg font-bold text-red-600 mb-2">Error</p>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchEnquiries}
              className="bg-[#35BAA3] hover:bg-[#2da892] text-white px-5 py-2 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // ✅ Main UI
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Header - Centered with more spacing */}
          <div className="text-center mb-8 sm:mb-10 relative pt-10">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 flex items-center text-[#35BAA3] hover:text-[#2da892] font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>

            <div className="mx-auto px-4">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                All Student Enquiries
              </h1>
              <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                A complete list of students currently looking for tutors
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Filter Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <EnquiryFilterSidebar
                filters={filters}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Active Filters Display */}
              {Object.values(filters).some(val => 
                Array.isArray(val) ? val.length > 0 : val && val !== "Any"
              ) && (
                <div className="mb-6 p-4 bg-[#35BAA3] bg-opacity-10 rounded-lg border border-[#35BAA3] border-opacity-20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[#35BAA3]">Active Filters:</span>
                    <button
                      onClick={handleClearFilters}
                      className="text-xs text-[#35BAA3] hover:text-[#2da892] font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filters.name && (
                      <span className="inline-flex items-center px-3 py-1 bg-white text-[#35BAA3] rounded-full text-xs border border-[#35BAA3] border-opacity-30">
                        Name: {filters.name}
                      </span>
                    )}
                    {filters.subjects.map(subject => (
                      <span key={subject} className="inline-flex items-center px-3 py-1 bg-white text-[#35BAA3] rounded-full text-xs border border-[#35BAA3] border-opacity-30">
                        Subject: {subject}
                      </span>
                    ))}
                    {filters.class.map(grade => (
                      <span key={grade} className="inline-flex items-center px-3 py-1 bg-white text-[#35BAA3] rounded-full text-xs border border-[#35BAA3] border-opacity-30">
                        Class: {grade}
                      </span>
                    ))}
                    {filters.location && (
                      <span className="inline-flex items-center px-3 py-1 bg-white text-[#35BAA3] rounded-full text-xs border border-[#35BAA3] border-opacity-30">
                        Location: {formatFilterLocation(filters.location)}
                      </span>
                    )}
                    {(filters.hourly_charges_min || filters.hourly_charges_max) && (
                      <span className="inline-flex items-center px-3 py-1 bg-white text-[#35BAA3] rounded-full text-xs border border-[#35BAA3] border-opacity-30">
                        Budget: ₹{filters.hourly_charges_min || '0'} - ₹{filters.hourly_charges_max || '∞'}
                      </span>
                    )}
                    {filters.gender !== "Any" && (
                      <span className="inline-flex items-center px-3 py-1 bg-white text-[#35BAA3] rounded-full text-xs border border-[#35BAA3] border-opacity-30">
                        Gender: {filters.gender}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Enquiries Grid */}
              {!Array.isArray(filteredEnquiries) || filteredEnquiries.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
                  <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No enquiries found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {!Array.isArray(enquiries) || enquiries.length === 0 
                      ? "There are no student enquiries at the moment"
                      : "No students match your current filters."
                    }
                  </p>
                  {Array.isArray(enquiries) && enquiries.length > 0 && (
                    <button
                      onClick={handleClearFilters}
                      className="bg-[#35BAA3] hover:bg-[#2da892] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Student Cards Grid - Updated for 9 cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8">
                    {currentEnquiries.map((enquiry) => (
                      <StudentCard key={enquiry.id || enquiry._id || Math.random()} enquiry={enquiry} />
                    ))}
                  </div>

                  {/* Page Info */}
                  <div className="text-center mb-4">
                    <p className="text-gray-600 text-sm">
                      Page {currentPage} of {totalPages} • 
                      Showing {currentEnquiries.length} students on this page
                    </p>
                  </div>

                  {/* Pagination */}
                  {renderPagination()}

                  {/* Refresh Button */}
                  <div className="text-center mt-8">
                    <button
                      onClick={fetchEnquiries}
                      className="inline-flex items-center px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Refresh List
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShowAllEnquiries;
