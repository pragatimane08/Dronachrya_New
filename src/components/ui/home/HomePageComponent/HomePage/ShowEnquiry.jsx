// import React, { useState, useEffect } from 'react';
// import { MapPin, DollarSign, BookOpen, User, Monitor, Building, Calendar, ArrowLeft } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const ShowEnquiry = () => {
//   const [enquiries, setEnquiries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchEnquiries();
//   }, []);

//   const fetchEnquiries = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://15.206.81.98:3000/api/public/students');
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       setEnquiries(data);
//     } catch (err) {
//       console.error('Fetch error:', err);
//       setError(`Failed to load enquiries: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatLocation = (location) => {
//     return `${location.city}, ${location.state}`;
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading all enquiries...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
//             <p className="font-bold">Error</p>
//             <p>{error}</p>
//             <button
//               onClick={fetchEnquiries}
//               className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
//             >
//               <ArrowLeft className="w-5 h-5 mr-2" />
//               Go Back
//             </button>
//             <h1 className="text-3xl font-bold text-gray-900 flex-1 text-center">
//               All Student Enquiries
//             </h1>
//             <div className="w-20"></div>
//           </div>
          
//           <p className="text-gray-600 mb-4">
//             Complete list of all student enquiries looking for tutors
//           </p>
          
//           {/* Student Count */}
//           <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
//             <User className="w-4 h-4 mr-2" />
//             Total: {enquiries.length} students
//           </div>
//         </div>

//         {/* All Enquiries Grid */}
//         {enquiries.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
//             <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">No enquiries found</h3>
//             <p className="text-gray-600">There are no student enquiries at the moment</p>
//             <button
//               onClick={fetchEnquiries}
//               className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
//             >
//               Refresh
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {enquiries.map((enquiry) => (
//               <div
//                 key={enquiry.id}
//                 className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden group"
//               >
//                 {/* Header */}
//                 <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
//                   <div className="flex items-start justify-between mb-3">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
//                         <User className="w-6 h-6 text-white" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-gray-900 text-lg">
//                           {enquiry.name}
//                         </h3>
//                         <div className="flex items-center space-x-2 mt-1">
//                           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
//                             {enquiry.user.status}
//                           </span>
//                           <span className="text-xs text-gray-500">
//                             {formatDate(enquiry.created_at)}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Subjects */}
//                   <div className="flex flex-wrap gap-1">
//                     {enquiry.subjects.map((subject, index) => (
//                       <span
//                         key={index}
//                         className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200"
//                       >
//                         <BookOpen className="w-3 h-3 mr-1" />
//                         {subject}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Details */}
//                 <div className="p-6 space-y-4">
//                   {/* Class and Board */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="flex items-center text-sm text-gray-600">
//                       <Building className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" />
//                       <span className="font-medium truncate" title={enquiry.class}>
//                         {enquiry.class}
//                       </span>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-600">
//                       <BookOpen className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
//                       <span className="truncate" title={enquiry.board}>
//                         {enquiry.board}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Class Mode and Price */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="flex items-center text-sm text-gray-600">
//                       <Monitor className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
//                       <span className="truncate" title={enquiry.class_modes.join(', ')}>
//                         {enquiry.class_modes.length > 0 ? enquiry.class_modes.join(', ') : 'Not specified'}
//                       </span>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-600">
//                       <DollarSign className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
//                       <span className="font-semibold text-green-700">
//                         ₹{parseFloat(enquiry.hourly_charges).toFixed(0)}/hour
//                       </span>
//                     </div>
//                   </div>

//                   {/* Location */}
//                   <div className="flex items-center text-sm text-gray-600">
//                     <MapPin className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
//                     <span className="truncate" title={formatLocation(enquiry.location)}>
//                       {formatLocation(enquiry.location)}
//                     </span>
//                   </div>

//                   {/* Timeline */}
//                   <div className="flex items-center text-sm text-gray-600">
//                     <Calendar className="w-4 h-4 mr-2 text-indigo-500 flex-shrink-0" />
//                     <span>Starts: {enquiry.start_timeline}</span>
//                   </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
//                   <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 transform hover:-translate-y-0.5">
//                     Contact Student
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Refresh Button at Bottom */}
//         {enquiries.length > 0 && (
//           <div className="text-center mt-8">
//             <button
//               onClick={fetchEnquiries}
//               className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm font-medium transition-colors"
//             >
//               Refresh List
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShowEnquiry;

// src/pages/admin/ShowEnquiry.jsx
import React, { useState, useEffect } from "react";
import {
  MapPin,
  DollarSign,
  BookOpen,
  User,
  Monitor,
  Building,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../../../api/apiclient";
import { apiUrl } from "../../../../../api/apiUtl";
import Layout from "../../layout/MainLayout";

const ShowEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`${apiUrl.baseUrl}/public/students`);
      setEnquiries(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(`Failed to load enquiries: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatLocation = (location) => {
    if (!location) return "Not specified";
    return `${location.city || ""}${
      location.city && location.state ? ", " : ""
    }${location.state || ""}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ✅ Loading State
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">
              Loading all enquiries...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-xl shadow-md border border-red-200 max-w-md">
            <p className="text-lg font-bold text-red-600 mb-2">Error</p>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchEnquiries}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // ✅ Main UI
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 mt-5 mb-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10 text-center relative">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              All Student Enquiries
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              A complete list of students currently looking for tutors
            </p>

            <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
              <User className="w-4 h-4 mr-2" />
              Total: {enquiries.length} students
            </div>
          </div>

          {/* Enquiries */}
          {enquiries.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No enquiries found
              </h3>
              <p className="text-gray-600 mb-4 text-sm md:text-base">
                There are currently no student enquiries.
              </p>
              <button
                onClick={fetchEnquiries}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
              >
                Refresh
              </button>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 
              md:gap-8"
            >
              {enquiries.map((enquiry) => (
                <div
                  key={enquiry.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg truncate">
                          {enquiry.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1 flex-wrap">
                          {/* <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            {enquiry?.user?.status || "Active"}
                          </span> */}
                          <span className="text-xs text-gray-500">
                            {formatDate(enquiry.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Subjects */}
                    {enquiry.subjects?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {enquiry.subjects.map((subject, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700 border border-green-200"
                          >
                            <BookOpen className="w-3 h-3 mr-1" />
                            {subject}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-4 text-sm text-gray-700">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-2 text-purple-500" />
                        {enquiry.class || "N/A"}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-2 text-orange-500" />
                        {enquiry.board || "N/A"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center">
                        <Monitor className="w-4 h-4 mr-2 text-blue-500" />
                        {enquiry.class_modes?.length > 0
                          ? enquiry.class_modes.join(", ")
                          : "Not specified"}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                        <span className="font-semibold text-green-700">
                          ₹
                          {parseFloat(enquiry.hourly_charges || 0).toFixed(0)}
                          /hour
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" />
                      {formatLocation(enquiry.location)}
                    </div>

                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                      Starts: {enquiry.start_timeline || "N/A"}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all transform hover:-translate-y-0.5 shadow-sm">
                      Contact Student
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Refresh Button */}
          {enquiries.length > 0 && (
            <div className="text-center mt-10">
              <button
                onClick={fetchEnquiries}
                className="inline-flex items-center px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Refresh List
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ShowEnquiry;
