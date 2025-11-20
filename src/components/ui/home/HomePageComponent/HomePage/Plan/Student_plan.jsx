// // src/pages/student/subscription/HomeSubscriptionPlans.jsx
// import React from "react";
// import PlanSelectorTemplate from "../../../../../common/PlanSelectorTemplate";

// export default function HomeSubscriptionPlans() {
//   return (
//     <PlanSelectorTemplate
//       apiEndpoint="/subscriptions/student"
//       redirectPath="/studentreg"
//       skipPath="/home1"
//       role="student"
//     />
//   );
// }

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  apiClient,
  getToken,
  validateToken,
  isAuthenticated,
  getUser,
} from "../../../../../../api/apiclient";
import { apiUrl } from "../../../../../../api/apiUtl";
import Layout from "../../../layout/MainLayout";

const Student_Plan = ({ userType = "student" }) => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [userData, setUserData] = useState(null);
  const [fetchingPlans, setFetchingPlans] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [showCouponSection, setShowCouponSection] = useState(false);
  const [calculatingOrder, setCalculatingOrder] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [inlineMessage, setInlineMessage] = useState({ text: "", type: "" });

  const getRazorpayKey = useCallback(() => "rzp_live_RRIesxqZH9mj8j", []);

  // Show inline message function
  const showInlineMessage = (text, type = "info") => {
    setInlineMessage({ text, type });
    // Auto hide after 5 seconds
    setTimeout(() => {
      setInlineMessage({ text: "", type: "" });
    }, 5000);
  };

  // Simplified authentication check
  const checkUserAuthentication = useCallback(async () => {
    try {
      const token = getToken();
      const user = getUser();

      if (!token || !user) {
        return { authenticated: false, userData: null };
      }

      // Validate token without refresh
      const isValid = await validateToken();
      if (!isValid) {
        console.warn("Token validation failed");
        return { authenticated: false, userData: null };
      }

      return { authenticated: true, userData: user };
    } catch (error) {
      console.error("Authentication check error:", error);
      return { authenticated: false, userData: null };
    }
  }, []);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      const authStatus = await checkUserAuthentication();
      setIsAuthenticatedState(authStatus.authenticated);
      setUserData(authStatus.userData);
    };
    initializeAuth();
  }, [checkUserAuthentication]);

  // Session monitoring for payment modal
  useEffect(() => {
    const checkAuthPeriodically = async () => {
      const authStatus = await checkUserAuthentication();
      setIsAuthenticatedState(authStatus.authenticated);
      setUserData(authStatus.userData);

      if (!authStatus.authenticated && showModal) {
        showInlineMessage(
          "Your session has expired. Please login again.",
          "error"
        );
        setShowModal(false);
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    // Check every 30 seconds when modal is open
    let interval;
    if (showModal) {
      interval = setInterval(checkAuthPeriodically, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showModal, checkUserAuthentication, navigate]);

  // Fetch plans for all users (authenticated or not)
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setFetchingPlans(true);
        const res = await apiClient.get(
          apiUrl.subscriptions.getPlans(userType)
        );
        if (res.data?.plans?.length > 0) {
          setPlans(res.data.plans);
        } else {
          showInlineMessage("No subscription plans available.", "info");
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
        showInlineMessage(
          "Unable to load subscription plans. Please try again later.",
          "error"
        );
      } finally {
        setFetchingPlans(false);
      }
    };

    fetchPlans();
  }, [userType]);

  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const existingScript = document.getElementById("razorpay-script");
      if (existingScript) {
        existingScript.onload = resolve;
        existingScript.onerror = reject;
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.id = "razorpay-script";
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }, []);

  const extractUserId = useCallback(() => {
    const user = getUser();

    if (user) {
      return (
        user.id ||
        user.user_id ||
        user._id ||
        user.userId ||
        user.ID ||
        user.uuid
      );
    }

    // Fallback to token parsing if user object doesn't have ID
    const token = getToken();
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const tokenPayload = JSON.parse(atob(base64));
        return (
          tokenPayload.id ||
          tokenPayload.user_id ||
          tokenPayload._id ||
          tokenPayload.userId ||
          tokenPayload.ID ||
          tokenPayload.uuid ||
          tokenPayload.sub
        );
      } catch (e) {
        console.error("Failed to decode JWT token");
      }
    }

    return null;
  }, []);

  const calculateGST = (baseAmount) => (baseAmount * 0.18).toFixed(2);
  const calculateTotalWithGST = (baseAmount) =>
    (parseFloat(baseAmount) + parseFloat(calculateGST(baseAmount))).toFixed(2);
  const calculateDiscountPercentage = (baseAmount, discountAmount) =>
    ((discountAmount / baseAmount) * 100).toFixed(0);

  // Handle plan selection - redirect to login if not authenticated
  const handlePlanSelect = (plan) => {
    if (!isAuthenticatedState) {
      showInlineMessage("Please login to purchase this plan", "info");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    setSelectedPlan(plan);
    setShowModal(true);
  };

  // Enhanced calculateOrder with order ID tracking
  const calculateOrder = async (couponToApply = null, orderId = null) => {
    if (!selectedPlan) return null;

    try {
      setCalculatingOrder(true);

      // Verify session before proceeding
      const authStatus = await checkUserAuthentication();
      if (!authStatus.authenticated) {
        throw new Error("Session expired. Please login again.");
      }

      const userId = extractUserId();
      if (!userId) {
        throw new Error("Unable to identify user. Please login again.");
      }

      const orderData = {
        user_id: userId,
        plan_id: selectedPlan.id,
        plan_name: selectedPlan.plan_name,
      };

      // Include order_id if we're updating an existing order
      if (orderId) {
        orderData.order_id = orderId;
      }

      const currentCouponCode =
        couponToApply || (appliedCoupon ? appliedCoupon.code : null);
      if (currentCouponCode) {
        orderData.coupon_code = currentCouponCode;
      }

      console.log("Creating order with data:", orderData);
      const res = await apiClient.post(apiUrl.payments.createOrder, orderData);
      console.log("Order creation response:", res.data);

      // Store the order ID for future updates
      if (res.data.order_id) {
        setCurrentOrderId(res.data.order_id);
      }

      return res.data;
    } catch (error) {
      console.error("Error calculating order:", error);

      if (
        error.message.includes("Session expired") ||
        error.response?.status === 401
      ) {
        showInlineMessage(
          "Your session has expired. Please login again.",
          "error"
        );
        setShowModal(false);
        setTimeout(() => navigate("/login"), 2000);
        return null;
      }

      if (error.response?.data?.message) {
        const errorMsg = error.response.data.message;
        if (errorMsg.includes("coupon") || errorMsg.includes("Coupon")) {
          throw new Error(errorMsg);
        } else {
          showInlineMessage(
            errorMsg || "Failed to calculate order. Please try again.",
            "error"
          );
        }
      } else {
        showInlineMessage(
          "Failed to calculate order. Please try again.",
          "error"
        );
      }
      return null;
    } finally {
      setCalculatingOrder(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage("Please enter a coupon code");
      return;
    }

    if (!selectedPlan) {
      setCouponMessage("Please select a plan first");
      return;
    }

    if (appliedCoupon?.code === couponCode.trim()) {
      setCouponMessage(`❌ Coupon "${couponCode}" is already applied.`);
      return;
    }

    try {
      setApplyingCoupon(true);
      setCouponMessage("");

      // Use current order ID if available to avoid coupon lock issues
      const orderSummary = await calculateOrder(
        couponCode.trim(),
        currentOrderId
      );

      if (orderSummary) {
        setAppliedCoupon({
          code: couponCode.trim(),
          discount_amount: orderSummary.discount_amount,
          discount_percentage: calculateDiscountPercentage(
            selectedPlan.price,
            orderSummary.discount_amount
          ),
        });

        setPaymentSummary(orderSummary);

        if (orderSummary.discount_amount > 0) {
          setCouponMessage(
            `🎉 Coupon applied! You saved ₹${parseFloat(
              orderSummary.discount_amount
            ).toFixed(2)} (${calculateDiscountPercentage(
              selectedPlan.price,
              orderSummary.discount_amount
            )}%)`
          );
        } else {
          setCouponMessage("✅ Coupon applied successfully!");
        }
      }
    } catch (error) {
      const errorMessage =
        error.message || "❌ Error applying coupon. Please try again.";
      setCouponMessage(errorMessage);
      setAppliedCoupon(null);
      // Recalculate without coupon using current order ID
      const orderSummary = await calculateOrder(null, currentOrderId);
      if (orderSummary) setPaymentSummary(orderSummary);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponMessage("");
    setShowCouponSection(false);
    // Recalculate without coupon using current order ID
    const orderSummary = await calculateOrder(null, currentOrderId);
    if (orderSummary) setPaymentSummary(orderSummary);
  };

  const handleSkipCoupon = () => {
    setShowCouponSection(false);
    setCouponMessage("");
  };

  // Enhanced payment handler with order ID management
  const handlePayment = useCallback(
    async (plan) => {
      const planToUse = plan || selectedPlan;

      // Verify session before payment
      const authStatus = await checkUserAuthentication();
      if (!authStatus.authenticated || !authStatus.userData) {
        showInlineMessage(
          "⚠️ Your session has expired. Please login again.",
          "error"
        );
        setShowModal(false);
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      if (!planToUse) {
        showInlineMessage(
          "⚠ Please select a subscription plan before proceeding.",
          "warning"
        );
        return;
      }

      try {
        setLoadingPlanId(planToUse.id);
        setCalculatingOrder(true);

        const userId = extractUserId();
        if (!userId) {
          showInlineMessage(
            "Unable to identify user. Please logout and login again.",
            "error"
          );
          setShowModal(false);
          setTimeout(() => {
            localStorage.clear();
            navigate("/login");
          }, 2000);
          return;
        }

        // If we already have a payment summary with order_id, use it directly
        if (paymentSummary && paymentSummary.order_id) {
          console.log(
            "Using existing order for payment:",
            paymentSummary.order_id
          );
          await processPaymentWithOrder(
            paymentSummary,
            planToUse,
            userId,
            authStatus.userData
          );
          return;
        }

        // Otherwise create a new order
        const orderData = {
          user_id: userId,
          plan_id: planToUse.id,
          plan_name: planToUse.plan_name,
        };
        if (appliedCoupon) orderData.coupon_code = appliedCoupon.code;

        console.log("Payment order data:", orderData);
        const res = await apiClient.post(
          apiUrl.payments.createOrder,
          orderData
        );

        const orderSummary = res.data;
        setPaymentSummary(orderSummary);
        setCurrentOrderId(orderSummary.order_id);

        await processPaymentWithOrder(
          orderSummary,
          planToUse,
          userId,
          authStatus.userData
        );
      } catch (error) {
        console.error("Payment initiation error:", error);
        if (error.response?.status === 401) {
          showInlineMessage(
            "⚠️ Your session has expired. Redirecting to login...",
            "error"
          );
          setShowModal(false);
          setTimeout(() => navigate("/login"), 2000);
        } else if (error.response?.status === 400) {
          // Handle coupon already applied error specifically
          const errorMsg =
            error.response?.data?.message ||
            "Coupon already used in pending payment";
          if (
            errorMsg.includes("already applied") ||
            errorMsg.includes("pending payment")
          ) {
            showInlineMessage(
              "This coupon is already associated with a pending payment. Please remove the coupon and try again.",
              "error"
            );
            // Reset coupon state
            setAppliedCoupon(null);
            setCouponCode("");
            setCouponMessage("Coupon reset due to pending payment conflict.");
            // Recalculate without coupon
            const orderSummary = await calculateOrder(null);
            if (orderSummary) setPaymentSummary(orderSummary);
          } else {
            showInlineMessage(errorMsg, "error");
          }
        } else {
          const errorMsg =
            error.response?.data?.message ||
            "Failed to initiate payment. Please try again later.";
          showInlineMessage(errorMsg, "error");
        }
      } finally {
        setLoadingPlanId(null);
        setCalculatingOrder(false);
      }
    },
    [
      selectedPlan,
      appliedCoupon,
      paymentSummary,
      checkUserAuthentication,
      navigate,
      userType,
      loadRazorpayScript,
      extractUserId,
      getRazorpayKey,
    ]
  );

  // Separate function to process payment with existing order
  const processPaymentWithOrder = async (
    orderSummary,
    planToUse,
    userId,
    userData
  ) => {
    const {
      order_id,
      base_amount,
      gst_amount,
      total_amount,
      discount_amount,
      coupon_code,
      currency,
    } = orderSummary;

    await loadRazorpayScript();
    const razorpayKey = getRazorpayKey();

    const options = {
      key: razorpayKey,
      amount: Math.round(total_amount * 100),
      currency,
      name: "Dronacharya Tutoring",
      description: `${planToUse.plan_name}${
        coupon_code ? ` (Coupon: ${coupon_code} - ₹${discount_amount} OFF)` : ""
      }`,
      order_id,
      handler: async function (response) {
        try {
          // Verify session before payment verification
          const currentAuthStatus = await checkUserAuthentication();
          if (!currentAuthStatus.authenticated) {
            showInlineMessage(
              "Session expired during payment. Please contact support.",
              "error"
            );
            return;
          }

          console.log("Payment verification data:", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            plan_id: planToUse.id,
            user_id: userId,
          });

          await apiClient.post(apiUrl.payments.verifyPayment, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            plan_id: planToUse.id,
            user_id: userId,
          });

          showInlineMessage(
            "🎉 Payment Successful! Subscription Activated.",
            "success"
          );
          // Reset all states
          setAppliedCoupon(null);
          setCouponCode("");
          setPaymentSummary(null);
          setCouponMessage("");
          setShowCouponSection(false);
          setCurrentOrderId(null); // Clear order ID

          setTimeout(() => {
            const dashboardPath =
              userType === "tutor" ? "/tutor-dashboard" : "/student-dashboard";
            navigate(dashboardPath);
          }, 2000);
        } catch (error) {
          console.error("Payment verification error:", error);
          if (error.response?.status === 401) {
            showInlineMessage(
              "Session expired during payment verification. Please contact support.",
              "error"
            );
          } else {
            showInlineMessage(
              error.response?.data?.message ||
                "Payment successful, but verification failed. Please contact support.",
              "error"
            );
          }
        }
      },
      modal: {
        ondismiss: function () {
          setLoadingPlanId(null);
          setCalculatingOrder(false);
          showInlineMessage("Payment cancelled. You can try again.", "info");
        },
      },
      theme: { color: "#35BAA3" },
      prefill: {
        email: userData.email || "",
        contact: userData.mobile_number || userData.phone || "",
      },
      notes: {
        coupon: coupon_code || "None",
        discount: `₹${discount_amount || 0}`,
        plan: planToUse.plan_name,
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setShowModal(false);
  };

  // Reset states when modal closes
  const handleCloseModal = () => {
    setShowModal(false);
    setAppliedCoupon(null);
    setCouponCode("");
    setPaymentSummary(null);
    setCouponMessage("");
    setShowCouponSection(false);
    setCurrentOrderId(null); // Clear order ID when modal closes
  };

  // Reset coupon state when plan changes
  useEffect(() => {
    if (selectedPlan) {
      setAppliedCoupon(null);
      setCouponCode("");
      setPaymentSummary(null);
      setCouponMessage("");
      setShowCouponSection(false);
      setCurrentOrderId(null); // Clear order ID when plan changes
    }
  }, [selectedPlan]);

  // Calculate initial order when plan is selected
  useEffect(() => {
    if (selectedPlan && showModal) {
      const calculateInitialOrder = async () => {
        try {
          const orderSummary = await calculateOrder(null);
          if (orderSummary) setPaymentSummary(orderSummary);
        } catch (error) {
          console.error("Initial order calculation failed:", error);
        }
      };
      calculateInitialOrder();
    }
  }, [selectedPlan, showModal]);

  // Message type styles
  const getMessageStyles = (type) => {
    const baseStyles =
      "p-3 rounded-lg text-sm font-medium mb-4 transition-all duration-300";
    switch (type) {
      case "success":
        return `${baseStyles} bg-green-50 border border-green-200 text-green-700`;
      case "error":
        return `${baseStyles} bg-red-50 border border-red-200 text-red-700`;
      case "warning":
        return `${baseStyles} bg-yellow-50 border border-yellow-200 text-yellow-700`;
      case "info":
        return `${baseStyles} bg-blue-50 border border-blue-200 text-blue-700`;
      default:
        return `${baseStyles} bg-gray-50 border border-gray-200 text-gray-700`;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8">
        <ToastContainer position="top-center" />
        <div className="bg-white rounded-xl border border-gray-300 p-4 sm:p-4 w-full max-w-6xl relative mx-auto">
          {/* Inline Message Display */}
          {inlineMessage.text && (
            <div className={getMessageStyles(inlineMessage.type)}>
              <div className="flex items-center justify-between">
                <span>{inlineMessage.text}</span>
                <button
                  onClick={() => setInlineMessage({ text: "", type: "" })}
                  className="ml-2 text-gray-500 hover:text-gray-700 font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-[#0E2D63] text-xl sm:text-2xl font-semibold mb-2">
              {userType === "tutor"
                ? "Choose Your Subscription Plan for Tutor"
                : "Choose Your Subscription Plan for Students"}
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm px-2">
              {userType === "tutor"
                ? "Boost your teaching career with flexible tutor plans designed to fit your needs."
                : "Get access to expert tutors and features with our student subscription plans."}
            </p>
            {!isAuthenticatedState && (
              <p className="text-gray-500 text-xs mt-2">
                Please login to purchase a subscription plan
              </p>
            )}
          </div>

          {fetchingPlans ? (
            <div className="flex flex-col sm:flex-row justify-center items-center py-8 sm:py-10 space-y-4 sm:space-y-0">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-teal-500"></div>
              <p className="ml-0 sm:ml-4 text-gray-500 text-sm sm:text-base">
                Loading subscription plans...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="rounded-lg p-4 sm:p-6 border border-gray-200 hover:border-teal-500 shadow-sm transition cursor-pointer flex flex-col transform hover:scale-[1.02] transition-transform duration-200"
                    onClick={() => handlePlanSelect(plan)}
                  >
                    <h3 className="text-center font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                      {plan.plan_name}
                    </h3>
                    <div className="text-center text-2xl sm:text-3xl font-bold text-black mb-1">
                      ₹{parseFloat(plan.price).toFixed(2)}
                    </div>
                    <p className="text-center text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                      {plan.duration_days
                        ? `${plan.duration_days}-day validity`
                        : "/duration"}
                    </p>
                    <ul className="text-xs sm:text-sm text-gray-700 space-y-1 mb-3 sm:mb-4 flex-1">
                      {plan.features?.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-green-500 mr-2 mt-0.5">✓</span>
                          <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`w-full py-2 rounded text-xs sm:text-sm font-medium transition-colors ${
                        isAuthenticatedState
                          ? "bg-teal-500 hover:bg-teal-600 text-white"
                          : "bg-teal-500 hover:bg-teal-600 text-white"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isAuthenticatedState) {
                          handlePlanSelect(plan);
                        } else {
                          showInlineMessage(
                            "Please login to purchase this plan",
                            "info"
                          );
                          setTimeout(() => navigate("/login"), 1000);
                        }
                      }}
                    >
                      {isAuthenticatedState
                        ? selectedPlan?.id === plan.id
                          ? "✓ Selected"
                          : "Choose Plan"
                        : "Login to Purchase"}
                    </button>
                  </div>
                ))}
              </div>

              {showModal && selectedPlan && isAuthenticatedState && (
                <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-3 sm:p-4">
                  <div className="bg-white rounded-xl shadow-lg max-w-full sm:max-w-md w-full p-4 sm:p-6 relative mx-2 sm:mx-0 max-h-[90vh] overflow-y-auto">
                    <button
                      onClick={handleCloseModal}
                      className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-800 font-bold text-lg sm:text-xl"
                    >
                      ×
                    </button>

                    <h3 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-4 text-center">
                      {selectedPlan.plan_name} Summary
                    </h3>

                    <div className="space-y-2 text-gray-700 text-xs sm:text-sm mb-3 sm:mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between">
                        <span>Base Price:</span>
                        <span>
                          ₹{parseFloat(selectedPlan.price).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>+ 18% GST:</span>
                        <span>₹{calculateGST(selectedPlan.price)}</span>
                      </div>
                      {paymentSummary?.discount_amount > 0 && (
                        <div className="flex justify-between text-green-600 font-medium">
                          <span>Discount Applied:</span>
                          <span>
                            -₹
                            {parseFloat(paymentSummary.discount_amount).toFixed(
                              2
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-base sm:text-lg font-bold border-t pt-2 mt-2">
                        <span>Total Amount:</span>
                        <span>
                          {paymentSummary
                            ? `₹${parseFloat(
                                paymentSummary.total_amount
                              ).toFixed(2)}`
                            : `₹${calculateTotalWithGST(selectedPlan.price)}`}
                        </span>
                      </div>
                      {paymentSummary?.discount_amount > 0 && (
                        <div className="text-green-600 text-xs sm:text-sm text-center font-medium mt-2">
                          💰 You save ₹
                          {parseFloat(paymentSummary.discount_amount).toFixed(
                            2
                          )}
                        </div>
                      )}
                    </div>

                    {!appliedCoupon && !showCouponSection && (
                      <div className="mb-3 sm:mb-4 text-center">
                        <button
                          onClick={() => setShowCouponSection(true)}
                          className="text-teal-600 hover:text-teal-700 text-xs sm:text-sm font-medium underline"
                        >
                          🎁 Apply Coupon Code
                        </button>
                      </div>
                    )}

                    {showCouponSection && !appliedCoupon && (
                      <div className="mb-3 sm:mb-4 p-3 border border-teal-200 rounded-lg bg-teal-50">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                          Enter Coupon Code
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2 mb-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter coupon code"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            disabled={applyingCoupon}
                          />
                          <button
                            onClick={handleApplyCoupon}
                            disabled={applyingCoupon || !couponCode.trim()}
                            className="px-3 sm:px-4 py-2 bg-teal-500 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-teal-600 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            {applyingCoupon ? "..." : "Apply"}
                          </button>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <button
                            onClick={handleSkipCoupon}
                            className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm"
                          >
                            Skip coupon
                          </button>
                          {couponMessage && (
                            <div
                              className={`text-xs sm:text-sm ${
                                couponMessage.includes("🎉") ||
                                couponMessage.includes("✅")
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {couponMessage}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {appliedCoupon && (
                      <div className="mb-3 sm:mb-4 p-3 border border-green-200 rounded-lg bg-green-50">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center">
                            <span className="text-green-700 text-xs sm:text-sm font-medium">
                              ✅ Coupon Applied: {appliedCoupon.code}
                            </span>
                            {appliedCoupon.discount_percentage > 0 && (
                              <span className="text-green-600 text-xs sm:text-sm sm:ml-2 mt-1 sm:mt-0">
                                ({appliedCoupon.discount_percentage}% OFF)
                              </span>
                            )}
                          </div>
                          <button
                            onClick={handleRemoveCoupon}
                            className="text-red-500 hover:text-red-700 text-xs sm:text-sm font-medium whitespace-nowrap"
                          >
                            Remove
                          </button>
                        </div>
                        {couponMessage && (
                          <div className="text-green-600 text-xs sm:text-sm mt-1">
                            {couponMessage}
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handlePayment(selectedPlan)}
                      disabled={loadingPlanId || calculatingOrder}
                      className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {calculatingOrder
                        ? "Calculating..."
                        : loadingPlanId
                        ? "Processing..."
                        : `Pay ₹${
                            paymentSummary
                              ? parseFloat(paymentSummary.total_amount).toFixed(
                                  2
                                )
                              : calculateTotalWithGST(selectedPlan.price)
                          }`}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Student_Plan;
