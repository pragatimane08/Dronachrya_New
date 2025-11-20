// // src/components/ui/Student/Bookmark.jsx
// import React, { useEffect, useState } from "react";
// import { FiBookmark, FiMapPin } from "react-icons/fi";
// import { PiUser } from "react-icons/pi";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { apiClient } from "../../../../api/apiclient";
// import { apiUrl } from "../../../../api/apiUtl";
// import { useNavigate } from "react-router-dom";

// const Bookmark = () => {
//   const [bookmarkedTutors, setBookmarkedTutors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [contactInfo, setContactInfo] = useState(null);
//   const [showSubscribeModal, setShowSubscribeModal] = useState(false);

//   const navigate = useNavigate();

//   const fetchBookmarks = async () => {
//     try {
//       const res = await apiClient.get("/bookmarks");
//       const bookmarks = res.data.bookmarks || [];

//       const formattedTutors = bookmarks.map((b) => {
//         const tutor = b.BookmarkedUser?.Tutor;
//         const location = tutor?.Location || {};
//         return {
//           id: b.bookmarked_user_id,
//           name: tutor?.name || b.BookmarkedUser?.name,
//           experience: tutor?.experience || "N/A",
//           classes: tutor?.classes || [],
//           subjects: tutor?.subjects || [],
//           verified: tutor?.profile_status === "approved",
//           image: tutor?.profile_photo
//             ? `${apiUrl.baseUrl}${tutor.profile_photo}`
//             : "https://via.placeholder.com/150",
//           location: {
//             city: location.city || "N/A",
//             state: location.state || "N/A",
//           },
//         };
//       });

//       setBookmarkedTutors(formattedTutors);
//     } catch {
//       toast.error("Failed to fetch bookmarks");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBookmarkToggle = async (tutorId) => {
//     try {
//       await apiClient.post("/bookmarks/toggle", {
//         bookmarked_user_id: tutorId,
//       });
//       toast.info("Bookmark removed");
//       fetchBookmarks();
//       window.dispatchEvent(new Event("storage"));
//     } catch {
//       toast.error("Failed to update bookmark");
//     }
//   };

//   const handleViewContact = async (tutorId) => {
//     try {
//       const res = await apiClient.get(`/contacts/view/${tutorId}`);
//       const { email, mobile_number } = res.data.contact_info;
//       setContactInfo({ email, mobile_number });
//     } catch (err) {
//       const status = err.response?.status;
//       const msg = err.response?.data?.message || "Something went wrong";

//       if (status === 403) {
//         if (msg.includes("subscribe") || msg.includes("limit")) {
//           setShowSubscribeModal(true);
//         }
//         toast.error(msg);
//       } else if (status === 404) {
//         toast.error("Tutor not found.");
//       } else {
//         toast.error("Server error while fetching contact.");
//       }

//       if (process.env.NODE_ENV === "development") {
//         console.error("Contact fetch error:", err);
//       }
//     }
//   };

//   const handleRaiseEnquiry = (tutorId, subject, className) => {
//     if (!tutorId) {
//       toast.error("Tutor ID missing. Cannot raise enquiry.");
//       return;
//     }
//     navigate("/enquiry_form_student", {
//       state: {
//         receiver_id: tutorId,
//         subject: subject || "General",
//         class: className || "Any",
//       },
//     });
//   };

//   useEffect(() => {
//     fetchBookmarks();
//     const handleStorageChange = () => fetchBookmarks();
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   return (
//     <div className="w-full px-6 py-6 bg-gray-100 min-h-screen mt-10">
//       <ToastContainer />

//       {loading ? (
//         <p>Loading...</p>
//       ) : bookmarkedTutors.length === 0 ? (
//         <p>No bookmarks found.</p>
//       ) : (
//         bookmarkedTutors.map((tutor) => (
//           <div
//             key={tutor.id}
//             className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col sm:flex-row shadow-sm mb-6"
//           >
//             <div className="w-full sm:w-40 h-40 sm:h-auto">
//               <img
//                 src={tutor.image}
//                 alt={tutor.name}
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             <div className="flex flex-col justify-between flex-1 p-4">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <div className="flex items-center gap-2">
//                     <h3 className="text-md font-semibold text-gray-800">
//                       {tutor.name}
//                     </h3>
//                     {tutor.verified && (
//                       <span className="bg-teal-100 text-teal-600 text-xs px-2 py-0.5 rounded-full">
//                         Verified
//                       </span>
//                     )}
//                   </div>

//                   <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
//                     <FiMapPin className="text-gray-500" />
//                     {tutor.location.city}, {tutor.location.state}
//                   </p>
//                   <p className="text-sm text-gray-800 mt-1">
//                     Experience: {tutor.experience}
//                   </p>
//                   <p className="text-sm text-gray-800">
//                     Classes: {tutor.classes.join(", ") || "N/A"}
//                   </p>
//                   <p className="text-sm text-gray-800">
//                     Subjects: {tutor.subjects.join(", ") || "N/A"}
//                   </p>
//                 </div>

//                 <div className="flex items-center font-medium text-sm ml-4">
//                   <button
//                     className="ml-3 text-teal-600"
//                     onClick={() => handleBookmarkToggle(tutor.id)}
//                   >
//                     <FiBookmark size={18} />
//                   </button>
//                 </div>
//               </div>

//               <div className="flex flex-col sm:flex-row sm:justify-start gap-2 mt-4">
//                 <button
//                   className="bg-teal-500 hover:bg-teal-600 text-white text-sm px-4 py-1.5 rounded-md flex items-center justify-center gap-1"
//                   onClick={() => handleViewContact(tutor.id)}
//                 >
//                   <PiUser className="text-white" /> View Contact
//                 </button>
//                 <button
//                   className="border border-gray-300 text-sm px-4 py-1.5 rounded-md hover:bg-gray-100"
//                   onClick={() =>
//                     handleRaiseEnquiry(
//                       tutor.id,
//                       tutor.subjects?.[0],
//                       tutor.classes?.[0]
//                     )
//                   }
//                 >
//                   Raise Enquiry
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))
//       )}

