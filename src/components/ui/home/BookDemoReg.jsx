// // NOTE: This component is a refactor that implements the 9-step flow described
// // in the product spec. Replace/adjust authRepository methods (sendOtp, verifyOtp,
// // preRegisterStudent) with your backend API signatures as required.

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { XMarkIcon } from "@heroicons/react/24/outline";
// import LocationSearch from "./LocationSearch";
// import { authRepository } from "../../../api/repository/auth.repository";
// import Select from "react-select";

// export default function BookDemoReg() {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);
//   const [location, setLocation] = useState(null);

//   const boards = [
//     "CBSE",
//     "ICSE",
//     "State",
//     "International Baccalaureate (IB)",
//     "Cambridge Assessment International Education (CAIE)",
//     "NIOS",
//     "DAV Board",
//     "Pearson Edexcel",
//     "American Curriculum",
//     "Canadian Curriculum",
//     "German Curriculum",
//     "FBISE (United Arab Emirates)",
//     "Ministry of Education, Sri Lanka",
//     "NIE (Sri Lanka)",
//     "Provincial Education Departments (Sri Lanka)",
//     "Pirivenas (Sri Lanka)",
//     "TVEC (Sri Lanka)",
//     "SLIATE (Sri Lanka)",
//     "Ministry of Education, UAE",
//     "French Curriculum (UAE)",
//     "Australian Curriculum (UAE)",
//     "UAE National Curriculum (UAE)",
//     "Other",
//   ];

//   const [board, setBoard] = useState("");
//   const [boardOtherText, setBoardOtherText] = useState("");
//   const AVAILABLE_SUBJECTS = [
//     "Mathematics",
//     "English",
//     "Hindi",
//     "Science",
//     "Physics",
//     "Chemistry",
//     "Biology",
//     "History",
//     "Geography",
//     "Computer Science",
//     "French",
//     "Sanskrit",
//     "Economics",
//   ];

//   const [subjectsQuery, setSubjectsQuery] = useState("");
//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const availabilityOptions = ["Any day", "Weekday", "Weekend"];
//   const [availability, setAvailability] = useState("");
//   const startTimelineOptions = ["Immediately", "Within a month", "Not sure, just exploring options"];
//   const [startTimeline, setStartTimeline] = useState("");
//   const [selectedModes, setSelectedModes] = useState({ online: false, offline: false });
//   const [genderPref, setGenderPref] = useState("No preference");
//   const [form, setForm] = useState({ name: "", email: "", mobile_number: "" });
//   const [otp, setOtp] = useState("");
//   const [otpTimer, setOtpTimer] = useState(0);
//   const [otpSent, setOtpSent] = useState(false);
//   const [tempStudentId, setTempStudentId] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   const isValidMobile = (m) => /^[6-9]\d{9}$/.test(m);
//   const isLettersSpaces = (s) => /^[A-Za-z\s]+$/.test(s);

//   useEffect(() => {
//     let timerInterval = null;
//     if (otpTimer > 0) {
//       timerInterval = setInterval(() => {
//         setOtpTimer((t) => t - 1);
//       }, 1000);
//     }
//     return () => clearInterval(timerInterval);
//   }, [otpTimer]);

//   const handleLocationSelect = (loc) => {
//     setLocation(loc);
//     toast.success(`📍 Location set to: ${loc?.name || "selected"}`, { autoClose: 2000 });
//   };

//   const suggestions = AVAILABLE_SUBJECTS.filter((s) =>
//     s.toLowerCase().includes(subjectsQuery.toLowerCase()) && !selectedSubjects.includes(s)
//   );

//   const addSubject = (s) => {
//     if (!s) return;
//     setSelectedSubjects((prev) => [...prev, s]);
//     setSubjectsQuery("");
//   };

//   const removeSubject = (s) => {
//     setSelectedSubjects((prev) => prev.filter((x) => x !== s));
//   };

//   const toggleMode = (mode) => {
//     setSelectedModes((prev) => ({ ...prev, [mode]: !prev[mode] }));
//     const newValue = !selectedModes[mode];
//     if (newValue) {
//       toast.info(`✅ ${mode === "online" ? "Online" : "Offline"} classes selected`, { autoClose: 1200 });
//     }
//   };

//   const validateStep = (s) => {
//     const e = {};
//     if (s === 1) { if (!location?.place_id) e.location = "Please select a city from suggestions (India only)."; if (location?.country && !/india/i.test(location.country)) e.location = "Please select a city in India."; }

//     if (s === 2) {
//       if (!board) e.board = "Please select a board.";
//       if (board === "Other" && !boardOtherText.trim()) e.boardOtherText = "Please enter board name.";
//     }

//     if (s === 3) {
//       if (selectedSubjects.length === 0) e.subjects = "Please select at least one subject.";
//     }

//     if (s === 4) {
//       if (!availability) e.availability = "Please select availability.";
//     }

//     if (s === 5) {
//       if (!startTimeline) e.startTimeline = "Please select when you plan to start.";
//     }

//     if (s === 6) {
//       if (!selectedModes.online && !selectedModes.offline) e.modes = "Please select at least one class mode.";
//     }

//     if (s === 8) {
//       if (!form.minPrice || form.minPrice < 100)
//         e.minPrice = "Minimum price must be at least ₹100.";
//       if (form.maxPrice && form.maxPrice < form.minPrice)
//         e.maxPrice = "Maximum price must be greater than or equal to minimum price.";
//     }


//     if (s === 9) {
//       if (!otp.trim()) e.otp = "OTP is required.";
//       else if (!/^\d{6}$/.test(otp.trim())) e.otp = "OTP must be exactly 6 digits.";
//     }

//     return e;
//   };

//   const goNext = async () => {
//     const e = validateStep(step);
//     if (Object.keys(e).length > 0) {
//       setErrors(e);
//       toast.warning(Object.values(e)[0]);
//       return;
//     }
//     setErrors({});

//     if (step === 8) {
//       await handleSendOtp();
//       return;
//     }

//     setStep((p) => Math.min(9, p + 1));
//   };

