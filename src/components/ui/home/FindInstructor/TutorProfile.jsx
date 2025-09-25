// // src/pages/TutorProfilePage.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   FaCheckCircle,
//   FaEnvelope,
//   FaPhone,
//   FaStar,
//   FaGraduationCap,
//   FaMapMarkerAlt,
//   FaGlobe,
//   FaBook,
//   FaClock,
//   FaCalendarAlt,
// } from "react-icons/fa";
// import { FiArrowLeft, FiShare2 } from "react-icons/fi";
// import publicClient from "../../../../api/publicClient";
// import { apiClient } from "../../../../api/apiclient";
// import Layout from "../layout/MainLayout";

// export default function TutorProfilePage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [tutor, setTutor] = useState(null);
//   const [tutorProfile, setTutorProfile] = useState(null);
//   const [availability, setAvailability] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("profile");
//   const [redirecting, setRedirecting] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch basic tutor info
//         const tutorRes = await publicClient.get(`/profile/public/tutors/${id}`);
//         setTutor(tutorRes.data);

//         // Fetch detailed tutor profile using apiClient
//         try {
//           const profileRes = await apiClient.get(`/tutor/profile/${id}`);
//           setTutorProfile(profileRes.data);
//         } catch (err) {
//           console.error("Error fetching detailed profile:", err);
//         }

//         // Fetch tutor availability
//         try {
//           const availabilityRes = await apiClient.get(`/tutor/${id}/availability`);
//           setAvailability(availabilityRes.data);
//         } catch (err) {
//           console.error("Error fetching availability:", err);
//         }
//       } catch (err) {
//         console.error("Error fetching tutor:", err);
//         setTutor(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id]);

//   // Helper function to parse languages properly
//   const parseLanguages = (languages) => {
//     if (!languages || !Array.isArray(languages)) return [];

//     return languages.map(lang => {
//       if (typeof lang === 'string') {
//         // Try to parse if it's a JSON string
//         try {
//           return JSON.parse(lang);
//         } catch {
//           return { name: lang, proficiency: "" };
//         }
//       }
//       return lang;
//     });
//   };

//   const handleLoginRedirect = () => {
//     setRedirecting(true);
//     setTimeout(() => {
//       navigate("/login");
//     }, 1500); // wait 1.5 seconds before redirect
//   };
//   if (redirecting) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
//           <p className="text-gray-700 font-medium">Redirecting you to login...</p>
//         </div>
//       </div>
//     );
//   }


//   // Helper function to format availability
//   const formatAvailability = (availability) => {
//     const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//     const groupedAvailability = {};

//     availability.forEach(slot => {
//       const day = days[new Date(slot.date).getDay()];
//       if (!groupedAvailability[day]) {
//         groupedAvailability[day] = [];
//       }
//       groupedAvailability[day].push({
//         startTime: slot.start_time,
//         endTime: slot.end_time,
//         date: slot.date
//       });
//     });

//     return groupedAvailability;
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
//       </div>
//     );

//   if (!tutor)
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Tutor Not Found</h2>
//           <p className="text-gray-600 mb-4">The tutor profile you're looking for doesn't exist.</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );

//   // Calculate average rating
//   const averageRating = tutor.reviews && tutor.reviews.length > 0
//     ? (tutor.reviews.reduce((sum, review) => sum + review.rating, 0) / tutor.reviews.length).toFixed(1)
//     : "No ratings";

//   const parsedLanguages = parseLanguages(tutor.languages || tutorProfile?.languages);
//   const formattedAvailability = formatAvailability(availability);

//   return (
//     <Layout showNavbar={false}>
//       <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-5xl mx-auto">
//           {/* Header with back + share */}
//           <div className="flex justify-between items-center mb-6">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center text-gray-600 hover:text-teal-600 transition-colors"
//             >
//               <FiArrowLeft className="mr-2" />
//               Back
//             </button>
//             <button className="p-2 text-gray-500 hover:text-teal-600 rounded-full hover:bg-gray-100 transition-colors">
//               <FiShare2 />
//             </button>
//           </div>

