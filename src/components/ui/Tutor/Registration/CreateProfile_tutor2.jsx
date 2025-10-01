// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { apiClient } from "../../../../api/apiclient";
// import { XMarkIcon } from "@heroicons/react/24/outline";

// const ClassPreferenceForm = () => {
//   const navigate = useNavigate();
//   const [online, setOnline] = useState(true);
//   const [offline, setOffline] = useState(true);
//   const [experience, setExperience] = useState("");
//   const [customExperience, setCustomExperience] = useState("");
//   const [price, setPrice] = useState("");
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

//   // Validation
//   const validate = () => {
//     const newErrors = {};
//     if (!online && !offline) {
//       newErrors.conduct = "Please select at least one mode.";
//     }

//     const expValue =
//       experience === "5+" ? Number(customExperience) : Number(experience);

//     if (!expValue || isNaN(expValue) || expValue <= 0) {
//       newErrors.experience = "Please enter a valid experience in years.";
//     }

//     if (!price || isNaN(price) || Number(price) < 100) {
//       newErrors.price = "Hourly rate must be at least ₹100.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Submit handler
//   const handleSubmit = async () => {
//     setHasAttemptedSubmit(true);
//     if (!validate()) return;

//     setLoading(true);

//     const expValue =
//       experience === "5+" ? Number(customExperience) : Number(experience);

//     const payload = {
//       class_modes: [
//         ...(online ? ["Online"] : []),
//         ...(offline ? ["Offline"] : []),
//       ],
//       total_experience_years: expValue,
//       pricing_per_hour: Number(price),
//     };

//     try {
//       await apiClient.put("/profile/tutor", payload);
//       navigate("/tutor-dashboard");
//     } catch (err) {
//       setErrors({
//         submit: "Failed to save your preferences. Please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="relative w-full max-w-md border rounded-xl p-8 shadow-lg bg-white">
//         {/* ❌ Cross button */}
//         <button
//           onClick={() => navigate("/")}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
//         >
//           <XMarkIcon className="w-6 h-6" />
//         </button>

//         {/* Heading */}
//         <h2 className="text-center text-2xl font-semibold text-[#1E3A8A] mb-6">
//           Teaching Preferences
//         </h2>

//         {/* Class Modes */}
//         <div className="mb-5">
//           <label className="block text-base font-medium text-gray-700 mb-2">
//             Class Modes <span className="text-red-500">*</span>
//           </label>
//           <label className="flex items-center border px-3 py-2 rounded mb-2 text-sm">
//             <input
//               type="checkbox"
//               checked={online}
//               onChange={(e) => setOnline(e.target.checked)}
//               className="mr-3 accent-[#35BAA3]"
//             />
//             Online Classes
//           </label>
//           <label className="flex items-center border px-3 py-2 rounded text-sm">
//             <input
//               type="checkbox"
//               checked={offline}
//               onChange={(e) => setOffline(e.target.checked)}
//               className="mr-3 accent-[#35BAA3]"
//             />
//             Offline Classes
//           </label>
//           {hasAttemptedSubmit && errors.conduct && (
//             <p className="text-xs text-red-500 mt-1">{errors.conduct}</p>
//           )}
//         </div>

//         {/* Experience */}
//         <div className="mb-5">
//           <label className="block text-base font-medium text-gray-700 mb-2">
//             Teaching Experience (Years) <span className="text-red-500">*</span>
//           </label>
//           <div className="flex gap-2">
//             <select
//               value={experience}
//               onChange={(e) => {
//                 setExperience(e.target.value);
//                 if (e.target.value !== "5+") setCustomExperience("");
//               }}
//               className="flex-1 border px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#35BAA3]"
//             >
//               <option value="">Select experience</option>
//               <option value="1">1 year</option>
//               <option value="2">2 years</option>
//               <option value="3">3 years</option>
//               <option value="4">4 years</option>
//               <option value="5+">5+ years</option>
//             </select>

//             {experience === "5+" && (
//               <input
//                 type="number"
//                 min="5"
//                 value={customExperience}
//                 onChange={(e) => setCustomExperience(e.target.value)}
//                 placeholder="Enter exact years"
//                 className="flex-1 border px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#35BAA3]"
//               />
//             )}
//           </div>
//           {hasAttemptedSubmit && errors.experience && (
//             <p className="text-xs text-red-500 mt-1">{errors.experience}</p>
//           )}
//         </div>

//         {/* Hourly Rate */}
//         <div className="mb-6">
//           <label className="block text-base font-medium text-gray-700 mb-2">
//             Hourly Rate (₹) <span className="text-red-500">*</span>
//           </label>
//           <div className="flex border rounded overflow-hidden">
//             <span className="px-3 py-2 text-gray-400 text-sm">₹</span>
//             <input
//               type="number"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               className="w-full px-3 py-2 outline-none text-sm"
//               placeholder="Enter Price (min ₹100)"
//               min="100"
//             />
//             <span className="px-3 py-2 text-gray-400 text-sm">Per hour</span>
//           </div>
//           {hasAttemptedSubmit && errors.price && (
//             <p className="text-xs text-red-500 mt-1">{errors.price}</p>
//           )}
//         </div>

