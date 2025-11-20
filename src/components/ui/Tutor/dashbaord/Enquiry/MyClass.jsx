import React, { useState, useEffect } from "react";
import { ArrowLeft, User, ChevronLeft, ChevronRight, Eye, X, ChevronDown, ChevronUp, Phone, Mail, Send, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../../../api/apiclient";
import { apiUrl } from "../../../../../api/apiUtl";
import EnquiryModal from "./RaiseEnquiry";
import { getProfile } from "../../../../../api/repository/profile.repository";

const MyClass = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [tutorClasses, setTutorClasses] = useState([]);
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
  const enquiriesPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    fetchTutorProfileAndEnquiries();
  }, []);

  // Fetch tutor profile and enquiries
  const fetchTutorProfileAndEnquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch tutor profile to get their classes
      const profile = await getProfile();
      console.log("📋 Tutor Profile:", profile);
      
      // Try multiple possible property names for classes
      const tutorClassData = 
        profile.classes_taught || 
        profile.classesTaught || 
        profile.classes || 
        profile.teaching_classes ||
        [];
      
      console.log("📚 Tutor teaches classes:", tutorClassData);
      setTutorClasses(tutorClassData);
      
      // Fetch enquiries
      await fetchEnquiries(tutorClassData);
      
    } catch (err) {
      console.error("❌ Profile fetch error:", err);
      // Continue to fetch enquiries even if profile fails
      await fetchEnquiries([]);
    }
  };

  const fetchEnquiries = async (tutorClassesParam = tutorClasses) => {
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
      
      console.log(`📊 Total students fetched: ${enquiriesData.length}`);
      setEnquiries(enquiriesData);
      
      // Filter enquiries by tutor's classes
      const matchingEnquiries = filterEnquiriesByTutorClasses(enquiriesData, tutorClassesParam);
      setFilteredEnquiries(matchingEnquiries);
      
      console.log(`✅ Matching students: ${matchingEnquiries.length}`);
      
    } catch (err) {
      console.error("Fetch error:", err);
      setError(`Failed to load enquiries: ${err.response?.data?.message || err.message}`);
      setEnquiries([]);
      setFilteredEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  // Normalize class string for comparison
  const normalizeClass = (classValue) => {
    if (!classValue) return '';
    
    const str = classValue.toString().toLowerCase().trim();
    
    return str
      .replace(/class\s*/gi, '')
      .replace(/grade\s*/gi, '')
      .replace(/std\.?\s*/gi, '')
      .replace(/standard\s*/gi, '')
      .replace(/(th|rd|nd|st)\b/gi, '')
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '');
  };

  // Check if student class matches tutor's classes
  const doesClassMatch = (studentClass, tutorClassesParam = tutorClasses) => {
    if (!studentClass || !tutorClassesParam || tutorClassesParam.length === 0) {
      return false;
    }
    
    const normalizedStudentClass = normalizeClass(studentClass);
    if (!normalizedStudentClass) {
      return false;
    }
    
    const matchFound = tutorClassesParam.some(tutorClass => {
      const normalizedTutorClass = normalizeClass(tutorClass);
      if (!normalizedTutorClass) {
        return false;
      }
      
      // 1. Exact match
      if (normalizedStudentClass === normalizedTutorClass) {
        return true;
      }
      
      // 2. Number extraction
      const studentNumber = normalizedStudentClass.replace(/\D/g, '');
      const tutorNumber = normalizedTutorClass.replace(/\D/g, '');
      
      if (studentNumber && tutorNumber && studentNumber === tutorNumber) {
        return true;
      }
      
      // 3. Common class aliases
      const classAliases = {
        '1': ['1', 'i', 'first', 'one', '1st'],
        '2': ['2', 'ii', 'second', 'two', '2nd'],
        '3': ['3', 'iii', 'third', 'three', '3rd'],
        '4': ['4', 'iv', 'fourth', 'four', '4th'],
        '5': ['5', 'v', 'fifth', 'five', '5th'],
        '6': ['6', 'vi', 'sixth', 'six', '6th'],
        '7': ['7', 'vii', 'seventh', 'seven', '7th'],
        '8': ['8', 'viii', 'eighth', 'eight', '8th'],
        '9': ['9', 'ix', 'ninth', 'nine', '9th'],
        '10': ['10', 'x', 'tenth', 'ten', '10th'],
        '11': ['11', 'xi', 'eleventh', '11th'],
        '12': ['12', 'xii', 'twelfth', '12th']
      };
      
      for (const [mainClass, aliases] of Object.entries(classAliases)) {
        if (aliases.includes(normalizedStudentClass) && aliases.includes(normalizedTutorClass)) {
          return true;
        }
      }
      
      // 4. Substring match
      if (normalizedStudentClass.includes(normalizedTutorClass) || 
          normalizedTutorClass.includes(normalizedStudentClass)) {
        return true;
      }
      
      return false;
    });
    
    return matchFound;
  };

  // Filter enquiries by tutor's classes
  const filterEnquiriesByTutorClasses = (enquiriesData, tutorClassesParam = tutorClasses) => {
    if (!tutorClassesParam || tutorClassesParam.length === 0) {
      console.log("❌ No tutor classes configured - showing all students");
      return enquiriesData; // Show all if no classes configured
    }
    
    console.log("🔍 Filtering students for classes:", tutorClassesParam);
    
    const matching = enquiriesData.filter((enquiry) => {
      return doesClassMatch(enquiry.class, tutorClassesParam);
    });
    
    console.log(`📊 Filter result: ${matching.length}/${enquiriesData.length} students match`);
    return matching;
  };

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

  // Pagination logic - use filteredEnquiries instead of enquiries
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

  // Format location for display
  const formatLocation = (location) => {
    if (!location) return "Location not specified";
    
    if (typeof location === 'object') {
      const { city, state, country } = location;
      return [city, state, country].filter(Boolean).join(", ") || "Location not specified";
    }
    
    return location || "Location not specified";
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

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-sm">Loading student enquiries...</p>
        </div>
      </div>
    );
  };

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <div className="text-center bg-white p-6 rounded-xl shadow-md border border-red-200 max-w-md">
          <p className="text-base font-bold text-red-600 mb-2">Error</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={fetchTutorProfileAndEnquiries}
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
        <div className="text-center mb-4">
          <div className="mx-auto px-4">
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1">
              Student Enquiries for Your Classes
            </h1>
            <p className="text-gray-600 text-xs max-w-2xl mx-auto">
              {tutorClasses.length > 0 ? (
                <>
                  Showing students looking for tutors in your classes: 
                  <span className="text-teal-600 font-medium ml-1">
                    {tutorClasses.join(", ")}
                  </span>
                </>
              ) : (
                "Configure your teaching classes in your profile to see matching student enquiries"
              )}
            </p>
          </div>
        </div>

        {/* Filter Info Banner */}
        {tutorClasses.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Showing {filteredEnquiries.length} student{filteredEnquiries.length !== 1 ? 's' : ''} matching your classes
                  </p>
                  <p className="text-xs text-blue-600 mt-0.5">
                    {enquiries.length > filteredEnquiries.length && 
                      `${enquiries.length - filteredEnquiries.length} students in other classes not shown`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {!Array.isArray(filteredEnquiries) || filteredEnquiries.length === 0 ? (
            <div className="text-center py-6 bg-white rounded-lg border shadow-sm">
              <User className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {tutorClasses.length === 0 ? "No Classes Configured" : "No Matching Enquiries"}
              </h3>
              <p className="text-gray-600 text-xs mb-3">
                {tutorClasses.length === 0
                  ? "Set up your teaching classes in your profile to see relevant student enquiries"
                  : `No students are currently looking for tutors in your classes (${tutorClasses.join(', ')})`
                }
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {tutorClasses.length === 0 && (
                  <button
                    onClick={() => navigate('/tutor-profile')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  >
                    Set Up Classes
                  </button>
                )}
                <button
                  onClick={fetchTutorProfileAndEnquiries}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Compact Cards Layout */}
              <div className="space-y-3">
                {currentEnquiries.map((enquiry) => (
                  <div key={enquiry.id || enquiry._id || Math.random()} 
                       className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all">
                    {/* Main Card Content */}
                    <div className="p-3">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                        {/* Student Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow flex-shrink-0">
                              <User className="w-3 h-3 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-semibold text-gray-900">
                                  {enquiry.name || "Unknown Student"}
                                </h3>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                                  ✓ Matches Your Classes
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm mb-2">
                                {getPrimarySubject(enquiry)}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">
                                  Class: <span className="font-semibold ml-1">{enquiry.class || "Not specified"}</span>
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Board: {enquiry.board || "Not specified"}
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  Mode: {getLearningMode(enquiry)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-1.5">
                          <button
                            onClick={() => handleToggleDetails(enquiry)}
                            className="flex items-center gap-1 bg-[#35BAA3] hover:bg-[#2da892] text-white px-2 py-1.5 rounded-lg text-xs font-medium transition-colors"
                          >
                            {expandedEnquiry?.id === enquiry.id ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                            {expandedEnquiry?.id === enquiry.id ? "Less" : "View Details"}
                          </button>
                          
                          {/* View Contact Button */}
                          <button
                            onClick={() => handleContactClick(enquiry)}
                            disabled={isButtonDisabled(enquiry)}
                            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${getButtonStyle(enquiry)} ${
                              isButtonDisabled(enquiry) ? 'cursor-not-allowed opacity-70' : ''
                            }`}
                          >
                            {getButtonIcon(enquiry)}
                            {getButtonText(enquiry)}
                          </button>

                          {/* Send Enquiry Button */}
                          <button
                            onClick={() => handleSendEnquiry(enquiry)}
                            className="flex items-center gap-1 bg-[#0E2D63] hover:bg-[#0a1f45] text-white px-2 py-1.5 rounded-lg text-xs font-medium transition-colors"
                          >
                            <Send className="w-3 h-3" />
                            Send Enquiry
                          </button>
                        </div>
                      </div>

                      {/* Success/Error Message */}
                      {successMessage[enquiry.id] && (
                        <div className={`mt-2 p-2 border rounded text-xs text-center ${
                          successMessage[enquiry.id].includes("successfully") 
                            ? "bg-green-100 border-green-400 text-green-700"
                            : "bg-red-100 border-red-400 text-red-700"
                        }`}>
                          {successMessage[enquiry.id]}
                        </div>
                      )}

                      {/* Contact Information */}
                      {showContact[enquiry.id] && contactInfo[enquiry.id] && (
                        <div className="mt-2 bg-gray-50 rounded p-2 space-y-1 border border-gray-200 animate-fade-in relative">
                          <button
                            onClick={() => handleHideContact(enquiry.id)}
                            className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          
                          <div className="flex items-center text-xs text-gray-700">
                            <Phone className="w-3 h-3 mr-1 text-blue-500 flex-shrink-0" />
                            <span className="font-medium min-w-[40px]">Phone:</span>
                            <span className="ml-1 text-gray-900 font-mono">{contactInfo[enquiry.id].phone}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-700">
                            <Mail className="w-3 h-3 mr-1 text-green-500 flex-shrink-0" />
                            <span className="font-medium min-w-[40px]">Email:</span>
                            <span className="ml-1 text-gray-900 truncate">{contactInfo[enquiry.id].email}</span>
                          </div>
                        </div>
                      )}

                      {/* Contact Error */}
                      {contactError[enquiry.id] && (
                        <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-xs text-center">
                          {contactError[enquiry.id]}
                        </div>
                      )}

                      {/* Quick Info Row */}
                      <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Location:</span>
                          <span className="truncate">{formatLocation(enquiry.location)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Budget:</span>
                          <span className="font-semibold text-green-700">
                            ₹{parseFloat(enquiry.hourly_charges || 0).toFixed(0)}/hour
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Posted:</span>
                          <span>{new Date(enquiry.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details Section */}
                    {expandedEnquiry?.id === enquiry.id && (
                      <div className="border-t border-gray-200 bg-gray-50 p-4 animate-fade-in">
                        <div className="space-y-4">
                          {/* Personal Information */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Personal Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div>
                                <label className="text-xs font-medium text-gray-700">Name</label>
                                <p className="mt-1 text-gray-900">{enquiry.name || "Not specified"}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-700">Class/Grade</label>
                                <div className="mt-1">
                                  <p className="text-gray-900">{enquiry.class || "Not specified"}</p>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                                    ✓ Matches your teaching classes
                                  </span>
                                </div>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-700">Educational Board</label>
                                <p className="mt-1 text-gray-900">{enquiry.board || "Not specified"}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-700">Learning Mode</label>
                                <p className="mt-1 text-gray-900">{getLearningMode(enquiry)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Location Information */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Location</h4>
                            <p className="text-gray-900 text-sm">{formatLocation(enquiry.location)}</p>
                          </div>

                          {/* Subjects & Budget */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-3">Subjects</h4>
                              <div className="flex flex-wrap gap-2">
                                {(enquiry.subjects || []).map((subject, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {subject}
                                  </span>
                                ))}
                                {(!enquiry.subjects || enquiry.subjects.length === 0) && (
                                  <p className="text-gray-500 text-sm">No subjects specified</p>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mt-2">
                                <strong>All Subjects:</strong> {formatSubjects(enquiry.subjects)}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-3">Budget</h4>
                              <p className="text-lg font-bold text-green-700">
                                ₹{parseFloat(enquiry.hourly_charges || 0).toFixed(0)}/hour
                              </p>
                            </div>
                          </div>

                          {/* Additional Information */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
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
                          <div className="flex justify-end pt-3 border-t border-gray-300">
                            <button
                              onClick={() => setExpandedEnquiry(null)}
                              className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-100 transition-colors"
                            >
                              <X className="w-3 h-3" />
                              Close Details
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Page Info */}
              <div className="text-center mt-4 mb-2">
                <p className="text-gray-600 text-xs">
                  Page {currentPage} of {totalPages} • 
                  Showing {currentEnquiries.length} student{currentEnquiries.length !== 1 ? 's' : ''} for your classes
                </p>
              </div>

              {/* Pagination */}
              {renderPagination()}

              {/* Refresh Button */}
              <div className="text-center mt-4">
                <button
                  onClick={fetchTutorProfileAndEnquiries}
                  className="inline-flex items-center px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-medium transition-colors"
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

export default MyClass;