//   const goBack = () => {
//     setErrors({});
//     if (step === 1) {
//       handleClose();
//       return;
//     }
//     setStep((p) => Math.max(1, p - 1));
//   };

//   const handleClose = () => {
//     toast.info("Registration cancelled", { autoClose: 1500 });
//     setTimeout(() => navigate("/"), 1600);
//   };

//   const handleSendOtp = async () => {
//     setLoading(true);
//     try {
//       const payload = {
//         name: form.name.trim(),
//         email: form.email.trim(),
//         mobile_number: form.mobile_number.trim(),
//         location: location
//           ? { place_id: location.place_id, city: location.city, address: location.name }
//           : null,
//         board: board === "Other" ? boardOtherText.trim() : board,
//         subjects: selectedSubjects,
//         availability,
//         startTimeline,
//         class_modes: Object.keys(selectedModes).filter((k) => selectedModes[k]),
//         gender_preference: genderPref,
//       };

//       if (authRepository.sendOtp) {
//         await authRepository.sendOtp({ mobile_number: payload.mobile_number });
//         setOtpSent(true);
//         setOtpTimer(60);
//         setStep(9);
//         toast.success("OTP sent to your mobile number.", { autoClose: 2000 });
//       } else {
//         const res = await authRepository.preRegisterStudent(payload);
//         if (res?.data?.temp_student_id) {
//           setTempStudentId(res.data.temp_student_id);
//           setOtpSent(true);
//           setOtpTimer(60);
//           setStep(9);
//           toast.success("Pre-registration done and OTP sent.", { autoClose: 2000 });
//         } else {
//           throw new Error("Failed to pre-register and send OTP.");
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || "Failed to send OTP. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     const e = validateStep(9);
//     if (Object.keys(e).length > 0) {
//       setErrors(e);
//       toast.warning(Object.values(e)[0]);
//       return;
//     }

//     setLoading(true);
//     try {
//       if (authRepository.verifyOtp) {
//         await authRepository.verifyOtp({ mobile_number: form.mobile_number.trim(), otp: otp.trim() });
//       } else if (authRepository.verifyPreRegisterOtp) {
//         await authRepository.verifyPreRegisterOtp({ temp_student_id: tempStudentId, otp: otp.trim() });
//       } else {
//         await authRepository.verifyOtp?.({ mobile_number: form.mobile_number.trim(), otp: otp.trim() });
//       }

//       toast.success("✅ Mobile verified. Redirecting to available tutors...", { autoClose: 2000 });

//       const params = {
//         city: location?.city,
//         board: board === "Other" ? boardOtherText.trim() : board,
//         subjects: selectedSubjects.join(","),
//         availability,
//         startTimeline,
//         class_modes: Object.keys(selectedModes).filter((k) => selectedModes[k]).join(","),
//         gender_preference: genderPref,
//       };

//       setTimeout(() => {
//         navigate("/available-tutors", { state: params });
//       }, 2200);
//     } catch (err) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || "OTP verification failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendOtp = async () => {
//     if (otpTimer > 0) return;
//     try {
//       setLoading(true);
//       if (authRepository.resendOtp) {
//         await authRepository.resendOtp({ mobile_number: form.mobile_number.trim() });
//       } else if (authRepository.sendOtp) {
//         await authRepository.sendOtp({ mobile_number: form.mobile_number.trim() });
//       } else {
//         if (tempStudentId && authRepository.resendPreRegisterOtp)
//           await authRepository.resendPreRegisterOtp({ temp_student_id: tempStudentId });
//       }
//       setOtpTimer(60);
//       toast.success("OTP resent.", { autoClose: 2000 });
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to resend OTP.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const StepIndicator = () => (
//     <div className="flex justify-center mb-6">
//       <div className="flex space-x-2">
//         {[...Array(9)].map((_, i) => (
//           <div
//             key={i}
//             className={`w-3 h-3 rounded-full ${i + 1 === step ? 'bg-teal-500' : i + 1 < step ? 'bg-teal-300' : 'bg-gray-300'}`}
//           />
//         ))}
//       </div>
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 p-4">
//       <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl relative max-h-[95vh] overflow-y-auto">
//         <button
//           onClick={handleClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
//           aria-label="Close registration"
//         >
//           <XMarkIcon className="w-6 h-6" />
//         </button>

//         <h2 className="text-2xl font-bold text-blue-900 text-center mb-2">Book a Demo Class</h2>
//         <p className="text-sm text-gray-600 text-center mb-4">Step {step} of 9: {[
//           "Select Location",
//           "Choose Education Board",
//           "Select Subjects",
//           "Availability",
//           "Start Timeline",
//           "Class Mode",
//           "Tutor Preference",
//           "Your Details",
//           "Verify OTP"
//         ][step - 1]}</p>


//         <StepIndicator />

//         {/* STEP 1: Location */}
//         {step === 1 && (
//           <div className="bg-white rounded-xl shadow p-6 space-y-6">
//             <div>
//               <label className="block text-sm font-medium mb-2 text-gray-700">Where are you located? *</label>
//               <p className="text-xs text-gray-500 mb-2">We currently serve students across India</p>
//               <LocationSearch
//                 value={location?.name || ""}
//                 placeholder="Start typing your city (India only)..."
//                 onSelect={handleLocationSelect}
//                 hasError={!!errors.location}
//               />
//               {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
//             </div>

//             <div className="flex justify-between mt-6">
//               <button onClick={handleClose} className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
//                 Cancel
//               </button>
//               <button onClick={goNext} className="px-5 py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
//                 Next
//               </button>
//             </div>
//           </div>
//         )}

//         {/* STEP 2: Board */}
//         {/* STEP 2: Board */}
//         {step === 2 && (
//           <div className="bg-white rounded-xl shadow p-6 space-y-6">
//             {/* Heading */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-gray-700">Which board of education are you looking for? *</label>
//               <p className="text-xs text-gray-500 mb-2"> Please select one option from the list below</p>
//             </div>

//             {/* Board List */}
//             <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
//               {boards.map((b) => (
//                 <label
//                   key={b}
//                   className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 transition"
//                 >
//                   <input
//                     type="radio"
//                     name="board"
//                     value={b}
//                     checked={board === b}
//                     onChange={() => setBoard(b)}
//                     className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
//                   />
//                   <span className="text-sm text-gray-700">{b}</span>
//                 </label>
//               ))}
//             </div>


//             {/* Other Board Input */}
//             {board === "Other" && (
//               <input
//                 type="text"
//                 placeholder="Enter board name"
//                 value={boardOtherText}
//                 onChange={(e) => setBoardOtherText(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg p-2 mt-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//               />
//             )}

//             {/* Error messages */}
//             {errors.board && (
//               <p className="text-red-500 text-xs mt-1">{errors.board}</p>
//             )}
//             {errors.boardOtherText && (
//               <p className="text-red-500 text-xs mt-1">{errors.boardOtherText}</p>
//             )}

//             {/* Navigation Buttons */}
//             <div className="flex justify-between pt-4">
//               <button
//                 onClick={goBack}
//                 className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
//               >
//                 Back
//               </button>
//               <button
//                 onClick={goNext}
//                 className={`px-5 py-2.5 rounded-md text-white transition-colors ${board
//                   ? "bg-teal-600 hover:bg-teal-700"
//                   : "bg-gray-300 cursor-not-allowed"
//                   }`}
//                 disabled={!board}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}


//         {/* STEP 3: Subjects */}
//         {step === 3 && (
//           <div className="bg-white rounded-xl shadow p-6 space-y-6">
//             {/* Heading */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-gray-700">Which of the following subjects do you need tuition for? *</label>
//               <p className="text-xs text-gray-500 mb-2"> Select at least one subject</p>
//             </div>

//             {/* Selected Subjects as Chips */}
//             {selectedSubjects.length > 0 && (
//               <div className="flex flex-wrap gap-2">
//                 {selectedSubjects.map((subj) => (
//                   <span
//                     key={subj}
//                     className="bg-teal-100 text-teal-700 text-sm px-3 py-1 rounded-full flex items-center gap-1"
//                   >
//                     {subj}
//                     <button
//                       onClick={() => removeSubject(subj)}
//                       className="text-teal-600 hover:text-teal-800"
//                     >
//                       ✕
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             )}

