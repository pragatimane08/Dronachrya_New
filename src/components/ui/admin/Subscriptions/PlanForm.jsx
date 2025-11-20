import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import PlanForm from "./PlanForm";
import { toast } from "react-toastify";

const PlanModal = ({ title, plan, setPlan, onClose, onSave }) => {
  const handleSave = async () => {
    try {
      await onSave();
      toast.success("Plan saved successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to save plan. Please try again.");
      console.error("Save plan error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg relative overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button
              className="text-white hover:text-blue-100 transition-colors"
              onClick={onClose}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <PlanForm plan={plan} setPlan={setPlan} />
          
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 mr-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:shadow-md transition-all"
            >
              Save Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanModal;