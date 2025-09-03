// // src/components/TutorProfile.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { FaCheckCircle, FaTimesCircle, FaEnvelope, FaPhone } from "react-icons/fa";
// import { FiArrowLeft, FiMoreVertical, FiShare2 } from "react-icons/fi";
// import apiClient from "../../../../api/apiclient"; // 👈 use your axios instance

// const TutorProfile = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("profile");
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [reportOpen, setReportOpen] = useState(false);
//   const [tutor, setTutor] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch tutor data
//   useEffect(() => {
//     const fetchTutor = async () => {
//       try {
//         const res = await apiClient.get(`/tutors/${id}`); // 👈 your backend API
//         setTutor(res.data);
//       } catch (err) {
//         console.error("Error fetching tutor:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTutor();
//   }, [id]);

//   if (loading) {
//     return <div className="p-6 text-center">Loading tutor profile...</div>;
//   }

//   if (!tutor) {
//     return <div className="p-6 text-center text-red-600">Tutor not found.</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
//       {/* Subject Header with Menu */}
//       <div className="flex justify-between items-center border-b py-3 px-4 bg-gray-50 mb-4">
//         <div className="flex items-center gap-3">
//           <FiArrowLeft
//             className="text-xl cursor-pointer"
//             onClick={() => navigate(-1)}
//           />
//           <span className="font-medium">{tutor.subjects?.[0] || "Tuition"}</span>
//         </div>

//         <div className="flex items-center gap-4 relative">
//           <FiShare2 className="text-gray-500 cursor-pointer" />
//           <div className="relative">
//             <FiMoreVertical
//               className="text-gray-500 cursor-pointer"
//               onClick={() => setMenuOpen(!menuOpen)}
//             />
//             {menuOpen && (
//               <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border z-50">
//                 <button
//                   onClick={() => {
//                     setReportOpen(true);
//                     setMenuOpen(false);
//                   }}
//                   className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                 >
//                   Report this profile
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Header Info */}
//       <div className="flex gap-6 mb-6">
//         <img
//           src={tutor.profile_photo || "https://via.placeholder.com/150"}
//           alt={tutor.name}
//           className="w-28 h-28 rounded-lg object-cover"
//         />
//         <div>
//           <h2 className="text-2xl font-bold">{tutor.name}</h2>
//           <p className="text-teal-600 font-semibold">
//             {tutor.teaching_modes?.join(", ") || "Online Classes"}
//           </p>
//           <p className="text-gray-600">{tutor.experience} yrs of Exp</p>
//           <p className="text-gray-600">
//             {tutor.Location?.city}, {tutor.Location?.state}
//           </p>
//           <p className="text-gray-500 text-sm">
//             Last Active - {tutor.last_active || "Recently"}
//           </p>

//           {/* Contact Buttons */}
//           <div className="mt-4">
//             <p className="text-gray-600 mb-2">
//               Contact to Book a Free Demo Class.
//             </p>
//             <div className="flex gap-3">
//               <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
//                 <FaEnvelope className="text-sm" />{" "}
//                 <span className="font-medium">Message</span>
//               </button>
//               <button className="flex items-center gap-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50">
//                 <FaPhone className="text-sm" />{" "}
//                 <span className="font-medium">Call</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="border-b mb-6 flex gap-6">
//         <button
//           className={`pb-2 ${
//             activeTab === "profile"
//               ? "border-b-2 border-teal-500 text-teal-600"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("profile")}
//         >
//           Profile
//         </button>
//         <button
//           className={`pb-2 ${
//             activeTab === "classes"
//               ? "border-b-2 border-teal-500 text-teal-600"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("classes")}
//         >
//           Classes
//         </button>
//         <button
//           className={`pb-2 ${
//             activeTab === "reviews"
//               ? "border-b-2 border-teal-500 text-teal-600"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("reviews")}
//         >
//           Reviews
//         </button>
//       </div>

//       {/* Tab Content */}
//       {activeTab === "profile" && (
//         <>
//           {/* Overview */}
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold mb-2">Overview</h3>
//             <p className="text-gray-700">{tutor.overview}</p>
//           </div>

//           {/* Languages */}
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold mb-2">Languages Spoken</h3>
//             {tutor.languages.map((lang, idx) => (
//               <div
//                 key={idx}
//                 className="flex justify-between text-gray-700 mb-1"
//               >
//                 <span>{lang.name}</span>
//                 <span>{lang.level}</span>
//               </div>
//             ))}
//           </div>

