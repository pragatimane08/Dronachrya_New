import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import LocationSearch from "../../../../../components/common/LocationSearch";
import { authRepository } from "../../../../../api/repository/auth.repository";
import Layout from "../../layout/MainLayout";
import Backgroundimage from "../../../../../assets/img/bgform.jpg";
import { apiClient } from "../../../../../api/apiclient";

export default function BookDemoReg() {
  const navigate = useNavigate();
  const locationHook = useLocation();
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(Backgroundimage);
  const boards = [
    "CBSE",
    "ICSE",
    "State Board",
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
  const [subjectsQuery, setSubjectsQuery] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  const availabilityOptions = ["Any day", "Weekday", "Weekend"];
  const [availability, setAvailability] = useState("");
  const startTimelineOptions = ["Immediately", "Within a month", "Not sure, just exploring options"];
  const [startTimeline, setStartTimeline] = useState("");
  const [selectedModes, setSelectedModes] = useState({
    main: "",
    offlineType: ""
  });
  const [genderPref, setGenderPref] = useState("");
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
  const [resendLoading, setResendLoading] = useState(false); // New loading state for resend

  const subjectFromState = locationHook.state?.subject || localStorage.getItem("selectedSubject");

  // Fetch subjects from API when component mounts
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setSubjectsLoading(true);
        const response = await apiClient.get("/subjects");

        const allSubjects = response.data.classes.flatMap(cls =>
          cls.subjects.map(subj => ({ id: subj.id, name: subj.name }))
        );

        const uniqueSubjects = Array.from(
          new Map(allSubjects.map(subj => [subj.name, subj])).values()
        );

        const sortedSubjects = uniqueSubjects.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setAvailableSubjects(sortedSubjects);
        setFilteredSubjects(sortedSubjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setErrors({ subjects: "Failed to load subjects. Please try again." });
      } finally {
        setSubjectsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // Filter subjects based on search query
  useEffect(() => {
    if (subjectsQuery.trim() === "") {
      setFilteredSubjects(availableSubjects);
    } else {
      const filtered = availableSubjects.filter(subj =>
        subj.name.toLowerCase().includes(subjectsQuery.toLowerCase())
      );
      setFilteredSubjects(filtered);
    }
  }, [subjectsQuery, availableSubjects]);

  useEffect(() => {
    if (subjectFromState && selectedSubjects.length === 0) {
      setSelectedSubjects([subjectFromState]);
    }
  }, [subjectFromState]);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidMobile = (m) => /^[6-9]\d{9}$/.test(m);
  const isLettersSpaces = (s) => /^[A-Za-z\s]+$/.test(s);

  // OTP Timer Effect
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
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: "" }));
    }
  };

  const addSubject = (s) => {
    if (!s) return;
    setSelectedSubjects((prev) => [...prev, s]);
    setSubjectsQuery("");
    if (errors.subjects) {
      setErrors(prev => ({ ...prev, subjects: "" }));
    }
  };

  const removeSubject = (s) => {
    setSelectedSubjects((prev) => prev.filter((x) => x !== s));
  };

  const toggleMode = (mode) => {
    setSelectedModes((prev) => ({ ...prev, [mode]: !prev[mode] }));
    if (errors.modes) {
      setErrors(prev => ({ ...prev, modes: "" }));
    }
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!location?.place_id) e.location = "Please select a city from suggestions (India only).";
      if (location?.country && location.country !== "IN") e.location = "Please select a city in India.";
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
      if (!selectedModes.main) {
        e.modes = "Please select a class mode.";
      } else if (selectedModes.main === "offline" && !selectedModes.offlineType) {
        e.modes = "Please select an offline class type.";
      }
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
      const name = (form.name || "").trim();
      const email = (form.email || "").trim();
      const mobile = (form.mobile_number || "").trim();
      const otpTrim = (otp || "").trim();

      if (!name) e.name = "Full name is required.";
      else if (!isLettersSpaces(name)) e.name = "Name can only contain letters and spaces.";

      if (!email) e.email = "Email is required.";
      else if (!isValidEmail(email)) e.email = "Please enter a valid email address.";

      if (!mobile) e.mobile_number = "Mobile number is required.";
      else if (!isValidMobile(mobile)) e.mobile_number = "Please enter a valid 10-digit mobile number.";

      if (otpSent) {
        if (!otpTrim) e.otp = "OTP is required.";
        else if (!/^\d{6}$/.test(otpTrim)) e.otp = "OTP must be exactly 6 digits.";
      }
    }
    return e;
  };

  const goNext = async () => {
    const e = validateStep(step);
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});

    if (step === 8) {
      setStep(9);
      return;
    }

    if (step === 9) {
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

  useEffect(() => {
    if (locationHook.state?.fromExploreCategories) {
      localStorage.setItem("cameFromExploreCategories", "true");
    }

    return () => {
      localStorage.removeItem("cameFromExploreCategories");
    };
  }, [locationHook.state]);

  const handleClose = () => {
    const fromExploreCategories =
      locationHook.state?.fromExploreCategories ||
      localStorage.getItem("cameFromExploreCategories");

    if (fromExploreCategories) {
      localStorage.removeItem("cameFromExploreCategories");

      if (window.location.pathname === "/") {
        window.location.href = "/#explore-categories";
      } else {
        navigate("/#explore-categories");
      }
    } else {
      navigate("/");
    }
  };

  const handleSendOtp = async () => {
    const basicErrors = {};
    const name = (form.name || "").trim();
    const email = (form.email || "").trim();
    const mobile = (form.mobile_number || "").trim();

    if (!name) basicErrors.name = "Full name is required.";
    else if (!isLettersSpaces(name))
      basicErrors.name = "Name can only contain letters and spaces.";

    if (!email) basicErrors.email = "Email is required.";
    else if (!isValidEmail(email))
      basicErrors.email = "Please enter a valid email address.";

    if (!mobile) basicErrors.mobile_number = "Mobile number is required.";
    else if (!isValidMobile(mobile))
      basicErrors.mobile_number = "Please enter a valid 10-digit mobile number.";

    if (Object.keys(basicErrors).length > 0) {
      setErrors(basicErrors);
      return;
    }

    setLoading(true);
    try {
      const classModes = [];
      if (selectedModes.main === "online") classModes.push("Online");
      if (selectedModes.main === "offline") {
        if (selectedModes.offlineStudentHome)
          classModes.push("Offline-StudentHome");
        if (selectedModes.offlineTutorHome)
          classModes.push("Offline-TutorHome");
      }

      let offlineType = null;
      if (selectedModes.main === "offline") {
        if (selectedModes.offlineType === "student_home") {
          offlineType = "home";
        } else if (selectedModes.offlineType === "nearby") {
          offlineType = "nearby";
        } else if (selectedModes.offlineType === "both") {
          offlineType = "home";
        }
      }

      const payload = {
        name,
        email,
        mobile_number: mobile,
        role: "student",
        class: locationHook.state?.class || "",
        board: board === "Other" ? boardOtherText.trim() : board,
        subjects: selectedSubjects,
        availability: [availability],
        start_timeline: startTimeline,
        class_modes: classModes,
        ...(offlineType && { offline_type: offlineType }),
        tutor_gender_preference: genderPref,
        hourly_charges: Number(form.minPrice),
        place_id: location?.place_id || "",
        pincode: location?.pincode || "000000",
        country: location?.country || "IN",
        school_name: "Pending student update",
        languages: [
          { language: "English", proficiency: "Fluent" },
          { language: "Hindi", proficiency: "Moderate" },
        ],
        sms_alerts: true,
      };

      const res = await authRepository.preRegisterStudent(payload);

      if (res?.data?.user_id) {
        setTempStudentId(res.data.user_id);
        setOtpSent(true);
        setOtpTimer(60); // Start 60 second timer
      } else {
        throw new Error(
          res?.data?.message || "Failed to pre-register and send OTP."
        );
      }
    } catch (err) {
      console.error("OTP Error:", err.response?.data || err.message);

      if (err.response?.status === 409) {
        setErrors({
          submit: err.response.data?.message || "Email or mobile number already registered. Please use different credentials or try logging in."
        });
      }
      else if (err.response?.data?.details) {
        const serverErrors = {};
        err.response.data.details.forEach((detail) => {
          if (detail.path && detail.message) {
            serverErrors[detail.path[0]] = detail.message;
          }
        });
        setErrors({
          ...serverErrors,
          submit: "Please fix the validation errors above.",
        });
      } else {
        setErrors({
          submit: err?.response?.data?.message || "Failed to send OTP. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const e = validateStep(9);
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    setLoading(true);
    try {
      const otpVerifyPayload = {
        user_id: tempStudentId,
        otp: otp.trim(),
      };

      const otpVerifyRes = await authRepository.verifyOtp(otpVerifyPayload);

      if (!otpVerifyRes?.data || otpVerifyRes?.data?.error) {
        throw new Error(
          otpVerifyRes?.data?.message || "OTP verification failed."
        );
      }

      if (otpVerifyRes.data.token && otpVerifyRes.data.user) {
        localStorage.setItem("token", otpVerifyRes.data.token);
        localStorage.setItem("user", JSON.stringify(otpVerifyRes.data.user));
      }

      let offlineType = null;
      if (selectedModes.main === "offline") {
        if (selectedModes.offlineType === "student_home") {
          offlineType = "home";
        } else if (selectedModes.offlineType === "nearby") {
          offlineType = "nearby";
        } else if (selectedModes.offlineType === "both") {
          offshoreType = "home";
        }
      }

      const teachingModes = [];
      if (selectedModes.main === "online") teachingModes.push("Online");
      if (selectedModes.main === "offline") {
        if (selectedModes.offlineStudentHome)
          teachingModes.push("Offline-StudentHome");
        if (selectedModes.offlineTutorHome)
          teachingModes.push("Offline-TutorHome");
      }

      const filters = {
        name: "",
        subjects: selectedSubjects,
        classes: [locationHook.state?.class || ""].filter(Boolean),
        board: [board === "Other" ? boardOtherText.trim() : board],
        availability: [availability],
        languages: ["English", "Hindi"],
        teaching_modes: teachingModes,
        experience: "",
        budgetMin: form.minPrice || "",
        budgetMax: form.maxPrice || "",
        location: location?.city || "",
        pincode: location?.pincode || location?.raw_pincode || "",
        country: location?.country || "IN",
        gender: genderPref === "No preference" || genderPref === "Any" ? "" : genderPref,
        offline_type: offlineType,
      };

      navigate("/find-instructor", { state: { demoFilters: filters } });
    } catch (err) {
      console.error("OTP Verify Error:", err.response?.data || err.message);
      setErrors({
        submit:
          err?.response?.data?.message ||
          "OTP verification failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Enhanced Resend OTP function with better error handling and user feedback
  const handleResendOtp = async () => {
    if (otpTimer > 0 || resendLoading) return;

    setResendLoading(true);
    try {
      if (!tempStudentId) {
        throw new Error("Cannot resend OTP without user ID");
      }

      // Call the resend endpoint with the correct payload structure
      const response = await authRepository.resendPreRegisterOTP({
        user_id: tempStudentId
      });

      if (response?.data) {
        setOtpTimer(60); // Reset timer to 60 seconds
        setErrors(prev => ({ ...prev, submit: "" })); // Clear any previous errors

        // Show success message briefly
        setErrors({
          submit: "OTP resent successfully! Please check your email and SMS."
        });

        // Clear success message after 3 seconds
        setTimeout(() => {
          setErrors(prev => ({ ...prev, submit: "" }));
        }, 3000);
      } else {
        throw new Error("Failed to resend OTP");
      }
    } catch (err) {
      console.error("Resend OTP Error:", err);
      setErrors({
        submit: err?.response?.data?.message || "Failed to resend OTP. Please try again."
      });
    } finally {
      setResendLoading(false);
    }
  };

  // Format timer display (MM:SS)
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
    <Layout showNavbar={false}>
      <div
        className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-30 z-50 p-4"
        style={{
          backgroundImage: `url(${Backgroundimage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl relative max-h-[95vh] overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`
            .overflow-y-auto::-webkit-scrollbar {
              display: none;
            }
          `}</style>

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

          {errors.submit && (
            <div className={`border px-4 py-3 rounded mb-4 text-sm ${errors.submit.includes('successfully')
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
              }`}>
              {errors.submit}
            </div>
          )}

          {/* STEP 1: Location */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Where are you located? *</label>
                <p className="text-xs text-gray-500 mb-2">We currently serve students across India</p>
                <div className="relative">
                  <LocationSearch
                    value={location?.name || ""}
                    placeholder="Start typing your city (India only)..."
                    onSelect={handleLocationSelect}
                    hasError={!!errors.location}
                  />
                </div>
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

              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
                  placeholder="Search subjects..."
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {subjectsLoading ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Loading subjects...</p>
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto pr-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {filteredSubjects.length > 0 ? (
                    filteredSubjects.map((subj) => (
                      <div
                        key={subj.id}
                        className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-none"
                        onClick={() => {
                          if (selectedSubjects.includes(subj.name)) {
                            removeSubject(subj.name);
                          } else {
                            addSubject(subj.name);
                          }
                        }}
                      >
                        <span className="text-sm text-gray-700">{subj.name}</span>
                        <input
                          type="checkbox"
                          checked={selectedSubjects.includes(subj.name)}
                          onChange={() => {
                            // This is now handled by the parent div onClick
                          }}
                          className="h-4 w-4 text-teal-600 border-gray-300 rounded"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No subjects found matching your search</p>
                    </div>
                  )}
                </div>
              )}

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
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  How would you like to attend your tuition classes? *
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Select one mode. If offline, choose location options.
                </p>

                <div className="space-y-3 mt-4">
                  <label
                    className={`flex items-center justify-between w-full p-4 border rounded-lg cursor-pointer transition-colors ${selectedModes.main === "online"
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-300 hover:border-teal-300"
                      }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="classMode"
                        checked={selectedModes.main === "online"}
                        onChange={() => setSelectedModes({ main: "online", offlineType: "" })}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Online Classes</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center justify-between w-full p-4 border rounded-lg cursor-pointer transition-colors ${selectedModes.main === "offline"
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-300 hover:border-teal-300"
                      }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="classMode"
                        checked={selectedModes.main === "offline"}
                        onChange={() =>
                          setSelectedModes({
                            main: "offline",
                            offlineType: "nearby"
                          })
                        }
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        Offline Classes (Nearby)
                      </span>
                    </div>
                  </label>

                  {selectedModes.main === "offline" && (
                    <div className="ml-6 mt-3 space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="offlineType"
                          checked={selectedModes.offlineType === "home"}
                          onChange={() =>
                            setSelectedModes(prev => ({
                              ...prev,
                              offlineType: "home"
                            }))
                          }
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          At My Home
                        </span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="offlineType"
                          checked={selectedModes.offlineType === "nearby"}
                          onChange={() =>
                            setSelectedModes(prev => ({
                              ...prev,
                              offlineType: "nearby"
                            }))
                          }
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          At Tutor's Home (Nearby)
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                {errors.modes && (
                  <p className="text-red-500 text-xs mt-2">{errors.modes}</p>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={goBack}
                  className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={goNext}
                  className="px-5 py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
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
                  What is your preferred price range per hour? *
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Minimum ₹100/hour required
                </p>

                <div className="flex gap-3">
                  <div className="w-1/2">
                    <input
                      type="number"
                      value={form.minPrice}
                      onChange={(e) => {
                        setForm({ ...form, minPrice: e.target.value });
                        if (errors.minPrice) setErrors(prev => ({ ...prev, minPrice: "" }));
                      }}
                      placeholder="Min (₹)"
                      className={`w-full border ${errors.minPrice ? "border-red-500" : "border-gray-300"
                        } rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                    />
                    {errors.minPrice && (
                      <p className="text-red-500 text-xs mt-1">{errors.minPrice}</p>
                    )}
                  </div>

                  <div className="w-1/2">
                    <input
                      type="number"
                      value={form.maxPrice}
                      onChange={(e) => {
                        setForm({ ...form, maxPrice: e.target.value });
                        if (errors.maxPrice) setErrors(prev => ({ ...prev, maxPrice: "" }));
                      }}
                      placeholder="Max (₹)"
                      className={`w-full border ${errors.maxPrice ? "border-red-500" : "border-gray-300"
                        } rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                    />
                    {errors.maxPrice && (
                      <p className="text-red-500 text-xs mt-1">{errors.maxPrice}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={goBack}
                  className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={goNext}
                  className="px-5 py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* STEP 9: Your Details + OTP Verification */}
          {step === 9 && (
            <div className="space-y-6">
              {!otpSent ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                        if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                      }}
                      placeholder="Enter your full name"
                      className={`w-full border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                      }}
                      placeholder="Enter your email"
                      className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={form.mobile_number}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length > 10) {
                          setErrors(prev => ({ ...prev, mobile_number: "Mobile number cannot exceed 10 digits" }));
                          setForm({ ...form, mobile_number: value.slice(0, 10) });
                        } else {
                          setForm({ ...form, mobile_number: value });
                          if (errors.mobile_number) setErrors(prev => ({ ...prev, mobile_number: "" }));
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value.length !== 10 && e.target.value.length > 0) {
                          setErrors(prev => ({ ...prev, mobile_number: "Please enter exactly 10 digits" }));
                        }
                      }}
                      placeholder="Enter your 10-digit mobile number"
                      maxLength={10}
                      className={`w-full border ${errors.mobile_number ? "border-red-500" : "border-gray-300"} rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                    />
                    {errors.mobile_number && <p className="text-red-500 text-xs mt-1">{errors.mobile_number}</p>}
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      onClick={goBack}
                      className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Back
                    </button>

                    <button
                      onClick={handleSendOtp}
                      disabled={loading}
                      className={`px-5 py-2.5 rounded-md text-white transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}
                    >
                      {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* OTP Verification Section */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Enter OTP *
                    </label>

                    {/* ✅ Normal styled info text */}
                    <p className="text-sm text-gray-600 mb-3">
                      We’ve sent a 6-digit verification code to{" "}
                      <span className="font-semibold">{form.mobile_number}</span> and{" "}
                      <span className="font-semibold">{form.email}</span>
                    </p>

                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtp(value);
                        if (errors.otp) setErrors(prev => ({ ...prev, otp: "" }));
                      }}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      className={`w-full border ${errors.otp ? "border-red-500" : "border-gray-300"} rounded-lg p-3 text-center text-lg tracking-widest focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                    />
                    {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp}</p>}
                  </div>

                  {/* Timer and Resend Section */}
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    {otpTimer > 0 ? (
                      <p>
                        Resend OTP in{" "}
                        <span className="font-mono font-semibold text-orange-600">
                          {formatTimer(otpTimer)}
                        </span>
                      </p>
                    ) : (
                      <p className="text-green-600">You can now resend OTP</p>
                    )}

                    <button
                      onClick={handleResendOtp}
                      disabled={otpTimer > 0 || resendLoading}
                      className={`font-medium transition-colors ${otpTimer > 0 || resendLoading
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-teal-600 hover:text-teal-700 hover:underline'
                        }`}
                    >
                      {resendLoading ? 'Sending...' : 'Resend OTP'}
                    </button>
                  </div>

                  {/* Actions for OTP verification */}
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => {
                        setOtpSent(false);
                        setOtp("");
                        setOtpTimer(0);
                      }}
                      className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Back to Form
                    </button>

                    <button
                      onClick={handleVerifyOtp}
                      disabled={loading || otp.length !== 6}
                      className={`px-5 py-2.5 rounded-md text-white transition-colors ${loading || otp.length !== 6
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-teal-600 hover:bg-teal-700'
                        }`}
                    >
                      {loading ? "Verifying..." : "Verify & Continue"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}


        </div>
      </div>

    </Layout>
  );
}