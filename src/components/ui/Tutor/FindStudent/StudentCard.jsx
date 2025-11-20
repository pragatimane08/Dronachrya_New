import React, { useState, useEffect } from "react";
import {
  MapPin,
  Bookmark as BookmarkIcon,
  Clock,
  Eye,
  Phone,
  UserCheck,
  X,
  Send,
  Users,
} from "lucide-react";
import EnquiryModal from "./RaiseEnquiry";
import { apiClient } from "../../../../api/apiclient";
import { useNavigate } from "react-router-dom";
import DefaultProfile from "../../../../assets/img/user3.png";

const StudentCard = ({ student, onConnectionRequest, onBookmark, onViewProfile }) => {
  const [showContact, setShowContact] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showSubscribeMessage, setShowSubscribeMessage] = useState(false);

  const navigate = useNavigate();

  // ✅ Check if student is bookmarked on component mount
  useEffect(() => {
    checkBookmarkStatus();
  }, [student.user_id]);

  const checkBookmarkStatus = async () => {
    try {
      const response = await apiClient.get("/bookmarks");
      const bookmarks = response.data.bookmarks || [];
      const isCurrentlyBookmarked = bookmarks.some(
        (bookmark) => bookmark.bookmarked_user_id === student.user_id
      );
      setIsBookmarked(isCurrentlyBookmarked);
    } catch (error) {
      console.error("Failed to check bookmark status:", error);
    }
  };

  const subjects = Array.isArray(student.subjects)
    ? student.subjects.join(", ")
    : student.subjects;

  const classLabel = student.class;
  const location = student.Location
    ? `${student.Location.city}, ${student.Location.state}, ${student.Location.country}`
    : "N/A";

  // Get tutor contact count from backend
  const tutorContactCount = student.total_profile_contacts || 0;

  const showMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // ✅ View Contact
  const handleViewContact = async () => {
    try {
      const response = await apiClient.get(`/contacts/view/${student.user_id}`);
      const { contact_info, contacts_remaining } = response.data;

      student.User = {
        email: contact_info.email,
        mobile_number: contact_info.mobile_number,
      };

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
      } else {
        showMessage("Failed to view contact details. Please try again.");
      }
    }
  };

  const handleHideContact = () => setShowContact(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (onConnectionRequest) {
        onConnectionRequest(student.user_id, student.name);
        showMessage(`Connection request sent to ${student.name}`);
      }
    } catch (error) {
      console.error("Failed to send connection request:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleViewProfileClick = () => {
    if (onViewProfile) onViewProfile(student);
  };

  const handleBookmark = async () => {
    try {
      const newBookmarkState = !isBookmarked;

      await apiClient.post("/bookmarks/toggle", {
        bookmarked_user_id: student.user_id,
      });

      setIsBookmarked(newBookmarkState);

      if (onBookmark) await onBookmark(student.user_id, student.name);

      if (newBookmarkState) {
        showMessage("Student added to bookmarks");
      } else {
        showMessage("Student removed from bookmarks");
      }

      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Failed to update bookmark:", error);
      setIsBookmarked(!isBookmarked);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl p-4 sm:p-5 gap-4 sm:gap-5 w-full">
        {/* Profile Photo */}
        <div className="w-full sm:w-32 lg:w-40 flex-shrink-0">
          <img
            src={student.profile_photo || DefaultProfile}
            alt={student.name}
            className="w-full h-32 sm:h-36 lg:h-40 object-cover rounded-lg border cursor-pointer"
            onClick={handleViewProfileClick}
            onError={(e) => {
              e.target.src = DefaultProfile;
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 w-full min-w-0">
          {/* Success / Info Message */}
          {successMessage && (
            <div className="mb-3 p-2 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm text-center">
              {successMessage}
            </div>
          )}

          {/* Header with Save Option */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="cursor-pointer min-w-0" onClick={handleViewProfileClick}>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 hover:text-teal-600 transition-colors truncate">
                {student.name}
              </h2>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            </div>

            {/* Save Profile (Bookmark) */}
            <button
              onClick={handleBookmark}
              className={`p-1 rounded-full transition-colors ${
                isBookmarked
                  ? "text-teal-500 bg-teal-50"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <BookmarkIcon
                className="w-5 h-5"
                fill={isBookmarked ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Tutor Contact Count */}
          {/* <div className="mt-2 flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0" />
            <span>
              Contacted by <strong>{tutorContactCount}</strong> tutor{tutorContactCount !== 1 ? 's' : ''}
            </span>
          </div> */}

          {/* Contact Info */}
          {showContact && student.User && (
            <div className="mt-3 p-3 bg-teal-50 rounded-lg border border-teal-200 relative">
              <button
                onClick={handleHideContact}
                className="absolute top-2 right-2 text-teal-600 hover:text-teal-800"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-medium text-teal-800 mb-2 flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Contact Information
              </h3>
              <div className="space-y-2 text-sm">
                {student.User.email && (
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700">Email:</span>
                    <a
                      href={`mailto:${student.User.email}`}
                      className="text-teal-600 hover:text-teal-800 truncate"
                    >
                      {student.User.email}
                    </a>
                  </div>
                )}
                {student.User.mobile_number && (
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700">Phone:</span>
                    <a
                      href={`tel:${student.User.mobile_number}`}
                      className="text-teal-600 hover:text-teal-800"
                    >
                      {student.User.mobile_number}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info Grid */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1 sm:space-y-2">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Class:</span> {classLabel}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Subjects:</span> {subjects}
              </p>
            </div>
            <div className="space-y-1 sm:space-y-2">
              {student.start_timeline && (
                <p className="text-sm text-gray-700 flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0" />
                  <span className="font-medium">Start Plan:</span>{" "}
                  {student.start_timeline}
                </p>
              )}
              {student.class_modes && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Class Type:</span>{" "}
                  {student.class_modes.join(", ")}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row flex-wrap gap-2">
            <button
              onClick={showContact ? handleHideContact : handleViewContact}
              className="bg-teal-500 hover:bg-teal-600 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto flex items-center justify-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4" />
              {showContact ? "Hide Contact" : "View Contact"}
            </button>

            {/* ✅ Send Enquiry with sender subscription check */}
            <button
              onClick={async () => {
                try {
                  const response = await apiClient.get(
                    `/enquiries/check-sender-subscription`
                  );

                  if (response.data.allowed) {
                    setShowEnquiryModal(true);
                    setShowSubscribeMessage(false);
                  } else {
                    setShowSubscribeMessage(true);
                  }
                } catch (error) {
                  console.error("Failed to check subscription status:", error);
                  setShowSubscribeMessage(true);
                }
              }}
              className="bg-[#0E2D63] hover:bg-[#0a1f45] text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>

            <button
              onClick={handleViewProfileClick}
              className="border border-gray-300 hover:bg-gray-100 px-3 sm:px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto flex items-center justify-center gap-2 transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              View Profile
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <EnquiryModal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        receiverId={student.user_id}
        receiverName={student.name}
      />

      {/* Subscription Modal */}
      {showSubscribeMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold text-red-600 mb-3">
              Please Subscribe
            </h2>
            <p className="text-gray-700 mb-4">
              You need to subscribe to send enquiries or view contact details.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowSubscribeMessage(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate("/tutor_subscription_plan")}
                className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm"
              >
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentCard;


