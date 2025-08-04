// src/components/ui/Tutor/ReferTutor/ReferralInput.jsx
import React from 'react';

const ReferralInput = ({ referralCode, setReferralCode }) => {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium">Referral Code (optional)</label>
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
