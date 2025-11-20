import React, { useEffect, useState } from "react";
import { enquiryRepository } from "../../../../../api/repository/enquiry_tutor.repository";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FiMessageSquare,
  FiCheck,
  FiX,
  FiClock,
  FiUser,
  FiMapPin,
  FiBook,
  FiUsers,
  FiEye,
  FiChevronUp,
  FiChevronDown,
  FiPhone,
  FiMail,
  FiSend,
  FiAlertCircle,
  FiDollarSign,
  FiCalendar,
  FiAward,
  FiMap
} from "react-icons/fi";

const FromStudentEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [activeTab, setActiveTab] = useState("enquiries");
  const [loading, setLoading] = useState(true);
  const [expandedEnquiry, setExpandedEnquiry] = useState(null);
  const navigate = useNavigate();

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
   
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? "Not available"
        : date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
    } catch (error) {
      return "Not available";
    }
  };

  // Format location function
  const formatLocation = (location) => {
    if (!location) return "Location not specified";
   
    if (typeof location === 'object') {
      const { city, state, country } = location;
      return [city, state, country].filter(Boolean).join(', ');
    }
   
    return location;
  };

  // Get time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return "Recently";
   
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
   
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Format budget display
  const formatBudget = (hourlyCharges) => {
    if (!hourlyCharges || hourlyCharges === 0) {
      return "Not specified";
    }
    return `₹${parseInt(hourlyCharges)}/hour`;
  };

  // Check if enquiry is from student (not from tutor)
  const isStudentEnquiry = (enquiry) => {
    return enquiry.sender && enquiry.sender.role !== 'tutor';
  };

  // Fetch all enquiries and filter only student enquiries
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await enquiryRepository.getAll();

      // Process enquiries according to backend response structure
      const allEnquiries = (response.data.enquiries || []).map((enquiry) => ({
        id: enquiry.id,
        name: enquiry.sender?.name || "Unknown Student",
        subject: enquiry.subject || "No Subject",
        className: enquiry.class || "Not specified",
        time: enquiry.created_at,
        location: enquiry.sender?.profile?.Location || null,
        status: enquiry.status || "pending",
        sender_id: enquiry.sender?.id,
        receiver_id: enquiry.receiver?.id,
        response_message: enquiry.response_message,
        hasConversationStarted: enquiry.hasConversationStarted || enquiry.status === "accepted",
        profile_photo: enquiry.sender?.profile?.profile_photo,
        subjects: enquiry.sender?.profile?.subjects || [],
        board: enquiry.sender?.profile?.board || "Not specified",
        hourly_charges: enquiry.sender?.profile?.hourly_charges || 0,
        learning_mode: enquiry.sender?.profile?.class_modes?.[0] || "Not specified",
        start_timeline: enquiry.sender?.profile?.availability?.[0] || "Flexible",
        // Additional fields from backend
        sender: enquiry.sender,
        receiver: enquiry.receiver,
        // Add role information for filtering
        sender_role: enquiry.sender?.role,
        receiver_role: enquiry.receiver?.role
      }));

      // Filter only student enquiries (enquiries sent by students to tutors)
      const studentEnquiries = allEnquiries.filter(isStudentEnquiry);
      setEnquiries(studentEnquiries);
    } catch (err) {
      toast.error("Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  // Handle accept/reject enquiry
  const handleRespond = async (enquiry, action) => {
    try {     
      let responseMessage = "";
      let newStatus = "";

      if (action === "accept") {
        newStatus = "accepted";
        responseMessage = "I'd be happy to help you with this subject!";
      } else {
        newStatus = "rejected";
        responseMessage = "Unfortunately I'm not available for this subject at the moment.";
      }

      // Update status in backend
      await enquiryRepository.updateStatus(enquiry.id, {
        status: newStatus,
        response_message: responseMessage
      });

      toast.success(`Enquiry ${newStatus} successfully`);
     
      // Update local state immediately
      setEnquiries(prevEnquiries =>
        prevEnquiries.map(item =>
          item.id === enquiry.id
            ? {
                ...item,
                status: newStatus,
                response_message: responseMessage,
                hasConversationStarted: newStatus === "accepted"
              }
            : item
        )
      );

      // If accepted, navigate to messaging and refresh follow-up tab
      if (action === "accept") {
        setTimeout(() => {
          setActiveTab("followup");
        }, 1000);
       
        navigate(`/message_tutor?id=${enquiry.id}&sender=${enquiry.sender_id}&receiver=${enquiry.receiver_id}`);
      }

    } catch (error) {
      toast.error(`Failed to ${action} enquiry`);
    }
  };

  // Toggle expanded view
  const handleToggleDetails = (enquiry) => {
    if (expandedEnquiry?.id === enquiry.id) {
      setExpandedEnquiry(null);
    } else {
      setExpandedEnquiry(enquiry);
    }
  };

  // Fetch data based on active tab
  useEffect(() => {
    fetchEnquiries();
  }, [activeTab]);

  // Filter enquiries based on status
  const newEnquiries = enquiries.filter(enquiry =>
    enquiry.status === "pending" || enquiry.status === "rejected"
  );
 
  const followUpEnquiries = enquiries.filter(enquiry =>
    enquiry.status === "accepted" && enquiry.hasConversationStarted
  );

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: FiClock },
      accepted: { color: "bg-green-100 text-green-800 border-green-200", icon: FiCheck },
      rejected: { color: "bg-red-100 text-red-800 border-red-200", icon: FiX }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <section className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Enquiries</h1>
          <p className="text-gray-600">Manage your incoming student enquiries and ongoing conversations</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("enquiries")}
              className={`flex-1 px-6 py-4 font-medium text-sm border-b-2 transition-colors flex items-center justify-center gap-2 ${
                activeTab === "enquiries"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FiMessageSquare className="w-4 h-4" />
              New Student Enquiries
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs min-w-6">
                {newEnquiries.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("followup")}
              className={`flex-1 px-6 py-4 font-medium text-sm border-b-2 transition-colors flex items-center justify-center gap-2 ${
                activeTab === "followup"
                  ? "border-green-500 text-green-600 bg-green-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FiUsers className="w-4 h-4" />
              Follow-up Conversations
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs min-w-6">
                {followUpEnquiries.length}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "enquiries" ? (
              newEnquiries.length > 0 ? (
                <div className="space-y-6">
                  {newEnquiries.map((enquiry) => (
                    <EnquiryCard
                      key={enquiry.id}
                      enquiry={enquiry}
                      onAccept={() => handleRespond(enquiry, "accept")}
                      onReject={() => handleRespond(enquiry, "reject")}
                      onToggleDetails={() => handleToggleDetails(enquiry)}
                      isExpanded={expandedEnquiry?.id === enquiry.id}
                      StatusBadge={StatusBadge}
                      formatDate={formatDate}
                      formatLocation={formatLocation}
                      getTimeAgo={getTimeAgo}
                      formatBudget={formatBudget}
                      type="new"
                      navigate={navigate}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<FiMessageSquare className="w-16 h-16" />}
                  title="No new student enquiries"
                  message="You don't have any new student enquiries at the moment."
                />
              )
            ) : (
              <FollowUpTab
                enquiries={followUpEnquiries}
                navigate={navigate}
                StatusBadge={StatusBadge}
                formatDate={formatDate}
                formatLocation={formatLocation}
                getTimeAgo={getTimeAgo}
                formatBudget={formatBudget}
                onToggleDetails={handleToggleDetails}
                expandedEnquiry={expandedEnquiry}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Enquiry Card Component
const EnquiryCard = ({
  enquiry,
  onAccept,
  onReject,
  onToggleDetails,
  isExpanded,
  StatusBadge,
  formatDate,
  formatLocation,
  getTimeAgo,
  formatBudget,
  type = "new", // "new" or "followup"
  navigate
}) => {
  const isFollowUp = type === "followup";
 
  // Handle continue conversation
  const handleContinueConversation = () => {
    navigate(`/message_tutor?id=${enquiry.id}&sender=${enquiry.sender_id}&receiver=${enquiry.receiver_id}`);
  };

  // Handle open chat from expanded view
  const handleOpenChat = () => {
    navigate(`/message_tutor?id=${enquiry.id}&sender=${enquiry.sender_id}&receiver=${enquiry.receiver_id}`);
  };
 
  return (
    <div className={`bg-white rounded-lg border hover:shadow-md transition-all overflow-hidden ${
      isFollowUp ? "border-green-200" : "border-gray-200"
    }`}>
      {/* Main Card Content */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Student Info */}
          <div className="flex-1">
            <div className="flex items-start gap-4">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {enquiry.profile_photo ? (
                  <img
                    src={enquiry.profile_photo}
                    alt={enquiry.name}
                    className="w-14 h-14 rounded-full object-cover border-2 shadow-sm"
                  />
                ) : (
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow ${
                    isFollowUp
                      ? "bg-gradient-to-br from-green-500 to-teal-600"
                      : "bg-gradient-to-br from-blue-500 to-purple-600"
                  }`}>
                    <FiUser className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
             
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {enquiry.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={enquiry.status} />
                    {isFollowUp && (
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded font-medium">
                        Ongoing Conversation
                      </span>
                    )}
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {getTimeAgo(isFollowUp ? enquiry.updated_at || enquiry.time : enquiry.time)}
                    </span>
                  </div>
                </div>
               
                {/* Quick Info Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    <FiBook className="w-3 h-3 mr-1" />
                    Class: {enquiry.className}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    <FiAward className="w-3 h-3 mr-1" />
                    Board: {enquiry.board}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                    <FiDollarSign className="w-3 h-3 mr-1" />
                    Budget: {formatBudget(enquiry.hourly_charges)}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                    <FiMapPin className="w-3 h-3 mr-1" />
                    {formatLocation(enquiry.location)}
                  </span>
                </div>

                {/* Primary Subject */}
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700">Primary Subject:</p>
                  <p className="text-lg font-semibold text-gray-900">{enquiry.subject}</p>
                </div>

                {/* Additional Subjects */}
                {enquiry.subjects && enquiry.subjects.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">All Subjects:</p>
                    <div className="flex flex-wrap gap-2">
                      {enquiry.subjects.slice(0, 4).map((subject, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                        >
                          {subject}
                        </span>
                      ))}
                      {enquiry.subjects.length > 4 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                          +{enquiry.subjects.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Initial Response for Follow-up */}
                {isFollowUp && enquiry.response_message && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-800 mb-1">Your Initial Response:</p>
                    <p className="text-green-700 text-sm">{enquiry.response_message}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 min-w-[200px]">
            <button
              onClick={onToggleDetails}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {isExpanded ? (
                <FiChevronUp className="w-4 h-4" />
              ) : (
                <FiEye className="w-4 h-4" />
              )}
              {isExpanded ? "Less Details" : "View Details"}
            </button>
           
            {/* Action Buttons - Different for new vs follow-up */}
            {!isFollowUp ? (
              // New Enquiry Actions
              <>
                {enquiry.status === "pending" && (
                  <>
                    <button
                      onClick={onAccept}
                      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                      <FiCheck className="w-4 h-4" />
                      Accept Enquiry
                    </button>
                   
                    <button
                      onClick={onReject}
                      className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                      <FiX className="w-4 h-4" />
                      Reject Enquiry
                    </button>
                  </>
                )}

                {/* Show response message if enquiry was responded to */}
                {enquiry.status !== "pending" && enquiry.response_message && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-800 mb-1">Your Response:</p>
                    <p className="text-sm text-blue-700">{enquiry.response_message}</p>
                  </div>
                )}
              </>
            ) : (
              // Follow-up Actions
              <button
                onClick={handleContinueConversation}
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <FiMessageSquare className="w-4 h-4" />
                Continue Conversation
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Details Section */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-6 animate-fade-in">
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-4">Student Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-sm font-medium text-gray-700">Student Name</label>
                  <p className="mt-1 text-gray-900">{enquiry.name || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Class/Grade</label>
                  <p className="mt-1 text-gray-900">{enquiry.className || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Educational Board</label>
                  <p className="mt-1 text-gray-900">{enquiry.board || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Learning Mode</label>
                  <p className="mt-1 text-gray-900">{enquiry.learning_mode || "Not specified"}</p>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-3">Location</h4>
              <p className="text-gray-900 text-sm">{formatLocation(enquiry.location)}</p>
            </div>

            {/* Subjects & Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-3">Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {(enquiry.subjects || []).map((subject, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {subject}
                    </span>
                  ))}
                  {(!enquiry.subjects || enquiry.subjects.length === 0) && (
                    <p className="text-gray-500 text-sm">No subjects specified</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-3">Budget</h4>
                <p className="text-xl font-bold text-green-700">
                  {formatBudget(enquiry.hourly_charges)}
                </p>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-3">Additional Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-gray-700">Start Timeline</label>
                  <p className="mt-1 text-gray-900">{enquiry.start_timeline || "Not specified"}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Enquiry Received</label>
                  <p className="mt-1 text-gray-900">
                    {formatDate(isFollowUp ? enquiry.updated_at || enquiry.time : enquiry.time)}
                  </p>
                </div>
              </div>
            </div>

            {/* Response Message */}
            {enquiry.response_message && (
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-3">Your Response</h4>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-gray-700">{enquiry.response_message}</p>
                </div>
              </div>
            )}

            {/* Conversation Status for Follow-up */}
            {isFollowUp && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-2">Conversation Status</h4>
                  <p className="text-green-700 font-medium">
                    Active conversation - Last updated {getTimeAgo(enquiry.updated_at || enquiry.time)}
                  </p>
                </div>
                <button
                  onClick={handleOpenChat}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                >
                  <FiMessageSquare className="w-4 h-4" />
                  Open Chat
                </button>
              </div>
            )}

            {/* Close Button */}
            <div className="flex justify-end pt-4 border-t border-gray-300">
              <button
                onClick={onToggleDetails}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-4 h-4" />
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Follow-up Tab Component
const FollowUpTab = ({
  enquiries,
  navigate,
  StatusBadge,
  formatDate,
  formatLocation,
  getTimeAgo,
  formatBudget,
  onToggleDetails,
  expandedEnquiry
}) => {
  if (enquiries.length === 0) {
    return (
      <EmptyState
        icon={<FiUsers className="w-16 h-16" />}
        title="No follow-up conversations"
        message="Accepted student enquiries with ongoing conversations will appear here."
      />
    );
  }

  return (
    <div className="space-y-6">
      {enquiries.map((enquiry) => (
        <EnquiryCard
          key={enquiry.id}
          enquiry={enquiry}
          onToggleDetails={() => onToggleDetails(enquiry)}
          isExpanded={expandedEnquiry?.id === enquiry.id}
          StatusBadge={StatusBadge}
          formatDate={formatDate}
          formatLocation={formatLocation}
          getTimeAgo={getTimeAgo}
          formatBudget={formatBudget}
          type="followup"
          navigate={navigate}
        />
      ))}
    </div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <section className="bg-gray-50 min-h-screen py-8">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tabs Skeleton */}
        <div className="flex border-b border-gray-200">
          {[1, 2].map((item) => (
            <div key={item} className="flex-1 px-6 py-4">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="p-6">
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                        <div className="h-6 bg-gray-200 rounded w-24"></div>
                        <div className="h-6 bg-gray-200 rounded w-28"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Empty State Component
const EmptyState = ({ icon, title, message }) => (
  <div className="text-center py-12">
    <div className="text-gray-300 mb-4 mx-auto w-16 h-16">
      {icon}
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      {title}
    </h3>
    <p className="text-gray-500 max-w-md mx-auto">
      {message}
    </p>
  </div>
);

export default FromStudentEnquiry;