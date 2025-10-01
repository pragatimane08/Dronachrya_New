// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { apiClient } from "../../../../api/apiclient";
// import { XMarkIcon } from "@heroicons/react/24/outline";

// const availableLanguages = ["English", "Hindi", "Telugu", "Tamil"];

// const CreateProfile = () => {
//   const navigate = useNavigate();
//   const [languages, setLanguages] = useState([]);
//   const [degree, setDegree] = useState("");
//   const [university, setUniversity] = useState("");
//   const [status, setStatus] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   // Add language from predefined buttons
//   const handleLanguageSelect = (lang) => {
//     if (!languages.find((l) => l.name.toLowerCase() === lang.toLowerCase())) {
//       setLanguages([...languages, { name: lang, proficiency: "" }]);
//       setErrors((prev) => ({ ...prev, languages: "" }));
//     }
//   };

//   // Update language name or proficiency
//   const handleLanguageChange = (index, field, value) => {
//     const updated = [...languages];
//     updated[index][field] = value;
//     setLanguages(updated);
//     setErrors((prev) => ({ ...prev, languages: "" }));
//   };

//   // Add new empty language row for custom input
//   const handleAddMore = () => {
//     setLanguages([...languages, { name: "", proficiency: "" }]);
//     setErrors((prev) => ({ ...prev, languages: "" }));
//   };

//   // Remove language row
//   const handleRemoveLanguage = (index) => {
//     const updated = [...languages];
//     updated.splice(index, 1);
//     setLanguages(updated);
//     setErrors((prev) => ({ ...prev, languages: "" }));
//   };

//   // Validation
//   const validate = () => {
//     const newErrors = {};
//     if (languages.length === 0 || languages.some((l) => !l.name || !l.proficiency)) {
//       newErrors.languages = "Please select at least one language and its proficiency.";
//     }
//     if (!degree) newErrors.degree = "Degree is required.";
//     if (!university.trim()) newErrors.university = "University name is required.";
//     if (!status) newErrors.status = "Please select education status (Completed/Pursuing).";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle submit
//   const handleNext = async () => {
//     if (!validate()) return;

//     const payload = {
//       languages,
//       degrees: [degree],
//       degree_status: status,
//       school_name: university,
//     };

//     try {
//       setLoading(true);
//       await apiClient.put("/profile/tutor", payload);
//       navigate("/create-profile-tutor2");
//     } catch (err) {
//       setErrors((prev) => ({
//         ...prev,
//         submit: "Submission failed. Please try again later.",
//       }));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="relative max-w-2xl w-full bg-white border rounded-2xl p-8 shadow-lg">
//         {/* ❌ Cross button */}
//         <button
//           onClick={() => navigate("/")}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
//         >
//           <XMarkIcon className="w-6 h-6" />
//         </button>

//         {/* Heading */}
//         <h2 className="text-center text-2xl md:text-3xl font-bold text-[#1E3A8A] mb-8">
//           Create Your Profile
//         </h2>

//         {/* Languages Section */}
//         <div className="mb-8">
//           <label className="block text-lg font-medium text-gray-700 mb-3">
//             Languages you speak <span className="text-red-500">*</span>
//           </label>

//           {/* Predefined buttons */}
//           <div className="flex flex-wrap gap-2 mb-4">
//             {availableLanguages.map((lang) => {
//               const isSelected = languages.find(
//                 (l) => l.name.toLowerCase() === lang.toLowerCase()
//               );
//               return (
//                 <button
//                   key={lang}
//                   onClick={() => handleLanguageSelect(lang)}
//                   type="button"
//                   className={`px-4 py-2 rounded-full border text-sm transition ${
//                     isSelected
//                       ? "bg-[#35BAA3] text-white border-[#35BAA3]"
//                       : "border-gray-300 text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   {lang}
//                 </button>
//               );
//             })}
//           </div>

//           {/* Added languages list */}
//           {languages.map((lang, idx) => (
//             <div
//               key={idx}
//               className="flex items-center gap-3 mb-3 border border-gray-200 p-3 rounded-lg shadow-sm"
//             >
//               <input
//                 type="text"
//                 value={lang.name}
//                 onChange={(e) =>
//                   handleLanguageChange(idx, "name", e.target.value)
//                 }
//                 placeholder="Enter language"
//                 className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
//               />
//               <select
//                 value={lang.proficiency}
//                 onChange={(e) =>
//                   handleLanguageChange(idx, "proficiency", e.target.value)
//                 }
//                 className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
//               >
//                 <option value="">Select Proficiency</option>
//                 <option value="Basic">Basic</option>
//                 <option value="Conversational">Conversational</option>
//                 <option value="Fluent">Fluent</option>
//                 <option value="Native">Native</option>
//               </select>
//               <button
//                 type="button"
//                 onClick={() => handleRemoveLanguage(idx)}
//                 className="text-red-500 hover:text-red-700"
//                 title="Remove"
//               >
//                 <XMarkIcon className="w-5 h-5" />
//               </button>
//             </div>
//           ))}
//           {errors.languages && (
//             <p className="text-xs text-red-500 mt-1">{errors.languages}</p>
//           )}

//           {/* Add more button */}
//           <button
//             type="button"
//             onClick={handleAddMore}
//             className="bg-[#35BAA3] hover:bg-[#2ea18e] disabled:opacity-60 text-white px-6 py-2 rounded-lg font-medium text-sm transition"
//           >
//             + Add More
//           </button>
//         </div>

//         {/* Education Section */}
//         <div className="mb-8">
//           <label className="block text-lg font-medium text-gray-700 mb-3">
//             Highest Education <span className="text-red-500">*</span>
//           </label>

//           <select
//             value={degree}
//             onChange={(e) => setDegree(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-1 text-sm"
//           >
//             <option value="">Select Degree</option>
//             <option value="Bachelors">Bachelors</option>
//             <option value="Masters">Masters</option>
//             <option value="PhD">PhD</option>
//             <option value="Diploma">Diploma</option>
//           </select>
//           {errors.degree && (
//             <p className="text-xs text-red-500 mb-2">{errors.degree}</p>
//           )}

//           <input
//             type="text"
//             placeholder="School/University Name"
//             value={university}
//             onChange={(e) => setUniversity(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-1 text-sm"
//           />
//           {errors.university && (
//             <p className="text-xs text-red-500 mb-2">{errors.university}</p>
//           )}

//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
//           >
//             <option value="">Completed/Pursuing</option>
//             <option value="Completed">Completed</option>
//             <option value="Pursuing">Pursuing</option>
//           </select>
//           {errors.status && (
//             <p className="text-xs text-red-500 mt-1">{errors.status}</p>
//           )}
//         </div>

//         {/* Submit Errors */}
//         {errors.submit && (
//           <p className="text-xs text-red-500 mb-4">{errors.submit}</p>
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
//             onClick={handleNext}
//             disabled={loading}
//             className="bg-[#35BAA3] hover:bg-[#2ea18e] disabled:opacity-60 text-white px-6 py-2 rounded-lg font-medium text-sm transition"
//           >
//             {loading ? "Submitting..." : "Save & Continue"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateProfile;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../../api/apiclient";
import { XMarkIcon } from "@heroicons/react/24/outline";
import FormLayout from "../../home/layout/FormLayout";

const availableLanguages = ["English", "Hindi", "Telugu", "Tamil"];

