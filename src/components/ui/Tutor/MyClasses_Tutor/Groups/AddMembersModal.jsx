import React, { useEffect, useState } from "react";
import { apiClient } from "../../../../../api/apiclient";
import { groupService } from "../../../../../api/repository/groupService.repository";
import { toast } from "react-toastify";

const AddMembersModal = ({ groupId, groupType, onClose, onMembersAdded }) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch available users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const endpoint =
          groupType === "tutor" ? "/users?role=tutor" : "/users?role=student";

        const res = await apiClient.get(endpoint);

        // ✅ FIX: backend returns { data: [...] }
        const users = res?.data?.data || [];
        const userList = users.map((u) => ({
          id: String(u.id),
          name: u.name || u.email || "Unnamed",
          email: u.email || "",
        }));

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

  // Filter users based on search term
  const filteredUsers = availableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full p-1"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h2 className="text-xl font-bold pr-8">Add Members</h2>
          <p className="text-sm opacity-90">Select members to add to your group</p>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <form onSubmit={handleSubmit}>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                {searchTerm ? "No users match your search" : "No users available"}
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg divide-y">
                {filteredUsers.map((u) => (
                  <label
                    key={u.id}
                    className="flex items-center p-3 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        value={u.id}
                        checked={selectedIds.includes(u.id)}
                        onChange={(e) =>
                          handleCheckboxChange(u.id, e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{u.name}</span>
                      <span className="text-xs text-gray-500">{u.email}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || selectedIds.length === 0}
                className={`px-4 py-2 rounded-lg text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  selectedIds.length === 0 || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : (
                  `Add ${selectedIds.length} Member${selectedIds.length !== 1 ? 's' : ''}`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMembersModal;