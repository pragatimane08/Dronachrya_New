// src/components/ui/Student/Bookmark.jsx
import React, { useEffect, useState } from "react";
import { FiStar, FiBookmark, FiMapPin } from "react-icons/fi";
import { PiUser } from "react-icons/pi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiClient } from "../../../../api/apiclient";
import { apiUrl } from "../../../../api/apiUtl";

const Bookmark = () => {
  const [bookmarkedTutors, setBookmarkedTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const res = await apiClient.get("/bookmarks");
      const bookmarks = res.data.bookmarks || [];

      const formattedTutors = bookmarks.map((b) => {
        const tutor = b.BookmarkedUser?.Tutor;
        const location = tutor?.Location || {};
        return {
          id: b.bookmarked_user_id,
          name: tutor?.name || b.BookmarkedUser?.name,
          experience: tutor?.experience || "N/A",
          classes: tutor?.classes || [],
          subjects: tutor?.subjects || [],
          verified: tutor?.profile_status === "approved",
          image: tutor?.profile_photo
            ? `${apiUrl.baseUrl}${tutor.profile_photo}`
            : "https://via.placeholder.com/150",
          location: {
            city: location.city || "N/A",
            state: location.state || "N/A",
          },
          rating: tutor?.rating || "N/A",
        };
      });

      setBookmarkedTutors(formattedTutors);
    } catch {
      toast.error("Failed to fetch bookmarks");
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkToggle = async (tutorId) => {
    try {
      await apiClient.post("/bookmarks/toggle", {
        bookmarked_user_id: tutorId,
      });
      toast.info("Bookmark removed");
      fetchBookmarks();
      window.dispatchEvent(new Event("storage"));
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  const handleViewContact = async (tutorId) => {
    try {
      const res = await apiClient.get(`/contact/${tutorId}`);
      const { email, mobile_number } = res.data.contact_info;
      toast.success(`Email: ${email}, Mobile: ${mobile_number}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch contact info");
    }
  };

  const handleRaiseEnquiry = async (tutorId, subject, className) => {
    try {
      await apiClient.post("/enquiries", {
        receiver_id: tutorId,
        subject: subject || "General",
        class: className || "Any",
        description: "I'm interested in your tutoring services.",
      });
      toast.success("Enquiry sent");
    } catch (err) {
      toast.error(err.response?.data?.message || "Enquiry failed");
    }
  };

  useEffect(() => {
    fetchBookmarks();
    const handleStorageChange = () => fetchBookmarks();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="w-full px-6 py-6 bg-gray-100 min-h-screen mt-10">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Bookmarked Tutors</h2>

      {loading ? (
        <p>Loading...</p>
      ) : bookmarkedTutors.length === 0 ? (
        <p>No bookmarks found.</p>
      ) : (
        bookmarkedTutors.map((tutor) => (
          <div
            key={tutor.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col sm:flex-row shadow-sm mb-6"
          >
            <div className="w-full sm:w-40 h-40 sm:h-auto">
              <img
                src={tutor.image}
                alt={tutor.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between flex-1 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-md font-semibold text-gray-800">{tutor.name}</h3>
                    {tutor.verified && (
                      <span className="bg-teal-100 text-teal-600 text-xs px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <FiMapPin className="text-gray-500" />
                    {tutor.location.city}, {tutor.location.state}
                  </p>
                  <p className="text-sm text-gray-800 mt-1">
                    Experience: {tutor.experience}
                  </p>
                  <p className="text-sm text-gray-800">
                    Classes: {tutor.classes.join(", ")}
                  </p>
                  <p className="text-sm text-gray-800">
                    Subjects: {tutor.subjects.join(", ")}
                  </p>
                </div>

                <div className="flex items-center text-yellow-500 font-medium text-sm ml-4">
                  <FiStar className="mr-1" />
                  {tutor.rating}
                  <button
                    className="ml-3 text-teal-600"
                    onClick={() => handleBookmarkToggle(tutor.id)}
                  >
                    <FiBookmark size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-start gap-2 mt-4">
                <button
                  className="bg-teal-500 hover:bg-teal-600 text-white text-sm px-4 py-1.5 rounded-md flex items-center justify-center gap-1"
                  onClick={() => handleViewContact(tutor.id)}
                >
                  <PiUser className="text-white" /> View Contact
                </button>
                <button
                  className="border border-gray-300 text-sm px-4 py-1.5 rounded-md hover:bg-gray-100"
                  onClick={() =>
                    handleRaiseEnquiry(tutor.id, tutor.subjects?.[0], tutor.classes?.[0])
                  }
                >
                  Raise Enquiry
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Bookmark;
