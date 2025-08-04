import React from "react";
import { IoClose } from "react-icons/io5";

const ClassResolution = ({ onClose, conflict }) => {
  return (
    <div className="min-h-screen bg-white px-6 py-8">
      <h1 className="text-2xl font-extrabold text-black mb-1">My Classes</h1>
      <p className="text-sm text-gray-600 mb-4">
        Welcome back! Resolve Time conflicts of your classes.
      </p>

      <div className="relative max-w-2xl bg-white p-6 rounded-md">
        {/* Close Icon */}
        <button
          className="absolute top-3 left-3 bg-purple-100 hover:bg-purple-200 text-purple-600 w-7 h-7 flex items-center justify-center rounded-full"
          onClick={onClose}
        >
          <IoClose size={16} />
        </button>

        <h2 className="text-md font-semibold text-gray-900 ml-10 mb-6">Resolution</h2>

        {/* Conflict Details */}
        <div className="ml-10 space-y-6">
          <div>
            <p className="text-sm font-bold text-black">Math</p>
            <p className="text-sm text-gray-700">
              Dr. Johnson. <span className="text-blue-600 underline">Wed (11:00–12:00)</span>
            </p>
          </div>

          <div>
            <p className="text-sm font-bold text-black">Physics</p>
            <p className="text-sm text-gray-700">
              Dr. Singh. <span className="text-blue-600 underline">{conflict?.time}</span>
            </p>
          </div>
        </div>

        {/* Resolve Button */}
        <div className="flex justify-center mt-10">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium transition">
            Resolve
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassResolution;