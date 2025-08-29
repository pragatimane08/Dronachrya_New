import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { XMarkIcon } from "@heroicons/react/24/outline"; 
import { apiClient } from "../../../../api/apiclient";
import { apiUrl } from "../../../../api/apiUtl";

const ReferralStep = () => {
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleApply = async () => {
    if (!referralCode.trim()) {
      toast.warning("Please enter a referral code");
      return;
    }

    setLoading(true);
    try {
      await apiClient.post(apiUrl.referrals.apply, {
        code: referralCode.trim(),
      });

      toast.success("Referral code applied successfully!");
      setTimeout(() => {
        navigate("/location-form");
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Invalid referral code");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    toast.info("Skipped referral code.");
    setTimeout(() => {
      navigate("/location-form");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border rounded-md p-8 w-full max-w-md shadow-md relative z-10">
        {/* ✅ Cross Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        {/* ✅ Heading */}
        <h2 className="text-center text-2xl font-semibold text-blue-900 mb-6">
          Have a Referral Code?
        </h2>

        {/* ✅ Input Label */}
        <label className="block text-sm font-medium mb-1">
          Referral Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter your referral code"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          className="w-full border rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mb-6">
          If you don’t have a code, you can skip this step.
        </p>

        {/* ✅ Button Group */}
        <div className="flex justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md"
          >
            Back
          </button>
          <button
            onClick={handleSkip}
            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md"
          >
            Skip
          </button>
          <button
            onClick={handleApply}
            disabled={loading}
            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md disabled:opacity-50"
          >
            {loading ? "Applying..." : "Next"}
          </button>
        </div>

        {/* ✅ Toast */}
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};

export default ReferralStep;
