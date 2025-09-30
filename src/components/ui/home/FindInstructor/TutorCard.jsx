// // src/components/TutorCard.jsx

// import React from "react";
// import { useNavigate } from "react-router-dom";

// export default function TutorCard({ tutor }) {
//   const navigate = useNavigate();

//   const photo = tutor?.profile_photo || "https://via.placeholder.com/120";
//   const location =
//     tutor?.Location?.city ||
//     tutor?.Location?.state ||
//     tutor?.Location?.country ||
//     "—";
//   const price = tutor?.pricing_per_hour
//     ? `₹${Number(tutor.pricing_per_hour)}/hr`
//     : "—";

//   const rating = tutor?.average_rating || "—";
//   const reviewsCount = tutor?.total_reviews || 0;

//   const experience = tutor?.experience || "—";
//   const students = tutor?.students || "—";
//   const address = tutor?.address || location;

//   const teachingTypes = tutor?.teaching_modes || [];
//   const subjects = tutor?.subjects || [];

//   const description =
//     tutor?.introduction_text ||
//     "I have years of experience in teaching. I create personalized lessons for students with interactive learning methods and regular progress tracking.";

//   const tutorId = tutor?.user_id || tutor?.User?.id;

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
//             <h3 className="text-base font-semibold text-gray-800">
//               {tutor?.name}
//             </h3>
//             <div className="flex flex-col items-end">
//               <span className="text-teal-700 font-semibold text-sm">
//                 {price}
//               </span>
//               <p className="text-gray-600 text-xs mt-1">
//                 ⭐ <span className="text-amber-500 font-semibold">{rating}</span>{" "}
//                 ({reviewsCount} reviews)
//               </p>
//             </div>
//           </div>

//           {/* Location */}
//           <div className="flex items-center text-gray-600 mb-2 text-xs">
//             📍 {address}
//           </div>

//           {/* Stats */}
//           {/* Stats */}
//           <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-700">
//             <span>🎓 {experience || 0} yrs Experience</span>
//             <span>👥 {students ?? 0} Students</span>
//           </div>


//           {/* Teaching Types */}
//           {teachingTypes.length > 0 && (
//             <div className="mb-3">
//               <h4 className="text-xs font-medium text-gray-700 mb-1">
//                 Teaching Types:
//               </h4>
//               <div className="flex flex-wrap gap-2">
//                 {teachingTypes.map((type, index) => (
//                   <span
//                     key={index}
//                     className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs"
//                   >
//                     {type}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Subjects */}
//           {subjects.length > 0 && (
//             <div className="mb-3">
//               <h4 className="text-xs font-medium text-gray-700 mb-1">
//                 Subjects:
//               </h4>
//               <div className="flex flex-wrap gap-2">
//                 {subjects.map((subject, index) => (
//                   <span
//                     key={index}
//                     className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded-md text-xs"
//                   >
//                     {subject}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Description */}
//           <p className="text-gray-600 text-xs mb-4">{description}</p>

//           {/* Book Demo Button */}
//           <div className="flex gap-3">
//             <button
//               onClick={() => navigate("/book-demo", { state: { tutorId: tutorId } })}
//               className="flex-1 bg-teal-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-teal-700 transition-colors"
//             >
//               Book a Free Demo
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
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

  // ✅ default 0 instead of "—"
  const experience = tutor?.experience ?? 0;
  const students = tutor?.students ?? 0;

  const address = tutor?.address || location;

  const teachingTypes = tutor?.teaching_modes || [];
  const subjects = tutor?.subjects || [];

  const description =
    tutor?.introduction_text ||
    "I have years of experience in teaching. I create personalized lessons for students with interactive learning methods and regular progress tracking.";

  const tutorId = tutor?.user_id || tutor?.User?.id;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 w-full max-w-4xl">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Tutor Image & Profile Button */}
        <div className="flex flex-col items-center w-full sm:w-32">
          <img
            src={photo}
            alt={tutor?.name}
            className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full mb-3 shadow"
          />

          <button
            onClick={() => tutorId && navigate(`/TutorProfile/${tutorId}`)}
            className="bg-teal-600 text-white py-2 px-4 rounded-lg text-xs sm:text-sm font-medium hover:bg-teal-700 transition-colors w-full"
          >
            View Profile
          </button>
        </div>

        {/* Tutor Details */}
        <div className="flex-1">
          {/* Name, Price & Rating */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              {tutor?.name}
            </h3>
            <div className="flex flex-col items-start sm:items-end">
              <span className="text-teal-700 font-semibold text-sm sm:text-base">
                {price}
              </span>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                ⭐{" "}
                <span className="text-amber-500 font-semibold">{rating}</span>{" "}
                ({reviewsCount} reviews)
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-2 text-xs sm:text-sm">
            📍 {address}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 mb-3 text-xs sm:text-sm text-gray-700">
            <span>🎓 {experience} yrs Experience</span>
            <span>👥 {students} Students</span>
          </div>

          {/* Teaching Types */}
          {teachingTypes.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Teaching Types:
              </h4>
              <div className="flex flex-wrap gap-2">
                {teachingTypes.map((type, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs sm:text-sm"
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
              <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Subjects:
              </h4>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded-md text-xs sm:text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-600 text-xs sm:text-sm mb-4">{description}</p>

          {/* Book Demo Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() =>
                navigate("/book-demo", { state: { tutorId: tutorId } })
              }
              className="flex-1 bg-teal-600 text-white py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              Book a Free Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
