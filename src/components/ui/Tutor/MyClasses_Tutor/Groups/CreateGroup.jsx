import React, { useState } from "react";
import { groupService } from "../../../../../api/repository/groupService.repository";
import { toast } from "react-toastify";

export default function CreateGroup({ onGroupCreated, onClose }) {
  const [groupName, setGroupName] = useState("");
  const [groupType, setGroupType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || !groupType) {
      toast.error("Group name and type are required");
      return;
    }

    try {
      setLoading(true);
      await groupService.createGroup({ name: groupName, type: groupType });
      toast.success("Group created successfully");
      setGroupName("");
      setGroupType("");
      onGroupCreated();
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error(error.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100 relative">
      {/* ✅ Cross button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 
            111.414 1.414L11.414 10l4.293 4.293a1 1 0 
            01-1.414 1.414L10 11.414l-4.293 
            4.293a1 1 0 01-1.414-1.414L8.586 
            10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2 text-blue-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 
            16zm1-11a1 1 0 10-2 0v2H7a1 1 0 
            100 2h2v2a1 1 0 102 0v-2h2a1 1 0 
            100-2h-2V7z"
            clipRule="evenodd"
          />
        </svg>
        Create New Group
      </h2>

      <form onSubmit={handleCreateGroup} className="space-y-4">
        <div>
          <label
            htmlFor="groupName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Group Name
          </label>
          <input
            id="groupName"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="groupType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Group Type
          </label>
          <select
            id="groupType"
            value={groupType}
            onChange={(e) => setGroupType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Select Group Type</option>
            <option value="tutor">Tutor Group</option>
            <option value="student">Student Group</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 
                  0 0 5.373 0 12h4zm2 5.291A7.962 
                  7.962 0 014 12H0c0 3.042 1.135 
                  5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating Group...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 
                  8 8 0 000 16zm1-11a1 1 0 
                  10-2 0v2H7a1 1 0 100 2h2v2a1 
                  1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              Create Group
            </>
          )}
        </button>
      </form>
    </div>
  );
}
