import React, { useState, useEffect } from "react";
import {
  getProfile,
  updateTutorProfile,
  updateUserContact,
  updateLocation,
  uploadProfilePhoto,
  uploadTutorDocuments,
} from "../../../../../api/repository/profile.repository";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LocationSearch from "./LocationSearch";

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateMobile = (mobile) => /^[0-9]{10}$/.test(mobile);

const Whole_Profile_tutor = () => {
  const [profile, setProfile] = useState(null);
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        const languagesSpoken = (data.languages || [])
          .map((item) => `${item.language}:${item.proficiency}`)
          .join(", ");

        setProfile({
          photo: data?.profile_photo
            ? `${data.profile_photo}?t=${Date.now()}`
            : "/default/photo.jpg",
          name: data.name || "",
          email: data.User?.email || "",
          mobile: data.User?.mobile_number || "",
          subjects: (data.subjects || []).join(", "),
          classes: (data.classes || []).join(", "),
          degrees: (data.degrees || []).join(", "),
          location: data.Location?.city || "",
          country: data.Location?.country || "India",
          onlineClass: data?.teaching_modes?.includes("Online") || false,
          offlineClass: data?.teaching_modes?.includes("Offline") || false,
          smsAlerts: data?.sms_alerts ?? true,
          profile_status: data?.profile_status || "pending",
          pricing_per_hour: data.pricing_per_hour || 0,
          total_experience_years: data.experience || 0,
          introduction_video: data.introduction_video || "",
          languages_spoken: languagesSpoken,
          school_name: data.school_name || "",
          degree_status: data.degree_status || "",
          documents: data.documents || {},
        });

        toast.success("Profile loaded successfully");
      } catch {
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = (field) => {
    setEditField(field);
    setTempValue(profile[field]);
  };

  const handleChange = (e) => setTempValue(e.target.value);

  const handleProfileUpdate = async (updatedProfile) => {
  try {
    const response = await apiClient.put("/profile/tutor", updatedProfile);

    if (response.data?.profile) {
      // ✅ Sync sidebar immediately
      localStorage.setItem(
        "user",
        JSON.stringify({
          profile: response.data.profile,
          role: "tutor",
        })
      );
      window.dispatchEvent(new Event("storageUpdate"));
    }

    alert("Profile updated successfully!");
  } catch (err) {
    console.error("Update failed:", err);
    alert("Failed to update profile");
  }
};

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show instant preview
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);

    try {
      const res = await uploadProfilePhoto(file);
      if (!res.profile_photo) {
        toast.error("Server did not return profile photo path");
        return;
      }

      const baseUrl = "http://localhost:3000";
      const photoUrl = res.profile_photo.startsWith("http")
        ? res.profile_photo
        : `${baseUrl}${res.profile_photo}`;
      const photoUrlWithTimestamp = `${photoUrl}?t=${Date.now()}`;

      setPhotoPreview(photoUrlWithTimestamp);
      setProfile((prev) => ({ ...prev, photo: photoUrlWithTimestamp }));
      toast.success("Profile photo updated successfully");
    } catch {
      toast.error("Failed to update profile photo");
    }
  };

  const handleSave = async (field) => {
    try {
      if (field === "email" && !validateEmail(tempValue))
        return toast.error("Invalid email");
      if (field === "mobile" && !validateMobile(tempValue))
        return toast.error("Invalid mobile number");

      if (["email", "mobile"].includes(field)) {
        const fieldToSend = field === "mobile" ? "mobile_number" : field;
        await updateUserContact(fieldToSend, tempValue);
      } else if (field === "location") {
        return;
      } else {
        let payload;
        if (field === "languages_spoken") {
          const languages = tempValue.split(",").map((item) => {
            const [language, proficiency] = item.split(":").map((v) => v.trim());
            return { language, proficiency };
          });
          payload = { languages };
        } else {
          const isArray = ["subjects", "classes", "degrees"].includes(field);
          const actualField =
            field === "total_experience_years" ? "experience" : field;
          payload = {
            [actualField]: isArray
              ? tempValue.split(",").map((v) => v.trim())
              : tempValue,
          };
        }
        await updateTutorProfile(payload);
      }

      setProfile((prev) => ({ ...prev, [field]: tempValue }));
      toast.success(`${field.replace("_", " ")} updated successfully`);
      setEditField(null);
    } catch {
      toast.error(`Failed to update ${field}`);
    }
  };

  const handleClassToggle = async (field) => {
    const updated = { ...profile, [field]: !profile[field] };
    setProfile(updated);

    const teaching_modes = [
      ...(updated.onlineClass ? ["Online"] : []),
      ...(updated.offlineClass ? ["Offline"] : []),
    ];

    try {
      await updateTutorProfile({ teaching_modes });
      toast.success("Class preferences updated");
    } catch {
      toast.error("Failed to update preferences");
    }
  };

  const handleDocumentUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formattedFiles = files.map((file, index) => ({
      field: `document_${index}`,
      file,
    }));

    try {
      await uploadTutorDocuments(formattedFiles);
      toast.success("Documents uploaded successfully");
    } catch {
      toast.error("Failed to upload documents");
    }
  };

  if (!profile) return <div className="p-10 text-center">Loading...</div>;

  const editableFields = [
    { label: "Full Name", field: "name" },
    { label: "Email", field: "email" },
    { label: "Mobile Number", field: "mobile" },
    { label: "Subjects (comma separated)", field: "subjects" },
    { label: "Degrees (comma separated)", field: "degrees" },
    { label: "Classes (comma separated)", field: "classes" },
    { label: "Languages Spoken (e.g. English:Fluent)", field: "languages_spoken" },
    { label: "School/College Name", field: "school_name" },
    { label: "Degree Status", field: "degree_status" },
    { label: "Pricing Per Hour (\u20B9)", field: "pricing_per_hour", type: "number" },
    { label: "Total Experience (years)", field: "total_experience_years", type: "number" },
    { label: "Introduction Video URL", field: "introduction_video" },
    { label: "City (Location)", field: "location" },
  ];

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-4">Tutor Profile</h2>

      <div className="bg-teal-100 p-4 rounded-lg mb-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border bg-white">
            <img
              src={photoPreview || profile.photo || "/default/photo.jpg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <label className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              <span className="text-white text-xs text-center">Change</span>
            </label>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{profile.name}</h3>
            <p className="text-gray-600">
              {profile.location}, {profile.country}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              Status: {profile.profile_status}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h4 className="text-sm font-semibold mb-2">Upload Documents (Aadhar / PAN)</h4>
        <input
          type="file"
          multiple
          onChange={handleDocumentUpload}
          accept="image/*,.pdf"
          className="block w-full border px-3 py-2 rounded"
        />
        <p className="text-xs text-gray-500 mt-1">
          Accepted: PDF, JPG, PNG (Aadhar or PAN)
        </p>
      </div>

      {profile.documents && Object.keys(profile.documents).length > 0 && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h4 className="text-sm font-semibold mb-2">Uploaded Documents</h4>
          <ul className="space-y-2">
            {Object.entries(profile.documents).map(
              ([type, doc]) =>
                doc?.url && (
                  <li key={type} className="flex items-center justify-between">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {doc.name || `Document (${type})`}
                    </a>
                  </li>
                )
            )}
          </ul>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {editableFields.map(({ label, field, type = "text" }) => (
            <div key={field} className="bg-white p-4 rounded shadow border">
              <label className="block text-sm text-gray-600 mb-1">{label}</label>
              {editField === field ? (
                <div>
                  {field === "location" ? (
                    <LocationSearch
                      value={tempValue}
                      onSelect={async (selected) => {
                        setTempValue(selected.name);
                        setIsLocationLoading(true);
                        try {
                          await updateLocation(selected.place_id);
                          setProfile((prev) => ({
                            ...prev,
                            location: selected.city,
                            country: "India",
                          }));
                          toast.success("Location updated successfully");
                        } catch {
                          toast.error("Failed to update location");
                        } finally {
                          setIsLocationLoading(false);
                          setEditField(null);
                        }
                      }}
                    />
                  ) : (
                    <input
                      type={type}
                      value={tempValue}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  )}
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleSave(field)}
                      disabled={
                        (field === "email" && !validateEmail(tempValue)) ||
                        (field === "mobile" && !validateMobile(tempValue)) ||
                        (field === "location" && isLocationLoading)
                      }
                      className="px-4 py-1 bg-green-500 text-white rounded disabled:opacity-50"
                    >
                      {isLocationLoading && field === "location" ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEditField(null)}
                      className="px-4 py-1 bg-gray-300 text-gray-700 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span>{profile[field] || "Not specified"}</span>
                  <button
                    onClick={() => handleEdit(field)}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 mt-6 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Preferences</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Teaching Modes</h4>
            <div className="space-y-3">
              {["onlineClass", "offlineClass"].map((mode) => (
                <label
                  key={mode}
                  className="flex items-center justify-between bg-white p-3 rounded border"
                >
                  <div>
                    <p className="font-medium">
                      {mode === "onlineClass" ? "Online Classes" : "Offline Classes"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {mode === "onlineClass" ? "Teach via Zoom/Meet" : "Teach in-person"}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile[mode]}
                    onChange={() => handleClassToggle(mode)}
                  />
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Notifications</h4>
            <label className="flex items-center justify-between bg-white p-3 rounded border">
              <div>
                <p className="font-medium">SMS Alerts</p>
                <p className="text-xs text-gray-500">Booking notifications via SMS</p>
              </div>
              <input
                type="checkbox"
                checked={profile.smsAlerts}
                onChange={async (e) => {
                  const newValue = e.target.checked;
                  setProfile((prev) => ({ ...prev, smsAlerts: newValue }));
                  try {
                    await updateTutorProfile({ sms_alerts: newValue });
                    toast.success("SMS preference updated");
                  } catch {
                    toast.error("Failed to update SMS alerts");
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whole_Profile_tutor;
