import React, { useEffect, useState, useRef } from "react";
import { Autocomplete, LoadScriptNext } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "../../../../api/config/googleMapsConfig";

const LocationSearch = ({ onSelect, value, placeholder = "Search location..." }) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [inputValue, setInputValue] = useState(value || "");
  const autocompleteRef = useRef(null);

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

        const state = place.address_components?.find(comp =>
          comp.types.includes("administrative_area_level_1")
        )?.long_name;

        const country = place.address_components?.find(comp =>
          comp.types.includes("country")
        )?.long_name;

        const locationData = {
          name: place.formatted_address,
          place_id: place.place_id,
          city: city || place.formatted_address,
          state: state || "",
          country: country || ""
        };

        onSelect(locationData);
        setInputValue(place.formatted_address);
      }
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    // Allow user to press Enter to select the first suggestion
    if (e.key === 'Enter' && autocompleteRef.current) {
      e.preventDefault();
      // Trigger the place selection
      const places = autocompleteRef.current.getPlace();
      if (places && places.length > 0) {
        handlePlaceChanged();
      }
    }
  };

  return (
    <LoadScriptNext googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <Autocomplete
        onLoad={(autocomplete) => {
          setAutocomplete(autocomplete);
          autocompleteRef.current = autocomplete;
        }}
        onPlaceChanged={handlePlaceChanged}
        options={{
          types: ['(cities)'],
          componentRestrictions: { country: 'in' } // Restrict to India only
        }}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </Autocomplete>
    </LoadScriptNext>
  );
};

export default LocationSearch;