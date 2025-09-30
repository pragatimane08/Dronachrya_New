// src/pages/student/classes/ScheduleClassForm_Student.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../../api/apiclient";
import { classRepository } from "../../../../api/repository/class.repository";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiX } from "react-icons/fi";

const ScheduleClassForm_Student = () => {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    tutor_id: "",
    tutor_name: "",
    name: "",
    meeting_link: "",
    date_time: "",
    mode: "",
  });

  // ✅ Fetch tutors
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await apiClient.get("/users?role=tutor");
        const tutorList =
          res.data?.data?.map((tutor) => ({
            id: tutor.id,
            name: tutor.name || tutor.email || tutor.mobile_number,
          })) || [];
        setTutors(tutorList);
      } catch (err) {
        console.error("❌ Failed to fetch tutors:", err);
        toast.error("Unable to fetch tutors");
      } finally {
        setLoadingTutors(false);
      }
    };
    fetchTutors();
  }, []);

  // ✅ Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "tutor_id") {
      const selectedTutor = tutors.find((t) => t.id === value);
      setFormData((prev) => ({
        ...prev,
        tutor_id: value,
        tutor_name: selectedTutor ? selectedTutor.name : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tutor_id ||
      !formData.tutor_name ||
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
        tutor_id: formData.tutor_id,
        tutor_name: formData.tutor_name,
        name: formData.name,
        meeting_link: formData.meeting_link,
        date_time: selectedDate.toISOString(),
        type: "regular",
        mode: formData.mode,
      };

      const res = await classRepository.createClass(payload);
      console.log("✅ API Response:", res);

      toast.success("Class scheduled successfully!");
      setTimeout(() => {
        navigate("/student_classes", { state: { refresh: true } });
      }, 1500);
    } catch (err) {
      console.error("❌ Submit error:", err);
      toast.error(err?.response?.data?.message || "Failed to schedule class");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="relative bg-white border rounded-lg shadow w-full max-w-md">
        {/* Header Bar */}
        <div className="bg-teal-500 text-white flex items-center justify-between px-4 py-2 rounded-t-lg">
          <h2 className="text-lg font-semibold">Schedule Class</h2>
          <button
            type="button"
            onClick={() => navigate("/my_classes_student")}
            className="text-white hover:text-gray-200"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Select Tutor */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Select Tutor</label>
            <select
              name="tutor_id"
              value={formData.tutor_id}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <option value="">
                {loadingTutors ? "Loading tutors..." : "-- Select Tutor --"}
              </option>
              {tutors.map((tutor) => (
                <option key={tutor.id} value={tutor.id}>
                  {tutor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Class Name */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Class Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Physics - Motion"
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

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 text-white rounded ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-teal-500 hover:bg-teal-600"
              }`}
            >
              {submitting ? "Scheduling..." : "Schedule Class"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ScheduleClassForm_Student;
