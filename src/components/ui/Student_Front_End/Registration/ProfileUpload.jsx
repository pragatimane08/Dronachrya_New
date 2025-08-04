import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileUpload = () => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setError("Unsupported file type.");
        toast.error("Unsupported file type.");
        return;
      }
      if (file.size > maxSize) {
        setError("File size exceeds 10MB.");
        toast.error("File size exceeds 10MB.");
        return;
      }
      setImage(URL.createObjectURL(file));
      setError("");
      toast.success("Image preview ready.");
    }
  };

  const handleSubmit = () => {
    if (image) {
      toast.success("Profile picture added successfully.");
    } else {
      toast.error("Please upload a photo first.");
    }
  };

  const handleSkip = () => {
    toast.info("You chose to skip adding a profile picture.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-5">
          Add Front-facing Profile Picture
        </h3>

        <div className="w-44 h-44 border-2 border-dashed border-gray-300 rounded-lg bg-gray-100 mx-auto mb-3 flex items-center justify-center overflow-hidden relative">
          <label htmlFor="file-upload" className="cursor-pointer w-full h-full flex items-center justify-center">
            {image ? (
              <img src={image} alt="Preview" className="object-cover w-full h-full rounded-lg" />
            ) : (
              <div className="text-4xl text-gray-300 font-bold">+</div>
            )}
          </label>
          <input
            type="file"
            id="file-upload"
            accept=".jpeg, .jpg, .png, .gif, .bmp"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {error && <p className="text-red-500 text-sm md:text-base mb-2">{error}</p>}

        <p className="text-xs md:text-sm text-gray-500 mb-4">
          Photo format supported: .jpeg, .png, .gif, .bmp & Maximum size 10MB
        </p>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white py-2 w-full rounded-md font-medium hover:bg-blue-700 transition text-base md:text-lg"
        >
          Add Profile Picture
        </button>

        <button
          onClick={handleSkip}
          className="mt-3 text-blue-600 underline hover:text-blue-800 text-sm md:text-base"
        >
          I'll do it later
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ProfileUpload;