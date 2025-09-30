import React, { useEffect, useState } from "react";
import { enquiryRepository } from "../../../../api/repository/enquiry_tutor.repository";
import { toast } from "react-toastify";
import {
  FiUser,
  FiMapPin,
  FiClock,
  FiMonitor,
  FiHome,
  FiMail,
  FiPhone,
  FiBookOpen,
  FiDollarSign,
  FiBook,
  FiMessageSquare,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// ✅ Reusable EnquiryCard
const EnquiryCard = ({
  id,
  name,
  subject,
  className,
  location,
  time,
  learningMode,
  email,
  phone,
  grade,
  budget,
  onRespond,
}) => {
  const formatLocation = () => {
    if (typeof location === "object" && location !== null) {
      const { city, state, country } = location;
      return [city, state, country].filter(Boolean).join(", ") || "Location not specified";
    }
    return location || "Location not specified";
  };

  // Format date to be more mobile-friendly
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today, " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return "Yesterday, " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md p-4 sm:p-5 border border-gray-100 transition-all w-full flex flex-col justify-between">
      <div className="space-y-3 sm:space-y-4">
        {/* Name + Subject */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="bg-teal-100 text-teal-600 p-2 sm:p-3 rounded-full flex-shrink-0">
            <FiUser size={18} className="sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{name}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <FiBook size={14} />
              <span className="truncate">{subject || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 text-sm text-gray-700">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FiBookOpen size={16} className="flex-shrink-0" />
              <span className="truncate">Class: {className || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              {learningMode === "online" ? 
                <FiMonitor size={16} className="flex-shrink-0" /> : 
                <FiHome size={16} className="flex-shrink-0" />
              }
              <span className="truncate">
                {learningMode === "online" ? "Online Classes" : "Offline Classes"}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <FiMapPin size={16} className="flex-shrink-0 mt-0.5" />
              <span className="break-words line-clamp-2">{formatLocation()}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock size={16} className="flex-shrink-0" />
              <span className="truncate">{formatTime(time)}</span>
            </div>
          </div>

          <div className="space-y-2">
            {email && (
              <div className="flex items-center gap-2">
                <FiMail size={16} className="flex-shrink-0" />
                <span className="truncate">{email}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2">
                <FiPhone size={16} className="flex-shrink-0" />
                <span className="truncate">{phone}</span>
              </div>
            )}
            {grade && (
              <div className="flex items-center gap-2">
                <FiBook size={16} className="flex-shrink-0" />
                <span className="truncate">Grade: {grade}</span>
              </div>
            )}
            {budget && (
              <div className="flex items-center gap-2">
                <FiDollarSign size={16} className="flex-shrink-0" />
                <span className="truncate">Budget: {budget}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 text-right">
        <button
          onClick={onRespond}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium transition flex items-center justify-center w-full sm:w-auto"
        >
          <FiMessageSquare className="inline-block mr-2" size={16} />
          Respond Now
        </button>
      </div>
    </div>
  );
};

// ✅ Main Page with Improved Pagination
const AllEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const enquiriesPerPage = 6;

  const navigate = useNavigate();

  const fetchAll = async () => {
    try {
      setIsLoading(true);
      const res = await enquiryRepository.getAll();
      const allEnquiries = res?.data?.enquiries || [];

      const role = localStorage.getItem("role")?.toLowerCase();
      const userId = localStorage.getItem("user_id");

      const filtered = allEnquiries.filter((enquiry) =>
        role === "tutor"
          ? enquiry.receiver?.user_id == userId
          : enquiry.sender?.user_id == userId
      );

      const processed = filtered.map((enquiry) => {
        const isTutor = role === "tutor";
        const user = isTutor ? enquiry.sender : enquiry.receiver;

        return {
          id: enquiry.id,
          name: user?.name || "Unknown",
          subject: enquiry.subject || "N/A",
          className: enquiry.class || "N/A",
          location: user?.location || null,
          time: enquiry.created_at,
          learningMode: enquiry.learning_mode || "offline",
          email: user?.email,
          phone: user?.mobile_number,
          grade: enquiry.gradeLevel,
          budget: enquiry.budget,
          sender_id: enquiry.sender?.user_id,
          receiver_id: enquiry.receiver?.user_id,
        };
      });

      setEnquiries(processed);
    } catch (error) {
      toast.error("Failed to load enquiries");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Pagination logic
  const indexOfLast = currentPage * enquiriesPerPage;
  const indexOfFirst = indexOfLast - enquiriesPerPage;
  const currentEnquiries = enquiries.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(enquiries.length / enquiriesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleRespond = (enquiry) => {
    navigate(
      `/message_tutor?id=${enquiry.id}&sender=${enquiry.sender_id}&receiver=${enquiry.receiver_id}`
    );
  };

  const handleRefresh = () => {
    fetchAll();
  };

  // Generate page numbers to display (with ellipsis for many pages)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // If total pages is less than max visible, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're at the beginning
      if (currentPage <= 2) {
        endPage = 3;
      }
      
      // Adjust if we're at the end
      if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always include last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="py-6 sm:py-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            {localStorage.getItem("role")?.toLowerCase() === "tutor"
              ? "Student Enquiries"
              : "Tutor Enquiries"}
          </h1>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition text-sm sm:text-base"
            >
              Back
            </button>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-3 py-2 sm:px-4 sm:py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <FiRefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              {isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <>
            {/* Enquiries */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {currentEnquiries.length > 0 ? (
                currentEnquiries.map((enquiry) => (
                  <EnquiryCard
                    key={enquiry.id}
                    {...enquiry}
                    onRespond={() => handleRespond(enquiry)}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 sm:py-16 text-center">
                  <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm max-w-md mx-auto">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No enquiries found
                    </h3>
                    <p className="text-gray-500">You don't have any enquiries yet.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {enquiries.length > enquiriesPerPage && (
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs sm:text-sm text-gray-600">
                  Showing {indexOfFirst + 1} to {Math.min(indexOfLast, enquiries.length)} of {enquiries.length} enquiries
                </div>
                
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="p-1 sm:p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    aria-label="Previous page"
                  >
                    <FiChevronLeft size={16} className="sm:w-5 sm:h-5" />
                  </button>

                  <div className="flex items-center gap-1 flex-wrap justify-center">
                    {getPageNumbers().map((pageNumber, index) => (
                      pageNumber === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-1 sm:px-2 py-1 text-gray-500 text-sm">
                          ...
                        </span>
                      ) : (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md border flex items-center justify-center ${
                            currentPage === pageNumber
                              ? "bg-teal-600 text-white border-teal-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                          } transition text-xs sm:text-sm`}
                          aria-label={`Page ${pageNumber}`}
                          aria-current={currentPage === pageNumber ? 'page' : undefined}
                        >
                          {pageNumber}
                        </button>
                      )
                    ))}
                  </div>

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="p-1 sm:p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    aria-label="Next page"
                  >
                    <FiChevronRight size={16} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
                
                <div className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllEnquiriesPage;