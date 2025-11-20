import React, { useEffect, useState } from "react";
import { groupService } from "../../../../../api/repository/groupService.repository";
import AddMembersModal from "./AddMembersModal";
import ScheduleGroupClass from "./ScheduleGroupClass";

export default function MyGroups() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await groupService.getUserGroups();
      setGroups(res.groups || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
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

  const getGroupTypeColor = (type) => {
    switch (type) {
      case 'tutor':
        return 'bg-purple-100 text-purple-800';
      case 'student':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Groups</h1>
          <p className="text-gray-600 mt-1">Manage your groups and schedule classes</p>
        </div>
        <button
          onClick={fetchGroups}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mt-4">No groups yet</h3>
          <p className="text-gray-500 mt-2">Create your first group to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 truncate">{group.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getGroupTypeColor(group.type)}`}>
                    {group.type}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {group.members?.length || 0} members
                  </div>
                  
                  {group.members && group.members.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700">Members:</h4>
                      <div className="flex flex-wrap gap-1">
                        {group.members.slice(0, 3).map((m) => (
                          <span key={`${group.id}-${m.id}`} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {m.name}
                          </span>
                        ))}
                        {group.members.length > 3 && (
                          <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">
                            +{group.members.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenMembers(group.id, group.type, group.name)}
                    className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Members
                  </button>
                  <button
                    onClick={() => handleOpenSchedule(group.id, group.type, group.name)}
                    className="flex-1 flex items-center justify-center gap-1 bg-teal-500 text-white px-3 py-2 rounded-lg hover:bg-teal-600 transition-colors text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
          groupName={selectedGroup.groupName}
          onClose={() => setIsScheduleModalOpen(false)}
          onClassScheduled={fetchGroups}
        />
      )}
    </div>
  );
}