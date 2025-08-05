// src/components/ui/admin/dashboard/NotificationForm.jsx
import React, { useState } from "react";
import { notificationRepository } from "../../../../api/repository/admin/notificationApi";

const NotificationForm = ({ onClose, onSuccess }) => {
  const [mode, setMode] = useState("single");
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    user_id: "",
    role: "student",
    type: "sms",
    template_name: "",
    content: "",
    filter: { class: "" },
  });

  const handleChange = (key, value) => {
    setPayload((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterChange = (key, value) => {
    setPayload((prev) => ({
      ...prev,
      filter: { ...prev.filter, [key]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "single" && !payload.user_id) {
      alert("User ID is required for single notifications.");
      return;
    }

    if (!payload.template_name || !payload.content) {
      alert("Template name and message content are required.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "single") {
     await notificationRepository.sendSingle({
  user_id: payload.user_id,
  type: payload.type,
  template_name: payload.template_name,
  content: { message: payload.content },
  formatted: true
});
      } else {
        const isTutor = payload.role === "tutor";
        const filter = isTutor && payload.filter.class
          ? { classes: [payload.filter.class] }
          : {};

        await notificationRepository.sendBulk({
          role: payload.role,
          type: payload.type,
          template_name: payload.template_name,
          content: { message: payload.content },
          filter,
        });
      }

      onSuccess?.();
    } catch (err) {
      console.error("❌ Failed to send notification:", err);
      alert("Failed to send notification. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Send Notification</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Mode */}
          <div>
            <label className="block text-sm font-medium mb-1">Mode</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="single">Single User</option>
              <option value="bulk">Bulk (by Role / Filter)</option>
            </select>
          </div>

          {/* Single User ID or Bulk Filters */}
          {mode === "single" ? (
            <div>
              <label className="block text-sm font-medium mb-1">User ID</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={payload.user_id}
                onChange={(e) => handleChange("user_id", e.target.value)}
                placeholder="Enter User ID"
                required
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={payload.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="tutor">Tutor</option>
                </select>
              </div>

              {payload.role === "tutor" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Class</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={payload.filter.class}
                    onChange={(e) => handleFilterChange("class", e.target.value)}
                    placeholder="e.g. 11"
                  />
                </div>
              )}
            </>
          )}

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={payload.type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>

          {/* Template Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Template Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={payload.template_name}
              onChange={(e) => handleChange("template_name", e.target.value)}
              placeholder="e.g. Weekly Update"
              required
            />
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={4}
              value={payload.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Write your message..."
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border text-gray-600"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationForm;
