// // src/components/LocationSearch.jsx
// import React, { useEffect, useState } from "react";
// import { Autocomplete, LoadScriptNext } from "@react-google-maps/api";

// const GOOGLE_MAPS_API_KEY = "AIzaSyBmsMYmbsMbhQdBnzxe8RQXnrg7M5HNWTw";

// const LocationSearch = ({ onSelect, value }) => {
//   const [autocomplete, setAutocomplete] = useState(null);
//   const [inputValue, setInputValue] = useState(value || "");

//   useEffect(() => {
//     if (value !== inputValue) setInputValue(value || "");
//   }, [value]);

//   const handlePlaceChanged = () => {
//     if (autocomplete) {
//       const place = autocomplete.getPlace();
//       if (place && place.place_id && place.formatted_address) {
//         const city = place.address_components?.find(comp =>
//           comp.types.includes("locality") || comp.types.includes("administrative_area_level_2")
//         )?.long_name;

//         onSelect({
//           name: place.formatted_address,
//           place_id: place.place_id,
//           city: city || place.formatted_address
//         });
//       }
//     }
//   };

//   return (
//     <LoadScriptNext googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
//       <Autocomplete onLoad={setAutocomplete} onPlaceChanged={handlePlaceChanged}>
//         <input
//           type="text"
//           placeholder="Search location"
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           className="w-full border rounded-md p-2 text-sm"
//         />
//       </Autocomplete>
//     </LoadScriptNext>
//   );
// };

// export default LocationSearch;

// src/components/LocationSearch.jsx
import React, { useEffect, useState } from "react";
import { Autocomplete, LoadScriptNext } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "../../../../../api/config/googleMapsConfig";  // <-- import key

const LocationSearch = ({ onSelect, value }) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    if (value !== inputValue) setInputValue(value || "");
  }, [value]);

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place && place.place_id && place.formatted_address) {
        const city = place.address_components?.find(comp =>
          comp.types.includes("locality") || comp.types.includes("administrative_area_level_2")
        )?.long_name;

        onSelect({
          name: place.formatted_address,
          place_id: place.place_id,
          city: city || place.formatted_address
        });
      }
    }
  };

  return (
    <LoadScriptNext googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <Autocomplete onLoad={setAutocomplete} onPlaceChanged={handlePlaceChanged}>
        <input
          type="text"
          placeholder="Search location"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full border rounded-md p-2 text-sm"
        />
      </Autocomplete>
    </LoadScriptNext>
  );
};

export default LocationSearch;
