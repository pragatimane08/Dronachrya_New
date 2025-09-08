import React, { useState, useEffect } from "react";
import { groupService } from "../../../../../api/repository/groupService";
import { toast } from "react-toastify";

export default function ScheduleGroupClass({
  groupId,
  groupType,
  groupName,   // ✅ passed from parent
  onClose,
  onClassScheduled,
}) {
  const [tutorId, setTutorId] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [classType, setClassType] = useState("regular");
  const [mode, setMode] = useState("online");
  const [loading, setLoading] = useState(false);

  const [tutors, setTutors] = useState([]);

  // ✅ fetch tutors only if student is scheduling
  useEffect(() => {
    const fetchTutors = async () => {
      if (groupType !== "student") return;
      try {
        const res = await groupService.getAvailableTutors?.();
        if (res?.data) setTutors(res.data);
      } catch (err) {
        console.error("Error fetching tutors:", err);
      }
    };
    fetchTutors();
  }, [groupType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dateTime) {
      toast.error("Date/time is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        group_id: String(groupId),
        name: groupName || "Group Class",   // ✅ always use group name
        tutor_id: groupType === "student" ? tutorId : undefined,
        meeting_link: meetingLink || "",
        date_time: dateTime,
        type: classType,
        mode,
      };

      await groupService.scheduleClass(payload);

      toast.success("Class scheduled successfully");
      if (onClassScheduled) onClassScheduled();
      onClose();
    } catch (error) {
      console.error("Error scheduling class:", error);
      toast.error(error.response?.data?.message || "Failed to schedule class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Schedule Group Class</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          {/* ✅ Show group name instead of asking again */}
          <p className="text-gray-700 font-medium">
            Class will be scheduled for: <span className="font-bold">{groupName}</span>
          </p>

          {groupType === "student" && (
            <select
              value={tutorId}
              onChange={(e) => setTutorId(e.target.value)}
              className="border rounded px-4 py-2"
            >
              <option value="">Select Tutor</option>
              {tutors.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          )}

          <input
            type="url"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="Meeting Link (optional)"
            className="border rounded px-4 py-2"
          />

          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="border rounded px-4 py-2"
          />

          <select
            value={classType}
            onChange={(e) => setClassType(e.target.value)}
            className="border rounded px-4 py-2"
          >
            <option value="regular">Regular</option>
            <option value="demo">Demo</option>
          </select>

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="border rounded px-4 py-2"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Scheduling..." : "Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}