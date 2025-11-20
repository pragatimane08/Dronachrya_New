// import React, { useState, useEffect } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { apiClient } from "../../../../../api/apiclient";
// import { useNavigate } from "react-router-dom";

// const MyPlanTutor = () => {
//   const [billingHistory, setBillingHistory] = useState([]);
//   const [loadingHistory, setLoadingHistory] = useState(false);
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchBillingHistory = async () => {
//       setLoadingHistory(true);
//       setError("");

//       try {
//         const response = await apiClient.get("/billing/history");
        
//         // Handle both single object and array responses
//         let historyData;
//         if (Array.isArray(response.data)) {
//           historyData = response.data;
//         } else if (response.data && typeof response.data === 'object') {
//           // Single object response - wrap in array
//           historyData = [response.data];
//         } else {
//           historyData = [];
//         }
        
//         setBillingHistory(historyData);
//       } catch (err) {
//         if (err.response?.status === 404) {
//           // No billing history for this tutor
//           setBillingHistory([]);
//         } else {
//           console.error("Error fetching billing history:", err);
//           setError("Failed to load billing history.");
//           toast.error("Error fetching billing history");
//         }
//       } finally {
//         setLoadingHistory(false);
//       }
//     };

//     fetchBillingHistory();
//   }, []);

//   const handleUpgrade = () => {
//     toast.success("Redirecting to upgrade plans...");
//     navigate("/tutor_subscription_plan");
//   };

//   // Format date helper function
//   const formatDate = (dateString) => {
//     if (!dateString) return "—";
//     try {
//       return new Date(dateString).toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: '2-digit'
//       });
//     } catch (error) {
//       return dateString.slice(0, 10);
//     }
//   };

//   // Format currency helper function
//   const formatCurrency = (amount) => {
//     if (!amount) return "₹0.00";
//     return `₹${parseFloat(amount).toLocaleString('en-IN', { 
//       minimumFractionDigits: 2, 
//       maximumFractionDigits: 2 
//     })}`;
//   };

//   // Get status badge color
//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'paid':
//       case 'completed':
//         return 'bg-green-100 text-green-800';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'failed':
//       case 'cancelled':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f5f7ff] p-6 flex flex-col gap-6">
//       <ToastContainer position="top-right" autoClose={3000} />

//       <div className="bg-white rounded-lg p-6 shadow-md">
//         <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
//           My Subscription & Billing History
//         </h2>

//         {loadingHistory ? (
//           <div className="flex justify-center items-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#35BAA3]"></div>
//             <span className="ml-2 text-gray-600">Loading history...</span>
//           </div>
//         ) : error ? (
//           <div className="text-center py-8">
//             <p className="text-red-500 mb-4">{error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="bg-[#35BAA3] text-white px-4 py-2 rounded-md hover:brightness-110"
//             >
//               Retry
//             </button>
//           </div>
//         ) : billingHistory.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="mb-4">
//               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//             </div>
//             <p className="text-lg text-gray-600 mb-2">No billing history found</p>
//             <p className="text-sm text-gray-500 mb-6">Get started by purchasing your first plan</p>
//             <button
//               onClick={handleUpgrade}
//               className="bg-[#35BAA3] text-white px-6 py-3 rounded-md hover:brightness-110 transition-all"
//             >
//               View Plans
//             </button>
//           </div>
//         ) : (
//           <>
//             <div className="overflow-x-auto rounded-lg border border-gray-200">
//               <table className="min-w-full bg-white">
//                 <thead className="bg-[#D4DEFF]">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Plan Details</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Amount</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Subscription Period</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Remaining Contacts</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {billingHistory.map((entry, index) => {
//                     const plan = entry.plan;
//                     const subscription = entry.subscription;
//                     const payment = entry.payment;

//                     return (
//                       <tr key={index} className="hover:bg-gray-50 transition-colors">
//                         <td className="px-6 py-4">
//                           <div className="flex flex-col">
//                             <span className="font-medium text-gray-900">
//                               {plan?.plan_name || "N/A"}
//                             </span>
//                             <span className="text-sm text-gray-500 capitalize">
//                               {plan?.plan_type || "—"}
//                             </span>
//                             <span className="text-xs text-gray-400">
//                               {plan?.duration_days ? `${plan.duration_days} days` : "—"}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex flex-col">
//                             <span className="font-medium text-gray-900">
//                               {formatCurrency(payment?.total_amount)}
//                             </span>
//                             <span className="text-sm text-gray-500">
//                               Base: {formatCurrency(payment?.base_amount)}
//                             </span>
//                             <span className="text-xs text-gray-400">
//                               GST: {formatCurrency(payment?.gst_amount)}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex flex-col">
//                             <span className="text-sm text-gray-900">
//                               <strong>Start:</strong> {formatDate(subscription?.start_date)}
//                             </span>
//                             <span className="text-sm text-gray-900">
//                               <strong>End:</strong> {formatDate(subscription?.end_date)}
//                             </span>
//                             <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block w-fit ${
//                               subscription?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                             }`}>
//                               {subscription?.is_active ? 'Active' : 'Inactive'}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex flex-col">
//                             <span className="text-lg font-semibold text-gray-900">
//                               {subscription?.contacts_remaining || 0}
//                             </span>
//                             <span className="text-sm text-gray-500">
//                               of {plan?.contact_limit || 0}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(payment?.status)}`}>
//                             {payment?.status || "unknown"}
//                           </span>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             {/* Current Plan Summary */}
//             {billingHistory.length > 0 && billingHistory[0]?.subscription?.is_active && (
//               <div className="mt-6 bg-[#D4DEFF] rounded-lg p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Active Plan</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className="text-center">
//                     <p className="text-2xl font-bold text-[#35BAA3]">
//                       {billingHistory[0]?.plan?.plan_name}
//                     </p>
//                     <p className="text-sm text-gray-600">Active Plan</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-2xl font-bold text-[#35BAA3]">
//                       {billingHistory[0]?.subscription?.contacts_remaining}
//                     </p>
//                     <p className="text-sm text-gray-600">Contacts Remaining</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-2xl font-bold text-[#35BAA3]">
//                       {formatDate(billingHistory[0]?.subscription?.end_date)}
//                     </p>
//                     <p className="text-sm text-gray-600">Valid Until</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="flex justify-center mt-6">
//               <button
//                 onClick={handleUpgrade}
//                 className="bg-[#35BAA3] text-white px-8 py-3 rounded-md text-sm font-medium hover:brightness-110 transition-all transform hover:scale-105"
//               >
//                 Upgrade Plan
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyPlanTutor;


// src/pages/tutor/subscription/BillingHistoryTutor.jsx
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiClient } from "../../../../../api/apiclient";
import { useNavigate } from "react-router-dom";

