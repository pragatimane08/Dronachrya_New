
// import React from "react";
// import { useNavigate } from "react-router-dom";

// export default function TutorCard({ tutor }) {
//   const navigate = useNavigate();

//   const photo = tutor?.profile_photo || "https://via.placeholder.com/120";
//   const location =
//     tutor?.Location?.city ||
//     tutor?.Location?.state ||
//     tutor?.Location?.country ||
//     "—";
//   const price = tutor?.pricing_per_hour
//     ? `₹${Number(tutor.pricing_per_hour)}/hr`
//     : "—";

//   const rating = tutor?.average_rating || "—";
//   const reviewsCount = tutor?.total_reviews || 0;

//   // ✅ default 0 instead of "—"
//   const experience = tutor?.experience ?? 0;
//   const students = tutor?.students ?? 0;

//   const address = tutor?.address || location;

//   const teachingTypes = tutor?.teaching_modes || [];
//   const subjects = tutor?.subjects || [];

//   const description =
//     tutor?.introduction_text ||
//     "I have years of experience in teaching. I create personalized lessons for students with interactive learning methods and regular progress tracking.";

//   const tutorId = tutor?.user_id || tutor?.User?.id;

//   return (
//     <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 w-full max-w-4xl">
//       <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
//         {/* Tutor Image & Profile Button */}
//         <div className="flex flex-col items-center w-full sm:w-32">
//           <img
//             src={photo}
//             alt={tutor?.name}
//             className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full mb-3 shadow"
//           />

//           <button
//             onClick={() => tutorId && navigate(`/TutorProfile/${tutorId}`)}
//             className="bg-teal-600 text-white py-2 px-4 rounded-lg text-xs sm:text-sm font-medium hover:bg-teal-700 transition-colors w-full"
//           >
//             View Profile
//           </button>
//         </div>

//         {/* Tutor Details */}
//         <div className="flex-1">
//           {/* Name, Price & Rating */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
//             <h3 className="text-base sm:text-lg font-semibold text-gray-800">
//               {tutor?.name}
//             </h3>
//             <div className="flex flex-col items-start sm:items-end">
//               <span className="text-teal-700 font-semibold text-sm sm:text-base">
//                 {price}
//               </span>
//               <p className="text-gray-600 text-xs sm:text-sm mt-1">
//                 ⭐{" "}
//                 <span className="text-amber-500 font-semibold">{rating}</span>{" "}
//                 ({reviewsCount} reviews)
//               </p>
//             </div>
//           </div>

//           {/* Location */}
//           <div className="flex items-center text-gray-600 mb-2 text-xs sm:text-sm">
//             📍 {address}
//           </div>

//           {/* Stats */}
//           <div className="flex flex-wrap gap-3 mb-3 text-xs sm:text-sm text-gray-700">
//             <span>🎓 {experience} yrs Experience</span>
//             <span>👥 {students} Students</span>
//           </div>

//           {/* Teaching Types */}
//           {teachingTypes.length > 0 && (
//             <div className="mb-3">
//               <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                 Teaching Types:
//               </h4>
//               <div className="flex flex-wrap gap-2">
//                 {teachingTypes.map((type, index) => (
//                   <span
//                     key={index}
//                     className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs sm:text-sm"
//                   >
//                     {type}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Subjects */}
//           {subjects.length > 0 && (
//             <div className="mb-3">
//               <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                 Subjects:
//               </h4>
//               <div className="flex flex-wrap gap-2">
//                 {subjects.map((subject, index) => (
//                   <span
//                     key={index}
//                     className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded-md text-xs sm:text-sm"
//                   >
//                     {subject}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Description */}
//           <p className="text-gray-600 text-xs sm:text-sm mb-4">{description}</p>

//           {/* Book Demo Button */}
//           <div className="flex flex-col sm:flex-row gap-3">
//             <button
//               onClick={() =>
//                 navigate("/book-demo", { state: { tutorId: tutorId } })
//               }
//               className="flex-1 bg-teal-600 text-white py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-teal-700 transition-colors"
//             >
//               Book a Free Demo
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiStar, FiBookmark } from "react-icons/fi";
import { PiUser } from "react-icons/pi";