//             {/* Search Box */}
//             <div>
//               <input
//                 type="text"
//                 value={subjectsQuery}
//                 onChange={(e) => setSubjectsQuery(e.target.value)}
//                 placeholder="Search..."
//                 className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//               />
//             </div>

//             {/* Subjects List */}
//             <div className="max-h-60 overflow-y-auto pr-1">
//               {suggestions
//                 .filter((s) =>
//                   s.toLowerCase().includes(subjectsQuery.toLowerCase().trim())
//                 )
//                 .map((s) => (
//                   <label
//                     key={s}
//                     className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-none"
//                   >
//                     <span className="text-sm text-gray-700">{s}</span>
//                     <input
//                       type="checkbox"
//                       checked={selectedSubjects.includes(s)}
//                       onChange={() => {
//                         if (selectedSubjects.includes(s)) {
//                           removeSubject(s);
//                         } else {
//                           addSubject(s);
//                         }
//                       }}
//                       className="h-4 w-4 text-teal-600 border-gray-300 rounded"
//                     />
//                   </label>
//                 ))}
//             </div>

//             {/* Error Message */}
//             {errors.subjects && (
//               <p className="text-red-500 text-xs">{errors.subjects}</p>
//             )}

//             {/* Navigation Buttons */}
//             <div className="flex justify-between pt-4">
//               <button
//                 onClick={goBack}
//                 className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
//               >
//                 Back
//               </button>
//               <button
//                 onClick={goNext}
//                 className="px-5 py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}


//         {/* STEP 4: Availability */}
//         {step === 4 && (
//           <div className="bg-white rounded-xl shadow p-6 space-y-6">
//             {/* Heading */}
//             <div>
//                <label className="block text-sm font-medium mb-2 text-gray-700"> What days are you generally available to take classes? *</label>
//               <p className="text-xs text-gray-500 mb-2"> This helps us match you with tutors who are available when you are</p>
//             </div>

//             {/* Availability Options */}
//             <div className="grid grid-cols-1 gap-3">
//               {availabilityOptions.map((a) => (
//                 <label
//                   key={a}
//                   className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${availability === a
//                     ? "border-teal-500 bg-teal-50"
//                     : "border-gray-300 hover:border-teal-300"
//                     }`}
//                 >
//                   <input
//                     type="radio"
//                     name="availability"
//                     value={a}
//                     checked={availability === a}
//                     onChange={() => setAvailability(a)}
//                     className="mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500"
//                   />
//                   <span className="text-sm text-gray-700">{a}</span>
//                 </label>
//               ))}
//             </div>

//             {/* Error Message */}
//             {errors.availability && (
//               <p className="text-red-500 text-xs mt-2">{errors.availability}</p>
//             )}

//             {/* Navigation Buttons */}
//             <div className="flex justify-between pt-4">
//               <button
//                 onClick={goBack}
//                 className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
//               >
//                 Back
//               </button>
//               <button
//                 onClick={goNext}
//                 className={`px-5 py-2.5 rounded-md text-white transition-colors ${availability
//                   ? "bg-teal-600 hover:bg-teal-700"
//                   : "bg-gray-300 cursor-not-allowed"
//                   }`}
//                 disabled={!availability}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}


//         {/* STEP 5: Start Timeline */}
//         {step === 5 && (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-2 text-gray-700">When do you plan to start tuition? *</label>
//               <p className="text-xs text-gray-500 mb-3">This helps us understand your urgency</p>

//               <div className="grid grid-cols-1 gap-3">
//                 {startTimelineOptions.map((o) => (
//                   <label
//                     key={o}
//                     className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${startTimeline === o ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-teal-300'}`}
//                   >
//                     <input
//                       type="radio"
//                       name="startTimeline"
//                       checked={startTimeline === o}
//                       onChange={() => setStartTimeline(o)}
//                       className="mr-2 text-teal-600 focus:ring-teal-500"
//                     />
//                     <span className="text-sm">{o}</span>
//                   </label>
//                 ))}
//               </div>

