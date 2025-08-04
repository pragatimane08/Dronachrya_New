import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ModeSelectionForm() {
  const [selectedModes, setSelectedModes] = useState({ online: false, offline: false });
  const navigate = useNavigate();
  const location = useLocation();

  const { placeId, address } = location.state || {};

  if (!placeId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-md shadow-md max-w-md">
          <p className="text-center text-base md:text-lg text-red-600 font-semibold">
            Missing location data. Please go back and select your location again.
          </p>
        </div>
      </div>
    );
  }

  const toggleOption = (mode) => {
    setSelectedModes((prev) => ({ ...prev, [mode]: !prev[mode] }));
  };

  const handleNext = () => {
    const selected = Object.keys(selectedModes).filter((key) => selectedModes[key]);
    if (!selected.length) {
      toast.warning("Please select at least one option.");
      return;
    }

    toast.success("Mode selected successfully!");
    setTimeout(() => {
      navigate("/student-dashboard", {
        state: {
          placeId,
          address,
          selectedModes: selected,
        },
      });
    }, 1000); // Give user time to see the toast
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md border border-gray-300">
        <h2 className="text-center text-xl md:text-2xl font-semibold text-blue-900 mb-4">
          Create Your Profile
        </h2>

        <p className="text-base md:text-lg font-semibold text-gray-800 mb-4">
          How would you like to attend classes?
        </p>

        <div className="space-y-3 mb-6">
          <label className="block border px-3 py-2 rounded shadow-sm flex justify-between items-center">
            <span className="text-base md:text-lg">Online Classes</span>
            <input
              type="checkbox"
              className="w-4 h-4 accent-[#35BAA3]"
              checked={selectedModes.online}
              onChange={() => toggleOption("online")}
            />
          </label>

          <label className="block border px-3 py-2 rounded shadow-sm flex justify-between items-center">
            <span className="text-base md:text-lg">Offline Classes</span>
            <input
              type="checkbox"
              className="w-4 h-4 accent-[#35BAA3]"
              checked={selectedModes.offline}
              onChange={() => toggleOption("offline")}
            />
          </label>
        </div>

        <div className="text-center">
          <button
            onClick={handleNext}
            className="bg-[#35BAA3] text-white text-base md:text-lg px-6 py-2 rounded hover:opacity-90 transition"
          >
            Next
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}