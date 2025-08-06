import React, { useEffect, useState } from "react";
import { studentInvoiceRepository } from "../../../../api/repository/tutor_invoices.repository";
import { toast } from "react-toastify";
import moment from "moment";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

const TutorInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch invoices
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await studentInvoiceRepository.getMyInvoices();
      if (res && Array.isArray(res.invoices)) {
        setInvoices(res.invoices);
      } else {
        toast.error("No invoices found.");
      }
    } catch (error) {
      toast.error("Failed to fetch invoices.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle PDF Download
  const handleDownload = async (paymentId) => {
    try {
      const blob = await studentInvoiceRepository.downloadInvoicePDF(paymentId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Download failed.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-8">
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No invoices found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-blue-50 text-blue-900">
                <tr>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Plan</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Amount</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Date</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Payment ID</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Razorpay ID</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((inv, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{inv.plan_name}</td>
                    <td className="px-4 py-3 text-gray-800 font-semibold">
                      ₹{inv.amount}
                    </td>
                    <td className="px-4 py-3">
                      {moment(inv.date, ["D/M/YYYY, h:mm:ss a"]).format("DD MMM YYYY")}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{inv.payment_id}</td>
                    <td className="px-4 py-3 text-gray-600">{inv.razorpay_payment_id}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDownload(inv.payment_id)}
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition font-medium"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorInvoices;