//           {/* Main Card */}
//           <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
//             {/* Tutor main info */}
//             <div className="p-6 flex flex-col md:flex-row gap-6">
//               <div className="flex-shrink-0">
//                 <img
//                   src={tutor.profile_photo || tutorProfile?.profile_photo || "https://via.placeholder.com/150"}
//                   alt={tutor.name}
//                   className="w-32 h-32 rounded-lg object-cover mx-auto md:mx-0"
//                 />
//               </div>

//               <div className="flex-grow">
//                 <div className="flex flex-col md:flex-row md:justify-between md:items-start">
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-800">{tutor.name}</h2>
//                     <div className="flex items-center mt-1 mb-2">
//                       <div className="flex text-yellow-400 mr-2">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                           <FaStar
//                             key={star}
//                             className={star <= Math.round(averageRating) ? "fill-current" : "text-gray-300"}
//                             size={16}
//                           />
//                         ))}
//                       </div>
//                       <span className="text-gray-600 text-sm">
//                         {averageRating} {tutor.reviews && `(${tutor.reviews.length} reviews)`}
//                       </span>
//                     </div>
//                     <p className="text-teal-600 font-semibold flex items-center">
//                       <FaBook className="mr-2" size={14} />
//                       {tutor.subjects?.[0] || tutorProfile?.subjects?.[0] || "General Tutor"}
//                     </p>
//                     <p className="text-gray-600 flex items-center mt-1">
//                       <FaMapMarkerAlt className="mr-2" size={14} />
//                       {tutor.Location?.city || tutorProfile?.Location?.city}, {tutor.Location?.state || tutorProfile?.Location?.state}
//                     </p>
//                   </div>

//                   <div className="mt-4 md:mt-0 text-right">
//                     <p className="text-2xl font-bold text-teal-600">₹{tutor.pricing_per_hour || tutorProfile?.pricing_per_hour}/hr</p>
//                     <p className="text-gray-600 text-sm">{tutor.experience || tutorProfile?.experience} years experience</p>
//                   </div>
//                 </div>

//                 {/* Teaching Modes */}
//                 {(tutor.teaching_modes || tutorProfile?.teaching_modes) && (tutor.teaching_modes || tutorProfile?.teaching_modes).length > 0 && (
//                   <div className="mt-4 flex flex-wrap gap-2">
//                     {(tutor.teaching_modes || tutorProfile?.teaching_modes).map((mode, index) => (
//                       <span
//                         key={index}
//                         className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
//                       >
//                         {mode}
//                       </span>
//                     ))}
//                   </div>
//                 )}

//                 {/* Contact Buttons */}
//                 {/* <div className="mt-6 flex flex-col sm:flex-row gap-3">
//                   <button
//                     className="flex items-center justify-center gap-2 bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors flex-1"
//                   >
//                     <FaEnvelope className="text-sm" /> Message
//                   </button>
//                   <button className="flex items-center justify-center gap-2 border border-teal-500 text-teal-500 px-6 py-3 rounded-lg hover:bg-teal-50 transition-colors flex-1">
//                     <FaPhone className="text-sm" /> Call
//                   </button>
//                 </div> */}

//                 <div className="mt-6 flex flex-col sm:flex-row gap-3">
//                   <button
//                     onClick={handleLoginRedirect}
//                     className="flex items-center justify-center gap-2 bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors flex-1"
//                   >
//                     <FaEnvelope className="text-sm" /> Message
//                   </button>
//                   <button
//                     onClick={handleLoginRedirect}
//                     className="flex items-center justify-center gap-2 border border-teal-500 text-teal-500 px-6 py-3 rounded-lg hover:bg-teal-50 transition-colors flex-1"
//                   >
//                     <FaPhone className="text-sm" /> Call
//                   </button>
//                 </div>

//               </div>
//             </div>

