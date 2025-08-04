import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddClassForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    student: "",
    link: "",
    datetime: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    navigate(-1); // Go back
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // You can add API submission logic here
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow-sm">
      <h2 className="text-xl font-semibold text-center text-blue-900 mb-6">
        Add Class Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Class Title</label>
          <input
            type="text"
            name="title"
            placeholder="Class Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Student name</label>
          <input
            type="text"
            name="student"
            placeholder="Student Name"
            value={formData.student}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Zoom/Meet Link</label>
          <input
            type="text"
            name="link"
            placeholder="Zoom/Meet Link"
            value={formData.link}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date & Time</label>
          <input
            type="datetime-local"
            name="datetime"
            value={formData.datetime}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-6 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-6 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClassForm;