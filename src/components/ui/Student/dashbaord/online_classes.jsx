<<<<<<< HEAD
=======
// // src/components/ui/Student/Online_Classes.jsx
// import React, { useState, useEffect } from "react";
// import { FiStar, FiBookmark } from "react-icons/fi";
// import { PiUser } from "react-icons/pi";
// import { toast, ToastContainer } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import "react-toastify/dist/ReactToastify.css";

// import { apiClient } from "../../../../api/apiclient";
// import { getTutors } from "../../../../api/repository/Fetchprofile.repository";
// import { apiUrl } from "../../../../api/apiUtl";
// import DefaultProfile from "../../../../assets/img/user3.png"; 

// const Online_Classes = () => {
//   const [tutors, setTutors] = useState([]);
//   const [bookmarkedIds, setBookmarkedIds] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [openReviewTutor, setOpenReviewTutor] = useState(null);
//   const [rating, setRating] = useState(0);
//   const [title, setTitle] = useState("");
//   const [comment, setComment] = useState("");

//   const [showSubscribeModal, setShowSubscribeModal] = useState(false);
//   const [contactInfo, setContactInfo] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchTutors();
//     fetchBookmarks();
//   }, []);

//   const fetchTutors = async () => {
//     try {
//       const res = await getTutors();
//       setTutors(Array.isArray(res) ? res : []);
//     } catch {
//       toast.error("Failed to load tutors");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchBookmarks = async () => {
//     try {
//       const res = await apiClient.get("/bookmarks");
//       const ids = res.data.bookmarks.map((b) => b.bookmarked_user_id);
//       setBookmarkedIds(ids);
//     } catch {
//       toast.error("Failed to load bookmarks");
//     }
//   };

//   const handleBookmark = async (tutor) => {
//     try {
//       await apiClient.post("/bookmarks/toggle", {
//         bookmarked_user_id: tutor.user_id,
//       });

//       const alreadyBookmarked = bookmarkedIds.includes(tutor.user_id);
//       const updatedIds = alreadyBookmarked
//         ? bookmarkedIds.filter((id) => id !== tutor.user_id)
//         : [...bookmarkedIds, tutor.user_id];

//       toast[alreadyBookmarked ? "info" : "success"](
//         alreadyBookmarked ? "Bookmark removed" : "Bookmarked"
//       );

//       setBookmarkedIds(updatedIds);
//       window.dispatchEvent(new Event("storage"));
//     } catch {
//       toast.error("Bookmark action failed");
//     }
//   };

//   const handleSubmitReview = async (tutorId) => {
//     if (!rating || !comment) {
//       toast.error("Please provide rating and comment");
//       return;
//     }

//     try {
//       await apiClient.post("/reviews", {
//         tutor_id: tutorId,
//         rating,
//         title,
//         comment,
//       });

//       toast.success("Review submitted successfully");
//       setOpenReviewTutor(null);
//       setRating(0);
//       setTitle("");
//       setComment("");
//     } catch (err) {
//       toast.error("Failed to submit review");
//       console.error(err);
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

//   const handleBookDemo = () => {
//     navigate("/add_class-form_student");
//   };

//   // Helper: Correctly handle missing or invalid profile photos
//   const getImageUrl = (profilePhoto) => {
//     if (!profilePhoto || profilePhoto === "null" || profilePhoto.trim() === "") {
//       return DefaultProfile;
//     }
//     if (profilePhoto.startsWith("http")) return profilePhoto;
//     return `${apiUrl.baseUrl}${profilePhoto}`;
//   };

