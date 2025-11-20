// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { apiClient } from "../../../../api/apiclient";

// const SubscriptionPlans = () => {
//   const navigate = useNavigate();
//   const [plans, setPlans] = useState([]);

//   useEffect(() => {
//     const fetchPlans = async () => {
//       try {
//         const res = await apiClient.get("/subscriptions/tutor");
//         setPlans(res.data.plans);
//       } catch (error) {
//         console.error("❌ Failed to fetch plans:", error);
//         toast.error("Unable to load subscription plans. Please try again later.");
//       }
//     };

//     fetchPlans();
//   }, []);

//   const handlePlanSelect = (plan) => {
//     toast.success(`${plan.plan_name} selected. Redirecting...`);
//     // Store selected plan in localStorage or context if needed
//     localStorage.setItem("selectedPlan", JSON.stringify(plan));
//     navigate("/tutorreg");
//   };

//   return (
//     <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-8">
//       <ToastContainer position="top-center" />
//       <div className="bg-white rounded-xl border border-gray-300 p-8 w-full max-w-6xl">
//         <h2 className="text-center text-lg md:text-xl font-semibold text-blue-800 mb-2">
//           Please Select an Option to Continue
//         </h2>
//         <h1 className="text-center text-2xl md:text-3xl font-bold text-blue-900 mb-1">
//           Subscription Plans
//         </h1>
//         <p className="text-center text-gray-500 text-sm md:text-base mb-8">
//           Choose the perfect plan that suits your needs and budget.
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//           {plans.map((plan, index) => (
//             <div
//               key={plan.id}
//               className="rounded-lg p-6 border border-gray-200 hover:border-teal-500 shadow-sm transition duration-300 cursor-pointer"
//             >
//               <h3 className="text-center font-semibold text-gray-800 mb-1 text-sm">
//                 {["Silver Plan", "Gold Plan", "Platinum Plan"][index] || plan.plan_name}
//               </h3>

//               <div className="text-center text-3xl font-bold text-black mb-1">
//                 ₹{parseFloat(plan.price).toFixed(2)}
//               </div>
//               <p className="text-center text-sm text-gray-500 mb-4">
//                 /{["month", "quarter", "year"][index] || "duration"}
//               </p>

//               <ul className="text-sm text-gray-700 space-y-1 mb-4">
//                 {plan.features.map((feature, i) => (
//                   <li key={i}>✔ {feature}</li>
//                 ))}
//               </ul>

//               <button
//                 className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded text-sm font-medium"
//                 onClick={() => handlePlanSelect(plan)}
//               >
//                 Choose Plan
//               </button>
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-center">
//           <button
//             onClick={() => {
//               toast.info("Skipped plan selection.");
//               navigate("/home1");
//             }}
//             className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded text-sm"
//           >
//             Skip
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionPlans;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiClient } from "../../../../api/apiclient";

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);

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

  const handlePlanSelect = (plan) => {
    toast.success(`${plan.plan_name} selected. Redirecting...`);
    // Store selected plan in localStorage or context if needed
    localStorage.setItem("selectedPlan", JSON.stringify(plan));
    navigate("/tutorreg");
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
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className="rounded-lg p-6 border border-gray-200 hover:border-teal-500 shadow-sm transition duration-300 cursor-pointer"
            >
              <h3 className="text-center font-semibold text-gray-800 mb-1 text-sm">
                {["Silver Plan", "Gold Plan", "Platinum Plan"][index] || plan.plan_name}
              </h3>

              <div className="text-center text-3xl font-bold text-black mb-1">
                ₹{parseFloat(plan.price).toFixed(2)}
              </div>
              <p className="text-center text-sm text-gray-500 mb-4">
                /{["month", "quarter", "year"][index] || "duration"}
              </p>

              <ul className="text-sm text-gray-700 space-y-1 mb-4">
                {plan.features.map((feature, i) => (
                  <li key={i}>✔ {feature}</li>
                ))}
              </ul>

              <button
                className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded text-sm font-medium"
                onClick={() => handlePlanSelect(plan)}
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => {
              toast.info("Skipped plan selection.");
              navigate("/home1");
            }}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded text-sm"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;

