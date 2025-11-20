// // src/components/ui/Tutor/TutorCard.jsx

// import React, { useState } from "react";
// import { MapPin, Bookmark as BookmarkIcon, Star, Clock, Eye, Phone, UserCheck, X, Send } from "lucide-react";
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { apiClient } from "../../../../api/apiclient";

// // ---------- Enquiry Modal Component ----------
// const EnquiryModal = ({ isOpen, onClose, receiverId, receiverName }) => {
//   const [formData, setFormData] = useState({
//     subject: '',
//     class: '',
//     description: '',
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
//     if (!formData.class.trim()) newErrors.class = 'Class is required';
//     if (!formData.description.trim()) newErrors.description = 'Description is required';
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
   
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       toast.error("Please fill all required fields");
//       return;
//     }

//     if (!receiverId) {
//       toast.error("Student ID is missing. Cannot submit enquiry.");
//       return;
//     }

//     const payload = {
//       receiver_id: receiverId,
//       ...formData,
//     };

//     setIsSubmitting(true);
//     try {
//       await apiClient.post("/enquiries", payload);
//       toast.success("Enquiry submitted successfully to " + receiverName);
     
//       // Reset form
//       setFormData({ subject: '', class: '', description: '' });
//       setErrors({});
     
//       // Close modal after short delay
//       setTimeout(() => {
//         onClose();
//       }, 1500);
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message || "Something went wrong while submitting the enquiry"
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-teal-500 relative animate-fadeIn">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//         >
//           <X className="h-6 w-6" />
//         </button>

//         <div className="p-6">
//           <h2 className="text-2xl font-semibold text-center text-[#0E2D63] mb-6">
//             Raise an Enquiry
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Subject */}
//             <div>
//               <label className="block text-[#0E2D63] mb-1 text-sm font-medium">
//                 Subject <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="subject"
//                 value={formData.subject}
//                 onChange={handleChange}
//                 placeholder="e.g., Mathematics"
//                 className={`w-full px-4 py-2 border ${errors.subject ? 'border-red-500' : 'border-teal-500'} rounded-md focus:outline-none focus:ring-2 ${errors.subject ? 'focus:ring-red-500' : 'focus:ring-teal-500'}`}
//               />
//               {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
//             </div>

