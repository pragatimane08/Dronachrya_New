import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import ClassResolution from "./ClassConflictResolution"; // Import the resolution component

const conflicts = [
  {
    id: 1,
    title: "Math and Physics Overlap",
    message: "Both classes are scheduled for Wednesday",
    time: "Wed (10:00–11:00)",
    resolved: false,
  },
  {
    id: 2,
    title: "Physics and Chemistry Overlap",
    message: "Both classes are scheduled for Tuesday",
    time: "Tue (10:00–11:00)",
    resolved: true,
  },
];

const ConflictList = () => {
  const [showResolution, setShowResolution] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState(null);

  const handleResolveClick = (conflict) => {
    setSelectedConflict(conflict);
    setShowResolution(true);
  };

  const handleCloseResolution = () => {
    setShowResolution(false);
    setSelectedConflict(null);
  };

  if (showResolution) {
    return <ClassResolution onClose={handleCloseResolution} conflict={selectedConflict} />;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">My Classes</h2>
      <p className="text-gray-600 mb-6">
        Welcome back! Resolve Time conflicts of your classes.
      </p>

      <div className="border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-700 mb-4">Scheduling Conflicts</h3>

        {conflicts.map((conflict) => (
          <div
            key={conflict.id}
            className="flex items-center justify-between bg-white border rounded-md p-4 mb-4 shadow-sm"
          >
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">{conflict.title}</h4>
              <p className="text-sm text-red-500 mb-1">{conflict.message}</p>
              <p className="text-sm text-blue-500 underline">{conflict.time}</p>
            </div>

            <div className="flex items-center gap-3">
              {conflict.resolved ? (
                <span className="bg-green-600 text-white px-4 py-1 rounded-md text-sm">
                  Resolved
                </span>
              ) : (
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded-md text-sm hover:bg-red-600"
                  onClick={() => handleResolveClick(conflict)}
                >
                  Resolve Conflict
                </button>
              )}
              <FaEdit className="text-gray-600 cursor-pointer hover:text-blue-600" />
              <FaTrash className="text-red-500 cursor-pointer hover:text-red-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConflictList;