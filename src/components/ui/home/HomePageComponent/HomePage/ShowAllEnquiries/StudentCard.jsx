
import React from "react";
import {
  MapPin,
  DollarSign,
  BookOpen,
  User,
  Monitor,
  Building,
  Calendar,
  Phone,
  Mail,
  Eye,
  X,
  AlertCircle,
} from "lucide-react";
import { apiClient } from "../../../../../../api/apiclient";
import { useNavigate } from "react-router-dom";

const StudentCard = ({ enquiry }) => {
  const [showContact, setShowContact] = React.useState(false);
  const [contactInfo, setContactInfo] = React.useState(null);
  const [loadingContact, setLoadingContact] = React.useState(false);
  const [contactError, setContactError] = React.useState("");
  const [showSubscribeMessage, setShowSubscribeMessage] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");

  const navigate = useNavigate();

  // Check if user is logged in and get role
  const isLoggedIn = () => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    return !!token;
  };

  const getUserRole = () => {
    return localStorage.getItem("role")?.toLowerCase() || sessionStorage.getItem("role")?.toLowerCase();
  };

  const formatLocation = (location) => {
    if (!location) return "Location not specified";
    const { city, state } = location;
    if (!city && !state) return "Location not specified";
    return `${city || ""}${city && state ? ", " : ""}${state || ""}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const showMessage = (message, type = "success") => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Check if student has valid user_id for contact viewing
  const hasValidStudentId = () => {
    return enquiry.user_id && enquiry.user_id !== "undefined" && enquiry.user_id !== "null";
  };

  const handleViewContact = async () => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    // Check if user is tutor
    if (getUserRole() !== 'tutor') {
      setContactError("Only tutors can view contact details");
      showMessage("Only tutors can view contact details", "error");
      return;
    }

    // Check if student has valid user_id
    if (!hasValidStudentId()) {
      setContactError("Student contact information is not available at the moment");
      showMessage("Student contact information is not available at the moment", "error");
      return;
    }

    try {
      setLoadingContact(true);
      setContactError("");
      
      const response = await apiClient.get(`/contacts/view/${enquiry.user_id}`);
      const { contact_info, contacts_remaining } = response.data;

      // Set contact information
      setContactInfo({
        phone: contact_info.mobile_number || contact_info.phone || "Not provided",
        email: contact_info.email || "Not provided"
      });

      setShowContact(true);
      setShowSubscribeMessage(false);

      showMessage(
        `Contact viewed successfully. Remaining views: ${contacts_remaining}`
      );
    } catch (error) {
      console.error("Failed to view contact:", error);

      if (error.response?.status === 403) {
        setShowSubscribeMessage(true);
        setShowContact(false);
        setContactError("Subscription required to view contact details");
      } else if (error.response?.status === 401) {
        // Unauthorized - redirect to login
        navigate('/login');
      } else if (error.response?.status === 404) {
        setContactError("Student contact information not found");
        showMessage("Student contact information not found", "error");
      } else {
        setContactError("Failed to load contact details. Please try again.");
        showMessage("Failed to load contact details. Please try again.", "error");
      }
    } finally {
      setLoadingContact(false);
    }
  };

  const handleHideContact = () => {
    setShowContact(false);
    setContactInfo(null);
    setContactError("");
  };

  const handleContactClick = () => {
    if (!isLoggedIn()) {
      // Redirect to login if not logged in
      navigate('/login');
      return;
    }

    if (getUserRole() === 'tutor') {
      if (showContact) {
        handleHideContact();
      } else {
        handleViewContact();
      }
    } else {
      // For non-tutor logged-in users
      setContactError("Only tutors can view contact details");
      showMessage("Only tutors can view contact details", "error");
    }
  };

  // Check if contact viewing is available for this student
  const isContactAvailable = () => {
    return hasValidStudentId();
  };

  // Get button text based on user state
  const getButtonText = () => {
    if (!isLoggedIn()) {
      return 'Login to View Contact';
    }

    const userRole = getUserRole();
    if (userRole !== 'tutor') {
      return 'Contact Student';
    }

    if (!isContactAvailable()) {
      return 'Contact Unavailable';
    }

    if (loadingContact) {
      return 'Loading...';
    }

    return showContact ? 'Hide Contact' : 'View Contact';
  };

  // Get button icon based on user state
  const getButtonIcon = () => {
    if (!isLoggedIn()) {
      return <User className="w-4 h-4" />;
    }

    const userRole = getUserRole();
    if (userRole !== 'tutor') {
      return <Mail className="w-4 h-4" />;
    }

    if (!isContactAvailable()) {
      return <AlertCircle className="w-4 h-4" />;
    }

    if (loadingContact) {
      return <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>;
    }

    return showContact ? <X className="w-4 h-4" /> : <Eye className="w-4 h-4" />;
  };

  // Get button styling based on state
  const getButtonStyle = () => {
    if (!isLoggedIn()) {
      return "bg-teal-500 hover:bg-teal-600 text-white"; // Changed to teal
    }

    const userRole = getUserRole();
    if (userRole !== 'tutor') {
      return "bg-teal-500 hover:bg-teal-600 text-white"; // Changed to teal
    }

    if (!isContactAvailable()) {
      return "bg-gray-400 text-white cursor-not-allowed";
    }

    if (loadingContact) {
      return "bg-gray-400 text-white cursor-not-allowed";
    }

    return "bg-teal-500 hover:bg-teal-600 text-white"; // Changed to teal
  };

  // Check if button should be disabled
  const isButtonDisabled = () => {
    if (!isLoggedIn()) return false;
    
    const userRole = getUserRole();
    if (userRole !== 'tutor') return false;
    
    return !isContactAvailable() || loadingContact;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow flex-shrink-0">
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                {enquiry.name || "Unknown Student"}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500">
                  {formatDate(enquiry.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects */}
        <div className="flex flex-wrap gap-1">
          {(enquiry.subjects || []).slice(0, 3).map((subject, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"
            >
              <BookOpen className="w-2 h-2 mr-1" />
              {subject}
            </span>
          ))}
          {(enquiry.subjects || []).length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
              +{(enquiry.subjects || []).length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1">
        {/* Success/Error Message */}
        {successMessage && (
          <div className={`p-2 border rounded-md text-xs text-center ${
            successMessage.includes("successfully") 
              ? "bg-green-100 border-green-400 text-green-700"
              : "bg-red-100 border-red-400 text-red-700"
          }`}>
            {successMessage}
          </div>
        )}

        {/* Class and Board */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="flex items-center text-xs sm:text-sm text-gray-700">
            <Building className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-500 flex-shrink-0" />
            <span className="font-medium truncate text-xs sm:text-sm">
              {enquiry.class || "Not specified"}
            </span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-700">
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-orange-500 flex-shrink-0" />
            <span className="truncate text-xs sm:text-sm">
              {enquiry.board || "Not specified"}
            </span>
          </div>
        </div>

        {/* Class Mode and Price */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="flex items-center text-xs sm:text-sm text-gray-700">
            <Monitor className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-blue-500 flex-shrink-0" />
            <span className="truncate text-xs sm:text-sm">
              {(enquiry.class_modes || []).length > 0
                ? enquiry.class_modes.join(", ")
                : "Not specified"}
            </span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-700">
            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-500 flex-shrink-0" />
            <span className="font-semibold text-green-700 whitespace-nowrap text-xs sm:text-sm">
              ₹{parseFloat(enquiry.hourly_charges || 0).toFixed(0)}/hour
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-xs sm:text-sm text-gray-700">
          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-red-500 flex-shrink-0" />
          <span className="truncate text-xs sm:text-sm">
            {formatLocation(enquiry.location)}
          </span>
        </div>

        {/* Timeline */}
        <div className="flex items-center text-xs sm:text-sm text-gray-700">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-indigo-500 flex-shrink-0" />
          <span className="truncate text-xs sm:text-sm">
            Starts: {enquiry.start_timeline || "Not specified"}
          </span>
        </div>

        {/* Contact Information - Shown when View Contact is clicked */}
        {showContact && contactInfo && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-200 animate-fade-in relative">
            <button
              onClick={handleHideContact}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-3 h-3" />
            </button>
            
            <div className="flex items-center text-xs sm:text-sm text-gray-700">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-500 flex-shrink-0" />
              <span className="font-medium min-w-[50px]">Phone:</span>
              <span className="ml-2 text-gray-900 font-mono">{contactInfo.phone}</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-700">
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500 flex-shrink-0" />
              <span className="font-medium min-w-[50px]">Email:</span>
              <span className="ml-2 text-gray-900 truncate">{contactInfo.email}</span>
            </div>
          </div>
        )}

        {/* Contact Error */}
        {contactError && (
          <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded-md text-xs text-center">
            {contactError}
          </div>
        )}

        {/* Contact Button */}
        <div className="pt-2 border-t border-gray-200 mt-2">
          <button 
            onClick={handleContactClick}
            disabled={isButtonDisabled()}
            className={`w-full py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all transform hover:scale-105 shadow-sm flex items-center justify-center gap-2 ${getButtonStyle()} ${
              isButtonDisabled() ? 'cursor-not-allowed opacity-70' : 'hover:-translate-y-0.5'
            }`}
          >
            {getButtonIcon()}
            {getButtonText()}
          </button>
          
          {/* Helper text for unavailable contacts */}
          {isLoggedIn() && getUserRole() === 'tutor' && !isContactAvailable() && (
            <p className="text-xs text-gray-500 text-center mt-2">
              This student's contact information is not available
            </p>
          )}
        </div>
      </div>

      {/* Subscription Modal */}
      {showSubscribeMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Subscription Required
              </h2>
              <p className="text-gray-600 mb-6">
                You need an active subscription to view student contact details. 
                Subscribe now to connect with students directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setShowSubscribeMessage(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => navigate("/tutor_subscription_plan")}
                  className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-medium"
                >
                  View Subscription Plans
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCard;