//               {errors.startTimeline && <p className="text-red-500 text-xs mt-2">{errors.startTimeline}</p>}
//             </div>

//             <div className="flex justify-between mt-6">
//               <button onClick={goBack} className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
//                 Back
//               </button>
//               <button onClick={goNext} className="px-5 py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
//                 Next
//               </button>
//             </div>
//           </div>
//         )}

//         {/* STEP 6: Class Mode */}
//         {step === 6 && (
//           <div className="bg-white rounded-xl shadow p-6 space-y-6">
//             <div>
//                <label className="block text-sm font-medium mb-2 text-gray-700"> How would you like to attend your tuition classes? *</label>
//               <p className="text-xs text-gray-500 mb-2">   Select at least one option</p>

//               <div className="space-y-3 mt-4">
//                 {/* Online Classes */}
//                 <label
//                   className={`flex items-center justify-between w-full p-4 border rounded-lg cursor-pointer transition-colors ${selectedModes.online
//                     ? "border-teal-500 bg-teal-50"
//                     : "border-gray-300 hover:border-teal-300"
//                     }`}
//                 >
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={selectedModes.online}
//                       onChange={() => toggleMode("online")}
//                       className="h-4 w-4 text-teal-600 focus:ring-teal-500"
//                     />
//                     <span className="ml-3 text-sm text-gray-700">
//                       Online Classes
//                     </span>
//                   </div>
//                 </label>

//                 {/* Offline Classes */}
//                 <label
//                   className={`flex items-center justify-between w-full p-4 border rounded-lg cursor-pointer transition-colors ${selectedModes.offline
//                     ? "border-teal-500 bg-teal-50"
//                     : "border-gray-300 hover:border-teal-300"
//                     }`}
//                 >
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={selectedModes.offline}
//                       onChange={() => toggleMode("offline")}
//                       className="h-4 w-4 text-teal-600 focus:ring-teal-500"
//                     />
//                     <span className="ml-3 text-sm text-gray-700">
//                       Offline Classes
//                     </span>
//                   </div>
//                 </label>
//               </div>

//               {errors.modes && (
//                 <p className="text-red-500 text-xs mt-2">{errors.modes}</p>
//               )}
//             </div>

//             {/* Navigation Buttons */}
//             <div className="flex justify-between mt-6">
//               <button
//                 onClick={goBack}
//                 className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
//               >
//                 Back
//               </button>
//               <button
//                 onClick={goNext}
//                 disabled={!selectedModes.online && !selectedModes.offline}
//                 className={`px-5 py-2.5 rounded-md text-white transition-colors ${selectedModes.online || selectedModes.offline
//                   ? "bg-teal-600 hover:bg-teal-700"
//                   : "bg-gray-300 cursor-not-allowed"
//                   }`}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}

//         {/* STEP 7: Tutor Gender Preference (optional) */}
//         {step === 7 && (
//           <div className="bg-white rounded-xl shadow p-6 space-y-6">
//             {/* Heading */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-gray-700">
//                 Do you have any tutor gender preference? *
//               </label>
//               <p className="text-xs text-gray-500 mb-3">
//                Please select one option 
//               </p>

//               {/* Options (vertical) */}
//               <div className="flex flex-col gap-3">
//                 {["Female", "Male", "No preference"].map((g) => (
//                   <label
//                     key={g}
//                     className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${genderPref === g
//                       ? "border-teal-500 bg-teal-50"
//                       : "border-gray-300 hover:border-teal-300"
//                       }`}
//                   >
//                     <input
//                       type="radio"
//                       name="genderPref"
//                       value={g}
//                       checked={genderPref === g}
//                       onChange={() => setGenderPref(g)}
//                       className="mr-2 text-teal-600 focus:ring-teal-500"
//                     />
//                     <span className="text-sm">{g}</span>
//                   </label>
//                 ))}
//               </div>

//               {/* Optional error message (if needed) */}
//               {errors.genderPref && (
//                 <p className="text-red-500 text-xs mt-2">{errors.genderPref}</p>
//               )}
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-between mt-6">
//               <button
//                 onClick={goBack}
//                 className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
//               >
//                 Back
//               </button>
//               <button
//                 onClick={goNext}
//                 className="px-5 py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
//               >
//                 Nexts
//               </button>
//             </div>
//           </div>
//         )}

//         {/* STEP 8: Pricing Preference */}
//        {/* STEP 8: Pricing Preference */}
// {step === 8 && (
//   <div className="bg-white rounded-xl shadow p-6 space-y-6">
//     {/* Heading */}
//     <div>
//       <label className="block text-sm font-medium mb-2 text-gray-700">
//         Do you have any specific pricing preference? *
//       </label>
//       <p className="text-xs text-gray-500 mb-2">
//         Please specify your budget range for tuition classes
//       </p>
//     </div>

//     <div className="space-y-4">
//       {/* Minimum Price */}
//       <div>
//         <label className="block text-sm font-medium mb-1">
//           Minimum Price (₹) <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="number"
//           min={100}
//           value={form.minPrice || ""}
//           onChange={(e) =>
//             setForm({
//               ...form,
//               minPrice: Math.max(100, Number(e.target.value)),
//             })
//           }
//           placeholder="100"
//           className={`w-full border ${
//             errors.minPrice ? "border-red-500" : "border-gray-300"
//           } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500`}
//         />
//         {errors.minPrice && (
//           <p className="text-red-500 text-xs">{errors.minPrice}</p>
//         )}
//       </div>

