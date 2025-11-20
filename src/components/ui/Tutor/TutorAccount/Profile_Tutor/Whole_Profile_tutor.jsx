import React, { useState, useEffect, useRef } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  getProfile,
  updateTutorProfile,
  updateUserContact,
  updateLocation,
  uploadProfilePhoto,
  uploadTutorDocuments,
  deleteProfilePhoto,
  deleteTutorDocument,
} from "../../../../../api/repository/profile.repository";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LocationSearch from "./LocationSearch";
import { apiClient } from "../../../../../api/apiclient";

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateMobile = (mobile) => /^[0-9]{10}$/.test(mobile);

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

// Multi-select component for boards
const MultiSelectBoard = ({ selectedBoards, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customBoard, setCustomBoard] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleBoard = (board) => {
    if (selectedBoards.includes(board)) {
      onChange(selectedBoards.filter(b => b !== board));
    } else {
      onChange([...selectedBoards, board]);
    }
  };

  const addCustomBoard = () => {
    if (customBoard.trim() && !selectedBoards.includes(customBoard.trim())) {
      onChange([...selectedBoards, customBoard.trim()]);
      setCustomBoard("");
      setIsOpen(false);
    }
  };

  const removeBoard = (boardToRemove) => {
    onChange(selectedBoards.filter(board => board !== boardToRemove));
  };

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleDone = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="w-full border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-3 py-2 rounded-lg transition-all duration-200 outline-none text-gray-900 text-sm min-h-[42px] cursor-pointer flex flex-wrap gap-1"
        onClick={handleDropdownToggle}
      >
        {selectedBoards.length === 0 ? (
          <span className="text-gray-400">Select boards</span>
        ) : (
          selectedBoards.map((board) => (
            <span 
              key={board} 
              className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs flex items-center gap-1"
            >
              {board}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeBoard(board);
                }}
                className="text-indigo-600 hover:text-indigo-800 text-xs font-bold"
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2">
            {options.map((option) => (
              <label 
                key={option} 
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={selectedBoards.includes(option)}
                  onChange={() => toggleBoard(option)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
            
            <div className="p-2 border-t border-gray-200 mt-2">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={customBoard}
                  onChange={(e) => setCustomBoard(e.target.value)}
                  placeholder="Enter custom board"
                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomBoard();
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addCustomBoard();
                  }}
                  disabled={!customBoard.trim()}
                  className="bg-indigo-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50 hover:bg-indigo-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="p-2 border-t border-gray-200">
              <button
                type="button"
                onClick={handleDone}
                className="w-full bg-indigo-600 text-white py-2 rounded text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// OTP Verification Modal Component
const OtpVerificationModal = ({ 
  isOpen, 
  onClose, 
  field, 
  value, 
  onVerify 
}) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      await apiClient.post("/profile/field/request", {
        action: "request",
        field: field === "mobile" ? "mobile_number" : "email",
        value: value
      });
      toast.success(`OTP sent to your ${field}`);
      setCountdown(60); // 60 seconds countdown
    } catch (error) {
      toast.error(`Failed to send OTP: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      await apiClient.post("/profile/field/request", {
        action: "request",
        field: field === "mobile" ? "mobile_number" : "email",
        value: value
      });
      toast.success(`OTP resent to your ${field}`);
      setCountdown(60);
    } catch (error) {
      toast.error(`Failed to resend OTP: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post("/profile/field/verify", {
        action: "verify",
        field: field === "mobile" ? "mobile_number" : "email",
        value: value,
        otp: otp
      });
      
      toast.success(`${field === "email" ? "Email" : "Mobile number"} verified successfully!`);
      onVerify();
      onClose();
    } catch (error) {
      toast.error(`Verification failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleSendOtp();
      setOtp("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Verify {field === "email" ? "Email" : "Mobile Number"}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4">
          We've sent a 6-digit verification code to your {field}: <strong>{value}</strong>
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              className="w-full border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-3 py-2 rounded-lg transition-all duration-200 outline-none text-gray-900 text-sm"
              maxLength={6}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleVerify}
              disabled={isLoading || otp.length !== 6}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
            
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
          </div>

          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm text-gray-500">
                Resend OTP in {countdown} seconds
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium disabled:opacity-50"
              >
                {isResending ? "Resending..." : "Resend OTP"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Whole_Profile_tutor = () => {
  const [profile, setProfile] = useState(null);
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [photoPreview, setPhotoPreview] = useState("");
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [isDeletingPhoto, setIsDeletingPhoto] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [deletingDocs, setDeletingDocs] = useState({});
  
  // OTP Verification State - MOVED INSIDE THE COMPONENT FUNCTION
  const [otpModal, setOtpModal] = useState({
    isOpen: false,
    field: null,
    value: null
  });

  // HeroSection states
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [error, setError] = useState("");
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const classDropdownRef = useRef(null);
  const subjectDropdownRef = useRef(null);

  // Define custom order for categories
  const categoryOrder = [
    "School Tuition",
    "Pre-Primary",
    "Primary School (1-5)",
    "Secondary School (6-10)",
    "Higher Secondary - Science (11-12)",
    "Higher Secondary - Commerce (11-12)",
    "Higher Secondary - Arts (11-12)",
    "Engineering - Computer Science",
    "Engineering - Mechanical",
    "Engineering - Electrical",
    "Engineering - Civil",
    "Medical - MBBS",
    "Medical - BDS",
    "Medical - Nursing",
    "Commerce - B.Com",
    "Management - MBA",
    "Arts - English Literature",
    "Law - LLB",
    "IT Certifications",
    "Programming Languages",
    "Web Technologies",
    "Database Technologies",
    "Cloud & DevOps",
    "Foreign Languages",
    "Indian Languages",
    "Competitive Exams - Engineering",
    "Competitive Exams - Medical",
    "Competitive Exams - Management",
    "Government Exams",
    "Vocational Courses",
    "Soft Skills"
  ];

  // Fetch classes from API on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/subjects");
        setClasses(response.data.classes || []);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setError("Failed to load classes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Fetch profile data
  const fetchProfileData = async () => {
    try {
      const data = await getProfile();

      // Helper function to format languages
      const formatLanguages = (languages) => {
        if (!languages) return "";
       
        if (typeof languages === 'string' && !languages.includes('{')) {
          return languages;
        }
       
        if (typeof languages === 'string' && languages.includes('{')) {
          try {
            const parsed = JSON.parse(languages);
            if (parsed.name) {
              return `${parsed.name}${parsed.proficiency ? ` (${parsed.proficiency})` : ''}`;
            }
          } catch (e) {
            const nameMatch = languages.match(/"name":"([^"]+)"/);
            const proficiencyMatch = languages.match(/"proficiency":"([^"]+)"/);
            if (nameMatch) {
              const name = nameMatch[1];
              const proficiency = proficiencyMatch ? proficiencyMatch[1] : '';
              return `${name}${proficiency ? ` (${proficiency})` : ''}`;
            }
            return languages;
          }
        }
       
        if (Array.isArray(languages)) {
          return languages.map(lang => {
            if (typeof lang === 'object' && lang.name) {
              return `${lang.name}${lang.proficiency ? ` (${lang.proficiency})` : ''}`;
            }
            if (typeof lang === 'string' && lang.includes('{')) {
              try {
                const parsed = JSON.parse(lang);
                return `${parsed.name}${parsed.proficiency ? ` (${parsed.proficiency})` : ''}`;
              } catch (e) {
                return lang;
              }
            }
            return lang;
          }).join(", ");
        }
       
        if (typeof languages === 'object' && languages.name) {
          return `${languages.name}${languages.proficiency ? ` (${languages.proficiency})` : ''}`;
        }
       
        return languages;
      };

      // Initialize boards as array
      let boardsArray = [];
      if (data.board) {
        if (Array.isArray(data.board)) {
          boardsArray = data.board;
        } else if (typeof data.board === 'string') {
          boardsArray = data.board.split(",").map(b => b.trim()).filter(b => b);
        }
      }

      // Initialize uploaded documents from profile data
      const docs = data.documents || {};
      const uploadedDocs = Object.entries(docs).map(([key, doc]) => ({
        id: key,
        name: doc.name || `Document ${key}`,
        url: doc.url,
        type: key
      }));

      setProfile({
        photo: data?.profile_photo
          ? `${data.profile_photo}?t=${Date.now()}`
          : "/default/photo.jpg",
        name: data.name || "",
        gender: data.gender || "",
        email: data.User?.email || "",
        mobile: data.User?.mobile_number || "",
        subjects: Array.isArray(data.subjects) ? data.subjects.join(", ") : (data.subjects || ""),
        classes: Array.isArray(data.classes) ? data.classes.join(", ") : (data.classes || ""),
        degrees: Array.isArray(data.degrees) ? data.degrees.join(", ") : (data.degrees || ""),
        board: boardsArray.join(", "),
        location: data.Location?.city || "",
        country: data.Location?.country || "India",
        availability: Array.isArray(data.availability) ? data.availability.join(", ") : (data.availability || ""),
        onlineClass: data?.teaching_modes?.includes("Online") || false,
        offlineClass: data?.teaching_modes?.includes("Offline") || false,
        smsAlerts: data?.sms_alerts ?? true,
        profile_status: data?.profile_status || "pending",
        pricing_per_hour: data.pricing_per_hour || 0,
        total_experience_years: data.experience || 0,
        introduction_video: data.introduction_video || "",
        introduction_text: data.introduction_text || "",
        languages: formatLanguages(data.languages),
        school_name: data.school_name || "",
        degree_status: data.degree_status || "",
        documents: data.documents || {},
      });

      setSelectedBoards(boardsArray);
      setUploadedDocuments(uploadedDocs);

      toast.success("Profile loaded successfully");
    } catch {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Group classes by category
  const groupedClasses = classes.reduce((acc, cls) => {
    const category = cls.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(cls);
    return acc;
  }, {});

  // Sort grouped classes according to custom order
  const sortedCategories = categoryOrder.filter(cat => groupedClasses[cat]);

  // Get available subjects for the selected class
  const availableSubjects =
    classes.find((cls) => cls.name === selectedClass)?.subjects || [];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        classDropdownRef.current &&
        !classDropdownRef.current.contains(event.target)
      ) {
        setClassDropdownOpen(false);
      }
      if (
        subjectDropdownRef.current &&
        !subjectDropdownRef.current.contains(event.target)
      ) {
        setSubjectDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClassSelect = (cls) => {
    setSelectedClass(cls);
    setSelectedSubject("");
    setError("");
    setClassDropdownOpen(false);
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setError("");
    setSubjectDropdownOpen(false);
  };

  // Delete profile photo handler
  const handleDeletePhoto = async () => {
    if (!profile.photo || profile.photo.includes("/default/photo.jpg")) {
      toast.info("No profile photo to delete");
      return;
    }

    setIsDeletingPhoto(true);
    try {
      await deleteProfilePhoto();
      
      const defaultPhoto = "/default/photo.jpg";
      setPhotoPreview("");
      setProfile((prev) => ({ ...prev, photo: defaultPhoto }));
      
      toast.success("Profile photo deleted successfully");
    } catch (error) {
      console.error("Failed to delete profile photo:", error);
      toast.error("Failed to delete profile photo");
    } finally {
      setIsDeletingPhoto(false);
    }
  };

  const handleEdit = (field) => {
    setEditField(field);
   
    if (field === 'board') {
      setTempValue(profile.board);
    }
    else if (field === 'languages' && profile[field]) {
      setTempValue(profile[field]);
    } else {
      setTempValue(profile[field]);
    }
  };

  const handleChange = (e) => setTempValue(e.target.value);

  const handleBoardChange = (newSelectedBoards) => {
    setSelectedBoards(newSelectedBoards);
    setTempValue(newSelectedBoards.join(", "));
  };

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
      if (!res.profile_photo) {
        toast.error("Server did not return profile photo path");
        return;
      }

      const baseUrl = "http://localhost:3000";
      const photoUrl = res.profile_photo.startsWith("http")
        ? res.profile_photo
        : `${baseUrl}${res.profile_photo}`;
      const photoUrlWithTimestamp = `${photoUrl}?t=${Date.now()}`;

      setPhotoPreview(photoUrlWithTimestamp);
      setProfile((prev) => ({ ...prev, photo: photoUrlWithTimestamp }));
      toast.success("Profile photo updated successfully");
    } catch {
      toast.error("Failed to update profile photo");
    }
  };

  const handleSave = async (field) => {
    try {
      // For email and mobile, open OTP verification modal instead of saving directly
      if (field === "email" || field === "mobile") {
        if (field === "email" && !validateEmail(tempValue)) {
          toast.error("Invalid email");
          return;
        }
        if (field === "mobile" && !validateMobile(tempValue)) {
          toast.error("Invalid mobile number");
          return;
        }

        // Open OTP verification modal
        setOtpModal({
          isOpen: true,
          field: field,
          value: tempValue
        });
        return;
      }

      // For other fields, proceed with normal save
      if (field === "location") {
        return;
      } else {
        let payload;
        const isArray = ["subjects", "classes", "degrees", "board", "availability", "languages"].includes(field);
        const actualField = field === "total_experience_years" ? "experience" : field;

        let processedValue;
        if (isArray) {
          if (actualField === 'languages') {
            processedValue = tempValue.split(",").map((v) => {
              const trimmed = v.trim();
              const match = trimmed.match(/^(.+?)\s*\((.+?)\)$/);
              if (match) {
                return {
                  name: match[1].trim(),
                  proficiency: match[2].trim()
                };
              }
              return {
                name: trimmed,
                proficiency: "Fluent"
              };
            });
          } else if (actualField === 'board') {
            processedValue = selectedBoards;
          } else {
            processedValue = tempValue.split(",").map((v) => v.trim());
          }
        } else {
          processedValue = tempValue;
        }

        payload = {
          [actualField]: processedValue,
        };

        await updateTutorProfile(payload);
      }

      setProfile((prev) => ({ ...prev, [field]: tempValue }));
      toast.success(`${field.replace("_", " ")} updated successfully`);
      setEditField(null);
    } catch {
      toast.error(`Failed to update ${field}`);
    }
  };

  // Handle OTP verification success
  const handleOtpVerificationSuccess = () => {
    setProfile((prev) => ({ ...prev, [otpModal.field]: otpModal.value }));
    setEditField(null);
    fetchProfileData(); // Refresh profile data
  };

  const handleClassToggle = async (field) => {
    const updated = { ...profile, [field]: !profile[field] };
    setProfile(updated);

    const teaching_modes = [
      ...(updated.onlineClass ? ["Online"] : []),
      ...(updated.offlineClass ? ["Offline"] : []),
    ];

    try {
      await updateTutorProfile({ teaching_modes });
      toast.success("Class preferences updated");
    } catch {
      toast.error("Failed to update preferences");
    }
  };

  const handleDocumentUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    try {
      const uploadPromises = files.map(async (file, index) => {
        const formattedFile = {
          field: `document_${Date.now()}_${index}`,
          file,
        };
        return await uploadTutorDocuments([formattedFile]);
      });

      const results = await Promise.all(uploadPromises);
      
      await fetchProfileData();
      
      toast.success(`${files.length} document(s) uploaded successfully`);
      
      e.target.value = '';
    } catch (error) {
      console.error('Document upload error:', error);
      toast.error("Failed to upload documents");
    }
  };

  // Document deletion function - FIXED VERSION
  const removeDocument = async (docId, docType) => {
    setDeletingDocs(prev => ({ ...prev, [docId]: true }));
    
    try {
      // Use docType if available, otherwise use docId as fallback
      const documentTypeToDelete = docType || docId;
      await deleteTutorDocument(documentTypeToDelete);
      
      // Update local state immediately for better UX
      setUploadedDocuments(prev => prev.filter(doc => doc.id !== docId));
      
      toast.success("Document deleted successfully");
      
      // Optional: Refresh profile data to ensure consistency
      await fetchProfileData();
    } catch (error) {
      console.error('Document deletion error:', error);
      toast.error(error.response?.data?.message || "Failed to delete document");
      
      // Revert local state if deletion failed
      await fetchProfileData();
    } finally {
      setDeletingDocs(prev => ({ ...prev, [docId]: false }));
    }
  };

  // Render Class & Subject Selection Section
  const renderClassSubjectSection = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Class & Subject Selection</h3>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-3">
            Select the classes and subjects you teach. This helps students find you for specific tutoring needs.
          </p>
          
          {/* Class Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Class/Course</label>
            <div className="relative" ref={classDropdownRef}>
              <button
                onClick={() => {
                  setClassDropdownOpen(!classDropdownOpen);
                  setSubjectDropdownOpen(false);
                }}
                className="w-full p-3 text-gray-700 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none cursor-pointer text-left flex items-center justify-between hover:border-gray-400 transition-colors"
                disabled={loading}
              >
                <span className={selectedClass ? "text-gray-700" : "text-gray-500"}>
                  {loading ? "Loading classes..." : selectedClass || "Select Class/Course"}
                </span>
                {!loading && (
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${
                      classDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              {/* Class Dropdown Menu with Categories */}
              {classDropdownOpen && !loading && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto mt-1">
                  {sortedCategories.map((category) => (
                    <div key={category}>
                      {/* Category Header */}
                      <div className="px-3 py-2 bg-gray-100 text-gray-600 text-sm font-semibold uppercase tracking-wide border-b border-gray-200 sticky top-0">
                        {category}
                      </div>
                      {/* Class Items */}
                      {groupedClasses[category].map((cls) => (
                        <button
                          key={cls.id}
                          onClick={() => handleClassSelect(cls.name)}
                          className="w-full p-3 text-left text-gray-700 hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 text-sm"
                        >
                          {cls.name}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Subject Dropdown */}
          {selectedClass && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Subject</label>
              <div className="relative" ref={subjectDropdownRef}>
                <button
                  onClick={() => {
                    setSubjectDropdownOpen(!subjectDropdownOpen);
                    setClassDropdownOpen(false);
                  }}
                  className="w-full p-3 text-gray-700 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none cursor-pointer text-left flex items-center justify-between hover:border-gray-400 transition-colors"
                >
                  <span className={selectedSubject ? "text-gray-700" : "text-gray-500"}>
                    {selectedSubject || "Select Subject"}
                  </span>
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${
                      subjectDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Subject Dropdown Menu */}
                {subjectDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                    {availableSubjects.map((subj) => (
                      <button
                        key={subj.id}
                        onClick={() => handleSubjectSelect(subj.name)}
                        className="w-full p-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 text-sm"
                      >
                        {subj.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selected Info */}
          {(selectedClass || selectedSubject) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Selected:</strong> {selectedClass} {selectedSubject && `- ${selectedSubject}`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

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
                    location: selected.city,
                    country: "India",
                  }));
                  toast.success("Location updated successfully");
                } catch {
                  toast.error("Failed to update location");
                } finally {
                  setIsLocationLoading(false);
                  setEditField(null);
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
          ) : type === "multiSelect" && field === "board" ? (
            <MultiSelectBoard
              selectedBoards={selectedBoards}
              onChange={handleBoardChange}
              options={options}
            />
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
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => handleSave(field)}
              disabled={
                (field === "email" && !validateEmail(tempValue)) ||
                (field === "mobile" && !validateMobile(tempValue)) ||
                (field === "location" && isLocationLoading) ||
                (field === "board" && selectedBoards.length === 0)
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
              onClick={() => setEditField(null)}
              className="flex-1 bg-gray-100 text-gray-700 py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-900 font-medium text-sm sm:text-base break-words">
            {profile[field] || <span className="text-gray-400 italic font-normal">Not specified</span>}
          </p>
        </div>
      )}
    </div>
  );

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4 sm:mb-6"></div>
          <p className="text-gray-600 text-base sm:text-lg font-medium px-4">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
    };
    return statusStyles[status] || statusStyles.pending;
  };

  const getDocumentStatusBadge = (status) => {
    const statusStyles = {
      pending: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      approved: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      rejected: {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      },
    };
    return statusStyles[status] || statusStyles.pending;
  };

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
      id: "professional",
      label: "Professional",
      fullLabel: "Professional Details",
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
    {
      id: "documents",
      label: "Documents",
      fullLabel: "Documents & Verification",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
      label: "Gender",
      field: "gender",
      type: "select",
      options: ["Male", "Female", "Other"],
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
      label: "Board",
      field: "board",
      type: "multiSelect",
      options: ["CBSE", "ICSE", "State Board", "IB", "Cambridge"],
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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

  const classSubjectFields = [
    {
      label: "Teaching Classes",
      field: "classes",
      placeholder: "9, 10, 11, 12",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      label: "Teaching Subjects",
      field: "subjects",
      placeholder: "Math, Physics, Chemistry",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
  ];

  const professionalFields = [
    ...classSubjectFields,
    {
      label: "Degrees",
      field: "degrees",
      placeholder: "B.Sc, M.Sc, B.Tech",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 a12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      )
    },
    {
      label: "Languages",
      field: "languages",
      placeholder: "Hindi (Fluent), English (Native), Marathi (Intermediate)",
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
      label: "Degree Status",
      field: "degree_status",
      type: "select",
      options: ["Pursuing", "Completed", "Dropped"],
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 a3.42 3.42 0 014.438 0 a3.42 3.42 0 001.946.806 a3.42 3.42 0 013.138 3.138 a3.42 3.42 0 00.806 1.946 a3.42 3.42 0 010 4.438 a3.42 3.42 0 00-.806 1.946 a3.42 3.42 0 01-3.138 3.138 a3.42 3.42 0 00-1.946.806 a3.42 3.42 0 01-4.438 0 a3.42 3.42 0 00-1.946-.806 a3.42 3.42 0 01-3.138-3.138 a3.42 3.42 0 00-.806-1.946 a3.42 3.42 0 010-4.438 a3.42 3.42 0 00.806-1.946 a3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
    {
      label: "Experience (years)",
      field: "total_experience_years",
      type: "number",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: "Pricing (₹/hour)",
      field: "pricing_per_hour",
      type: "number",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
  ];

  const introductionFields = [
    {
      label: "Introduction Video",
      field: "introduction_video",
      placeholder: "YouTube or Drive link",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      label: "Introduction Text",
      field: "introduction_text",
      type: "textarea",
      placeholder: "Brief introduction about yourself",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={otpModal.isOpen}
        onClose={() => setOtpModal({ isOpen: false, field: null, value: null })}
        field={otpModal.field}
        value={otpModal.value}
        onVerify={handleOtpVerificationSuccess}
      />

      {/* Header Section */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 lg:gap-10">

            {/* Profile Photo with Delete Option */}
            <div className="relative group flex-shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-indigo-100 to-purple-100">
                <img
                  src={photoPreview || profile.photo || "/default/photo.jpg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Update Photo Button */}
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

              {/* Delete Photo Button - Only show if not default photo */}
              {(profile.photo && !profile.photo.includes("/default/photo.jpg")) && (
                <button
                  onClick={handleDeletePhoto}
                  disabled={isDeletingPhoto}
                  className="absolute -bottom-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete profile photo"
                >
                  {isDeletingPhoto ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <TrashIcon className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                {profile.name || "Your Name"}
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
                  {profile.location || "Location"}, {profile.country}
                </span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {/* Status */}
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border-2 ${getStatusBadge(
                    profile.profile_status
                  )}`}
                >
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current mr-1.5 sm:mr-2"></span>
                  {profile.profile_status
                    ? profile.profile_status.charAt(0).toUpperCase() +
                    profile.profile_status.slice(1)
                    : "Pending"}
                </span>

                {/* Hourly Rate */}
                {profile.pricing_per_hour > 0 && (
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                    ₹{profile.pricing_per_hour}/hour
                  </span>
                )}

                {/* Experience */}
                {profile.total_experience_years > 0 && (
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {profile.total_experience_years} years
                  </span>
                )}

                {/* Gender */}
                {profile.gender && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-green-50 text-green-700 border-2 border-green-200">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {profile.gender}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Improved for mobile */}
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
                <span className="hidden xs:inline sm:hidden">{section.shortLabel || section.label}</span>
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
                Keep your profile details updated so students and parents can easily connect with you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {personalFields.map((field, index) => (
                <div
                  key={field.key || index}
                  className="relative bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-indigo-300 transition"
                >
                  {/* Render field content only */}
                  {renderEditableField(field)}

                  {/* Single edit button (top-right) */}
                  <button
                    type="button"
                    className="absolute top-2 right-2 p-1.5 sm:p-2 rounded-full hover:bg-gray-100"
                    onClick={() => handleEdit(field.field)}
                  >
                    <PencilSquareIcon className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Professional Information */}
        {activeSection === "professional" && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="text-center mb-4 sm:mb-6 md:mb-8 px-2">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                Professional Details
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
                Showcase your expertise, qualifications, and teaching experience
              </p>
            </div>
           
            {/* Class & Subject Selection Section */}
            {renderClassSubjectSection()}
           
            {/* Professional Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {professionalFields.map((field, index) => (
                <div
                  key={field.key || index}
                  className="relative bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-indigo-300 transition"
                >
                  {/* Render field content only */}
                  {renderEditableField(field)}

                  {/* Single edit button (top-right) */}
                  <button
                    type="button"
                    className="absolute top-2 right-2 p-1.5 sm:p-2 rounded-full hover:bg-gray-100"
                    onClick={() => handleEdit(field.field)}
                  >
                    <PencilSquareIcon className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                  </button>
                </div>
              ))}
            </div>
           
            {/* Introduction Section */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Introduction</h3>
              </div>
             
              <div className="grid grid-cols-1 gap-4">
                {introductionFields.map((field, index) => (
                  <div
                    key={field.key || index}
                    className="relative bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition"
                  >
                    {/* Render field content only */}
                    {renderEditableField(field)}

                    {/* Single edit button (top-right) */}
                    <button
                      type="button"
                      className="absolute top-2 right-2 p-1.5 sm:p-2 rounded-full hover:bg-gray-100"
                      onClick={() => handleEdit(field.field)}
                    >
                      <PencilSquareIcon className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Preferences */}
        {activeSection === "preferences" && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="text-center mb-4 sm:mb-6 md:mb-8 px-2">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                Teaching Preferences
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
                Configure your teaching modes and notification preferences
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Teaching Modes */}
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
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 a12.078 12.078 0 01.665-6.479L12 14z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                    Teaching Modes
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
                      label: "Offline Classes",
                      desc: "Face-to-face teaching",
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
                        Receive booking notifications via SMS
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
                          await updateTutorProfile({ sms_alerts: newValue });
                          toast.success("SMS preference updated");
                        } catch {
                          toast.error("Failed to update SMS alerts");
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

        {/* Documents */}
        {activeSection === "documents" && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="text-center mb-4 sm:mb-6 md:mb-8 px-2">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                    Document Management
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl">
                    Upload verification documents to build trust and credibility
                  </p>
                </div>
                
                {/* Document Status Badge - Only shows status, no action button */}
                <div className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold border-2 ${getDocumentStatusBadge(profile.profile_status).bg} ${getDocumentStatusBadge(profile.profile_status).text} ${getDocumentStatusBadge(profile.profile_status).border}`}>
                  {getDocumentStatusBadge(profile.profile_status).icon}
                  <span className="text-sm sm:text-base">
                    {profile.profile_status === "pending" && "Documents Pending"}
                    {profile.profile_status === "approved" && "Documents Approved"}
                    {profile.profile_status === "rejected" && "Documents Rejected"}
                  </span>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-4 sm:p-5 md:p-6 lg:p-8 hover:border-indigo-100 hover:bg-indigo-50 transition-all duration-100">
              <div className="text-center">
                {/* Reduced size for the top icon */}
                <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
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
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-2">
                  Upload Documents
                </h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm px-2 sm:px-4">
                  Upload Aadhar Card, PAN Card, educational certificates, or other
                  verification documents
                </p>
                <label className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 sm:px-5 py-2.5 rounded-lg font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 cursor-pointer shadow text-xs sm:text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  Choose Files
                  <input
                    type="file"
                    multiple
                    onChange={handleDocumentUpload}
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  PDF, JPG, PNG • Max 5MB per file
                </p>
              </div>
            </div>

            {/* Uploaded Documents */}
            {uploadedDocuments.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                    Uploaded Documents ({uploadedDocuments.length})
                  </h3>
                </div>

                {/* Tighter grid + smaller cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {uploadedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3 hover:shadow-sm hover:border-gray-300 transition-all duration-300"
                    >
                      <div className="text-center">
                        {/* Smaller icon square */}
                        <div className="mx-auto w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>

                        <p className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm break-words line-clamp-1">
                          {doc.name}
                        </p>

                        <div className="flex justify-center gap-2 mt-2">
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-200 text-xs"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            View
                          </a>
                          <button
                            onClick={() => removeDocument(doc.id, doc.type)}
                            disabled={deletingDocs[doc.id]}
                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold transition-colors duration-200 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingDocs[doc.id] ? (
                              <div className="animate-spin rounded-full h-3 w-3 border border-red-600 border-t-transparent"></div>
                            ) : (
                              <>
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Whole_Profile_tutor;