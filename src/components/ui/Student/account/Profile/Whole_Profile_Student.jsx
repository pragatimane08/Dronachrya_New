import React, { useState, useEffect } from "react";
import {
  getProfile,
  updateStudentProfile,
  updateUserContact,
  updateLocation,
  uploadProfilePhoto,
} from "../../../../../api/repository/profile.repository";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LocationSearch from "./LocationSearch"; // ✅ Import LocationSearch

const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const validateMobile = (m) => /^[0-9]{10}$/.test(m);

const Whole_Profile_student = () => {
  const [profile, setProfile] = useState(null);
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const p = await getProfile();
        setProfile({
          photo: p.profile_photo || "/default/photo.jpg",
          name: p.name || "",
          email: p.User?.email || "",
          mobile: p.User?.mobile_number || "",
          class: p.class || "",
          subjects: (p.subjects || []).join(", "),
          school_name: p.school_name || "",
          class_modes: p.class_modes || [],
          sms_alerts: p.sms_alerts ?? true,
          languages: p.languages || [], // ✅ array of objects { language, proficiency }
          location: p.Location?.city || "",
        });
        toast.success("Profile loaded");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      }
    })();
  }, []);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
    try {
      const res = await uploadProfilePhoto(file);
      const uploadedUrl = res?.photoUrl || URL.createObjectURL(file);
      setProfile((p) => ({ ...p, photo: uploadedUrl }));
      toast.success("Photo updated");
    } catch {
      toast.error("Photo update failed");
    }
  };

  const handleSave = async (field, overrideValue = null) => {
    const value = overrideValue !== null ? overrideValue : tempValue;
    try {
      if (field === "email" && !validateEmail(value)) throw new Error("Invalid email");
      if (field === "mobile" && !validateMobile(value)) throw new Error("Invalid mobile");

      if (field === "email" || field === "mobile") {
        await updateUserContact(field === "mobile" ? "mobile_number" : field, value);
      } else if (field === "location") {
        if (!value.place_id) throw new Error("Invalid location");
        await updateLocation(value.place_id);
        setProfile((p) => ({ ...p, location: value.name }));
        setEditField(null);
        toast.success("Location updated");
        return;
      } else {
        const payload = {};
        if (field === "subjects") {
          payload.subjects = value.split(",").map((s) => s.trim());
        } else if (field === "languages") {
          payload.languages = value; // ✅ array of objects
        } else {
          payload[field] = value;
        }
        await updateStudentProfile(payload);
      }

      setProfile((p) => ({ ...p, [field]: value }));
      setEditField(null);
      toast.success(`${field.replace("_", " ")} updated`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update ${field}`);
    }
  };

  const handleClassModeToggle = async (mode) => {
    const updatedModes = profile.class_modes.includes(mode)
      ? profile.class_modes.filter((m) => m !== mode)
      : [...profile.class_modes, mode];
    setProfile((prev) => ({ ...prev, class_modes: updatedModes }));
    await updateStudentProfile({ class_modes: updatedModes });
    toast.success("Class mode updated");
  };

  const handleSMSAlertToggle = async () => {
    const updated = !profile.sms_alerts;
    setProfile((prev) => ({ ...prev, sms_alerts: updated }));
    await updateStudentProfile({ sms_alerts: updated });
    toast.success("SMS preference updated");
  };

  if (!profile) return <div className="p-10 text-center">Loading...</div>;

  const editableFields = [
    { label: "Full Name", field: "name" },
    { label: "Email", field: "email" },
    { label: "Mobile Number", field: "mobile" },
    { label: "Class", field: "class" },
    { label: "Subjects (comma separated)", field: "subjects" },
    { label: "School Name", field: "school_name" },
    // Location handled separately
  ];

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-4">Student Profile</h2>

      {/* Profile Photo */}
      <div className="bg-teal-100 p-4 rounded-lg mb-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border bg-white shrink-0">
          <img src={photoPreview || profile.photo} alt="Profile" className="w-full h-full object-cover" />
          <label className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
            <span className="text-white text-xs">Change</span>
          </label>
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold break-words">{profile.name}</h3>
          <p className="text-sm text-gray-500">{profile.location || "Unknown Location"}</p>
        </div>
      </div>

      {/* Editable Fields */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {editableFields.map(({ label, field }) => (
            <div key={field} className="bg-white p-4 rounded shadow border break-words">
              <label className="block text-sm text-gray-600 mb-1">{label}</label>
              {editField === field ? (
                <>
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => handleSave(field)} className="px-4 py-1 bg-green-500 text-white rounded">
                      Save
                    </button>
                    <button onClick={() => setEditField(null)} className="px-4 py-1 bg-gray-300 text-gray-700 rounded">
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center gap-2">
                  <span className="truncate">{profile[field] || "Not specified"}</span>
                  <button
                    onClick={() => {
                      setEditField(field);
                      setTempValue(profile[field]);
                    }}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Location Search Field */}
          <div className="bg-white p-4 rounded shadow border break-words">
            <label className="block text-sm text-gray-600 mb-1">City</label>
            {editField === "location" ? (
              <>
                <LocationSearch
                  value={profile.location}
                  onSelect={(loc) => {
                    setTempValue(loc); // { name, place_id, city }
                  }}
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => {
                      if (!tempValue?.place_id) {
                        toast.error("Please select a valid location");
                        return;
                      }
                      handleSave("location", tempValue);
                    }}
                    className="px-4 py-1 bg-green-500 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditField(null)}
                    className="px-4 py-1 bg-gray-300 text-gray-700 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center gap-2">
                <span className="truncate">{profile.location || "Not specified"}</span>
                <button
                  onClick={() => {
                    setEditField("location");
                    setTempValue({ name: profile.location, place_id: "" });
                  }}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-blue-50 mt-6 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Preferences</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Class Modes</h4>
            {["online", "offline"].map((mode) => (
              <label
                key={mode}
                className="flex items-center justify-between bg-white p-3 rounded border mb-2"
              >
                <span className="capitalize">{mode} Classes</span>
                <input
                  type="checkbox"
                  checked={profile.class_modes.includes(mode)}
                  onChange={() => handleClassModeToggle(mode)}
                />
              </label>
            ))}
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Notifications</h4>
            <label className="flex items-center justify-between bg-white p-3 rounded border">
              <span>SMS Alerts</span>
              <input
                type="checkbox"
                checked={profile.sms_alerts}
                onChange={handleSMSAlertToggle}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="bg-white mt-6 p-4 rounded shadow">
        <label className="block font-semibold mb-2">Languages Spoken</label>
        {editField === "languages" ? (
          <>
            <textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder="Enter languages line by line:\nEnglish (Fluent)\nHindi (Intermediate)"
              className="border p-2 w-full h-32"
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => {
                  const parsed = tempValue
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((line) => {
                      const match = line.match(/^(.*?)\s*\((.*?)\)$/);
                      if (match) {
                        return { language: match[1].trim(), proficiency: match[2].trim() };
                      }
                      return { language: line, proficiency: "Fluent" };
                    });
                  handleSave("languages", parsed);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditField(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-between items-start">
            <ul className="list-disc ml-6 break-words">
              {Array.isArray(profile.languages) && profile.languages.length > 0 ? (
                profile.languages.map((lang, i) => (
                  <li key={i}>
                    {lang.language} {lang.proficiency ? `(${lang.proficiency})` : ""}
                  </li>
                ))
              ) : (
                <li>No languages specified</li>
              )}
            </ul>
            <button
              onClick={() => {
                const editableString = (profile.languages || [])
                  .map((l) => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`)
                  .join("\n");
                setEditField("languages");
                setTempValue(editableString);
              }}
              className="text-blue-600 hover:underline"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Whole_Profile_student;
