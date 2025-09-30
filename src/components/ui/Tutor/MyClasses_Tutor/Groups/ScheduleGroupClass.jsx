import React, { useState, useEffect } from "react";
import { groupService } from "../../../../../api/repository/groupService.repository";
import { toast } from "react-toastify";
import { X, Calendar, Video, Users, MapPin, Clock, AlertCircle } from "lucide-react";

export default function ScheduleGroupClass({
  groupId,
  groupType,
  groupName,
  onClose,
  onClassScheduled,
  existingEvents = [],
}) {
  const [meetingLink, setMeetingLink] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [classType, setClassType] = useState("regular");
  const [mode, setMode] = useState("online");
  const [duration, setDuration] = useState("60");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!dateTime) errors.dateTime = "Date and time is required";

    // ✅ Meeting link required only for Online
    if (mode === "online" && !meetingLink) {
      errors.meetingLink = "Meeting link is required for online classes";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedTime = new Date(dateTime).getTime();
    const selectedEndTime = selectedTime + parseInt(duration) * 60 * 1000;

    const conflict = existingEvents.some((evt) => {
      const evtStart = new Date(evt.start).getTime();
      const evtEnd = new Date(evt.end).getTime();
      return selectedTime < evtEnd && selectedEndTime > evtStart;
    });

    if (conflict) {
      toast.error(
        "This time slot conflicts with an existing class. Please choose another time."
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        group_id: String(groupId),
        name: groupName || "Group Class",
        meeting_link: mode === "online" ? meetingLink : "", // ✅ only send if online
        date_time: dateTime,
        duration: parseInt(duration),
        type: classType,
        mode,
      };

      await groupService.scheduleClass(payload);

      toast.success("Class scheduled successfully");
      if (onClassScheduled) onClassScheduled();
      onClose();
    } catch (error) {
      console.error("Error scheduling class:", error);
      if (error.response?.status === 409) {
        toast.error(
          error.response.data.message ||
            "Time slot conflict! Choose another time."
        );
      } else {
        toast.error("Failed to schedule class. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar size={24} />
            Schedule Group Class
          </h2>
          <p className="text-blue-100 mt-1 text-sm">
            Schedule a new class session for your group
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 p-1 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Group Info */}
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 text-gray-700">
            <Users size={18} className="text-blue-600" />
            <span className="font-medium">Group:</span>
            <span className="font-semibold text-gray-900">{groupName}</span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
        >
          {/* ✅ Meeting Link - only for Online */}
          {mode === "online" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Video size={16} className="text-blue-600" />
                Meeting Link (required)
              </label>
              <div
                className={`relative rounded-md ${
                  formErrors.meetingLink ? "border-red-500" : ""
                }`}
              >
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.example.com/room-id"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Video size={18} className="text-gray-400" />
                </div>
              </div>
              {formErrors.meetingLink && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {formErrors.meetingLink}
                </p>
              )}
            </div>
          )}

          {/* Date & Time + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Calendar size={16} className="text-blue-600" />
                Date & Time
              </label>
              <div
                className={`relative rounded-md ${
                  formErrors.dateTime ? "border-red-500" : ""
                }`}
              >
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
              </div>
              {formErrors.dateTime && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {formErrors.dateTime}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Clock size={16} className="text-blue-600" />
                Duration (minutes)
              </label>
              <div className="relative rounded-md">
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                  <option value="60">60 min</option>
                  <option value="90">90 min</option>
                  <option value="120">120 min</option>
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Clock size={18} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Class Type + Mode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Type
              </label>
              <select
                value={classType}
                onChange={(e) => setClassType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="regular">Regular</option>
                <option value="demo">Demo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <MapPin size={16} className="text-blue-600" />
                Mode
              </label>
              <div className="relative">
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MapPin size={18} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar size={18} />
                  Schedule Class
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