//       {/* Contact Info Modal */}
//       {contactInfo && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full text-center">
//             <h2 className="text-lg font-bold text-gray-800 mb-4">
//               Tutor Contact Info
//             </h2>
//             <p className="text-gray-700 mb-2">
//               <strong>Email:</strong> {contactInfo.email}
//             </p>
//             <p className="text-gray-700 mb-4">
//               <strong>Phone:</strong> {contactInfo.mobile_number}
//             </p>
//             <button
//               className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded"
//               onClick={() => setContactInfo(null)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Subscription Modal */}
//       {showSubscribeModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full text-center">
//             <h2 className="text-xl font-bold text-[#0E2D63] mb-4">
//               Subscription Required
//             </h2>
//             <p className="text-gray-700 mb-6">
//               Please subscribe to a plan to view tutor contact information.
//             </p>
//             <div className="flex justify-center gap-4">
//               <button
//                 className="bg-[#35BAA3] hover:bg-[#2ea391] text-white font-semibold py-2 px-4 rounded"
//                 onClick={() => {
//                   setShowSubscribeModal(false);
//                   navigate("/subscriptionPlans_student");
//                 }}
//               >
//                 View Plans
//               </button>
//               <button
//                 className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
//                 onClick={() => setShowSubscribeModal(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Bookmark;




// src/components/ui/Student/Bookmark.jsx
import React, { useEffect, useState } from "react";
import { FiBookmark, FiMapPin } from "react-icons/fi";
import { PiUser } from "react-icons/pi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiClient } from "../../../../api/apiclient";
import { apiUrl } from "../../../../api/apiUtl";
import { useNavigate } from "react-router-dom";
import DefaultProfile from "../../../../assets/img/user3.png";

const Bookmark = () => {
  const [bookmarkedTutors, setBookmarkedTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactInfo, setContactInfo] = useState(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const tutorsPerPage = 5;

  const navigate = useNavigate();

  // Helper to correctly format image URLs or fallback to default
  const getImageUrl = (profilePhoto) => {
    if (!profilePhoto || profilePhoto === "null" || profilePhoto.trim() === "") {
      return DefaultProfile; // fallback to fake profile icon
    }
    if (profilePhoto.startsWith("http")) return profilePhoto;
    return `${apiUrl.baseUrl}${profilePhoto}`;
  };

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
          image: getImageUrl(tutor?.profile_photo),
          location: {
            city: location.city || "N/A",
            state: location.state || "N/A",
          },
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
      const res = await apiClient.get(`/contacts/view/${tutorId}`);
      const { email, mobile_number } = res.data.contact_info;
      setContactInfo({ email, mobile_number });
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

  useEffect(() => {
    fetchBookmarks();
    const handleStorageChange = () => fetchBookmarks();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(bookmarkedTutors.length / tutorsPerPage);
  const indexOfLastTutor = currentPage * tutorsPerPage;
  const indexOfFirstTutor = indexOfLastTutor - tutorsPerPage;
  const currentTutors = bookmarkedTutors.slice(
    indexOfFirstTutor,
    indexOfLastTutor
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="w-full px-6 py-6 bg-gray-100 min-h-screen mt-10">
      <ToastContainer />

      {loading ? (
        <p>Loading...</p>
      ) : bookmarkedTutors.length === 0 ? (
        <p>No bookmarks found.</p>
      ) : (
        <>
          {currentTutors.map((tutor) => (
            <div
              key={tutor.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col sm:flex-row shadow-sm mb-6"
            >
              <div className="w-full sm:w-40 h-40 sm:h-auto">
                <img
                  src={getImageUrl(tutor.image)}
                  alt={tutor.name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = DefaultProfile)} // fallback on load error
                />
              </div>

              <div className="flex flex-col justify-between flex-1 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-md font-semibold text-gray-800">
                        {tutor.name}
                      </h3>
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
                      Classes: {tutor.classes.join(", ") || "N/A"}
                    </p>
                    <p className="text-sm text-gray-800">
                      Subjects: {tutor.subjects.join(", ") || "N/A"}
                    </p>
                  </div>

                  <div className="flex items-center font-medium text-sm ml-4">
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
                      handleRaiseEnquiry(
                        tutor.id,
                        tutor.subjects?.[0],
                        tutor.classes?.[0]
                      )
                    }
                  >
                    Raise Enquiry
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-teal-500 text-white hover:bg-teal-600"
                }`}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-teal-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-teal-500 text-white hover:bg-teal-600"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Contact Info Modal */}
      {contactInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Tutor Contact Info
            </h2>
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> {contactInfo.email}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Phone:</strong> {contactInfo.mobile_number}
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

export default Bookmark;