//       {/* Maximum Price */}
//       <div>
//         <label className="block text-sm font-medium mb-1">
//           Maximum Price (₹){" "}
//           <span className="text-gray-400 text-xs">(optional)</span>
//         </label>
//         <input
//           type="number"
//           value={form.maxPrice || ""}
//           onChange={(e) =>
//             setForm({
//               ...form,
//               maxPrice: e.target.value ? Number(e.target.value) : "",
//             })
//           }
//           placeholder="Enter maximum budget (optional)"
//           className={`w-full border ${
//             errors.maxPrice ? "border-red-500" : "border-gray-300"
//           } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500`}
//         />
//         {errors.maxPrice && (
//           <p className="text-red-500 text-xs">{errors.maxPrice}</p>
//         )}
//       </div>
//     </div>

//     {/* Navigation Buttons */}
//     <div className="flex justify-between mt-6">
//       <button
//         onClick={goBack}
//         className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
//       >
//         Back
//       </button>
//       <button
//         onClick={goNext}
//         className="px-5 py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
//       >
//         Next
//       </button>
//     </div>
//   </div>
// )}

//         {/* STEP 9: Sign Up + OTP Verification */}
//         {step === 9 && (
//           <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
//             {/* Title */}
//             <h2 className="text-xl font-semibold text-center mb-6">
//               Sign-up to Book a Free Demo Class
//             </h2>

//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleSendOtp();
//               }}
//               className="space-y-4"
//             >
//               {/* Full Name */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Full Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={form.name}
//                   onChange={(e) => setForm({ ...form, name: e.target.value })}
//                   placeholder="Enter your full name"
//                   className={`w-full border ${errors.name ? "border-red-500" : "border-gray-300"
//                     } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500`}
//                 />
//                 {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Email <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={form.email}
//                   onChange={(e) => setForm({ ...form, email: e.target.value })}
//                   placeholder="you@example.com"
//                   className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"
//                     } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500`}
//                 />
//                 {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
//               </div>

//               {/* Mobile Number */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Mobile Number <span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex gap-2">
//                   <select className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
//                     <option>India (+91)</option>
//                   </select>
//                   <input
//                     type="tel"
//                     name="mobile_number"
//                     value={form.mobile_number}
//                     onChange={(e) =>
//                       setForm({
//                         ...form,
//                         mobile_number: e.target.value.replace(/[^0-9]/g, ""),
//                       })
//                     }
//                     maxLength={10}
//                     placeholder="10-digit mobile number"
//                     className={`flex-1 border ${errors.mobile_number ? "border-red-500" : "border-gray-300"
//                       } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500`}
//                   />
//                 </div>
//                 {errors.mobile_number && (
//                   <p className="text-red-500 text-xs">{errors.mobile_number}</p>
//                 )}
//               </div>

//               {/* OTP Section */}
//               {otpSent && (
//                 <div className="mt-4">
//                   <label className="block text-sm font-medium mb-2">
//                     Verify Your Mobile Number
//                   </label>
//                   <p className="text-xs text-gray-600 mb-2">
//                     We sent a 6-digit OTP to <strong>{form.mobile_number}</strong>
//                   </p>
//                   <input
//                     type="text"
//                     maxLength={6}
//                     value={otp}
//                     onChange={(e) =>
//                       setOtp(e.target.value.replace(/[^0-9]/g, ""))
//                     }
//                     placeholder="Enter OTP"
//                     className={`w-full border ${errors.otp ? "border-red-500" : "border-gray-300"
//                       } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500`}
//                   />
//                   {errors.otp && <p className="text-red-500 text-xs">{errors.otp}</p>}

//                   <div className="flex items-center justify-between mt-3">
//                     <button
//                       type="button"
//                       onClick={handleVerifyOtp}
//                       disabled={loading}
//                       className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
//                     >
//                       {loading ? "Verifying..." : "Verify & Continue"}
//                     </button>
//                     <div className="text-sm text-gray-600">
//                       {otpTimer > 0 ? (
//                         <span>Resend OTP in {otpTimer}s</span>
//                       ) : (
//                         <button
//                           type="button"
//                           onClick={handleResendOtp}
//                           className="text-teal-600 hover:underline"
//                         >
//                           Didn’t receive? Resend OTP
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Buttons */}
//               <div className="flex justify-between pt-4">
//                 <button
//                   type="button"
//                   onClick={goBack}
//                   className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
//                 >
//                   Back
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-5 py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
//                 >
//                   {loading ? "Sending..." : "Submit"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}


//         <ToastContainer position="top-right" autoClose={2500} />
//       </div>
//     </div>
//   );
// }

// NOTE: This component is a refactor that implements the 9-step flow described
// in the product spec. Replace/adjust authRepository methods (sendOtp, verifyOtp,
// preRegisterStudent) with your backend API signatures as required.
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { XMarkIcon } from "@heroicons/react/24/outline";
import LocationSearch from "./LocationSearch";
import { authRepository } from "../../../api/repository/auth.repository";

