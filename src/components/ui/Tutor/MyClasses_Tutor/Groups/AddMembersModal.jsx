import React, { useEffect, useState } from "react";
import { apiClient } from "../../../../../api/apiclient";
import { groupService } from "../../../../../api/repository/groupService";
import { toast } from "react-toastify";

const AddMembersModal = ({ groupId, groupType, onClose, onMembersAdded }) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch available users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const endpoint =
          groupType === "tutor" ? "/users?role=tutor" : "/users?role=student";
        const res = await apiClient.get(endpoint);

        const userList =
          res.data?.data?.map((u) => ({
            id: String(u.id),
            name: u.name || u.email || "Unnamed",
          })) || [];

        setAvailableUsers(userList);
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.error("Failed to load users");
      }
    };

    if (groupType) fetchUsers();
  }, [groupType]);

  const handleCheckboxChange = (id, checked) => {
    if (checked) setSelectedIds((prev) => [...prev, id]);
    else setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      toast.error("Please select at least one member");
      return;
    }

    try {
      setLoading(true);
      await groupService.addMembers({
        group_id: String(groupId),
        member_ids: selectedIds,
        role: groupType, // ✅ must be "student" or "tutor"
      });

      toast.success("Members added successfully");
      onMembersAdded(); // refresh list
      onClose();
    } catch (error) {
      console.error("Error adding members:", error);
      toast.error(error.response?.data?.message || "Failed to add members");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Members</h2>
        <form onSubmit={handleSubmit}>
          {availableUsers.length === 0 ? (
            <p className="text-gray-500">No users available</p>
          ) : (
            <div className="max-h-60 overflow-y-auto border p-2 rounded">
              {availableUsers.map((u) => (
                <label
                  key={u.id}
                  className="flex items-center space-x-2 py-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={u.id}
                    checked={selectedIds.includes(u.id)}
                    onChange={(e) => handleCheckboxChange(u.id, e.target.checked)}
                  />
                  <span>{u.name}</span>
                </label>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedIds.length === 0}
              className={`px-4 py-2 rounded text-white ${
                selectedIds.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Adding..." : "Add Members"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMembersModal;