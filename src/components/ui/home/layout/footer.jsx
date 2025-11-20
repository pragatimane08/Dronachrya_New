import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handlePlanClick = () => {
    navigate("/?openPlans=true");
  };

  return (
    <footer className="bg-[#0F172A] text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Description */}
        <div>
          <h3 className="text-white text-lg font-bold">
            <span className="text-[#35BAA3]">Drona</span>charya
          </h3>
          <p className="mt-2 text-sm">
            Connecting students with the best tutors across India. Find the
            perfect match for your learning needs.
          </p>
          <div className="flex space-x-4 mt-4 text-white text-lg">
            <a
              href="https://www.facebook.com/DronacharyaTutorialsindia"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f hover:text-[#35BAA3] transition-transform transform hover:scale-110" />
            </a>
            <a
              href="https://www.instagram.com/dronacharyatutorialsindia"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram hover:text-[#35BAA3] transition-transform transform hover:scale-110" />
            </a>
            <a
              href="https://www.linkedin.com/company/dlsllp"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin-in hover:text-[#35BAA3] transition-transform transform hover:scale-110" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-[#35BAA3]">
                Home
              </a>
            </li>
            <li>
              <a href="/aboutus" className="hover:text-[#35BAA3]">
                About Us
              </a>
            </li>
            <li>
              <a href="/find-instructor" className="hover:text-[#35BAA3]">
                Find Instructor
              </a>
            </li>
            <li>
              <button
                onClick={handlePlanClick}
                className="hover:text-[#35BAA3] text-left"
              >
                Subscription Plans
              </button>
            </li>
            <li>
              <a href="/contactus" className="hover:text-[#35BAA3]">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* For Users */}
        <div>
          <h4 className="text-white font-semibold mb-3">For Users</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/tutorreg" className="hover:text-[#35BAA3]">
                Tutor Registration
              </a>
            </li>
            <li>
              <a href="/login" className="hover:text-[#35BAA3]">
                Login
              </a>
            </li>
            <li>
              <a href="/Privacypolicy" className="hover:text-[#35BAA3]">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/TermsAndConditions" className="hover:text-[#35BAA3]">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-semibold mb-3">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <i className="fas fa-map-marker-alt text-[#35BAA3] mt-1" />
              <a
                href="https://www.google.com/maps?q=109+Manas+Square+Sugamau+Road+Indira+Nagar+Lucknow+UP+226016+India"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#35BAA3]"
              >
                109, Manas Square, Sugamau Road, Indira Nagar, Lucknow, UP
                226016, India
              </a>
            </li>
            <li className="flex items-center gap-3">
              <i className="fas fa-phone-alt text-[#35BAA3]" />
              <a
                href="tel:+919876543210"
                className="hover:text-[#35BAA3]"
              >
                +91 98765 43210
              </a>
            </li>
            <li className="flex items-center gap-3">
              <i className="fas fa-envelope text-[#35BAA3]" />
              <a
                href="mailto:info@dronacharya.com"
                className="hover:text-[#35BAA3]"
              >
              care@dronacharyatutorials.com

              </a>
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
