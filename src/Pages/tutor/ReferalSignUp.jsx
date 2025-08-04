import React, { useState } from 'react';
import ReferralInput from '../../components/ui/Tutor/ReferTutor/ReferralInput';
import { apiClient } from '../../api/apiclient';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiClient.post('/auth/signup', {
        email,
        mobile_number: mobile,
        password,
        role: 'tutor',
        referralCode: referralCode || null, // safely pass null if empty
      });

      alert('Registered successfully!');
      // Optionally reset form fields
      setEmail('');
      setMobile('');
      setPassword('');
      setReferralCode('');
    } catch (err) {
      console.error(err?.response?.data || err.message);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Tutor Signup</h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full mb-3 px-3 py-2 border rounded"
      />

      <input
        type="tel"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        placeholder="Mobile Number"
        required
        className="w-full mb-3 px-3 py-2 border rounded"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="w-full mb-3 px-3 py-2 border rounded"
      />

      {/* ✅ Referral Code Input */}
      <ReferralInput referralCode={referralCode} setReferralCode={setReferralCode} />

      <button type="submit" className="w-full mt-4 py-2 bg-blue-600 text-white rounded">
        Sign Up
      </button>
    </form>
  );
};

export default Signup;