// // src/components/LocationSearch.jsx
// import React, { useEffect, useState } from "react";
// import { Autocomplete, LoadScriptNext } from "@react-google-maps/api";
// import { GOOGLE_MAPS_API_KEY } from "../../../api/config/googleMapsConfig";

// const LocationSearch = ({ onSelect, value, placeholder, hasError }) => {
//   const [autocomplete, setAutocomplete] = useState(null);
//   const [inputValue, setInputValue] = useState(value || "");
//   const [selectedCountry, setSelectedCountry] = useState("India");

//   useEffect(() => {
//     if (value !== inputsValue) setInputValue(value || "");
//   }, [value]);
//   const handlePlaceChanged = () => {
//     if (autocomplete) {
//       const place = autocomplete.getPlace();
//       if (place && place.place_id && place.formatted_address) {
//         const cityComponent = place.address_components?.find((comp) =>
//           comp.types.includes("locality")
//         );

//         const administrativeArea = place.address_components?.find((comp) =>
//           comp.types.includes("administrative_area_level_2")
//         );

//         const countryComponent = place.address_components?.find((comp) =>
//           comp.types.includes("country")
//         );

//         const city =
//           cityComponent?.long_name ||
//           administrativeArea?.long_name ||
//           place.formatted_address;

//         const country = countryComponent?.long_name || selectedCountry;

//         onSelect({
//           name: place.formatted_address,
//           place_id: place.place_id,
//           city: city,
//           country: country,
//         });

//         setSelectedCountry(country);
//       }
//     }
//   };

//   const handleCountryChange = (e) => {
//     const country = e.target.value;
//     setSelectedCountry(country);

//     onSelect({
//       name: "",
//       place_id: "",
//       city: "",
//       country: country,
//     });
//   };

//   const handleCityInputChange = (e) => {
//     setInputValue(e.target.value);
//     if (e.target.value === "") {
//       onSelect(null);
//     }
//   };

//   // Country list with ISO codes
//   const countries = [
//     { name: "India", code: "IN" },
//     { name: "United States", code: "US" },
//     { name: "United Kingdom", code: "GB" },
//     { name: "Canada", code: "CA" },
//     { name: "Australia", code: "AU" },
//     { name: "Germany", code: "DE" },
//     { name: "France", code: "FR" },
//     { name: "Japan", code: "JP" },
//     { name: "China", code: "CN" },
//     { name: "Brazil", code: "BR" },
//     { name: "Russia", code: "RU" },
//     { name: "South Africa", code: "ZA" },
//     { name: "Mexico", code: "MX" },
//     { name: "Italy", code: "IT" },
//     { name: "Spain", code: "ES" },
//     { name: "South Korea", code: "KR" },
//     { name: "Indonesia", code: "ID" },
//     { name: "Turkey", code: "TR" },
//     { name: "Saudi Arabia", code: "SA" },
//     { name: "Netherlands", code: "NL" },
//     { name: "Switzerland", code: "CH" },
//     { name: "Sweden", code: "SE" },
//     { name: "Norway", code: "NO" },
//     { name: "Denmark", code: "DK" },
//     { name: "Finland", code: "FI" },
//     { name: "New Zealand", code: "NZ" },
//     { name: "Singapore", code: "SG" },
//     { name: "Malaysia", code: "MY" },
//     { name: "Thailand", code: "TH" },
//     { name: "Vietnam", code: "VN" },
//     { name: "Philippines", code: "PH" },
//     { name: "United Arab Emirates", code: "AE" },
//     { name: "Qatar", code: "QA" },
//     { name: "Kuwait", code: "KW" },
//     { name: "Oman", code: "OM" },
//     { name: "Bahrain", code: "BH" },
//     { name: "Israel", code: "IL" },
//     { name: "Egypt", code: "EG" },
//     { name: "Nigeria", code: "NG" },
//     { name: "Kenya", code: "KE" },
//     { name: "Ghana", code: "GH" },
//     { name: "Ethiopia", code: "ET" },
//     { name: "Morocco", code: "MA" },
//     { name: "Argentina", code: "AR" },
//     { name: "Chile", code: "CL" },
//     { name: "Colombia", code: "CO" },
//     { name: "Peru", code: "PE" },
//     { name: "Venezuela", code: "VE" },
//     { name: "Pakistan", code: "PK" },
//     { name: "Bangladesh", code: "BD" },
//     { name: "Sri Lanka", code: "LK" },
//     { name: "Nepal", code: "NP" },
//     { name: "Bhutan", code: "BT" },
//     { name: "Myanmar", code: "MM" },
//     { name: "Cambodia", code: "KH" },
//     { name: "Laos", code: "LA" },
//     { name: "Afghanistan", code: "AF" },
//     { name: "Iraq", code: "IQ" },
//     { name: "Iran", code: "IR" },
//     { name: "Jordan", code: "JO" },
//     { name: "Lebanon", code: "LB" },
//     { name: "Syria", code: "SY" },
//   ];

//   // Get ISO code for selected country
//   const selectedCountryCode =
//     countries.find((c) => c.name === selectedCountry)?.code || "IN";

//   return (
//     <LoadScriptNext
//       googleMapsApiKey={GOOGLE_MAPS_API_KEY}
//       libraries={["places"]}
//     >
//       <div className="space-y-4">
//         {/* Country Selection */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Country
//           </label>
//           <select
//             value={selectedCountry}
//             onChange={handleCountryChange}
//             className="w-full border border-gray-300 rounded-md p-2 text-gray-800 bg-white focus:ring-teal-500 focus:border-teal-500"
//           >
//             {countries.map((c) => (
//               <option key={c.code} value={c.name}>
//                 {c.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Location Search */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Location
//           </label>
//           <Autocomplete
//             onLoad={setAutocomplete}
//             onPlaceChanged={handlePlaceChanged}
//             options={{
//               types: ["(cities)"],
//               componentRestrictions: { country: selectedCountryCode },
//             }}
//           >
//             <input
//               type="text"
//               placeholder={placeholder || "Enter Your Location or Pin code"}
//               value={inputValue}
//               onChange={handleCityInputChange}
//               className={`w-full border ${
//                 hasError ? "border-red-500" : "border-gray-300"
//               } rounded-md p-2 text-gray-800 bg-white placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500`}
//               style={{ minWidth: "100%" }}
//             />
//           </Autocomplete>
//           {hasError && (
//             <p className="text-red-500 text-xs mt-1">
//               Please select a location
//             </p>
//           )}
//         </div>
//       </div>
//     </LoadScriptNext>
//   );
// };

// export default LocationSearch;

// src/components/LocationSearch.jsx
// src/components/LocationSearch.jsx
import React, { useEffect, useState, useRef } from "react";
import { Autocomplete, LoadScriptNext } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "../../../api/config/googleMapsConfig";

const LocationSearch = ({ onSelect, value, placeholder, hasError }) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [inputValue, setInputValue] = useState(value || "");
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const autocompleteRef = useRef(null);
  const countryDropdownRef = useRef(null);

  useEffect(() => {
    if (value !== inputValue) setInputValue(value || "");
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      console.log("Place selected:", place); // Debug log
      
      if (place && place.place_id && place.formatted_address) {
        const cityComponent = place.address_components?.find((comp) =>
          comp.types.includes("locality")
        );
        const administrativeArea = place.address_components?.find((comp) =>
          comp.types.includes("administrative_area_level_2")
        );
        const countryComponent = place.address_components?.find((comp) =>
          comp.types.includes("country")
        );

        const city = cityComponent?.long_name || administrativeArea?.long_name || "";
        const country = countryComponent?.long_name || selectedCountry;

        const locationData = {
          name: place.formatted_address,
          place_id: place.place_id,
          city: city,
          country: country,
        };

        console.log("Location data to pass:", locationData); // Debug log
        onSelect(locationData);
        setInputValue(place.formatted_address);
      }
    }
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    setSearchTerm("");
    onSelect(null); // Reset location when country changes
    setInputValue("");
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (e.target.value === "") {
      onSelect(null);
    }
  };

  const toggleCountryDropdown = () => {
    setShowCountryDropdown(!showCountryDropdown);
    setSearchTerm("");
  };

  const countries = [
    { name: "India", code: "IN" },
    { name: "United States", code: "US" },
    { name: "United Kingdom", code: "GB" },
    { name: "Canada", code: "CA" },
    { name: "Australia", code: "AU" },
    { name: "Germany", code: "DE" },
    { name: "France", code: "FR" },
    { name: "Japan", code: "JP" },
    { name: "China", code: "CN" },
    { name: "Brazil", code: "BR" },
    { name: "Russia", code: "RU" },
    { name: "South Africa", code: "ZA" },
    { name: "Mexico", code: "MX" },
    { name: "Italy", code: "IT" },
    { name: "Spain", code: "ES" },
    { name: "South Korea", code: "KR" },
    { name: "Indonesia", code: "ID" },
    { name: "Turkey", code: "TR" },
    { name: "Saudi Arabia", code: "SA" },
    { name: "Netherlands", code: "NL" },
    { name: "Switzerland", code: "CH" },
    { name: "Sweden", code: "SE" },
    { name: "Norway", code: "NO" },
    { name: "Denmark", code: "DK" },
    { name: "Finland", code: "FI" },
    { name: "New Zealand", code: "NZ" },
    { name: "Singapore", code: "SG" },
    { name: "Malaysia", code: "MY" },
    { name: "Thailand", code: "TH" },
    { name: "Vietnam", code: "VN" },
    { name: "Philippines", code: "PH" },
    { name: "United Arab Emirates", code: "AE" },
    { name: "Qatar", code: "QA" },
    { name: "Kuwait", code: "KW" },
    { name: "Oman", code: "OM" },
    { name: "Bahrain", code: "BH" },
    { name: "Israel", code: "IL" },
    { name: "Egypt", code: "EG" },
    { name: "Nigeria", code: "NG" },
    { name: "Kenya", code: "KE" },
    { name: "Ghana", code: "GH" },
    { name: "Ethiopia", code: "ET" },
    { name: "Morocco", code: "MA" },
    { name: "Argentina", code: "AR" },
    { name: "Chile", code: "CL" },
    { name: "Colombia", code: "CO" },
    { name: "Peru", code: "PE" },
    { name: "Venezuela", code: "VE" },
    { name: "Pakistan", code: "PK" },
    { name: "Bangladesh", code: "BD" },
    { name: "Sri Lanka", code: "LK" },
    { name: "Nepal", code: "NP" },
    { name: "Bhutan", code: "BT" },
    { name: "Myanmar", code: "MM" },
    { name: "Cambodia", code: "KH" },
    { name: "Laos", code: "LA" },
    { name: "Afghanistan", code: "AF" },
    { name: "Iraq", code: "IQ" },
    { name: "Iran", code: "IR" },
    { name: "Jordan", code: "JO" },
    { name: "Lebanon", code: "LB" },
    { name: "Syria", code: "SY" },
  ];

  const selectedCountryCode = countries.find((c) => c.name === selectedCountry)?.code || "IN";

  // Filter countries based on search term
  const filteredCountries = searchTerm
    ? countries.filter((country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : countries;

  return (
    <LoadScriptNext googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <div className="space-y-4">
        {/* Country Selection */}
        <div className="relative" ref={countryDropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <div 
            className="w-full border border-gray-300 rounded-md p-2 text-gray-800 bg-white focus:ring-teal-500 focus:border-teal-500 flex justify-between items-center cursor-pointer"
            onClick={toggleCountryDropdown}
          >
            <span>{selectedCountry}</span>
            <svg 
              className={`w-4 h-4 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {showCountryDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              <div className="p-2 sticky top-0 bg-white border-b">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <ul className="py-1">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((c) => (
                    <li
                      key={c.code}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                        selectedCountry === c.name ? "bg-teal-50 text-teal-700" : ""
                      }`}
                      onClick={() => handleCountryChange(c.name)}
                    >
                      {c.name}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">No countries found</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Location Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <Autocomplete
            onLoad={(auto) => {
              setAutocomplete(auto);
              autocompleteRef.current = auto;
            }}
            onPlaceChanged={handlePlaceChanged}
            options={{
              types: ["(cities)"],
              componentRestrictions: { country: selectedCountryCode },
            }}
          >
            <input
              type="text"
              placeholder={placeholder || "Enter city name..."}
              value={inputValue}
              onChange={handleInputChange}
              className={`w-full border ${
                hasError ? "border-red-500" : "border-gray-300"
              } rounded-md p-2 text-gray-800 bg-white placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500`}
            />
          </Autocomplete>
          {hasError && (
            <p className="text-red-500 text-xs mt-1">
              Please select a location from the suggestions
            </p>
          )}
        </div>
      </div>
    </LoadScriptNext>
  );
};

export default LocationSearch;