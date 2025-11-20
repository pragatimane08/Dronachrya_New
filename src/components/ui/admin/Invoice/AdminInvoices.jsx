import React, { useEffect, useState } from "react";
import { ArrowDownTrayIcon, XMarkIcon, EyeIcon } from "@heroicons/react/24/outline";
import { adminInvoiceRepository } from "../../../../api/repository/admin/admin_invoices.repository";
import { toast } from "react-toastify";
import moment from "moment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  const handleRowClick = (invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInvoice(null);
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
    const doc = new jsPDF('landscape', 'mm', 'a4');
    
    doc.setFont("helvetica");
    
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice Report", 14, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${moment().format("DD/MM/YYYY hh:mm A")}`, 14, 28);
    doc.text(`Records: ${filteredInvoices.length}`, 200, 28);
    
    autoTable(doc, {
      startY: 35,
      head: [[
        "Invoice ID", "Name", "Email", "Role", "Plan",
        "Base Amt", "GST%", "GST Amt", "Total Amt",
        "Date", "Payment ID"
      ]],
      body: filteredInvoices.map((inv) => [
        inv.invoice_id || "-",
        inv.user_name?.trim() || "-",
        inv.email || "-",
        inv.role || "-",
        inv.plan || "-",
        inv.base_amount ? `Rs.${parseFloat(inv.base_amount).toLocaleString('en-IN')}` : "-",
        inv.gst_percentage ? `${inv.gst_percentage}%` : "-",
        inv.gst_amount ? `Rs.${parseFloat(inv.gst_amount).toLocaleString('en-IN')}` : "-",
        inv.total_amount ? `Rs.${parseFloat(inv.total_amount).toLocaleString('en-IN')}` : "-",
        moment(inv.date, ["D/M/YYYY, h:mm:ss a"]).isValid()
          ? moment(inv.date, ["D/M/YYYY, h:mm:ss a"]).format("DD/MM/YY")
          : "-",
        inv.razorpay_payment_id || "-"
      ]),
      theme: 'striped',
      headStyles: {
        fillColor: [53, 186, 163],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 4
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 3,
        valign: 'middle'
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'auto',
        fontSize: 8,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 25 },
        2: { cellWidth: 35 },
        3: { cellWidth: 12 },
        4: { cellWidth: 12 },
        5: { cellWidth: 18, halign: 'right' },
        6: { cellWidth: 10, halign: 'center' },
        7: { cellWidth: 18, halign: 'right' },
        8: { cellWidth: 20, halign: 'right', fontStyle: 'bold' },
        9: { cellWidth: 18, halign: 'center' },
        10: { cellWidth: 45, halign: 'left' }
      },
      margin: { left: 10, right: 10 },
      didDrawPage: (data) => {
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        
        doc.setFontSize(8);
        doc.text(`Page ${data.pageNumber}`, 14, pageHeight - 10);
        doc.text("Invoice Management System", pageWidth - 14, pageHeight - 10, { align: 'right' });
      }
    });
    
    const finalY = doc.lastAutoTable.finalY + 10;
    const totals = filteredInvoices.reduce((acc, inv) => ({
      base: acc.base + (parseFloat(inv.base_amount) || 0),
      gst: acc.gst + (parseFloat(inv.gst_amount) || 0),
      total: acc.total + (parseFloat(inv.total_amount) || 0)
    }), { base: 0, gst: 0, total: 0 });
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Summary:", 14, finalY);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Base: Rs.${totals.base.toLocaleString('en-IN')} | GST: Rs.${totals.gst.toLocaleString('en-IN')} | Total: Rs.${totals.total.toLocaleString('en-IN')}`, 14, finalY + 8);
    
    doc.save(`invoices_${moment().format("DDMMYYYY_HHmm")}.pdf`);
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
              {/* <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                <EyeIcon className="h-3 w-3 inline mr-1" />
                Click row for details
              </span> */}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 bg-[#35BAA3] hover:bg-[#2ea893] text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Export Excel</span>
              </button>
              {/* <button
                onClick={exportPDF}
                className="flex items-center gap-2 bg-[#2F4380] hover:bg-[#223366] text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Export PDF</span>
              </button> */}
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="11" className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#35BAA3]"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="px-6 py-4 text-center text-gray-500">
                      No invoices found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice, idx) => (
                    <tr 
                      key={idx} 
                      className="hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                      onClick={() => handleRowClick(invoice)}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 truncate">{invoice.invoice_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 truncate">{invoice.user_name?.trim() || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 truncate">{invoice.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 capitalize truncate">{invoice.role}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 truncate">{invoice.plan}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">₹{invoice.base_amount}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{invoice.gst_percentage}%</td>
                      <td className="px-6 py-4 text-sm text-gray-500">₹{invoice.gst_amount}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">₹{invoice.total_amount}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {moment(invoice.date, ["D/M/YYYY, h:mm:ss a"]).isValid()
                          ? moment(invoice.date, ["D/M/YYYY, h:mm:ss a"]).format("DD/MM/YYYY")
                          : "Invalid Date"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 truncate">{invoice.razorpay_payment_id}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {showModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Invoice Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Basic Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Invoice ID</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">{selectedInvoice.invoice_id || "N/A"}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">User Name</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">{selectedInvoice.user_name?.trim() || "N/A"}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">Email</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">{selectedInvoice.email || "N/A"}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">Role</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded capitalize">{selectedInvoice.role || "N/A"}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">Plan</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded capitalize">{selectedInvoice.plan || "N/A"}</p>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Payment Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Base Amount</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">₹{selectedInvoice.base_amount || "0"}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">GST Percentage</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">{selectedInvoice.gst_percentage || "0"}%</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">GST Amount</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">₹{selectedInvoice.gst_amount || "0"}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">Total Amount</label>
                      <p className="mt-1 text-lg font-semibold text-green-600 bg-green-50 px-3 py-2 rounded">₹{selectedInvoice.total_amount || "0"}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">Date</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                        {moment(selectedInvoice.date, ["D/M/YYYY, h:mm:ss a"]).isValid()
                          ? moment(selectedInvoice.date, ["D/M/YYYY, h:mm:ss a"]).format("DD/MM/YYYY hh:mm A")
                          : "Invalid Date"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment ID - Full Width */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-600">Razorpay Payment ID</label>
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded font-mono break-all">{selectedInvoice.razorpay_payment_id || "N/A"}</p>
                </div>

                {/* Additional Fields if they exist */}
                {Object.keys(selectedInvoice).some(key => 
                  !['invoice_id', 'user_name', 'email', 'role', 'plan', 'base_amount', 'gst_percentage', 'gst_amount', 'total_amount', 'date', 'razorpay_payment_id'].includes(key)
                ) && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-800 border-b pb-2 mb-4">Additional Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(selectedInvoice).map(([key, value]) => {
                        if (!['invoice_id', 'user_name', 'email', 'role', 'plan', 'base_amount', 'gst_percentage', 'gst_amount', 'total_amount', 'date', 'razorpay_payment_id'].includes(key)) {
                          return (
                            <div key={key}>
                              <label className="block text-sm font-medium text-gray-600 capitalize">{key.replace(/_/g, ' ')}</label>
                              <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">{value?.toString() || "N/A"}</p>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end p-6 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInvoices;