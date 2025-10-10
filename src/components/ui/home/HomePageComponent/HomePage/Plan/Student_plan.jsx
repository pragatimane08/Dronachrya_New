// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { apiClient } from "../../../../../../api/apiclient";
// import { toast } from "react-toastify";
// import Layout from "../../../../home/layout/MainLayout";

// export default function HomeSubscriptionPlans() {
//   const [plans, setPlans] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPlans = async () => {
//       try {
//         const res = await apiClient.get("/subscriptions/student");
//         if (res.data.plans && res.data.plans.length > 0) {
//           const uniqueMap = new Map();
//           res.data.plans.forEach((p) => {
//             const key = `${p.plan_name}-${p.price}`;
//             if (!uniqueMap.has(key)) uniqueMap.set(key, p);
//           });

//           const uniquePlans = Array.from(uniqueMap.values());
//           setPlans(uniquePlans);
//         }
//       } catch (err) {
//         console.error("Failed to fetch plans", err);
//         toast.error("Failed to load subscription plans.");
//       }
//     };

//     fetchPlans();
//   }, []);

//   return (
//      <Layout>
//     <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-white">
//       <div className="w-full max-w-5xl bg-white border rounded-lg shadow p-6">
//         <h2 className="text-center text-[#0E2D63] text-2xl font-semibold mb-8">
//           Choose Your Subscription Plan
//         </h2>

//         <div className="grid gap-6 md:grid-cols-3">
//           {plans.map((plan) => (
//             <div
//               key={plan.id}
//               className="bg-gray-50 border rounded shadow-md p-6 flex flex-col"
//             >
//               <h3 className="text-center text-lg font-medium text-gray-700">
//                 {plan.plan_name}
//               </h3>

//               <div className="text-center text-2xl font-bold mt-2 mb-1">
//                 ₹{plan.price}.00
//               </div>

//               <p className="text-center text-sm text-gray-500 mb-4">
//                 {plan.duration_days}-day validity
//               </p>

//               <ul className="text-sm text-gray-600 space-y-1 mb-4 font-medium">
//                 {plan.features?.map((feature, index) => (
//                   <li key={index}>✔ {feature}</li>
//                 ))}
//               </ul>

//               <button
//                 onClick={() => navigate("/studentreg")}
//                 className="bg-teal-500 hover:bg-teal-600 text-white py-2 rounded text-sm mt-auto"
//               >
//                 Choose Plan
//               </button>
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-center mt-8">
//           <button
//             className="bg-gray-300 px-4 py-2 rounded text-base"
//             onClick={() => navigate("/home1")}
//           >
//             Skip
//           </button>
//         </div>
//       </div>
//     </div>
//     </Layout>
//   );
// }

// src/pages/student/subscription/HomeSubscriptionPlans.jsx
import React from "react";
import PlanSelectorTemplate from "../../../../../common/PlanSelectorTemplate";

export default function HomeSubscriptionPlans() {
  return (
    <PlanSelectorTemplate
      apiEndpoint="/subscriptions/student"
      redirectPath="/book-demo"
      skipPath="/home1"
      role="student"
    />
  );
}
