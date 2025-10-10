// import React, { useEffect, useState } from "react";
// import { 
//   MapPin, 
//   Bookmark, 
//   Phone, 
//   UserCheck, 
//   Search, 
//   Clock,
//   Eye,
//   Send,
//   X,
//   ChevronLeft,
//   ChevronRight
// } from "lucide-react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import { apiClient } from "../../../../../api/apiclient";
// import EnquiryModal from "../../FindStudent/RaiseEnquiry";

// const BookmarkPage = () => {
//   const [bookmarkedStudents, setBookmarkedStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showSubscribeModal, setShowSubscribeModal] = useState(false);
//   const [filteredStudents, setFilteredStudents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showContact, setShowContact] = useState({});
//   const [showEnquiryModal, setShowEnquiryModal] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [studentsPerPage] = useState(10);
//   const navigate = useNavigate();

//   const fetchBookmarks = async () => {
//     try {
//       setLoading(true);
//       const response = await apiClient.get("/bookmarks");
//       console.log("Bookmarks API Response:", response.data);
      
//       const bookmarks = response.data.bookmarks || [];
      
//       const formattedStudentsPromises = bookmarks.map(async (bookmark) => {
//         const user = bookmark.BookmarkedUser;
//         const student = user?.Student;
//         const tutor = user?.Tutor;

//         console.log("=== Processing Bookmark ===");
//         console.log("User:", user);
//         console.log("Student:", student);
//         console.log("Tutor:", tutor);
        
//         let location = null;
        
//         // Try to get location from student or tutor Location object first
//         const studentLocation = student?.Location;
//         const tutorLocation = tutor?.Location;
        
//         if (studentLocation) {
//           location = studentLocation;
//           console.log("Using Student Location:", location);
//         } else if (tutorLocation) {
//           location = tutorLocation;
//           console.log("Using Tutor Location:", location);
//         } else if (student?.location_id || tutor?.location_id) {
//           // If location_id exists but Location object is missing, fetch it
//           const locationId = student?.location_id || tutor?.location_id;
//           console.log("Found location_id:", locationId, "- Fetching location data...");
          
//           try {
//             const locationResponse = await apiClient.get(`/locations/${locationId}`);
//             location = locationResponse.data;
//             console.log("Fetched Location:", location);
//           } catch (error) {
//             console.error("Failed to fetch location:", error);
//           }
//         }
        
//         console.log("Final Location:", location);

//         return {
//           user_id: bookmark.bookmarked_user_id,
//           name: student?.name || tutor?.name || user?.name || "Unknown Student",
//           class: student?.class || tutor?.class || "N/A",
//           subjects: student?.subjects || tutor?.subjects || [],
//           profile_photo: student?.profile_photo || tutor?.profile_photo || user?.profile_photo || "/default-user.png",
//           Location: {
//             city: location?.city || "N/A",
//             state: location?.state || "N/A",
//             country: location?.country || "N/A",
//           },
//           User: user,
//           isBookmarked: true,
//           board: student?.board || tutor?.board || "N/A",
//           school_name: student?.school_name || tutor?.school_name || "N/A",
//           start_timeline: student?.start_timeline || tutor?.start_timeline || "N/A",
//           class_modes: student?.class_modes || tutor?.class_modes || [],
//           hourly_charges: student?.hourly_charges || tutor?.hourly_charges || "N/A",
//           tutor_gender_preference: student?.tutor_gender_preference || tutor?.tutor_gender_preference || "N/A",
//           location_id: student?.location_id || tutor?.location_id || null,
//         };
//       });

//       const formattedStudents = await Promise.all(formattedStudentsPromises);
//       console.log("Formatted Students:", formattedStudents);
//       setBookmarkedStudents(formattedStudents);
//       setFilteredStudents(formattedStudents);
//     } catch (error) {
//       console.error("Failed to fetch bookmarks:", error);
//       if (error.response?.status === 401) {
//         toast.error("Please login to view bookmarks");
//       } else {
//         toast.error("Failed to load bookmarks");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBookmarkToggle = async (studentId) => {
//     try {
//       await apiClient.post("/bookmarks/toggle", {
//         bookmarked_user_id: studentId,
//       });
      