//         {/* Submit error */}
//         {errors.submit && (
//           <p className="text-xs text-red-500 mb-2">{errors.submit}</p>
//         )}

//         {/* Buttons */}
//         <div className="flex justify-between mt-6">
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium text-sm transition"
//           >
//             Back
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="bg-[#35BAA3] hover:bg-[#2ea18e] text-white px-6 py-2 rounded-lg font-medium text-sm transition disabled:opacity-60"
//           >
//             {loading ? "Submitting..." : "Save & Continue"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClassPreferenceForm;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../../api/apiclient";
import { XMarkIcon } from "@heroicons/react/24/outline";
import FormLayout from "../../home/layout/FormLayout"; // ✅ Import the layout

const ClassPreferenceForm = () => {
  const navigate = useNavigate();
  const [online, setOnline] = useState(true);
  const [offline, setOffline] = useState(true);
  const [experience, setExperience] = useState("");
  const [customExperience, setCustomExperience] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!online && !offline) {
      newErrors.conduct = "Please select at least one mode.";
    }

    const expValue =
      experience === "5+" ? Number(customExperience) : Number(experience);

    if (!expValue || isNaN(expValue) || expValue <= 0) {
      newErrors.experience = "Please enter a valid experience in years.";
    }

    if (!price || isNaN(price) || Number(price) < 100) {
      newErrors.price = "Hourly rate must be at least ₹100.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!validate()) return;

    setLoading(true);

    const expValue =
      experience === "5+" ? Number(customExperience) : Number(experience);

    const payload = {
      class_modes: [
        ...(online ? ["Online"] : []),
        ...(offline ? ["Offline"] : []),
      ],
      total_experience_years: expValue,
      pricing_per_hour: Number(price),
    };

    try {
      await apiClient.put("/profile/tutor", payload);
      navigate("/tutor-dashboard");
    } catch (err) {
      setErrors({
        submit: "Failed to save your preferences. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout>
      {/* ❌ Cross button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      {/* Heading */}
      <h2 className="text-center text-2xl font-semibold text-[#1E3A8A] mb-6">
        Teaching Preferences
      </h2>

      {/* Class Modes */}
      <div className="mb-5">
        <label className="block text-base font-medium text-gray-700 mb-2">
          Class Modes <span className="text-red-500">*</span>
        </label>
        <label className="flex items-center border px-3 py-2 rounded mb-2 text-sm">
          <input
            type="checkbox"
            checked={online}
            onChange={(e) => setOnline(e.target.checked)}
            className="mr-3 accent-[#35BAA3]"
          />
          Online Classes
        </label>
        <label className="flex items-center border px-3 py-2 rounded text-sm">
          <input
            type="checkbox"
            checked={offline}
            onChange={(e) => setOffline(e.target.checked)}
            className="mr-3 accent-[#35BAA3]"
          />
          Offline Classes
        </label>
        {hasAttemptedSubmit && errors.conduct && (
          <p className="text-xs text-red-500 mt-1">{errors.conduct}</p>
        )}
      </div>

      {/* Experience */}
      <div className="mb-5">
        <label className="block text-base font-medium text-gray-700 mb-2">
          Teaching Experience (Years) <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <select
            value={experience}
            onChange={(e) => {
              setExperience(e.target.value);
              if (e.target.value !== "5+") setCustomExperience("");
            }}
            className="flex-1 border px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#35BAA3]"
          >
            <option value="">Select experience</option>
            <option value="1">1 year</option>
            <option value="2">2 years</option>
            <option value="3">3 years</option>
            <option value="4">4 years</option>
            <option value="5+">5+ years</option>
          </select>

          {experience === "5+" && (
            <input
              type="number"
              min="5"
              value={customExperience}
              onChange={(e) => setCustomExperience(e.target.value)}
              placeholder="Enter exact years"
              className="flex-1 border px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#35BAA3]"
            />
          )}
        </div>
        {hasAttemptedSubmit && errors.experience && (
          <p className="text-xs text-red-500 mt-1">{errors.experience}</p>
        )}
      </div>

      {/* Hourly Rate */}
      <div className="mb-6">
        <label className="block text-base font-medium text-gray-700 mb-2">
          Hourly Rate (₹) <span className="text-red-500">*</span>
        </label>
        <div className="flex border rounded overflow-hidden">
          <span className="px-3 py-2 text-gray-400 text-sm">₹</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 outline-none text-sm"
            placeholder="Enter Price (min ₹100)"
            min="100"
          />
          <span className="px-3 py-2 text-gray-400 text-sm">Per hour</span>
        </div>
        {hasAttemptedSubmit && errors.price && (
          <p className="text-xs text-red-500 mt-1">{errors.price}</p>
        )}
      </div>

      {/* Submit error */}
      {errors.submit && (
        <p className="text-xs text-red-500 mb-2">{errors.submit}</p>
      )}

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium text-sm transition"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#35BAA3] hover:bg-[#2ea18e] text-white px-6 py-2 rounded-lg font-medium text-sm transition disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Save & Continue"}
        </button>
      </div>
    </FormLayout>
  );
};

export default ClassPreferenceForm;
