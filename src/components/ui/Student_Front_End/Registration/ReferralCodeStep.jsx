import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ReferralStep = () => {
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 👈 for navigation

  const handleApply = async () => {
    if (!referralCode.trim()) {
      toast.warning("Please enter a referral code");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/referrals/apply', {
        code: referralCode.trim(),
      });
      toast.success('Referral code applied successfully!');
      
      // Delay navigation slightly to let toast show
      setTimeout(() => {
        navigate('/student-dashboard'); // 👈 change this to your next route
      }, 1000);
      
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Invalid referral code');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    toast.info("Skipped referral code.");
    
    // Delay navigation slightly to let toast show
    setTimeout(() => {
      navigate('/student-dashboard'); // 👈 change this to your next route
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-5">
      <h2 className="text-2xl font-semibold text-center text-blue-800">Have a Referral Code?</h2>
      <p className="text-sm text-gray-600 text-center">Enter your referral code or skip this step.</p>

      <input
        type="text"
        placeholder="Enter Referral Code"
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex items-center justify-between">
        <button
          onClick={handleSkip}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
        >
          Skip
        </button>
        <button
          onClick={handleApply}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Applying...' : 'Apply'}
        </button>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default ReferralStep;
