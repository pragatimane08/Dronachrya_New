// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { enquiryRepository } from "../../../api/repository/enquiry.repository";

// const RecentEnquiry = () => {
//   const [enquiries, setEnquiries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchEnquiries = async () => {
//       try {
//         const response = await enquiryRepository.getAll(); // or /recent if wired
//         const apiEnquiries = Array.isArray(response.data.enquiries)
//           ? response.data.enquiries
//           : [];

//         // ✅ Flatten enquiries into separate cards for sender + receiver
//         const flattened = apiEnquiries.flatMap((enq) => [
//           { ...enq, person: enq.sender, role: enq.sender?.role },
//           { ...enq, person: enq.receiver, role: enq.receiver?.role },
//         ]);

//         setEnquiries(flattened);
//       } catch (error) {
//         console.error("Failed to fetch enquiries:", error);
//         setEnquiries([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEnquiries();
//   }, []);

//   return (
//     <section className="py-5 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-center px-4 mt-[10px] mb-5 relative overflow-hidden">
//       {/* Background decoration */}
//       <div className="absolute inset-0 opacity-5">
//         <div className="absolute top-10 left-10 w-24 h-24 bg-blue-400 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-16 right-10 w-32 h-32 bg-purple-400 rounded-full blur-3xl"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-300 rounded-full blur-3xl"></div>
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto">
//         {/* Section Title */}
//         <div className="mb-6">
//           <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent">
//             Recent Enquiries
//           </h2>
//           <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
//             Connect with our latest tutors and students who have joined our learning community
//           </p>
//           <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
//         </div>

//         {/* Loading Spinner */}
//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//           </div>
//         ) : enquiries.length === 0 ? (
//           <p className="text-gray-500 py-10">No enquiries found.</p>
//         ) : (
//           /* Enquiries Grid */
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {enquiries.map((enq, index) => {
//               const person = enq.person;
//               const name = person?.name || "Unknown";
//               const role = person?.role || "User";
//               const location = person?.location?.city || "Location not provided";

//               // ✅ Correct profile photo fallback
//               const profilePhoto =
//                 person?.profile_photo && person.profile_photo.trim() !== ""
//                   ? person.profile_photo
//                   : "https://thumbs.dreamstime.com/b/default-avatar-profile-flat-icon-vector-contact-symbol-illustration-184752213.jpg";

//               return (
//                 <div
//                   key={`${enq.id}-${role}-${index}`}
//                   className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-white/50 relative overflow-hidden"
//                   style={{
//                     animationDelay: `${index * 150}ms`,
//                     animation: "fadeInUp 0.8s ease-out forwards",
//                   }}
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

//                   {/* Role badge */}
//                   <div
//                     className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
//                       role === "tutor"
//                         ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
//                         : "bg-blue-100 text-blue-700 border border-blue-200"
//                     }`}
//                   >
//                     {role}
//                   </div>

//                   <div className="relative z-10">
//                     {/* Profile Image */}
//                     <div className="relative mb-4">
//                       <div className="w-24 h-24 mx-auto relative">
//                         <img
//                           src={profilePhoto}
//                           alt={name}
//                           className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl group-hover:border-blue-200 transition-all duration-300"
//                         />
//                         <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
//                       </div>
//                       <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-2 border-blue-200/50 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500"></div>
//                     </div>

//                     {/* Info */}
//                     <div className="space-y-1">
//                       <h3 className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
//                         {name}
//                       </h3>

//                       <p className="text-sm md:text-base text-gray-500 font-medium">
//                         Subject: {enq.subject}
//                       </p>
//                       <p className="text-sm text-gray-400">{location}</p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* CTA Button */}
//         <div className="mt-8">
//           <button
//             onClick={() => navigate("/enquiries")}
//             className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
//           >
//             View All Enquiries
//           </button>
//         </div>
//       </div>

//       {/* Animation style */}
//       <style>
//         {`
//           @keyframes fadeInUp {
//             from {
//               opacity: 0;
//               transform: translateY(30px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
//         `}
//       </style>
//     </section>
//   );
// };

// export default RecentEnquiry;

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { enquiryRepository } from "../../../api/repository/enquiry.repository";

const RecentEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await enquiryRepository.getAll();
        const apiEnquiries = Array.isArray(response.data.enquiries)
          ? response.data.enquiries
          : [];

        const flattened = apiEnquiries.flatMap((enq) => [
          { ...enq, person: enq.sender, role: enq.sender?.role },
          { ...enq, person: enq.receiver, role: enq.receiver?.role },
        ]);

        const sorted = flattened.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setEnquiries(sorted);
      } catch (error) {
        console.error("Failed to fetch enquiries:", error);
        setEnquiries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (!scrollRef.current || enquiries.length <= 4) return;

    const container = scrollRef.current;
    let scrollAmount = 0;
    const cardWidth = container.firstChild.offsetWidth + 24; // card width + gap

    const interval = setInterval(() => {
      scrollAmount += cardWidth * 4; // scroll 4 cards at a time
      if (scrollAmount >= container.scrollWidth) {
        scrollAmount = 0; // loop back to start
      }
      container.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }, 4000); // every 4 seconds

    return () => clearInterval(interval);
  }, [enquiries]);

  return (
    <section className="py-5 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-center px-4 mt-[10px] mb-5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-24 h-24 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-16 right-10 w-32 h-32 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent">
            Recent Enquiries
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with our latest tutors and students who have joined our learning community
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : enquiries.length === 0 ? (
          <p className="text-gray-500 py-10">No enquiries found.</p>
        ) : (
          /* Horizontal Scrollable Enquiries with auto-scroll */
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-hidden py-5 px-2 scroll-smooth"
          >
            {enquiries.map((enq, index) => {
              const person = enq.person;
              const name = person?.name || "Unknown";
              const role = person?.role || "User";
              const location = person?.location?.city || "Location not provided";

              const profilePhoto =
                person?.profile_photo && person.profile_photo.trim() !== ""
                  ? person.profile_photo
                  : "https://thumbs.dreamstime.com/b/default-avatar-profile-flat-icon-vector-contact-symbol-illustration-184752213.jpg";

              return (
                <div
                  key={`${enq.id}-${role}-${index}`}
                  className="flex-shrink-0 w-72 group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-white/50 relative overflow-hidden"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: "fadeInUp 0.8s ease-out forwards",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
                      role === "tutor"
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-blue-100 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {role}
                  </div>

                  <div className="relative z-10">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 mx-auto relative">
                        <img
                          src={profilePhoto}
                          alt={name}
                          className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl group-hover:border-blue-200 transition-all duration-300"
                        />
                        <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
                      </div>
                      <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-2 border-blue-200/50 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500"></div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                        {name}
                      </h3>
                      <p className="text-sm md:text-base text-gray-500 font-medium">
                        Subject: {enq.subject}
                      </p>
                      <p className="text-sm text-gray-400">{location}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate("/enquiries")}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
           Enquiries
          </button>
        </div>
      </div>

      {/* Animation style */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </section>
  );
};

export default RecentEnquiry;
