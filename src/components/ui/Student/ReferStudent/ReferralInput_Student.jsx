// src/components/ui/Tutor/ReferTutor/ReferralInput.jsx

import React from 'react';

const ReferralInput = ({ referralCode, setReferralCode }) => {
  return (
    <div className="max-w-md mx-auto p-4 border border-gray-200 rounded-lg shadow-sm mt-4 bg-white">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Referral Code (optional)
      </label>
      <input
        type="text"
        placeholder="Enter referral code"
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default ReferralInput;
