// // src/components/ui/Student/Bookmark.jsx
// import React, { useEffect, useState } from "react";
// import { FiBookmark, FiMapPin } from "react-icons/fi";
// import { PiUser } from "react-icons/pi";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { apiClient } from "../../../../../api/apiclient";
// import { apiUrl } from "../../../../../api/apiUtl";
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

// // // src/components/ui/Student/Bookmark.jsx
// // import React from "react";

// // const Bookmark = () => {
// //   return (
// //     <div className="w-full px-6 py-6 bg-gray-100 min-h-screen mt-10 flex items-center justify-center">
// //       <p className="text-gray-600 text-lg font-medium">
// //         No bookmarks yet.
// //       </p>
// //     </div>
// //   );
// // };

// // export default Bookmark;

import React, { useEffect, useState } from "react";
import { MapPin, Bookmark as BookmarkIcon, Star, Phone, UserCheck } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

// Utility functions for user-based bookmark storage
const getUserBookmarksKey = (userId) => `studentBookmarks_${userId}`;

const getCurrentUserId = () => {
  const userData = localStorage.getItem('userData');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      return user.id || user.userId || user._id;
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  return 'anonymous';
};

const getUserBookmarks = (userId) => {
  try {
    const key = getUserBookmarksKey(userId);
    const savedBookmarks = localStorage.getItem(key);
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    return [];
  }
};

const saveUserBookmarks = (userId, bookmarks) => {
  try {
    const key = getUserBookmarksKey(userId);
    localStorage.setItem(key, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Error saving bookmarks:', error);
  }
};

const Bookmark = () => {
  const [bookmarkedStudents, setBookmarkedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactInfo, setContactInfo] = useState(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const navigate = useNavigate();

  const fetchBookmarks = () => {
    try {
      const userId = getCurrentUserId();
      setCurrentUserId(userId);
      
      const bookmarks = getUserBookmarks(userId);
      setBookmarkedStudents(bookmarks);
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
      toast.error("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkToggle = (studentId) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        toast.error("Please login to manage bookmarks");
        return;
      }

      const bookmarks = getUserBookmarks(userId);
      const updatedBookmarks = bookmarks.filter(bm => bm.user_id !== studentId);
      
      saveUserBookmarks(userId, updatedBookmarks);
      setBookmarkedStudents(updatedBookmarks);
      toast.info("Bookmark removed");
      
      // Trigger storage event for other components
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
      toast.error("Failed to remove bookmark");
    }
  };

  const handleViewContact = (student) => {
    try {
      const hasSubscription = true; // Replace with actual subscription check
      
      if (!hasSubscription) {
        setShowSubscribeModal(true);
        return;
      }

      if (student.User) {
        setContactInfo({
          email: student.User.email,
          mobile_number: student.User.mobile_number
        });
      } else {
        toast.error("Contact information not available");
      }
    } catch (error) {
      console.error("Failed to load contact details:", error);
      toast.error("Failed to load contact information");
    }
  };

  useEffect(() => {
    fetchBookmarks();
    
    const handleStorageChange = () => {
      fetchBookmarks();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full px-6 py-6 bg-gray-100 min-h-screen mt-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-6 bg-gray-100 min-h-screen mt-10">
      <ToastContainer />

      {bookmarkedStudents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg font-medium">
            No bookmarked students yet.
          </p>
          <p className="text-gray-500 mt-2">
            Start exploring students and click the bookmark icon to save them here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookmarkedStudents.map((student) => (
            <div
              key={student.user_id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col sm:flex-row shadow-sm"
            >
              {/* Student Image */}
              <div className="w-full sm:w-40 h-48 sm:h-auto flex-shrink-0">
                <img
                  src={student.profile_photo || "/default-user.png"}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Student Info */}
              <div className="flex flex-col justify-between flex-1 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {student.name}
                      </h3>
                      {student.User?.is_active && (
                        <span className="bg-teal-100 text-teal-600 text-xs px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {student.Location ? 
                        `${student.Location.city}, ${student.Location.state}` : 
                        "Location not available"
                      }
                    </p>
                    
                    <p className="text-sm text-gray-800 mb-1">
                      <span className="font-medium">Class:</span> {student.class || "N/A"}
                    </p>
                    
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">Subjects:</span> {student.subjects ? 
                        (Array.isArray(student.subjects) ? 
                          student.subjects.join(", ") : 
                          student.subjects) : 
                        "N/A"
                      }
                    </p>
                  </div>

                  <button
                    onClick={() => handleBookmarkToggle(student.user_id)}
                    className="ml-4 text-teal-500 hover:text-teal-700 flex-shrink-0"
                  >
                    <BookmarkIcon className="w-5 h-5" fill="currentColor" />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <button
                    onClick={() => handleViewContact(student)}
                    className="bg-teal-500 hover:bg-teal-600 text-white text-sm px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    View Contact
                  </button>
                  
                  <button
                    onClick={() => navigate('/find-students')}
                    className="border border-teal-500 text-teal-500 hover:bg-teal-50 text-sm px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
                  >
                    <UserCheck className="w-4 h-4" />
                    Find More Students
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contact Info Modal */}
      {contactInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Student Contact Info
            </h2>
            <div className="space-y-3">
              {contactInfo.email && (
                <div>
                  <p className="font-medium text-gray-700">Email:</p>
                  <a 
                    href={`mailto:${contactInfo.email}`}
                    className="text-teal-600 hover:text-teal-800 break-all"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              )}
              {contactInfo.mobile_number && (
                <div>
                  <p className="font-medium text-gray-700">Phone:</p>
                  <a 
                    href={`tel:${contactInfo.mobile_number}`}
                    className="text-teal-600 hover:text-teal-800"
                  >
                    {contactInfo.mobile_number}
                  </a>
                </div>
              )}
            </div>
            <button
              className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded"
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
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Subscription Required
            </h2>
            <p className="text-gray-700 mb-6">
              Please subscribe to a plan to view student contact information.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded transition-colors"
                onClick={() => {
                  setShowSubscribeModal(false);
                  navigate("/subscription-plans");
                }}
              >
                View Plans
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition-colors"
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
