import React, { useEffect, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { adminInvoiceRepository } from "../../../../api/repository/admin/admin_invoices.repository";
import { toast } from "react-toastify";
import moment from "moment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    role: "",
    plan: "",
    startDate: "",
    endDate: "",
  });

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await adminInvoiceRepository.getAllInvoices();
      if (res.success && Array.isArray(res.data)) {
        setInvoices(res.data);
      } else {
        toast.error("Invalid invoice data");
      }
    } catch (error) {
      toast.error("Error fetching invoices");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = async () => {
    try {
      const res = await adminInvoiceRepository.downloadInvoiceCSV();
      if (!res) return toast.error("Failed to download CSV");

      const blob = new Blob([res], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "invoices.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV download failed", err);
      toast.error("Download failed");
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Invoices Report", 14, 14);
    autoTable(doc, {
      startY: 20,
      head: [[
        "Invoice ID", "Name", "Email", "Role", "Plan",
        "Amount", "Date", "Payment ID"
      ]],
      body: filteredInvoices.map((inv) => [
        inv.invoice_id,
        inv.user_name?.trim() || "-",
        inv.email,
        inv.role,
        inv.plan,
        `₹${inv.amount}`,
        moment(inv.date, ["D/M/YYYY, h:mm:ss a"]).format("DD/MM/YYYY"),
        inv.razorpay_payment_id
      ]),
    });
    doc.save("invoices.pdf");
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      role: "",
      plan: "",
      startDate: "",
      endDate: "",
    });
  };

  const filteredInvoices = invoices.filter((inv) => {
    const nameMatch = inv.user_name?.toLowerCase().includes(filters.name.toLowerCase());
    const roleMatch = filters.role ? inv.role?.toLowerCase() === filters.role : true;
    const planMatch = filters.plan ? inv.plan?.toLowerCase().includes(filters.plan) : true;

    const invoiceDate = moment(inv.date, ["D/M/YYYY, h:mm:ss a"]).startOf("day");
    const startDateMatch = filters.startDate
      ? invoiceDate.isSameOrAfter(moment(filters.startDate).startOf("day"))
      : true;
    const endDateMatch = filters.endDate
      ? invoiceDate.isSameOrBefore(moment(filters.endDate).endOf("day"))
      : true;

    return nameMatch && roleMatch && planMatch && startDateMatch && endDateMatch;
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto w-full">
        {/* Header */}
        {/* <div className="mb-6">
          <h1 className="text-2xl text-gray-800">Invoice Management</h1>
          <p className="text-gray-600">View and manage all system invoices</p>
        </div> */}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6 w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
            >
              <span>Clear all</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          <div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 mb-1">Search by name</label>
              <input
                type="text"
                placeholder="Enter name..."
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#35BAA3] focus:border-transparent"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 mb-1">Role</label>
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#35BAA3] focus:border-transparent"
              >
                <option value="">All Roles</option>
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 mb-1">Plan</label>
              <select
                value={filters.plan}
                onChange={(e) => handleFilterChange("plan", e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#35BAA3] focus:border-transparent"
              >
                <option value="">All Plans</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 mb-1">From Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#35BAA3] focus:border-transparent"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 mb-1">To Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#35BAA3] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Actions and Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full">
          <div className="flex flex-wrap justify-between items-center p-4 border-b border-gray-200">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{filteredInvoices.length}</span> invoices
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 bg-[#35BAA3] hover:bg-[#2ea893] text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={exportPDF}
                className="flex items-center gap-2 bg-[#2F4380] hover:bg-[#223366] text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="w-full">
            <table className="w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-1/8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice ID
                  </th>
                  <th className="w-1/8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="w-2/8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="w-1/8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="w-1/8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="w-1/8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="w-1/8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="w-2/8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#35BAA3]"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      No invoices found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 group relative">
                        <span className="truncate block text-sm font-medium text-gray-900">
                          {invoice.invoice_id}
                        </span>
                        <div className="absolute z-10 hidden group-hover:block bottom-full mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap">
                          {invoice.invoice_id}
                        </div>
                      </td>
                      <td className="px-6 py-4 truncate text-sm text-gray-500">
                        {invoice.user_name?.trim() || "-"}
                      </td>
                      <td className="px-6 py-4 truncate text-sm text-gray-500">
                        {invoice.email}
                      </td>
                      <td className="px-6 py-4 truncate text-sm text-gray-500 capitalize">
                        {invoice.role}
                      </td>
                      <td className="px-6 py-4 truncate text-sm text-gray-500">
                        {invoice.plan}
                      </td>
                      <td className="px-6 py-4 truncate text-sm text-gray-500">
                        ₹{invoice.amount}
                      </td>
                      <td className="px-6 py-4 truncate text-sm text-gray-500">
                        {moment(invoice.date, ["D/M/YYYY, h:mm:ss a"]).isValid()
                          ? moment(invoice.date, ["D/M/YYYY, h:mm:ss a"]).format("DD/MM/YYYY")
                          : "Invalid Date"}
                      </td>
                      <td className="px-6 py-4 truncate text-sm text-gray-500">
                        {invoice.razorpay_payment_id}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInvoices;