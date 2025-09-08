// // src/pages/TutorProfilePage.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   FaCheckCircle,
//   FaEnvelope,
//   FaPhone,
// } from "react-icons/fa";
// import { FiArrowLeft, FiShare2 } from "react-icons/fi";
// import publicClient from "../../../../api/publicClient"; // ✅ Public client (no token)
// import Layout from "../layout/MainLayout";

// export default function TutorProfilePage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [tutor, setTutor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("profile");

//   useEffect(() => {
//     const fetchTutor = async () => {
//       try {
//         // ✅ Public GET request (direct tutor object returned)
//         const res = await publicClient.get(`/profile/public/tutors/${id}`);
//         setTutor(res.data); // API directly returns tutor object
//       } catch (err) {
//         console.error("Error fetching tutor:", err);
//         setTutor(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTutor();
//   }, [id]);

//   if (loading)
//     return <div className="p-6 text-center">Loading tutor profile...</div>;
//   if (!tutor)
//     return (
//       <div className="p-6 text-center text-red-600">Tutor not found.</div>
//     );

//   return (
//     <Layout showNavbar={false}>
//       <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
//         {/* Header with back + share */}
//         <div className="flex justify-between items-center border-b py-3 mb-6">
//           <div className="flex items-center gap-3">
//             <FiArrowLeft
//               className="text-xl cursor-pointer"
//               onClick={() => navigate(-1)}
//             />
//             <span className="font-medium">
//               {tutor.subjects?.[0] || "Tutor Profile"}
//             </span>
//           </div>
//           <FiShare2 className="text-gray-500 cursor-pointer" />
//         </div>

//         {/* Tutor main info */}
//         <div className="flex gap-6 mb-6">
//           <img
//             src={tutor.profile_photo || "https://via.placeholder.com/150"}
//             alt={tutor.name}
//             className="w-32 h-32 rounded-lg object-cover"
//           />
//           <div>
//             <h2 className="text-2xl font-bold">{tutor.name}</h2>
//             <p className="text-teal-600 font-semibold">
//               {tutor.teaching_modes?.join(", ") || "Online Classes"}
//             </p>
//             <p className="text-gray-600">{tutor.experience} yrs of Exp</p>
//             <p className="text-gray-600">
//               {tutor.Location?.city}, {tutor.Location?.state}
//             </p>
//             <p className="text-gray-500 text-sm">
//               ₹{tutor.pricing_per_hour}/hr
//             </p>

//             {/* Contact Buttons */}
//             <div className="mt-4 flex gap-3">
//               <button
//                 className="flex items-center gap-2 text-gray-800 px-4 py-2 rounded-md"
//                 style={{ backgroundColor: "#B3EDE3" }} // ✅ Brand faint green
//               >
//                 <FaEnvelope className="text-sm" /> Message
//               </button>
//               <button className="flex items-center gap-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50">
//                 <FaPhone className="text-sm" /> Call
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="border-b mb-6 flex gap-6">
//           <button
//             className={`pb-2 ${
//               activeTab === "profile"
//                 ? "border-b-2 border-teal-500 text-teal-600"
//                 : "text-gray-600"
//             }`}
//             onClick={() => setActiveTab("profile")}
//           >
//             Profile
//           </button>
//           <button
//             className={`pb-2 ${
//               activeTab === "classes"
//                 ? "border-b-2 border-teal-500 text-teal-600"
//                 : "text-gray-600"
//             }`}
//             onClick={() => setActiveTab("classes")}
//           >
//             Classes
//           </button>
//           <button
//             className={`pb-2 ${
//               activeTab === "reviews"
//                 ? "border-b-2 border-teal-500 text-teal-600"
//                 : "text-gray-600"
//             }`}
//             onClick={() => setActiveTab("reviews")}
//           >
//             Reviews
//           </button>
//         </div>

//         {/* Profile Tab */}
//         {activeTab === "profile" && (
//           <>
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold mb-2">Overview</h3>
//               <p className="text-gray-700">
//                 {tutor.introduction_text || "No overview available."}
//               </p>
//               {tutor.introduction_video && (
//                 <video
//                   src={tutor.introduction_video}
//                   controls
//                   className="mt-3 w-full rounded-lg"
//                 />
//               )}
//             </div>

//             <div className="mb-6">
//               <h3 className="text-lg font-semibold mb-2">Languages Spoken</h3>
//               {tutor.languages?.length > 0 ? (
//                 tutor.languages.map((lang, idx) => (
//                   <div
//                     key={idx}
//                     className="flex justify-between text-gray-700 mb-1"
//                   >
//                     <span>{lang.language || lang}</span>
//                     <span>{lang.proficiency || ""}</span>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-600">Not specified</p>
//               )}
//             </div>

//             <div className="mb-6">
//               <h3 className="text-lg font-semibold mb-2">Education</h3>
//               {tutor.degrees?.length > 0 ? (
//                 <ul className="list-disc list-inside text-gray-700">
//                   {tutor.degrees.map((degree, idx) => (
//                     <li key={idx}>{degree}</li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-gray-600">No education details provided</p>
//               )}
//             </div>