//       setBookmarkedStudents(prev => prev.filter(student => student.user_id !== studentId));
//       setFilteredStudents(prev => prev.filter(student => student.user_id !== studentId));
      
//       toast.info("Student removed from bookmarks");
//       window.dispatchEvent(new Event('storage'));
//     } catch (error) {
//       console.error("Failed to remove bookmark:", error);
//       toast.error("Failed to remove bookmark");
//     }
//   };

//   const handleViewContact = async (student) => {
//     try {
//       const hasSubscription = true;
      
//       if (!hasSubscription) {
//         setShowSubscribeModal(true);
//         return;
//       }

//       setShowContact(prev => ({
//         ...prev,
//         [student.user_id]: !prev[student.user_id]
//       }));
//     } catch (error) {
//       console.error("Failed to load contact details:", error);
//       toast.error("Failed to load contact information");
//     }
//   };

//   const handleSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);
//     setCurrentPage(1);
    
//     if (term === "") {
//       setFilteredStudents(bookmarkedStudents);
//     } else {
//       const filtered = bookmarkedStudents.filter(student =>
//         student.name?.toLowerCase().includes(term) ||
//         student.class?.toLowerCase().includes(term) ||
//         student.subjects?.some(subject => subject.toLowerCase().includes(term)) ||
//         student.Location?.city?.toLowerCase().includes(term) ||
//         student.Location?.state?.toLowerCase().includes(term)
//       );
//       setFilteredStudents(filtered);
//     }
//   };

//   const handleSendEnquiry = (student) => {
//     setSelectedStudent(student);
//     setShowEnquiryModal(true);
//   };

//   const indexOfLastStudent = currentPage * studentsPerPage;
//   const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
//   const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
//   const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

//   const nextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const prevPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const goToPage = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   useEffect(() => {
//     fetchBookmarks();
    
