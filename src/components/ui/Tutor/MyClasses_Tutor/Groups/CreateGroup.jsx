import React, { useState } from 'react';
import { groupService } from '../../../../../api/repository/groupService';
import { toast } from 'react-toastify';

export default function CreateGroup({ onGroupCreated }) {
  const [groupName, setGroupName] = useState('');
  const [groupType, setGroupType] = useState(''); // ✅ Added type
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || !groupType) {
      toast.error('Group name and type are required');
      return;
    }

    try {
      setLoading(true);
      await groupService.createGroup({ name: groupName, type: groupType }); // ✅ send type also
      toast.success('Group created successfully');
      setGroupName('');
      setGroupType('');
      onGroupCreated(); // Refresh the list
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error(error.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreateGroup} className="mb-4 flex flex-col gap-3">
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Enter group name"
        className="border rounded px-4 py-2 w-full"
      />

      <select
        value={groupType}
        onChange={(e) => setGroupType(e.target.value)}
        className="border rounded px-4 py-2 w-full"
      >
        <option value="">Select Type</option>
        <option value="tutor">Tutor Group</option>
        <option value="student">Student Group</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Group'}
      </button>
    </form>
  );
}