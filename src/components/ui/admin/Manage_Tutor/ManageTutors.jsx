// src/pages/admin/tutors/ManageTutors.jsx
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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const exportRef = useRef(null);

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
    if (!window.confirm("Are you sure you want to delete this tutor?")) return;
    try {
      await tutorRepository.deleteTutor(user_id);
      fetchTutors();
      setPage(1);
    } catch (err) {
      console.error("Delete failed", err);
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

  // CSV export with Registration Date
  const exportToCSV = () => {
    const csvContent = [
      [
        "ID",
        "Name",
        "Location",
        "Subjects",
        "Status",
        "Subscription",
        "Ends In",
        "Registration Date", // Added Registration Date
      ].join(","),
      ...allTutors.map((t) =>
        [
          t.user_id,
          t.name,
          `${t.Location?.city}, ${t.Location?.state}`,
          t.subjects?.join("; "),
          t.profile_status,
          t.plan_name || "N/A",
          `${t.days_remaining ?? "N/A"} days`,
          t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "N/A", // Added Registration Date
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "tutors.csv");
    setExportOpen(false);
  };

  // PDF export with Registration Date
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Tutors Report", 14, 10);

    const tableColumn = [
      "ID",
      "Name",
      "Location",
      "Subjects",
      "Status",
      "Subscription",
      "Ends In",
      "Reg. Date", // Added Registration Date
    ];
    const tableRows = [];

    allTutors.forEach((t) => {
      tableRows.push([
        t.user_id,
        t.name,
        `${t.Location?.city}, ${t.Location?.state}`,
        t.subjects?.join(", "),
        t.profile_status,
        t.plan_name || "N/A",
        (t.days_remaining ?? "N/A") + " days",
        t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "N/A", // Added Registration Date
      ]);
    });

    autoTable(doc, {
      startY: 20,
      head: [tableColumn],
      body: tableRows,
      styles: { halign: "left", fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      alternateRowStyles: { fillColor: [241, 245, 249] },
    });

    doc.save("tutors.pdf");
    setExportOpen(false);
  };

  // Excel export with Registration Date
  const exportToExcel = () => {
    const worksheetData = allTutors.map((t) => ({
      ID: t.user_id,
      Name: t.name,
      Location: `${t.Location?.city}, ${t.Location?.state}`,
      Subjects: t.subjects?.join(", "),
      Status: t.profile_status,
      Subscription: t.plan_name || "N/A",
      EndsIn: `${t.days_remaining ?? "N/A"} days`,
      RegistrationDate: t.createdAt
        ? new Date(t.createdAt).toLocaleDateString()
        : "N/A", // Added Registration Date
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setExportOpen(false);
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
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        {/* Mobile Filters Button */}
        <div className="sm:hidden mb-4">
          <button
            type="button"
            className="flex items-center justify-center w-full rounded-md bg-blue-600 px-4 py-2 text-white"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <span>Filters</span>
            <FunnelIcon className="ml-2 h-5 w-5" />
          </button>
        </div>

        {/* Mobile Filters Panel */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileFiltersOpen(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-xs mx-auto p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                <button
                  type="button"
                  className="-mr-2 w-10 h-10 bg-white p-2 rounded-md text-gray-400 hover:text-gray-500"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchInput}
                      onChange={(e) => {
                        setSearchInput(e.target.value);
                        debouncedSearch(e.target.value);
                      }}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <select
                    onChange={(e) => setFilterCity(e.target.value)}
                    value={filterCity}
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    onChange={(e) => setFilterSubject(e.target.value)}
                    value={filterSubject}
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                  <select
                    onChange={(e) => setFilterPlan(e.target.value)}
                    value={filterPlan}
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  }}
                  className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters + Export Row */}
        <div className="mb-6 w-full">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Left Filters - Desktop */}
            <div className="hidden sm:flex flex-wrap md:flex-nowrap items-center gap-4 w-full">
              {/* Search */}
              <div className="relative w-full md:w-64">
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* City Filter */}
              <div className="relative w-full md:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FunnelIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  onChange={(e) => setFilterCity(e.target.value)}
                  value={filterCity}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="">All Cities</option>
                  {[...new Set(allTutors.map((t) => t.Location?.city))].filter(Boolean).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Filter */}
              <div className="relative w-full md:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FunnelIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  onChange={(e) => setFilterSubject(e.target.value)}
                  value={filterSubject}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="">All Subjects</option>
                  {[...new Set(allTutors.flatMap((t) => t.subjects || []))].map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* Plan Filter */}
              <div className="relative w-full md:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FunnelIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  onChange={(e) => setFilterPlan(e.target.value)}
                  value={filterPlan}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="">All Plans</option>
                  {[...new Set(allTutors.map((t) => t.plan_name || "N/A"))].map((plan) => (
                    <option key={plan} value={plan}>
                      {plan}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Side: Export Button */}
            <div className="flex justify-end">
              <div className="relative" ref={exportRef}>
                <button
                  onClick={() => setExportOpen(!exportOpen)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Export</span>
                </button>

                {exportOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl border border-gray-200 rounded-lg z-[1000] overflow-hidden">
                    <button
                      onClick={exportToCSV}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    >
                      <TableCellsIcon className="w-5 h-5 mr-2 text-blue-500" />
                      Export CSV
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    >
                      <DocumentTextIcon className="w-5 h-5 mr-2 text-red-500" />
                      Export PDF
                    </button>
                    <button
                      onClick={exportToExcel}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    >
                      <DocumentArrowDownIcon className="w-5 h-5 mr-2 text-green-500" />
                      Export Excel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {(filterCity || filterSubject || filterPlan || searchInput) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setFilterCity("");
                  setFilterSubject("");
                  setFilterPlan("");
                  setSearchInput("");
                  setSearchTerm("");
                }}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <span>Clear all filters</span>
                <XMarkIcon className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="w-full max-w-7xl mx-auto border border-gray-200 rounded-lg shadow-sm mb-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "ID",
                  "Name",
                  isMobile ? "" : "Location",
                  isMobile ? "" : "Class Modes",
                  isMobile ? "" : "Subjects",
                  "Status",
                  isTablet ? "Sub" : "Subscription",
                  isMobile ? "" : "Ends In",
                  isMobile ? "" : "Reg. Date", // Added Registration Date column header
                  "Actions",
                ].filter(Boolean).map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {tutors.length > 0 ? (
                tutors.map((tutor) => (
                  <tr
                    key={tutor.user_id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="relative group max-w-[80px] truncate text-sm text-gray-500 cursor-default">
                        {tutor.user_id.substring(0, 4)}...
                        <div className="absolute hidden group-hover:block bg-white border border-gray-300 shadow-md rounded px-2 py-1 text-xs text-gray-800 z-20 left-0 top-full mt-1 w-max max-w-xs break-all">
                          {tutor.user_id}
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {tutor.name}
                      </div>
                    </td>

                    {!isMobile && (
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tutor.Location?.city || "N/A"},{" "}
                        {tutor.Location?.state || ""}
                      </td>
                    )}

                    {!isMobile && (
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tutor.teaching_modes?.length > 0
                          ? isTablet 
                            ? tutor.teaching_modes.map(mode => mode.charAt(0)).join(", ")
                            : tutor.teaching_modes.join(", ")
                          : "N/A"}
                      </td>
                    )}

                    {!isMobile && (
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tutor.subjects?.length > 0
                          ? isTablet 
                            ? tutor.subjects.slice(0, 2).join(", ") + (tutor.subjects.length > 2 ? "..." : "")
                            : tutor.subjects.join(", ")
                          : "N/A"}
                      </td>
                    )}

                    <td className="px-3 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[tutor.profile_status]}`}
                      >
                        {isMobile ? tutor.profile_status.substring(0, 1) : tutor.profile_status}
                      </span>
                    </td>

                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isMobile 
                        ? tutor.plan_name?.substring(0, 3) || "N/A"
                        : isTablet
                          ? tutor.plan_name?.substring(0, 5) + (tutor.plan_name?.length > 5 ? "..." : "") || "N/A"
                          : tutor.plan_name || "N/A"}
                    </td>

                    {!isMobile && (
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tutor.days_remaining != null
                          ? `${tutor.days_remaining}d`
                          : "N/A"}
                      </td>
                    )}

                    {!isMobile && (
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tutor.createdAt
                          ? new Date(tutor.createdAt).toLocaleDateString()
                          : "N/A"} {/* Added Registration Date column data */}
                      </td>
                    )}

                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium space-y-1">
                      <select
                        value={tutor.profile_status}
                        onChange={(e) =>
                          handleStatusChange(tutor.user_id, e.target.value)
                        }
                        className="block w-full pl-2 pr-8 py-1 text-xs sm:text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                      >
                        <option value="" disabled hidden>
                          {isMobile ? "Status" : "Change Status"}
                        </option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>

                      <button
                        onClick={() => setSelectedTutor(tutor)}
                        className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm"
                      >
                        {isMobile ? "View" : "View Details"}
                      </button>

                      <button
                        onClick={() => handleDelete(tutor.user_id)}
                        className="text-red-600 hover:text-red-900 text-xs sm:text-sm flex items-center"
                      >
                        {isMobile ? (
                          <TrashIcon className="w-4 h-4" />
                        ) : (
                          <>
                            <TrashIcon className="w-4 h-4 mr-1" />
                            Delete
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={isMobile ? 5 : 10} // Updated colspan to match new column count
                    className="px-4 py-4 text-center text-sm text-gray-500"
                  >
                    No tutors found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-gray-200 bg-white">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="ml-3 relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(page * ITEMS_PER_PAGE, allTutors.length)}
                </span>{' '}
                of <span className="font-medium">{allTutors.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${page === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === pageNum
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && page < totalPages - 2 && (
                  <span className="px-2 py-2">...</span>
                )}
                {totalPages > 5 && page < totalPages - 2 && (
                  <button
                    onClick={() => setPage(totalPages)}
                    className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${page === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* View Details Modal */}
        {selectedTutor && (
          <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {selectedTutor.name}'s Details
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedTutor(null)}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedTutor.User?.email || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedTutor.User?.mobile_number || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Subjects</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedTutor.subjects?.join(", ") || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Degrees</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedTutor.degrees?.join(", ") || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Experience</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedTutor.experience || "N/A"} years
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Registration Date</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedTutor.createdAt ? new Date(selectedTutor.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Pricing</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      ₹{selectedTutor.pricing_per_hour || "N/A"} /hr
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Teaching Modes</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedTutor.teaching_modes?.join(", ") || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Languages</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedTutor.languages
                        ?.map((l) => `${l.language} (${l.proficiency})`)
                        .join(", ") || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedTutor.Location?.city || "N/A"},{" "}
                      {selectedTutor.Location?.state || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Subscription</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedTutor.plan_name || "N/A"} ({selectedTutor.days_remaining ?? "N/A"} days remaining)
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Upload & Download */}
              <div className="p-4 sm:p-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3 sm:mb-4">Documents</h3>

                {/* Uploaded Documents */}
                <div className="mb-4 space-y-2 bg-white">
                  {selectedTutor.documents && Object.keys(selectedTutor.documents).length > 0 ? (
                    Object.entries(selectedTutor.documents).map(([key, doc]) => (
                      <div key={key} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                        <span className="text-sm text-gray-800">{key.toUpperCase()}: {doc.name}</span>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Download
                        </a>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No documents uploaded.</p>
                  )}
                </div>
              </div>

              {/* Download Buttons */}
              <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => {
                    const doc = new jsPDF();
                    doc.text(`${selectedTutor.name}'s Details`, 14, 10);
                    autoTable(doc, {
                      startY: 20,
                      head: [["Field", "Value"]],
                      body: [
                        ["Email", selectedTutor.User?.email || "N/A"],
                        ["Phone", selectedTutor.User?.mobile_number || "N/A"],
                        ["Subjects", selectedTutor.subjects?.join(", ") || "N/A"],
                        ["Degrees", selectedTutor.degrees?.join(", ") || "N/A"],
                        ["Experience", selectedTutor.experience + " yrs" || "N/A"],
                        ["Pricing", `₹${selectedTutor.pricing_per_hour}/hr` || "N/A"],
                        ["Mode", selectedTutor.teaching_modes?.join(", ") || "N/A"],
                        ["Languages", selectedTutor.languages?.map(l => `${l.language} (${l.proficiency})`).join(", ") || "N/A"],
                        ["Location", `${selectedTutor.Location?.city}, ${selectedTutor.Location?.state}` || "N/A"],
                        ["Subscription", selectedTutor.plan_name || "N/A"],
                        ["Days Remaining", (selectedTutor.days_remaining ?? "N/A") + " days"],
                        ["Registration Date", selectedTutor.createdAt ? new Date(selectedTutor.createdAt).toLocaleDateString() : "N/A"],
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
                    doc.save(`${selectedTutor.name}_details.pdf`);
                  }}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <DocumentTextIcon className="w-5 h-5 mr-2" />
                  Download PDF
                </button>

                <button
                  onClick={() => {
                    const worksheetData = [{
                      Name: selectedTutor.name,
                      Email: selectedTutor.User?.email,
                      Phone: selectedTutor.User?.mobile_number,
                      Subjects: selectedTutor.subjects?.join(", "),
                      Degrees: selectedTutor.degrees?.join(", "),
                      Experience: selectedTutor.experience + " yrs",
                      Pricing: `₹${selectedTutor.pricing_per_hour}/hr`,
                      Mode: selectedTutor.teaching_modes?.join(", "),
                      Languages: selectedTutor.languages?.map(l => `${l.language} (${l.proficiency})`).join(", "),
                      Location: `${selectedTutor.Location?.city}, ${selectedTutor.Location?.state}`,
                      Subscription: selectedTutor.plan_name || "N/A",
                      DaysRemaining: `${selectedTutor.days_remaining ?? "N/A"} days`,
                      RegistrationDate: selectedTutor.createdAt ? new Date(selectedTutor.createdAt).toLocaleDateString() : "N/A",
                    }];
                    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, "Tutor Details");
                    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
                    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
                    saveAs(file, `${selectedTutor.name}_details.xlsx`);
                  }}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <TableCellsIcon className="w-5 h-5 mr-2" />
                  Download Excel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTutors;