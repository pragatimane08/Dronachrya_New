// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { LoadScriptNext, Autocomplete } from "@react-google-maps/api";
// import { toast, ToastContainer } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
// import { apiClient } from "../../../../api/apiclient";

// const GOOGLE_MAPS_API_KEY = "AIzaSyBmsMYmbsMbhQdBnzxe8RQXnrg7M5HNWTw";

// const LocationForm = () => {
//   const [placeId, setPlaceId] = useState("");
//   const [locationInput, setLocationInput] = useState("");
//   const [autocomplete, setAutocomplete] = useState(null);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();

//   const onLoad = (instance) => setAutocomplete(instance);

//   const onPlaceChanged = () => {
//     if (autocomplete) {
//       const place = autocomplete.getPlace();
//       if (place && place.place_id) {
//         setPlaceId(place.place_id);
//         setLocationInput(place.formatted_address || "");
//         setError("");
//       } else {
//         setError("Please select a valid location from the dropdown.");
//         toast.error("Invalid location selected.");
//       }
//     }
//   };

//   const handleSubmit = async () => {
//     if (!placeId) {
//       setError("Please select a location.");
//       toast.error("Location is required.");
//       return;
//     }

//     try {
//       await apiClient.put("/profile/tutor", { place_id: placeId });

//       toast.success("Location saved successfully!");
//       setTimeout(() => {
//         navigate("/create-profile-tutor1", {
//           state: {
//             placeId,
//             address: locationInput,
//           },
//         });
//       }, 1500); // delay to allow toast to show
//     } catch (err) {
//       const errMsg =
//         err.response?.data?.message || "Failed to save location. Try again.";
//       setError(errMsg);
//       toast.error(errMsg);
//     }
//   };

//   return (
//     <LoadScriptNext googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <ToastContainer position="top-right" />
//         <div className="bg-white border rounded-md p-8 w-full max-w-md shadow-md relative z-10">
//           <h2 className="text-center text-2xl font-semibold text-blue-900 mb-6">
//             Set Your Location
//           </h2>

//           <div className="mb-6">
//             <label className="block text-sm font-medium mb-1">
//               Location <span className="text-red-500">*</span>
//             </label>
//             <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
//               <input
//                 type="text"
//                 value={locationInput}
//                 onChange={(e) => setLocationInput(e.target.value)}
//                 placeholder="Search your location"
//                 className="w-full border rounded-md p-2"
//                 onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
//               />
//             </Autocomplete>
//             <p className="text-xs text-gray-500 mt-1">
//               Select a suggestion from the dropdown.
//             </p>
//           </div>

//           <button
//             onClick={handleSubmit}
//             className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md"
//           >
//             Save & Continue
//           </button>
//         </div>
//       </div>
//     </LoadScriptNext>
//   );
// };

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LoadScriptNext, Autocomplete } from "@react-google-maps/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiClient } from "../../../../api/apiclient";
import { XMarkIcon } from "@heroicons/react/24/outline";

// ✅ Import Google Maps API Key from config
import { GOOGLE_MAPS_API_KEY } from "../../../../api/config/googleMapsConfig";

