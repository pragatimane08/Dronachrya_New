import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiClient } from "../../../../api/apiclient";
import { classRepository } from "../../../../api/repository/class.repository";

const AddClassForm_Tutor = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    student_id: "",
    subject: "",
    grade: "",
    description: "",
    date_time: "",
    zoom_link: "",
    mode: "online", // Default mode
  });

  const tutor_id = localStorage.getItem("user_id");

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
      } catch (err) {
        console.error("Failed to fetch students:", err);
        toast.error("Unable to fetch students");
      }
    };

    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.student_id || !formData.subject || !formData.date_time || !tutor_id) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      await classRepository.createClass({
        name: formData.subject,
        tutor_id,
        student_id: formData.student_id,
        description: formData.description,
        date_time: formData.date_time,
        meeting_link: formData.zoom_link || "https://zoom.us/dummy-link",
        type: "regular",
        mode: formData.mode,
      });


      toast.success("Class assigned successfully!");
      setTimeout(() => {
        navigate("/student_classes");  // This redirects to the dashboard.
      }, 1500); // Delay to ensure the class is assigned first

      setTimeout(() => {
        navigate("/student_classes");
      }, 1500);
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err?.response?.data?.message || "Failed to assign class");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <ToastContainer position="top-right" autoClose={2000} />
      <form
        onSubmit={handleSubmit}
        className="relative bg-white border rounded-lg shadow p-6 w-full max-w-md"
      >
        <button
          type="button"
          onClick={() => navigate("/student_classes")}
          className="absolute top-3 right-4 text-gray-500 text-xl hover:text-red-500"
        >
          &times;
        </button>

        <h2 className="text-lg font-semibold text-center text-blue-900 mb-6">
          Assign Class to Student
        </h2>

        {/* Student Dropdown */}
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
              {students.length === 0 ? "Loading students..." : "-- Select Student --"}
            </option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g., Science"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Grade */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Class</label>
          <input
            type="text"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            placeholder="e.g., 9th, 10th"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Zoom Link */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Class Link</label>
          <input
            type="text"
            name="zoom_link"
            value={formData.zoom_link}
            onChange={handleChange}
            placeholder="https://zoom.us/meeting-link"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Mode */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Class Mode</label>
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Message</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Any notes or instructions?"
            rows={3}
            className="w-full border rounded px-3 py-2"
          ></textarea>
        </div>

        {/* Date & Time */}
        <div className="mb-6">
          <label className="block font-medium mb-1">Class Date & Time</label>
          <input
            type="datetime-local"
            name="date_time"
            value={formData.date_time}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/student_classes")}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition"
          >
            Assign Class
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClassForm_Tutor;
