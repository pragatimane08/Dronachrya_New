import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoadScriptNext, Autocomplete } from "@react-google-maps/api";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { apiClient } from "../../../../api/apiclient";

const GOOGLE_MAPS_API_KEY = "AIzaSyB2fZzo4kGI7K1iOW_o1QkRItwScC4Ma-I";

const LocationForm = () => {
  const [placeId, setPlaceId] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [autocomplete, setAutocomplete] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const onLoad = (instance) => setAutocomplete(instance);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place && place.place_id) {
        setPlaceId(place.place_id);
        setLocationInput(place.formatted_address || "");
        setError("");
      } else {
        setError("Please select a valid location from the dropdown.");
        toast.error("Invalid location selected.");
      }
    }
  };

  const handleSubmit = async () => {
    if (!placeId) {
      setError("Please select a location.");
      toast.error("Location is required.");
      return;
    }

    try {
      await apiClient.put("/profile/tutor", { place_id: placeId });

      toast.success("Location saved successfully!");
      setTimeout(() => {
        navigate("/create-profile-tutor1", {
          state: {
            placeId,
            address: locationInput,
          },
        });
      }, 1500); // delay to allow toast to show
    } catch (err) {
      const errMsg =
        err.response?.data?.message || "Failed to save location. Try again.";
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <LoadScriptNext googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ToastContainer position="top-right" />
        <div className="bg-white border rounded-md p-8 w-full max-w-md shadow-md relative z-10">
          <h2 className="text-center text-2xl font-semibold text-blue-900 mb-6">
            Set Your Location
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Search your location"
                className="w-full border rounded-md p-2"
                onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
              />
            </Autocomplete>
            <p className="text-xs text-gray-500 mt-1">
              Select a suggestion from the dropdown.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </LoadScriptNext>
  );
};

export default LocationForm;