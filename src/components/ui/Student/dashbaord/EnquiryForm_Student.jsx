// src/components/ui/Student/EnquiryForm_Student.jsx

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { apiClient } from "../../../../api/apiclient";

// ---------- Reusable Input Components ----------
const FormInput = ({ label, name, value, onChange, placeholder, error }) => (
  <div>
    <label className="block text-[#0E2D63] mb-1 text-sm font-medium">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-[#35BAA3]'} rounded-md focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-[#35BAA3]'}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const FormTextarea = ({ label, name, value, onChange, placeholder, error }) => (
  <div>
    <label className="block text-[#0E2D63] mb-1 text-sm font-medium">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
      className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-[#35BAA3]'} rounded-md focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-[#35BAA3]'}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// ---------- Main Component ----------
const EnquiryForm_Student = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const receiverId = location.state?.receiver_id;

  console.log("Receiver ID passed:", receiverId); // ✅ Log the received tutor ID

  const [formData, setFormData] = useState({
    subject: '',
    class: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.class.trim()) newErrors.class = 'Class is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill all required fields");
      return;
    }

    if (!receiverId) {
      toast.error("Tutor ID is missing. Cannot submit enquiry.");
      return;
    }

    const payload = {
      receiver_id: receiverId,
      ...formData,
    };

    try {
      await apiClient.post("/enquiries", payload);
      toast.success("Enquiry submitted successfully");
      setTimeout(() => {
        navigate("/student-dashboard");
      }, 2000);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong while submitting the enquiry"
      );
    }
  };

  const handleCancel = () => {
    navigate("/student-dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-[#35BAA3] relative">
        
        {/* ❌ Close Button */}
        <button
          onClick={handleCancel}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-semibold text-center text-[#0E2D63] mb-6">
          Raise an Enquiry
        </h2>

        <div className="space-y-4">
          <FormInput
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g., Physics"
            error={errors.subject}
          />

          <FormInput
            label="Class"
            name="class"
            value={formData.class}
            onChange={handleChange}
            placeholder="e.g., 12"
            error={errors.class}
          />

          <FormTextarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Need help with English."
            error={errors.description}
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-[#878484] hover:bg-[#4a4a4a] text-white font-semibold py-2 px-6 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#35BAA3] hover:bg-[#2ea391] text-white font-semibold py-2 px-6 rounded"
          >
            Submit
          </button>
        </div>

        <ToastContainer position="top-center" />
      </div>
    </div>
  );
};

export default EnquiryForm_Student;