//   return (
//     <div className="w-full px-6 py-6 bg-gray-100 mt-10">
//       <ToastContainer />
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Tutors</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : tutors.length === 0 ? (
//         <p>No tutors found.</p>
//       ) : (
//         tutors.map((tutor) => (
//           <div
//             key={tutor.user_id}
//             className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6"
//           >
//             {/* Tutor info */}
//             <div className="flex flex-col sm:flex-row">
//               <div className="w-full sm:w-40 h-40 sm:h-auto">
//                 <img
//                   src={getImageUrl(tutor.profile_photo)}
//                   alt={tutor.name}
//                   className="w-full h-full object-cover"
//                   onError={(e) => (e.target.src = DefaultProfile)} // fallback if broken image
//                 />
//               </div>

//               <div className="flex flex-col justify-between flex-1 p-4">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="text-md font-semibold text-gray-800">
//                       {tutor.name}
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       {tutor.Location?.city || "N/A"},{" "}
//                       {tutor.Location?.state || "N/A"}
//                     </p>

//                     <p className="text-sm text-gray-800 mt-1">
//                       Experience:{" "}
//                       <span className="font-medium">
//                         {tutor.experience || "N/A"}
//                       </span>
//                     </p>

//                     <p className="text-sm text-gray-800">
//                       Classes: {tutor.classes?.join(", ") || "N/A"}
//                     </p>

//                     <p className="text-sm text-gray-800">
//                       Subjects: {tutor.subjects?.join(", ") || "N/A"}
//                     </p>

//                     <p className="text-sm text-gray-800">
//                       Mode of Learning:{" "}
//                       {tutor.teaching_modes?.join(", ") || "N/A"}
//                     </p>
//                   </div>

//                   <button
//                     className={`ml-3 ${
//                       bookmarkedIds.includes(tutor.user_id)
//                         ? "text-teal-600"
//                         : "text-gray-400 hover:text-black"
//                     }`}
//                     onClick={() => handleBookmark(tutor)}
//                   >
//                     <FiBookmark size={18} />
//                   </button>
//                 </div>

//                 <div className="flex flex-wrap gap-2 mt-4">
//                   <button
//                     onClick={() => setContactInfo(tutor)}
//                     className="bg-teal-500 hover:bg-teal-600 text-white text-sm px-4 py-1.5 rounded-md"
//                   >
//                     <PiUser className="inline mr-1" /> View Contact
//                   </button>

//                   <button
//                     className="border border-gray-300 text-sm px-4 py-1.5 rounded-md hover:bg-gray-100"
//                     onClick={() =>
//                       handleRaiseEnquiry(
//                         tutor.user_id,
//                         tutor.subjects?.[0],
//                         tutor.classes?.[0]
//                       )
//                     }
//                   >
//                     Raise Enquiry
//                   </button>

//                   <button
//                     onClick={handleBookDemo}
//                     className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold py-2 px-4 rounded-md"
//                   >
//                     Book A Demo
//                   </button>

//                   {/* Open modal for review */}
//                   <button
//                     onClick={() => setOpenReviewTutor(tutor)}
//                     className="border border-yellow-500 text-yellow-600 text-sm px-4 py-1.5 rounded-md hover:bg-yellow-50"
//                   >
//                     Rate & Review
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))
//       )}

//       {/* Review Modal */}
//       {openReviewTutor && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h3 className="text-lg font-bold text-gray-800 mb-4">
//               Review {openReviewTutor.name}
//             </h3>

//             <div className="flex gap-1 mb-3 justify-center">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <FiStar
//                   key={star}
//                   size={28}
//                   className={`cursor-pointer ${
//                     star <= rating ? "text-yellow-500" : "text-gray-300"
//                   }`}
//                   onClick={() => setRating(star)}
//                 />
//               ))}
//             </div>

//             <input
//               type="text"
//               placeholder="Review Title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="border border-gray-300 rounded w-full p-2 mb-3"
//             />

//             <textarea
//               placeholder="Write your comment..."
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               className="border border-gray-300 rounded w-full p-2 mb-3"
//               rows={3}
//             />

