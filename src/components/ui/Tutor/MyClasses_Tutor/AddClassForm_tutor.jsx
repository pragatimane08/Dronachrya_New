// src/pages/tutor/classes/AddClassForm_Tutor.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../../api/apiclient";
import { classRepository } from "../../../../api/repository/class.repository";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddClassForm_Tutor = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    student_id: "",
    student_name: "",
    name: "",
    meeting_link: "",
    date_time: "",
    mode: "",
  });

  // ✅ Fetch students directly from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await apiClient.get("/users?role=student");
        const studentList =
          res.data?.data?.map((student) => ({
            id: student.id,
            name: student.name || student.email || student.mobile_number,
          })) || [];
        setStudents(studentList);
        console.log("✅ Students fetched:", studentList);
      } catch (err) {
        console.error("❌ Failed to fetch students:", err);
        toast.error("Unable to fetch students");
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  // ✅ Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // if selecting student, also save student_name
    if (name === "student_id") {
      const selectedStudent = students.find((s) => s.id === value);
      setFormData((prev) => ({
        ...prev,
        student_id: value,
        student_name: selectedStudent ? selectedStudent.name : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ✅ Form submit with validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.student_id ||
      !formData.student_name ||
      !formData.name ||
      !formData.date_time ||
      !formData.mode
    ) {
      toast.warn("Please fill all required fields.");
      return;
    }

    const selectedDate = new Date(formData.date_time);
    const now = new Date();

    if (isNaN(selectedDate.getTime())) {
      toast.error("Invalid date and time format.");
      return;
    }

    if (selectedDate <= now) {
      toast.error("Class must be scheduled for a future time.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        student_id: formData.student_id,
        student_name: formData.student_name,
        name: formData.name,
        meeting_link: formData.meeting_link,
        date_time: selectedDate.toISOString(),
        type: "regular",
        mode: formData.mode,
      };

      console.log("📡 Sending request with payload:", payload);

      const res = await classRepository.createClass(payload);
      console.log("✅ API Response:", res);

      toast.success("Class assigned successfully!");
      setTimeout(() => {
        navigate("/my_classes_tutor", { state: { refresh: true } });
      }, 1500);
    } catch (err) {
      console.error("❌ Submit error:", err);
      toast.error(err?.response?.data?.message || "Failed to assign class");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="relative bg-white border rounded-lg shadow p-6 w-full max-w-md"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => navigate("/my_classes_tutor")}
          className="absolute top-3 right-4 text-gray-500 text-xl hover:text-red-500"
        >
          &times;
        </button>

        <h2 className="text-lg font-semibold text-center text-blue-900 mb-6">
          Assign Class
        </h2>

        {/* Select Student */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Select Student</label>
          <select
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="">
              {loadingStudents ? "Loading students..." : "-- Select Student --"}
            </option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} {/* ✅ Only show name, not ID */}
              </option>
            ))}
          </select>
        </div>

        {/* Student Name (auto-filled) */}
        {formData.student_name && (
          <div className="mb-4">
            <label className="block font-medium mb-1">Student Name</label>
            <input
              type="text"
              value={formData.student_name}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>
        )}

        {/* Class Name */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Class Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Algebra - Linear Equations"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Meeting Link */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Meeting Link</label>
          <input
            type="url"
            name="meeting_link"
            value={formData.meeting_link}
            onChange={handleChange}
            placeholder="https://meet.google.com/class-id"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Date & Time */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Class Date & Time</label>
          <input
            type="datetime-local"
            name="date_time"
            value={formData.date_time}
            onChange={handleChange}
            min={new Date().toISOString().slice(0, 16)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Mode */}
        <div className="mb-6">
          <label className="block font-medium mb-1">Class Mode</label>
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Select Mode --</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/my_classes_tutor")}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 text-white rounded ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-500 hover:bg-teal-600"
            }`}
          >
            {submitting ? "Assigning..." : "Assign Class"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClassForm_Tutor;