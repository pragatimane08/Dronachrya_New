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

// ✅ keep only one import for jsPDF
import jsPDF from "jspdf";
import "jspdf-autotable";

import LocationSearch from "./LocationSearch";


const ManageStudent = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const [filters, setFilters] = useState({
    email: "",
    class: "",
    subject: "",
    location: "",
    plan: "",
    status: "",
  });
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
  
  const allSubjects = students.flatMap((s) => s.subjects || []);
  const uniqueSubjects = [...new Set(allSubjects)].filter(Boolean);

  const filteredStudents = students.filter((student) => {
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
    const doc = new jsPDF('landscape'); // Changed to landscape for more columns
    doc.text("Students List", 14, 16);
    
    const headers = [
      "ID", 
      "Name", 
      "Email", 
      "Mobile",
      "Location", 
      "Class", 
      "Subjects", 
      "Plan", 
      "Status",
      "Days Remaining",
      "Registration Date"
    ];
    
    const data = filteredStudents.map(student => [
      student.user_id,
      student.name,
      student.User?.email || "",
      student.User?.mobile_number || "",
      student.Location ? `${student.Location.city}, ${student.Location.state}` : "",
      student.class || "",
      student.subjects?.join(", ") || "",
      student.plan_name || "",
      student.subscription_status || "",
      student.days_remaining || "",
      student.createdAt ? new Date(student.createdAt).toLocaleDateString() : ""
    ]);

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 20,
      styles: { fontSize: 7 },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [241, 245, 249]
      }
    });

    doc.save('students-list.pdf');
  };

  // Updated CSV data with all fields
  const csvData = filteredStudents.map(student => ({
    "User ID": student.user_id,
    "Name": student.name,
    "Email": student.User?.email || "",
    "Mobile": student.User?.mobile_number || "",
    "Location": student.Location ? `${student.Location.city}, ${student.Location.state}` : "",
    "Class": student.class || "",
    "Subjects": student.subjects?.join(", ") || "",
    "Plan": student.plan_name || "",
    "Status": student.subscription_status || "",
    "Days Remaining": student.days_remaining || "",
    "Registration Date": student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "",
    // Add any other fields from your backend here
    "State": student.Location?.state || "",
    "City": student.Location?.city || "",
    "Pincode": student.Location?.pincode || "",
    "Address": student.Location?.address || "",
    "Phone Verified": student.User?.phone_verified ? "Yes" : "No",
    "Email Verified": student.User?.email_verified ? "Yes" : "No",
    "Created At": student.createdAt ? new Date(student.createdAt).toISOString() : "",
    "Updated At": student.updatedAt ? new Date(student.updatedAt).toISOString() : ""
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto">
        {/* Search and Filters Section */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

        
{/* Action Buttons */}
<div className="flex items-center gap-3">
  <button
    onClick={() => setShowFilters(!showFilters)}
    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
  >
    <FunnelIcon className="h-4 w-4 mr-2" />
    Filters
  </button>

  {/* Export Dropdown */}
  <div className="relative">
    <button
      onClick={() => setShowExportDropdown((prev) => !prev)}
      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
    >
      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
      Export
    </button>

    {showExportDropdown && (
      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
        <button
          onClick={exportToPDF}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Export as PDF
        </button>
        <CSVLink
          data={csvData}
          filename="students-list.csv"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Export as CSV
        </CSVLink>
      </div>
    )}
  </div>
</div>

</div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="text"
                    name="email"
                    value={filters.email}
                    onChange={handleFilterChange}
                    placeholder="Filter by email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    name="class"
                    value={filters.class}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Classes</option>
                    {uniqueClasses.map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    name="subject"
                    value={filters.subject}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Subjects</option>
                    {uniqueSubjects.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                  <select
                    name="plan"
                    value={filters.plan}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Plans</option>
                    {uniquePlans.map((plan) => (
                      <option key={plan} value={plan}>{plan}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Statuses</option>
                    {uniqueStatuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table Container */}
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
              <div ref={tableContainerRef} className="overflow-x-auto w-full">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME & EMAIL</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOCATION</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MOBILE</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CLASS & SUBJECTS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUBSCRIPTION</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REG DATE</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentEntries.map((student) => (
                      <tr key={student.user_id} className="hover:bg-gray-50">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.Location ? `${student.Location.city}, ${student.Location.state}` : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.User?.mobile_number || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.class || "N/A"}</div>
                          <div className="text-sm text-gray-500">{student.subjects?.join(", ") || "N/A"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.subscription_status === "Subscribed"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {student.subscription_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.plan_name || "N/A"}</div>
                          <div className="text-sm text-gray-500">
                            {student.days_remaining ? `${student.days_remaining} days left` : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "N/A"}
                        </td>
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

      {/* Student Details Modal - Enhanced with all details */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedStudent.name}'s Complete Details
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedStudent(null)}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Student ID</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedStudent.user_id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedStudent.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedStudent.User?.email || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Mobile Number</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedStudent.User?.mobile_number || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email Verified</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedStudent.User?.email_verified ? "Yes" : "No"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Phone Verified</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedStudent.User?.phone_verified ? "Yes" : "No"}</p>
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Academic Information</h3>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Class</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedStudent.class || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Subjects</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedStudent.subjects?.join(", ") || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Location</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedStudent.Location ? (
                      <>
                        {selectedStudent.Location.city && `${selectedStudent.Location.city}, `}
                        {selectedStudent.Location.state}
                        {selectedStudent.Location.pincode && ` - ${selectedStudent.Location.pincode}`}
                      </>
                    ) : "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Full Address</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedStudent.Location?.address || "N/A"}
                  </p>
                </div>
              </div>

              {/* Subscription Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Subscription Details</h3>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Subscription Plan</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedStudent.plan_name || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Subscription Status</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedStudent.subscription_status === "Subscribed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {selectedStudent.subscription_status || "N/A"}
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Subscription Ends In</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedStudent.days_remaining ? `${selectedStudent.days_remaining} days` : "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Registration Date</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedStudent.createdAt ? new Date(selectedStudent.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedStudent.updatedAt ? new Date(selectedStudent.updatedAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  const doc = new jsPDF();
                  doc.text(`${selectedStudent.name}'s Complete Details`, 14, 10);
                  
                  const tableData = [
                    ["Student ID", selectedStudent.user_id],
                    ["Name", selectedStudent.name],
                    ["Email", selectedStudent.User?.email || "N/A"],
                    ["Mobile", selectedStudent.User?.mobile_number || "N/A"],
                    ["Email Verified", selectedStudent.User?.email_verified ? "Yes" : "No"],
                    ["Phone Verified", selectedStudent.User?.phone_verified ? "Yes" : "No"],
                    ["Class", selectedStudent.class || "N/A"],
                    ["Subjects", selectedStudent.subjects?.join(", ") || "N/A"],
                    ["City", selectedStudent.Location?.city || "N/A"],
                    ["State", selectedStudent.Location?.state || "N/A"],
                    ["Pincode", selectedStudent.Location?.pincode || "N/A"],
                    ["Address", selectedStudent.Location?.address || "N/A"],
                    ["Subscription Plan", selectedStudent.plan_name || "N/A"],
                    ["Subscription Status", selectedStudent.subscription_status || "N/A"],
                    ["Days Remaining", selectedStudent.days_remaining ? `${selectedStudent.days_remaining} days` : "N/A"],
                    ["Registration Date", selectedStudent.createdAt ? new Date(selectedStudent.createdAt).toLocaleDateString() : "N/A"],
                    ["Last Updated", selectedStudent.updatedAt ? new Date(selectedStudent.updatedAt).toLocaleDateString() : "N/A"]
                  ];

                  doc.autoTable({
                    startY: 20,
                    head: [["Field", "Value"]],
                    body: tableData,
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
                  doc.save(`${selectedStudent.name}_complete_details.pdf`);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Download Complete Details as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudent;