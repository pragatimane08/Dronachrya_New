import React, { useState } from "react";
import { MapPin, Bookmark, Star, Clock, Eye, Phone, UserCheck, X } from "lucide-react";

const StudentCard = ({ student, onConnectionRequest, onViewProfile }) => {
  const [showContact, setShowContact] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const subjects = Array.isArray(student.subjects)
    ? student.subjects.join(", ")
    : student.subjects;

  const classLabel = student.class;
  const location = student.Location
    ? `${student.Location.city}, ${student.Location.state}, ${student.Location.country}`
    : "N/A";

  const showMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Handle View Contact button click
  const handleViewContact = async () => {
    try {
      const hasSubscription = true; // replace with real check
      if (!hasSubscription) {
        showMessage("Please subscribe to view contact details");
        return;
      }
      setShowContact(true);
    } catch (error) {
      console.error("Failed to load contact details:", error);
    }
  };

  // Handle Hide Contact button click
  const handleHideContact = () => {
    setShowContact(false);
  };

  // Handle Connect button click
  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
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

  // Handle View Profile button click
  const handleViewProfileClick = () => {
    if (onViewProfile) {
      onViewProfile(student);
    }
  };

  // Handle Bookmark button click
  const handleBookmark = async () => {
    try {
      setIsBookmarked(!isBookmarked);
      if (!isBookmarked) {
        showMessage("Student added to bookmarks");
      } else {
        showMessage("Student removed from bookmarks");
      }
    } catch (error) {
      console.error("Failed to update bookmark:", error);
      setIsBookmarked(!isBookmarked);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl p-4 sm:p-5 gap-4 sm:gap-5 w-full">
      {/* Profile Photo */}
      <div className="w-full sm:w-32 lg:w-40 flex-shrink-0">
        <img
          src={student.profile_photo || "/default-user.png"}
          alt={student.name}
          className="w-full h-32 sm:h-36 lg:h-40 object-cover rounded-lg border cursor-pointer"
          onClick={handleViewProfileClick}
        />
      </div>

      {/* Info */}
      <div className="flex-1 w-full min-w-0">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-3 p-2 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm text-center">
            {successMessage}
          </div>
        )}

        {/* Top Section */}
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

          <div className="flex items-center gap-2 flex-shrink-0">
            {student.User?.is_active && (
              <span className="flex items-center text-xs bg-emerald-100 text-teal-600 px-2 py-1 rounded-full font-medium">
                <Star className="w-3 h-3 mr-1" />
                Verified
              </span>
            )}
            <button 
              onClick={handleBookmark}
              className={`p-1 rounded-full transition-colors ${
                isBookmarked ? "text-teal-500 bg-teal-50" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Contact Info */}
        {showContact && student.User && (
          <div className="mt-3 p-3 bg-teal-50 rounded-lg border border-teal-200 relative">
            {/* Close Button */}
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
              {/* Email */}
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
              {/* Phone */}
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
                <span className="font-medium">Start Plan:</span> {student.start_timeline}
              </p>
            )}
            {student.class_modes && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Class Type:</span> {student.class_modes.join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row flex-wrap gap-2">
          <button 
            onClick={showContact ? handleHideContact : handleViewContact}
            className="bg-teal-500 hover:bg-teal-600 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto flex items-center justify-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {showContact ? "Hide Contact" : "View Contact"}
          </button>

          <button 
            onClick={handleConnect}
            disabled={isConnecting}
            className="border border-teal-500 text-teal-500 hover:bg-teal-50 px-3 sm:px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserCheck className="w-4 h-4" />
            {isConnecting ? "Connecting..." : "Connect"}
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
  );
};

export default StudentCard;