import React, { useState, useEffect } from "react";
import { searchStudents } from "../../../../api/repository/Filter_student.repository";
import FilterSidebar from "./FilterSidebar";
import StudentCard from "./StudentCard";
import StudentProfile from "./StudentProfile";
import { Filter, X } from "lucide-react";

const FindStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Transform filters to match backend API expectations
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
        setStudents(res);
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

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const closeFilters = () => {
    setShowFilters(false);
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
              showHeading={isMobile} // Only show heading on mobile
            />
          </div>

          {/* Students List */}
          <div className={`flex-1 ${isMobile && showFilters ? 'hidden' : 'block'}`}>
            {/* Desktop Title */}
            {!isMobile && (
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Find Students</h1>
                <div className="text-lg text-gray-600">
                  {students.length} {students.length === 1 ? "student" : "students"} found
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
                      {students.length} {students.length === 1 ? "student" : "students"} found
                    </h2>
                  </div>
                )}
                <div className="space-y-4">
                  {students.map((student) => (
                    <StudentCard
                      key={student.user_id}
                      student={student}
                      onConnectionRequest={handleConnectionRequest}
                      onViewProfile={handleViewProfile}
                    />
                  ))}
                </div>
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
        />
      )}
    </div>
  );
};

export default FindStudents;