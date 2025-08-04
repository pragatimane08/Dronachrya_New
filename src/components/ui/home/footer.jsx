import React from "react";
const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Description */}
        <div>
          <h3 className="text-white text-lg font-bold">
            <span className="text-[#35BAA3]">Drona</span>charya
          </h3>
          <p className="mt-2 text-sm">
            Connecting students with the best tutors across India. Find the perfect match for your learning needs.
          </p>
        
          <div className="flex space-x-4 mt-4 text-white text-lg">
            <a href="#"><i className="fab fa-facebook-f hover:text-[#35BAA3]" /></a>
            <a href="#"><i className="fab fa-twitter hover:text-[#35BAA3]" /></a>
            <a href="#"><i className="fab fa-instagram hover:text-[#35BAA3]" /></a>
            <a href="#"><i className="fab fa-github hover:text-[#35BAA3]" /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-[#35BAA3]">Home</a></li>
            <li><a href="#" className="hover:text-[#35BAA3]">About Us</a></li>
            <li><a href="#" className="hover:text-[#35BAA3]">Find Tutors</a></li>
            <li><a href="#" className="hover:text-[#35BAA3]">Subscription Plans</a></li>
            <li><a href="#" className="hover:text-[#35BAA3]">Contact Us</a></li>
          </ul>
        </div>

        {/* For Users */}
        <div>
          <h4 className="text-white font-semibold mb-3">For Users</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-[#35BAA3]">Student Registration</a></li>
            <li><a href="#" className="hover:text-[#35BAA3]">Tutor Registration</a></li>
            <li><a href="#" className="hover:text-[#35BAA3]">Login</a></li>
            <li><a href="#" className="hover:text-[#35BAA3]">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#35BAA3]">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-semibold mb-3">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <i className="fas fa-map-marker-alt text-[#35BAA3] mt-1" />
              <span>123 Education Street, Knowledge City, India - 400001</span>
            </li>
            <li className="flex items-center gap-3">
              <i className="fas fa-phone-alt text-[#35BAA3]" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <i className="fas fa-envelope text-[#35BAA3]" />
              <span>info@dronacharya.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
        © 2025 Dronacharya. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
