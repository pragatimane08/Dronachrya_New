// // src/components/ui/Student/PlanCard.jsx

// import React from "react";

// export default function PlanCard({ plan, onSelect, loading }) {
//   return (
//     <div className="bg-gray-50 border rounded shadow-md p-6 flex flex-col">
//       <h3 className="text-center text-lg font-medium text-gray-700">
//         {plan.plan_name}
//       </h3>

//       <div className="text-center text-2xl font-bold mt-2 mb-1">
//         ₹{plan.price}
//       </div>

//       <p className="text-center text-sm text-gray-500 mb-4">
//         {plan.duration_days}-day validity
//       </p>

//       <ul className="text-sm text-gray-600 space-y-1 mb-4">
//         {plan.features?.map((feature, index) => (
//           <li key={index}>✔ {feature}</li>
//         ))}
//       </ul>

//       <button
//         onClick={() => onSelect(plan)}
//         disabled={loading}
//         className="bg-teal-500 hover:bg-teal-600 text-white py-2 rounded text-sm mt-auto"
//       >
//         {loading ? "Processing..." : "Choose Plan"}
//       </button>
//     </div>
//   );
// }