//             {/* Tabs */}
//             <div className="border-t flex overflow-x-auto">
//               <button
//                 className={`flex-1 md:flex-none px-6 py-4 text-center font-medium whitespace-nowrap ${activeTab === "profile" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-gray-700"}`}
//                 onClick={() => setActiveTab("profile")}
//               >
//                 Profile
//               </button>
//               <button
//                 className={`flex-1 md:flex-none px-6 py-4 text-center font-medium whitespace-nowrap ${activeTab === "availability" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-gray-700"}`}
//                 onClick={() => setActiveTab("availability")}
//               >
//                 Availability
//               </button>
//               <button
//                 className={`flex-1 md:flex-none px-6 py-4 text-center font-medium whitespace-nowrap ${activeTab === "classes" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-gray-700"}`}
//                 onClick={() => setActiveTab("classes")}
//               >
//                 Classes
//               </button>
//               <button
//                 className={`flex-1 md:flex-none px-6 py-4 text-center font-medium whitespace-nowrap ${activeTab === "reviews" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-gray-700"}`}
//                 onClick={() => setActiveTab("reviews")}
//               >
//                 Reviews {tutor.reviews && `(${tutor.reviews.length})`}
//               </button>
//             </div>

//             {/* Tab Content */}
//             <div className="p-6">
//               {/* Profile Tab */}
//               {activeTab === "profile" && (
//                 <div className="space-y-6">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-800 mb-3">Overview</h3>
//                     <p className="text-gray-700 leading-relaxed">
//                       {tutor.introduction_text || tutorProfile?.introduction_text ||
//                         "Introduction is not provided. Please refer to the tutor’s profile details for more information."}
//                     </p>
//                     {(tutor.introduction_video || tutorProfile?.introduction_video) && (
//                       <div className="mt-4 aspect-video bg-gray-100 rounded-lg overflow-hidden">
//                         <video
//                           src={tutor.introduction_video || tutorProfile?.introduction_video}
//                           controls
//                           className="w-full h-full"
//                         />
//                       </div>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Languages */}
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                         <FaGlobe className="mr-2 text-teal-500" /> Languages Spoken
//                       </h3>
//                       {parsedLanguages.length > 0 ? (
//                         <div className="space-y-2">
//                           {parsedLanguages.map((lang, idx) => (
//                             <div
//                               key={idx}
//                               className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
//                             >
//                               <span className="font-medium text-gray-800">
//                                 {lang.name || lang.language || "Unknown Language"}
//                               </span>
//                               {lang.proficiency && (
//                                 <span className="px-2 py-1 bg-teal-100 text-teal-800 text-sm rounded-full">
//                                   {lang.proficiency}
//                                 </span>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <p className="text-gray-500 bg-gray-50 p-4 rounded-lg text-center">Not specified</p>
//                       )}
//                     </div>

