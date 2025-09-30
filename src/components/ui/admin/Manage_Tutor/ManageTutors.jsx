import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  TrashIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
  TableCellsIcon,
  Bars3Icon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { debounce } from "lodash";
import { tutorRepository } from "../../../../api/repository/admin/tutor.repository";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ITEMS_PER_PAGE = 10;

const statusStyles = {
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
  pending: "bg-amber-100 text-amber-800",
};

// Helper function to format languages properly
const formatLanguages = (languages) => {
  if (!languages) return "N/A";
 
  if (typeof languages === 'string') {
    try {
      languages = JSON.parse(languages);
    } catch (e) {
      return languages;
    }
  }
 
  if (!Array.isArray(languages)) return "N/A";
 
  return languages
    .map(l => {
      if (typeof l === 'string') {
        try {
          const parsed = JSON.parse(l);
          l = parsed;
        } catch (e) {
          return l;
        }
      }
     
      if (typeof l === 'object' && l !== null) {
        const name = l.name || l.language || '';
        const proficiency = l.proficiency || '';
       
        if (name && proficiency) {
          return `${name} (${proficiency})`;
        } else if (name) {
          return name;
        }
      }
     
      return '';
    })
    .filter(Boolean)
    .join(", ") || "N/A";
};

const formatLanguagesForCSV = (languages) => {
  if (!languages) return "N/A";
 
  if (typeof languages === 'string') {
    try {
      languages = JSON.parse(languages);
    } catch (e) {
      return languages;
    }
  }
 
  if (!Array.isArray(languages)) return "N/A";
 
  return languages
    .map(l => {
      if (typeof l === 'string') {
        try {
          const parsed = JSON.parse(l);
          l = parsed;
        } catch (e) {
          return l;
        }
      }
     
      if (typeof l === 'object' && l !== null) {
        const name = l.name || l.language || '';
        const proficiency = l.proficiency || '';
       
        if (name && proficiency) {
          return `${name} (${proficiency})`;
        } else if (name) {
          return name;
        }
      }
     
      return '';
    })
    .filter(Boolean)
    .join("; ") || "N/A";
};

const ManageTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [allTutors, setAllTutors] = useState([]);
  const [filterCity, setFilterCity] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterPlan, setFilterPlan] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const [viewExportOpen, setViewExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importStatus, setImportStatus] = useState({ loading: false, message: "", error: "" });
  const [deleteStatus, setDeleteStatus] = useState({}); // Track delete status for each tutor
  const exportRef = useRef(null);
  const viewExportRef = useRef(null);
  const importRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchTutors = async () => {
    try {
      const res = await tutorRepository.getAllTutors();
      const tutorsData = res.data.tutors || [];
      setAllTutors(tutorsData);

      const search = searchTerm.toLowerCase();
      const filtered = tutorsData.filter((t) => {
        const cityMatch = filterCity ? t.Location?.city === filterCity : true;
        const subjectMatch = filterSubject
          ? t.subjects?.includes(filterSubject)
          : true;
        const planMatch = filterPlan
          ? (t.plan_name || "N/A") === filterPlan
          : true;

        const keywordMatch =
          t.name?.toLowerCase().includes(search) ||
          t.Location?.city?.toLowerCase().includes(search) ||
          t.Location?.state?.toLowerCase().includes(search) ||
          t.subjects?.some((s) => s.toLowerCase().includes(search)) ||
          t.teaching_modes?.some((m) => m.toLowerCase().includes(search)) ||
          t.plan_name?.toLowerCase().includes(search) ||
          t.classes?.some((c) => c.toLowerCase().includes(search)) ||
          t.degrees?.some((d) => d.toLowerCase().includes(search)) ||
          (t.languages && Array.isArray(t.languages) &&
           t.languages.some((l) => {
             if (typeof l === 'string') return l.toLowerCase().includes(search);
             if (typeof l === 'object' && l !== null) {
               if (l.name) return l.name.toLowerCase().includes(search);
               if (l.language) return l.language.toLowerCase().includes(search);
             }
             return false;
           })) ||
          String(t.experience)?.includes(search) ||
          String(t.pricing_per_hour)?.includes(search) ||
          String(t.days_remaining)?.includes(search);

        return keywordMatch && cityMatch && subjectMatch && planMatch;
      });

      setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
      const paginated = filtered.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
      );
      setTutors(paginated);
    } catch (err) {
      console.error("Failed to load tutors", err);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setPage(1);
    }, 500),
    []
  );

  const handleDelete = async (user_id) => {
    // Set deleting status for this tutor
    setDeleteStatus(prev => ({ ...prev, [user_id]: { deleting: true, message: "" } }));
    
    try {
      await tutorRepository.deleteTutor(user_id);
      
      // Set success message
      setDeleteStatus(prev => ({ 
        ...prev, 
        [user_id]: { deleting: false, message: "Tutor deleted successfully!" } 
      }));
      
      // Refresh the tutors list after a short delay to show the message
      setTimeout(() => {
        fetchTutors();
        setPage(1);
        // Clear the delete status after refresh
        setDeleteStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[user_id];
          return newStatus;
        });
      }, 1500);
      
    } catch (err) {
      console.error("Delete failed", err);
      // Set error message
      setDeleteStatus(prev => ({ 
        ...prev, 
        [user_id]: { deleting: false, message: "Delete failed. Please try again." } 
      }));
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setDeleteStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[user_id];
          return newStatus;
        });
      }, 3000);
    }
  };

  const handleStatusChange = async (user_id, status) => {
    try {
      await tutorRepository.updateTutorStatus(user_id, status);
      fetchTutors();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const handleFileUpload = async (e) => {
    if (!selectedTutor) return;
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploading(true);
      await tutorRepository.uploadTutorDocument(
        selectedTutor.user_id,
        formData
      );
      alert("Document uploaded");
      fetchTutors();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleImportFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImportFile(file);
      setImportStatus({ loading: false, message: "", error: "" });
    }
  };

  const handleImportSubmit = async () => {
    if (!importFile) {
      setImportStatus({ loading: false, message: "", error: "Please select a file to import" });
      return;
    }

    const formData = new FormData();
    formData.append("file", importFile);

    try {
      setImportStatus({ loading: true, message: "", error: "" });
      const response = await tutorRepository.bulkUploadTutors(formData);
      setImportStatus({
        loading: false,
        message: response.data.message || "Tutors imported successfully",
        error: ""
      });
      fetchTutors();
     
      // Close modal after successful import
      setTimeout(() => {
        setImportOpen(false);
        setImportFile(null);
        setImportStatus({ loading: false, message: "", error: "" });
      }, 2000);
    } catch (err) {
      console.error("Import failed", err);
      setImportStatus({
        loading: false,
        message: "",
        error: err.response?.data?.message || "Import failed. Please try again."
      });
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Location",
        "Classes",
        "Subjects",
        "Degrees",
        "Status",
        "Experience",
        "Pricing",
        "Teaching Modes",
        "Languages",
        "Subscription",
        "Ends In",
        "Registration Date",
      ].join(","),
      ...allTutors.map((t) =>
        [
          t.user_id,
          t.name,
          t.User?.email || "N/A",
          t.User?.mobile_number || "N/A",
          `${t.Location?.city || "N/A"}, ${t.Location?.state || "N/A"}`,
          t.classes?.join("; ") || "N/A",
          t.subjects?.join("; ") || "N/A",
          t.degrees?.join("; ") || "N/A",
          t.profile_status,
          t.experience || "N/A",
          t.pricing_per_hour || "N/A",
          t.teaching_modes?.join("; ") || "N/A",
          formatLanguagesForCSV(t.languages),
          t.plan_name || "N/A",
          `${t.days_remaining ?? "N/A"} days`,
          t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "N/A",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "tutors.csv");
    setExportOpen(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Tutors Report", 14, 10);

    const tableColumn = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Location",
      "Classes",
      "Subjects",
      "Degrees",
      "Status",
      "Exp",
      "Pricing",
      "Modes",
      "Subscription",
      "Ends In",
      "Reg. Date",
    ];

    const tableRows = [];
    allTutors.forEach((t) => {
      tableRows.push([
        t.user_id,
        t.name,
        t.User?.email || "N/A",
        t.User?.mobile_number || "N/A",
        `${t.Location?.city || "N/A"}, ${t.Location?.state || "N/A"}`,
        t.classes?.join(", ") || "N/A",
        t.subjects?.join(", ") || "N/A",
        t.degrees?.join(", ") || "N/A",
        t.profile_status,
        t.experience || "N/A",
        t.pricing_per_hour ? `₹${t.pricing_per_hour}` : "N/A",
        t.teaching_modes?.join(", ") || "N/A",
        t.plan_name || "N/A",
        (t.days_remaining ?? "N/A") + " days",
        t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "N/A",
      ]);
    });

    autoTable(doc, {
      startY: 20,
      head: [tableColumn],
      body: tableRows,
      styles: { halign: "left", fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      alternateRowStyles: { fillColor: [241, 245, 249] },
    });
    doc.save("tutors.pdf");
    setExportOpen(false);
  };

  const exportToExcel = () => {
    const worksheetData = allTutors.map((t) => ({
      ID: t.user_id,
      Name: t.name,
      Email: t.User?.email || "N/A",
      Phone: t.User?.mobile_number || "N/A",
      Location: `${t.Location?.city || "N/A"}, ${t.Location?.state || "N/A"}`,
      Classes: t.classes?.join(", ") || "N/A",
      Subjects: t.subjects?.join(", ") || "N/A",
      Degrees: t.degrees?.join(", ") || "N/A",
      Status: t.profile_status,
      Experience: t.experience || "N/A",
      Pricing: t.pricing_per_hour ? `₹${t.pricing_per_hour}` : "N/A",
      TeachingModes: t.teaching_modes?.join(", ") || "N/A",
      Languages: formatLanguages(t.languages),
      Subscription: t.plan_name || "N/A",
      EndsIn: `${t.days_remaining ?? "N/A"} days`,
      RegistrationDate: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tutors");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      "tutors.xlsx"
    );
    setExportOpen(false);
  };

  const exportSingleTutorCSV = () => {
    if (!selectedTutor) return;

    const csvContent = [
      [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Location",
        "Classes",
        "Subjects",
        "Degrees",
        "Status",
        "Experience",
        "Pricing",
        "Teaching Modes",
        "Languages",
        "Subscription",
        "Ends In",
        "Registration Date",
      ].join(","),
      [
        selectedTutor.user_id,
        selectedTutor.name,
        selectedTutor.User?.email || "N/A",
        selectedTutor.User?.mobile_number || "N/A",
        `${selectedTutor.Location?.city || "N/A"}, ${selectedTutor.Location?.state || "N/A"}`,
        selectedTutor.classes?.join("; ") || "N/A",
        selectedTutor.subjects?.join("; ") || "N/A",
        selectedTutor.degrees?.join("; ") || "N/A",
        selectedTutor.profile_status,
        selectedTutor.experience || "N/A",
        selectedTutor.pricing_per_hour || "N/A",
        selectedTutor.teaching_modes?.join("; ") || "N/A",
        formatLanguagesForCSV(selectedTutor.languages),
        selectedTutor.plan_name || "N/A",
        `${selectedTutor.days_remaining ?? "N/A"} days`,
        selectedTutor.createdAt ? new Date(selectedTutor.createdAt).toLocaleDateString() : "N/A",
      ].join(",")
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `tutor_${selectedTutor.user_id}_${selectedTutor.name}.csv`);
    setViewExportOpen(false);
  };

  const exportSingleTutorPDF = () => {
    if (!selectedTutor) return;

    const doc = new jsPDF();
    doc.text(`Tutor Details - ${selectedTutor.name}`, 14, 10);

    const tableColumn = [
      "Field",
      "Value",
    ];

    const tableRows = [
      ["ID", selectedTutor.user_id],
      ["Name", selectedTutor.name],
      ["Email", selectedTutor.User?.email || "N/A"],
      ["Phone", selectedTutor.User?.mobile_number || "N/A"],
      ["Location", `${selectedTutor.Location?.city || "N/A"}, ${selectedTutor.Location?.state || "N/A"}`],
      ["Classes", selectedTutor.classes?.join(", ") || "N/A"],
      ["Subjects", selectedTutor.subjects?.join(", ") || "N/A"],
      ["Degrees", selectedTutor.degrees?.join(", ") || "N/A"],
      ["Status", selectedTutor.profile_status],
      ["Experience", selectedTutor.experience ? `${selectedTutor.experience} years` : "N/A"],
      ["Pricing", selectedTutor.pricing_per_hour ? `₹${selectedTutor.pricing_per_hour}/hr` : "N/A"],
      ["Teaching Modes", selectedTutor.teaching_modes?.join(", ") || "N/A"],
      ["Languages", formatLanguages(selectedTutor.languages)],
      ["Subscription", selectedTutor.plan_name || "N/A"],
      ["Days Remaining", `${selectedTutor.days_remaining ?? "N/A"} days`],
      ["Registration Date", selectedTutor.createdAt ? new Date(selectedTutor.createdAt).toLocaleDateString() : "N/A"],
    ];

    autoTable(doc, {
      startY: 20,
      head: [tableColumn],
      body: tableRows,
      styles: { halign: "left", fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { cellWidth: 130 }
      }
    });
    doc.save(`tutor_${selectedTutor.user_id}_${selectedTutor.name}.pdf`);
    setViewExportOpen(false);
  };

  const exportSingleTutorExcel = () => {
    if (!selectedTutor) return;

    const worksheetData = [{
      ID: selectedTutor.user_id,
      Name: selectedTutor.name,
      Email: selectedTutor.User?.email || "N/A",
      Phone: selectedTutor.User?.mobile_number || "N/A",
      Location: `${selectedTutor.Location?.city || "N/A"}, ${selectedTutor.Location?.state || "N/A"}`,
      Classes: selectedTutor.classes?.join(", ") || "N/A",
      Subjects: selectedTutor.subjects?.join(", ") || "N/A",
      Degrees: selectedTutor.degrees?.join(", ") || "N/A",
      Status: selectedTutor.profile_status,
      Experience: selectedTutor.experience || "N/A",
      Pricing: selectedTutor.pricing_per_hour ? `₹${selectedTutor.pricing_per_hour}` : "N/A",
      TeachingModes: selectedTutor.teaching_modes?.join(", ") || "N/A",
      Languages: formatLanguages(selectedTutor.languages),
      Subscription: selectedTutor.plan_name || "N/A",
      EndsIn: `${selectedTutor.days_remaining ?? "N/A"} days`,
      RegistrationDate: selectedTutor.createdAt ? new Date(selectedTutor.createdAt).toLocaleDateString() : "N/A",
    }];

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tutor Details");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      `tutor_${selectedTutor.user_id}_${selectedTutor.name}.xlsx`
    );
    setViewExportOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setExportOpen(false);
      }
      if (viewExportRef.current && !viewExportRef.current.contains(e.target)) {
        setViewExportOpen(false);
      }
      if (importRef.current && !importRef.current.contains(e.target)) {
        setImportOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchTutors();
  }, [page, searchTerm, filterCity, filterSubject, filterPlan]);

  useEffect(() => {
    setPage(1);
  }, [filterCity, filterSubject, filterPlan]);

  return (
    <div className="p-3 sm:p-4 lg:p-6 min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 lg:p-6">
        {/* Header with Title and Export/Import - Mobile/Tablet/Desktop */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Tutors</h1>
         
          {/* Export and Import Buttons - Always Visible */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto" ref={importRef}>
              <button
                onClick={() => setImportOpen(!importOpen)}
                className="flex items-center justify-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-700 w-full sm:w-auto text-sm sm:text-base"
              >
                <ArrowUpTrayIcon className="h-5 w-5" />
                <span>Import Tutors</span>
              </button>
              {importOpen && (
                <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Import Tutors</h3>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Select CSV or Excel file
                    </label>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleImportFileChange}
                      className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                 
                  {importStatus.error && (
                    <div className="mb-3 text-xs text-red-600">{importStatus.error}</div>
                  )}
                 
                  {importStatus.message && (
                    <div className="mb-3 text-xs text-green-600">{importStatus.message}</div>
                  )}
                 
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setImportOpen(false);
                        setImportFile(null);
                        setImportStatus({ loading: false, message: "", error: "" });
                      }}
                      className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleImportSubmit}
                      disabled={importStatus.loading}
                      className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {importStatus.loading ? "Importing..." : "Import"}
                    </button>
                  </div>
                </div>
              )}
            </div>
           
            <div className="relative w-full sm:w-auto" ref={exportRef}>
              <button
                onClick={() => setExportOpen(!exportOpen)}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto text-sm sm:text-base"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Export All</span>
              </button>
              {exportOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                  >
                    <DocumentTextIcon className="h-4 w-4" />
                    Export as CSV
                  </button>
                  <button
                    onClick={exportToExcel}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <TableCellsIcon className="h-4 w-4" />
                    Export as Excel
                  </button>
                  <button
                    onClick={exportToPDF}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4" />
                    Export as PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filters Button */}
        <div className="md:hidden mb-4">
          <button
            type="button"
            className="flex items-center justify-center w-full rounded-lg bg-blue-600 px-4 py-2.5 text-white font-medium"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <FunnelIcon className="mr-2 h-5 w-5" />
            <span>Show Filters</span>
          </button>
        </div>

        {/* Mobile/Tablet Filters Panel */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileFiltersOpen(false)} />
            <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-xl overflow-y-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
               
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search tutors..."
                        value={searchInput}
                        onChange={(e) => {
                          setSearchInput(e.target.value);
                          debouncedSearch(e.target.value);
                        }}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <select
                      onChange={(e) => setFilterCity(e.target.value)}
                      value={filterCity}
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Cities</option>
                      {[...new Set(allTutors.map((t) => t.Location?.city))].filter(Boolean).map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <select
                      onChange={(e) => setFilterSubject(e.target.value)}
                      value={filterSubject}
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Subjects</option>
                      {[...new Set(allTutors.flatMap((t) => t.subjects || []))].map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
                    <select
                      onChange={(e) => setFilterPlan(e.target.value)}
                      value={filterPlan}
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Plans</option>
                      {[...new Set(allTutors.map((t) => t.plan_name || "N/A"))].map((plan) => (
                        <option key={plan} value={plan}>
                          {plan}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      setFilterCity("");
                      setFilterSubject("");
                      setFilterPlan("");
                      setSearchInput("");
                      setSearchTerm("");
                      setMobileFiltersOpen(false);
                    }}
                    className="w-full bg-gray-100 text-gray-800 py-2.5 px-4 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Filters */}
        <div className="hidden md:block mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, city, subject..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* City Filter */}
            <select
              onChange={(e) => setFilterCity(e.target.value)}
              value={filterCity}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[150px]"
            >
              <option value="">All Cities</option>
              {[...new Set(allTutors.map((t) => t.Location?.city))].filter(Boolean).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* Subject Filter */}
            <select
              onChange={(e) => setFilterSubject(e.target.value)}
              value={filterSubject}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[150px]"
            >
              <option value="">All Subjects</option>
              {[...new Set(allTutors.flatMap((t) => t.subjects || []))].map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>

            {/* Plan Filter */}
            <select
              onChange={(e) => setFilterPlan(e.target.value)}
              value={filterPlan}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[150px]"
            >
              <option value="">All Plans</option>
              {[...new Set(allTutors.map((t) => t.plan_name || "N/A"))].map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </select>

            {/* Clear Filters Button */}
            <button
              onClick={() => {
                setFilterCity("");
                setFilterSubject("");
                setFilterPlan("");
                setSearchInput("");
                setSearchTerm("");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-sm font-medium whitespace-nowrap"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-100">
            <div className="text-xs sm:text-sm text-blue-800 font-medium">Total Tutors</div>
            <div className="text-xl sm:text-2xl font-bold text-blue-900">{allTutors.length}</div>
          </div>
          <div className="bg-emerald-50 p-3 sm:p-4 rounded-lg border border-emerald-100">
            <div className="text-xs sm:text-sm text-emerald-800 font-medium">Approved</div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-900">
              {allTutors.filter((t) => t.profile_status === "approved").length}
            </div>
          </div>
          <div className="bg-amber-50 p-3 sm:p-4 rounded-lg border border-amber-100">
            <div className="text-xs sm:text-sm text-amber-800 font-medium">Pending</div>
            <div className="text-xl sm:text-2xl font-bold text-amber-900">
              {allTutors.filter((t) => t.profile_status === "pending").length}
            </div>
          </div>
          <div className="bg-rose-50 p-3 sm:p-4 rounded-lg border border-rose-100">
            <div className="text-xs sm:text-sm text-rose-800 font-medium">Rejected</div>
            <div className="text-xl sm:text-2xl font-bold text-rose-900">
              {allTutors.filter((t) => t.profile_status === "rejected").length}
            </div>
          </div>
        </div>

        {/* Tutors Table - Responsive */}
        <div className="overflow-x-auto -mx-3 sm:mx-0 rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="hidden sm:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="hidden lg:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classes & Subjects</th>
                <th className="hidden xl:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teaching Modes</th>
                <th className="hidden lg:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tutors.map((tutor) => {
                const tutorDeleteStatus = deleteStatus[tutor.user_id];
                return (
                  <tr key={tutor.user_id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{tutor.name}</div>
                      <div className="text-xs sm:text-sm text-gray-500 sm:hidden">{tutor.User?.mobile_number || "N/A"}</div>
                      <div className="text-xs text-gray-500 md:hidden">{tutor.Location?.city || "N/A"}</div>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                      {tutor.User?.mobile_number || "N/A"}
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                      {tutor.Location?.city || "N/A"}, {tutor.Location?.state || "N/A"}
                    </td>
                    <td className="hidden lg:table-cell px-3 sm:px-4 py-3 sm:py-4">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">Classes:</span> {tutor.classes?.slice(0, 2).join(", ") || "N/A"}
                        {tutor.classes?.length > 2 && "..."}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Subjects:</span> {tutor.subjects?.slice(0, 2).join(", ") || "N/A"}
                        {tutor.subjects?.length > 2 && "..."}
                      </div>
                    </td>
                    <td className="hidden xl:table-cell px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                      {tutor.teaching_modes?.join(", ") || "N/A"}
                    </td>
                    <td className="hidden lg:table-cell px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-medium">{tutor.plan_name || "N/A"}</div>
                      <div className="text-xs text-gray-400">{tutor.days_remaining ?? "N/A"} days</div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                      <select
                        value={tutor.profile_status}
                        onChange={(e) => handleStatusChange(tutor.user_id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full ${statusStyles[tutor.profile_status]} cursor-pointer`}
                      >
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                      {tutorDeleteStatus ? (
                        <div className={`text-xs px-2 py-1 rounded ${
                          tutorDeleteStatus.message.includes("successfully") 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {tutorDeleteStatus.deleting ? "Deleting..." : tutorDeleteStatus.message}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedTutor(tutor)}
                            className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(tutor.user_id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={tutorDeleteStatus?.deleting}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination - Responsive */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
          <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
            Showing <span className="font-medium">{(page - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
            <span className="font-medium">{Math.min(page * ITEMS_PER_PAGE, allTutors.length)}</span> of{" "}
            <span className="font-medium">{allTutors.length}</span> results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex items-center px-3 py-1.5 sm:py-2 rounded-md border border-gray-300 bg-white text-xs sm:text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="flex items-center px-3 py-1.5 sm:py-2 rounded-md border border-gray-300 bg-white text-xs sm:text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Tutor Details Modal - Responsive */}
      {selectedTutor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex justify-between items-center p-4 sm:p-6 border-b z-10">
              <h3 className="text-base sm:text-lg font-semibold">Tutor Details</h3>
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Export Button in Modal */}
                <div className="relative" ref={viewExportRef}>
                  <button
                    onClick={() => setViewExportOpen(!viewExportOpen)}
                    className="flex items-center gap-1 sm:gap-2 bg-blue-600 text-white px-2 sm:px-3 py-1.5 rounded-lg hover:bg-blue-700 text-xs sm:text-sm"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                  {viewExportOpen && (
                    <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <button
                        onClick={exportSingleTutorCSV}
                        className="flex items-center gap-2 w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                      >
                        <DocumentTextIcon className="h-4 w-4" />
                        Export as CSV
                      </button>
                      <button
                        onClick={exportSingleTutorExcel}
                        className="flex items-center gap-2 w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <TableCellsIcon className="h-4 w-4" />
                        Export as Excel
                      </button>
                      <button
                        onClick={exportSingleTutorPDF}
                        className="flex items-center gap-2 w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg"
                      >
                        <DocumentArrowDownIcon className="h-4 w-4" />
                        Export as PDF
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedTutor(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Personal Information</h4>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <p><span className="font-medium">ID:</span> {selectedTutor.user_id}</p>
                    <p><span className="font-medium">Name:</span> {selectedTutor.name}</p>
                    <p><span className="font-medium">Email:</span> <span className="break-all">{selectedTutor.User?.email || "N/A"}</span></p>
                    <p><span className="font-medium">Phone:</span> {selectedTutor.User?.mobile_number || "N/A"}</p>
                    <p><span className="font-medium">Location:</span> {selectedTutor.Location?.city || "N/A"}, {selectedTutor.Location?.state || "N/A"}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Professional Information</h4>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <p><span className="font-medium">Experience:</span> {selectedTutor.experience || "N/A"} years</p>
                    <p><span className="font-medium">Pricing:</span> {selectedTutor.pricing_per_hour ? `₹${selectedTutor.pricing_per_hour}/hr` : "N/A"}</p>
                    <p><span className="font-medium">Teaching Modes:</span> {selectedTutor.teaching_modes?.join(", ") || "N/A"}</p>
                    <p><span className="font-medium">Languages:</span> {formatLanguages(selectedTutor.languages)}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Education & Subjects</h4>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <p><span className="font-medium">Degrees:</span> {selectedTutor.degrees?.join(", ") || "N/A"}</p>
                    <p><span className="font-medium">Classes:</span> {selectedTutor.classes?.join(", ") || "N/A"}</p>
                    <p><span className="font-medium">Subjects:</span> {selectedTutor.subjects?.join(", ") || "N/A"}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Subscription Details</h4>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <p><span className="font-medium">Plan:</span> {selectedTutor.plan_name || "N/A"}</p>
                    <p><span className="font-medium">Days Remaining:</span> {selectedTutor.days_remaining ?? "N/A"}</p>
                    <p className="flex items-center flex-wrap gap-2">
                      <span className="font-medium">Status:</span>
                      <select
                        value={selectedTutor.profile_status}
                        onChange={(e) => {
                          handleStatusChange(selectedTutor.user_id, e.target.value);
                          setSelectedTutor({ ...selectedTutor, profile_status: e.target.value });
                        }}
                        className={`text-xs px-2 py-1 rounded-full ${statusStyles[selectedTutor.profile_status]} cursor-pointer`}
                      >
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </p>
                    <p><span className="font-medium">Registration Date:</span> {selectedTutor.createdAt ? new Date(selectedTutor.createdAt).toLocaleDateString() : "N/A"}</p>
                  </div>
                </div>
              </div>

              {selectedTutor?.documents && Object.keys(selectedTutor.documents).length > 0 ? (
                <div className="mt-4 sm:mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents</h3>
                  <ul className="space-y-2">
                    {Object.entries(selectedTutor.documents).map(([key, doc]) => (
                      <li key={key} className="flex items-center justify-between border p-2 sm:p-3 rounded-md text-xs sm:text-sm">
                        <span className="text-gray-600 truncate mr-2">{doc.name}</span>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 whitespace-nowrap"
                        >
                          <DocumentTextIcon className="w-4 h-4" />
                          View
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mt-4 text-xs sm:text-sm text-gray-500">No documents uploaded</p>
              )}
            </div>
            <div className="sticky bottom-0 bg-white flex justify-end p-4 sm:p-6 border-t">
              <button
                onClick={() => setSelectedTutor(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTutors;