import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoadScriptNext, Autocomplete } from "@react-google-maps/api";
import { apiClient } from "../../../../api/apiclient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GOOGLE_MAPS_API_KEY = "AIzaSyB2fZzo4kGI7K1iOW_o1QkRItwScC4Ma-I";

const LocationSelector = () => {
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
        toast.error("Please select a valid location from the dropdown.");
      }
    }
  };

  const handleSubmit = async () => {
    if (!placeId) {
      setError("Please select a location.");
      toast.error("Please select a location.");
      return;
    }

    try {
      await apiClient.put("/profile/student", { place_id: placeId });

      // ✅ Show success toast
      toast.success("🎉 Location saved successfully!", {
        onClose: () => {
          // ✅ Navigate after toast closes
          navigate("/mode-selection-form", {
            state: {
              placeId,
              address: locationInput,
            },
          });
        },
      });

    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to save location. Try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <LoadScriptNext googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white border rounded-md p-8 w-full max-w-md shadow-md relative z-10">
          <h2 className="text-center text-2xl font-semibold text-blue-900 mb-6">
            Set Your Location
          </h2>

          {error && (
            <div className="text-red-500 text-center mb-4 text-sm">{error}</div>
          )}

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

        {/* ✅ Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </LoadScriptNext>
  );
};

export default LocationSelector;