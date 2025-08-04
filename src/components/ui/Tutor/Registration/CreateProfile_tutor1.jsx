import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../../api/apiclient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const availableLanguages = ["English", "Hindi", "Telugu", "Tamil"];

const CreateProfile = () => {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [degree, setDegree] = useState("");
  const [university, setUniversity] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLanguageSelect = (lang) => {
    if (!languages.find((l) => l.name === lang)) {
      setLanguages([...languages, { name: lang, proficiency: "" }]);
    }
  };

  const handleLanguageChange = (index, value) => {
    const updated = [...languages];
    updated[index].proficiency = value;
    setLanguages(updated);
  };

  const handleAddMore = () => {
    setLanguages([...languages, { name: "", proficiency: "" }]);
  };

  const validate = () => {
    const errors = [];
    if (languages.length === 0 || languages.some((l) => !l.name || !l.proficiency)) {
      errors.push("⚠ Please select at least one language and its proficiency.");
    }
    if (!degree) errors.push("⚠ Degree is required.");
    if (!university.trim()) errors.push("⚠ University name is required.");
    if (!status) errors.push("⚠ Please select education status (Completed/Pursuing).");
    return errors;
  };

  const handleNext = async () => {
    const errors = validate();
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      console.warn("Validation errors:", errors);
      return;
    }

    const payload = {
      languages,
      degrees: [degree],
      degree_status: status,
      school_name: university,
    };

    console.log("📤 Submitting tutor profile data:", payload);

    try {
      setLoading(true);
      await apiClient.put("/profile/tutor", payload);
      toast.success("✅ Profile updated successfully.");
      console.log("✅ API success. Redirecting to next section...");
      setTimeout(() => navigate("/create-profile-tutor2"), 1500); // Slight delay to show toast
    } catch (err) {
      console.error("❌ Profile submission failed:", err);
      toast.error("❌ Submission failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-xl w-full border rounded-md p-8 shadow">
          <h2 className="text-center text-xl md:text-2xl font-semibold text-[#1E3A8A] mb-6">
            Create Your Profile
          </h2>

          {/* Languages */}
          <div>
            <p className="text-base md:text-lg font-medium text-gray-700 mb-1">
              Languages you speak? <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-wrap gap-2 text-sm md:text-base text-[#3C3C3C] mb-3">
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  className="text-blue-700 hover:underline"
                  type="button"
                >
                  {lang}
                </button>
              ))}
            </div>

            {languages.map((lang, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={lang.name}
                  readOnly
                  className="border border-gray-300 rounded px-3 py-2 w-1/2 bg-gray-100 text-sm md:text-base"
                />
                <select
                  value={lang.proficiency}
                  onChange={(e) => handleLanguageChange(idx, e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-1/2 text-gray-700 text-sm md:text-base"
                >
                  <option value="">Select Proficiency</option>
                  <option value="Basic">Basic</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Native">Native</option>
                </select>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddMore}
              className="text-blue-600 underline mb-4 text-sm md:text-base"
            >
              + Add More
            </button>
          </div>

          {/* Education Details */}
          <div className="mt-4">
            <p className="text-base md:text-lg font-medium text-gray-700 mb-2">
              Highest Education <span className="text-red-500">*</span>
            </p>

            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 text-sm md:text-base"
            >
              <option value="">Select Degree</option>
              <option value="Bachelors">Bachelors</option>
              <option value="Masters">Masters</option>
              <option value="PhD">PhD</option>
              <option value="Diploma">Diploma</option>
            </select>

            <input
              type="text"
              placeholder="School/University Name"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 text-sm md:text-base"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-6 text-sm md:text-base"
            >
              <option value="">Completed/Pursuing</option>
              <option value="Completed">Completed</option>
              <option value="Pursuing">Pursuing</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={handleNext}
              disabled={loading}
              className="bg-[#35BAA3] hover:bg-[#2ea18e] text-white px-6 py-2 rounded font-medium text-base md:text-lg"
            >
              {loading ? "Submitting..." : "Next"}
            </button>
          </div>
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default CreateProfile;