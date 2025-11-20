

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline"; 
import { apiClient } from "../../../../api/apiclient";
import { apiUrl } from "../../../../api/apiUtl";

const ReferralStep = () => {
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleApply = async () => {
    if (!referralCode.trim()) {
      setMessage({ type: "error", text: "Please enter your referral code, or select Skip to continue." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await apiClient.post(apiUrl.referrals.apply, {
        code: referralCode.trim(),
      });

      setMessage({ type: "success", text: "Referral code applied successfully!" });
      setTimeout(() => {
        navigate("/location-form");
      }, 1200);
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.response?.data?.message || "Invalid referral code.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/location-form");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="bg-white border rounded-xl p-6 sm:p-8 w-full max-w-md shadow-md relative">
        {/* Cross Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        {/* Heading */}
        <h2 className="text-center text-xl sm:text-2xl font-semibold text-blue-900 mb-6">
          Have a Referral Code?
        </h2>

        {/* Input Label */}
        <label className="block text-sm font-medium mb-1">
          Referral Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter your referral code"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          className="w-full border rounded-md p-2 sm:p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />
        <p className="text-xs text-gray-500 mb-4 sm:mb-6">
          If you don’t have a code, you can skip this step.
        </p>

        {/* ✅ Inline Message */}
        {message.text && (
          <p
            className={`text-sm mb-4 ${
              message.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message.text}
          </p>
        )}

        {/* Button Group */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md text-sm sm:text-base"
          >
            Back
          </button>
          <button
            onClick={handleSkip}
            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md text-sm sm:text-base"
          >
            Skip
          </button>
          <button
            onClick={handleApply}
            disabled={loading}
            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md text-sm sm:text-base disabled:opacity-50"
          >
            {loading ? "Applying..." : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralStep;


