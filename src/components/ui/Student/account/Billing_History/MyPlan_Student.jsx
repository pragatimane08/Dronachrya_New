import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiClient } from "../../../../../api/apiclient";
import { useNavigate } from "react-router-dom";

const MyPlans = () => {
  const [billingHistory, setBillingHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(""); // store role

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBillingHistory = async () => {
      setLoadingHistory(true);
      setError("");

      // Safe token decoding
      const token = localStorage.getItem("token");
      let tokenData = {};
      if (token && token.includes(".")) {
        try {
          tokenData = JSON.parse(atob(token.split(".")[1]));
        } catch (e) {
          console.warn("Invalid token format", e);
        }
      }
      setUserRole(tokenData?.role || "");

      try {
        const response = await apiClient.get("/billing/history");
        const historyArray = Array.isArray(response.data) ? response.data : [];
        setBillingHistory(historyArray);
      } catch (err) {
        if (err.response?.status === 404) {
          setBillingHistory([]); // No active plan
        } else {
          console.error(err);
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
    navigate("/upgrader_plan_student"); // Adjust route if needed
  };

  const renderEmptyMessage = () => {
    if (userRole.toLowerCase() === "tutor") {
      return "You have not purchased any tutor plan yet.";
    } else if (userRole.toLowerCase() === "student") {
      return "You have not subscribed to any plan yet.";
    }
    return "No billing history found.";
  };

  return (
    <div className="min-h-screen bg-[#f5f7ff] p-6 flex flex-col gap-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Billing History Section */}
      <div className="bg-[#D4DEFF] rounded-lg p-6 shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">
          Billing History
        </h2>

        {loadingHistory ? (
          <p className="text-sm text-center text-gray-600">Loading history...</p>
        ) : error ? (
          <p className="text-sm text-center text-red-500">{error}</p>
        ) : billingHistory.length === 0 ? (
          <p className="text-sm text-center text-gray-600">
            {renderEmptyMessage()}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden text-sm text-gray-700">
              <thead>
                <tr className="bg-[#B8C9FF] text-left">
                  <th className="px-4 py-2">Plan</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Start Date</th>
                  <th className="px-4 py-2">End Date</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((entry, index) => {
                  const plan = entry.subscription?.SubscriptionPlan;
                  const payment = entry.payment || entry.subscription?.Payment;
                  const start = entry.subscription?.start_date;
                  const end = entry.subscription?.end_date;
                  return (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{plan?.plan_name || "N/A"}</td>
                      <td className="px-4 py-2">₹{payment?.amount || "0.00"}</td>
                      <td className="px-4 py-2">{start?.slice(0, 10) || "—"}</td>
                      <td className="px-4 py-2">{end?.slice(0, 10) || "—"}</td>
                      <td className="px-4 py-2 capitalize">
                        {payment?.status || "unknown"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Upgrade Button */}
        {userRole.toLowerCase() === "student" && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleUpgrade}
              className="bg-[#35BAA3] text-white px-6 py-2 rounded-md text-sm hover:brightness-110"
            >
              Upgrade Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPlans;