export default function BookDemoReg() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState(null);

  const boards = [
    "CBSE",
    "ICSE",
    "State",
    "International Baccalaureate (IB)",
    "Cambridge Assessment International Education (CAIE)",
    "NIOS",
    "DAV Board",
    "Pearson Edexcel",
    "American Curriculum",
    "Canadian Curriculum",
    "German Curriculum",
    "FBISE (United Arab Emirates)",
    "Ministry of Education, Sri Lanka",
    "NIE (Sri Lanka)",
    "Provincial Education Departments (Sri Lanka)",
    "Pirivenas (Sri Lanka)",
    "TVEC (Sri Lanka)",
    "SLIATE (Sri Lanka)",
    "Ministry of Education, UAE",
    "French Curriculum (UAE)",
    "Australian Curriculum (UAE)",
    "UAE National Curriculum (UAE)",
    "Other",
  ];

  const [board, setBoard] = useState("");
  const [boardOtherText, setBoardOtherText] = useState("");
  const AVAILABLE_SUBJECTS = [
    "Mathematics",
    "English",
    "Hindi",
    "Science",
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Geography",
    "Computer Science",
    "French",
    "Sanskrit",
    "Economics",
  ];

  const [subjectsQuery, setSubjectsQuery] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const availabilityOptions = ["Any day", "Weekday", "Weekend"];
  const [availability, setAvailability] = useState("");
  const startTimelineOptions = ["Immediately", "Within a month", "Not sure, just exploring options"];
  const [startTimeline, setStartTimeline] = useState("");
  const [selectedModes, setSelectedModes] = useState({ online: false, offline: false });
  const [genderPref, setGenderPref] = useState("No preference");
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile_number: "",
    minPrice: "",
    maxPrice: ""
  });
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [tempStudentId, setTempStudentId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidMobile = (m) => /^[6-9]\d{9}$/.test(m);
  const isLettersSpaces = (s) => /^[A-Za-z\s]+$/.test(s);

  useEffect(() => {
    let timerInterval = null;
    if (otpTimer > 0) {
      timerInterval = setInterval(() => {
        setOtpTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [otpTimer]);

  const handleLocationSelect = (loc) => {
    setLocation(loc);
    // Clear location error when a location is selected
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: "" }));
    }
    toast.success(`📍 Location set to: ${loc?.name || "selected"}`, { autoClose: 2000 });
  };

  const suggestions = AVAILABLE_SUBJECTS.filter((s) =>
    s.toLowerCase().includes(subjectsQuery.toLowerCase()) && !selectedSubjects.includes(s)
  );

  const addSubject = (s) => {
    if (!s) return;
    setSelectedSubjects((prev) => [...prev, s]);
    setSubjectsQuery("");
    // Clear subjects error when a subject is added
    if (errors.subjects) {
      setErrors(prev => ({ ...prev, subjects: "" }));
    }
  };

  const removeSubject = (s) => {
    setSelectedSubjects((prev) => prev.filter((x) => x !== s));
  };

  const toggleMode = (mode) => {
    setSelectedModes((prev) => ({ ...prev, [mode]: !prev[mode] }));
    // Clear modes error when a mode is selected
    if (errors.modes) {
      setErrors(prev => ({ ...prev, modes: "" }));
    }
    const newValue = !selectedModes[mode];
    if (newValue) {
      toast.info(`✅ ${mode === "online" ? "Online" : "Offline"} classes selected`, { autoClose: 1200 });
    }
  };

  const validateStep = (s) => {
    const e = {};

    if (s === 1) {
      if (!location?.place_id) e.location = "Please select a city from suggestions (India only).";
      if (location?.country && !/india/i.test(location.country)) e.location = "Please select a city in India.";
    }

    if (s === 2) {
      if (!board) e.board = "Please select a board.";
      if (board === "Other" && !boardOtherText.trim()) e.boardOtherText = "Please enter board name.";
    }

    if (s === 3) {
      if (selectedSubjects.length === 0) e.subjects = "Please select at least one subject.";
    }

    if (s === 4) {
      if (!availability) e.availability = "Please select availability.";
    }

    if (s === 5) {
      if (!startTimeline) e.startTimeline = "Please select when you plan to start.";
    }

    if (s === 6) {
      if (!selectedModes.online && !selectedModes.offline) e.modes = "Please select at least one class mode.";
    }

    if (s === 7) {
      if (!genderPref) e.genderPref = "Please select a gender preference.";
    }

    if (s === 8) {
      if (!form.minPrice || form.minPrice < 100)
        e.minPrice = "Minimum price must be at least ₹100.";
      if (form.maxPrice && form.maxPrice < form.minPrice)
        e.maxPrice = "Maximum price must be greater than or equal to minimum price.";
    }

    if (s === 9) {
      // Normalize inputs
      const name = (form.name || "").trim();
      const email = (form.email || "").trim();
      const mobile = (form.mobile_number || "").trim();
      const minPrice = Number(form.minPrice);
      const hasMaxPrice =
        form.maxPrice !== undefined && form.maxPrice !== null && form.maxPrice !== "";
      const maxPrice = hasMaxPrice ? Number(form.maxPrice) : null;
      const otpTrim = (otp || "").trim();

      // Name
      if (!name) e.name = "Full name is required.";
      else if (!isLettersSpaces(name))
        e.name = "Name can only contain letters and spaces.";

      // Email
      if (!email) e.email = "Email is required.";
      else if (!isValidEmail(email))
        e.email = "Please enter a valid email address.";

      // Mobile (uses backend field `mobile_number`)
      if (!mobile) e.mobile_number = "Mobile number is required.";
      else if (!isValidMobile(mobile))
        e.mobile_number = "Please enter a valid 10-digit mobile number.";

      // Pricing
      if (!Number.isFinite(minPrice) || minPrice < 100)
        e.minPrice = "Minimum price must be at least ₹100.";

      if (hasMaxPrice) {
        if (!Number.isFinite(maxPrice))
          e.maxPrice = "Please enter a valid number for maximum price.";
        else if (maxPrice < minPrice)
          e.maxPrice =
            "Maximum price must be greater than or equal to minimum price.";
      }

      // OTP
      if (!otpTrim) e.otp = "OTP is required.";
      else if (!/^\d{6}$/.test(otpTrim))
        e.otp = "OTP must be exactly 6 digits.";
    }

    return e;
  };

  const goNext = async () => {
    const e = validateStep(step);
    if (Object.keys(e).length > 0) {
      setErrors(e);
      toast.warning(Object.values(e)[0]);
      return;
    }
    setErrors({});

    if (step === 8) {
      await handleSendOtp();
      return;
    }

    setStep((p) => Math.min(9, p + 1));
  };

  const goBack = () => {
    setErrors({});
    if (step === 1) {
      handleClose();
      return;
    }
    setStep((p) => Math.max(1, p - 1));
  };

  const handleClose = () => {
    toast.info("Registration cancelled", { autoClose: 1500 });
    setTimeout(() => navigate("/"), 1600);
  };

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        mobile_number: form.mobile_number.trim(),
        location: location
          ? { place_id: location.place_id, city: location.city, address: location.name }
          : null,
        board: board === "Other" ? boardOtherText.trim() : board,
        subjects: selectedSubjects,
        availability,
        startTimeline,
        class_modes: Object.keys(selectedModes).filter((k) => selectedModes[k]),
        gender_preference: genderPref,
        min_price: form.minPrice,
        max_price: form.maxPrice || null,
      };

      if (authRepository.sendOtp) {
        await authRepository.sendOtp({ mobile_number: payload.mobile_number });
        setOtpSent(true);
        setOtpTimer(60);
        setStep(9);
        toast.success("OTP sent to your mobile number.", { autoClose: 2000 });
      } else {
        const res = await authRepository.preRegisterStudent(payload);
        if (res?.data?.temp_student_id) {
          setTempStudentId(res.data.temp_student_id);
          setOtpSent(true);
          setOtpTimer(60);
          setStep(9);
          toast.success("Pre-registration done and OTP sent.", { autoClose: 2000 });
        } else {
          throw new Error("Failed to pre-register and send OTP.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const e = validateStep(9);
    if (Object.keys(e).length > 0) {
      setErrors(e);
      toast.warning(Object.values(e)[0]);
      return;
    }

    setLoading(true);
    try {
      if (authRepository.verifyOtp) {
        await authRepository.verifyOtp({ mobile_number: form.mobile_number.trim(), otp: otp.trim() });
      } else if (authRepository.verifyPreRegisterOtp) {
        await authRepository.verifyPreRegisterOtp({ temp_student_id: tempStudentId, otp: otp.trim() });
      } else {
        await authRepository.verifyOtp?.({ mobile_number: form.mobile_number.trim(), otp: otp.trim() });
      }

      toast.success("✅ Mobile verified. Redirecting to available tutors...", { autoClose: 2000 });

      const params = {
        city: location?.city,
        board: board === "Other" ? boardOtherText.trim() : board,
        subjects: selectedSubjects.join(","),
        availability,
        startTimeline,
        class_modes: Object.keys(selectedModes).filter((k) => selectedModes[k]).join(","),
        gender_preference: genderPref,
        min_price: form.minPrice,
        max_price: form.maxPrice || "",
      };

      setTimeout(() => {
        navigate("/available-tutors", { state: params });
      }, 2200);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpTimer > 0) return;
    try {
      setLoading(true);
      if (authRepository.resendOtp) {
        await authRepository.resendOtp({ mobile_number: form.mobile_number.trim() });
      } else if (authRepository.sendOtp) {
        await authRepository.sendOtp({ mobile_number: form.mobile_number.trim() });
      } else {
        if (tempStudentId && authRepository.resendPreRegisterOtp)
          await authRepository.resendPreRegisterOtp({ temp_student_id: tempStudentId });
      }
      setOtpTimer(60);
      toast.success("OTP resent.", { autoClose: 2000 });
    } catch (err) {
      console.error(err);
      toast.error("Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex justify-center mb-6">
      <div className="flex space-x-2">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${i + 1 === step ? 'bg-teal-500' : i + 1 < step ? 'bg-teal-300' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl relative max-h-[95vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
          aria-label="Close registration"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-blue-900 text-center mb-2">Book a Demo Class</h2>
        <p className="text-sm text-gray-600 text-center mb-4">Step {step} of 9: {[
          "Select Location",
          "Choose Education Board",
          "Select Subjects",
          "Availability",
          "Start Timeline",
          "Class Mode",
          "Tutor Preference",
          "Pricing Preference",
          "Your Details"
        ][step - 1]}</p>

        <StepIndicator />

        {/* STEP 1: Location */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Where are you located? *</label>
              <p className="text-xs text-gray-500 mb-2">We currently serve students across India</p>
              <LocationSearch
                value={location?.name || ""}
                placeholder="Start typing your city (India only)..."
                onSelect={handleLocationSelect}
                hasError={!!errors.location}
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={handleClose} className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                Cancel
              </button>
              <button onClick={goNext} className="px-5 py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Board */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Which board of education are you looking for? *</label>
              <p className="text-xs text-gray-500 mb-2">Please select one option from the list below</p>
            </div>

            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {boards.map((b) => (
                <label
                  key={b}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 transition"
                >
                  <input
                    type="radio"
                    name="board"
                    value={b}
                    checked={board === b}
                    onChange={() => {
                      setBoard(b);
                      if (errors.board) setErrors(prev => ({ ...prev, board: "" }));
                    }}
                    className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">{b}</span>
                </label>
              ))}
            </div>

            {board === "Other" && (
              <div>
                <input
                  type="text"
                  placeholder="Enter board name"
                  value={boardOtherText}
                  onChange={(e) => {
                    setBoardOtherText(e.target.value);
                    if (errors.boardOtherText) setErrors(prev => ({ ...prev, boardOtherText: "" }));
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                {errors.boardOtherText && <p className="text-red-500 text-xs mt-1">{errors.boardOtherText}</p>}
              </div>
            )}

            {errors.board && <p className="text-red-500 text-xs mt-1">{errors.board}</p>}

            <div className="flex justify-between pt-4">
              <button onClick={goBack} className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                Back
              </button>
              <button onClick={goNext} className="px-5 py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Subjects */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Which of the following subjects do you need tuition for? *</label>
              <p className="text-xs text-gray-500 mb-2">Select at least one subject</p>
            </div>

            {selectedSubjects.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedSubjects.map((subj) => (
                  <span
                    key={subj}
                    className="bg-teal-100 text-teal-700 text-sm px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    {subj}
                    <button
                      onClick={() => removeSubject(subj)}
                      className="text-teal-600 hover:text-teal-800"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div>
              <input
                type="text"
                value={subjectsQuery}
                onChange={(e) => setSubjectsQuery(e.target.value)}
                placeholder="Search..."
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="max-h-60 overflow-y-auto pr-1">
              {suggestions
                .filter((s) =>
                  s.toLowerCase().includes(subjectsQuery.toLowerCase().trim())
                )
                .map((s) => (
                  <label
                    key={s}
                    className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-none"
                  >
                    <span className="text-sm text-gray-700">{s}</span>
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(s)}
                      onChange={() => {
                        if (selectedSubjects.includes(s)) {
                          removeSubject(s);
                        } else {
                          addSubject(s);
                        }
                      }}
                      className="h-4 w-4 text-teal-600 border-gray-300 rounded"
                    />
                  </label>
                ))}
            </div>

            {errors.subjects && <p className="text-red-500 text-xs">{errors.subjects}</p>}

            <div className="flex justify-between pt-4">
              <button onClick={goBack} className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                Back
              </button>
              <button onClick={goNext} className="px-5 py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Availability */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">What days are you generally available to take classes? *</label>
              <p className="text-xs text-gray-500 mb-2">This helps us match you with tutors who are available when you are</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {availabilityOptions.map((a) => (
                <label
                  key={a}
                  className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${availability === a
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-300 hover:border-teal-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="availability"
                    value={a}
                    checked={availability === a}
                    onChange={() => {
                      setAvailability(a);
                      if (errors.availability) setErrors(prev => ({ ...prev, availability: "" }));
                    }}
                    className="mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">{a}</span>
                </label>
              ))}
            </div>

            {errors.availability && <p className="text-red-500 text-xs mt-2">{errors.availability}</p>}

            <div className="flex justify-between pt-4">
              <button onClick={goBack} className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                Back
              </button>
              <button onClick={goNext} className="px-5 py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Start Timeline */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">When do you plan to start tuition? *</label>
              <p className="text-xs text-gray-500 mb-3">This helps us understand your urgency</p>

              <div className="grid grid-cols-1 gap-3">
                {startTimelineOptions.map((o) => (
                  <label
                    key={o}
                    className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${startTimeline === o ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-teal-300'}`}
                  >
                    <input
                      type="radio"
                      name="startTimeline"
                      checked={startTimeline === o}
                      onChange={() => {
                        setStartTimeline(o);
                        if (errors.startTimeline) setErrors(prev => ({ ...prev, startTimeline: "" }));
                      }}
                      className="mr-2 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm">{o}</span>
                  </label>
                ))}
              </div>

              {errors.startTimeline && <p className="text-red-500 text-xs mt-2">{errors.startTimeline}</p>}
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={goBack} className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                Back
              </button>
              <button onClick={goNext} className="px-5 py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Class Mode */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">How would you like to attend your tuition classes? *</label>
              <p className="text-xs text-gray-500 mb-2">Select at least one option</p>

              <div className="space-y-3 mt-4">
                <label
                  className={`flex items-center justify-between w-full p-4 border rounded-lg cursor-pointer transition-colors ${selectedModes.online
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-300 hover:border-teal-300"
                    }`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedModes.online}
                      onChange={() => toggleMode("online")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      Online Classes
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-center justify-between w-full p-4 border rounded-lg cursor-pointer transition-colors ${selectedModes.offline
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-300 hover:border-teal-300"
                    }`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedModes.offline}
                      onChange={() => toggleMode("offline")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      Offline Classes
                    </span>
                  </div>
                </label>
              </div>

              {errors.modes && <p className="text-red-500 text-xs mt-2">{errors.modes}</p>}
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={goBack} className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                Back
              </button>
              <button
                onClick={goNext}
                disabled={!selectedModes.online && !selectedModes.offline}
                className={`px-5 py-2.5 rounded-md text-white transition-colors ${selectedModes.online || selectedModes.offline
                  ? "bg-teal-600 hover:bg-teal-700"
                  : "bg-gray-300 cursor-not-allowed"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: Tutor Gender Preference */}
        {step === 7 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Do you have any tutor gender preference? *
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Please select one option
              </p>

              <div className="flex flex-col gap-3">
                {["Female", "Male", "No preference"].map((g) => (
                  <label
                    key={g}
                    className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${genderPref === g
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-300 hover:border-teal-300"
                      }`}
                  >
                    <input
                      type="radio"
                      name="genderPref"
                      value={g}
                      checked={genderPref === g}
                      onChange={() => {
                        setGenderPref(g);
                        if (errors.genderPref) setErrors(prev => ({ ...prev, genderPref: "" }));
                      }}
                      className="mr-2 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm">{g}</span>
                  </label>
                ))}
              </div>

              {errors.genderPref && <p className="text-red-500 text-xs mt-2">{errors.genderPref}</p>}
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={goBack} className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                Back
              </button>
              <button onClick={goNext} className="px-5 py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: Pricing Preference */}
        {step === 8 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                What is your budget preference? *
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Please provide minimum and maximum (optional) price per hour
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={form.minPrice}
                    onChange={(e) => setForm({ ...form, minPrice: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  {errors.minPrice && (
                    <p className="text-red-500 text-xs mt-1">{errors.minPrice}</p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Max ₹ (optional)"
                    value={form.maxPrice}
                    onChange={(e) => setForm({ ...form, maxPrice: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  {errors.maxPrice && (
                    <p className="text-red-500 text-xs mt-1">{errors.maxPrice}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={goBack} className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                Back
              </button>
              <button onClick={goNext} className="px-5 py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}


        {/* STEP 9: Sign Up + OTP Verification */}
{step === 9 && (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700">Full Name *</label>
      <input
        type="text"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500"
      />
      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
    </div>

    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700">Email *</label>
      <input
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500"
      />
      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
    </div>

    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700">Mobile Number *</label>
      <input
        type="tel"
        value={form.mobile_number}
        onChange={(e) => setForm({ ...form, mobile_number: e.target.value })}
        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500"
      />
      {errors.mobile_number && <p className="text-red-500 text-xs mt-1">{errors.mobile_number}</p>}
    </div>

    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700">Enter OTP *</label>
      <div className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={otpTimer > 0}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          {otpTimer > 0 ? `Resend (${otpTimer})` : "Resend"}
        </button>
      </div>
      {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp}</p>}
    </div>

    <div className="flex justify-between mt-6">
      <button onClick={goBack} className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
        Back
      </button>
      <button
        onClick={handleVerifyOtp}
        disabled={loading}
        className="px-5 py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
      >
        {loading ? "Verifying..." : "Verify & Continue"}
      </button>
    </div>
  </div>
)}


        <ToastContainer position="top-right" autoClose={2500} />
      </div>
    </div>
  );
}