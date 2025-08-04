import React, { useState, useEffect } from "react";
import { searchStudents } from "../../../../api/repository/Filter_student.repository";
import FilterSidebar from "./FilterSidebar";
import StudentCard from "./StudentCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FindStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const fetchStudents = async (filters = {}) => {
    try {
      setLoading(true);
      setNoResults(false);

      const res = await searchStudents(filters);

      if (res && res.length > 0) {
        setStudents(res);
        toast.success(`${res.length} student(s) found`);
      } else {
        setStudents([]);
        setNoResults(true);
        toast.info("No students found matching your criteria");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
      setNoResults(true);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(); // initial load
  }, []);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Outer Box */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left - Filter Sidebar */}
          <div className="w-full lg:w-1/4">
            <FilterSidebar onApply={fetchStudents} />
          </div>

          {/* Right - Students List */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
              </div>
            ) : students.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">
                    {students.length} {students.length === 1 ? "student" : "students"} found
                  </h2>
                </div>
                <div className="space-y-4">
                  {students.map((student) => (
                    <StudentCard key={student.user_id} student={student} />
                  ))}
                </div>
              </>
            ) : noResults ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  No students found matching your criteria
                </div>
                <button
                  onClick={() => fetchStudents({})}
                  className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
                >
                  Reset Filters
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindStudents;
