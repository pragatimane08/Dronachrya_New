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
  FileText,
  FileSpreadsheet,
  FileDigit,
  ChevronDown,
} from "lucide-react";
import { CouponRepository } from "../../../../api/repository/admin/coupon.repository";

// Default form structure
const defaultForm = {
  code: "",
  discount_type: "percentage",
  discount_value: 0,
  usage_limit: null,
  valid_from: "",
  valid_until: "",
  applicable_plan: "all",
};

const Coupons = () => {
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 15;

  const filtered = useMemo(() => {
    if (!search.trim()) return coupons;
    const searchTerm = search.trim().toLowerCase();
    return coupons.filter((c) =>
      c.code.toLowerCase().includes(searchTerm) ||
      c.discount_type.toLowerCase().includes(searchTerm) ||
      c.discount_value.toString().includes(searchTerm) ||
      c.used_count.toString().includes(searchTerm) ||
      (c.usage_limit ? c.usage_limit.toString().includes(searchTerm) : "∞".includes(searchTerm)) ||
      new Date(c.valid_from).toLocaleString().toLowerCase().includes(searchTerm) ||
      new Date(c.valid_until).toLocaleString().toLowerCase().includes(searchTerm) ||
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
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await CouponRepository.create({
        ...form,
        discount_value: Number(form.discount_value),
        usage_limit: form.usage_limit === "" ? null : Number(form.usage_limit),
      });
      setShowModal(false);
      setForm(defaultForm);
      await loadCoupons();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create coupon");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await CouponRepository.toggle(id);
      await loadCoupons();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to toggle status");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await CouponRepository.remove(id);
      await loadCoupons();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete coupon");
    }
  };

  const handleExport = (format) => {
    const exportData = filtered.map((coupon) => ({
      Code: coupon.code,
      Type: coupon.discount_type,
      Value:
        coupon.discount_type === "percentage"
          ? `${coupon.discount_value}%`
          : `₹${coupon.discount_value}`,
      Usage: `${coupon.used_count}/${coupon.usage_limit ?? "∞"}`,
      "Valid From": new Date(coupon.valid_from).toLocaleDateString(),
      "Valid Until": new Date(coupon.valid_until).toLocaleDateString(),
      Plan: coupon.applicable_plan,
      Status: coupon.is_active ? "Active" : "Inactive",
    }));

    switch (format) {
      case "csv":
        exportToCSV(exportData);
        break;
      case "excel":
        exportToExcel(exportData);
        break;
      case "pdf":
        exportToPDF(exportData);
        break;
      default:
        break;
    }
  };

  const exportToCSV = (data) => {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((header) => `"${row[header]}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `coupons_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (data) => {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join("\t"),
      ...data.map((row) => headers.map((header) => row[header]).join("\t")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `coupons_${new Date().toISOString().slice(0, 10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (data) => {
    alert("PDF export would be implemented here. Use jsPDF or pdfmake for real implementation.");
    console.log("Data for PDF export:", data);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header Row: Right-aligned controls */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        {/* <h1 className="text-xl font-bold text-gray-800">Coupons Management</h1> */}
        <div className="flex flex-wrap items-center gap-3">
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

          <button
            onClick={loadCoupons}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
              <ChevronDown size={16} />
            </button>
            <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="py-1">
                <button onClick={() => handleExport("csv")} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                  <FileSpreadsheet size={16} className="mr-2" />
                  Export as CSV
                </button>
                <button onClick={() => handleExport("excel")} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                  <FileDigit size={16} className="mr-2" />
                  Export as Excel
                </button>
                <button onClick={() => handleExport("pdf")} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                  <FileText size={16} className="mr-2" />
                  Export as PDF
                </button>
              </div>
            </div>
          </div>

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
                        <span className="font-semibold text-gray-800 bg-teal-50 px-2 py-1 rounded-md">
                          {c.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 capitalize text-gray-600">
                        {c.discount_type}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {c.discount_type === "percentage"
                          ? `${c.discount_value}%`
                          : `₹${c.discount_value}`}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-teal-500" 
                                style={{ 
                                  width: `${c.usage_limit ? (c.used_count / c.usage_limit * 100) : 0}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-gray-600">
                            {c.used_count}/{c.usage_limit ?? "∞"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="text-xs">
                          <div className="font-medium">From: {new Date(c.valid_from).toLocaleDateString()}</div>
                          <div className="font-medium">To: {new Date(c.valid_until).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                          {c.applicable_plan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            c.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {c.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() => toggleStatus(c.id)}
                            className={`p-2 rounded-full ${c.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-500 hover:bg-gray-50'}`}
                            title={c.is_active ? "Deactivate" : "Activate"}
                          >
                            {c.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                          </button>

                          <button
                            onClick={() => onDelete(c.id)}
                            className="p-2 rounded-full text-red-500 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
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
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 border border-gray-200 relative">
              <div className="p-6">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setForm(defaultForm);
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                    <input
                      type="text"
                      placeholder="SUMMER20"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
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
                        {form.discount_type === "percentage" ? "Percentage" : "Amount"}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder={form.discount_type === "percentage" ? "10" : "500"}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                          value={form.discount_value}
                          onChange={(e) =>
                            setForm({ ...form, discount_value: e.target.value })
                          }
                          required
                        />
                        <span className="absolute right-3 top-2 text-gray-500">
                          {form.discount_type === "percentage" ? "%" : "₹"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Uses (leave empty for unlimited)</label>
                    <input
                      type="number"
                      placeholder="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      value={form.usage_limit ?? ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          usage_limit: e.target.value === "" ? "" : Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Plan</label>
                    <input
                      type="text"
                      placeholder="all or specific plan name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      value={form.applicable_plan}
                      onChange={(e) =>
                        setForm({ ...form, applicable_plan: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                      <input
                        type="datetime-local"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                        value={form.valid_from}
                        onChange={(e) =>
                          setForm({ ...form, valid_from: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                      <input
                        type="datetime-local"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                        value={form.valid_until}
                        onChange={(e) =>
                          setForm({ ...form, valid_until: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setShowModal(false);
                        setForm(defaultForm);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg shadow-sm transition-all"
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