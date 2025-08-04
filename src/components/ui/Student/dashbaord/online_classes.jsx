import React, { useState, useEffect } from "react";
import { FiStar, FiBookmark, FiMapPin } from "react-icons/fi";
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
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
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

  const handleViewContact = async (tutorId) => {
    if (!tutorId) {
      toast.error("Tutor ID missing.");
      return;
    }

    try {
      const res = await apiClient.get(`/contacts/view/${tutorId}`);
      const { email, mobile_number } = res.data.contact_info;

      toast.success(`📧 ${email} | 📱 ${mobile_number}`, {
        autoClose: 7000,
      });
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || "Something went wrong";

      if (status === 403) {
        if (msg.includes("subscribe") || msg.includes("limit")) {
          setShowSubscribeModal(true);
        }
        toast.error(msg);
      } else if (status === 404) {
        toast.error("Tutor not found.");
      } else {
        toast.error("Server error while fetching contact.");
      }

      if (process.env.NODE_ENV === "development") {
        console.error("Contact fetch error:", err);
      }
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

  return (
    <div className="w-full px-6 py-6 bg-gray-100 min-h-screen mt-10">
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
            className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col sm:flex-row shadow-sm mb-6"
          >
            <div className="w-full sm:w-40 h-40 sm:h-auto">
              <img
                src={
                  tutor.profile_photo
                    ? `${apiUrl.baseUrl}${tutor.profile_photo}`
                    : "https://via.placeholder.com/150"
                }
                alt={tutor.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between flex-1 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-md font-semibold text-gray-800">
                      {tutor.name}
                    </h3>
                    {tutor.profile_status === "approved" && (
                      <span className="bg-teal-100 text-teal-600 text-xs px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <FiMapPin className="text-gray-500" />
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
                    Mode of Learning: {tutor.teaching_modes?.join(", ") || "N/A"}
                  </p>

                </div>

                <div className="flex items-center text-yellow-500 font-medium text-sm ml-4">
                  <FiStar className="mr-1" />
                  {tutor.rating || "N/A"}
                  <button
                    className={`ml-3 ${bookmarkedIds.includes(tutor.user_id)
                      ? "text-teal-600"
                      : "text-gray-400 hover:text-black"
                      }`}
                    onClick={() => handleBookmark(tutor)}
                  >
                    <FiBookmark size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-start gap-2 mt-4">
                <button
                  className="bg-teal-500 hover:bg-teal-600 text-white text-sm px-4 py-1.5 rounded-md flex items-center justify-center gap-1"
                  onClick={() => handleViewContact(tutor.user_id)}
                >
                  <PiUser className="text-white" /> View Contact
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
              </div>
            </div>
          </div>
        ))
      )}

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
                  navigate("/subscription-plan");
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
