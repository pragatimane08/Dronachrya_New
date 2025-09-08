// // src/components/TutorCard.jsx
// import React from "react";
// import { useNavigate } from "react-router-dom";

// export default function TutorCard({ tutor }) {
//   const navigate = useNavigate();

//   const photo = tutor?.profile_photo || "https://via.placeholder.com/120";
//   const location = tutor?.Location?.city || tutor?.Location?.state || tutor?.Location?.country || "—";
//   const price = tutor?.pricing_per_hour ? `₹${Number(tutor.pricing_per_hour)}/hr` : "—";
  
//   // Fix reviews handling
//   const rating = tutor?.average_rating || 4.9;
//   const reviewsCount = tutor?.total_reviews || 0;
  
//   const experience = tutor?.experience || 4;
//   const students = tutor?.students || 24;
//   const address = tutor?.address || "Ashiyana, Lucknow";
//   const teachingTypes = tutor?.teaching_modes || ["Online", "Offline"];
//   const subjects = tutor?.subjects || ["Mathematics", "Science", "Hindi", "Social Studies"];
//   const description = tutor?.introduction_text || "I have 4 years of experience in online edtech. I create personalized lessons for Class 1–5 students with interactive learning methods and regular progress tracking.";
//   const tutorId = tutor.user_id || tutor.User?.id;

//   return (
//     <div className="bg-white rounded-2xl shadow-md p-6 max-w-4xl w-full">
//       <div className="flex gap-6">
//         {/* Tutor Image & Profile Button */}
//         <div className="flex flex-col items-center w-32">
//           <img
//             src={photo}
//             alt={tutor?.name}
//             className="w-28 h-28 object-cover rounded-full mb-3 shadow"
//           />

//           <button
//             onClick={() => tutorId && navigate(`/TutorProfile/${tutorId}`)}
//             className="bg-teal-600 text-white py-2 px-4 rounded-lg text-xs font-medium hover:bg-teal-700 transition-colors w-full"
//           >
//             View Profile
//           </button>
//         </div>

//         {/* Tutor Details */}
//         <div className="flex-1">
//           {/* Name, Price & Rating */}
//           <div className="flex justify-between items-start mb-2">
//             <div>
//               <h3 className="text-base font-semibold text-gray-800">
//                 {tutor?.name || "Aditya Pratap Singh"}
//               </h3>
//             </div>
//             <div className="flex flex-col items-end">
//               <span className="text-teal-700 font-semibold text-sm">
//                 {price}
//               </span>
//               <p className="text-gray-600 text-xs mt-1">
//                 <span className="text-amber-500 font-semibold">{rating}</span>{" "}
//                 ({reviewsCount} reviews) {/* Fixed: Use reviewsCount instead of reviews */}
//               </p>
//             </div>
//           </div>

//           {/* Location */}
//           <div className="flex items-center text-gray-600 mb-2">
//             <svg
//               className="w-3.5 h-3.5 mr-1"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             <span className="text-xs">{location}</span>
//           </div>

//           {/* Stats */}
//           <div className="flex flex-wrap gap-3 mb-3">
//             <div className="flex items-center text-xs text-gray-700">
//               <svg
//                 className="w-3.5 h-3.5 mr-1 text-teal-600"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               {experience} yrs Experience
//             </div>
//             <div className="flex items-center text-xs text-gray-700">
//               <svg
//                 className="w-3.5 h-3.5 mr-1 text-teal-600"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//                 <path
//                   fillRule="evenodd"
//                   d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               {students} Students
//             </div>
//             <div className="flex items-center text-xs text-gray-700">
//               <svg
//                 className="w-3.5 h-3.5 mr-1 text-teal-600"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               {address}
//             </div>
//           </div>

//           {/* Teaching Types */}
//           <div className="mb-3">
//             <h4 className="text-xs font-medium text-gray-700 mb-1">
//               Teaching Types:
//             </h4>
//             <div className="flex flex-wrap gap-2">
//               {teachingTypes.map((type, index) => (
//                 <span
//                   key={index}
//                   className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs"
//                 >
//                   {type}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Subjects */}
//           <div className="mb-3">
//             <h4 className="text-xs font-medium text-gray-700 mb-1">Subjects:</h4>
//             <div className="flex flex-wrap gap-2">
//               {subjects.map((subject, index) => (
//                 <span
//                   key={index}
//                   className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded-md text-xs"
//                 >
//                   {subject}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Description */}
//           <p className="text-gray-600 text-xs mb-4">{description}</p>

//           {/* Book Demo Button */}
//           <div className="flex gap-3">
//             <button className="flex-1 bg-teal-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-teal-700 transition-colors">
//               Book Free Demo
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// TutorCard.jsx
// src/components/TutorCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function TutorCard({ tutor }) {
  const navigate = useNavigate();

  const photo = tutor?.profile_photo || "https://via.placeholder.com/120";
  const location =
    tutor?.Location?.city ||
    tutor?.Location?.state ||
    tutor?.Location?.country ||
    "—";
  const price = tutor?.pricing_per_hour
    ? `₹${Number(tutor.pricing_per_hour)}/hr`
    : "—";

  const rating = tutor?.average_rating || "—";
  const reviewsCount = tutor?.total_reviews || 0;

  const experience = tutor?.experience || "—";
  const students = tutor?.students || "—";
  const address = tutor?.address || location;

  const teachingTypes = tutor?.teaching_modes || [];
  const subjects = tutor?.subjects || [];

  const description =
    tutor?.introduction_text ||
    "I have years of experience in teaching. I create personalized lessons for students with interactive learning methods and regular progress tracking.";

  const tutorId = tutor?.user_id || tutor?.User?.id;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-4xl w-full">
      <div className="flex gap-6">
        {/* Tutor Image & Profile Button */}
        <div className="flex flex-col items-center w-32">
          <img
            src={photo}
            alt={tutor?.name}
            className="w-28 h-28 object-cover rounded-full mb-3 shadow"
          />

          <button
           onClick={() => tutorId && navigate(`/TutorProfile/${tutorId}`)}
            className="bg-teal-600 text-white py-2 px-4 rounded-lg text-xs font-medium hover:bg-teal-700 transition-colors w-full"
          >
            View Profile
          </button>
        </div>

        {/* Tutor Details */}
        <div className="flex-1">
          {/* Name, Price & Rating */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-base font-semibold text-gray-800">
              {tutor?.name}
            </h3>
            <div className="flex flex-col items-end">
              <span className="text-teal-700 font-semibold text-sm">
                {price}
              </span>
              <p className="text-gray-600 text-xs mt-1">
                ⭐ <span className="text-amber-500 font-semibold">{rating}</span>{" "}
                ({reviewsCount} reviews)
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-2 text-xs">
            📍 {address}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-700">
            <span>🎓 {experience} yrs Experience</span>
            <span>👥 {students} Students</span>
          </div>

          {/* Teaching Types */}
          {teachingTypes.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-medium text-gray-700 mb-1">
                Teaching Types:
              </h4>
              <div className="flex flex-wrap gap-2">
                {teachingTypes.map((type, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Subjects */}
          {subjects.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-medium text-gray-700 mb-1">
                Subjects:
              </h4>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded-md text-xs"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-600 text-xs mb-4">{description}</p>

          {/* Book Demo Button */}
          <div className="flex gap-3">
            <button className="flex-1 bg-teal-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-teal-700 transition-colors">
              Book Free Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
