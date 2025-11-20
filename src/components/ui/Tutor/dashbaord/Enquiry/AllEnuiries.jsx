import React, { useState, useEffect } from "react";
import { ArrowLeft, User, ChevronLeft, ChevronRight, Eye, X, ChevronDown, ChevronUp, Phone, Mail, Send, AlertCircle, Filter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../../../api/apiclient";
import { apiUrl } from "../../../../../api/apiUtl";
import EnquiryModal from "./RaiseEnquiry";

const AllEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedEnquiry, setExpandedEnquiry] = useState(null);
  const [showContact, setShowContact] = useState({});
  const [contactInfo, setContactInfo] = useState({});
  const [loadingContact, setLoadingContact] = useState({});
  const [contactError, setContactError] = useState({});
  const [successMessage, setSuccessMessage] = useState({});
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showSubscribeMessage, setShowSubscribeMessage] = useState(false);
  const [filters, setFilters] = useState({
    subjects: [],
    class: [],
    class_modes: [],
  });
  const [tempFilters, setTempFilters] = useState({
    subjects: [],
    class: [],
    class_modes: [],
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [classSearch, setClassSearch] = useState("");
  const [subjectSearch, setSubjectSearch] = useState("");
  
  const enquiriesPerPage = 10;

  const MODE_OPTIONS = ["Online", "Offline", "Both"];

  const navigate = useNavigate();

  useEffect(() => {
    fetchEnquiries();
    fetchClasses();
  }, []);

  // Initialize temp filters when main filters change
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (filters.subjects.length > 0) count++;
    if (filters.class.length > 0) count++;
    if (filters.class_modes.length > 0) count++;
    setActiveFiltersCount(count);
  }, [filters]);

  // Apply filters whenever enquiries or filters change
  useEffect(() => {
    applyFilters();
  }, [enquiries, filters]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`${apiUrl.baseUrl}/public/students`);
      
      let enquiriesData = [];
      
      if (Array.isArray(response.data)) {
        enquiriesData = response.data;
      } else if (response.data && Array.isArray(response.data.enquiries)) {
        enquiriesData = response.data.enquiries;
      } else if (response.data && Array.isArray(response.data.students)) {
        enquiriesData = response.data.students;
      } else if (response.data && Array.isArray(response.data.data)) {
        enquiriesData = response.data.data;
      } else {
        console.warn("Unexpected API response structure:", response.data);
        enquiriesData = [];
      }
      
      setEnquiries(enquiriesData);
      setFilteredEnquiries(enquiriesData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(`Failed to load enquiries: ${err.response?.data?.message || err.message}`);
      setEnquiries([]);
      setFilteredEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const response = await apiClient.get("/subjects");
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoadingClasses(false);
    }
  };

  // Apply filters to enquiries - LOCATION FILTER REMOVED
  const applyFilters = () => {
    if (!Array.isArray(enquiries)) {
      setFilteredEnquiries([]);
      return;
    }

    let filtered = enquiries.filter(enquiry => {
      // Subjects filter
      if (filters.subjects.length > 0) {
        const enquirySubjects = Array.isArray(enquiry.subjects) ? enquiry.subjects : 
                               enquiry.subject ? [enquiry.subject] : [];
        const hasMatchingSubject = filters.subjects.some(filterSubject =>
          enquirySubjects.some(enquirySubject =>
            enquirySubject.toLowerCase().includes(filterSubject.toLowerCase())
          )
        );
        if (!hasMatchingSubject) return false;
      }

      // Class filter
      if (filters.class.length > 0 && enquiry.class) {
        const enquiryClass = enquiry.class.toString().toLowerCase();
        const hasMatchingClass = filters.class.some(filterClass =>
          enquiryClass.includes(filterClass.toLowerCase())
        );
        if (!hasMatchingClass) return false;
      }

      // Class modes filter
      if (filters.class_modes.length > 0) {
        const learningMode = getLearningMode(enquiry).toLowerCase();
        const hasMatchingMode = filters.class_modes.some(mode =>
          learningMode.includes(mode.toLowerCase())
        );
        if (!hasMatchingMode) return false;
      }

      return true;
    });

    setFilteredEnquiries(filtered);
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setActiveDropdown(null);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      subjects: [],
      class: [],
      class_modes: [],
    };
    setFilters(clearedFilters);
    setTempFilters(clearedFilters);
    setClassSearch("");
    setSubjectSearch("");
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  // Handle class selection
  const handleClassSelect = (className) => {
    setTempFilters(prev => {
      const currentClasses = [...(prev.class || [])];
      const classIndex = currentClasses.indexOf(className);
      
      if (classIndex > -1) {
        // Remove class if already selected
        currentClasses.splice(classIndex, 1);
      } else {
        // Add class if not selected
        currentClasses.push(className);
      }
      
      // Clear subjects when classes change
      return {
        ...prev,
        class: currentClasses,
        subjects: []
      };
    });
    setSubjectSearch("");
  };

  // Handle subject selection
  const handleSubjectSelect = (subject) => {
    setTempFilters(prev => {
      const currentSubjects = [...(prev.subjects || [])];
      const subjectIndex = currentSubjects.indexOf(subject);
      
      if (subjectIndex > -1) {
        currentSubjects.splice(subjectIndex, 1);
      } else {
        currentSubjects.push(subject);
      }
      
      return {
        ...prev,
        subjects: currentSubjects
      };
    });
  };

  // Handle learning mode selection
  const handleModeSelect = (mode) => {
    setTempFilters(prev => {
      const currentModes = [...(prev.class_modes || [])];
      const modeIndex = currentModes.indexOf(mode);
      
      if (modeIndex > -1) {
        currentModes.splice(modeIndex, 1);
      } else {
        currentModes.push(mode);
      }
      
      return {
        ...prev,
        class_modes: currentModes
      };
    });
  };

  // Get available subjects for selected classes
  const getAvailableSubjects = () => {
    if (!tempFilters.class || tempFilters.class.length === 0) {
      return [];
    }

    const allSubjects = new Set();
    classes.forEach(cls => {
      if (tempFilters.class.includes(cls.name) && cls.subjects) {
        cls.subjects.forEach(subj => {
          if (subj.name) allSubjects.add(subj.name);
        });
      }
    });
    return Array.from(allSubjects).sort();
  };

  const availableSubjects = getAvailableSubjects();
  const filteredSubjects = availableSubjects.filter(subject =>
    subject.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  // Format subjects for display
  const formatSubjects = (subjects) => {
    if (!subjects) return "No subjects specified";
    
    if (Array.isArray(subjects)) {
      if (subjects.length === 0) return "No subjects specified";
      return subjects.join(", ");
    }
    
    if (typeof subjects === 'string') {
      return subjects || "No subjects specified";
    }
    
    return "No subjects specified";
  };

  // Get primary subject for compact view
  const getPrimarySubject = (enquiry) => {
    if (enquiry.subject) return enquiry.subject;
    
    if (Array.isArray(enquiry.subjects) && enquiry.subjects.length > 0) {
      return enquiry.subjects[0];
    }
    
    return "No subject specified";
  };

  // Get learning mode for display - handles both learning_mode and class_modes
  const getLearningMode = (enquiry) => {
    // First check learning_mode
    if (enquiry.learning_mode) {
      return enquiry.learning_mode;
    }
    
    // Then check class_modes array
    if (Array.isArray(enquiry.class_modes) && enquiry.class_modes.length > 0) {
      return enquiry.class_modes.join(", ");
    }
    
    // Finally check class_modes as string
    if (enquiry.class_modes && typeof enquiry.class_modes === 'string') {
      return enquiry.class_modes;
    }
    
    return "Not specified";
  };

  // Calculate time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return "Recently";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Format location for display
  const formatLocation = (location) => {
    if (!location) return "Location not specified";
    
    if (typeof location === 'object') {
      // Handle different location object structures
      const { city, state, country, address, name, display_name } = location;
      
      // Try different combinations to get a meaningful location string
      if (city && state) {
        return `${city}, ${state}`;
      } else if (city) {
        return city;
      } else if (state) {
        return state;
      } else if (address) {
        return address;
      } else if (name) {
        return name;
      } else if (display_name) {
        return display_name;
      } else {
        // If it's an object but we can't extract meaningful data, try JSON string
        try {
          const locationStr = JSON.stringify(location);
          return locationStr.length > 100 ? "Location specified" : locationStr;
        } catch {
          return "Location specified";
        }
      }
    }
    
    // If it's a string, return it directly
    return location || "Location not specified";
  };

  // Pagination logic - now using filteredEnquiries
  const indexOfLast = currentPage * enquiriesPerPage;
  const indexOfFirst = indexOfLast - enquiriesPerPage;
  const currentEnquiries = Array.isArray(filteredEnquiries) 
    ? filteredEnquiries.slice(indexOfFirst, indexOfLast)
    : [];
  const totalPages = Math.ceil((Array.isArray(filteredEnquiries) ? filteredEnquiries.length : 0) / enquiriesPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setExpandedEnquiry(null);
      setShowContact({});
      setContactInfo({});
      setSuccessMessage({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleToggleDetails = (enquiry) => {
    if (expandedEnquiry?.id === enquiry.id) {
      setExpandedEnquiry(null);
    } else {
      setExpandedEnquiry(enquiry);
    }
  };

  // Check if user is logged in and get role
  const isLoggedIn = () => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    return !!token;
  };

  const getUserRole = () => {
    return localStorage.getItem("role")?.toLowerCase() || sessionStorage.getItem("role")?.toLowerCase();
  };

  // Check if student has valid user_id for contact viewing
  const hasValidStudentId = (enquiry) => {
    return enquiry.user_id && enquiry.user_id !== "undefined" && enquiry.user_id !== "null";
  };

  const showMessage = (enquiryId, message, type = "success") => {
    setSuccessMessage(prev => ({
      ...prev,
      [enquiryId]: message
    }));
    setTimeout(() => {
      setSuccessMessage(prev => ({
        ...prev,
        [enquiryId]: ""
      }));
    }, 3000);
  };

  // View Contact functionality
  const handleViewContact = async (enquiry) => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    if (getUserRole() !== 'tutor') {
      setContactError(prev => ({
        ...prev,
        [enquiry.id]: "Only tutors can view contact details"
      }));
      showMessage(enquiry.id, "Only tutors can view contact details", "error");
      return;
    }

    if (!hasValidStudentId(enquiry)) {
      setContactError(prev => ({
        ...prev,
        [enquiry.id]: "Student contact information is not available at the moment"
      }));
      showMessage(enquiry.id, "Student contact information is not available at the moment", "error");
      return;
    }

    try {
      setLoadingContact(prev => ({
        ...prev,
        [enquiry.id]: true
      }));
      setContactError(prev => ({
        ...prev,
        [enquiry.id]: ""
      }));
      
      const response = await apiClient.get(`/contacts/view/${enquiry.user_id}`);
      const { contact_info, contacts_remaining } = response.data;

      setContactInfo(prev => ({
        ...prev,
        [enquiry.id]: {
          phone: contact_info.mobile_number || contact_info.phone || "Not provided",
          email: contact_info.email || "Not provided"
        }
      }));

      setShowContact(prev => ({
        ...prev,
        [enquiry.id]: true
      }));
      setShowSubscribeMessage(false);

      showMessage(
        enquiry.id,
        `Contact viewed successfully. Remaining views: ${contacts_remaining}`
      );
    } catch (error) {
      console.error("Failed to view contact:", error);

      if (error.response?.status === 403) {
        setShowSubscribeMessage(true);
        setShowContact(prev => ({
          ...prev,
          [enquiry.id]: false
        }));
        setContactError(prev => ({
          ...prev,
          [enquiry.id]: "Subscription required to view contact details"
        }));
      } else if (error.response?.status === 401) {
        navigate('/login');
      } else if (error.response?.status === 404) {
        setContactError(prev => ({
          ...prev,
          [enquiry.id]: "Student contact information not found"
        }));
        showMessage(enquiry.id, "Student contact information not found", "error");
      } else {
        setContactError(prev => ({
          ...prev,
          [enquiry.id]: "Failed to load contact details. Please try again."
        }));
        showMessage(enquiry.id, "Failed to load contact details. Please try again.", "error");
      }
    } finally {
      setLoadingContact(prev => ({
        ...prev,
        [enquiry.id]: false
      }));
    }
  };

  const handleHideContact = (enquiryId) => {
    setShowContact(prev => ({
      ...prev,
      [enquiryId]: false
    }));
    setContactInfo(prev => ({
      ...prev,
      [enquiryId]: null
    }));
    setContactError(prev => ({
      ...prev,
      [enquiryId]: ""
    }));
  };

  const handleContactClick = (enquiry) => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    if (getUserRole() === 'tutor') {
      if (showContact[enquiry.id]) {
        handleHideContact(enquiry.id);
      } else {
        handleViewContact(enquiry);
      }
    } else {
      setContactError(prev => ({
        ...prev,
        [enquiry.id]: "Only tutors can view contact details"
      }));
      showMessage(enquiry.id, "Only tutors can view contact details", "error");
    }
  };

  // Send Enquiry functionality
  const handleSendEnquiry = async (enquiry) => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    try {
      const response = await apiClient.get(`/enquiries/check-sender-subscription`);

      if (response.data.allowed) {
        setSelectedEnquiry(enquiry);
        setShowEnquiryModal(true);
        setShowSubscribeMessage(false);
      } else {
        setShowSubscribeMessage(true);
      }
    } catch (error) {
      console.error("Failed to check subscription status:", error);
      setShowSubscribeMessage(true);
    }
  };

  // Check if contact viewing is available for this student
  const isContactAvailable = (enquiry) => {
    return hasValidStudentId(enquiry);
  };

  // Get button text based on user state
  const getButtonText = (enquiry) => {
    if (!isLoggedIn()) {
      return 'Login to View Contact';
    }

    const userRole = getUserRole();
    if (userRole !== 'tutor') {
      return 'Contact Student';
    }

    if (!isContactAvailable(enquiry)) {
      return 'Contact Unavailable';
    }

    if (loadingContact[enquiry.id]) {
      return 'Loading...';
    }

    return showContact[enquiry.id] ? 'Hide Contact' : 'View Contact';
  };

  // Get button icon based on user state
  const getButtonIcon = (enquiry) => {
    if (!isLoggedIn()) {
      return <User className="w-3 h-3" />;
    }

    const userRole = getUserRole();
    if (userRole !== 'tutor') {
      return <Mail className="w-3 h-3" />;
    }

    if (!isContactAvailable(enquiry)) {
      return <AlertCircle className="w-3 h-3" />;
    }

    if (loadingContact[enquiry.id]) {
      return <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>;
    }

    return showContact[enquiry.id] ? <X className="w-3 h-3" /> : <Eye className="w-3 h-3" />;
  };

  // Get button styling based on state
  const getButtonStyle = (enquiry) => {
    if (!isLoggedIn()) {
      return "bg-teal-500 hover:bg-teal-600 text-white";
    }

    const userRole = getUserRole();
    if (userRole !== 'tutor') {
      return "bg-teal-500 hover:bg-teal-600 text-white";
    }

    if (!isContactAvailable(enquiry)) {
      return "bg-gray-400 text-white cursor-not-allowed";
    }

    if (loadingContact[enquiry.id]) {
      return "bg-gray-400 text-white cursor-not-allowed";
    }

    return "bg-teal-500 hover:bg-teal-600 text-white";
  };

  // Check if button should be disabled
  const isButtonDisabled = (enquiry) => {
    if (!isLoggedIn()) return false;
    
    const userRole = getUserRole();
    if (userRole !== 'tutor') return false;
    
    return !isContactAvailable(enquiry) || loadingContact[enquiry.id];
  };

  // Filter Dropdown Component
  const FilterDropdown = ({ label, children, isActive, onToggle, disabled = false }) => (
    <div className="filter-dropdown relative">
      <label className="text-xs font-medium text-gray-700 block mb-2">{label}</label>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`w-full flex justify-between items-center p-3 border rounded-lg text-sm transition-all ${
          disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
            : "bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:border-gray-400"
        } ${isActive ? "border-[#35BAA3] ring-1 ring-[#35BAA3]" : ""}`}
      >
        <span className="truncate">
          {label === "Class/Grade" && (tempFilters.class?.length === 0 ? "All Classes" : `${tempFilters.class?.length} selected`)}
          {label === "Subjects" && (tempFilters.subjects?.length === 0 ? "All Subjects" : `${tempFilters.subjects?.length} selected`)}
          {label === "Learning Mode" && (tempFilters.class_modes?.length === 0 ? "All Modes" : `${tempFilters.class_modes?.length} selected`)}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isActive ? "rotate-180" : ""}`} />
      </button>
      
      {isActive && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );

  // Top Filters Component - UPDATED TO 3 COLUMNS
  const TopFilters = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Filter className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Filter Students</h3>
            <p className="text-xs text-gray-600 mt-1">Find students that match your criteria</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">{activeFiltersCount} active filter{activeFiltersCount !== 1 ? 's' : ''}</span>
              <div className="w-px h-4 bg-gray-300"></div>
            </div>
          )}
          <button
            onClick={handleClearFilters}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Filter Grid - UPDATED TO 3 COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {/* Class Filter */}
        <div className="relative filter-dropdown">
          <FilterDropdown
            label="Class/Grade"
            isActive={activeDropdown === "class"}
            onToggle={() => toggleDropdown("class")}
          >
            <div className="p-2">
              {/* Search Input */}
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                  <input
                    type="text"
                    value={classSearch}
                    onChange={(e) => setClassSearch(e.target.value)}
                    placeholder="Search classes..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#35BAA3] focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>
              
              {/* Class List */}
              <div className="max-h-48 overflow-y-auto p-2">
                {loadingClasses ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#35BAA3] border-t-transparent mx-auto"></div>
                    <p className="text-gray-500 text-xs mt-2">Loading classes...</p>
                  </div>
                ) : classes.filter(cls => 
                  cls.name?.toLowerCase().includes(classSearch.toLowerCase())
                ).length > 0 ? (
                  classes
                    .filter(cls => cls.name?.toLowerCase().includes(classSearch.toLowerCase()))
                    .map((cls) => (
                      <label 
                        key={cls.id} 
                        className="flex items-center gap-3 text-sm hover:bg-gray-50 p-2 rounded-lg cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={tempFilters.class?.includes(cls.name)}
                          onChange={() => handleClassSelect(cls.name)}
                          className="hidden"
                        />
                        <div className={`flex items-center justify-center w-4 h-4 border rounded transition-all ${
                          tempFilters.class?.includes(cls.name) 
                            ? "bg-[#35BAA3] border-[#35BAA3] text-white" 
                            : "border-gray-300 group-hover:border-[#35BAA3]"
                        }`}>
                          {tempFilters.class?.includes(cls.name) && (
                            <div className="w-2 h-2 bg-white rounded-sm" />
                          )}
                        </div>
                        <span className="flex-1">{cls.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {cls.subjects?.length || 0}
                        </span>
                      </label>
                    ))
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">
                    {classSearch ? "No classes found" : "No classes available"}
                  </p>
                )}
              </div>
            </div>
          </FilterDropdown>
        </div>

        {/* Subjects Filter */}
        <div className="relative filter-dropdown">
          <FilterDropdown
            label="Subjects"
            isActive={activeDropdown === "subjects"}
            onToggle={() => toggleDropdown("subjects")}
            disabled={!tempFilters.class || tempFilters.class.length === 0}
          >
            <div className="p-2">
              {/* Search Input */}
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                  <input
                    type="text"
                    value={subjectSearch}
                    onChange={(e) => setSubjectSearch(e.target.value)}
                    placeholder="Search subjects..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#35BAA3] focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>
              
              {/* Subjects List */}
              <div className="max-h-48 overflow-y-auto p-2">
                {filteredSubjects.length > 0 ? (
                  filteredSubjects.map((subject) => (
                    <label 
                      key={subject} 
                      className="flex items-center gap-3 text-sm hover:bg-gray-50 p-2 rounded-lg cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={tempFilters.subjects?.includes(subject)}
                        onChange={() => handleSubjectSelect(subject)}
                        className="hidden"
                      />
                      <div className={`flex items-center justify-center w-4 h-4 border rounded transition-all ${
                        tempFilters.subjects?.includes(subject) 
                          ? "bg-[#35BAA3] border-[#35BAA3] text-white" 
                          : "border-gray-300 group-hover:border-[#35BAA3]"
                      }`}>
                        {tempFilters.subjects?.includes(subject) && (
                          <div className="w-2 h-2 bg-white rounded-sm" />
                        )}
                      </div>
                      <span className="flex-1">{subject}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">
                    {subjectSearch ? "No subjects found" : "No subjects available for selected classes"}
                  </p>
                )}
              </div>
            </div>
          </FilterDropdown>
          {(!tempFilters.class || tempFilters.class.length === 0) && (
            <p className="text-gray-500 text-xs mt-1">Select a class first</p>
          )}
        </div>

        {/* Learning Mode Filter */}
        <div className="relative filter-dropdown">
          <FilterDropdown
            label="Learning Mode"
            isActive={activeDropdown === "class_modes"}
            onToggle={() => toggleDropdown("class_modes")}
          >
            <div className="p-3">
              <div className="space-y-2">
                {MODE_OPTIONS.map((mode) => (
                  <label 
                    key={mode} 
                    className="flex items-center gap-3 text-sm hover:bg-gray-50 p-2 rounded-lg cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={tempFilters.class_modes?.includes(mode)}
                      onChange={() => handleModeSelect(mode)}
                      className="hidden"
                    />
                    <div className={`flex items-center justify-center w-4 h-4 border rounded transition-all ${
                      tempFilters.class_modes?.includes(mode) 
                        ? "bg-[#35BAA3] border-[#35BAA3] text-white" 
                        : "border-gray-300 group-hover:border-[#35BAA3]"
                    }`}>
                      {tempFilters.class_modes?.includes(mode) && (
                        <div className="w-2 h-2 bg-white rounded-sm" />
                      )}
                    </div>
                    <span className="flex-1">{mode}</span>
                  </label>
                ))}
              </div>
            </div>
          </FilterDropdown>
        </div>
      </div>

      {/* Active Filter Tags - REMOVED LOCATION TAGS */}
      <div className="flex flex-wrap gap-2 mt-4">
        {tempFilters.class?.map((cls) => (
          <span key={cls} className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">
            Class: {cls}
            <button
              onClick={() => handleClassSelect(cls)}
              className="ml-1.5 hover:text-green-900 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {tempFilters.subjects?.map((subject) => (
          <span key={subject} className="inline-flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
            Subject: {subject}
            <button
              onClick={() => handleSubjectSelect(subject)}
              className="ml-1.5 hover:text-purple-900 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {tempFilters.class_modes?.map((mode) => (
          <span key={mode} className="inline-flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">
            Mode: {mode}
            <button
              onClick={() => handleModeSelect(mode)}
              className="ml-1.5 hover:text-orange-900 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={handleClearFilters}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
        >
          Clear
        </button>
        <button
          onClick={handleApplyFilters}
          className="px-6 py-2.5 bg-[#35BAA3] hover:bg-[#2da892] text-white rounded-lg transition-colors font-medium text-sm flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Apply Filters
        </button>
      </div>
    </div>
  );

  // Render pagination buttons
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
        <div className="text-xs text-gray-600">
          Showing {indexOfFirst + 1}-{Math.min(indexOfLast, filteredEnquiries.length)} of {filteredEnquiries.length} students
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
            }`}
          >
            <ChevronLeft className="w-3 h-3 mr-1" />
            Previous
          </button>

          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border min-w-[32px] ${
                      currentPage === page
                        ? "bg-[#35BAA3] text-white border-[#35BAA3]"
                        : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2 py-1.5 text-gray-500 text-xs">...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
            }`}
          >
            Next
            <ChevronRight className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>
    );
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.filter-dropdown')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ✅ Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-sm">Loading all enquiries...</p>
        </div>
      </div>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <div className="text-center bg-white p-6 rounded-xl shadow-md border border-red-200 max-w-md">
          <p className="text-base font-bold text-red-600 mb-2">Error</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={fetchEnquiries}
            className="bg-[#35BAA3] hover:bg-[#2da892] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-4">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto px-4">
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1">
              All Student Enquiries
            </h1>
            <p className="text-gray-600 text-xs max-w-2xl mx-auto">
              Browse through all students currently looking for tutors
            </p>
          </div>
        </div>

        {/* Top Filters */}
        <TopFilters />

        {/* Enquiries List */}
        <div className="flex-1">
          {!Array.isArray(filteredEnquiries) || filteredEnquiries.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {enquiries.length === 0 ? "No enquiries found" : "No matching enquiries"}
              </h3>
              <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
                {enquiries.length === 0 
                  ? "There are no student enquiries at the moment. Please check back later." 
                  : "No students match your current filters. Try adjusting your search criteria."}
              </p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="bg-[#35BAA3] hover:bg-[#2da892] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors mr-3"
                >
                  Clear All Filters
                </button>
              )}
              <button
                onClick={fetchEnquiries}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Refresh List
              </button>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-gray-600">
                  Found {filteredEnquiries.length} student{filteredEnquiries.length !== 1 ? 's' : ''} 
                  {enquiries.length !== filteredEnquiries.length && ` (filtered from ${enquiries.length})`}
                </div>
                <div className="text-xs text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
              </div>

              {/* Compact Cards Layout */}
              <div className="space-y-4">
                {currentEnquiries.map((enquiry) => (
                  <div key={enquiry.id || enquiry._id || Math.random()} 
                       className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all">
                    {/* Main Card Content */}
                    <div className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        {/* Student Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow flex-shrink-0">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-base font-semibold text-gray-900">
                                  {enquiry.name || "Unknown Student"}
                                </h3>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {getTimeAgo(enquiry.created_at)}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm mb-3">
                                {getPrimarySubject(enquiry)}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Class: {enquiry.class || "Not specified"}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Board: {enquiry.board || "Not specified"}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  Mode: {getLearningMode(enquiry)}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  Budget: ₹{parseFloat(enquiry.hourly_charges || 0).toFixed(0)}/hour
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleToggleDetails(enquiry)}
                            className="flex items-center justify-center gap-1 bg-[#35BAA3] hover:bg-[#2da892] text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors min-w-[120px]"
                          >
                            {expandedEnquiry?.id === enquiry.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                            {expandedEnquiry?.id === enquiry.id ? "Less" : "View Details"}
                          </button>
                          
                          {/* View Contact Button */}
                          <button
                            onClick={() => handleContactClick(enquiry)}
                            disabled={isButtonDisabled(enquiry)}
                            className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors min-w-[120px] ${getButtonStyle(enquiry)} ${
                              isButtonDisabled(enquiry) ? 'cursor-not-allowed opacity-70' : ''
                            }`}
                          >
                            {getButtonIcon(enquiry)}
                            {getButtonText(enquiry)}
                          </button>

                          {/* Send Enquiry Button */}
                          <button
                            onClick={() => handleSendEnquiry(enquiry)}
                            className="flex items-center justify-center gap-1 bg-[#0E2D63] hover:bg-[#0a1f45] text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors min-w-[120px]"
                          >
                            <Send className="w-4 h-4" />
                            Send Enquiry
                          </button>
                        </div>
                      </div>

                      {/* Success/Error Message */}
                      {successMessage[enquiry.id] && (
                        <div className={`mt-3 p-2 border rounded text-xs text-center ${
                          successMessage[enquiry.id].includes("successfully") 
                            ? "bg-green-100 border-green-400 text-green-700"
                            : "bg-red-100 border-red-400 text-red-700"
                        }`}>
                          {successMessage[enquiry.id]}
                        </div>
                      )}

                      {/* Contact Information */}
                      {showContact[enquiry.id] && contactInfo[enquiry.id] && (
                        <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-200 animate-fade-in relative">
                          <button
                            onClick={() => handleHideContact(enquiry.id)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          
                          <div className="flex items-center text-sm text-gray-700">
                            <Phone className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                            <span className="font-medium min-w-[50px]">Phone:</span>
                            <span className="ml-2 text-gray-900 font-mono">{contactInfo[enquiry.id].phone}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-700">
                            <Mail className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                            <span className="font-medium min-w-[50px]">Email:</span>
                            <span className="ml-2 text-gray-900 truncate">{contactInfo[enquiry.id].email}</span>
                          </div>
                        </div>
                      )}

                      {/* Contact Error */}
                      {contactError[enquiry.id] && (
                        <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
                          {contactError[enquiry.id]}
                        </div>
                      )}

                      {/* Location & Posted Info */}
                      <div className="mt-4 pt-3 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Location:</span>
                          <span className="truncate">{formatLocation(enquiry.location)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Posted:</span>
                          <span>{new Date(enquiry.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details Section */}
                    {expandedEnquiry?.id === enquiry.id && (
                      <div className="border-t border-gray-200 bg-gray-50 p-6 animate-fade-in">
                        <div className="space-y-6">
                          {/* Personal Information */}
                          <div>
                            <h4 className="text-base font-semibold text-gray-900 mb-4">Personal Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <label className="text-sm font-medium text-gray-700">Name</label>
                                <p className="mt-1 text-gray-900">{enquiry.name || "Not specified"}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">Class/Grade</label>
                                <p className="mt-1 text-gray-900">{enquiry.class || "Not specified"}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">Educational Board</label>
                                <p className="mt-1 text-gray-900">{enquiry.board || "Not specified"}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">Learning Mode</label>
                                <p className="mt-1 text-gray-900">{getLearningMode(enquiry)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Location Information */}
                          <div>
                            <h4 className="text-base font-semibold text-gray-900 mb-3">Location</h4>
                            <p className="text-gray-900 text-sm">{formatLocation(enquiry.location)}</p>
                          </div>

                          {/* Subjects & Budget */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Subjects</h4>
                              <div className="flex flex-wrap gap-2">
                                {(enquiry.subjects || []).map((subject, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                  >
                                    {subject}
                                  </span>
                                ))}
                                {(!enquiry.subjects || enquiry.subjects.length === 0) && (
                                  <p className="text-gray-500 text-sm">No subjects specified</p>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Budget</h4>
                              <p className="text-xl font-bold text-green-700">
                                ₹{parseFloat(enquiry.hourly_charges || 0).toFixed(0)}/hour
                              </p>
                            </div>
                          </div>

                          {/* Additional Information */}
                          <div>
                            <h4 className="text-base font-semibold text-gray-900 mb-3">Additional Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <label className="font-medium text-gray-700">Start Timeline</label>
                                <p className="mt-1 text-gray-900">{enquiry.start_timeline || "Not specified"}</p>
                              </div>
                              <div>
                                <label className="font-medium text-gray-700">Posted Date</label>
                                <p className="mt-1 text-gray-900">
                                  {new Date(enquiry.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Close Button */}
                          <div className="flex justify-end pt-4 border-t border-gray-300">
                            <button
                              onClick={() => setExpandedEnquiry(null)}
                              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                            >
                              <X className="w-4 h-4" />
                              Close Details
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {renderPagination()}

              {/* Refresh Button */}
              <div className="text-center mt-6">
                <button
                  onClick={fetchEnquiries}
                  className="inline-flex items-center px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Refresh List
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        receiverId={selectedEnquiry?.user_id}
        receiverName={selectedEnquiry?.name}
      />

      {/* Subscription Modal */}
      {showSubscribeMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Subscription Required
              </h2>
              <p className="text-gray-600 mb-6">
                You need an active subscription to view student contact details or send enquiries. 
                Subscribe now to connect with students directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setShowSubscribeMessage(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => navigate("/tutor_subscription_plan")}
                  className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-medium"
                >
                  View Subscription Plans
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEnquiries;