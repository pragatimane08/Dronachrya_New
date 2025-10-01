import React, { useState, useEffect, useRef } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import {
  getProfile,
  updateTutorProfile,
  updateUserContact,
  updateLocation,
  uploadProfilePhoto,
  uploadTutorDocuments,
} from "../../../../../api/repository/profile.repository";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LocationSearch from "./LocationSearch";

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
        // The useEffect will adjust the height
      }}
      placeholder={placeholder}
      rows={1}
      className="w-full border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-3 py-2 rounded-lg transition-all duration-200 outline-none text-gray-900 resize-none text-sm"
      {...props}
    />
  );
};

const Whole_Profile_tutor = () => {
  const [profile, setProfile] = useState(null);
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [customBoardText, setCustomBoardText] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();

        // Helper function to format languages
        const formatLanguages = (languages) => {
          if (!languages) return "";
         
          // If it's already a properly formatted string, return it
          if (typeof languages === 'string' && !languages.includes('{')) {
            return languages;
          }
         
          // If it's a JSON string, parse it first
          if (typeof languages === 'string' && languages.includes('{')) {
            try {
              const parsed = JSON.parse(languages);
              if (parsed.name) {
                return `${parsed.name}${parsed.proficiency ? ` (${parsed.proficiency})` : ''}`;
              }
            } catch (e) {
              // If parsing fails, try to extract name and proficiency manually
              const nameMatch = languages.match(/"name":"([^"]+)"/);
              const proficiencyMatch = languages.match(/"proficiency":"([^"]+)"/);
              if (nameMatch) {
                const name = nameMatch[1];
                const proficiency = proficiencyMatch ? proficiencyMatch[1] : '';
                return `${name}${proficiency ? ` (${proficiency})` : ''}`;
              }
              return languages; // Return as-is if we can't parse it
            }
          }
         
          // If it's an array
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
         
          // If it's an object
          if (typeof languages === 'object' && languages.name) {
            return `${languages.name}${languages.proficiency ? ` (${languages.proficiency})` : ''}`;
          }
         
          return languages;
        };

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
          board: Array.isArray(data.board) ? data.board.join(", ") : (data.board || ""),
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

        toast.success("Profile loaded successfully");
      } catch {
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = (field) => {
    setEditField(field);
   
    // Special handling for board field
    if (field === 'board') {
      const boardOptions = ["CBSE", "ICSE", "State Board", "IB", "Cambridge"];
      if (boardOptions.includes(profile[field])) {
        setTempValue(profile[field]);
        setCustomBoardText("");
      } else {
        setTempValue("Other");
        setCustomBoardText(profile[field]);
      }
    }
    // For languages field, ensure we use the formatted display value
    else if (field === 'languages' && profile[field]) {
      setTempValue(profile[field]); // This should already be formatted as "Hindi (Fluent)"
    } else {
      setTempValue(profile[field]);
    }
  };

  const handleChange = (e) => setTempValue(e.target.value);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
      if (field === "email" && !validateEmail(tempValue))
        return toast.error("Invalid email");
      if (field === "mobile" && !validateMobile(tempValue))
        return toast.error("Invalid mobile number");

      if (["email", "mobile"].includes(field)) {
        const fieldToSend = field === "mobile" ? "mobile_number" : field;
        await updateUserContact(fieldToSend, tempValue);
      } else if (field === "location") {
        return;
      } else {
        let payload;
        const isArray = ["subjects", "classes", "degrees", "board", "availability", "languages"].includes(field);
        const actualField = field === "total_experience_years" ? "experience" : field;

        let processedValue;
        if (isArray) {
          if (actualField === 'languages') {
            // Convert back to object format for API
            processedValue = tempValue.split(",").map((v) => {
              const trimmed = v.trim();
              // Extract name and proficiency from "Hindi (Fluent)" format
              const match = trimmed.match(/^(.+?)\s*\((.+?)\)$/);
              if (match) {
                return {
                  name: match[1].trim(),
                  proficiency: match[2].trim()
                };
              }
              // If no proficiency specified, default to "Fluent"
              return {
                name: trimmed,
                proficiency: "Fluent"
              };
            });
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
    const formattedFiles = files.map((file, index) => ({
      field: `document_${index}`,
      file,
    }));

    try {
      await uploadTutorDocuments(formattedFiles);
      toast.success("Documents uploaded successfully");
    } catch {
      toast.error("Failed to upload documents");
    }
  };

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
      type: "selectWithOther",
      options: ["CBSE", "ICSE", "State Board", "IB", "Cambridge", "Other"],
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

  const professionalFields = [
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
      label: "Classes",
      field: "classes",
      placeholder: "9, 10, 11, 12",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      label: "Degrees",
      field: "degrees",
      placeholder: "B.Sc, M.Sc, B.Tech",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
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
          ) : type === "selectWithOther" ? (
            <>
              <select
                value={tempValue}
                onChange={(e) => {
                  const newOption = e.target.value;
                  setTempValue(newOption);
                  if (newOption !== "Other") {
                    setCustomBoardText("");
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
                  value={customBoardText}
                  onChange={(e) => setCustomBoardText(e.target.value)}
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
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                if (field === "board" && tempValue === "Other") {
                  setTempValue(customBoardText);
                }
                handleSave(field);
              }}
              disabled={
                (field === "email" && !validateEmail(tempValue)) ||
                (field === "mobile" && !validateMobile(tempValue)) ||
                (field === "location" && isLocationLoading) ||
                (field === "board" && tempValue === "Other" && !customBoardText.trim())
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
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
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
                      label: "In-Person Classes",
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
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                Document Management
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
                Upload verification documents to build trust and credibility
              </p>
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
            {profile.documents && Object.keys(profile.documents).length > 0 && (
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
                    Uploaded Documents
                  </h3>
                </div>

                {/* Tighter grid + smaller cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(profile.documents).map(
                    ([type, doc]) =>
                      doc?.url && (
                        <div
                          key={type}
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
                              {doc.name || `Document (${type})`}
                            </p>

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
                          </div>
                        </div>
                      )
                  )}
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

