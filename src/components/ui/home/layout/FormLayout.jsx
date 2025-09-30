import React from 'react';
import Backgroundimage from "../../../../assets/img/Background.png";
import Logo from "../../../../assets/img/logo.jpg";

const FormLayout = ({ children }) => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${Backgroundimage})` }}
    >
      {/* Logo and Company Name in Top Corner */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
        <div className="flex items-center">
          {/* Logo without circular border */}
          <img 
            src={Logo} 
            alt="Dronachrya Logo" 
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover mr-3"
          />
          {/* Company name in white with responsive text size */}
          <h1 className="text-white text-lg sm:text-xl md:text-2xl font-bold drop-shadow-lg">
            Dronachrya
          </h1>
        </div>
      </div>

      {/* Form Content - Centered with responsive sizing */}
      <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md mx-auto mt-8 sm:mt-0">
        {children}
      </div>
    </div>
  );
};

export default FormLayout;