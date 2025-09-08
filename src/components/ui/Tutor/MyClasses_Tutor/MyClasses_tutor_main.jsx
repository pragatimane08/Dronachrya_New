import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { apiClient } from "../../../../api/apiclient";
import { groupService } from "../../../../api/repository/groupService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddMembersModal from "../../Tutor/MyClasses_Tutor/Groups/AddMembersModal";
import ScheduleGroupClass from "../../Tutor/MyClasses_Tutor/Groups/ScheduleGroupClass"; 

const MyClasses = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupType, setGroupType] = useState("");
  const [loadingGroupCreate, setLoadingGroupCreate] = useState(false);

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedGroupType, setSelectedGroupType] = useState(null);
  const [selectedGroupName, setSelectedGroupName] = useState(null); // ✅ NEW

  // ✅ Fetch classes
  const fetchClassesFromAPI = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) return console.error("User ID not found");

      const res = await apiClient.get("/classes", { params: { user_id: userId } });
      const classData = res.data.classes || [];

      const formatted = classData.map((cls) => {
        const isDemo = cls.type === "demo" || (!!cls.Student || !!cls.student_name);
        return {
          id: cls.id,
          title: isDemo ? "Demo Class" : "Regular Class",
          date: cls.date_time?.split("T")[0],
          extendedProps: {
            name: cls.name || cls.title || "Class",
            student: cls.Student?.name || cls.student_name || "N/A",
            tutor: cls.Tutor?.name || cls.tutor_name || "N/A",
            subject: cls.subject || "N/A",
            status: cls.status || "Scheduled",
            type: isDemo ? "demo" : "regular",
            zoomLink: cls.zoom_link || "#",
            mode: cls.mode || "online",
            time: cls.date_time
              ? new Date(cls.date_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "N/A",
          },
        };
      });

      setEvents(formatted);
      toast.success("Classes loaded successfully");
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to load classes");
    }
  };

  // ✅ Fetch groups
  const fetchGroups = async () => {
    try {
      setLoadingGroups(true);
      const res = await groupService.getUserGroups();
      setGroups(res?.data?.groups || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Failed to load groups");
    } finally {
      setLoadingGroups(false);
    }
  };

  useEffect(() => {
    fetchClassesFromAPI();
    fetchGroups();
  }, []);

  // ✅ Handle Create Group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || !groupType) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setLoadingGroupCreate(true);
      await groupService.createGroup({ name: groupName, type: groupType });
      toast.success("Group created successfully");
      setShowCreateGroupModal(false);
      setGroupName("");
      setGroupType("");
      fetchGroups();
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error(error.response?.data?.message || "Failed to create group");
    } finally {
      setLoadingGroupCreate(false);
    }
  };

  return (
    <div className="p-3 sm:p-6 bg-white min-h-screen">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="bg-white rounded-lg shadow p-2 sm:p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
          customButtons={{
            addClass: {
              text: "+Add",
              click: () => navigate("/add-class-form-tutor"),
            },
            createGroup: {
              text: "Create Group",
              click: () => setShowCreateGroupModal(true),
            },
          }}
          headerToolbar={{
            left: "title",
            center: "",
            right: "prev today next addClass createGroup",
          }}
        />
      </div>

      {/* ✅ Groups Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">My Groups</h2>
        {loadingGroups ? (
          <p>Loading groups...</p>
        ) : groups.length === 0 ? (
          <p>No groups created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="border rounded-lg p-4 shadow hover:shadow-lg"
              >
                <h3 className="text-lg font-semibold">{group.name}</h3>
                <p className="text-gray-500 capitalize">{group.type}</p>

                {/* ✅ Show Members */}
                <div className="mt-2">
                  <h4 className="text-sm font-medium mb-1">Members:</h4>
                  {group.members && group.members.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-700 max-h-20 overflow-y-auto">
                      {group.members.map((m) => (
                        <li key={`${group.id}-${m.id}`}>
                          {m.name} ({m.role})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm">No members yet</p>
                  )}
                </div>

                {/* ✅ Action Buttons */}
                <div className="flex gap-2 mt-3">
                  <>
                    <button
                      onClick={() => {
                        setSelectedGroupId(group.id);
                        setSelectedGroupType(group.type);
                        setSelectedGroupName(group.name); // ✅ save group name
                        setShowAddMemberModal(true);
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Add Members
                    </button>

                    <button
                      onClick={() => {
                        setSelectedGroupId(group.id);
                        setSelectedGroupType(group.type);
                        setSelectedGroupName(group.name); // ✅ save group name
                        setShowScheduleModal(true);
                      }}
                      className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700"
                    >
                      Schedule Class
                    </button>
                  </>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Create Group Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Create Group</h2>
            <form onSubmit={handleCreateGroup} className="flex flex-col gap-3">
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
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingGroupCreate}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {loadingGroupCreate ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Add Members Modal */}
      {showAddMemberModal && (
        <AddMembersModal
          groupId={selectedGroupId}
          groupType={selectedGroupType}
          onClose={() => setShowAddMemberModal(false)}
          onMembersAdded={fetchGroups}
        />
      )}

      {/* ✅ Schedule Class Modal */}
      {showScheduleModal && (
        <ScheduleGroupClass
          groupId={selectedGroupId}
          groupType={selectedGroupType}
          groupName={selectedGroupName} // ✅ pass group name
          onClose={() => setShowScheduleModal(false)}
          onClassScheduled={fetchClassesFromAPI}
        />
      )}
    </div>
  );
};

export default MyClasses;