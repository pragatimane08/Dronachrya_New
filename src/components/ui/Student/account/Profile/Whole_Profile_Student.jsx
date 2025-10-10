// import React, { useState, useEffect, useRef } from "react";
// import { PencilSquareIcon } from "@heroicons/react/24/outline";
// import {
//   getProfile,
//   updateStudentProfile,
//   updateUserContact,
//   updateLocation,
//   uploadProfilePhoto,
// } from "../../../../../api/repository/profile.repository";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import LocationSearch from "./LocationSearch";

// // Enhanced validation functions
// const validateEmail = (email) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email) && email.length >= 5 && email.length <= 100;
// };

// const validateMobile = (mobile) => {
//   const mobileRegex = /^[6-9][0-9]{9}$/;
//   return mobileRegex.test(mobile);
// };

// const validateName = (name) => {
//   const nameRegex = /^[a-zA-Z\s.'-]{2,50}$/;
//   return nameRegex.test(name.trim());
// };

// const validateStringField = (value, minLength = 2, maxLength = 100) => {
//   const stringRegex = /^[a-zA-Z\s,.-]+$/;
//   const trimmed = value.trim();
//   return trimmed.length >= minLength && trimmed.length <= maxLength && stringRegex.test(trimmed);
// };

// const validateCommaSeparatedList = (value, minLength = 2, maxLength = 100) => {
//   if (!value.trim()) return false;
//   const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
//   return items.length > 0 && items.every(item => validateStringField(item, 1, 30));
// };

// // Auto-resizing textarea component
// const AutoResizeTextarea = ({ value, onChange, placeholder, ...props }) => {
//   const textareaRef = useRef(null);

//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = 'auto';
//       textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
//     }
//   }, [value]);

//   return (
//     <textarea
//       ref={textareaRef}
//       value={value}
//       onChange={(e) => {
//         onChange(e);
//       }}
//       placeholder={placeholder}
//       rows={1}
//       className="w-full border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-3 py-2 rounded-lg transition-all duration-200 outline-none text-gray-900 resize-none text-sm"
//       {...props}
//     />
//   );
// };

// const Whole_Profile_Student = () => {
//   const [profile, setProfile] = useState(null);
//   const [subscription, setSubscription] = useState({
//     status: "Not Subscribed",
//     plan_name: "No Plan",
//     remaining_days: 0
//   });
//   const [editField, setEditField] = useState(null);
//   const [tempValue, setTempValue] = useState("");
//   const [photoPreview, setPhotoPreview] = useState("");
//   const [isLocationLoading, setIsLocationLoading] = useState(false);
//   const [activeSection, setActiveSection] = useState("personal");
//   const [validationErrors, setValidationErrors] = useState({});
//   const [otherBoardValue, setOtherBoardValue] = useState("");
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setIsLoading(true);
//         console.log("Fetching profile data...");
//         const data = await getProfile();
//         console.log("Raw profile data:", data);

//         // Handle different response structures - subscription data is at root level
//         const profileData = data?.profile || data;
       
//         if (!profileData) {
//           console.error("No profile data found in response");
//           return;
//         }

//         // Helper function to format languages
//         const formatLanguages = (languages) => {
//           if (!languages || !Array.isArray(languages)) return "";
         
//           return languages.map(lang => {
//             if (typeof lang === 'string') {
//               return lang;
//             }
//             return `${lang.language || lang.name || ''}${lang.proficiency ? ` (${lang.proficiency})` : ''}`;
//           }).filter(Boolean).join(", ");
//         };

//         // Format subjects
//         const formatSubjects = (subjects) => {
//           if (!subjects) return "";
//           if (Array.isArray(subjects)) {
//             return subjects.join(", ");
//           }
//           if (typeof subjects === 'string') {
//             return subjects;
//           }
//           return "";
//         };

//         // Format class modes
//         const classModes = Array.isArray(profileData.class_modes) ? profileData.class_modes :
//                           profileData.class_modes ? [profileData.class_modes] : [];

//         // Build the profile object with proper fallbacks
//         const formattedProfile = {
//           // Personal Information
//           photo: profileData.profile_photo
//             ? `${profileData.profile_photo}?t=${Date.now()}`
//             : "/default/photo.jpg",
//           name: profileData.name || "",
//           email: profileData.email || profileData.User?.email || "",
//           mobile: profileData.mobile_number || profileData.User?.mobile_number || "",
         
//           // Location
//           location: profileData.Location?.city || profileData.location || "",
//           country: profileData.Location?.country || profileData.country || "India",
//           state: profileData.Location?.state || profileData.state || "",
         
//           // Academic Information
//           class: profileData.class || profileData.grade || "",
//           subjects: formatSubjects(profileData.subjects),
//           school_name: profileData.school_name || profileData.school || "",
//           board: profileData.board || "",
         
//           // Preferences
//           availability: Array.isArray(profileData.availability)
//             ? profileData.availability.join(", ")
//             : profileData.availability || "",
//           onlineClass: classModes.includes("online"),
//           offlineClass: classModes.includes("offline"),
//           smsAlerts: profileData.sms_alerts ?? true,
         
//           // Languages
//           languages: formatLanguages(profileData.languages),
         
//           // Hourly charges
//           hourly_charges: profileData.hourly_charges || "0",
//         };

//         console.log("Formatted profile:", formattedProfile);
//         setProfile(formattedProfile);

//         // Set subscription data from root level - handle both "Unsubscribed" and "Not Subscribed"
//         const subscriptionStatus = data.subscription_status === "Unsubscribed" ? "Not Subscribed" : data.subscription_status;
       
//         const subscriptionData = {
//           status: subscriptionStatus || "Not Subscribed",
//           plan_name: data.plan_name || "No Plan",
//           remaining_days: data.remaining_days || 0
//         };
//         console.log("Subscription data:", subscriptionData);
//         setSubscription(subscriptionData);

//       } catch (error) {
//         console.error("Error loading profile:", error);
//         toast.error("Failed to load profile data");
       
//         // Set a default profile structure to prevent crashes
//         setProfile({
//           photo: "/default/photo.jpg",
//           name: "",
//           email: "",
//           mobile: "",
//           location: "",
//           country: "India",
//           state: "",
//           class: "",
//           subjects: "",
//           school_name: "",
//           board: "",
//           availability: "",
//           onlineClass: false,
//           offlineClass: false,
//           smsAlerts: true,
//           languages: "",
//           hourly_charges: "0",
//         });

