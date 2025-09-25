
import React, { useState, useEffect } from "react";
import { FiStar, FiBookmark } from "react-icons/fi";
import { PiUser } from "react-icons/pi";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { apiClient } from "../../../../api/apiclient";
import { getTutors } from "../../../../api/repository/Fetchprofile.repository";
import { apiUrl } from "../../../../api/apiUtl";

const Online_Classes = () => {
  const [tutors, setTutors] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Review modal state
  const [openReviewTutor, setOpenReviewTutor] = useState(null);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTutors();
    fetchBookmarks();
  }, []);

  const fetchTutors = async () => {
    try {
      const res = await getTutors();
      setTutors(Array.isArray(res) ? res : []);
    } catch {
      toast.error("Failed to load tutors");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const res = await apiClient.get("/bookmarks");
      const ids = res.data.bookmarks.map((b) => b.bookmarked_user_id);
      setBookmarkedIds(ids);
    } catch {
      toast.error("Failed to load bookmarks");
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

      toast[alreadyBookmarked ? "info" : "success"](
        alreadyBookmarked ? "Bookmark removed" : "Bookmarked"
      );

      setBookmarkedIds(updatedIds);
      window.dispatchEvent(new Event("storage"));
    } catch {
      toast.error("Bookmark action failed");
    }
  };

  const handleSubmitReview = async (tutorId) => {
    if (!rating || !comment) {
      toast.error("Please provide rating and comment");
      return;
    }

    try {
      await apiClient.post("/reviews", {
        tutor_id: tutorId,
        rating,
        title,
        comment,
      });

      toast.success("Review submitted successfully");

      // reset after submit
      setOpenReviewTutor(null);
      setRating(0);
      setTitle("");
      setComment("");
    } catch (err) {
      toast.error("Failed to submit review");
      console.error(err);
    }
  };

  const handleRaiseEnquiry = (tutorId, subject, className) => {
    if (!tutorId) {
      toast.error("Tutor ID missing. Cannot raise enquiry.");
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

  const handleBookDemo = () => {
    navigate("/add_class-form_student");
  };

  // Helper function to get the correct image URL
  const getImageUrl = (profilePhoto) => {
    if (!profilePhoto) return "https://via.placeholder.com/150";
   
    // If it's already a complete URL, use it as is
    if (profilePhoto.startsWith('http')) {
      return profilePhoto;
    }
   
    // If it's a relative path, prepend the base URL
    return `${apiUrl.baseUrl}${profilePhoto}`;
  };

  return (
    <div className="w-full px-6 py-6 bg-gray-100 mt-10">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Tutors</h2>

      {loading ? (
        <p>Loading...</p>
      ) : tutors.length === 0 ? (
        <p>No tutors found.</p>
      ) : (
        tutors.map((tutor) => (
          <div
            key={tutor.user_id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6"
          >
            {/* Tutor info */}
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-40 h-40 sm:h-auto">
                <img
                  src={getImageUrl(tutor.profile_photo)}
                  alt={tutor.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              </div>

              <div className="flex flex-col justify-between flex-1 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-md font-semibold text-gray-800">
                      {tutor.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {tutor.Location?.city}, {tutor.Location?.state}
                    </p>

                    <p className="text-sm text-gray-800 mt-1">
                      Experience:{" "}
                      <span className="font-medium">
                        {tutor.experience || "N/A"}
                      </span>
                    </p>

                    <p className="text-sm text-gray-800">
                      Classes: {tutor.classes?.join(", ") || "N/A"}
                    </p>

                    <p className="text-sm text-gray-800">
                      Subjects: {tutor.subjects?.join(", ") || "N/A"}
                    </p>

                    <p className="text-sm text-gray-800">
                      Mode of Learning:{" "}
                      {tutor.teaching_modes?.join(", ") || "N/A"}
                    </p>
                  </div>

                  <button
                    className={`ml-3 ${
                      bookmarkedIds.includes(tutor.user_id)
                        ? "text-teal-600"
                        : "text-gray-400 hover:text-black"
                    }`}
                    onClick={() => handleBookmark(tutor)}
                  >
                    <FiBookmark size={18} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => setContactInfo(tutor)}
                    className="bg-teal-500 hover:bg-teal-600 text-white text-sm px-4 py-1.5 rounded-md"
                  >
                    <PiUser className="inline mr-1" /> View Contact
                  </button>

                  <button
                    className="border border-gray-300 text-sm px-4 py-1.5 rounded-md hover:bg-gray-100"
                    onClick={() =>
                      handleRaiseEnquiry(
                        tutor.user_id,
                        tutor.subjects?.[0],
                        tutor.classes?.[0]
                      )
                    }
                  >
                    Raise Enquiry
                  </button>

                  <button
                    onClick={handleBookDemo}
                    className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold py-2 px-4 rounded-md"
                  >
                    Book A Demo
                  </button>

                  {/* ✅ Open modal for review */}
                  <button
                    onClick={() => setOpenReviewTutor(tutor)}
                    className="border border-yellow-500 text-yellow-600 text-sm px-4 py-1.5 rounded-md hover:bg-yellow-50"
                  >
                    Rate & Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* ✅ Review Modal */}
      {openReviewTutor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Review {openReviewTutor.name}
            </h3>

            {/* Rating stars */}
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
              <strong>Email:</strong> {contactInfo.User?.email || contactInfo.email}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Phone:</strong> {contactInfo.User?.mobile_number || contactInfo.mobile_number}
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
};

export default Online_Classes;