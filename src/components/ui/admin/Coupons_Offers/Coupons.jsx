import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  Trash2,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  ChevronDown,
  Check,
  X as XIcon,
  Calendar,
  DollarSign,
  Percent,
} from "lucide-react";
import { CouponRepository } from "../../../../api/repository/admin/coupon.repository";

// Toast component
const Toast = ({ message, type = "success", onClose }) => {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  
  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-80 z-50 animate-in slide-in-from-right-full duration-300`}>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
};

// Toast container component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-80 animate-in slide-in-from-right-full duration-300`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 text-white hover:text-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

// Default form structure matching backend
const defaultForm = {
  code: "",
  discount_type: "percentage",
  discount_value: 0,
  usage_limit: null,
  valid_from: "",
  valid_until: "",
  applicable_plan: "all",
  description: ""
};

// Helper function to format date for datetime-local input
const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().slice(0, 16);
};

// Helper function to get current date time for default values
const getCurrentDateTime = () => {
  const now = new Date();
  return formatDateForInput(now);
};

// Helper function to get date time for tomorrow
const getTomorrowDateTime = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDateForInput(tomorrow);
};

const Coupons = () => {
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    ...defaultForm,
    valid_from: getCurrentDateTime(),
    valid_until: getTomorrowDateTime()
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [toasts, setToasts] = useState([]);
  const entriesPerPage = 15;

  // Toast management functions
  const showToast = (message, type = "success") => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return coupons;
    const searchTerm = search.trim().toLowerCase();
    return coupons.filter((c) =>
      c.code.toLowerCase().includes(searchTerm) ||
      c.discount_type.toLowerCase().includes(searchTerm) ||
      c.discount_value.toString().includes(searchTerm) ||
      c.used_count.toString().includes(searchTerm) ||
      (c.usage_limit ? c.usage_limit.toString().includes(searchTerm) : "∞".includes(searchTerm)) ||
      new Date(c.valid_from).toLocaleDateString().toLowerCase().includes(searchTerm) ||
      new Date(c.valid_until).toLocaleDateString().toLowerCase().includes(searchTerm) ||
      c.applicable_plan.toLowerCase().includes(searchTerm) ||
      (c.is_active ? "active" : "inactive").includes(searchTerm)
    );
  }, [coupons, search]);

  const totalPages = Math.ceil(filtered.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filtered.slice(indexOfFirstEntry, indexOfLastEntry);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await CouponRepository.list();
      setCoupons(data.coupons || []);
      setCurrentPage(1);
      showToast("Coupons loaded successfully");
    } catch (err) {
      console.error('Error loading coupons:', err);
      showToast(err.response?.data?.message || "Failed to fetch coupons", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const validateForm = () => {
    const errors = {};
    
    if (!form.code.trim()) {
      errors.code = "Coupon code is required";
    } else if (form.code.length < 3) {
      errors.code = "Coupon code must be at least 3 characters";
    }

    if (!form.discount_value || form.discount_value <= 0) {
      errors.discount_value = "Discount value must be greater than 0";
    }

    if (form.discount_type === "percentage" && form.discount_value > 100) {
      errors.discount_value = "Percentage discount cannot exceed 100%";
    }

    if (!form.valid_from) {
      errors.valid_from = "Valid from date is required";
    }

    if (!form.valid_until) {
      errors.valid_until = "Valid until date is required";
    }

    if (form.valid_from && form.valid_until) {
      const fromDate = new Date(form.valid_from);
      const untilDate = new Date(form.valid_until);
      if (untilDate <= fromDate) {
        errors.valid_until = "Valid until must be after valid from date";
      }
    }

    if (!form.applicable_plan.trim()) {
      errors.applicable_plan = "Applicable plan is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare payload matching backend expectations
      const payload = {
        code: form.code.trim().toUpperCase(),
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        usage_limit: form.usage_limit === "" || form.usage_limit === null ? null : Number(form.usage_limit),
        valid_from: new Date(form.valid_from).toISOString(),
        valid_until: new Date(form.valid_until).toISOString(),
        applicable_plan: form.applicable_plan.trim(),
        description: form.description?.trim() || null
      };

      console.log('Creating coupon with payload:', payload);

      const response = await CouponRepository.create(payload);
      
      if (response.data) {
        setShowModal(false);
        setForm({
          ...defaultForm,
          valid_from: getCurrentDateTime(),
          valid_until: getTomorrowDateTime()
        });
        setFormErrors({});
        await loadCoupons();
        
        // Show success message
        showToast('Coupon created successfully!');
      }
    } catch (err) {
      console.error('Error creating coupon:', err);
      const errorMessage = err.response?.data?.message || "Failed to create coupon";
      showToast(errorMessage, "error");
      
      // Handle duplicate code error specifically
      if (err.response?.data?.message?.includes('already exists')) {
        setFormErrors({ code: 'This coupon code already exists' });
      }
    }
  };

  const toggleStatus = async (id) => {
    try {
      await CouponRepository.toggle(id);
      await loadCoupons();
      showToast("Coupon status updated successfully");
    } catch (err) {
      console.error('Error toggling coupon status:', err);
      showToast(err.response?.data?.message || "Failed to toggle status", "error");
    }
  };

  const startDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const confirmDelete = async (id) => {
    setDeletingId(id);
    try {
      await CouponRepository.remove(id);
      await loadCoupons();
      showToast("Coupon deleted successfully");
    } catch (err) {
      console.error('Error deleting coupon:', err);
      showToast(err.response?.data?.message || "Failed to delete coupon", "error");
    } finally {
      setDeletingId(null);
      setDeleteConfirmId(null);
    }
  };

  const formatDateForExcel = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleExport = (format) => {
    const exportData = filtered.map((coupon) => ({
      Code: coupon.code,
      Type: coupon.discount_type.charAt(0).toUpperCase() + coupon.discount_type.slice(1),
      Value: coupon.discount_type === "percentage" 
        ? `${coupon.discount_value}%` 
        : `₹${coupon.discount_value.toLocaleString()}`,
      Usage: `${coupon.used_count}/${coupon.usage_limit ?? "∞"}`,
      "Valid From": formatDateForExcel(coupon.valid_from),
      "Valid Until": formatDateForExcel(coupon.valid_until),
      Plan: coupon.applicable_plan.charAt(0).toUpperCase() + coupon.applicable_plan.slice(1),
      Status: coupon.is_active ? "Active" : "Inactive",
    }));

    switch (format) {
      case "excel":
        exportToExcel(exportData);
        break;
      default:
        break;
    }
  };

  const exportToExcel = (data) => {
    if (data.length === 0) {
      showToast("No data to export", "error");
      return;
    }

    const headers = Object.keys(data[0]);
    
    // Create CSV content with proper formatting
    let csvContent = headers.join("\t") + "\n";
    
    data.forEach(row => {
      const rowData = headers.map(header => {
        // Ensure proper formatting for Excel
        const value = row[header];
        // Wrap in quotes if contains special characters or spaces
        if (typeof value === 'string' && (value.includes(' ') || value.includes('\t') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvContent += rowData.join("\t") + "\n";
    });

    // Create and download file
    const blob = new Blob([csvContent], { 
      type: "application/vnd.ms-excel;charset=utf-8" 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    // Create filename with current date
    const currentDate = new Date().toISOString().slice(0, 10);
    link.setAttribute("download", `coupons_${currentDate}.xls`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast("Coupons exported successfully");
  };

  const resetForm = () => {
    setForm({
      ...defaultForm,
      valid_from: getCurrentDateTime(),
      valid_until: getTomorrowDateTime()
    });
    setFormErrors({});
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Header Row: Right-aligned controls */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search coupons..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-3 py-2 w-64 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={loadCoupons}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
              <ChevronDown size={16} />
            </button>
            <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="py-1">
                <button 
                  onClick={() => handleExport("excel")} 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Export as Excel
                </button>
              </div>
            </div>
          </div>

          {/* Add Coupon Button */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium rounded-lg shadow-sm transition-all hover:shadow-md"
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} />
            <span>Add Coupon</span>
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">Code</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Value</th>
                <th className="px-6 py-3 text-left">Usage</th>
                <th className="px-6 py-3 text-left">Validity</th>
                <th className="px-6 py-3 text-left">Plan</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-sm">
              {!loading && currentEntries.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    {search ? "No coupons match your search criteria." : "No coupons available. Create your first coupon!"}
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                currentEntries.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-semibold text-gray-800 bg-teal-50 px-2 py-1 rounded-md">
                          {c.code}
                        </span>
                        {c.description && (
                          <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                            {c.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-600">
                      {c.discount_type}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {c.discount_type === "percentage"
                        ? `${c.discount_value}%`
                        : `₹${c.discount_value.toLocaleString()}`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-teal-500" 
                              style={{ 
                                width: `${c.usage_limit ? Math.min((c.used_count / c.usage_limit * 100), 100) : 0}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-gray-600 text-sm">
                          {c.used_count}/{c.usage_limit ?? "∞"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="text-xs">
                        <div className="font-medium">
                          {new Date(c.valid_from).toLocaleDateString()}
                        </div>
                        <div className="font-medium">
                          {new Date(c.valid_until).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        c.applicable_plan === 'all' 
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {c.applicable_plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(c.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                          c.is_active
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {c.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end items-center gap-2">
                        {/* Delete Button with Inline Confirmation */}
                        {deleteConfirmId === c.id ? (
                          <div className="flex items-center gap-1 bg-red-50 rounded-lg p-1 border border-red-200">
                            <span className="text-xs text-red-700 px-2 whitespace-nowrap">
                              Delete?
                            </span>
                            <button
                              onClick={() => confirmDelete(c.id)}
                              disabled={deletingId === c.id}
                              className="p-1 rounded text-green-600 hover:bg-green-100 transition-colors"
                              title="Confirm Delete"
                            >
                              {deletingId === c.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-600"></div>
                              ) : (
                                <Check size={16} />
                              )}
                            </button>
                            <button
                              onClick={cancelDelete}
                              disabled={deletingId === c.id}
                              className="p-1 rounded text-gray-600 hover:bg-gray-100 transition-colors"
                              title="Cancel"
                            >
                              <XIcon size={16} />
                            </button>
                          </div>
                        ) : deletingId === c.id ? (
                          <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-1 border border-green-200">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-600"></div>
                            <span className="text-xs text-green-700 whitespace-nowrap">
                              Deleting...
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => startDelete(c.id)}
                            className="p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{indexOfFirstEntry + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(indexOfLastEntry, filtered.length)}
            </span>{' '}
            of <span className="font-medium">{filtered.length}</span> results
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => paginate(1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${currentPage === 1 ? 
                'text-gray-400 cursor-not-allowed' : 
                'text-gray-700 hover:bg-gray-100'}`}
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${currentPage === 1 ? 
                'text-gray-400 cursor-not-allowed' : 
                'text-gray-700 hover:bg-gray-100'}`}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`p-2 rounded-md ${currentPage === totalPages || totalPages === 0 ? 
                'text-gray-400 cursor-not-allowed' : 
                'text-gray-700 hover:bg-gray-100'}`}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => paginate(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`p-2 rounded-md ${currentPage === totalPages || totalPages === 0 ? 
                'text-gray-400 cursor-not-allowed' : 
                'text-gray-700 hover:bg-gray-100'}`}
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 border border-gray-200 relative max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">Create New Coupon</h2>
                <p className="text-gray-500 text-sm">Fill in the details below</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    placeholder="SUMMER20"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all ${
                      formErrors.code ? 'border-red-300' : 'border-gray-300'
                    }`}
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    required
                  />
                  {formErrors.code && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.code}</p>
                  )}
                </div>

                {/* Discount Type and Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Type *
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      value={form.discount_type}
                      onChange={(e) =>
                        setForm({ ...form, discount_type: e.target.value })
                      }
                      required
                    >
                      <option value="percentage">Percentage</option>
                      <option value="flat">Flat Amount</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {form.discount_type === "percentage" ? "Percentage *" : "Amount *"}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step={form.discount_type === "percentage" ? "1" : "0.01"}
                        min="0"
                        max={form.discount_type === "percentage" ? "100" : undefined}
                        placeholder={form.discount_type === "percentage" ? "10" : "500"}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all pr-10 ${
                          formErrors.discount_value ? 'border-red-300' : 'border-gray-300'
                        }`}
                        value={form.discount_value}
                        onChange={(e) =>
                          setForm({ ...form, discount_value: e.target.value })
                        }
                        required
                      />
                      <span className="absolute right-3 top-2 text-gray-500">
                        {form.discount_type === "percentage" ? (
                          <Percent size={16} />
                        ) : (
                          <DollarSign size={16} />
                        )}
                      </span>
                    </div>
                    {formErrors.discount_value && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.discount_value}</p>
                    )}
                  </div>
                </div>

                {/* Usage Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Uses (leave empty for unlimited)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    value={form.usage_limit ?? ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        usage_limit: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                  />
                </div>

                {/* Applicable Plan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Applicable Plan *
                  </label>
                  <input
                    type="text"
                    placeholder="all or specific plan name"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all ${
                      formErrors.applicable_plan ? 'border-red-300' : 'border-gray-300'
                    }`}
                    value={form.applicable_plan}
                    onChange={(e) =>
                      setForm({ ...form, applicable_plan: e.target.value })
                    }
                    required
                  />
                  {formErrors.applicable_plan && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.applicable_plan}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Use "all" for all plans or specify a plan name
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    placeholder="Coupon description..."
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>

                {/* Validity Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid From *
                    </label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all ${
                          formErrors.valid_from ? 'border-red-300' : 'border-gray-300'
                        }`}
                        value={form.valid_from}
                        onChange={(e) =>
                          setForm({ ...form, valid_from: e.target.value })
                        }
                        required
                      />
                      <Calendar className="absolute right-3 top-2 h-4 w-4 text-gray-400" />
                    </div>
                    {formErrors.valid_from && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.valid_from}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid Until *
                    </label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all ${
                          formErrors.valid_until ? 'border-red-300' : 'border-gray-300'
                        }`}
                        value={form.valid_until}
                        onChange={(e) =>
                          setForm({ ...form, valid_until: e.target.value })
                        }
                        required
                      />
                      <Calendar className="absolute right-3 top-2 h-4 w-4 text-gray-400" />
                    </div>
                    {formErrors.valid_until && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.valid_until}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg shadow-sm transition-all font-medium"
                  >
                    Create Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;