//             <div className="flex justify-end gap-3">
//               <button
//                 className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
//                 onClick={() => setOpenReviewTutor(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded"
//                 onClick={() => handleSubmitReview(openReviewTutor.user_id)}
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Contact Info Modal */}
//       {contactInfo && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full text-center">
//             <h2 className="text-lg font-bold text-gray-800 mb-4">
//               Tutor Contact Info
//             </h2>
//             <p className="text-gray-700 mb-2">
//               <strong>Email:</strong>{" "}
//               {contactInfo.User?.email || contactInfo.email || "N/A"}
//             </p>
//             <p className="text-gray-700 mb-4">
//               <strong>Phone:</strong>{" "}
//               {contactInfo.User?.mobile_number ||
//                 contactInfo.mobile_number ||
//                 "N/A"}
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

// export default Online_Classes;


>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed
// src/components/ui/Student/Online_Classes.jsx
// src/components/ui/Student/Online_Classes.jsx
import React, { useState, useEffect } from "react";
import { FiStar, FiBookmark, FiUsers } from "react-icons/fi";
import { PiUser } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

import { apiClient } from "../../../../api/apiclient";
import { getTutors } from "../../../../api/repository/Fetchprofile.repository";
import { apiUrl } from "../../../../api/apiUtl";
import DefaultProfile from "../../../../assets/img/user3.png";

const Online_Classes = () => {
  const [tutors, setTutors] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openReviewTutor, setOpenReviewTutor] = useState(null);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);

  // Inline message
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate();

  useEffect(() => {
    fetchTutors();
    fetchBookmarks();
  }, []);

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const fetchTutors = async () => {
    try {
      const res = await getTutors();
      setTutors(Array.isArray(res) ? res : []);
    } catch {
      showMessage("Failed to load tutors", "error");
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

  const handleBookDemo = () => {
    navigate("/add_class-form_student");
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

<<<<<<< HEAD
  const handleViewAllInstructors = () => {
    // Pass the current tutors data to FindTutorShow component
    navigate("/student_find_tutor", { 
      state: { 
        preloadedTutors: tutors,
        fromOnlineClasses: true 
      } 
    });
  };

=======
>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed
  const getImageUrl = (profilePhoto) => {
    if (!profilePhoto || profilePhoto === "null" || profilePhoto.trim() === "") {
      return DefaultProfile;
    }
    if (profilePhoto.startsWith("http")) return profilePhoto;
    return `${apiUrl.baseUrl}${profilePhoto}`;
  };

  return (
    <div className="w-full px-6 py-6 bg-gray-100 mt-10">
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

<<<<<<< HEAD
      {/* Header Section with View All Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Available Tutors</h2>
        
        {/* View All Instructors Button */}
        <button
          onClick={handleViewAllInstructors}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-md hover:shadow-lg"
        >
          <FiUsers className="text-lg" />
          View All Instructors
        </button>
      </div>
=======
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Available Tutors
      </h2>
>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : tutors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 text-lg">No tutors found.</p>
        </div>
      ) : (
        tutors.map((tutor) => (
          <div
            key={tutor.user_id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-40 h-40 sm:h-auto">
                <img
                  src={getImageUrl(tutor.profile_photo)}
                  alt={tutor.name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = DefaultProfile)}
                />
              </div>

              <div className="flex flex-col justify-between flex-1 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-md font-semibold text-gray-800">
                      {tutor.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {tutor.Location?.city || "N/A"},{" "}
                      {tutor.Location?.state || "N/A"}
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
                    onClick={() => handleViewContact(tutor)}
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

<<<<<<< HEAD
                  {/* <button
=======
                  <button
                    onClick={handleBookDemo}
                    className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold py-2 px-4 rounded-md"
                  >
                    Book A Demo
                  </button>

                  <button
>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed
                    onClick={() => setOpenReviewTutor(tutor)}
                    className="border border-yellow-500 text-yellow-600 text-sm px-4 py-1.5 rounded-md hover:bg-yellow-50"
                  >
                    Rate & Review
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        ))
      )}

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
};

export default Online_Classes;
