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
  FiRefreshCw,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// Reusable EnquiryCard
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
      return (
        [city, state, country].filter(Boolean).join(", ") ||
        "Location not specified"
      );
    }
    return location || "Location not specified";
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return (
        "Today, " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } else if (diffDays === 1) {
      return (
        "Yesterday, " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
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
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
              {name}
            </h3>
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
              {learningMode === "online" ? (
                <FiMonitor size={16} className="flex-shrink-0" />
              ) : (
                <FiHome size={16} className="flex-shrink-0" />
              )}
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

// Main Page with Pagination
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

      // Always show only Student Enquiries
      const studentEnquiries = allEnquiries.filter(
        (enquiry) => enquiry.sender?.role?.toLowerCase() === "student"
      );

      const processed = studentEnquiries.map((enquiry) => ({
        id: enquiry.id,
        name: enquiry.sender?.name || "Unknown",
        subject: enquiry.subject || "N/A",
        className: enquiry.class || "N/A",
        location: enquiry.sender?.location || null,
        time: enquiry.created_at,
        learningMode: enquiry.learning_mode || "offline",
        email: enquiry.sender?.email,
        phone: enquiry.sender?.mobile_number,
        grade: enquiry.gradeLevel,
        budget: enquiry.budget,
        sender_id: enquiry.sender?.id,
        receiver_id: enquiry.receiver?.id,
      }));

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

  return (
    <div className="py-6 sm:py-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Student Enquiries
          </h1>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition text-sm"
            >
              Back
            </button>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              <FiRefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              {isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Enquiries */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : currentEnquiries.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {currentEnquiries.map((enquiry) => (
                <EnquiryCard
                  key={enquiry.id}
                  {...enquiry}
                  onRespond={() => handleRespond(enquiry)}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                <FiChevronLeft />
              </button>
              <span className="text-gray-600 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                <FiChevronRight />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-16">No student enquiries found.</div>
        )}
      </div>
    </div>
  );
};

export default AllEnquiriesPage;
