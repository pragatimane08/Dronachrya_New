import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../../api/apiclient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { XMarkIcon } from "@heroicons/react/24/outline";

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

  const handleRemoveLanguage = (index) => {
    const updated = [...languages];
    updated.splice(index, 1);
    setLanguages(updated);
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
      return;
    }

    const payload = {
      languages,
      degrees: [degree],
      degree_status: status,
      school_name: university,
    };

    try {
      setLoading(true);
      await apiClient.put("/profile/tutor", payload);
      toast.success("✅ Profile updated successfully.");
      setTimeout(() => navigate("/create-profile-tutor2"), 1500);
    } catch (err) {
      console.error("❌ Profile submission failed:", err);
      toast.error("❌ Submission failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="relative max-w-2xl w-full bg-white border rounded-2xl p-8 shadow-lg">
          {/* ❌ Cross button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Heading */}
          <h2 className="text-center text-2xl md:text-3xl font-bold text-[#1E3A8A] mb-8">
            Create Your Profile
          </h2>

           {/* Languages Section */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Languages you speak <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {availableLanguages.map((lang) => {
                const isSelected = languages.find((l) => l.name === lang);
                return (
                  <button
                    key={lang}
                    onClick={() => handleLanguageSelect(lang)}
                    type="button"
                    className={`px-4 py-2 rounded-full border text-sm transition ${
                      isSelected
                        ? "bg-[#35BAA3] text-white border-[#35BAA3]" // ✅ all green
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>

            {languages.map((lang, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 mb-3 border border-gray-200 p-3 rounded-lg shadow-sm"
              >
                <input
                  type="text"
                  value={lang.name}
                  readOnly
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-sm"
                />
                <select
                  value={lang.proficiency}
                  onChange={(e) => handleLanguageChange(idx, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
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

            <button
              type="button"
              onClick={handleAddMore}
              className="bg-[#35BAA3] hover:bg-[#2ea18e] disabled:opacity-60 text-white px-6 py-2 rounded-lg font-medium text-sm transition"
            >
              + Add More
            </button>
          </div>

          {/* Education Section */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Highest Education <span className="text-red-500">*</span>
            </label>

            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 text-sm"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 text-sm"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Completed/Pursuing</option>
              <option value="Completed">Completed</option>
              <option value="Pursuing">Pursuing</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium text-sm transition"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="bg-[#35BAA3] hover:bg-[#2ea18e] disabled:opacity-60 text-white px-6 py-2 rounded-lg font-medium text-sm transition"
            >
              {loading ? "Submitting..." : "Save & Continue"}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default CreateProfile;
