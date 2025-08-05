import React, { useEffect, useState } from "react";
import { studentInvoiceRepository } from "../../../../api/repository/tutor_invoices.repository";
import { toast } from "react-toastify";
import moment from "moment";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

const TutorInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [referralReward, setReferralReward] = useState(null);

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

  const fetchReferralReward = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/referrals/reward/22b05a6f-1238-4a77-a3c5-9b476009b0c4",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rewardType: "subscription_bonus",
            rewardValue: "2Days Extra",
          }),
        }
      );
      const data = await response.json();
      if (data.status) {
        setReferralReward(data.referral);
        toast.success("Referral reward processed.");
      } else {
        toast.error("Failed to process referral reward.");
      }
    } catch (error) {
      toast.error("Error processing referral.");
      console.error(error);
    }
  };

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
    fetchReferralReward();
  }, []);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-8">

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No invoices available</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700 sticky top-0">
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
                    <td className="px-4 py-3 text-gray-800 font-medium">₹{inv.amount}</td>
                    <td className="px-4 py-3">
                      {moment(inv.date, ["D/M/YYYY, h:mm:ss a"]).format("DD MMM YYYY")}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {inv.payment_id}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {inv.razorpay_payment_id}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDownload(inv.payment_id)}
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition font-medium"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        <span>Download</span>
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
