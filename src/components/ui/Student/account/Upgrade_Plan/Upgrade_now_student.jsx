// src/pages/student/classes/SubscriptionPlans.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiClient, getToken } from "../../../../../api/apiclient";

const SubscriptionPlans = ({ userType = "student" }) => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [fetchingPlans, setFetchingPlans] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const getRazorpayKey = useCallback(() => "rzp_test_dh3YyohVJXkWbI", []);

  const checkUserAuthentication = useCallback(() => {
    const token = getToken();
    const userStr = localStorage.getItem("user");

    if (!token) {
      return { authenticated: false, userData: null };
    }

    try {
      const userObj = userStr ? JSON.parse(userStr) : null;
      return { authenticated: true, userData: userObj };
    } catch (e) {
      localStorage.removeItem("user");
      return { authenticated: false, userData: null };
    }
  }, []);

  useEffect(() => {
    const authStatus = checkUserAuthentication();
    setIsAuthenticated(authStatus.authenticated);
    setUserData(authStatus.userData);
  }, [checkUserAuthentication]);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!isAuthenticated) return;
      try {
        setFetchingPlans(true);
        const res = await apiClient.get(`/subscriptions/${userType}`);
        if (res.data?.plans?.length > 0) {
          setPlans(res.data.plans);
        } else {
          toast.info("No subscription plans available.");
        }
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("Your session has expired. Please login again.");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          toast.error("Unable to load subscription plans. Please try again later.");
        }
      } finally {
        setFetchingPlans(false);
      }
    };
    fetchPlans();
  }, [isAuthenticated, navigate, userType]);

  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }, []);

  const extractUserId = useCallback(() => {
    const authStatus = checkUserAuthentication();
    const token = getToken();

    if (authStatus.userData) {
      return (
        authStatus.userData.id ||
        authStatus.userData.user_id ||
        authStatus.userData._id ||
        authStatus.userData.userId ||
        authStatus.userData.ID ||
        authStatus.userData.uuid
      );
    }

    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const tokenPayload = JSON.parse(jsonPayload);
        return (
          tokenPayload.id ||
          tokenPayload.user_id ||
          tokenPayload._id ||
          tokenPayload.userId ||
          tokenPayload.ID ||
          tokenPayload.uuid ||
          tokenPayload.sub ||
          tokenPayload.user?.id
        );
      } catch (e) {
        console.error("Failed to decode JWT token");
      }
    }
    return null;
  }, [checkUserAuthentication]);

  const calculateGST = (baseAmount) => (baseAmount * 0.18).toFixed(2);
  const calculateTotalWithGST = (baseAmount) =>
    (parseFloat(baseAmount) + parseFloat(calculateGST(baseAmount))).toFixed(2);

  const handlePayment = useCallback(
    async (plan) => {
      const planToUse = plan || selectedPlan;
      const authStatus = checkUserAuthentication();
      if (!authStatus.authenticated || !authStatus.userData) {
        toast.error("⚠️ Your session has expired. Please login again.");
        setTimeout(() => navigate("/login"), 3000);
        return;
      }
      if (!planToUse) {
        toast.warn("⚠ Please select a plan before proceeding.");
        return;
      }

      try {
        setLoadingPlanId(planToUse.id);
        const userId = extractUserId();
        if (!userId) {
          toast.error("Unable to identify user. Please login again.");
          return;
        }

        const res = await apiClient.post("/payments/create-order", {
          user_id: userId,
          plan_id: planToUse.id,
        });

        const { order_id, total_amount, currency } = res.data;
        await loadRazorpayScript();
        const razorpayKey = getRazorpayKey();

        const options = {
          key: razorpayKey,
          amount: Math.round(total_amount * 100),
          currency,
          name: "Dronacharya Tutoring",
          description: `${planToUse.plan_name} Subscription`,
          order_id,
          handler: async function (response) {
            try {
              await apiClient.post("/payments/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan_id: planToUse.id,
                user_id: userId,
              });
              toast.success("🎉 Payment Successful!");
              // Redirect after success
              setTimeout(() => {
                if (userType === "tutor") {
                  navigate("/tutor-dashboard");
                } else {
                  navigate("/student-dashboard");
                }
              }, 2000);
            } catch {
              toast.error("Payment verification failed. Contact support.");
            }
          },
          modal: { ondismiss: () => setLoadingPlanId(null) },
          theme: { color: "#35BAA3" },
          prefill: {
            email: authStatus.userData.email || "",
            contact:
              authStatus.userData.mobile_number ||
              authStatus.userData.phone ||
              "",
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        toast.error("Failed to initiate payment.");
      } finally {
        setLoadingPlanId(null);
      }
    },
    [selectedPlan, checkUserAuthentication, navigate, extractUserId, getRazorpayKey, loadRazorpayScript, userType]
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-8">
      <ToastContainer position="top-center" />
      <div className="bg-white rounded-xl border border-gray-300 p-6 w-full max-w-6xl relative">
        {/* Cross Button */}

        <h2 className="text-center text-[#0E2D63] text-2xl font-semibold mb-2">
          {userType === "tutor"
            ? "Choose Your Subscription Plan for Tutors"
            : "Choose Your Subscription Plan for Students"}
        </h2>

        <p className="text-center text-gray-600 text-sm mb-8">
          {userType === "tutor"
            ? "Boost your teaching career with flexible tutor plans designed to fit your needs."
            : "Get access to expert tutors and features with our student subscription plans."}
        </p>

        {isAuthenticated ? (
          fetchingPlans ? (
            <p className="text-center text-gray-500">Loading plans...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="rounded-lg p-6 border border-gray-200 hover:border-teal-500 shadow-sm transition duration-300 cursor-pointer flex flex-col"
                    onClick={() => {
                      setSelectedPlan(plan);
                      setShowModal(true);
                    }}
                  >
                    <h3 className="text-center font-semibold text-gray-800 mb-2 text-sm">
                      {plan.plan_name}
                    </h3>

                    <div className="text-center text-3xl font-bold text-black mb-1">
                      ₹{parseFloat(plan.price).toFixed(2)}
                    </div>
                    <p className="text-center text-sm text-gray-500 mb-4">
                      {plan.duration_days
                        ? `${plan.duration_days}-day validity`
                        : "/duration"}
                    </p>

                    <ul className="text-sm text-gray-700 space-y-1 mb-4 flex-1">
                      {plan.features?.map((feature, i) => (
                        <li key={i}>✔ {feature}</li>
                      ))}
                    </ul>

                    <button
                      className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded text-sm font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlan(plan);
                        setShowModal(true);
                      }}
                    >
                      {selectedPlan?.id === plan.id ? "✓ Selected" : "Choose Plan"}
                    </button>
                  </div>
                ))}
              </div>

              {/* Popup Modal for Plan Summary */}
              {showModal && selectedPlan && (
                <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
                    <button
                      onClick={() => setShowModal(false)}
                      className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold text-lg"
                    >
                      ×
                    </button>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                      {selectedPlan.plan_name} Summary
                    </h3>

                    <div className="space-y-2 text-gray-700 text-sm">
                      <div className="flex justify-between">
                        <span>Base Price:</span>
                        <span>₹{parseFloat(selectedPlan.price).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-red-600 font-medium">
                        <span>+ 18% GST:</span>
                        <span>₹{calculateGST(selectedPlan.price)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                        <span>Total:</span>
                        <span>₹{calculateTotalWithGST(selectedPlan.price)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePayment(selectedPlan)}
                      disabled={loadingPlanId}
                      className="mt-6 w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition disabled:bg-gray-400"
                    >
                      {loadingPlanId ? "Processing..." : "Pay Now"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Please log in to view plans
            </h3>
            <button
              onClick={() => navigate("/login")}
              className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700"
            >
              Login to Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
