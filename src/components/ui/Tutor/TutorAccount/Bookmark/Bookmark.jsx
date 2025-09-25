import React, { useState, useEffect } from "react";
import { Bookmark, Filter, X } from "lucide-react";
import StudentCard from "../../FindStudent/StudentCard";
import StudentProfile from "../../FindStudent/StudentProfile";
import { apiClient } from "../../../../../api/apiclient";
import { apiUrl } from "../../../../../api/apiUtl";

const BookmarkedStudents = () => {
  const [bookmarkedStudents, setBookmarkedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState(null);

  // Generate unique key for each student
  const generateStudentKey = (student) => {
    if (!student) return Math.random().toString(36);

    // Use combination of user_id and id if available, fallback to random
    if (student.user_id && student.id) {
      return `${student.user_id}-${student.id}`;
    }
    return student.user_id || student.id || Math.random().toString(36);
  };

  // Check if token exists and add to requests
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      console.warn('No token found - requests may fail');
    }
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch bookmarked students
  const fetchBookmarkedStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the correct endpoint from apiUrl or fallback
      const endpoint = apiUrl.bookmarks?.list || '/api/bookmarks';
      const response = await apiClient.get(endpoint, {
        headers: getAuthHeaders()
      });

      // Handle different response structures
      if (response.data) {
        let students = [];

        // Check various possible response structures
        if (response.data.bookmarks) {
          students = response.data.bookmarks;
        } else if (response.data.data) {
          students = response.data.data;
        } else if (Array.isArray(response.data)) {
          students = response.data;
        } else if (response.data.success && response.data.data) {
          students = response.data.data;
        } else {
          throw new Error('Invalid response structure');
        }

        // Ensure each student has a unique key
        setBookmarkedStudents(students.map(student => ({
          ...student,
          _key: generateStudentKey(student)
        })));
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error("Error fetching bookmarked students:", error);

      // More specific error messages
      if (error.code === 'ERR_NETWORK' || error.message.includes('Failed to fetch')) {
        setError("Unable to connect to server. Please check your connection.");
      } else if (error.response?.status === 401) {
        setError("Please log in to view your bookmarks");
      } else if (error.response?.status === 404) {
        setError("Bookmarks endpoint not found");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Failed to load bookmarked students");
      }
    } finally {
      setLoading(false);
    }
  };

  // Bookmark toggle function with better error handling
  const toggleBookmark = async (studentId, bookmarked) => {
    try {
      const endpoint = apiUrl.bookmarks?.toggle || '/api/bookmarks/toggle';
      const response = await apiClient.post(endpoint, {
        bookmarked_user_id: studentId
      }, {
        headers: getAuthHeaders()
      });

      if (response.data) {
        const result = response.data;

        // Remove the student from the list if unbookmarked
        if (result.is_bookmarked === false) {
          setBookmarkedStudents(prev =>
            prev.filter(student => student.user_id !== studentId)
          );
        }

        return result.is_bookmarked;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);

      if (error.code === 'ERR_NETWORK' || error.message.includes('Failed to fetch')) {
        throw new Error("Network error: Please check your connection");
      }

      // Re-fetch to ensure consistency
      fetchBookmarkedStudents();
      throw error;
    }
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
  };

  useEffect(() => {
    fetchBookmarkedStudents();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={fetchBookmarkedStudents}
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-teal-500" fill="currentColor" />
              Bookmarked Students
            </h1>
            <p className="text-gray-600 mt-1">
              {bookmarkedStudents.length} {bookmarkedStudents.length === 1 ? "student" : "students"} bookmarked
            </p>
          </div>
        </div>

        {/* Bookmarked Students List */}
        {bookmarkedStudents.length > 0 ? (
          <div className="space-y-4">
            {bookmarkedStudents.map((student) => (
              <StudentCard
                key={student._key || generateStudentKey(student)}
                student={student}
                onViewProfile={handleViewProfile}
                onBookmarkToggle={toggleBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500 text-lg mb-2">No bookmarked students yet</div>
            <p className="text-gray-400">Start browsing students and bookmark your favorites!</p>
          </div>
        )}
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <StudentProfile
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

export default BookmarkedStudents; 