import { apiClient } from "../../../../api/apiclient";
import { apiUrl } from "../../../../api/apiUtl";
import DefaultProfile from "../../../../assets/img/user3.png";

export default function TutorCard({ tutor }) {
  const navigate = useNavigate();

  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [openReviewTutor, setOpenReviewTutor] = useState(null);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Tutor data with fallbacks
  const photo = getImageUrl(tutor?.profile_photo);
  const location =
    tutor?.Location?.city ||
    tutor?.Location?.state ||
    tutor?.Location?.country ||
    "N/A";
  
  const price = tutor?.pricing_per_hour
    ? `₹${Number(tutor.pricing_per_hour)}/hr`
    : "N/A";

  const ratingValue = tutor?.average_rating || "N/A";
  const reviewsCount = tutor?.total_reviews || 0;
  const experience = tutor?.experience ?? 0;
  const teachingTypes = tutor?.teaching_modes || [];
  const subjects = tutor?.subjects || [];
  const classes = tutor?.classes || [];

  const tutorId = tutor?.user_id || tutor?.User?.id;

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  function getImageUrl(profilePhoto) {
    if (!profilePhoto || profilePhoto === "null" || profilePhoto.trim() === "") {
      return DefaultProfile;
    }
    if (profilePhoto.startsWith("http")) return profilePhoto;
    return `${apiUrl.baseUrl}${profilePhoto}`;
  }

  const fetchBookmarks = async () => {
    try {
      const res = await apiClient.get("/bookmarks");
      const ids = res.data.bookmarks.map((b) => b.bookmarked_user_id);
      setBookmarkedIds(ids);
    } catch {
      showMessage("Failed to load bookmarks", "error");
    }
  };

  const handleBookmark = async (tutor) => {
    try {
      await apiClient.post("/bookmarks/toggle", {
        bookmarked_user_id: tutor.user_id,
      });

      const alreadyBookmarked = bookmarkedIds.includes(tutor.user_id);
      const updatedIds = alreadyBookmarked
        ? bookmarkedIds.filter((id) => id !== tutor.user_id)
        : [...bookmarkedIds, tutor.user_id];

      setBookmarkedIds(updatedIds);
      showMessage(
        alreadyBookmarked ? "Bookmark removed" : "Bookmarked successfully",
        "success"
      );

      window.dispatchEvent(new Event("storage"));
    } catch {
      showMessage("Bookmark action failed", "error");
    }
  };

  const handleSubmitReview = async (tutorId) => {
    if (!rating || !comment) {
      showMessage("Please provide rating and comment", "error");
      return;
    }

    try {
      await apiClient.post("/reviews", {
        tutor_id: tutorId,
        rating,
        title,
        comment,
      });

      showMessage("Review submitted successfully", "success");
      setOpenReviewTutor(null);
      setRating(0);
      setTitle("");
      setComment("");
    } catch {
      showMessage("Failed to submit review", "error");
    }
  };

  const handleRaiseEnquiry = (tutorId, subject, className) => {
    if (!tutorId) {
      showMessage("Tutor ID missing. Cannot raise enquiry.", "error");
      return;
    }

    navigate("/enquiry_form_student", {
      state: {
        receiver_id: tutorId,
        subject: subject || "General",
        class: className || "Any",
      },
    });
  };

  const handleViewContact = async (tutor) => {
    try {
      const response = await apiClient.get(`/contacts/view/${tutor.user_id}`);
      const { contact_info, contacts_remaining } = response.data;

      setContactInfo({
        ...tutor,
        User: {
          email: contact_info.email,
          mobile_number: contact_info.mobile_number,
        },
      });

      showMessage(
        `Contact viewed successfully. Remaining views: ${contacts_remaining}`,
        "success"
      );
      setShowSubscribeModal(false);
    } catch (error) {
      console.error("Failed to view contact:", error);
      if (error.response?.status === 403) {
        setShowSubscribeModal(true);
        setContactInfo(null);
      } else {
        showMessage("Failed to view contact. Please try again.", "error");
      }
    }
  };

  const handleViewProfile = () => {
    if (tutorId) {
      navigate(`/TutorProfile/${tutorId}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-4xl">
      {/* ✅ Inline Message */}
      {message.text && (
        <div
          className={`mb-4 text-center p-2 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : message.type === "error"
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-blue-100 text-blue-700 border border-blue-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Tutor Image */}
        <div className="flex flex-col items-center w-full sm:w-32">
          <img
            src={photo}
            alt={tutor?.name}
            className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full mb-4 shadow"
            onError={(e) => (e.target.src = DefaultProfile)}
          />

          <button
            onClick={handleViewProfile}
            className="bg-teal-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors w-full"
          >
            View Profile
          </button>
        </div>

        {/* Tutor Details */}
        <div className="flex-1">
          {/* Name, Price & Rating */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {tutor?.name}
              </h3>
              <button
                className={`${
                  bookmarkedIds.includes(tutor?.user_id)
                    ? "text-teal-600"
                    : "text-gray-400 hover:text-gray-600"
                } transition-colors`}
                onClick={() => handleBookmark(tutor)}
              >
                <FiBookmark size={18} />
              </button>
            </div>
            <div className="flex flex-col items-start sm:items-end">
              <span className="text-teal-700 font-semibold text-base">
                {price}
              </span>
              <p className="text-gray-600 text-sm mt-1">
                <span className="text-amber-500 font-semibold">{ratingValue}</span> ({reviewsCount} reviews)
              </p>
            </div>
          </div>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="font-medium">Location:</span>
              <span>{location}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium">Experience:</span>
              <span>{experience} years</span>
            </div>
            
            {classes.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="font-medium">Classes:</span>
                <span>{classes.join(", ")}</span>
              </div>
            )}
            
            {subjects.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="font-medium">Subjects:</span>
                <span>{subjects.join(", ")}</span>
              </div>
            )}
            
            {teachingTypes.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="font-medium">Mode of Learning:</span>
                <span>{teachingTypes.join(", ")}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => handleViewContact(tutor)}
              className="flex-1 bg-teal-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
            >
              <PiUser className="text-sm" />
              View Contact
            </button>

            <button
              onClick={() =>
                handleRaiseEnquiry(tutorId, subjects?.[0], classes?.[0])
              }
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Raise Enquiry
            </button>

            {/* <button
              onClick={() => setOpenReviewTutor(tutor)}
              className="flex-1 border border-yellow-500 text-yellow-600 py-2.5 rounded-lg text-sm font-medium hover:bg-yellow-50 transition-colors"
            >
              Rate & Review
            </button> */}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {openReviewTutor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Review {openReviewTutor.name}
            </h3>
            <div className="flex gap-1 mb-3 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  size={28}
                  className={`cursor-pointer ${
                    star <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            <input
              type="text"
              placeholder="Review Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 rounded w-full p-2 mb-3"
            />
            <textarea
              placeholder="Write your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border border-gray-300 rounded w-full p-2 mb-3"
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                onClick={() => setOpenReviewTutor(null)}
              >
                Cancel
              </button>
              <button
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded"
                onClick={() => handleSubmitReview(openReviewTutor.user_id)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Info Modal */}
      {contactInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Tutor Contact Info
            </h2>
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong>{" "}
              {contactInfo.User?.email || contactInfo.email || "N/A"}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Phone:</strong>{" "}
              {contactInfo.User?.mobile_number ||
                contactInfo.mobile_number ||
                "N/A"}
            </p>
            <button
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded"
              onClick={() => setContactInfo(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-[#0E2D63] mb-4">
              Subscription Required
            </h2>
            <p className="text-gray-700 mb-6">
              Please subscribe to a plan to view tutor contact information.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-[#35BAA3] hover:bg-[#2ea391] text-white font-semibold py-2 px-4 rounded"
                onClick={() => {
                  setShowSubscribeModal(false);
                  navigate("/subscriptionPlans_student");
                }}
              >
                View Plans
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                onClick={() => setShowSubscribeModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