const LocationForm = () => {
  const [placeId, setPlaceId] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [autocomplete, setAutocomplete] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Memoize libraries array to prevent re-renders
  const libraries = useMemo(() => ["places"], []);

  const onLoad = (instance) => setAutocomplete(instance);

  const extractAddressComponents = (place) => {
    let cityName = "";
    let stateName = "";
    let countryName = "India"; // Default to India since we're restricting to India
    
    if (place.address_components) {
      // Try to extract proper address components
      place.address_components.forEach(component => {
        const types = component.types;
        
        if (types.includes("locality")) {
          cityName = component.long_name;
        } else if (types.includes("administrative_area_level_2")) {
          // District level - often better for city names in India
          if (!cityName) cityName = component.long_name;
        } else if (types.includes("administrative_area_level_1")) {
          stateName = component.long_name;
        } else if (types.includes("country")) {
          countryName = component.long_name;
        }
      });
      
      // Fallback: if we couldn't find a city, try other components
      if (!cityName) {
        for (const component of place.address_components) {
          if (component.types.includes("sublocality") || 
              component.types.includes("sublocality_level_1") ||
              component.types.includes("neighborhood")) {
            cityName = component.long_name;
            break;
          }
        }
      }
      
      // Final fallback: use the first component if city is still empty
      if (!cityName && place.address_components.length > 0) {
        cityName = place.address_components[0].long_name;
      }
    }
    
    return { cityName, stateName, countryName };
  };

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      
      if (place && place.place_id && place.formatted_address) {
        const { cityName, stateName, countryName } = extractAddressComponents(place);

        setPlaceId(place.place_id);
        setLocationInput(place.formatted_address);
        setAddress(place.formatted_address);
        setCity(cityName);
        setState(stateName);
        setCountry(countryName);
        setError("");
        
        toast.success("Location selected successfully!");
      } else {
        setError("Please select a valid location from the dropdown.");
        toast.error("Invalid location selected.");
      }
    }
  };

  const handleInputChange = (e) => {
    setLocationInput(e.target.value);
    // Clear previous selection if user starts typing again
    if (placeId) {
      setPlaceId("");
      setAddress("");
      setCity("");
      setState("");
      setCountry("");
    }
  };

  const handleSubmit = async () => {
    if (!placeId) {
      setError("Please select a valid location from the dropdown.");
      toast.error("Location is required.");
      return;
    }

    // Validate that we have required fields
    if (!city || !country) {
      setError("Could not determine complete location details. Please try a different location or enter details manually.");
      toast.error("Location details incomplete.");
      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        place_id: placeId,
        address: address,
        city: city,
        state: state,
        country: country
      };
      
      console.log("Submitting location data:", payload);
      
      await apiClient.put("/profile/tutor", payload);

      toast.success("Location saved successfully!");
      setTimeout(() => {
        navigate("/create-profile-tutor1", {
          state: {
            placeId,
            address: address,
            city,
            state,
            country
          },
        });
      }, 1500);
    } catch (err) {
      console.error("Location submission error:", err);
      const errMsg = err.response?.data?.message || "Failed to save location. Try again.";
      
      // Handle specific error cases
      if (err.response?.data?.error?.includes("cannot be null")) {
        setError("Location details are incomplete. Please select a different location or contact support.");
        toast.error("Location details incomplete. Please try a different location.");
      } else {
        setError(errMsg);
        toast.error(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadScriptNext 
      googleMapsApiKey={GOOGLE_MAPS_API_KEY} 
      libraries={libraries}
      loadingElement={<div className="text-center p-4">Loading Google Maps...</div>}
    >
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <ToastContainer position="top-right" />
        <div className="bg-white border rounded-md p-6 w-full max-w-md shadow-md relative">
          {/* Close button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          <h2 className="text-center text-xl font-semibold text-blue-900 mb-6">
            Set Your Location
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <Autocomplete 
              onLoad={onLoad} 
              onPlaceChanged={handlePlaceChanged}
              options={{
                types: ["geocode"],
                componentRestrictions: { country: "in" } // Restrict to India
              }}
            >
              <input
                type="text"
                value={locationInput}
                onChange={handleInputChange}
                placeholder="Enter your city or area name"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
              />
            </Autocomplete>
            <p className="text-xs text-gray-500 mt-1">
              Start typing your city or area name and select from suggestions.
            </p>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            
            {/* Show selected location details */}
            {address && (
              <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                <p><strong>Selected:</strong> {address}</p>
                {city && <p><strong>City/District:</strong> {city}</p>}
                {state && <p><strong>State:</strong> {state}</p>}
                {country && <p><strong>Country:</strong> {country}</p>}
              </div>
            )}
          </div>

          {/* Manual location input as fallback */}
          <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-xs text-yellow-800 mb-2">
              <strong>Note:</strong> If the auto-detected details above don't look correct, 
              please try searching for a more specific location (e.g., "Srinagar, Jammu and Kashmir" 
              instead of just "Jammu and Kashmir").
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-md text-sm"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !placeId}
              className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white py-2 rounded-md text-sm"
            >
              {loading ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </div>
      </div>
    </LoadScriptNext>
  );
};

export default LocationForm;