//             <div className="mb-6">
//               <h3 className="text-lg font-semibold mb-2">Address</h3>
//               <p className="text-gray-700">
//                 {tutor.Location?.address ||
//                   `${tutor.Location?.city}, ${tutor.Location?.state}`}
//               </p>
//             </div>
//           </>
//         )}

//         {/* Classes Tab */}
//         {activeTab === "classes" && (
//           <div className="mb-6 space-y-3">
//             {tutor.classes?.map((cls, idx) => (
//               <p key={idx} className="flex items-center gap-2">
//                 <FaCheckCircle className="text-green-600" />
//                 Class {cls}
//               </p>
//             ))}
//           </div>
//         )}

//         {/* Reviews Tab */}
//         {activeTab === "reviews" && (
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold mb-2">Reviews</h3>
//             {tutor.reviews && tutor.reviews.length > 0 ? (
//               tutor.reviews.map((review) => (
//                 <div key={review.id} className="border-b py-3">
//                   <p className="font-medium">
//                     {review.Reviewer?.name || "Anonymous"}
//                   </p>
//                   <p>⭐ {review.rating}/5</p>
//                   <p>{review.comment}</p>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-600">No reviews yet</p>
//             )}
//           </div>
//         )}
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
} from "react-icons/fa";
import { FiArrowLeft, FiShare2 } from "react-icons/fi";
import publicClient from "../../../../api/publicClient";
import Layout from "../layout/MainLayout";

export default function TutorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const res = await publicClient.get(`/profile/public/tutors/${id}`);
        setTutor(res.data);
      } catch (err) {
        console.error("Error fetching tutor:", err);
        setTutor(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTutor();
  }, [id]);

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
            <button className="p-2 text-gray-500 hover:text-teal-600 rounded-full hover:bg-gray-100 transition-colors">
              <FiShare2 />
            </button>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
            {/* Tutor main info */}
            <div className="p-6 flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src={tutor.profile_photo || "https://via.placeholder.com/150"}
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
                      {tutor.subjects?.[0] || "General Tutor"}
                    </p>
                    <p className="text-gray-600 flex items-center mt-1">
                      <FaMapMarkerAlt className="mr-2" size={14} />
                      {tutor.Location?.city}, {tutor.Location?.state}
                    </p>
                  </div>
                  
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-2xl font-bold text-teal-600">₹{tutor.pricing_per_hour}/hr</p>
                    <p className="text-gray-600 text-sm">{tutor.experience} years experience</p>
                  </div>
                </div>

                {/* Teaching Modes */}
                {tutor.teaching_modes && tutor.teaching_modes.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tutor.teaching_modes.map((mode, index) => (
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
                    className="flex items-center justify-center gap-2 bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors flex-1"
                  >
                    <FaEnvelope className="text-sm" /> Message
                  </button>
                  <button className="flex items-center justify-center gap-2 border border-teal-500 text-teal-500 px-6 py-3 rounded-lg hover:bg-teal-50 transition-colors flex-1">
                    <FaPhone className="text-sm" /> Call
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t flex overflow-x-auto">
              <button
                className={`flex-1 md:flex-none px-6 py-4 text-center font-medium ${activeTab === "profile" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </button>
              <button
                className={`flex-1 md:flex-none px-6 py-4 text-center font-medium ${activeTab === "classes" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("classes")}
              >
                Classes
              </button>
              <button
                className={`flex-1 md:flex-none px-6 py-4 text-center font-medium ${activeTab === "reviews" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews {tutor.reviews && `(${tutor.reviews.length})`}
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Overview</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {tutor.introduction_text || "No overview available."}
                    </p>
                    {tutor.introduction_video && (
                      <div className="mt-4 aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <video
                          src={tutor.introduction_video}
                          controls
                          className="w-full h-full"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Languages */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FaGlobe className="mr-2 text-teal-500" /> Languages Spoken
                      </h3>
                      {tutor.languages?.length > 0 ? (
                        <div className="space-y-2">
                          {tutor.languages.map((lang, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-gray-700"
                            >
                              <span className="font-medium">{lang.language || lang}</span>
                              <span className="text-gray-500">{lang.proficiency || ""}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">Not specified</p>
                      )}
                    </div>

                    {/* Education */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FaGraduationCap className="mr-2 text-teal-500" /> Education
                      </h3>
                      {tutor.degrees?.length > 0 ? (
                        <ul className="space-y-2">
                          {tutor.degrees.map((degree, idx) => (
                            <li key={idx} className="text-gray-700 flex items-start">
                              <FaCheckCircle className="text-teal-500 mt-1 mr-2 flex-shrink-0" />
                              <span>{degree}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No education details provided</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-teal-500" /> Address
                    </h3>
                    <p className="text-gray-700">
                      {tutor.Location?.address ||
                        `${tutor.Location?.city || ""}, ${tutor.Location?.state || ""}`}
                    </p>
                  </div>
                </div>
              )}

              {/* Classes Tab */}
              {activeTab === "classes" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Classes</h3>
                  {tutor.classes?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {tutor.classes.map((cls, idx) => (
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
                            <span className="text-teal-600 font-semibold">₹{cls.price || tutor.pricing_per_hour}/hr</span>
                            <button className="text-sm bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600 transition-colors">
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