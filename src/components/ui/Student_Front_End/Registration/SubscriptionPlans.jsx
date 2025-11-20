import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../../api/apiclient";
import { toast } from "react-toastify";

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await apiClient.get("/subscriptions/student");
        if (res.data.plans && res.data.plans.length > 0) {
          const uniqueMap = new Map();
          res.data.plans.forEach((p) => {
            const key = `${p.plan_name}-${p.price}`;
            if (!uniqueMap.has(key)) uniqueMap.set(key, p);
          });
          setPlans(Array.from(uniqueMap.values()));
        }
      } catch (err) {
        console.error("Failed to fetch plans", err);
        toast.error("Failed to load subscription plans.");
      }
    };

    fetchPlans();
  }, []);

  const handlePayment = async (plan) => {
    if (!user_id || !plan?.id) {
      toast.warning("User or plan not available. Please try again.");
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient.post("/payments/create-order", {
        user_id,
        plan_id: plan.id,
      });
      const { order_id, currency } = res.data;

      const existingScript = document.querySelector(
        "script[src='https://checkout.razorpay.com/v1/checkout.js']"
      );
      if (existingScript) existingScript.remove();

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        const options = {
          key: "rzp_test_dh3YyohVJXkWbI",
          amount: plan.price * 100,
          currency,
          name: "Subscription Payment",
          description: `${plan.plan_name} - ₹${plan.price}`,
          order_id,
          handler: async function (response) {
            try {
              await apiClient.post("/payments/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                user_id,
                plan_id: plan.id,
              });
              toast.success("🎉 Payment Successful!");
              navigate("/home1");
            } catch (verifyError) {
              console.error("Payment verification failed", verifyError);
              toast.error("Payment verification failed.");
            }
          },
          theme: { color: "#35BAA3" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-white">
      <div className="w-full max-w-5xl bg-white border rounded-lg shadow p-6">
        <h2 className="text-center text-blue-900 text-2xl font-semibold mb-8">
          Subscription Plans
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-gray-50 border rounded shadow-md p-6 flex flex-col"
            >
              <h3 className="text-center text-lg font-medium text-gray-700">
                {plan.plan_name}
              </h3>
              <div className="text-center text-2xl font-bold mt-2 mb-1">
                ₹{plan.price}
              </div>
              <p className="text-center text-sm text-gray-500 mb-4">
                {plan.duration_days}-day validity
              </p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                {plan.features?.map((feature, index) => (
                  <li key={index}>✔ {feature}</li>
                ))}
              </ul>
              <button
                onClick={() => handlePayment(plan)}
                disabled={loading}
                className="bg-teal-500 hover:bg-teal-600 text-white py-2 rounded text-sm mt-auto"
              >
                {loading ? "Processing..." : "Choose Plan"}
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            className="bg-gray-300 px-4 py-2 rounded text-base"
            onClick={() => navigate("/student-dashboard")}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
