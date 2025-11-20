import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { XMarkIcon } from "@heroicons/react/24/outline";
import "react-toastify/dist/ReactToastify.css";

// ✅ Import API client (assuming same structure as LocationSelector)
import { apiClient } from "../../../../api/apiclient";

export default function ModeSelectionForm() {
  const [selectedModes, setSelectedModes] = useState({ online: false, offline: false });
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Extract everything from previous screen
  const {
    placeId,
    address,
    selectedModes: prevSelectedModes,
    studentProfile, // ✅ profile JSON if passed earlier
  } = location.state || {};

  // ✅ Restore previously selected modes
  useEffect(() => {
    if (prevSelectedModes) {
      setSelectedModes({
        online: prevSelectedModes.includes("online"),
        offline: prevSelectedModes.includes("offline"),
      });
    }
  }, [prevSelectedModes]);

  // ✅ Handle missing location
  if (!placeId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-md shadow-md max-w-md border border-gray-300">
          <p className="text-center text-base md:text-lg text-red-600 font-semibold">
            Missing location data. Please go back and select your location again.
          </p>
        </div>
      </div>
    );
  }

  // ✅ Toggle selection
  const toggleOption = (mode) => {
    setSelectedModes((prev) => ({ ...prev, [mode]: !prev[mode] }));
  };

  // ✅ Save & Continue
  const handleSaveAndContinue = async () => {
    const selected = Object.keys(selectedModes).filter((key) => selectedModes[key]);
    if (!selected.length) {
      toast.warning("Please select at least one option.");
      return;
    }

    // ✅ Normalize into ["Online", "Offline"]
    const updatedModes = selected.map((m) => (m === "online" ? "Online" : "Offline"));

    // ✅ Example student profile JSON (fallback if not passed earlier)
    const profile = studentProfile || {
      name: "Pragati Mane",
      class: "11",
      subjects: ["Maths", "Science"],
      class_modes: ["Online", "Offline"],
      profile_photo: "https://example.com/photo.jpg",
      languages: [{ language: "English", proficiency: "Fluent" }],
      school_name: "Delhi Public School",
      sms_alerts: true,
    };

    try {
      // ✅ Update backend with selected modes
      await apiClient.put("/profile/student", { class_modes: updatedModes });
      toast.success("Class mode updated successfully!");

      setTimeout(() => {
        navigate("/student-dashboard", {
          state: {
            placeId,
            address,
            selectedModes: selected,
            studentProfile: {
              ...profile,
              class_modes: updatedModes,
            },
          },
        });
      }, 800);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to update class mode. Try again.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md border border-gray-300 relative">

        {/* ✅ Cross Button Top Right */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/")}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <XMarkIcon className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* ✅ Title */}
        <h2 className="text-center text-xl md:text-2xl font-semibold text-blue-900 mb-6">
          Select Your Mode
        </h2>

        {/* ✅ Mode Selection */}
        <div className="space-y-3 mb-8">
          <label className="block border px-3 py-2 rounded shadow-sm flex justify-between items-center cursor-pointer">
            <span className="text-base md:text-lg">Online Classes</span>
            <input
              type="checkbox"
              className="w-4 h-4 accent-[#35BAA3]"
              checked={selectedModes.online}
              onChange={() => toggleOption("online")}
            />
          </label>

          <label className="block border px-3 py-2 rounded shadow-sm flex justify-between items-center cursor-pointer">
            <span className="text-base md:text-lg">Offline Classes</span>
            <input
              type="checkbox"
              className="w-4 h-4 accent-[#35BAA3]"
              checked={selectedModes.offline}
              onChange={() => toggleOption("offline")}
            />
          </label>
        </div>

        {/* ✅ Bottom Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-1/2 bg-[#35BAA3] text-white font-semibold text-base md:text-lg px-6 py-2 rounded hover:opacity-90 transition"
          >
            Back
          </button>

          <button
            onClick={handleSaveAndContinue}
            className="w-1/2 bg-[#35BAA3] text-white font-semibold text-base md:text-lg px-6 py-2 rounded hover:opacity-90 transition"
          >
            Save & Continue
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
