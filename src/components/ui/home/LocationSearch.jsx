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
  const [postcodeLocalities, setPostcodeLocalities] = useState([]); // choices from geocode result
  const [geocodeFallbackData, setGeocodeFallbackData] = useState(null); // store data to build choice results
  const autocompleteRef = useRef(null);
  const countryDropdownRef = useRef(null);

  useEffect(() => {
    if (value !== inputValue) setInputValue(value || "");
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target)
      ) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Helper: pick component by type
  const getComponent = (components, type) =>
    components.find((c) => c.types.includes(type));

  // Prefer city/town over sublocality (reordered priority)
  const extractLocationData = (placeOrResult) => {
    const components = placeOrResult.address_components || [];
    const cityComp =
      getComponent(components, "locality") ||
      getComponent(components, "postal_town") ||
      getComponent(components, "administrative_area_level_2") || // district / taluka
      getComponent(components, "sublocality_level_1"); // fallback to village/colony

    const stateComp = getComponent(components, "administrative_area_level_1");
    const pincodeComp = getComponent(components, "postal_code");
    const countryComp = getComponent(components, "country");

    return {
      name: placeOrResult.formatted_address || "",
      place_id: placeOrResult.place_id || "",
      city: cityComp?.long_name || "",
      state: stateComp?.long_name || "",
      pincode: pincodeComp?.long_name || "",
      country: countryComp?.short_name || "IN",
      // also expose postcode_localities if Google provides it
      postcode_localities: placeOrResult.postcode_localities || [],
      raw: placeOrResult,
    };
  };

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (!place || !place.place_id) return;
      const locationData = extractLocationData(place);
      // simple path: user selected a city from the suggestions -> return it
      onSelect(locationData);
      setInputValue(place.formatted_address || inputValue);
      // clear any previous postcode localities UI
      setPostcodeLocalities([]);
      setGeocodeFallbackData(null);
    }
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

  const selectedCountryCode =
    countries.find((c) => c.name === selectedCountry)?.code || "IN";

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    setSearchTerm("");
    onSelect(null);
    setInputValue("");
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    if (val === "") {
      onSelect(null);
      setPostcodeLocalities([]);
      setGeocodeFallbackData(null);
    }
  };

  const toggleCountryDropdown = () => {
    setShowCountryDropdown(!showCountryDropdown);
    setSearchTerm("");
  };

  // Geocode PIN and pick the best result using a locality-first heuristic.
  const geocodePincode = () => {
    if (!/^\d{6}$/.test(inputValue)) return;
    if (!window.google?.maps) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      {
        address: inputValue,
        componentRestrictions: { country: selectedCountryCode },
      },
      (results, status) => {
        console.log("Geocode results for PIN:", inputValue, results, status);

        if (status === "OK" && results?.length) {
          // prefer results that explicitly include a locality / postal_town
          const withLocality = results.find((r) =>
            (r.address_components || []).some((c) =>
              c.types.includes("locality") || c.types.includes("postal_town")
            )
          );

          // a direct postal_code-featured result (Google often returns these)
          const postalCodeResult = results.find((r) => r.types?.includes("postal_code"));

          // a district/taluka candidate
          const byDistrict = results.find((r) =>
            (r.address_components || []).some((c) =>
              c.types.includes("administrative_area_level_2")
            )
          );

          // Final prioritization: locality > postal_code result > district > first result
          const chosenResult = withLocality || postalCodeResult || byDistrict || results[0];

          const locationData = extractLocationData(chosenResult);

          // If Google returned a postcode_localities array (multiple localities in that PIN)
          const localities = chosenResult.postcode_localities || locationData.postcode_localities || [];

          // If multiple localities exist, show them for user choice (better UX)
          if (Array.isArray(localities) && localities.length > 1) {
            setPostcodeLocalities(localities);
            setGeocodeFallbackData(locationData);
            // set an informative input value so user sees a friendly string
            // we don't call onSelect yet; wait for user to choose
            setInputValue(
              `${localities[0]}, ${locationData.state ? locationData.state + " " : ""}${locationData.pincode || inputValue
              }`
            );
            return;
          }

          // No ambiguous localities — return the chosen data
          if (!locationData.pincode) locationData.pincode = inputValue;
          if (!locationData.country) locationData.country = selectedCountryCode;

          onSelect(locationData);
          setInputValue(chosenResult.formatted_address || inputValue);
          setPostcodeLocalities([]);
          setGeocodeFallbackData(null);
        } else {
          console.warn("Geocode failed for pincode:", status);
        }
      }
    );
  };

  // When user picks a locality from the postcode_localities list
  const handlePickLocality = (localityName) => {
    if (!geocodeFallbackData) return;
    const chosen = {
      ...geocodeFallbackData,
      city: localityName,
      // ensure pincode + country remain populated
      pincode: geocodeFallbackData.pincode || inputValue,
      country: geocodeFallbackData.country || selectedCountryCode,
      // name: form a nicer display
      name: `${localityName}${geocodeFallbackData.state ? ", " + geocodeFallbackData.state : ""} ${geocodeFallbackData.pincode || inputValue
        }, ${geocodeFallbackData.country || selectedCountryCode}`,
    };

    onSelect(chosen);
    setInputValue(chosen.name);
    // clear localities UI
    setPostcodeLocalities([]);
    setGeocodeFallbackData(null);
  };

  // small UI helper to allow using the Google result even if postcode_localities exist
  const acceptGoogleResult = () => {
    if (!geocodeFallbackData) return;
    const chosen = {
      ...geocodeFallbackData,
      pincode: geocodeFallbackData.pincode || inputValue,
      country: geocodeFallbackData.country || selectedCountryCode,
    };
    onSelect(chosen);
    setInputValue(geocodeFallbackData.name || inputValue);
    setPostcodeLocalities([]);
    setGeocodeFallbackData(null);
  };

  const filteredCountries = searchTerm
    ? countries.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : countries;

  const isPincode = /^\d{6}$/.test(inputValue);

  return (
    <LoadScriptNext googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <div className="space-y-4">
        {/* Country Selection */}
        <div className="relative" ref={countryDropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <div
            className="w-full border border-gray-300 rounded-md p-2 text-gray-800 bg-white focus:ring-teal-500 focus:border-teal-500 flex justify-between items-center cursor-pointer"
            onClick={toggleCountryDropdown}
          >
            <span>{selectedCountry}</span>
            <svg
              className={`w-4 h-4 transition-transform ${showCountryDropdown ? "rotate-180" : ""}`}
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
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedCountry === c.name ? "bg-teal-50 text-teal-700" : ""
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

        {/* Location / Pincode Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location / Pincode</label>
          <Autocomplete
            onLoad={(auto) => {
              setAutocomplete(auto);
              autocompleteRef.current = auto;
            }}
            onPlaceChanged={handlePlaceChanged}
            options={{
              types: isPincode ? ["geocode"] : ["(cities)"],
              componentRestrictions: { country: selectedCountryCode },
            }}
          >
            <input
              type="text"
              placeholder={placeholder || "Enter city or pincode..."}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (isPincode && e.key === "Enter") {
                  e.preventDefault();
                  geocodePincode();
                }
              }}
              onBlur={() => {
                if (isPincode) geocodePincode();
              }}
              className={`w-full border ${hasError ? "border-red-500" : "border-gray-300"} rounded-md p-2 text-gray-800 bg-white placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500`}
            />
          </Autocomplete>

          {postcodeLocalities && postcodeLocalities.length > 0 && (
            <div className="mt-2 p-2 border rounded bg-gray-50">
              <div className="text-sm mb-2">Multiple localities found for this PIN — choose the one you want:</div>
              <div className="flex flex-wrap gap-2">
                {postcodeLocalities.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handlePickLocality(loc)}
                    className="px-3 py-1 rounded bg-white border text-sm hover:bg-gray-100"
                  >
                    {loc}
                  </button>
                ))}
                <button onClick={acceptGoogleResult} className="px-3 py-1 rounded bg-white border text-sm hover:bg-gray-100">
                  Use Google suggestion
                </button>
              </div>
            </div>
          )}

          {hasError && (
            <p className="text-red-500 text-xs mt-1">Please select a location from the suggestions</p>
          )}
        </div>
      </div>
    </LoadScriptNext>
  );
};

export default LocationSearch;