//         setSubscription({
//           status: "Not Subscribed",
//           plan_name: "No Plan",
//           remaining_days: 0
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const validateField = (field, value) => {
//     switch (field) {
//       case 'name':
//         return !validateName(value) ? 'Please enter a valid name (2-50 characters)' : null;
//       case 'email':
//         return !validateEmail(value) ? 'Please enter a valid email address' : null;
//       case 'mobile':
//         return !validateMobile(value) ? 'Please enter a valid 10-digit mobile number' : null;
//       case 'subjects':
//         return !validateCommaSeparatedList(value) ? 'Please enter valid subjects separated by commas' : null;
//       case 'class':
//         return !validateStringField(value, 1, 50) ? 'Please enter a valid class' : null;
//       case 'school_name':
//         return !validateStringField(value, 2, 100) ? 'Please enter a valid school/college name' : null;
//       case 'board':
//         return !validateStringField(value, 2, 50) ? 'Please enter a valid board name' : null;
//       case 'languages':
//         return !validateCommaSeparatedList(value) ? 'Please enter valid languages separated by commas' : null;
//       case 'availability':
//         return !validateCommaSeparatedList(value) ? 'Please enter valid availability days' : null;
//       default:
//         return null;
//     }
//   };

//   const handleEdit = (field) => {
//     setEditField(field);
   
//     if (field === 'board') {
//       const boardOptions = ["CBSE", "ICSE", "State Board", "IB", "Cambridge", "Other"];
//       if (boardOptions.includes(profile[field])) {
//         setTempValue(profile[field]);
//         setOtherBoardValue("");
//       } else {
//         setTempValue("Other");
//         setOtherBoardValue(profile[field]);
//       }
//     } else {
//       setTempValue(profile[field] || "");
//     }
//     setValidationErrors(prev => ({ ...prev, [field]: null }));
//   };

//   const handleChange = (e) => setTempValue(e.target.value);

//   const handlePhotoChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       toast.error("Please select a valid image file");
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       toast.error("Image size should be less than 5MB");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => setPhotoPreview(reader.result);
//     reader.readAsDataURL(file);

//     try {
//       const res = await uploadProfilePhoto(file);
//       console.log("Photo upload response:", res);
     
//       let photoUrl;
//       if (res?.profile_photo) {
//         photoUrl = res.profile_photo;
//       } else if (res?.photoUrl) {
//         photoUrl = res.photoUrl;
//       } else {
//         photoUrl = URL.createObjectURL(file);
//       }

//       const photoUrlWithTimestamp = `${photoUrl}?t=${Date.now()}`;
//       setPhotoPreview(photoUrlWithTimestamp);
//       setProfile((prev) => ({ ...prev, photo: photoUrlWithTimestamp }));
//       toast.success("Profile photo updated successfully");
//     } catch (error) {
//       console.error("Error uploading photo:", error);
//       toast.error("Failed to update profile photo");
//     }
//   };

//   const handleSave = async (field) => {
//     try {
//       let valueToSave = tempValue;
     
//       if (field === "board" && tempValue === "Other") {
//         if (!otherBoardValue.trim()) {
//           setValidationErrors(prev => ({ ...prev, [field]: "Please specify the board name" }));
//           toast.error("Please specify the board name");
//           return;
//         }
//         valueToSave = otherBoardValue.trim();
//       }
     
//       const error = validateField(field, valueToSave);
//       if (error) {
//         setValidationErrors(prev => ({ ...prev, [field]: error }));
//         toast.error(error);
//         return;
//       }

//       setValidationErrors(prev => ({ ...prev, [field]: null }));

//       if (["email", "mobile"].includes(field)) {
//         const fieldToSend = field === "mobile" ? "mobile_number" : field;
//         await updateUserContact(fieldToSend, valueToSave);
//       } else if (field === "location") {
//         return;
//       } else {
//         let payload = {};
//         const isArray = ["subjects", "availability", "languages"].includes(field);

//         let processedValue;
//         if (isArray) {
//           if (field === 'languages') {
//             processedValue = valueToSave.split(",").map((v) => {
//               const trimmed = v.trim();
//               const match = trimmed.match(/^(.+?)\s*\((.+?)\)$/);
//               if (match) {
//                 return {
//                   language: match[1].trim(),
//                   proficiency: match[2].trim()
//                 };
//               }
//               return {
//                 language: trimmed,
//                 proficiency: "Moderate"
//               };
//             });
//           } else {
//             processedValue = valueToSave.split(",").map((v) => v.trim()).filter(v => v);
//           }
//         } else {
//           processedValue = valueToSave;
//         }

//         payload[field] = processedValue;
//         console.log(`Updating ${field}:`, payload);
//         await updateStudentProfile(payload);
//       }

//       setProfile((prev) => ({ ...prev, [field]: valueToSave }));
//       setEditField(null);
//       setValidationErrors({});
//       setOtherBoardValue("");
//       toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
//     } catch (error) {
//       console.error(`Error updating ${field}:`, error);
//       toast.error(`Failed to update ${field}`);
//     }
//   };

//   const handleClassToggle = async (field) => {
//     const updatedValue = !profile[field];
//     const updatedProfile = { ...profile, [field]: updatedValue };
//     setProfile(updatedProfile);

//     const class_modes = [
//       ...(updatedProfile.onlineClass ? ["online"] : []),
//       ...(updatedProfile.offlineClass ? ["offline"] : []),
//     ];

//     try {
//       await updateStudentProfile({ class_modes });
//       toast.success("Class preferences updated successfully");
//     } catch (error) {
//       console.error("Error updating class modes:", error);
//       setProfile(prev => ({ ...prev, [field]: !updatedValue }));
//       toast.error("Failed to update class preferences");
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditField(null);
//     setTempValue("");
//     setOtherBoardValue("");
//     setValidationErrors({});
//   };

//   const getStatusBadge = (status) => {
//     const statusStyles = {
//       Subscribed: "bg-emerald-50 text-emerald-700 border-emerald-200",
//       "Not Subscribed": "bg-amber-50 text-amber-700 border-amber-200",
//       Unsubscribed: "bg-amber-50 text-amber-700 border-amber-200",
//       Expired: "bg-red-50 text-red-700 border-red-200",
//     };
//     return statusStyles[status] || statusStyles["Not Subscribed"];
//   };

//   const getPlanBadge = (plan) => {
//     const planStyles = {
//       "Platinum Plan": "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
//       "Gold Plan": "bg-gradient-to-r from-amber-500 to-yellow-500 text-white",
//       "Silver Plan": "bg-gradient-to-r from-gray-400 to-gray-600 text-white",
//       "No Plan": "bg-gray-200 text-gray-700",
//     };
//     return planStyles[plan] || planStyles["No Plan"];
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4 sm:mb-6"></div>
//           <p className="text-gray-600 text-base sm:text-lg font-medium px-4">Loading your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
//         <div className="text-center">
//           <div className="text-red-500 text-lg font-semibold">Failed to load profile</div>
//           <p className="text-gray-600 mt-2">Please try refreshing the page</p>
//         </div>
//       </div>
//     );
//   }

//   const sections = [
//     {
//       id: "personal",
//       label: "Personal",
//       fullLabel: "Personal Information",
//       icon: (
//         <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//         </svg>
//       )
//     },
//     {
//       id: "academic",
//       label: "Academic",
//       fullLabel: "Academic Details",
//       icon: (
//         <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//         </svg>
//       )
//     },
//     {
//       id: "preferences",
//       label: "Settings",
//       fullLabel: "Settings & Preferences",
//       icon: (
//         <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//         </svg>
//       )
//     },
//   ];

//   const personalFields = [
//     {
//       label: "Full Name",
//       field: "name",
//       icon: (
//         <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//         </svg>
//       )
//     },
//     {
//       label: "Email Address",
//       field: "email",
//       icon: (
//         <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//         </svg>
//       )
//     },
//     {
//       label: "Mobile Number",
//       field: "mobile",
//       icon: (
//         <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//         </svg>
//       )
//     },
//     {
//       label: "Location",
//       field: "location",
//       icon: (
//         <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//         </svg>
//       )
//     },
//   ];

//   const academicFields = [
//     {
//       label: "Class/Grade",
//       field: "class",
//       placeholder: "10th, 12th, B.Tech, etc.",
//       icon: (
//         <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//         </svg>
//       )
//     },
//     {
//       label: "Subjects",
//       field: "subjects",
//       placeholder: "Math, Physics, Chemistry",
//       icon: (
//         <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//         </svg>
//       )
//     },
//     {
//       label: "Board",
//       field: "board",
//       type: "selectWithOther",
//       options: ["CBSE", "ICSE", "State Board", "IB", "Cambridge", "Other"],
//       icon: (
//         <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//         </svg>
//       )
//     },
//     {
//       label: "School/College",
//       field: "school_name",
//       icon: (
//         <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//         </svg>
//       )
//     },
//     {
//       label: "Languages",
//       field: "languages",
//       placeholder: "English (Fluent), Hindi (Moderate)",
//       icon: (
//         <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
//         </svg>
//       )
//     },
//     {
//       label: "Availability",
//       field: "availability",
//       placeholder: "Weekdays, Weekends",
//       icon: (
//         <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//       )
//     },
//   ];

//   const renderEditableField = ({ label, field, type = "text", icon, placeholder, options }) => (
//     <div key={field} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300 group">
//       <div className="flex items-center gap-3 mb-3">
//         <div className="p-1.5 bg-gray-50 rounded-md group-hover:bg-gray-100 transition-colors duration-200">
//           {icon}
//         </div>
//         <label className="text-sm font-semibold text-gray-800">{label}</label>
//       </div>

//       {editField === field ? (
//         <div className="space-y-3">
//           {field === "location" ? (
//             <LocationSearch
//               value={tempValue}
//               onSelect={async (selected) => {
//                 setTempValue(selected.name);
//                 setIsLocationLoading(true);
//                 try {
//                   await updateLocation(selected.place_id);
//                   setProfile((prev) => ({
//                     ...prev,
//                     location: selected.city || selected.name,
//                     country: selected.country || "India",
//                     state: selected.state || "",
//                   }));
//                   setEditField(null);
//                   toast.success("Location updated successfully");
//                 } catch (error) {
//                   console.error("Error updating location:", error);
//                   toast.error("Failed to update location");
//                 } finally {
//                   setIsLocationLoading(false);
//                 }
//               }}
//             />
//           ) : type === "select" ? (
//             <select
//               value={tempValue}
//               onChange={handleChange}
//               className="w-full border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-3 py-2 rounded-lg transition-all duration-200 outline-none text-gray-900 text-sm"
//             >
//               <option value="">Select {label}</option>
//               {options.map((option) => (
//                 <option key={option} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//           ) : type === "selectWithOther" ? (
//             <>
//               <select
//                 value={tempValue}
//                 onChange={(e) => {
//                   const newOption = e.target.value;
//                   setTempValue(newOption);
//                   if (newOption !== "Other") {
//                     setOtherBoardValue("");
//                   }
//                 }}
//                 className="w-full border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-3 py-2 rounded-lg transition-all duration-200 outline-none text-gray-900 text-sm"
//               >
//                 <option value="">Select {label}</option>
//                 {options.map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//               {tempValue === "Other" && (
//                 <input
//                   type="text"
//                   value={otherBoardValue}
//                   onChange={(e) => setOtherBoardValue(e.target.value)}
//                   placeholder="Enter board name"
//                   className="w-full border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-3 py-2 rounded-lg transition-all duration-200 outline-none text-gray-900 text-sm"
//                 />
//               )}
//             </>
//           ) : type === "textarea" ? (
//             <AutoResizeTextarea
//               value={tempValue}
//               onChange={handleChange}
//               placeholder={placeholder}
//             />
//           ) : (
//             <input
//               type={type}
//               value={tempValue}
//               onChange={handleChange}
//               placeholder={placeholder}
//               className="w-full border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-3 py-2 rounded-lg transition-all duration-200 outline-none text-gray-900 text-sm"
//             />
//           )}
         
//           {validationErrors[field] && (
//             <p className="text-red-500 text-xs mt-1">{validationErrors[field]}</p>
//           )}
         
//           <div className="flex flex-col sm:flex-row gap-2">
//             <button
//               onClick={() => handleSave(field)}
//               disabled={
//                 (field === "email" && !validateEmail(tempValue)) ||
//                 (field === "mobile" && !validateMobile(tempValue)) ||
//                 (field === "location" && isLocationLoading) ||
//                 (field === "board" && tempValue === "Other" && !otherBoardValue.trim())
//               }
//               className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm"
//             >
//               {isLocationLoading && field === "location" ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></div>
//                   Saving...
//                 </div>
//               ) : (
//                 "Save"
//               )}
//             </button>
//             <button
//               onClick={handleCancelEdit}
//               className="flex-1 bg-gray-100 text-gray-700 py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 text-sm"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="flex justify-between items-start">
//           <p className="text-gray-900 font-medium text-sm sm:text-base break-words flex-1">
//             {profile[field] || <span className="text-gray-400 italic font-normal">Not specified</span>}
//           </p>
//           <button
//             onClick={() => handleEdit(field)}
//             className="ml-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 flex-shrink-0"
//           >
//             <PencilSquareIcon className="h-4 w-4 text-indigo-600" />
//           </button>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       <ToastContainer position="top-right" autoClose={3000} />

//       {/* Header Section */}
//       <div className="bg-white shadow-lg border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//           <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 lg:gap-10">

//             {/* Profile Photo */}
//             <div className="relative group flex-shrink-0">
//               <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-indigo-100 to-purple-100">
//                 <img
//                   src={photoPreview || profile.photo || "/default/photo.jpg"}
//                   alt="Profile"
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.target.src = "/default/photo.jpg";
//                   }}
//                 />
//               </div>
//               <label className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
//                 <input
//                   type="file"
//                   className="hidden"
//                   accept="image/*"
//                   onChange={handlePhotoChange}
//                 />
//                 <div className="text-white text-center">
//                   <svg
//                     className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
//                     />
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
//                     />
//                   </svg>
//                   <span className="text-xs font-semibold">Update</span>
//                 </div>
//               </label>
//             </div>

//             {/* Profile Info */}
//             <div className="text-center sm:text-left flex-1">
//               <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
//                 {profile.name || "Complete your profile"}
//               </h1>

//               {/* Location */}
//               <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-gray-600 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
//                 <svg
//                   className="w-4 h-4 sm:w-5 sm:h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                   />
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                   />
//                 </svg>
//                 <span>
//                   {profile.location || "Add your location"}, {profile.country}
//                 </span>
//               </div>

//               {/* Badges */}
//               <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
//                 {/* Subscription Status */}
//                 <span
//                   className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border-2 ${getStatusBadge(
//                     subscription.status
//                   )}`}
//                 >
//                   <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current mr-1.5 sm:mr-2"></span>
//                   {subscription.status}
//                 </span>

//                 {/* Plan Name */}
//                 {subscription.status === "Subscribed" && subscription.plan_name && (
//                   <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${getPlanBadge(subscription.plan_name)}`}>
//                     {subscription.plan_name}
//                   </span>
//                 )}

//                 {/* Remaining Days */}
//                 {subscription.status === "Subscribed" && subscription.remaining_days > 0 && (
//                   <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-blue-50 text-blue-700 border-2 border-blue-200">
//                     <svg
//                       className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                       />
//                     </svg>
//                     {subscription.remaining_days} days remaining
//                   </span>
//                 )}

//                 {/* Class/Grade */}
//                 {profile.class && (
//                   <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-purple-50 text-purple-700 border-2 border-purple-200">
//                     <svg
//                       className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
//                       />
//                     </svg>
//                     {profile.class}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
//         <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
//           <nav className="flex overflow-x-auto scrollbar-hide -mx-2 px-2">
//             {sections.map((section) => (
//               <button
//                 key={section.id}
//                 onClick={() => setActiveSection(section.id)}
//                 className={`flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 py-3 px-3 border-b-2 font-medium text-xs sm:text-sm lg:text-base whitespace-nowrap transition-all duration-200 min-w-max flex-1 sm:flex-initial ${activeSection === section.id
//                   ? "border-indigo-500 text-indigo-600 bg-indigo-50"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                   }`}
//               >
//                 <span className="text-base sm:text-lg">{section.icon}</span>
//                 <span className="hidden xs:inline sm:hidden">{section.label}</span>
//                 <span className="hidden sm:inline xs:hidden md:inline">{section.fullLabel}</span>
//                 <span className="sm:hidden md:hidden lg:hidden">{section.label}</span>
//               </button>
//             ))}
//           </nav>
//         </div>
//       </div>

//       {/* Content Sections */}
//       <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">

//         {/* Personal Information */}
//         {activeSection === "personal" && (
//           <div className="space-y-4 sm:space-y-6 md:space-y-8">
//             <div className="text-center px-2">
//               <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
//                 Personal Information
//               </h2>
//               <p className="mt-1 sm:mt-2 text-gray-600 text-xs sm:text-sm md:text-base max-w-xl mx-auto">
//                 Keep your personal details updated for better communication and profile management.
//               </p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//               {personalFields.map((field) => (
//                 <div
//                   key={field.field}
//                   className="relative bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-indigo-300 transition"
//                 >
//                   {renderEditableField(field)}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Academic Information */}
//         {activeSection === "academic" && (
//           <div className="space-y-4 sm:space-y-6 md:space-y-8">
//             <div className="text-center mb-4 sm:mb-6 md:mb-8 px-2">
//               <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
//                 Academic Details
//               </h2>
//               <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
//                 Update your academic information to help us find the best tutors for you
//               </p>
//             </div>
           
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//               {academicFields.map((field) => (
//                 <div
//                   key={field.field}
//                   className="relative bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-indigo-300 transition"
//                 >
//                   {renderEditableField(field)}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Preferences */}
//         {activeSection === "preferences" && (
//           <div className="space-y-4 sm:space-y-6 md:space-y-8">
//             <div className="text-center mb-4 sm:mb-6 md:mb-8 px-2">
//               <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
//                 Learning Preferences
//               </h2>
//               <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
//                 Configure your preferred learning modes and notification settings
//               </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
//               {/* Learning Modes */}
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-5">
//                 <div className="flex items-center gap-2 mb-3 sm:mb-4">
//                   <div className="p-2 bg-indigo-100 rounded-lg">
//                     <svg
//                       className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
//                       />
//                     </svg>
//                   </div>
//                   <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
//                     Preferred Learning Modes
//                   </h3>
//                 </div>
//                 <div className="space-y-3">
//                   {[
//                     {
//                       mode: "onlineClass",
//                       label: "Online Classes",
//                       desc: "Virtual sessions via Zoom, Meet",
//                       icon: (
//                         <svg
//                           className="w-4 h-4 sm:w-5 sm:h-5"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                           />
//                         </svg>
//                       ),
//                     },
//                     {
//                       mode: "offlineClass",
//                       label: "In-Person Classes",
//                       desc: "Face-to-face learning",
//                       icon: (
//                         <svg
//                           className="w-4 h-4 sm:w-5 sm:h-5"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
//                           />
//                         </svg>
//                       ),
//                     },
//                   ].map(({ mode, label, desc, icon }) => (
//                     <label
//                       key={mode}
//                       className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${profile[mode]
//                         ? "border-indigo-300 bg-indigo-50"
//                         : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white"
//                         }`}
//                     >
//                       <div className="flex items-center gap-3">
//                         <div
//                           className={`p-2 rounded-lg ${profile[mode]
//                             ? "bg-indigo-100 text-indigo-600"
//                             : "bg-gray-100 text-gray-500"
//                             }`}
//                         >
//                           {icon}
//                         </div>
//                         <div>
//                           <p className="font-semibold text-gray-900 text-xs sm:text-sm">
//                             {label}
//                           </p>
//                           <p className="text-xs text-gray-600 mt-1">{desc}</p>
//                         </div>
//                       </div>
//                       <div className="relative">
//                         <input
//                           type="checkbox"
//                           checked={profile[mode]}
//                           onChange={() => handleClassToggle(mode)}
//                           className="sr-only"
//                         />
//                         <div
//                           className={`w-10 h-6 rounded-full transition-colors duration-200 ${profile[mode] ? "bg-indigo-600" : "bg-gray-300"
//                             }`}
//                         >
//                           <div
//                             className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-1 ${profile[mode] ? "translate-x-5" : "translate-x-1"
//                               }`}
//                           ></div>
//                         </div>
//                       </div>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* Notifications */}
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-5">
//                 <div className="flex items-center gap-2 mb-3 sm:mb-4">
//                   <div className="p-2 bg-emerald-100 rounded-lg">
//                     <svg
//                       className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15 17h5l-5 5v-5zM4 17h2v5H4v-5zM4 13v4h16v-4M4 13a2 2 0 01-2-2V7a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2"
//                       />
//                     </svg>
//                   </div>
//                   <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
//                     Notifications
//                   </h3>
//                 </div>
//                 <label
//                   className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${profile.smsAlerts
//                     ? "border-emerald-300 bg-emerald-50"
//                     : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white"
//                     }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div
//                       className={`p-2 rounded-lg ${profile.smsAlerts
//                         ? "bg-emerald-100 text-emerald-600"
//                         : "bg-gray-100 text-gray-500"
//                         }`}
//                     >
//                       <svg
//                         className="w-4 h-4 sm:w-5 sm:h-5"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//                         />
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-900 text-xs sm:text-sm">SMS Alerts</p>
//                       <p className="text-xs text-gray-600 mt-1">
//                         Receive class notifications via SMS
//                       </p>
//                     </div>
//                   </div>
//                   <div className="relative">
//                     <input
//                       type="checkbox"
//                       checked={profile.smsAlerts}
//                       onChange={async (e) => {
//                         const newValue = e.target.checked;
//                         setProfile((prev) => ({ ...prev, smsAlerts: newValue }));
//                         try {
//                           await updateStudentProfile({ sms_alerts: newValue });
//                           toast.success("Notification preferences updated");
//                         } catch (error) {
//                           console.error("Error updating SMS alerts:", error);
//                           setProfile(prev => ({ ...prev, smsAlerts: !newValue }));
//                           toast.error("Failed to update notification preferences");
//                         }
//                       }}
//                       className="sr-only"
//                     />
//                     <div
//                       className={`w-10 h-6 rounded-full transition-colors duration-200 ${profile.smsAlerts ? "bg-emerald-600" : "bg-gray-300"
//                         }`}
//                     >
//                       <div
//                         className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-1 ${profile.smsAlerts ? "translate-x-5" : "translate-x-1"
//                           }`}
//                       ></div>
//                     </div>
//                   </div>
//                 </label>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Whole_Profile_Student;


import React, { useState, useEffect, useRef } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import {
  getProfile,
  updateStudentProfile,
  updateUserContact,
  updateLocation,
  uploadProfilePhoto,
} from "../../../../../api/repository/profile.repository";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LocationSearch from "./LocationSearch";

// Enhanced validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length >= 5 && email.length <= 100;
};

const validateMobile = (mobile) => {
  const mobileRegex = /^[6-9][0-9]{9}$/;
  return mobileRegex.test(mobile);
};

const validateName = (name) => {
  const nameRegex = /^[a-zA-Z\s.'-]{2,50}$/;
  return nameRegex.test(name.trim());
};

const validateStringField = (value, minLength = 2, maxLength = 100) => {
  const stringRegex = /^[a-zA-Z\s,.-]+$/;
  const trimmed = value.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength && stringRegex.test(trimmed);
};

const validateCommaSeparatedList = (value, minLength = 2, maxLength = 100) => {
  if (!value.trim()) return false;
  const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
  return items.length > 0 && items.every(item => validateStringField(item, 1, 30));
};

// Auto-resizing textarea component
const AutoResizeTextarea = ({ value, onChange, placeholder, ...props }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        onChange(e);
      }}
      placeholder={placeholder}
      rows={1}
      className="w-full border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-3 py-2 rounded-lg transition-all duration-200 outline-none text-gray-900 resize-none text-sm"
      {...props}
    />
  );
};

const Whole_Profile_Student = () => {
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState({
    status: "Not Subscribed",
    plan_name: "No Plan",
    remaining_days: 0
  });
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [validationErrors, setValidationErrors] = useState({});
  const [otherBoardValue, setOtherBoardValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching profile data...");
        const data = await getProfile();
        console.log("Raw profile data:", data);
        console.log("Subscription status from API:", data.subscription_status);
        console.log("Plan name from API:", data.plan_name);
        console.log("Remaining days from API:", data.remaining_days);

        // Handle different response structures - subscription data is at root level
        const profileData = data?.profile || data;
       
        if (!profileData) {
          console.error("No profile data found in response");
          return;
        }

        // Helper function to format languages
        const formatLanguages = (languages) => {
          if (!languages || !Array.isArray(languages)) return "";
         
          return languages.map(lang => {
            if (typeof lang === 'string') {
              return lang;
            }
            return `${lang.language || lang.name || ''}${lang.proficiency ? ` (${lang.proficiency})` : ''}`;
          }).filter(Boolean).join(", ");
        };

        // Format subjects
        const formatSubjects = (subjects) => {
          if (!subjects) return "";
          if (Array.isArray(subjects)) {
            return subjects.join(", ");
          }
          if (typeof subjects === 'string') {
            return subjects;
          }
          return "";
        };

        // Format class modes
        const classModes = Array.isArray(profileData.class_modes) ? profileData.class_modes :
                          profileData.class_modes ? [profileData.class_modes] : [];

        // Build the profile object with proper fallbacks
        const formattedProfile = {
          // Personal Information
          photo: profileData.profile_photo
            ? `${profileData.profile_photo}?t=${Date.now()}`
            : "/default/photo.jpg",
          name: profileData.name || "",
          email: profileData.email || profileData.User?.email || "",
          mobile: profileData.mobile_number || profileData.User?.mobile_number || "",
         
          // Location
          location: profileData.Location?.city || profileData.location || "",
          country: profileData.Location?.country || profileData.country || "India",
          state: profileData.Location?.state || profileData.state || "",
         
          // Academic Information
          class: profileData.class || profileData.grade || "",
          subjects: formatSubjects(profileData.subjects),
          school_name: profileData.school_name || profileData.school || "",
          board: profileData.board || "",
         
          // Preferences
          availability: Array.isArray(profileData.availability)
            ? profileData.availability.join(", ")
            : profileData.availability || "",
          onlineClass: classModes.includes("online") || classModes.includes("Online"),
          offlineClass: classModes.includes("offline") || classModes.includes("Offline"),
          smsAlerts: profileData.sms_alerts ?? true,
         
          // Languages
          languages: formatLanguages(profileData.languages),
         
          // Hourly charges
          hourly_charges: profileData.hourly_charges || "0",
        };

        console.log("Formatted profile:", formattedProfile);
        setProfile(formattedProfile);

        // ✅ FIX: Set subscription data directly without any transformation
        const subscriptionData = {
          status: data.subscription_status || "Not Subscribed",
          plan_name: data.plan_name || "No Plan",
          remaining_days: data.remaining_days || 0
        };
        console.log("Subscription data:", subscriptionData);
        setSubscription(subscriptionData);

      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile data");
       
        // Set a default profile structure to prevent crashes
        setProfile({
          photo: "/default/photo.jpg",
          name: "",
          email: "",
          mobile: "",
          location: "",
          country: "India",
          state: "",
          class: "",
          subjects: "",
          school_name: "",
          board: "",
          availability: "",
          onlineClass: false,
          offlineClass: false,
          smsAlerts: true,
          languages: "",
          hourly_charges: "0",
        });

        setSubscription({
          status: "Not Subscribed",
          plan_name: "No Plan",
          remaining_days: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        return !validateName(value) ? 'Please enter a valid name (2-50 characters)' : null;
      case 'email':
        return !validateEmail(value) ? 'Please enter a valid email address' : null;
      case 'mobile':
        return !validateMobile(value) ? 'Please enter a valid 10-digit mobile number' : null;
      case 'subjects':
        return !validateCommaSeparatedList(value) ? 'Please enter valid subjects separated by commas' : null;
      case 'class':
        return !validateStringField(value, 1, 50) ? 'Please enter a valid class' : null;
      case 'school_name':
        return !validateStringField(value, 2, 100) ? 'Please enter a valid school/college name' : null;
      case 'board':
        return !validateStringField(value, 2, 50) ? 'Please enter a valid board name' : null;
      case 'languages':
        return !validateCommaSeparatedList(value) ? 'Please enter valid languages separated by commas' : null;
      case 'availability':
        return !validateCommaSeparatedList(value) ? 'Please enter valid availability days' : null;
      default:
        return null;
    }
  };

  const handleEdit = (field) => {
    setEditField(field);
   
    if (field === 'board') {
      const boardOptions = ["CBSE", "ICSE", "State Board", "IB", "Cambridge", "Other"];
      if (boardOptions.includes(profile[field])) {
        setTempValue(profile[field]);
        setOtherBoardValue("");
      } else {
        setTempValue("Other");
        setOtherBoardValue(profile[field]);
      }
    } else {
      setTempValue(profile[field] || "");
    }
    setValidationErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleChange = (e) => setTempValue(e.target.value);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);

    try {
      const res = await uploadProfilePhoto(file);
      console.log("Photo upload response:", res);
     
      let photoUrl;
      if (res?.profile_photo) {
        photoUrl = res.profile_photo;
      } else if (res?.photoUrl) {
        photoUrl = res.photoUrl;
      } else {
        photoUrl = URL.createObjectURL(file);
      }

      const photoUrlWithTimestamp = `${photoUrl}?t=${Date.now()}`;
      setPhotoPreview(photoUrlWithTimestamp);
      setProfile((prev) => ({ ...prev, photo: photoUrlWithTimestamp }));
      toast.success("Profile photo updated successfully");
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Failed to update profile photo");
    }
  };

  const handleSave = async (field) => {
    try {
      let valueToSave = tempValue;
     
      if (field === "board" && tempValue === "Other") {
        if (!otherBoardValue.trim()) {
          setValidationErrors(prev => ({ ...prev, [field]: "Please specify the board name" }));
          toast.error("Please specify the board name");
          return;
        }
        valueToSave = otherBoardValue.trim();
      }
     
      const error = validateField(field, valueToSave);
      if (error) {
        setValidationErrors(prev => ({ ...prev, [field]: error }));
        toast.error(error);
        return;
      }

      setValidationErrors(prev => ({ ...prev, [field]: null }));

      if (["email", "mobile"].includes(field)) {
        const fieldToSend = field === "mobile" ? "mobile_number" : field;
        await updateUserContact(fieldToSend, valueToSave);
      } else if (field === "location") {
        return;
      } else {
        let payload = {};
        const isArray = ["subjects", "availability", "languages"].includes(field);

        let processedValue;
        if (isArray) {
          if (field === 'languages') {
            processedValue = valueToSave.split(",").map((v) => {
              const trimmed = v.trim();
              const match = trimmed.match(/^(.+?)\s*\((.+?)\)$/);
              if (match) {
                return {
                  language: match[1].trim(),
                  proficiency: match[2].trim()
                };
              }
              return {
                language: trimmed,
                proficiency: "Moderate"
              };
            });
          } else {
            processedValue = valueToSave.split(",").map((v) => v.trim()).filter(v => v);
          }
        } else {
          processedValue = valueToSave;
        }

        payload[field] = processedValue;
        console.log(`Updating ${field}:`, payload);
        await updateStudentProfile(payload);
      }

      setProfile((prev) => ({ ...prev, [field]: valueToSave }));
      setEditField(null);
      setValidationErrors({});
      setOtherBoardValue("");
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error(`Failed to update ${field}`);
    }
  };

  const handleClassToggle = async (field) => {
    const updatedValue = !profile[field];
    const updatedProfile = { ...profile, [field]: updatedValue };
    setProfile(updatedProfile);

    const class_modes = [
      ...(updatedProfile.onlineClass ? ["online"] : []),
      ...(updatedProfile.offlineClass ? ["offline"] : []),
    ];

    try {
      await updateStudentProfile({ class_modes });
      toast.success("Class preferences updated successfully");
    } catch (error) {
      console.error("Error updating class modes:", error);
      setProfile(prev => ({ ...prev, [field]: !updatedValue }));
      toast.error("Failed to update class preferences");
    }
  };

  const handleCancelEdit = () => {
    setEditField(null);
    setTempValue("");
    setOtherBoardValue("");
    setValidationErrors({});
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Subscribed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      "Not Subscribed": "bg-amber-50 text-amber-700 border-amber-200",
      Unsubscribed: "bg-amber-50 text-amber-700 border-amber-200",
      Expired: "bg-red-50 text-red-700 border-red-200",
    };
    return statusStyles[status] || statusStyles["Not Subscribed"];
  };

  const getPlanBadge = (plan) => {
    const planStyles = {
      "Platinum Plan": "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
      "Gold Plan": "bg-gradient-to-r from-amber-500 to-yellow-500 text-white",
      "Silver Plan": "bg-gradient-to-r from-gray-400 to-gray-600 text-white",
      "No Plan": "bg-gray-200 text-gray-700",
    };
    return planStyles[plan] || planStyles["No Plan"];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4 sm:mb-6"></div>
          <p className="text-gray-600 text-base sm:text-lg font-medium px-4">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold">Failed to load profile</div>
          <p className="text-gray-600 mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const sections = [
    {
      id: "personal",
      label: "Personal",
      fullLabel: "Personal Information",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: "academic",
      label: "Academic",
      fullLabel: "Academic Details",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      id: "preferences",
      label: "Settings",
      fullLabel: "Settings & Preferences",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];

  const personalFields = [
    {
      label: "Full Name",
      field: "name",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      label: "Email Address",
      field: "email",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      label: "Mobile Number",
      field: "mobile",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    },
    {
      label: "Location",
      field: "location",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];

  const academicFields = [
    {
      label: "Class/Grade",
      field: "class",
      placeholder: "10th, 12th, B.Tech, etc.",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      label: "Subjects",
      field: "subjects",
      placeholder: "Math, Physics, Chemistry",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      label: "Board",
      field: "board",
      type: "selectWithOther",
      options: ["CBSE", "ICSE", "State Board", "IB", "Cambridge", "Other"],
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      label: "School/College",
      field: "school_name",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      label: "Languages",
      field: "languages",
      placeholder: "English (Fluent), Hindi (Moderate)",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      )
    },
    {
      label: "Availability",
      field: "availability",
      placeholder: "Weekdays, Weekends",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  const renderEditableField = ({ label, field, type = "text", icon, placeholder, options }) => (
    <div key={field} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-1.5 bg-gray-50 rounded-md group-hover:bg-gray-100 transition-colors duration-200">
          {icon}
        </div>
        <label className="text-sm font-semibold text-gray-800">{label}</label>
      </div>

      {editField === field ? (
        <div className="space-y-3">
          {field === "location" ? (
            <LocationSearch
              value={tempValue}
              onSelect={async (selected) => {
                setTempValue(selected.name);
                setIsLocationLoading(true);
                try {
                  await updateLocation(selected.place_id);
                  setProfile((prev) => ({
                    ...prev,
                    location: selected.city || selected.name,
                    country: selected.country || "India",
                    state: selected.state || "",
                  }));
                  setEditField(null);
                  toast.success("Location updated successfully");
                } catch (error) {
                  console.error("Error updating location:", error);
                  toast.error("Failed to update location");
                } finally {
                  setIsLocationLoading(false);
                }
              }}
            />
          ) : type === "select" ? (
            <select
              value={tempValue}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-3 py-2 rounded-lg transition-all duration-200 outline-none text-gray-900 text-sm"
            >
              <option value="">Select {label}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : type === "selectWithOther" ? (
            <>
              <select
                value={tempValue}
                onChange={(e) => {
                  const newOption = e.target.value;
                  setTempValue(newOption);
                  if (newOption !== "Other") {
                    setOtherBoardValue("");
                  }
                }}
                className="w-full border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-3 py-2 rounded-lg transition-all duration-200 outline-none text-gray-900 text-sm"
              >
                <option value="">Select {label}</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {tempValue === "Other" && (
                <input
                  type="text"
                  value={otherBoardValue}
                  onChange={(e) => setOtherBoardValue(e.target.value)}
                  placeholder="Enter board name"
                  className="w-full border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-3 py-2 rounded-lg transition-all duration-200 outline-none text-gray-900 text-sm"
                />
              )}
            </>
          ) : type === "textarea" ? (
            <AutoResizeTextarea
              value={tempValue}
              onChange={handleChange}
              placeholder={placeholder}
            />
          ) : (
            <input
              type={type}
              value={tempValue}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-3 py-2 rounded-lg transition-all duration-200 outline-none text-gray-900 text-sm"
            />
          )}
         
          {validationErrors[field] && (
            <p className="text-red-500 text-xs mt-1">{validationErrors[field]}</p>
          )}
         
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => handleSave(field)}
              disabled={
                (field === "email" && !validateEmail(tempValue)) ||
                (field === "mobile" && !validateMobile(tempValue)) ||
                (field === "location" && isLocationLoading) ||
                (field === "board" && tempValue === "Other" && !otherBoardValue.trim())
              }
              className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm"
            >
              {isLocationLoading && field === "location" ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></div>
                  Saving...
                </div>
              ) : (
                "Save"
              )}
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 bg-gray-100 text-gray-700 py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start">
          <p className="text-gray-900 font-medium text-sm sm:text-base break-words flex-1">
            {profile[field] || <span className="text-gray-400 italic font-normal">Not specified</span>}
          </p>
          <button
            onClick={() => handleEdit(field)}
            className="ml-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 flex-shrink-0"
          >
            <PencilSquareIcon className="h-4 w-4 text-indigo-600" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header Section */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 lg:gap-10">

            {/* Profile Photo */}
            <div className="relative group flex-shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-indigo-100 to-purple-100">
                <img
                  src={photoPreview || profile.photo || "/default/photo.jpg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/default/photo.jpg";
                  }}
                />
              </div>
              <label className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                <div className="text-white text-center">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-xs font-semibold">Update</span>
                </div>
              </label>
            </div>

            {/* Profile Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                {profile.name || "Complete your profile"}
              </h1>

              {/* Location */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-gray-600 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  {profile.location || "Add your location"}, {profile.country}
                </span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {/* Subscription Status */}
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border-2 ${getStatusBadge(
                    subscription.status
                  )}`}
                >
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current mr-1.5 sm:mr-2"></span>
                  {subscription.status}
                </span>

                {/* Plan Name */}
                {subscription.status === "Subscribed" && subscription.plan_name && subscription.plan_name !== "No Plan" && (
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${getPlanBadge(subscription.plan_name)}`}>
                    {subscription.plan_name}
                  </span>
                )}

                {/* Remaining Days */}
                {subscription.status === "Subscribed" && subscription.remaining_days > 0 && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-blue-50 text-blue-700 border-2 border-blue-200">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {subscription.remaining_days} days remaining
                  </span>
                )}

                {/* Class/Grade */}
                {profile.class && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-purple-50 text-purple-700 border-2 border-purple-200">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    {profile.class}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <nav className="flex overflow-x-auto scrollbar-hide -mx-2 px-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 py-3 px-3 border-b-2 font-medium text-xs sm:text-sm lg:text-base whitespace-nowrap transition-all duration-200 min-w-max flex-1 sm:flex-initial ${activeSection === section.id
                  ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <span className="text-base sm:text-lg">{section.icon}</span>
                <span className="hidden xs:inline sm:hidden">{section.label}</span>
                <span className="hidden sm:inline xs:hidden md:inline">{section.fullLabel}</span>
                <span className="sm:hidden md:hidden lg:hidden">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">

        {/* Personal Information */}
        {activeSection === "personal" && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="text-center px-2">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                Personal Information
              </h2>
              <p className="mt-1 sm:mt-2 text-gray-600 text-xs sm:text-sm md:text-base max-w-xl mx-auto">
                Keep your personal details updated for better communication and profile management.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {personalFields.map((field) => (
                <div
                  key={field.field}
                  className="relative bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-indigo-300 transition"
                >
                  {renderEditableField(field)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Academic Information */}
        {activeSection === "academic" && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="text-center mb-4 sm:mb-6 md:mb-8 px-2">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                Academic Details
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
                Update your academic information to help us find the best tutors for you
              </p>
            </div>
           
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {academicFields.map((field) => (
                <div
                  key={field.field}
                  className="relative bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-indigo-300 transition"
                >
                  {renderEditableField(field)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preferences */}
        {activeSection === "preferences" && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="text-center mb-4 sm:mb-6 md:mb-8 px-2">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                Learning Preferences
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
                Configure your preferred learning modes and notification settings
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Learning Modes */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-5">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                    Preferred Learning Modes
                  </h3>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      mode: "onlineClass",
                      label: "Online Classes",
                      desc: "Virtual sessions via Zoom, Meet",
                      icon: (
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      ),
                    },
                    {
                      mode: "offlineClass",
                      label: "In-Person Classes",
                      desc: "Face-to-face learning",
                      icon: (
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      ),
                    },
                  ].map(({ mode, label, desc, icon }) => (
                    <label
                      key={mode}
                      className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${profile[mode]
                        ? "border-indigo-300 bg-indigo-50"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${profile[mode]
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-gray-100 text-gray-500"
                            }`}
                        >
                          {icon}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                            {label}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">{desc}</p>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={profile[mode]}
                          onChange={() => handleClassToggle(mode)}
                          className="sr-only"
                        />
                        <div
                          className={`w-10 h-6 rounded-full transition-colors duration-200 ${profile[mode] ? "bg-indigo-600" : "bg-gray-300"
                            }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-1 ${profile[mode] ? "translate-x-5" : "translate-x-1"
                              }`}
                          ></div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-5">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-5 5v-5zM4 17h2v5H4v-5zM4 13v4h16v-4M4 13a2 2 0 01-2-2V7a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                    Notifications
                  </h3>
                </div>
                <label
                  className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${profile.smsAlerts
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${profile.smsAlerts
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-gray-100 text-gray-500"
                        }`}
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm">SMS Alerts</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Receive class notifications via SMS
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={profile.smsAlerts}
                      onChange={async (e) => {
                        const newValue = e.target.checked;
                        setProfile((prev) => ({ ...prev, smsAlerts: newValue }));
                        try {
                          await updateStudentProfile({ sms_alerts: newValue });
                          toast.success("Notification preferences updated");
                        } catch (error) {
                          console.error("Error updating SMS alerts:", error);
                          setProfile(prev => ({ ...prev, smsAlerts: !newValue }));
                          toast.error("Failed to update notification preferences");
                        }
                      }}
                      className="sr-only"
                    />
                    <div
                      className={`w-10 h-6 rounded-full transition-colors duration-200 ${profile.smsAlerts ? "bg-emerald-600" : "bg-gray-300"
                        }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-1 ${profile.smsAlerts ? "translate-x-5" : "translate-x-1"
                          }`}
                      ></div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Whole_Profile_Student;