//             {/* Class */}
//             <div>
//               <label className="block text-[#0E2D63] mb-1 text-sm font-medium">
//                 Class <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="class"
//                 value={formData.class}
//                 onChange={handleChange}
//                 placeholder="e.g., 10"
//                 className={`w-full px-4 py-2 border ${errors.class ? 'border-red-500' : 'border-teal-500'} rounded-md focus:outline-none focus:ring-2 ${errors.class ? 'focus:ring-red-500' : 'focus:ring-teal-500'}`}
//               />
//               {errors.class && <p className="text-red-500 text-xs mt-1">{errors.class}</p>}
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-[#0E2D63] mb-1 text-sm font-medium">
//                 Description <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="e.g., I would like to discuss teaching opportunities for this student."
//                 rows={4}
//                 className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-teal-500'} rounded-md focus:outline-none focus:ring-2 ${errors.description ? 'focus:ring-red-500' : 'focus:ring-teal-500'}`}
//               />
//               {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-between mt-6 gap-3">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//               >
//                 <Send className="w-4 h-4" />
//                 {isSubmitting ? 'Sending...' : 'Submit'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ---------- Main TutorCard Component ----------
// const TutorCard = ({ student, onConnectionRequest, onBookmark, onViewProfile }) => {
//   const [showContact, setShowContact] = useState(false);
//   const [isConnecting, setIsConnecting] = useState(false);
//   const [isBookmarked, setIsBookmarked] = useState(student.isBookmarked || false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [showEnquiryModal, setShowEnquiryModal] = useState(false);

//   const subjects = Array.isArray(student.subjects)
//     ? student.subjects.join(", ")
//     : student.subjects;

//   const classLabel = student.class;
//   const location = student.Location
//     ? `${student.Location.city}, ${student.Location.state}, ${student.Location.country}`
//     : "N/A";

//   const showMessage = (message) => {
//     setSuccessMessage(message);
//     setTimeout(() => setSuccessMessage(""), 3000);
//   };

//   // Handle View Contact button click
//   const handleViewContact = async () => {
//     try {
//       const hasSubscription = true; // replace with real check
//       if (!hasSubscription) {
//         showMessage("Please subscribe to view contact details");
//         return;
//       }
//       setShowContact(true);
//     } catch (error) {
//       console.error("Failed to load contact details:", error);
//     }
//   };

//   // Handle Hide Contact button click
//   const handleHideContact = () => {
//     setShowContact(false);
//   };

//   // Handle Connect button click
//   const handleConnect = async () => {
//     try {
//       setIsConnecting(true);
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       if (onConnectionRequest) {
//         onConnectionRequest(student.user_id, student.name);
//         showMessage(`Connection request sent to ${student.name}`);
//       }
//     } catch (error) {
//       console.error("Failed to send connection request:", error);
//     } finally {
//       setIsConnecting(false);
//     }
//   };

//   // Handle View Profile button click
//   const handleViewProfileClick = () => {
//     if (onViewProfile) {
//       onViewProfile(student);
//     }
//   };

//   // Handle Bookmark button click
//   const handleBookmark = async () => {
//     try {
//       const newBookmarkState = !isBookmarked;
//       setIsBookmarked(newBookmarkState);
     
//       if (onBookmark) {
//         await onBookmark(student.user_id, student.name);
//       }
     
//       if (newBookmarkState) {
//         showMessage("Student added to bookmarks");
//       } else {
//         showMessage("Student removed from bookmarks");
//       }
//     } catch (error) {
//       console.error("Failed to update bookmark:", error);
//       setIsBookmarked(!isBookmarked);
//     }
//   };

//   // Handle Send Enquiry button click
//   const handleSendEnquiry = () => {
//     setShowEnquiryModal(true);
//   };

//   return (
//     <>
//       <div className="flex flex-col sm:flex-row bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl p-4 sm:p-5 gap-4 sm:gap-5 w-full">
//         {/* Profile Photo */}
//         <div className="w-full sm:w-32 lg:w-40 flex-shrink-0">
//           <img
//             src={student.profile_photo || "/default-user.png"}
//             alt={student.name}
//             className="w-full h-32 sm:h-36 lg:h-40 object-cover rounded-lg border cursor-pointer"
//             onClick={handleViewProfileClick}
//           />
//         </div>

//         {/* Info */}
//         <div className="flex-1 w-full min-w-0">
//           {/* Success Message */}
//           {successMessage && (
//             <div className="mb-3 p-2 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm text-center">
//               {successMessage}
//             </div>
//           )}

//           {/* Top Section */}
//           <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
//             <div className="cursor-pointer min-w-0" onClick={handleViewProfileClick}>
//               <h2 className="text-lg sm:text-xl font-semibold text-gray-800 hover:text-teal-600 transition-colors truncate">
//                 {student.name}
//               </h2>
//               <div className="flex items-center text-sm text-gray-600 mt-1">
//                 <MapPin className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0" />
//                 <span className="truncate">{location}</span>
//               </div>
//             </div>
//           </div>

//           {/* Contact Info */}
//           {showContact && student.User && (
//             <div className="mt-3 p-3 bg-teal-50 rounded-lg border border-teal-200 relative">
//               {/* Close Button */}
//               <button
//                 onClick={handleHideContact}
//                 className="absolute top-2 right-2 text-teal-600 hover:text-teal-800"
//               >
//                 <X className="w-4 h-4" />
//               </button>
             
//               <h3 className="font-medium text-teal-800 mb-2 flex items-center">
//                 <Phone className="w-4 h-4 mr-2" />
//                 Contact Information
//               </h3>
//               <div className="space-y-2 text-sm">
//                 {/* Email */}
//                 {student.User.email && (
//                   <div className="flex flex-col">
//                     <span className="font-medium text-gray-700">Email:</span>
//                     <a
//                       href={`mailto:${student.User.email}`}
//                       className="text-teal-600 hover:text-teal-800 truncate"
//                     >
//                       {student.User.email}
//                     </a>
//                   </div>
//                 )}
//                 {/* Phone */}
//                 {student.User.mobile_number && (
//                   <div className="flex flex-col">
//                     <span className="font-medium text-gray-700">Phone:</span>
//                     <a
//                       href={`tel:${student.User.mobile_number}`}
//                       className="text-teal-600 hover:text-teal-800"
//                     >
//                       {student.User.mobile_number}
//                     </a>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Info Grid */}
//           <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
//             <div className="space-y-1 sm:space-y-2">
//               <p className="text-sm text-gray-700">
//                 <span className="font-medium">Class:</span> {classLabel}
//               </p>
//               <p className="text-sm text-gray-700">
//                 <span className="font-medium">Subjects:</span> {subjects}
//               </p>
//             </div>
//             <div className="space-y-1 sm:space-y-2">
//               {student.start_timeline && (
//                 <p className="text-sm text-gray-700 flex items-center">
//                   <Clock className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0" />
//                   <span className="font-medium">Start Plan:</span> {student.start_timeline}
//                 </p>
//               )}
//               {student.class_modes && (
//                 <p className="text-sm text-gray-700">
//                   <span className="font-medium">Class Type:</span> {student.class_modes.join(", ")}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row flex-wrap gap-2">
//             <button
//               onClick={showContact ? handleHideContact : handleViewContact}
//               className="bg-teal-500 hover:bg-teal-600 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto flex items-center justify-center gap-2 transition-colors"
//             >
//               <Eye className="w-4 h-4" />
//               {showContact ? "Hide Contact" : "View Contact"}
//             </button>

//             <button
//               onClick={handleConnect}
//               disabled={isConnecting}
//               className="border border-teal-500 text-teal-500 hover:bg-teal-50 px-3 sm:px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <UserCheck className="w-4 h-4" />
//               {isConnecting ? "Connecting..." : "Connect"}
//             </button>

//             <button
//               onClick={handleSendEnquiry}
//               className="bg-[#0E2D63] hover:bg-[#0a1f45] text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto flex items-center justify-center gap-2 transition-colors"
//             >
//               <Send className="w-4 h-4" />
//               Send Enquiry
//             </button>

//             <button
//               onClick={handleViewProfileClick}
//               className="border border-gray-300 hover:bg-gray-100 px-3 sm:px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto flex items-center justify-center gap-2 transition-colors"
//             >
//               <UserCheck className="w-4 h-4" />
//               View Profile
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Enquiry Modal */}
//       <EnquiryModal
//         isOpen={showEnquiryModal}
//         onClose={() => setShowEnquiryModal(false)}
//         receiverId={student.user_id}
//         receiverName={student.name}
//       />

//       {/* Toast Container */}
//       <ToastContainer position="top-center" />
//     </>
//   );
// };

// export default TutorCard;

import React, { useState } from "react";
import { X, Send } from "lucide-react";
import { toast } from "react-toastify";
import { apiClient } from "../../../../api/apiclient";

const EnquiryModal = ({
  isOpen,
  onClose,
  receiverId,
  receiverName,
  receiverRole,
  receiverSubscription,
}) => {
  const [formData, setFormData] = useState({
    subject: "",
    class: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.class.trim()) newErrors.class = "Class is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill all required fields");
      return;
    }

    if (!receiverId) {
      toast.error("Receiver ID is missing. Cannot submit enquiry.");
      return;
    }

    // ✅ Subscription check for Tutor
    if (receiverRole === "tutor" && !receiverSubscription) {
      toast.error(
        "Cannot send enquiry. Tutor does not have an active subscription."
      );
      return;
    }

    const payload = {
      receiver_id: receiverId,
      ...formData,
    };

    setIsSubmitting(true);
    try {
      await apiClient.post("/enquiries", payload);
      toast.success("Enquiry submitted successfully to " + receiverName);
      setFormData({ subject: "", class: "", description: "" });
      setErrors({});
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while submitting the enquiry"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-teal-500 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-semibold text-center text-[#0E2D63] mb-6">
            Raise an Enquiry
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject */}
            <div>
              <label className="block text-[#0E2D63] mb-1 text-sm font-medium">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., Mathematics"
                className={`w-full px-4 py-2 border ${
                  errors.subject ? "border-red-500" : "border-teal-500"
                } rounded-md focus:outline-none focus:ring-2 ${
                  errors.subject ? "focus:ring-red-500" : "focus:ring-teal-500"
                }`}
              />
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
              )}
            </div>

            {/* Class */}
            <div>
              <label className="block text-[#0E2D63] mb-1 text-sm font-medium">
                Class <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="class"
                value={formData.class}
                onChange={handleChange}
                placeholder="e.g., 10"
                className={`w-full px-4 py-2 border ${
                  errors.class ? "border-red-500" : "border-teal-500"
                } rounded-md focus:outline-none focus:ring-2 ${
                  errors.class ? "focus:ring-red-500" : "focus:ring-teal-500"
                }`}
              />
              {errors.class && (
                <p className="text-red-500 text-xs mt-1">{errors.class}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-[#0E2D63] mb-1 text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., I would like to discuss teaching opportunities for this student."
                rows={4}
                className={`w-full px-4 py-2 border ${
                  errors.description ? "border-red-500" : "border-teal-500"
                } rounded-md focus:outline-none focus:ring-2 ${
                  errors.description
                    ? "focus:ring-red-500"
                    : "focus:ring-teal-500"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Sending..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;

