import React, { useState, useEffect, useRef } from "react";
import {
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  EyeIcon,
  XMarkIcon,
  DocumentArrowUpIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { studentRepository } from "../../../../api/repository/admin/student.repository";
import { CSVLink } from "react-csv";
import * as XLSX from 'xlsx';

// Fixed jsPDF imports
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Import LocationSearch component
import LocationSearch from "../../../../components/ui/admin/Manage_Student/LocationSearch";

const ManageStudent = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const [filters, setFilters] = useState({
    email: "",
    class: "",
    subject: "",
    location: "",
    plan: "",
    status: "",
  });

  // State for new student form
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    mobile_number: "",
    class: "",
    subjects: [],
    class_modes: [],
    languages: [],
    school_name: "",
    sms_alerts: true,
    board: "",
    availability: [],
    start_timeline: "",
    tutor_gender_preference: "",
    hourly_charges: "",
    profile_photo: "",
    place_id: "",
    location_name: "",
    city: "",
    state: "",
    country: "",
    pincode: ""
  });

  const [selectedStudent, setSelectedStudent] = useState(null);
  const tableContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const exportDropdownRef = useRef(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  // FIXED: Single student creation handler with proper data structure
// FIXED: Single student creation handler with proper data structure
const handleCreateStudent = async () => {
  if (!newStudent.name || !newStudent.email || !newStudent.mobile_number || !newStudent.class) {
    alert("Please fill in all required fields: Name, Email, Mobile Number, and Class");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newStudent.email)) {
    alert("Please enter a valid email address");
    return;
  }

  // Validate mobile number
  const mobileRegex = /^[0-9]{10}$/;
  const cleanMobile = newStudent.mobile_number.replace(/\D/g, '');
  if (!mobileRegex.test(cleanMobile)) {
    alert("Please enter a valid 10-digit mobile number");
    return;
  }

  setIsCreating(true);
  try {
    // Transform the data to match backend expectations - REMOVE unnecessary location fields
    const studentData = {
      name: newStudent.name,
      email: newStudent.email,
      mobile_number: cleanMobile,
      class: newStudent.class,
      subjects: newStudent.subjects,
      class_modes: newStudent.class_modes,
      profile_photo: newStudent.profile_photo || "",
      languages: newStudent.languages,
      school_name: newStudent.school_name || "",
      sms_alerts: newStudent.sms_alerts,
      board: newStudent.board || "",
      availability: newStudent.availability,
      start_timeline: newStudent.start_timeline || "",
      tutor_gender_preference: newStudent.tutor_gender_preference || "Any",
      hourly_charges: newStudent.hourly_charges || "",
      place_id: newStudent.place_id || "" // Only send place_id, backend will handle the rest
      // REMOVED: city, state, country, pincode, location_name
    };

    console.log("Sending student data:", studentData);

    const response = await studentRepository.createStudent(studentData);
    
    alert("Student created successfully!");
    
    // Reset form
    setNewStudent({
      name: "",
      email: "",
      mobile_number: "",
      class: "",
      subjects: [],
      class_modes: [],
      languages: [],
      school_name: "",
      sms_alerts: true,
      board: "",
      availability: [],
      start_timeline: "",
      tutor_gender_preference: "",
      hourly_charges: "",
      profile_photo: "",
      place_id: "",
      location_name: "",
      city: "",
      state: "",
      country: "",
      pincode: ""
    });
    
    setShowAddStudentModal(false);
    await fetchStudents();
    
  } catch (error) {
    console.error("Create student failed:", error);
    console.error("Error response:", error.response?.data);
    
    let errorMessage = "Failed to create student. Please try again.";
    
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    alert(`Error: ${errorMessage}`);
  } finally {
    setIsCreating(false);
  }
};

  // Location selection handler
// Location selection handler - ONLY set place_id
const handleLocationSelect = (location) => {
  setNewStudent(prev => ({
    ...prev,
    location_name: location.name,
    place_id: location.place_id,
    // REMOVE these - backend will handle them from place_id
    city: "",
    state: "", 
    country: "",
    pincode: ""
  }));
};

  // Handler for single student form changes
  const handleNewStudentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewStudent(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handler for array fields
  const handleArrayFieldChange = (fieldName, value) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    setNewStudent(prev => ({
      ...prev,
      [fieldName]: arrayValue
    }));
  };

  // Bulk upload handler
  const handleBulkUpload = async () => {
    if (!uploadFile) {
      alert("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);

      const response = await studentRepository.bulkUploadStudents(formData);
      
      setUploadResult({
        success: true,
        message: "Bulk upload completed successfully!",
        data: response.data
      });
      
      await fetchStudents();
      
      setTimeout(() => {
        setShowBulkUploadModal(false);
        setUploadFile(null);
        setUploadResult(null);
      }, 2000);

    } catch (error) {
      console.error("Bulk upload failed:", error);
      setUploadResult({
        success: false,
        message: error.response?.data?.message || "Upload failed. Please try again."
      });
    } finally {
      setIsUploading(false);
    }
  };

  // File select handler
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      
      if (!allowedTypes.includes(file.type) && 
          !file.name.endsWith('.xlsx') && 
          !file.name.endsWith('.xls') && 
          !file.name.endsWith('.csv')) {
        alert("Please select a valid Excel or CSV file");
        return;
      }
      
      setUploadFile(file);
    }
  };

  // Download template handler
  const downloadTemplate = () => {
    const templateData = [
      {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "mobile_number": "9876543210",
        "class": "10",
        "subjects": "Maths,Science",
        "class_modes": "Online,Offline",
        "languages": "English,Hindi",
        "school_name": "Delhi Public School",
        "sms_alerts": "true",
        "board": "CBSE",
        "availability": "Weekdays,Weekend",
        "start_timeline": "Immediate",
        "tutor_gender_preference": "Any",
        "hourly_charges": "500",
        "profile_photo": "",
        "place_id": "ChIJL_P_CXMEDTkRw0ZdG-0GVvw",
        "location_name": "Connaught Place, New Delhi, India",
        "city": "New Delhi",
        "state": "Delhi",
        "country": "India",
        "pincode": "110001"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

    const colWidths = [
      { wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 10 },
      { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 25 },
      { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 15 },
      { wch: 20 }, { wch: 15 }, { wch: 30 }, { wch: 30 },
      { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 10 }
    ];
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, "student_bulk_upload_template.xlsx");
  };

  // Delete student handler
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
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.User?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    try {
      const doc = new jsPDF('landscape');
     
      doc.setFontSize(16);
      doc.text("Complete Students List Report", 14, 20);
     
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Total Students: ${filteredStudents.length}`, 14, 38);
     
      const headers = [
        "ID", "Name", "Email", "Mobile", "Class", "Subjects", "Board", "Location",
        "Plan", "Status", "Days Left", "Hourly Charges", "Availability", 
        "Tutor Preference", "Start Timeline", "User Active", "Reg Date"
      ];
     
      const data = filteredStudents.map(student => [
        student.user_id || "",
        student.name || "",
        student.User?.email || "",
        student.User?.mobile_number || "",
        student.class || "",
        student.subjects?.join(", ") || "",
        student.board || "",
        student.Location ? `${student.Location.city || ""}, ${student.Location.state || ""}` : "",
        student.plan_name || "",
        student.subscription_status || "",
        student.days_remaining || "",
        student.hourly_charges ? `₹${student.hourly_charges}` : "",
        student.availability?.join(", ") || "",
        student.tutor_gender_preference || "",
        student.start_timeline || "",
        student.User?.is_active ? "Yes" : "No",
        student.createdAt ? new Date(student.createdAt).toLocaleDateString() : ""
      ]);

      autoTable(doc, {
        head: [headers],
        body: data,
        startY: 45,
        styles: { fontSize: 6, cellPadding: 2 },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [241, 245, 249]
        },
        columnStyles: {
          0: { cellWidth: 18 }, 1: { cellWidth: 20 }, 2: { cellWidth: 25 },
          3: { cellWidth: 20 }, 4: { cellWidth: 15 }, 5: { cellWidth: 25 },
          6: { cellWidth: 20 }, 7: { cellWidth: 25 }, 8: { cellWidth: 20 },
          9: { cellWidth: 15 }, 10: { cellWidth: 12 }, 11: { cellWidth: 15 },
          12: { cellWidth: 20 }, 13: { cellWidth: 18 }, 14: { cellWidth: 15 },
          15: { cellWidth: 12 }, 16: { cellWidth: 15 }
        }
      });

      doc.save('complete-students-list.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const csvData = filteredStudents.map(student => ({
    "User ID": student.user_id,
    "Name": student.name,
    "Email": student.User?.email || "",
    "Mobile Number": student.User?.mobile_number || "",
    "Class": student.class || "",
    "Subjects": student.subjects?.join(", ") || "",
    "Board": student.board || "",
    "City": student.Location?.city || "",
    "State": student.Location?.state || "",
    "Country": student.Location?.country || "",
    "Subscription Plan": student.plan_name || "",
    "Subscription Status": student.subscription_status || "",
    "Days Remaining": student.days_remaining || "",
    "Hourly Charges": student.hourly_charges ? `₹${student.hourly_charges}` : "",
    "Availability": student.availability?.join(", ") || "",
    "Tutor Gender Preference": student.tutor_gender_preference || "",
    "Start Timeline": student.start_timeline || "",
    "User Active": student.User?.is_active ? "Yes" : "No",
    "Registration Date": student.createdAt ? new Date(student.createdAt).toLocaleDateString() : ""
  }));

  const exportToExcel = () => {
    try {
      const worksheetData = filteredStudents.map(student => ({
        "User ID": student.user_id,
        "Name": student.name,
        "Email": student.User?.email || "",
        "Mobile Number": student.User?.mobile_number || "",
        "Class": student.class || "",
        "Subjects": student.subjects?.join(", ") || "",
        "Board": student.board || "",
        "City": student.Location?.city || "",
        "State": student.Location?.state || "",
        "Country": student.Location?.country || "",
        "Subscription Plan": student.plan_name || "",
        "Subscription Status": student.subscription_status || "",
        "Days Remaining": student.days_remaining || "",
        "Hourly Charges": student.hourly_charges ? `₹${student.hourly_charges}` : "",
        "Availability": student.availability?.join(", ") || "",
        "Tutor Gender Preference": student.tutor_gender_preference || "",
        "Start Timeline": student.start_timeline || "",
        "User Active": student.User?.is_active ? "Yes" : "No",
        "Registration Date": student.createdAt ? new Date(student.createdAt).toLocaleDateString() : ""
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students Data");
      
      const colWidths = [
        { wch: 15 }, { wch: 25 }, { wch: 30 }, { wch: 15 },
        { wch: 15 }, { wch: 30 }, { wch: 20 }, { wch: 15 },
        { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 15 },
        { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 15 },
        { wch: 10 }, { wch: 15 }
      ];
      worksheet['!cols'] = colWidths;

      XLSX.writeFile(workbook, 'complete-students-list.xlsx');
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Error generating Excel file. Please try again.');
    }
  };

  const exportStudentDetailsToPDF = (student) => {
    try {
      const doc = new jsPDF();
     
      doc.setFontSize(18);
      doc.text(`${student.name}'s Complete Details`, 14, 20);
     
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
     
      const tableData = [
        ["Student ID", student.user_id || "N/A"],
        ["Name", student.name || "N/A"],
        ["Email", student.User?.email || "N/A"],
        ["Mobile", student.User?.mobile_number || "N/A"],
        ["Class", student.class || "N/A"],
        ["Subjects", student.subjects?.join(", ") || "N/A"],
        ["Board", student.board || "N/A"],
        ["Hourly Charges", student.hourly_charges ? `₹${student.hourly_charges}` : "N/A"],
        ["Start Timeline", student.start_timeline || "N/A"],
        ["Tutor Gender Preference", student.tutor_gender_preference || "N/A"],
        ["Availability", student.availability?.join(", ") || "N/A"],
        ["City", student.Location?.city || "N/A"],
        ["State", student.Location?.state || "N/A"],
        ["Country", student.Location?.country || "N/A"],
        ["Subscription Plan", student.plan_name || "N/A"],
        ["Subscription Status", student.subscription_status || "N/A"],
        ["Days Remaining", student.days_remaining ? `${student.days_remaining} days` : "N/A"],
        ["User Active", student.User?.is_active ? "Yes" : "No"],
        ["Registration Date", student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "N/A"]
      ];

      autoTable(doc, {
        startY: 40,
        head: [["Field", "Value"]],
        body: tableData,
        styles: {
          halign: 'left',
          cellPadding: 4,
          fontSize: 8,
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [241, 245, 249]
        },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 120 }
        }
      });
     
      doc.save(`${student.name.replace(/\s+/g, '_')}_details.pdf`);
    } catch (error) {
      console.error('Error generating student PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

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
                onClick={() => setShowAddStudentModal(true)}
                className="inline-flex items-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Student
              </button>

              <button
                onClick={() => setShowBulkUploadModal(true)}
                className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
              >
                <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                Bulk Upload
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filters
              </button>

              {/* Export Dropdown */}
              <div className="relative" ref={exportDropdownRef}>
                <button
                  onClick={() => setShowExportDropdown((prev) => !prev)}
                  className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md text-sm font-medium hover:from-blue-600 hover:to-blue-700 shadow-sm"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export
                </button>

                {showExportDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <button
                      onClick={() => {
                        exportToPDF();
                        setShowExportDropdown(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2 text-red-500" />
                      Export as PDF
                    </button>
                    <CSVLink
                      data={csvData}
                      filename="complete-students-list.csv"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowExportDropdown(false)}
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2 text-green-500" />
                      Export as CSV
                    </CSVLink>
                    <button
                      onClick={() => {
                        exportToExcel();
                        setShowExportDropdown(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2 text-green-600" />
                      Export as Excel
                    </button>
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
                                {student.name?.charAt(0) || 'S'}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{student.name || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{student.User?.email || "-"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.Location ? `${student.Location.city || ''}, ${student.Location.state || ''}` : "N/A"}
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
                              : student.subscription_status === "Active"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {student.subscription_status || "N/A"}
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
              <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-3 border-t bg-white gap-4">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredStudents.length)} of {filteredStudents.length} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="flex items-center px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeftIcon className="h-4 w-4 mr-1" />
                    Prev
                  </button>
                  <span className="text-sm text-gray-600 px-3">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Add New Student</h2>
                <button
                  onClick={() => {
                    setShowAddStudentModal(false);
                    setNewStudent({
                      name: "",
                      email: "",
                      mobile_number: "",
                      class: "",
                      subjects: [],
                      class_modes: [],
                      languages: [],
                      school_name: "",
                      sms_alerts: true,
                      board: "",
                      availability: [],
                      start_timeline: "",
                      tutor_gender_preference: "",
                      hourly_charges: "",
                      profile_photo: "",
                      place_id: "",
                      location_name: "",
                      city: "",
                      state: "",
                      country: "",
                      pincode: ""
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={newStudent.name}
                      onChange={handleNewStudentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={newStudent.email}
                      onChange={handleNewStudentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      name="mobile_number"
                      value={newStudent.mobile_number}
                      onChange={handleNewStudentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                    <input
                      type="text"
                      name="class"
                      value={newStudent.class}
                      onChange={handleNewStudentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="e.g., 10, 12"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Board</label>
                    <input
                      type="text"
                      name="board"
                      value={newStudent.board}
                      onChange={handleNewStudentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="e.g., CBSE, ICSE"
                    />
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Academic Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subjects (comma separated)</label>
                    <input
                      type="text"
                      value={newStudent.subjects.join(', ')}
                      onChange={(e) => handleArrayFieldChange('subjects', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="e.g., Maths, Science, English"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class Modes (comma separated)</label>
                    <input
                      type="text"
                      value={newStudent.class_modes.join(', ')}
                      onChange={(e) => handleArrayFieldChange('class_modes', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="e.g., Online, Offline"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Languages (comma separated)</label>
                    <input
                      type="text"
                      value={newStudent.languages.join(', ')}
                      onChange={(e) => handleArrayFieldChange('languages', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="e.g., English, Hindi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                    <input
                      type="text"
                      name="school_name"
                      value={newStudent.school_name}
                      onChange={handleNewStudentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Enter school name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Charges</label>
                    <input
                      type="number"
                      name="hourly_charges"
                      value={newStudent.hourly_charges}
                      onChange={handleNewStudentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Enter hourly charges"
                    />
                  </div>
                </div>

{/* Location Information - Simplified */}
<div className="space-y-4">
  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Location Information</h3>
  
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Search Location *</label>
    <LocationSearch
      onSelect={handleLocationSelect}
      value={newStudent.location_name}
    />
    <p className="text-xs text-gray-500 mt-1">
      Search and select a location to automatically set the address details
    </p>
  </div>

  {/* Hidden field for place_id - required by backend */}
  <input
    type="hidden"
    name="place_id"
    value={newStudent.place_id}
  />
</div>

                {/* Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Preferences</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Availability (comma separated)</label>
                    <input
                      type="text"
                      value={newStudent.availability.join(', ')}
                      onChange={(e) => handleArrayFieldChange('availability', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="e.g., Weekdays, Weekend, Evening"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Timeline</label>
                    <select
                      name="start_timeline"
                      value={newStudent.start_timeline}
                      onChange={handleNewStudentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select timeline</option>
                      <option value="Immediate">Immediate</option>
                      <option value="Within a week">Within a week</option>
                      <option value="Within a month">Within a month</option>
                      <option value="Next month">Next month</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tutor Gender Preference</label>
                    <select
                      name="tutor_gender_preference"
                      value={newStudent.tutor_gender_preference}
                      onChange={handleNewStudentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">No preference</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Any">Any</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="sms_alerts"
                      checked={newStudent.sms_alerts}
                      onChange={handleNewStudentChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Enable SMS Alerts
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAddStudentModal(false);
                    setNewStudent({
                      name: "",
                      email: "",
                      mobile_number: "",
                      class: "",
                      subjects: [],
                      class_modes: [],
                      languages: [],
                      school_name: "",
                      sms_alerts: true,
                      board: "",
                      availability: [],
                      start_timeline: "",
                      tutor_gender_preference: "",
                      hourly_charges: "",
                      profile_photo: "",
                      place_id: "",
                      location_name: "",
                      city: "",
                      state: "",
                      country: "",
                      pincode: ""
                    });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateStudent}
                  disabled={isCreating}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Student'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Bulk Upload Students</h2>
                <button
                  onClick={() => {
                    setShowBulkUploadModal(false);
                    setUploadFile(null);
                    setUploadResult(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {uploadResult ? (
                <div className={`p-4 rounded-lg ${
                  uploadResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className={`flex items-center ${uploadResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    {uploadResult.success ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Success!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Error!</span>
                      </>
                    )}
                  </div>
                  <p className="mt-2 text-sm">{uploadResult.message}</p>
                  {uploadResult.success && uploadResult.data && (
                    <div className="mt-3 text-sm">
                      <p>Created: {uploadResult.data.createdCount || 0}</p>
                      <p>Updated: {uploadResult.data.updatedCount || 0}</p>
                      <p>Skipped: {uploadResult.data.skippedCount || 0}</p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Instructions:</h3>
                    <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                      <li>Upload Excel (.xlsx, .xls) or CSV files</li>
                      <li>Ensure the file follows the template format</li>
                      <li>Required fields: name, email, mobile_number, class</li>
                      <li>Array fields (subjects, languages) should be comma-separated</li>
                      <li>Location fields are optional but recommended</li>
                    </ul>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept=".xlsx,.xls,.csv"
                      className="hidden"
                    />
                    
                    {uploadFile ? (
                      <div className="text-center">
                        <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-green-500" />
                        <p className="mt-2 text-sm font-medium text-gray-900">{uploadFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                          onClick={() => setUploadFile(null)}
                          className="mt-2 text-sm text-red-600 hover:text-red-800"
                        >
                          Remove File
                        </button>
                      </div>
                    ) : (
                      <div>
                        <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4 flex text-sm text-gray-600">
                          <p className="pl-1">Drag and drop or</p>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="ml-1 font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            browse files
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">
                          Excel or CSV up to 10MB
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={downloadTemplate}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                      Download Template
                    </button>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowBulkUploadModal(false);
                          setUploadFile(null);
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleBulkUpload}
                        disabled={!uploadFile || isUploading}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          'Upload Students'
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedStudent.name}'s Complete Details
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                onClick={() => setSelectedStudent(null)}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-start gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
                  {selectedStudent.name?.charAt(0) || 'S'}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h3>
                  <p className="text-gray-600">{selectedStudent.User?.email}</p>
                  <p className="text-gray-500">Student ID: {selectedStudent.user_id}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    selectedStudent.subscription_status === "Subscribed"
                      ? "bg-green-100 text-green-800"
                      : selectedStudent.subscription_status === "Active"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {selectedStudent.subscription_status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
                  <DetailItem label="Student ID" value={selectedStudent.user_id} />
                  <DetailItem label="Full Name" value={selectedStudent.name} />
                  <DetailItem label="Email" value={selectedStudent.User?.email} />
                  <DetailItem label="Mobile Number" value={selectedStudent.User?.mobile_number} />
                  <DetailItem label="User Active" value={selectedStudent.User?.is_active ? "Yes" : "No"} />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Academic Information</h3>
                  <DetailItem label="Class" value={selectedStudent.class} />
                  <DetailItem label="Board" value={selectedStudent.board} />
                  <DetailItem label="Subjects" value={selectedStudent.subjects?.join(", ")} />
                  <DetailItem label="Hourly Charges" value={selectedStudent.hourly_charges ? `₹${selectedStudent.hourly_charges}` : "N/A"} />
                  <DetailItem label="Start Timeline" value={selectedStudent.start_timeline} />
                  <DetailItem label="Tutor Gender Preference" value={selectedStudent.tutor_gender_preference} />
                  <DetailItem label="Availability" value={selectedStudent.availability?.join(", ")} />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Location Information</h3>
                  <DetailItem label="City" value={selectedStudent.Location?.city} />
                  <DetailItem label="State" value={selectedStudent.Location?.state} />
                  <DetailItem label="Country" value={selectedStudent.Location?.country} />
                  <DetailItem label="Pincode" value={selectedStudent.Location?.pincode} />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Subscription Details</h3>
                  <DetailItem label="Subscription Plan" value={selectedStudent.plan_name} />
                  <DetailItem label="Subscription Status" value={selectedStudent.subscription_status} />
                  <DetailItem label="Days Remaining" value={selectedStudent.days_remaining ? `${selectedStudent.days_remaining} days` : "N/A"} />
                  <DetailItem label="Contacts Remaining" value={selectedStudent.User?.UserSubscriptions?.[0]?.contacts_remaining} />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">System Information</h3>
                  <DetailItem label="Registration Date" 
                    value={selectedStudent.createdAt ? new Date(selectedStudent.createdAt).toLocaleDateString() : "N/A"} />
                  <DetailItem label="Last Updated" 
                    value={selectedStudent.updatedAt ? new Date(selectedStudent.updatedAt).toLocaleDateString() : "N/A"} />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedStudent(null)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => exportStudentDetailsToPDF(selectedStudent)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Download as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for detail items
const DetailItem = ({ label, value, isLink = false }) => (
  <div>
    <h4 className="text-sm font-medium text-gray-500">{label}</h4>
    {isLink && value ? (
      <a 
        href={value} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-1 text-sm text-blue-600 hover:text-blue-800 break-words"
      >
        View Profile Photo
      </a>
    ) : (
      <p className="mt-1 text-sm text-gray-900 break-words">{value || "N/A"}</p>
    )}
  </div>
);

export default ManageStudent;   