//                     {/* Education */}
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                         <FaGraduationCap className="mr-2 text-teal-500" /> Education
//                       </h3>
//                       {(tutor.degrees || tutorProfile?.degrees)?.length > 0 ? (
//                         <div className="space-y-2">
//                           {(tutor.degrees || tutorProfile?.degrees).map((degree, idx) => (
//                             <div key={idx} className="flex items-start p-3 bg-gray-50 rounded-lg">
//                               <FaCheckCircle className="text-teal-500 mt-1 mr-3 flex-shrink-0" />
//                               <span className="text-gray-700">{degree}</span>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <p className="text-gray-500 bg-gray-50 p-4 rounded-lg text-center">No education details provided</p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Subjects */}
//                   {(tutor.subjects || tutorProfile?.subjects) && (tutor.subjects || tutorProfile?.subjects).length > 0 && (
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                         <FaBook className="mr-2 text-teal-500" /> Subjects
//                       </h3>
//                       <div className="flex flex-wrap gap-2">
//                         {(tutor.subjects || tutorProfile?.subjects).map((subject, idx) => (
//                           <span
//                             key={idx}
//                             className="px-3 py-2 bg-teal-100 text-teal-800 rounded-lg font-medium"
//                           >
//                             {subject}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Address */}
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                       <FaMapMarkerAlt className="mr-2 text-teal-500" /> Address
//                     </h3>
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                       <p className="text-gray-700">
//                         {(tutor.Location?.address || tutorProfile?.Location?.address) ||
//                           `${(tutor.Location?.city || tutorProfile?.Location?.city) || ""}, ${(tutor.Location?.state || tutorProfile?.Location?.state) || ""}`}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Availability Tab */}
//               {activeTab === "availability" && (
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                     <FaCalendarAlt className="mr-2 text-teal-500" /> Class Availability
//                   </h3>
//                   {Object.keys(formattedAvailability).length > 0 ? (
//                     <div className="space-y-4">
//                       {Object.entries(formattedAvailability).map(([day, slots]) => (
//                         <div key={day} className="border rounded-lg p-4">
//                           <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
//                             <FaClock className="mr-2 text-teal-500" />
//                             {day}
//                           </h4>
//                           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
//                             {slots.map((slot, idx) => (
//                               <div
//                                 key={idx}
//                                 className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-center hover:bg-teal-100 transition-colors cursor-pointer"
//                               >
//                                 <div className="text-teal-800 font-medium">
//                                   {slot.startTime} - {slot.endTime}
//                                 </div>
//                                 <div className="text-teal-600 text-sm mt-1">
//                                   {new Date(slot.date).toLocaleDateString()}
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center py-12 bg-gray-50 rounded-lg">
//                       <FaCalendarAlt className="text-gray-300 mx-auto mb-4" size={48} />
//                       <p className="text-gray-500 text-lg">No availability set</p>
//                       <p className="text-gray-400 text-sm mt-2">The tutor hasn't set their available time slots yet</p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Classes Tab */}
//               {activeTab === "classes" && (
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Classes</h3>
//                   {(tutor.classes || tutorProfile?.classes)?.length > 0 ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       {(tutor.classes || tutorProfile?.classes).map((cls, idx) => (
//                         <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
//                           <div className="flex items-center">
//                             <div className="bg-teal-100 p-2 rounded-full mr-3">
//                               <FaBook className="text-teal-600" />
//                             </div>
//                             <div>
//                               <h4 className="font-medium">{cls.title || `Class ${idx + 1}`}</h4>
//                               <p className="text-sm text-gray-500">{cls.subject || "General"}</p>
//                             </div>
//                           </div>
//                           <div className="mt-3 flex justify-between items-center">
//                             <span className="text-teal-600 font-semibold">₹{cls.price || tutor.pricing_per_hour || tutorProfile?.pricing_per_hour}/hr</span>
//                             <button
//                               onClick={() => navigate("/book-demo")}
//                               className="text-sm bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600 transition-colors"
//                             >
//                               Enroll
//                             </button>

//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <FaBook className="text-gray-300 mx-auto" size={48} />
//                       <p className="text-gray-500 mt-2">No classes available yet</p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Reviews Tab */}
//               {activeTab === "reviews" && (
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Reviews</h3>
//                   {tutor.reviews && tutor.reviews.length > 0 ? (
//                     <div className="space-y-6">
//                       {tutor.reviews.map((review) => (
//                         <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
//                           <div className="flex items-start">
//                             <div className="bg-teal-100 text-teal-800 w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
//                               {review.Reviewer?.name?.charAt(0) || "A"}
//                             </div>
//                             <div className="flex-grow">
//                               <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
//                                 <h4 className="font-medium text-gray-800">
//                                   {review.Reviewer?.name || "Anonymous"}
//                                 </h4>
//                                 <div className="flex items-center mt-1 sm:mt-0">
//                                   <div className="flex text-yellow-400 mr-2">
//                                     {[1, 2, 3, 4, 5].map((star) => (
//                                       <FaStar
//                                         key={star}
//                                         className={star <= review.rating ? "fill-current" : "text-gray-300"}
//                                         size={14}
//                                       />
//                                     ))}
//                                   </div>
//                                   <span className="text-sm text-gray-500">{review.rating}/5</span>
//                                 </div>
//                               </div>
//                               <p className="text-gray-600 mt-2">{review.comment}</p>
//                               {review.date && (
//                                 <p className="text-sm text-gray-400 mt-2">
//                                   {new Date(review.date).toLocaleDateString()}
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <FaStar className="text-gray-300 mx-auto" size={48} />
//                       <p className="text-gray-500 mt-2">No reviews yet</p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }

// src/pages/TutorProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaEnvelope,
  FaPhone,
  FaStar,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaGlobe,
  FaBook,
  FaClock,
  FaCalendarAlt,
  FaSchool,
  FaChalkboardTeacher
} from "react-icons/fa";
import { FiArrowLeft, FiShare2 } from "react-icons/fi";
import publicClient from "../../../../api/publicClient";
import { apiClient } from "../../../../api/apiclient";
import Layout from "../layout/MainLayout";

export default function TutorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const [tutorProfile, setTutorProfile] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch basic tutor info
        const tutorRes = await publicClient.get(`/profile/public/tutors/${id}`);
        setTutor(tutorRes.data);

        // Fetch detailed tutor profile using apiClient
        try {
          const profileRes = await apiClient.get(`/tutor/profile/${id}`);
          setTutorProfile(profileRes.data);
        } catch (err) {
          console.error("Error fetching detailed profile:", err);
        }

        // Fetch tutor availability
        try {
          const availabilityRes = await apiClient.get(`/tutor/${id}/availability`);
          setAvailability(availabilityRes.data);
        } catch (err) {
          console.error("Error fetching availability:", err);
        }
      } catch (err) {
        console.error("Error fetching tutor:", err);
        setTutor(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Helper function to parse languages properly
  const parseLanguages = (languages) => {
    if (!languages || !Array.isArray(languages)) return [];

    return languages.map(lang => {
      if (typeof lang === 'string') {
        // Try to parse if it's a JSON string
        try {
          return JSON.parse(lang);
        } catch {
          return { name: lang, proficiency: "" };
        }
      }
      return lang;
    });
  };

  const handleLoginRedirect = () => {
    setRedirecting(true);
    setTimeout(() => {
      navigate("/login");
    }, 1500); // wait 1.5 seconds before redirect
  };

  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  // Helper function to format availability by days of week
  const formatAvailabilityByDays = (availability) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayMap = {
      'Sunday': 0,
      'Monday': 1,
      'Tuesday': 2,
      'Wednesday': 3,
      'Thursday': 4,
      'Friday': 5,
      'Saturday': 6
    };

    const groupedByDay = {};

    // Initialize empty arrays for each day
    daysOfWeek.forEach(day => {
      groupedByDay[day] = [];
    });

    // Group availability by day of week
    availability.forEach(slot => {
      const dayIndex = new Date(slot.date).getDay();
      const dayName = daysOfWeek[dayIndex];

      if (!groupedByDay[dayName]) {
        groupedByDay[dayName] = [];
      }

      groupedByDay[dayName].push({
        startTime: slot.start_time,
        endTime: slot.end_time,
        date: slot.date
      });
    });

    return groupedByDay;
  };

  // Check if tutor has weekly availability
  const hasWeeklyAvailability = (availability) => {
    const weeklyDays = ['Weekdays', 'Weekends', 'All Week'];
    return availability && availability.some(item => weeklyDays.includes(item));
  };

  // Get weekly availability text
  const getWeeklyAvailabilityText = (availability) => {
    if (!availability) return "";

    if (availability.includes('Weekdays')) {
      return "Available on Weekdays (Monday to Friday)";
    } else if (availability.includes('Weekends')) {
      return "Available on Weekends (Saturday & Sunday)";
    } else if (availability.includes('All Week')) {
      return "Available All Week (Monday to Sunday)";
    }

    return "";
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );

  if (!tutor)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tutor Not Found</h2>
          <p className="text-gray-600 mb-4">The tutor profile you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  // Calculate average rating
  const averageRating = tutor.reviews && tutor.reviews.length > 0
    ? (tutor.reviews.reduce((sum, review) => sum + review.rating, 0) / tutor.reviews.length).toFixed(1)
    : "No ratings";

  const parsedLanguages = parseLanguages(tutor.languages || tutorProfile?.languages);
  const formattedAvailability = formatAvailabilityByDays(availability);
  const tutorAvailability = tutor.availability || tutorProfile?.availability || [];
  const hasWeeklyAvail = hasWeeklyAvailability(tutorAvailability);
  const weeklyAvailabilityText = getWeeklyAvailabilityText(tutorAvailability);

  return (
    <Layout showNavbar={false}>
      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header with back + share */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-teal-600 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Back
            </button>
            <button
              onClick={() => {
                const shareData = {
                  title: tutor.name,
                  text: `Check out ${tutor.name}'s tutor profile on Dronacharya!`,
                  url: window.location.href,
                };

                if (navigator.share) {
                  navigator.share(shareData).catch((err) => console.error("Share failed:", err));
                } else {
                  navigator.clipboard.writeText(window.location.href).then(() => {
                    alert("Profile link copied to clipboard!");
                  });
                }
              }}
              className="p-2 text-gray-500 hover:text-teal-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FiShare2 />
            </button>

          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
            {/* Tutor main info */}
            <div className="p-6 flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src={tutor.profile_photo || tutorProfile?.profile_photo || "https://via.placeholder.com/150"}
                  alt={tutor.name}
                  className="w-32 h-32 rounded-lg object-cover mx-auto md:mx-0"
                />
              </div>

              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{tutor.name}</h2>
                    <div className="flex items-center mt-1 mb-2">
                      <div className="flex text-yellow-400 mr-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={star <= Math.round(averageRating) ? "fill-current" : "text-gray-300"}
                            size={16}
                          />
                        ))}
                      </div>
                      <span className="text-gray-600 text-sm">
                        {averageRating} {tutor.reviews && `(${tutor.reviews.length} reviews)`}
                      </span>
                    </div>
                    <p className="text-teal-600 font-semibold flex items-center">
                      <FaBook className="mr-2" size={14} />
                      {tutor.subjects?.[0] || tutorProfile?.subjects?.[0] || "General Tutor"}
                    </p>
                    <p className="text-gray-600 flex items-center mt-1">
                      <FaMapMarkerAlt className="mr-2" size={14} />
                      {tutor.Location?.city || tutorProfile?.Location?.city}, {tutor.Location?.state || tutorProfile?.Location?.state}
                    </p>
                  </div>

                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-2xl font-bold text-teal-600">₹{tutor.pricing_per_hour || tutorProfile?.pricing_per_hour}/hr</p>
                    <p className="text-gray-600 text-sm">{tutor.experience || tutorProfile?.experience} years experience</p>
                  </div>
                </div>

                {/* Teaching Modes */}
                {(tutor.teaching_modes || tutorProfile?.teaching_modes) && (tutor.teaching_modes || tutorProfile?.teaching_modes).length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(tutor.teaching_modes || tutorProfile?.teaching_modes).map((mode, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
                      >
                        {mode}
                      </span>
                    ))}
                  </div>
                )}

                {/* Contact Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleLoginRedirect}
                    className="flex items-center justify-center gap-2 bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors flex-1"
                  >
                    <FaEnvelope className="text-sm" /> Message
                  </button>
                  <button
                    onClick={handleLoginRedirect}
                    className="flex items-center justify-center gap-2 border border-teal-500 text-teal-500 px-6 py-3 rounded-lg hover:bg-teal-50 transition-colors flex-1"
                  >
                    <FaPhone className="text-sm" /> Call
                  </button>
                </div>

              </div>
            </div>

            {/* Tabs */}
            <div className="border-t flex overflow-x-auto">
              <button
                className={`flex-1 md:flex-none px-6 py-4 text-center font-medium whitespace-nowrap ${activeTab === "profile" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </button>
              <button
                className={`flex-1 md:flex-none px-6 py-4 text-center font-medium whitespace-nowrap ${activeTab === "availability" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("availability")}
              >
                Availability
              </button>
              <button
                className={`flex-1 md:flex-none px-6 py-4 text-center font-medium whitespace-nowrap ${activeTab === "classes" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("classes")}
              >
                Classes
              </button>
              <button
                className={`flex-1 md:flex-none px-6 py-4 text-center font-medium whitespace-nowrap ${activeTab === "reviews" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews {tutor.reviews && `(${tutor.reviews.length})`}
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">

              {activeTab === "profile" && (
                <div className="space-y-6">

                  {/* ================= Overview ================= */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Overview</h3>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                      {tutor.introduction_text || tutorProfile?.introduction_text ||
                        "Introduction is not provided. Please refer to the tutor's profile details for more information."}
                    </p>

                    {(tutor.introduction_video || tutorProfile?.introduction_video) && (
                      <div className="mt-4 aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                        <video
                          src={tutor.introduction_video || tutorProfile?.introduction_video}
                          controls
                          className="w-full h-full"
                        />
                      </div>
                    )}
                  </div>

                  {/* ================= Grid Layout ================= */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* ================= Languages Spoken ================= */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <FaGlobe className="mr-2 text-teal-500" /> Languages Spoken
                      </h3>

                      {parsedLanguages.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          {parsedLanguages.map((lang, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
                            >
                              <span className="font-medium text-gray-800 text-sm sm:text-base">
                                {lang.name || lang.language || "Unknown Language"}
                              </span>
                              {lang.proficiency && (
                                <span className="inline-flex px-3 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full">
                                  {lang.proficiency}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-2">Not specified</p>
                      )}
                    </div>

                    {/* ================= Address ================= */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-teal-500" /> Address
                      </h3>

                      <div className="bg-gray-50 px-4 py-3 rounded-lg shadow-sm">
                        <p className="text-gray-700 text-sm sm:text-base">
                          {(tutor.Location?.address || tutorProfile?.Location?.address) ||
                            `${(tutor.Location?.city || tutorProfile?.Location?.city) || ""}, ${(tutor.Location?.state || tutorProfile?.Location?.state) || ""}`}
                        </p>
                      </div>
                    </div>

                    {/* ================= Subjects ================= */}
                    {(tutor.subjects || tutorProfile?.subjects)?.length > 0 && (
                      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
                          <FaBook className="mr-2 text-teal-500" /> Subjects
                        </h3>

                        <div className="flex flex-wrap gap-2">
                          {(tutor.subjects || tutorProfile?.subjects).map((subject, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-teal-100 text-teal-800 rounded-lg font-medium text-sm"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ================= Education ================= */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <FaGraduationCap className="mr-2 text-teal-500" /> Education
                      </h3>

                      <div className="flex flex-col gap-3">
                        {/* Board */}
                        {(tutor.board || tutorProfile?.board) && (
                          <div className="flex items-start gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                            <FaChalkboardTeacher className="text-teal-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-600">Board</p>
                              <p className="text-gray-800 text-sm sm:text-base">
                                {tutor.board || tutorProfile?.board}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* School */}
                        {(tutor.school_name || tutorProfile?.school_name) && (
                          <div className="flex items-start gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                            <FaSchool className="text-teal-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-600">School</p>
                              <p className="text-gray-800 text-sm sm:text-base">
                                {tutor.school_name || tutorProfile?.school_name}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Degree Status */}
                        {(tutor.degree_status || tutorProfile?.degree_status) && (
                          <div className="flex items-start gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                            <FaCheckCircle className="text-teal-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-600">Degree Status</p>
                              <p className="text-gray-800 text-sm sm:text-base">
                                {tutor.degree_status || tutorProfile?.degree_status}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Degrees */}
                        {(tutor.degrees || tutorProfile?.degrees)?.length > 0 ? (
                          (tutor.degrees || tutorProfile?.degrees).map((degree, idx) => (
                            <div key={idx} className="flex items-start gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                              <FaGraduationCap className="text-teal-500 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-gray-600">Degree</p>
                                <p className="text-gray-800 text-sm sm:text-base">{degree}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center py-2">No education details provided</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}


              {/* Availability Tab */}
              {activeTab === "availability" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FaCalendarAlt className="mr-2 text-teal-500" /> Class Availability
                  </h3>

                  {/* Weekly Availability */}
                  {hasWeeklyAvail && (
                    <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                      <h4 className="font-semibold text-teal-800 mb-2 flex items-center">
                        <FaClock className="mr-2" />
                        Weekly Availability
                      </h4>
                      <p className="text-teal-700">{weeklyAvailabilityText}</p>
                    </div>
                  )}

                  {Object.keys(formattedAvailability).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(formattedAvailability).map(([day, slots]) => (
                        slots.length > 0 && (
                          <div key={day} className="border rounded-lg p-4">
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                              <FaClock className="mr-2 text-teal-500" />
                              {day}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {slots.map((slot, idx) => (
                                <div
                                  key={idx}
                                  className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-center hover:bg-teal-100 transition-colors cursor-pointer"
                                >
                                  <div className="text-teal-800 font-medium">
                                    {slot.startTime} - {slot.endTime}
                                  </div>
                                  <div className="text-teal-600 text-sm mt-1">
                                    {new Date(slot.date).toLocaleDateString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  ) : !hasWeeklyAvail && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <FaCalendarAlt className="text-gray-300 mx-auto mb-4" size={48} />
                      <p className="text-gray-500 text-lg">No availability set</p>
                      <p className="text-gray-400 text-sm mt-2">The tutor hasn't set their available time slots yet</p>
                    </div>
                  )}
                </div>
              )}

              {/* Classes Tab */}
              {activeTab === "classes" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Classes</h3>
                  {(tutor.classes || tutorProfile?.classes)?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(tutor.classes || tutorProfile?.classes).map((cls, idx) => (
                        <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center">
                            <div className="bg-teal-100 p-2 rounded-full mr-3">
                              <FaBook className="text-teal-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{cls.title || `Class ${idx + 1}`}</h4>
                              <p className="text-sm text-gray-500">{cls.subject || "General"}</p>
                            </div>
                          </div>
                          <div className="mt-3 flex justify-between items-center">
                            <span className="text-teal-600 font-semibold">₹{cls.price || tutor.pricing_per_hour || tutorProfile?.pricing_per_hour}/hr</span>
                            <button
                              onClick={() => navigate("/book-demo")}
                              className="text-sm bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600 transition-colors"
                            >
                              Enroll
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaBook className="text-gray-300 mx-auto" size={48} />
                      <p className="text-gray-500 mt-2">No classes available yet</p>
                    </div>
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Reviews</h3>
                  {tutor.reviews && tutor.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {tutor.reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                          <div className="flex items-start">
                            <div className="bg-teal-100 text-teal-800 w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                              {review.Reviewer?.name?.charAt(0) || "A"}
                            </div>
                            <div className="flex-grow">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                <h4 className="font-medium text-gray-800">
                                  {review.Reviewer?.name || "Anonymous"}
                                </h4>
                                <div className="flex items-center mt-1 sm:mt-0">
                                  <div className="flex text-yellow-400 mr-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <FaStar
                                        key={star}
                                        className={star <= review.rating ? "fill-current" : "text-gray-300"}
                                        size={14}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">{review.rating}/5</span>
                                </div>
                              </div>
                              <p className="text-gray-600 mt-2">{review.comment}</p>
                              {review.date && (
                                <p className="text-sm text-gray-400 mt-2">
                                  {new Date(review.date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaStar className="text-gray-300 mx-auto" size={48} />
                      <p className="text-gray-500 mt-2">No reviews yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}