//     const handleStorageChange = () => {
//       fetchBookmarks();
//     };
    
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   if (loading) {
//     return (
//       <div className="w-full px-4 sm:px-6 py-6 bg-gray-50 min-h-screen">
//         <div className="max-w-7xl mx-auto">
//           <div className="animate-pulse">
//             <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
//             <div className="space-y-6">
//               {[1, 2, 3, 4, 5].map((n) => (
//                 <div key={n} className="bg-white rounded-xl p-5 shadow-sm">
//                   <div className="flex flex-col sm:flex-row gap-5">
//                     <div className="w-full sm:w-40 h-40 bg-gray-200 rounded-lg"></div>
//                     <div className="flex-1 space-y-3">
//                       <div className="h-6 bg-gray-200 rounded w-1/3"></div>
//                       <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                         <div className="h-4 bg-gray-200 rounded"></div>
//                         <div className="h-4 bg-gray-200 rounded"></div>
//                       </div>
//                       <div className="flex gap-2 mt-4">
//                         <div className="h-10 bg-gray-200 rounded w-32"></div>
//                         <div className="h-10 bg-gray-200 rounded w-32"></div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full px-4 sm:px-6 py-6 bg-gray-50 min-h-screen">
//       <ToastContainer />

//       <div className="max-w-7xl mx-auto">
//         {bookmarkedStudents.length > 0 && (
//           <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div className="relative max-w-md w-full">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search bookmarked students..."
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
//               />
//             </div>
//             <div className="text-sm text-gray-600">
//               Showing {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
//             </div>
//           </div>
//         )}

//         {bookmarkedStudents.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-lg shadow-sm">
//             <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-600 text-lg font-medium mb-2">
//               No bookmarked students yet.
//             </p>
//             <p className="text-gray-500 mb-6 max-w-md mx-auto">
//               Start exploring students and click the bookmark icon to save them here.
//             </p>
//             <button
//               onClick={() => navigate('/find-students')}
//               className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
//             >
//               Find Students
//             </button>
//           </div>
//         ) : filteredStudents.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-lg shadow-sm">
//             <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-600 text-lg font-medium mb-2">
//               No students found matching your search.
//             </p>
//             <p className="text-gray-500 mb-6">
//               Try adjusting your search terms.
//             </p>
//             <button
//               onClick={() => setSearchTerm("")}
//               className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
//             >
//               Clear Search
//             </button>
//           </div>
//         ) : (
//           <>
//             <div className="space-y-6">
//               {currentStudents.map((student) => (
//                 <div
//                   key={student.user_id}
//                   className="flex flex-col sm:flex-row bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl p-4 sm:p-5 gap-4 sm:gap-5 w-full"
//                 >
//                   <div className="w-full sm:w-32 lg:w-40 flex-shrink-0">
//                     <img
//                       src={student.profile_photo || "/default-user.png"}
//                       alt={student.name}
//                       className="w-full h-32 sm:h-36 lg:h-40 object-cover rounded-lg border"
//                     />
//                   </div>

//                   <div className="flex-1 w-full min-w-0">
//                     <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
//                       <div className="min-w-0">
//                         <h2 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
//                           {student.name}
//                         </h2>
//                         <div className="flex items-center text-sm text-gray-600 mt-1">
//                           <MapPin className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0" />
//                           <span className="truncate">
//                             {student.Location && student.Location.city !== "N/A" ? 
//                               `${student.Location.city}, ${student.Location.state}, ${student.Location.country}` : 
//                               "Location not available"
//                             }
//                           </span>
//                         </div>
//                       </div>

//                       <button
//                         onClick={() => handleBookmarkToggle(student.user_id)}
//                         className="text-teal-500 bg-teal-50 p-1 rounded-full transition-colors flex-shrink-0 hover:bg-teal-100"
//                       >
//                         <Bookmark className="w-5 h-5" fill="currentColor" />
//                       </button>
//                     </div>

//                     {showContact[student.user_id] && student.User && (
//                       <div className="mt-3 p-3 bg-teal-50 rounded-lg border border-teal-200 relative">
//                         <button
//                           onClick={() => handleViewContact(student)}
//                           className="absolute top-2 right-2 text-teal-600 hover:text-teal-800"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>

//                         <h3 className="font-medium text-teal-800 mb-2 flex items-center">
//                           <Phone className="w-4 h-4 mr-2" />
//                           Contact Information
//                         </h3>
//                         <div className="space-y-2 text-sm">
//                           {student.User.email && (
//                             <div className="flex flex-col">
//                               <span className="font-medium text-gray-700">Email:</span>
//                               <a
//                                 href={`mailto:${student.User.email}`}
//                                 className="text-teal-600 hover:text-teal-800 truncate"
//                               >
//                                 {student.User.email}
//                               </a>
//                             </div>
//                           )}
//                           {student.User.mobile_number && (
//                             <div className="flex flex-col">
//                               <span className="font-medium text-gray-700">Phone:</span>
//                               <a
//                                 href={`tel:${student.User.mobile_number}`}
//                                 className="text-teal-600 hover:text-teal-800"
//                               >
//                                 {student.User.mobile_number}
//                               </a>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     )}

//                     <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
//                       <div className="space-y-1 sm:space-y-2">
//                         <p className="text-sm text-gray-700">
//                           <span className="font-medium">Class:</span> {student.class || "N/A"}
//                         </p>
//                         <p className="text-sm text-gray-700">
//                           <span className="font-medium">Subjects:</span>{" "}
//                           {student.subjects && student.subjects.length > 0 
//                             ? (Array.isArray(student.subjects) 
//                                 ? student.subjects.join(", ")
//                                 : student.subjects)
//                             : "N/A"
//                           }
//                         </p>
//                       </div>
//                       <div className="space-y-1 sm:space-y-2">
//                         {student.start_timeline && (
//                           <p className="text-sm text-gray-700 flex items-center">
//                             <Clock className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0" />
//                             <span className="font-medium">Start Plan:</span>{" "}
//                             {student.start_timeline}
//                           </p>
//                         )}
//                         {student.class_modes && student.class_modes.length > 0 && (
//                           <p className="text-sm text-gray-700">
//                             <span className="font-medium">Class Type:</span>{" "}
//                             {student.class_modes.join(", ")}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row flex-wrap gap-2">
//                       <button
//                         onClick={() => handleViewContact(student)}
//                         className="bg-teal-500 hover:bg-teal-600 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto flex items-center justify-center gap-2 transition-colors"
//                       >
//                         <Eye className="w-4 h-4" />
//                         {showContact[student.user_id] ? "Hide Contact" : "View Contact"}
//                       </button>

//                       <button
//                         onClick={() => handleSendEnquiry(student)}
//                         className="bg-blue-900 hover:bg-blue-800 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto flex items-center justify-center gap-2 transition-colors"
//                       >
//                         <Send className="w-4 h-4" />
//                         Send Enquiry
//                       </button>

//                       <button
//                         onClick={() => navigate('/Student_Filter')}
//                         className="border border-gray-300 hover:bg-gray-100 px-3 sm:px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto flex items-center justify-center gap-2 transition-colors"
//                       >
//                         <UserCheck className="w-4 h-4" />
//                         Find More Students
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {totalPages > 1 && (
//               <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
//                 <div className="text-sm text-gray-600">
//                   Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} students
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={prevPage}
//                     disabled={currentPage === 1}
//                     className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
//                   >
//                     <ChevronLeft className="w-4 h-4" />
//                   </button>
                  
//                   <div className="flex gap-1">
//                     {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
//                       let pageNum;
//                       if (totalPages <= 5) {
//                         pageNum = i + 1;
//                       } else if (currentPage <= 3) {
//                         pageNum = i + 1;
//                       } else if (currentPage >= totalPages - 2) {
//                         pageNum = totalPages - 4 + i;
//                       } else {
//                         pageNum = currentPage - 2 + i;
//                       }
//                       return (
//                         <button
//                           key={pageNum}
//                           onClick={() => goToPage(pageNum)}
//                           className={`w-10 h-10 rounded-lg border transition-colors ${
//                             currentPage === pageNum
//                               ? 'bg-teal-500 text-white border-teal-500'
//                               : 'border-gray-300 hover:bg-gray-50'
//                           }`}
//                         >
//                           {pageNum}
//                         </button>
//                       );
//                     })}
//                   </div>
                  
//                   <button
//                     onClick={nextPage}
//                     disabled={currentPage === totalPages}
//                     className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
//                   >
//                     <ChevronRight className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}

//         {selectedStudent && (
//           <EnquiryModal
//             isOpen={showEnquiryModal}
//             onClose={() => {
//               setShowEnquiryModal(false);
//               setSelectedStudent(null);
//             }}
//             receiverId={selectedStudent.user_id}
//             receiverName={selectedStudent.name}
//           />
//         )}

//         {showSubscribeModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
//               <h2 className="text-xl font-bold text-gray-800 mb-4">
//                 Subscription Required
//               </h2>
//               <p className="text-gray-700 mb-6">
//                 Please subscribe to a plan to view student contact information.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                 <button
//                   className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded transition-colors"
//                   onClick={() => {
//                     setShowSubscribeModal(false);
//                     navigate("/subscription-plans");
//                   }}
//                 >
//                   View Plans
//                 </button>
//                 <button
//                   className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition-colors"
//                   onClick={() => setShowSubscribeModal(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BookmarkPage;


import React, { useEffect, useState } from "react";
import { 
  MapPin, 
  Bookmark, 
  Phone, 
  UserCheck, 
  Search, 
  Clock,
  Eye,
  Send,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../../../api/apiclient";
import EnquiryModal from "../../FindStudent/RaiseEnquiry";
import DefaultProfile from "../../../../../assets/img/user3.png";

const BookmarkPage = () => {
  const [bookmarkedStudents, setBookmarkedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showContact, setShowContact] = useState({});
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const navigate = useNavigate();

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/bookmarks");
      console.log("Bookmarks API Response:", response.data);
      
      const bookmarks = response.data.bookmarks || [];
      
      const formattedStudentsPromises = bookmarks.map(async (bookmark) => {
        const user = bookmark.BookmarkedUser;
        const student = user?.Student;
        const tutor = user?.Tutor;

        console.log("=== Processing Bookmark ===");
        console.log("User:", user);
        console.log("Student:", student);
        console.log("Tutor:", tutor);
        
        let location = null;
        
        // Try to get location from student or tutor Location object first
        const studentLocation = student?.Location;
        const tutorLocation = tutor?.Location;
        
        if (studentLocation) {
          location = studentLocation;
          console.log("Using Student Location:", location);
        } else if (tutorLocation) {
          location = tutorLocation;
          console.log("Using Tutor Location:", location);
        } else if (student?.location_id || tutor?.location_id) {
          // If location_id exists but Location object is missing, fetch it
          const locationId = student?.location_id || tutor?.location_id;
          console.log("Found location_id:", locationId, "- Fetching location data...");
          
          try {
            const locationResponse = await apiClient.get(`/locations/${locationId}`);
            location = locationResponse.data;
            console.log("Fetched Location:", location);
          } catch (error) {
            console.error("Failed to fetch location:", error);
          }
        }
        
        console.log("Final Location:", location);

        return {
          user_id: bookmark.bookmarked_user_id,
          name: student?.name || tutor?.name || user?.name || "Unknown Student",
          class: student?.class || tutor?.class || "N/A",
          subjects: student?.subjects || tutor?.subjects || [],
          profile_photo: student?.profile_photo || tutor?.profile_photo || user?.profile_photo || DefaultProfile,
          Location: {
            city: location?.city || "N/A",
            state: location?.state || "N/A",
            country: location?.country || "N/A",
          },
          User: user,
          isBookmarked: true,
          board: student?.board || tutor?.board || "N/A",
          school_name: student?.school_name || tutor?.school_name || "N/A",
          start_timeline: student?.start_timeline || tutor?.start_timeline || "N/A",
          class_modes: student?.class_modes || tutor?.class_modes || [],
          hourly_charges: student?.hourly_charges || tutor?.hourly_charges || "N/A",
          tutor_gender_preference: student?.tutor_gender_preference || tutor?.tutor_gender_preference || "N/A",
          location_id: student?.location_id || tutor?.location_id || null,
        };
      });

      const formattedStudents = await Promise.all(formattedStudentsPromises);
      console.log("Formatted Students:", formattedStudents);
      setBookmarkedStudents(formattedStudents);
      setFilteredStudents(formattedStudents);
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to view bookmarks");
      } else {
        toast.error("Failed to load bookmarks");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkToggle = async (studentId) => {
    try {
      await apiClient.post("/bookmarks/toggle", {
        bookmarked_user_id: studentId,
      });
      
      setBookmarkedStudents(prev => prev.filter(student => student.user_id !== studentId));
      setFilteredStudents(prev => prev.filter(student => student.user_id !== studentId));
      
      toast.info("Student removed from bookmarks");
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
      toast.error("Failed to remove bookmark");
    }
  };

  const handleViewContact = async (student) => {
    try {
      const hasSubscription = true;
      
      if (!hasSubscription) {
        setShowSubscribeModal(true);
        return;
      }

      setShowContact(prev => ({
        ...prev,
        [student.user_id]: !prev[student.user_id]
      }));
    } catch (error) {
      console.error("Failed to load contact details:", error);
      toast.error("Failed to load contact information");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setCurrentPage(1);
    
    if (term === "") {
      setFilteredStudents(bookmarkedStudents);
    } else {
      const filtered = bookmarkedStudents.filter(student =>
        student.name?.toLowerCase().includes(term) ||
        student.class?.toLowerCase().includes(term) ||
        student.subjects?.some(subject => subject.toLowerCase().includes(term)) ||
        student.Location?.city?.toLowerCase().includes(term) ||
        student.Location?.state?.toLowerCase().includes(term)
      );
      setFilteredStudents(filtered);
    }
  };

  const handleSendEnquiry = (student) => {
    setSelectedStudent(student);
    setShowEnquiryModal(true);
  };

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle image loading errors
  const handleImageError = (e) => {
    e.target.src = DefaultProfile;
  };

  useEffect(() => {
    fetchBookmarks();
    
    const handleStorageChange = () => {
      fetchBookmarks();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 py-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-full sm:w-40 h-40 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <div className="h-10 bg-gray-200 rounded w-32"></div>
                        <div className="h-10 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 py-6 bg-gray-50 min-h-screen">
      <ToastContainer />

      <div className="max-w-7xl mx-auto">
        {bookmarkedStudents.length > 0 && (
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bookmarked students..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}

        {bookmarkedStudents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium mb-2">
              No bookmarked students yet.
            </p>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Start exploring students and click the bookmark icon to save them here.
            </p>
            <button
              onClick={() => navigate('/Student_Filter')}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Find Students
            </button>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium mb-2">
              No students found matching your search.
            </p>
            <p className="text-gray-500 mb-6">
              Try adjusting your search terms.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {currentStudents.map((student) => (
                <div
                  key={student.user_id}
                  className="flex flex-col sm:flex-row bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl p-4 sm:p-5 gap-4 sm:gap-5 w-full"
                >
                  <div className="w-full sm:w-32 lg:w-40 flex-shrink-0">
                    <img
                      src={student.profile_photo}
                      alt={student.name}
                      className="w-full h-32 sm:h-36 lg:h-40 object-cover rounded-lg border"
                      onError={handleImageError}
                    />
                  </div>

                  <div className="flex-1 w-full min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                          {student.name}
                        </h2>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0" />
                          <span className="truncate">
                            {student.Location && student.Location.city !== "N/A" ? 
                              `${student.Location.city}, ${student.Location.state}, ${student.Location.country}` : 
                              "Location not available"
                            }
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBookmarkToggle(student.user_id)}
                        className="text-teal-500 bg-teal-50 p-1 rounded-full transition-colors flex-shrink-0 hover:bg-teal-100"
                      >
                        <Bookmark className="w-5 h-5" fill="currentColor" />
                      </button>
                    </div>

                    {showContact[student.user_id] && student.User && (
                      <div className="mt-3 p-3 bg-teal-50 rounded-lg border border-teal-200 relative">
                        <button
                          onClick={() => handleViewContact(student)}
                          className="absolute top-2 right-2 text-teal-600 hover:text-teal-800"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <h3 className="font-medium text-teal-800 mb-2 flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          Contact Information
                        </h3>
                        <div className="space-y-2 text-sm">
                          {student.User.email && (
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-700">Email:</span>
                              <a
                                href={`mailto:${student.User.email}`}
                                className="text-teal-600 hover:text-teal-800 truncate"
                              >
                                {student.User.email}
                              </a>
                            </div>
                          )}
                          {student.User.mobile_number && (
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-700">Phone:</span>
                              <a
                                href={`tel:${student.User.mobile_number}`}
                                className="text-teal-600 hover:text-teal-800"
                              >
                                {student.User.mobile_number}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-1 sm:space-y-2">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Class:</span> {student.class || "N/A"}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Subjects:</span>{" "}
                          {student.subjects && student.subjects.length > 0 
                            ? (Array.isArray(student.subjects) 
                                ? student.subjects.join(", ")
                                : student.subjects)
                            : "N/A"
                          }
                        </p>
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        {student.start_timeline && (
                          <p className="text-sm text-gray-700 flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0" />
                            <span className="font-medium">Start Plan:</span>{" "}
                            {student.start_timeline}
                          </p>
                        )}
                        {student.class_modes && student.class_modes.length > 0 && (
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Class Type:</span>{" "}
                            {student.class_modes.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row flex-wrap gap-2">
                      <button
                        onClick={() => handleViewContact(student)}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto flex items-center justify-center gap-2 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        {showContact[student.user_id] ? "Hide Contact" : "View Contact"}
                      </button>

                      <button
                        onClick={() => handleSendEnquiry(student)}
                        className="bg-blue-900 hover:bg-blue-800 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto flex items-center justify-center gap-2 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        Send Enquiry
                      </button>

                      <button
                        onClick={() => navigate('/Student_Filter')}
                        className="border border-gray-300 hover:bg-gray-100 px-3 sm:px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto flex items-center justify-center gap-2 transition-colors"
                      >
                        <UserCheck className="w-4 h-4" />
                        Find More Students
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} students
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`w-10 h-10 rounded-lg border transition-colors ${
                            currentPage === pageNum
                              ? 'bg-teal-500 text-white border-teal-500'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {selectedStudent && (
          <EnquiryModal
            isOpen={showEnquiryModal}
            onClose={() => {
              setShowEnquiryModal(false);
              setSelectedStudent(null);
            }}
            receiverId={selectedStudent.user_id}
            receiverName={selectedStudent.name}
          />
        )}

        {showSubscribeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
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
    </div>
  );
};

export default BookmarkPage;