// // src/components/LocationSearch.jsx
// import React, { useEffect, useState } from "react";
// import { Autocomplete, LoadScriptNext } from "@react-google-maps/api";
// import { GOOGLE_MAPS_API_KEY } from "../../../../api/config/googleMapsConfig"; // Import API key

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
//         const city = place.address_components?.find((comp) =>
//           comp.types.includes("locality") || comp.types.includes("administrative_area_level_2")
//         )?.long_name;

//         onSelect({
//           name: place.formatted_address,
//           place_id: place.place_id,
//           city: city || place.formatted_address,
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

import React, { useEffect, useState } from "react";
import { Autocomplete, LoadScriptNext } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "../../../../api/config/googleMapsConfig";

// Define libraries outside component to prevent re-renders
const LIBRARIES = ["places"];

const LocationSearch = ({ onSelect, value }) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [inputValue, setInputValue] = useState(value || "");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (value !== inputValue) setInputValue(value || "");
  }, [value]);

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place && place.place_id && place.formatted_address) {
        const city = place.address_components?.find((comp) =>
          comp.types.includes("locality") || comp.types.includes("administrative_area_level_2")
        )?.long_name;

        onSelect({
          name: place.formatted_address,
          place_id: place.place_id,
          city: city || place.formatted_address,
        });
      }
    }
  };

  const handleLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const handleScriptLoad = () => {
    setScriptLoaded(true);
  };

  return (
    <LoadScriptNext 
      googleMapsApiKey={GOOGLE_MAPS_API_KEY} 
      libraries={LIBRARIES}
      onLoad={handleScriptLoad}
    >
      <Autocomplete 
        onLoad={handleLoad} 
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          placeholder="Search location"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          disabled={!scriptLoaded}
        />
      </Autocomplete>
    </LoadScriptNext>
  );
};

export default LocationSearch;