//           {/* Education */}
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold mb-2">Education</h3>
//             <ul className="list-disc list-inside text-gray-700">
//               {tutor.education.map((edu, idx) => (
//                 <li key={idx}>
//                   {edu.university} - {edu.degree} ({edu.year})
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Address */}
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold mb-2">Address</h3>
//             <p className="text-gray-700">{tutor.location}</p>
//           </div>
//         </>
//       )}

//       {/* Classes Tab */}
//       {activeTab === "classes" && (
//         <>
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold mb-2">Class Location</h3>
//             <div className="text-gray-700 space-y-1">
//               <p className="flex items-center gap-2">
//                 {tutor.classLocation.online ? (
//                   <FaCheckCircle className="text-green-600" />
//                 ) : (
//                   <FaTimesCircle className="text-red-500" />
//                 )}
//                 Online Classes
//               </p>
//               <p className="flex items-center gap-2">
//                 {tutor.classLocation.studentHome ? (
//                   <FaCheckCircle className="text-green-600" />
//                 ) : (
//                   <FaTimesCircle className="text-red-500" />
//                 )}
//                 Student's Home
//               </p>
//               <p className="flex items-center gap-2">
//                 {tutor.classLocation.tutorHome ? (
//                   <FaCheckCircle className="text-green-600" />
//                 ) : (
//                   <FaTimesCircle className="text-red-500" />
//                 )}
//                 Tutor's Home
//               </p>
//             </div>
//           </div>

//           <p className="mb-2">
//             <strong>Years of Experience in BSc Tuition:</strong>{" "}
//             {tutor.bscExperienceYears}
//           </p>

//           <div className="mb-6">
//             <h3 className="text-lg font-semibold mb-2">BSc Botany Subjects</h3>
//             <p className="text-gray-700">{tutor.bscSubjects}</p>
//           </div>

//           <p>
//             <strong>Experience in School or College:</strong>{" "}
//             {tutor.schoolOrCollegeExperience}
//           </p>
//           <p>
//             <strong>Type of Class:</strong> {tutor.classType}
//           </p>
//           <p>
//             <strong>Class Strength:</strong> {tutor.classStrength}
//           </p>
//           <p>
//             <strong>Taught in School or College:</strong>{" "}
//             {tutor.taughtInSchool ? "Yes" : "No"}
//           </p>
//           <p>
//             <strong>BSc Branch:</strong> {tutor.bscBranch}
//           </p>
//           <p>
//             <strong>Detailed Teaching Experience:</strong>{" "}
//             {tutor.detailedTeachingExperience}
//           </p>
//         </>
//       )}

//       {/* Reviews Tab */}
//       {activeTab === "reviews" && (
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-2">Reviews</h3>
//           <div className="bg-gray-100 p-4 rounded-lg text-center">
//             <p className="text-gray-700">No Reviews yet!</p>
//             <a
//               href="#"
//               className="text-blue-600 font-medium hover:underline"
//             >
//               Be the first one to Review
//             </a>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TutorProfile;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../../../api/apiclient";

export default function TutorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const res = await apiClient.get(`/profile/public/tutors/${id}`);
        setTutor(res.data.tutor);
      } catch (err) {
        console.error("Error fetching tutor:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTutor();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!tutor) return <p>No tutor found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Go to Dashboard
      </button>

      <div className="bg-white shadow rounded p-6">
        <div className="flex gap-6">
          <img
            src={tutor.profile_photo}
            alt={tutor.name}
            className="w-32 h-32 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">{tutor.name}</h2>
            <p className="text-gray-600">{tutor.gender}</p>
            <p className="text-gray-600">{tutor.experience} years experience</p>
            <p className="text-gray-600">₹{tutor.pricing_per_hour}/hr</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Subjects</h3>
          <p>{tutor.subjects?.join(", ")}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold">Classes</h3>
          <p>{tutor.classes?.join(", ")}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold">Languages</h3>
          <p>{tutor.languages?.join(", ")}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold">Introduction</h3>
          <p>{tutor.introduction_text}</p>
          {tutor.introduction_video && (
            <video src={tutor.introduction_video} controls className="mt-2 w-full rounded" />
          )}
        </div>
      </div>
    </div>
  );
}
