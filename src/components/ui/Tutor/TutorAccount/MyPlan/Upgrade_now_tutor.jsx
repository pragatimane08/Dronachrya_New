import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiClient } from "../../../../../api/apiclient";

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await apiClient.get("/subscriptions/tutor");
        setPlans(res.data.plans);
      } catch (error) {
        console.error("❌ Failed to fetch plans:", error);
        toast.error("Unable to load subscription plans. Please try again later.");
      }
    };

    fetchPlans();
  }, []);

  const handlePayment = async (plan) => {
    if (!userId || !plan) {
      toast.warn("⚠ Please select a subscription plan before proceeding.");
      return;
    }

    try {
      setLoadingPlanId(plan.id);
      const res = await apiClient.post("/payments/create-order", {
        user_id: userId,
        plan_id: plan.id,
      });

      const { order_id, amount, currency } = res.data;

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        const options = {
          key: "rzp_test_dh3YyohVJXkWbI",
          amount: amount * 100,
          currency,
          name: "Dronacharya Tutoring",
          description: `${plan.plan_name} Subscription`,
          order_id,
          handler: async function (response) {
            try {
              await apiClient.post("/payments/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              toast.success("🎉 Payment Successful! Welcome aboard.");
              setTimeout(() => navigate("/tutorreg"), 2000);
            } catch (error) {
              console.error("❌ Payment verification failed:", error);
              toast.error("Payment made but verification failed. Please contact support.");
            }
          },
          theme: { color: "#35BAA3" },
          prefill: {
            email: JSON.parse(localStorage.getItem("user"))?.email || "",
            contact: JSON.parse(localStorage.getItem("user"))?.mobile_number || "",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error("❌ Payment initiation failed:", error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-8">
      <ToastContainer position="top-center" />
      <div className="bg-white rounded-xl border border-gray-300 p-8 w-full max-w-6xl">
        <h2 className="text-center text-lg md:text-xl font-semibold text-blue-800 mb-2">
          Please Select an Option to Continue
        </h2>
        <h1 className="text-center text-2xl md:text-3xl font-bold text-blue-900 mb-1">
          Subscription Plans
        </h1>
        <p className="text-center text-gray-500 text-sm md:text-base mb-8">
          Choose the perfect plan that suits your needs and budget.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {plans.map((plan, index) => {
            const durationLabel = ["month", "quarter", "year"][index] || "duration";
            const planLabel = ["Silver Plan", "Gold Plan", "Platinum Plan"][index] || plan.plan_name;
            return (
              <div
                key={plan.id}
                className="rounded-lg p-6 border border-gray-200 hover:border-teal-400 transition duration-300 cursor-pointer shadow-sm"
              >
                <h3 className="text-center font-semibold text-gray-800 mb-1 text-sm">
                  {planLabel}
                </h3>

                <div className="text-center text-3xl font-bold text-black mb-1">
                  ₹{parseFloat(plan.price).toFixed(2)}
                </div>
                <p className="text-center text-sm text-gray-500 mb-4">
                  /{durationLabel}
                </p>

                <ul className="text-sm text-gray-700 space-y-1 mb-4">
                  {plan.features.map((feature, i) => (
                    <li key={i}>✔ {feature}</li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    toast.success(`✅ ${planLabel} selected. Processing payment...`);
                    handlePayment(plan);
                  }}
                  className={`w-full py-2 text-white rounded text-sm font-medium ${
                    loadingPlanId === plan.id ? "bg-teal-300" : "bg-teal-500 hover:bg-teal-600"
                  }`}
                  disabled={loadingPlanId === plan.id}
                >
                  {loadingPlanId === plan.id ? "Processing..." : "Choose Plan"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => {
              toast.info("⏭️ Skipped plan selection. Redirecting...");
              navigate("/tutor-dashboard");
            }}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded text-sm"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