const BillingHistoryTutor = () => {
  const [billingHistory, setBillingHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBillingHistory = async () => {
      setLoadingHistory(true);
      setError("");

      try {
        const response = await apiClient.get("/billing/history");

        const historyData = Array.isArray(response.data.history)
          ? response.data.history
          : [];

        setBillingHistory(historyData);
      } catch (err) {
        console.error("Error fetching billing history:", err);
        if (err.response?.status === 404) {
          setBillingHistory([]);
        } else {
          setError("Failed to load billing history.");
          toast.error("Error fetching billing history");
        }
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchBillingHistory();
  }, []);

  const handleUpgrade = () => {
    toast.success("Redirecting to upgrade plans...");
    navigate("/tutor_subscription_plan");
  };

  // Helper Functions
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    } catch {
      return dateString.slice(0, 10);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";
    return `₹${parseFloat(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Find active plan
  const activePlan = billingHistory.find(
    (entry) => entry.subscription?.is_active
  );

  // Pagination Logic
  const totalPages = Math.ceil(billingHistory.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = billingHistory.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-[#f5f7ff] p-6 flex flex-col gap-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          My Subscription & Billing History
        </h2>

        {loadingHistory ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#35BAA3]"></div>
            <span className="ml-2 text-gray-600">Loading history...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#35BAA3] text-white px-4 py-2 rounded-md hover:brightness-110"
            >
              Retry
            </button>
          </div>
        ) : billingHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-lg text-gray-600 mb-2">No billing history found</p>
            <p className="text-sm text-gray-500 mb-6">
              Get started by purchasing your first plan
            </p>
            <button
              onClick={handleUpgrade}
              className="bg-[#35BAA3] text-white px-6 py-3 rounded-md hover:brightness-110 transition-all"
            >
              View Plans
            </button>
          </div>
        ) : (
          <>
            {activePlan && (
              <div className="bg-[#D4DEFF] rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Current Active Plan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-[#35BAA3]">
                      {activePlan?.plan?.plan_name || "—"}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      {activePlan?.plan?.plan_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#35BAA3]">
                      {activePlan?.subscription?.contacts_remaining}
                    </p>
                    <p className="text-sm text-gray-600">Contacts Remaining</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#35BAA3]">
                      {formatDate(activePlan?.subscription?.end_date)}
                    </p>
                    <p className="text-sm text-gray-600">Valid Until</p>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Table with Pagination */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full bg-white">
                <thead className="bg-[#D4DEFF]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                      Plan Details
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                      Subscription Period
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                      Remaining Contacts
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentRecords.map((entry, index) => {
                    const plan = entry.plan;
                    const subscription = entry.subscription;
                    const payment = entry.payment;

                    return (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              {plan?.plan_name || "N/A"}
                            </span>
                            <span className="text-sm text-gray-500 capitalize">
                              {plan?.plan_type || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              {formatCurrency(payment?.total_amount)}
                            </span>
                            <span className="text-sm text-gray-500">
                              Base: {formatCurrency(payment?.base_amount)}
                            </span>
                            <span className="text-xs text-gray-400">
                              GST: {formatCurrency(payment?.gst_amount)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-900">
                              <strong>Start:</strong>{" "}
                              {formatDate(subscription?.start_date)}
                            </span>
                            <span className="text-sm text-gray-900">
                              <strong>End:</strong>{" "}
                              {formatDate(subscription?.end_date)}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full mt-1 inline-block w-fit ${
                                subscription?.is_active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {subscription?.is_active ? "Active" : "Expired"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-lg font-semibold text-gray-900">
                            {subscription?.contacts_remaining || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                              payment?.status
                            )}`}
                          >
                            {payment?.status || "unknown"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md text-sm font-medium border ${
                    currentPage === 1
                      ? "text-gray-400 border-gray-200"
                      : "text-[#2F4380] border-[#2F4380] hover:bg-[#B8C9FF]"
                  }`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage === i + 1
                        ? "bg-[#35BAA3] text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-[#B3EDE3]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md text-sm font-medium border ${
                    currentPage === totalPages
                      ? "text-gray-400 border-gray-200"
                      : "text-[#2F4380] border-[#2F4380] hover:bg-[#B8C9FF]"
                  }`}
                >
                  Next
                </button>
              </div>
            )}

            {/* Show total records info */}
            <div className="text-center text-sm text-gray-500 mt-4">
              Showing {indexOfFirstRecord + 1} to{" "}
              {Math.min(indexOfLastRecord, billingHistory.length)} of{" "}
              {billingHistory.length} records
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={handleUpgrade}
                className="bg-[#35BAA3] text-white px-8 py-3 rounded-md text-sm font-medium hover:brightness-110 transition-all transform hover:scale-105"
              >
                Upgrade Plan
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BillingHistoryTutor;
