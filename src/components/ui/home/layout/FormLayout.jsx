import React from "react";
import { Link } from "react-router-dom";
import Backgroundimage from "../../../../assets/img/Background.png";
import Logo from "../../../../assets/img/logo-r.png";

const FormLayout = ({ children }) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-8 relative"
      style={{ backgroundImage: `url(${Backgroundimage})` }} // Corrected here
    >
      {/* Logo */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
        <Link to="/" className="flex items-center">
          <img
            src={Logo}
            alt="Dronacharya Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-cover mr-2"
          />
          <h1 className="text-white text-base sm:text-lg md:text-xl font-bold drop-shadow-lg">
          Dronacharya
          </h1>
        </Link>
      </div>

      {/* Fixed card for forms */}
      <div className="relative bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md mx-auto">
        {children}
      </div>
    </div>
  );
};

export default FormLayout;
