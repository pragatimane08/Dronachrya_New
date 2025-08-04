// src/pages/admin/students/ManageStudent.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  EyeIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { studentRepository } from "../../../../api/repository/admin/student.repository";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import LocationSearch from "./LocationSearch";

const ManageStudent = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    email: "",
    class: "",
    subject: "",
    location: "",
    plan: "",
    status: "",
  });
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const tableContainerRef = useRef(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await studentRepository.getAllStudents();
      setStudents(res.data.students || []);
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (user_id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await studentRepository.deleteStudent(user_id);
      setStudents((prev) => prev.filter((s) => s.user_id !== user_id));
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to delete student", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const handleLocationSelect = (location) => {
    setFilters((prev) => ({
      ...prev,
      location: location.city,
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      email: "",
      class: "",
      subject: "",
      location: "",
      plan: "",
      status: "",
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Get unique values for filter dropdowns
  const uniqueClasses = [...new Set(students.map((s) => s.class))].filter(Boolean);
  const uniquePlans = [...new Set(students.map((s) => s.plan_name))].filter(Boolean);
  const uniqueStatuses = [...new Set(students.map((s) => s.subscription_status))].filter(Boolean);
  
  // Get all unique subjects
  const allSubjects = students.flatMap((s) => s.subjects || []);
  const uniqueSubjects = [...new Set(allSubjects)].filter(Boolean);

  const filteredStudents = students.filter((student) => {
    // General search term
    const matchesSearchTerm =
      searchTerm === "" ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.User?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.Location && (
        student.Location.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.Location.state?.toLowerCase().includes(searchTerm.toLowerCase())
      )) ||
      (student.subjects && student.subjects.some(subj => 
        subj.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      (student.plan_name && student.plan_name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter matches
    const matchesEmail = filters.email === "" || 
      (student.User?.email && student.User.email.toLowerCase().includes(filters.email.toLowerCase()));
    
    const matchesClass = filters.class === "" || 
      student.class?.toLowerCase().includes(filters.class.toLowerCase());
    
    const matchesSubject = filters.subject === "" || 
      (student.subjects && student.subjects.some(subj => 
        subj.toLowerCase().includes(filters.subject.toLowerCase())));
    
    const matchesLocation = filters.location === "" || 
      (student.Location && (
        student.Location.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
        student.Location.state?.toLowerCase().includes(filters.location.toLowerCase())
      ));
    
    const matchesPlan = filters.plan === "" || 
      (student.plan_name && student.plan_name.toLowerCase().includes(filters.plan.toLowerCase()));
    
    const matchesStatus = filters.status === "" || 
      (student.subscription_status && student.subscription_status.toLowerCase() === filters.status.toLowerCase());

    return (
      matchesSearchTerm &&
      matchesEmail &&
      matchesClass &&
      matchesSubject &&
      matchesLocation &&
      matchesPlan &&
      matchesStatus
    );
  });

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredStudents.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredStudents.length / entriesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Export functions
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Students List", 14, 16);
    
    const headers = [
      "ID", 
      "Name", 
      "Email", 
      "Class", 
      "Subjects", 
      "Location", 
      "Plan", 
      "Status"
    ];
    
    const data = filteredStudents.map(student => [
      student.user_id,
      student.name,
      student.User?.email || "",
      student.class || "",
      student.subjects?.join(", ") || "",
      student.Location ? `${student.Location.city}, ${student.Location.state}` : "",
      student.plan_name || "",
      student.subscription_status || ""
    ]);

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 20,
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 25 },
        2: { cellWidth: 40 },
        3: { cellWidth: 15 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
        6: { cellWidth: 20 },
        7: { cellWidth: 20 }
      }
    });

    doc.save('students-list.pdf');
  };

  const csvData = filteredStudents.map(student => ({
    "User ID": student.user_id,
    "Name": student.name,
    "Email": student.User?.email || "",
    "Mobile": student.User?.mobile_number || "",
    "Class": student.class || "",
    "Subjects": student.subjects?.join(", ") || "",
    "Location": student.Location ? `${student.Location.city}, ${student.Location.state}` : "",
    "Plan": student.plan_name || "",
    "Status": student.subscription_status || "",
    "Days Remaining": student.days_remaining || ""
  }));

  // Format ID display - show first 4 and last 4 characters on hover
  const formatId = (id) => {
    if (!id) return '';
    if (id.length <= 8) return id;
    return `${id.substring(0, 4)}...${id.substring(id.length - 4)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="p-6 pb-0">
          <h1 className="text-2xl font-bold text-gray-800">Manage Students</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your tutoring business.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, city, subject..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium"
              >
                <FunnelIcon className="h-5 w-5" />
                Filters
                {Object.values(filters).some(Boolean) && (
                  <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
                    {Object.values(filters).filter(Boolean).length}
                  </span>
                )}
              </button>
              
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-medium text-white">
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  Export
                </button>
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <CSVLink 
                    data={csvData} 
                    filename="students-list.csv"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as CSV
                  </CSVLink>
                  <button
                    onClick={exportToPDF}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="text"
                    name="email"
                    value={filters.email}
                    onChange={handleFilterChange}
                    placeholder="Filter by email"
                    className="w-full border rounded-md p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    name="class"
                    value={filters.class}
                    onChange={handleFilterChange}
                    className="w-full border rounded-md p-2 text-sm"
                  >
                    <option value="">All Classes</option>
                    {uniqueClasses.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    name="subject"
                    value={filters.subject}
                    onChange={handleFilterChange}
                    className="w-full border rounded-md p-2 text-sm"
                  >
                    <option value="">All Subjects</option>
                    {uniqueSubjects.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <LocationSearch 
                    onSelect={handleLocationSelect}
                    value={filters.location}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                  <select
                    name="plan"
                    value={filters.plan}
                    onChange={handleFilterChange}
                    className="w-full border rounded-md p-2 text-sm"
                  >
                    <option value="">All Plans</option>
                    {uniquePlans.map((plan) => (
                      <option key={plan} value={plan}>
                        {plan}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full border rounded-md p-2 text-sm"
                  >
                    <option value="">All Statuses</option>
                    {uniqueStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table Container with Scrollbar */}
        <div className="bg-white">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No students found matching your criteria
            </div>
          ) : (
            <>
              <div 
                ref={tableContainerRef}
                className="overflow-x-auto w-full"
                style={{
                  maxHeight: 'calc(100vh - 300px)',
                  overflowY: 'auto',
                }}
              >
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOCATION</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CLASS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUBJECTS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUBSCRIPTION</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ENDS IN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentEntries.map((student) => (
                      <tr key={student.user_id} className="hover:bg-gray-50">
                        {/* User ID with hover effect */}
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-32"
                          onMouseEnter={() => setHoveredId(student.user_id)}
                          onMouseLeave={() => setHoveredId(null)}
                        >
                          <span className="relative">
                            {hoveredId === student.user_id ? (
                              <span className="absolute z-10 left-0 bg-white p-2 shadow-lg rounded-md border whitespace-normal break-all">
                                {student.user_id}
                              </span>
                            ) : (
                              <span className="truncate inline-block max-w-full">
                                {formatId(student.user_id)}
                              </span>
                            )}
                          </span>
                        </td>

                        {/* Name */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-600 font-medium">
                                {student.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.User?.email || "-"}</div>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.Location
                            ? `${student.Location.city}, ${student.Location.state}`
                            : "N/A"}
                        </td>

                        {/* Class */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.class || "N/A"}
                        </td>

                        {/* Subjects */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.subjects?.join(", ") || "N/A"}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              student.subscription_status === "Subscribed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {student.subscription_status}
                          </span>
                        </td>

                        {/* Plan */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.plan_name || "N/A"}
                        </td>

                        {/* Ends In */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.days_remaining ? `${student.days_remaining}d` : "N/A"}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedStudent(student)}
                              className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                              title="View Details"
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(student.user_id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                              title="Delete"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between px-6 py-3 border-t bg-white">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-1 border rounded disabled:opacity-50"
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-1" />
                  Prev
                </button>
                <span className="text-sm text-gray-600 flex items-center">
                  Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredStudents.length)} of {filteredStudents.length} results
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedStudent.name}'s Details
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedStudent(null)}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Student ID</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedStudent.user_id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedStudent.User?.email || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Mobile</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedStudent.User?.mobile_number || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Class</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedStudent.class || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Subjects</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedStudent.subjects?.join(", ") || "N/A"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedStudent.Location?.city || "N/A"},{" "}
                    {selectedStudent.Location?.state || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Subscription Plan</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedStudent.plan_name || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Subscription Status</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedStudent.subscription_status || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Subscription Ends In</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedStudent.days_remaining ? `${selectedStudent.days_remaining} days` : "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Joined Date</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedStudent.createdAt).toLocaleDateString() || "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  const doc = new jsPDF();
                  doc.text(`${selectedStudent.name}'s Details`, 14, 10);
                  doc.autoTable({
                    startY: 20,
                    head: [["Field", "Value"]],
                    body: [
                      ["Student ID", selectedStudent.user_id],
                      ["Name", selectedStudent.name],
                      ["Email", selectedStudent.User?.email || "N/A"],
                      ["Mobile", selectedStudent.User?.mobile_number || "N/A"],
                      ["Class", selectedStudent.class || "N/A"],
                      ["Subjects", selectedStudent.subjects?.join(", ") || "N/A"],
                      ["Location", selectedStudent.Location ? `${selectedStudent.Location.city}, ${selectedStudent.Location.state}` : "N/A"],
                      ["Subscription Plan", selectedStudent.plan_name || "N/A"],
                      ["Subscription Status", selectedStudent.subscription_status || "N/A"],
                      ["Subscription Ends In", selectedStudent.days_remaining ? `${selectedStudent.days_remaining} days` : "N/A"],
                      ["Joined Date", new Date(selectedStudent.createdAt).toLocaleDateString() || "N/A"]
                    ],
                    styles: {
                      halign: 'left',
                      cellPadding: 3,
                      fontSize: 10,
                    },
                    headStyles: {
                      fillColor: [59, 130, 246],
                      textColor: 255,
                      fontStyle: 'bold'
                    },
                    alternateRowStyles: {
                      fillColor: [241, 245, 249]
                    }
                  });
                  doc.save(`${selectedStudent.name}_details.pdf`);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Download as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudent;