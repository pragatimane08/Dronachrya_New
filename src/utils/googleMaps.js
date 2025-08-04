export const initGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    
    document.head.appendChild(script);
  });
};

export const initAutocomplete = (inputElement) => {
  if (!window.google || !window.google.maps) {
    throw new Error("Google Maps not loaded");
  }
  
  return new window.google.maps.places.PlaceAutocompleteElement({
    inputElement,
    options: {
      types: ["geocode"],
      componentRestrictions: { country: "in" },
    },
  });
};