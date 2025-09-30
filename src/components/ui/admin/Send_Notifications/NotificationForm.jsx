import React, { useState, useEffect } from "react";
import Select from "react-select";
import { apiClient } from "../../../../api/apiclient";

const NotificationForm = ({ onClose, onSuccess }) => {
  const [mode, setMode] = useState("single");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [payload, setPayload] = useState({
    role: "student", // ✅ applies for both single & bulk
    type: "sms",
    template_name: "",
    content: "",
    filter: { class: "" }, // ✅ used for bulk
  });

  const handleChange = (key, value) => {
    setPayload((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Fetch users whenever role changes (works for single mode)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const endpoint =
          payload.role === "tutor" ? "/users?role=tutor" : "/users?role=student";

        const res = await apiClient.get(endpoint);

        const usersData = res?.data?.data || [];
        const userList = usersData.map((u) => ({
          value: String(u.id),
          label: u.name || u.email || "Unnamed",
        }));

        setUsers(userList);
      } catch (err) {
        console.error("❌ Error fetching users:", err);
      }
    };

    if (mode === "single") fetchUsers();
  }, [payload.role, mode]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (mode === "single" && !selectedUser) {
    alert("Please select a user");
    return;
  }
  if (!payload.template_name || !payload.content) {
    alert("Template name and message content are required.");
    return;
  }

  setLoading(true);
  try {
    if (mode === "single") {
      await apiClient.post("/admin/users/send-message", {
        role: payload.role,
        user_id: selectedUser.value,
        name: selectedUser.label,
        type: payload.type,
        template_name: payload.template_name,
        content: { message: payload.content },
        formatted: true,
      });
    } else {
      let filter = {};
      if (payload.filter.class && payload.filter.class.trim() !== "") {
        // ✅ Different filter format for students and tutors
        filter =
          payload.role === "tutor"
            ? { classes: [payload.filter.class] }
            : { class: payload.filter.class };
      }

      await apiClient.post("/admin/users/send-bulk-message", {
        role: payload.role,
        type: payload.type,
        template_name: payload.template_name,
        content: { message: payload.content },
        filter,
        formatted: true,
      });
    }

    onSuccess?.();
    setSelectedUser(null);
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
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
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
              <option value="bulk">Bulk</option>
            </select>
          </div>

          {/* Role (applies to both single & bulk) */}
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

          {/* Single User select */}
          {mode === "single" && (
            <div>
              <label className="block text-sm font-medium mb-1">Select User</label>
              <Select
                options={users}
                value={selectedUser}
                onChange={setSelectedUser}
                placeholder="Search or select user..."
                isClearable
                isSearchable
              />
            </div>
          )}

          {/* Bulk class filter (applies for both student & tutor) */}
          {mode === "bulk" && (
            <div>
              <label className="block text-sm font-medium mb-1">Class Filter</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={payload.filter.class}
                onChange={(e) =>
                  setPayload((prev) => ({
                    ...prev,
                    filter: { ...prev.filter, class: e.target.value },
                  }))
                }
                placeholder="Enter class name"
              />
            </div>
          )}

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={payload.type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              <option value="sms">SMS</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>

          {/* Template */}
          <div>
            <label className="block text-sm font-medium mb-1">Template Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={payload.template_name}
              onChange={(e) => handleChange("template_name", e.target.value)}
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows="4"
              value={payload.content}
              onChange={(e) => handleChange("content", e.target.value)}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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