const CreateProfile = () => {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [degree, setDegree] = useState("");
  const [university, setUniversity] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Add language from predefined buttons
  const handleLanguageSelect = (lang) => {
    if (!languages.find((l) => l.name.toLowerCase() === lang.toLowerCase())) {
      setLanguages([...languages, { name: lang, proficiency: "" }]);
      setErrors((prev) => ({ ...prev, languages: "" }));
    }
  };

  // Update language name or proficiency
  const handleLanguageChange = (index, field, value) => {
    const updated = [...languages];
    updated[index][field] = value;
    setLanguages(updated);
    setErrors((prev) => ({ ...prev, languages: "" }));
  };

  // Add new empty language row for custom input
  const handleAddMore = () => {
    setLanguages([...languages, { name: "", proficiency: "" }]);
    setErrors((prev) => ({ ...prev, languages: "" }));
  };

  // Remove language row
  const handleRemoveLanguage = (index) => {
    const updated = [...languages];
    updated.splice(index, 1);
    setLanguages(updated);
    setErrors((prev) => ({ ...prev, languages: "" }));
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    if (
      languages.length === 0 ||
      languages.some((l) => !l.name || !l.proficiency)
    ) {
      newErrors.languages =
        "Please select at least one language and its proficiency.";
    }
    if (!degree) newErrors.degree = "Degree is required.";
    if (!university.trim())
      newErrors.university = "University name is required.";
    if (!status)
      newErrors.status = "Please select education status (Completed/Pursuing).";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleNext = async () => {
    if (!validate()) return;

    const payload = {
      languages,
      degrees: [degree],
      degree_status: status,
      school_name: university,
    };

    try {
      setLoading(true);
      await apiClient.put("/profile/tutor", payload);
      navigate("/create-profile-tutor2");
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: "Submission failed. Please try again later.",
      }));
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
      <h2 className="text-center text-xl sm:text-2xl font-bold text-[#1E3A8A] mb-6">
        Create Your Profile
      </h2>

      {/* Languages Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Languages you speak <span className="text-red-500">*</span>
        </label>

        {/* Predefined buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {availableLanguages.map((lang) => {
            const isSelected = languages.find(
              (l) => l.name.toLowerCase() === lang.toLowerCase()
            );
            return (
              <button
                key={lang}
                onClick={() => handleLanguageSelect(lang)}
                type="button"
                className={`px-3 py-1.5 rounded-full border text-xs transition ${
                  isSelected
                    ? "bg-[#35BAA3] text-white border-[#35BAA3]"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>

        {/* Added languages list */}
        {languages.map((lang, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 mb-2 border border-gray-200 p-2 rounded-lg"
          >
            <input
              type="text"
              value={lang.name}
              onChange={(e) =>
                handleLanguageChange(idx, "name", e.target.value)
              }
              placeholder="Enter language"
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
            />
            <select
              value={lang.proficiency}
              onChange={(e) =>
                handleLanguageChange(idx, "proficiency", e.target.value)
              }
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="">Select Proficiency</option>
              <option value="Basic">Basic</option>
              <option value="Conversational">Conversational</option>
              <option value="Fluent">Fluent</option>
              <option value="Native">Native</option>
            </select>
            <button
              type="button"
              onClick={() => handleRemoveLanguage(idx)}
              className="text-red-500 hover:text-red-700"
              title="Remove"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
        {errors.languages && (
          <p className="text-xs text-red-500 mt-1">{errors.languages}</p>
        )}

        {/* Add more button */}
        <button
          type="button"
          onClick={handleAddMore}
          className="bg-[#35BAA3] hover:bg-[#2ea18e] disabled:opacity-60 text-white px-4 py-1.5 rounded-lg text-sm transition mt-2"
        >
          + Add More
        </button>
      </div>

      {/* Education Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Highest Education <span className="text-red-500">*</span>
        </label>

        <select
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1.5 mb-1 text-sm"
        >
          <option value="">Select Degree</option>
          <option value="Bachelors">Bachelors</option>
          <option value="Masters">Masters</option>
          <option value="PhD">PhD</option>
          <option value="Diploma">Diploma</option>
        </select>
        {errors.degree && (
          <p className="text-xs text-red-500 mb-1">{errors.degree}</p>
        )}

        <input
          type="text"
          placeholder="School/University Name"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1.5 mb-1 text-sm"
        />
        {errors.university && (
          <p className="text-xs text-red-500 mb-1">{errors.university}</p>
        )}

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
        >
          <option value="">Completed/Pursuing</option>
          <option value="Completed">Completed</option>
          <option value="Pursuing">Pursuing</option>
        </select>
        {errors.status && (
          <p className="text-xs text-red-500 mt-1">{errors.status}</p>
        )}
      </div>

      {/* Submit Errors */}
      {errors.submit && (
        <p className="text-xs text-red-500 mb-3">{errors.submit}</p>
      )}

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-1.5 rounded-lg text-sm transition"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={loading}
          className="bg-[#35BAA3] hover:bg-[#2ea18e] disabled:opacity-60 text-white px-4 py-1.5 rounded-lg text-sm transition"
        >
          {loading ? "Submitting..." : "Save & Continue"}
        </button>
      </div>
    </FormLayout>
  );
};

export default CreateProfile;
