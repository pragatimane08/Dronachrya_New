import React, { useEffect, useState } from "react";
import { groupService } from "../../../../../api/repository/groupService";
import AddMembersModal from "./AddMembersModal";
import ScheduleGroupClass from "./ScheduleGroupClass";

export default function MyGroups() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const fetchGroups = async () => {
    try {
      const res = await groupService.getUserGroups();
      setGroups(res.groups || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleOpenMembers = (groupId, groupType, groupName) => {
    setSelectedGroup({ groupId, groupType, groupName });
    setIsMembersModalOpen(true);
  };

  const handleOpenSchedule = (groupId, groupType, groupName) => {
    setSelectedGroup({ groupId, groupType, groupName });
    setIsScheduleModalOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Groups</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="border rounded-lg p-4 shadow bg-white"
          >
            <h2 className="text-lg font-semibold">{group.name}</h2>
            <p className="text-sm text-gray-600">{group.type}</p>

            <div className="mt-2">
              <h3 className="font-medium">Members:</h3>
              <ul className="list-disc pl-5 text-sm">
                {group.members?.map((m) => (
                  <li key={`${group.id}-${m.id}`}>
                    {m.name} ({m.role})
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() =>
                  handleOpenMembers(group.id, group.type, group.name)
                }
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Add Members
              </button>
              <button
                onClick={() =>
                  handleOpenSchedule(group.id, group.type, group.name)
                }
                className="bg-teal-600 text-white px-3 py-1 rounded"
              >
                Schedule Class
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Members Modal */}
      {isMembersModalOpen && selectedGroup && (
        <AddMembersModal
          groupId={selectedGroup.groupId}
          groupType={selectedGroup.groupType}
          onClose={() => setIsMembersModalOpen(false)}
          onMembersAdded={fetchGroups}
        />
      )}

      {/* Schedule Class Modal */}
      {isScheduleModalOpen && selectedGroup && (
        <ScheduleGroupClass
          groupId={selectedGroup.groupId}
          groupType={selectedGroup.groupType}
          groupName={selectedGroup.groupName} // ✅ auto-pass group name
          onClose={() => setIsScheduleModalOpen(false)}
          onClassScheduled={fetchGroups}
        />
      )}
    </div>
  );
}
