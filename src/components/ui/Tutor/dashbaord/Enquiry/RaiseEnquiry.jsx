import React, { useState } from "react";
import { X, Send } from "lucide-react";
import { toast } from "react-toastify";
import { apiClient } from "../../../../../api/apiclient";

const EnquiryModal = ({
  isOpen,
  onClose,
  receiverId,
  receiverName,
  receiverRole,
  receiverSubscription,
}) => {
  const [formData, setFormData] = useState({
    subject: "",
    class: "",
   mode: "online",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
  const newErrors = {};
  if (!formData.subject.trim()) newErrors.subject = "Subject is required";
  if (!formData.class.trim()) newErrors.class = "Class is required";
  if (!formData.mode.trim()) newErrors.mode = "Mode is required";
  return newErrors;
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill all required fields");
      return;
    }

    if (!receiverId) {
      toast.error("Receiver ID is missing. Cannot submit enquiry.");
      return;
    }

    // ✅ Subscription check for Tutor
    if (receiverRole === "tutor" && !receiverSubscription) {
      toast.error(
        "Cannot send enquiry. Tutor does not have an active subscription."
      );
      return;
    }

    const payload = {
      receiver_id: receiverId,
      ...formData,
    };

    setIsSubmitting(true);
    try {
      await apiClient.post("/enquiries", payload);
      toast.success("Enquiry submitted successfully to " + receiverName);
      setFormData({ subject: "", class: "", description: "" });
      setErrors({});
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while submitting the enquiry"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-teal-500 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-semibold text-center text-[#0E2D63] mb-6">
            Raise an Enquiry
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject */}
            <div>
              <label className="block text-[#0E2D63] mb-1 text-sm font-medium">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., Mathematics"
                className={`w-full px-4 py-2 border ${
                  errors.subject ? "border-red-500" : "border-teal-500"
                } rounded-md focus:outline-none focus:ring-2 ${
                  errors.subject ? "focus:ring-red-500" : "focus:ring-teal-500"
                }`}
              />
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
              )}
            </div>

            {/* Class */}
            <div>
              <label className="block text-[#0E2D63] mb-1 text-sm font-medium">
                Class <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="class"
                value={formData.class}
                onChange={handleChange}
                placeholder="e.g., 10"
                className={`w-full px-4 py-2 border ${
                  errors.class ? "border-red-500" : "border-teal-500"
                } rounded-md focus:outline-none focus:ring-2 ${
                  errors.class ? "focus:ring-red-500" : "focus:ring-teal-500"
                }`}
              />
              {errors.class && (
                <p className="text-red-500 text-xs mt-1">{errors.class}</p>
              )}
            </div>

            {/* Mode Selection */}
            <div>
              <label className="block text-[#0E2D63] mb-1 text-sm font-medium">
                Teaching Mode <span className="text-red-500">*</span>
              </label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.mode ? "border-red-500" : "border-teal-500"
                } rounded-md focus:outline-none focus:ring-2 ${
                  errors.mode ? "focus:ring-red-500" : "focus:ring-teal-500"
                }`}
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="both">Both</option>
                {/* <option value="Not specified">Not Specified</option> */}
              </select>
              {errors.mode && (
                <p className="text-red-500 text-xs mt-1">{errors.mode}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Sending..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;



