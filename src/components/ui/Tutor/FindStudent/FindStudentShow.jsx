import React, { useState, useEffect } from "react";
import { searchStudents } from "../../../../api/repository/Filter_student.repository";
import FilterSidebar from "./FilterSidebar";
import StudentCard from "./StudentCard";
import StudentProfile from "./StudentProfile";
import { Filter, X, ChevronLeft, ChevronRight } from "lucide-react";

// Utility functions for user-based bookmark storage
const getUserBookmarksKey = (userId) => `studentBookmarks_${userId}`;

const getCurrentUserId = () => {
  // Get user ID from authentication context or localStorage
  // This should return the same ID for the same user across sessions
  const userData = localStorage.getItem('userData');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      // Use a consistent identifier - prefer user ID over session-specific tokens
      return user.id || user.userId || user._id || 'anonymous';
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  return 'anonymous'; // Fallback for non-logged in users
};

const getUserBookmarks = (userId) => {
  try {
    const key = getUserBookmarksKey(userId);
    const savedBookmarks = localStorage.getItem(key);
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    return [];
  }
};

const saveUserBookmarks = (userId, bookmarks) => {
  try {
    const key = getUserBookmarksKey(userId);
    localStorage.setItem(key, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Error saving bookmarks:', error);
  }
};

const FindStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(20);

  // Check if device is mobile and get current user
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    const initializeUser = () => {
      const userId = getCurrentUserId();
      setCurrentUserId(userId);
    };

    checkDevice();
    initializeUser();
    window.addEventListener('resize', checkDevice);
    
    // Listen for authentication changes
    window.addEventListener('storage', initializeUser);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('storage', initializeUser);
    };
  }, []);

  // Load bookmarks for current user when component mounts or user changes
  useEffect(() => {
    if (currentUserId) {
      const bookmarks = getUserBookmarks(currentUserId);
      // Update students with bookmark status when user changes
      setStudents(prevStudents => 
        prevStudents.map(student => ({
          ...student,
          isBookmarked: bookmarks.some(bm => bm.user_id === student.user_id)
        }))
      );
    }
  }, [currentUserId]);

  // Reset to first page when filters change or new students are loaded
  useEffect(() => {
    setCurrentPage(1);
  }, [students]);

  const transformFiltersForAPI = (filters) => {
    const apiFilters = {};
    if (filters.name) apiFilters.name = filters.name;
    if (filters.subjects && filters.subjects.length > 0) apiFilters.subjects = filters.subjects;
    if (filters.class) apiFilters.classes = filters.class;
    if (filters.board) apiFilters.board = filters.board;
    if (filters.availability && filters.availability.length > 0) apiFilters.availability = filters.availability;
    if (filters.languages && filters.languages.length > 0) apiFilters.languages = filters.languages;
    if (filters.tutor_gender_preference) apiFilters.tutor_gender_preference = filters.tutor_gender_preference;
    if (filters.hourly_charges_min || filters.hourly_charges_max) {
      apiFilters.budgetMin = filters.hourly_charges_min;
      apiFilters.budgetMax = filters.hourly_charges_max;
    }
    if (filters.class_modes && filters.class_modes.length > 0) apiFilters.class_modes = filters.class_modes;
    if (filters.school_name) apiFilters.school_name = filters.school_name;
    if (filters.location) apiFilters.location = filters.location;
    return apiFilters;
  };

  const fetchStudents = async (filters = {}) => {
    try {
      setLoading(true);
      setNoResults(false);

      const apiFilters = transformFiltersForAPI(filters);
      const res = await searchStudents(apiFilters);

      if (res && res.length > 0) {
        // Load bookmarks for current user and update student data
        const userId = getCurrentUserId();
        const bookmarks = getUserBookmarks(userId);
        
        const studentsWithBookmarks = res.map(student => ({
          ...student,
          isBookmarked: bookmarks.some(bm => bm.user_id === student.user_id)
        }));
        
        setStudents(studentsWithBookmarks);
      } else {
        setStudents([]);
        setNoResults(true);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectionRequest = async (studentId, studentName) => {
    try {
      setStudents(prevStudents =>
        prevStudents.map(student =>
          student.user_id === studentId
            ? { ...student, connectionStatus: "requested" }
            : student
        )
      );
    } catch (error) {
      console.error("Failed to send connection request:", error);
    }
  };

  const handleBookmarkStudent = async (studentId, studentName) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        console.error('No user ID found');
        return;
      }

      const bookmarks = getUserBookmarks(userId);
      const student = students.find(s => s.user_id === studentId);
      
      if (!student) return;

      let updatedBookmarks;
      const isCurrentlyBookmarked = bookmarks.some(bm => bm.user_id === studentId);

      if (isCurrentlyBookmarked) {
        // Remove bookmark
        updatedBookmarks = bookmarks.filter(bm => bm.user_id !== studentId);
      } else {
        // Add bookmark
        updatedBookmarks = [...bookmarks, {
          user_id: student.user_id,
          name: student.name,
          class: student.class,
          subjects: student.subjects,
          profile_photo: student.profile_photo,
          Location: student.Location,
          User: student.User,
          timestamp: new Date().toISOString()
        }];
      }

      // Save to user-specific storage
      saveUserBookmarks(userId, updatedBookmarks);

      // Update UI state
      setStudents(prevStudents =>
        prevStudents.map(student =>
          student.user_id === studentId
            ? { ...student, isBookmarked: !isCurrentlyBookmarked }
            : student
        )
      );

      // Update selected student if it's the same one
      if (selectedStudent && selectedStudent.user_id === studentId) {
        setSelectedStudent(prev => ({
          ...prev,
          isBookmarked: !isCurrentlyBookmarked
        }));
      }

      // Trigger storage event for other components (like Bookmark page)
      window.dispatchEvent(new Event('storage'));

    } catch (error) {
      console.error("Failed to bookmark student:", error);
    }
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const closeFilters = () => {
    setShowFilters(false);
  };

  // Pagination calculations
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(students.length / studentsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = isMobile ? 3 : 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
        {/* Mobile Filter Toggle Button */}
        {isMobile && (
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Find Students</h1>
            <button
              onClick={toggleFilters}
              className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              {students.length > 0 && (
                <span className="bg-white text-teal-500 rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {students.length}
                </span>
              )}
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <div className={`${isMobile ? 'fixed inset-0 z-50' : 'w-full lg:w-1/4'} ${!isMobile || showFilters ? 'block' : 'hidden'}`}>
            <FilterSidebar 
              onApply={fetchStudents} 
              isOpen={showFilters}
              onClose={closeFilters}
              isMobile={isMobile}
              showHeading={isMobile}
            />
          </div>

          {/* Students List */}
          <div className={`flex-1 ${isMobile && showFilters ? 'hidden' : 'block'}`}>
            {/* Desktop Title */}
            {!isMobile && (
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Find Students</h1>
                <div className="text-lg text-gray-600">
                  Showing {Math.min(students.length, studentsPerPage)} of {students.length} {students.length === 1 ? "student" : "students"} found
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
              </div>
            ) : students.length > 0 ? (
              <>
                {/* Mobile Results Count */}
                {isMobile && (
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">
                      Showing {Math.min(students.length, studentsPerPage)} of {students.length} {students.length === 1 ? "student" : "students"} found
                    </h2>
                  </div>
                )}
                <div className="space-y-4">
                  {currentStudents.map((student) => (
                    <StudentCard
                      key={student.user_id}
                      student={student}
                      onConnectionRequest={handleConnectionRequest}
                      onBookmark={handleBookmarkStudent}
                      onViewProfile={handleViewProfile}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Page Info */}
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>
                    
                    {/* Pagination Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Previous Button */}
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border ${
                          currentPage === 1
                            ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                            : 'text-teal-600 border-teal-300 hover:bg-teal-50'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {/* Page Numbers */}
                      <div className="flex gap-1">
                        {getPageNumbers().map(number => (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium ${
                              currentPage === number
                                ? 'bg-teal-500 text-white'
                                : 'text-gray-600 border border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {number}
                          </button>
                        ))}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg border ${
                          currentPage === totalPages
                            ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                            : 'text-teal-600 border-teal-300 hover:bg-teal-50'
                        }`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Items per page info */}
                    <div className="text-sm text-gray-500">
                      {studentsPerPage} per page
                    </div>
                  </div>
                )}
              </>
            ) : noResults ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  No students found matching your criteria
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => fetchStudents({})}
                    className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition-colors"
                  >
                    Reset Filters
                  </button>
                  {isMobile && (
                    <button
                      onClick={toggleFilters}
                      className="border border-teal-500 text-teal-500 px-4 py-2 rounded hover:bg-teal-50 transition-colors"
                    >
                      Modify Filters
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <StudentProfile
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onBookmark={handleBookmarkStudent}
        />
      )}
    </div>
  );
};

export default FindStudents;