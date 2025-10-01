// // src/components/forms/LocationForm.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { apiClient } from "../../../../api/apiclient";
// import { XMarkIcon } from "@heroicons/react/24/outline";

// // ✅ Import the reusable LocationSearch
// import LocationSearch from "../../../../components/common/LocationSearch";

// const LocationForm = () => {
//   const [locationData, setLocationData] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     setLocationInput(e.target.value);
//     // Clear previous selection if user starts typing again
//     if (placeId) {
//       setPlaceId("");
//       setAddress("");
//       setCity("");
//       setState("");
//       setCountry("");
//     }
//   };

//   const handleSubmit = async () => {
//     setHasAttemptedSubmit(true);

//     if (!locationData?.place_id) {
//       setError("Please select a location.");
//       return;
//     }

//     if (!locationData.city || !locationData.country) {
//       setError(
//         "Could not determine complete location details. Please try again or select a different location."
//       );
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         place_id: locationData.place_id,
//         address: locationData.name, // formatted address
//         city: locationData.city,
//         state: locationData.state,
//         pincode: locationData.pincode,
//         country: locationData.country,
//       };

//       await apiClient.put("/profile/tutor", payload);

//       // Navigate to next step
//       navigate("/create-profile-tutor1", {
//         state: payload,
//       });
//     } catch (err) {
//       const errMsg =
//         err.response?.data?.message || "Failed to save location. Try again.";

//       if (err.response?.data?.error?.includes("cannot be null")) {
//         setError(
//           "Location details are incomplete. Please select a different location or contact support."
//         );
//       } else {
//         setError(errMsg);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <div className="bg-white border rounded-md p-6 w-full max-w-md shadow-md relative">
//         {/* Close button */}
//         <button
//           onClick={() => navigate("/")}
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
//         >
//           <XMarkIcon className="w-5 h-5" />
//         </button>

//         <h2 className="text-center text-xl font-semibold text-blue-900 mb-6">
//           Set Your Location
//         </h2>

//         {/* Reusable LocationSearch */}
//         <LocationSearch
//           value={locationData?.name || ""}
//           onSelect={(data) => {
//             setLocationData(data);
//             setError("");
//             setHasAttemptedSubmit(false);
//           }}
//           placeholder="Enter your city, area, or pincode"
//           hasError={!!error || (hasAttemptedSubmit && !locationData)}
//         />

//         {/* Inline error message */}
//         {hasAttemptedSubmit && !locationData ? (
//           <div className="mt-2 text-red-500 text-sm">
//             Please select a location.
//           </div>
//         ) : error ? (
//           <div className="mt-2 text-red-500 text-sm">{error}</div>
//         ) : null}

//         {/* Buttons */}
//         <div className="flex justify-between gap-3 mt-6">
//           <button
//             onClick={() => navigate("/tutor_referral_code")}
//             className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-md text-sm"
//           >
//             Back
//           </button>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white py-2 rounded-md text-sm"
//           >
//             {loading ? "Saving..." : "Save & Continue"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LocationForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../../api/apiclient";
import { XMarkIcon } from "@heroicons/react/24/outline";

// ✅ Import the reusable LocationSearch & FormLayout
import LocationSearch from "../../../../components/common/LocationSearch";
import FormLayout from "../../home/layout/FormLayout";

const LocationForm = () => {
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    if (!locationData?.place_id) {
      setError("Please select a location.");
      return;
    }

    if (!locationData.city || !locationData.country) {
      setError(
        "Could not determine complete location details. Please try again or select a different location."
      );
      return;
    }

    setLoading(true);
    try {
      const payload = {
        place_id: locationData.place_id,
        address: locationData.name, // formatted address
        city: locationData.city,
        state: locationData.state,
        pincode: locationData.pincode,
        country: locationData.country,
      };

      await apiClient.put("/profile/tutor", payload);

      // Navigate to next step
      navigate("/create-profile-tutor1", {
        state: payload,
      });
    } catch (err) {
      const errMsg =
        err.response?.data?.message || "Failed to save location. Try again.";

      if (err.response?.data?.error?.includes("cannot be null")) {
        setError(
          "Location details are incomplete. Please select a different location or contact support."
        );
      } else {
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout>
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

      {/* Reusable LocationSearch */}
      <LocationSearch
        value={locationData?.name || ""}
        onSelect={(data) => {
          setLocationData(data);
          setError("");
          setHasAttemptedSubmit(false);
        }}
        placeholder="Enter your city, area, or pincode"
        hasError={!!error || (hasAttemptedSubmit && !locationData)}
      />

      {/* Inline error message */}
      {hasAttemptedSubmit && !locationData ? (
        <div className="mt-2 text-red-500 text-sm">
          Please select a location.
        </div>
      ) : error ? (
        <div className="mt-2 text-red-500 text-sm">{error}</div>
      ) : null}

      {/* Buttons */}
      <div className="flex justify-between gap-3 mt-6">
        <button
          onClick={() => navigate("/tutor_referral_code")}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-md text-sm"
        >
          Back
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white py-2 rounded-md text-sm"
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </div>
    </FormLayout>
  );
};

export default LocationForm;
