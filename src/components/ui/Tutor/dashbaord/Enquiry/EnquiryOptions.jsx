
// EnquiryOptions.js
// EnquiryOptions.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMessageSquare,
  FiArrowRight,
} from "react-icons/fi";

// Import the correct components
import AllEnquiries from "./AllEnuiries";
import MyClass from "./MyClass";
import FromStudentEnquiry from "./FromStudnetEnquiry";
import FollowUp from "./FollowUp";

// ✅ Main EnquiryOptions Component - No Data Dependency
const EnquiryOptions = () => {
  const [mainTab, setMainTab] = useState("enquiries");
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  // Main tabs
  const mainTabs = [
    // { key: "enquiries", label: "Enquiries" },
    // { key: "followUp", label: "Follow-up" },
  ];

  // Sub-filter options
  const enquiryFilters = [
    { key: "all", label: "All Enquiries", component: AllEnquiries },
    { key: "myClasses", label: "My Enquiries", component: MyClass },
    { key: "fromStudent", label: "From Student Enquiries", component: FromStudentEnquiry },
  ];

  // Get current component based on active view
  const getCurrentComponent = () => {
    if (mainTab === "followUp") {
      return FollowUp;
    } else {
      return enquiryFilters.find(filter => filter.key === activeFilter)?.component || AllEnquiries;
    }
  };

  const CurrentComponent = getCurrentComponent();

  // Get current view label for empty state
  const getCurrentViewLabel = () => {
    if (mainTab === "followUp") {
      return "follow-up enquiries";
    }
    return enquiryFilters.find(f => f.key === activeFilter)?.label.toLowerCase() || "enquiries";
  };

  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with View All button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {localStorage.getItem("role")?.toLowerCase() === "tutor"
              ? "Student Enquiries"
              : "Enquiries"}
          </h2>
          {/* <button
            onClick={() => navigate("/view_all_enquires")}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm font-medium border border-teal-600 px-4 py-2 rounded-lg hover:bg-teal-50 transition"
          >
            View All <FiArrowRight size={16} />
          </button> */}
        </div>

        {/* Main Tabs */}
        <div className="mb-6">
          <div className="flex gap-2">
            {mainTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setMainTab(tab.key);
                  if (tab.key === "followUp") {
                    setActiveFilter("all");
                  }
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition ${
                  mainTab === tab.key
                    ? "bg-teal-500 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-level Filter Tabs (only shown when mainTab is "enquiries") */}
        {mainTab === "enquiries" && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {enquiryFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeFilter === filter.key
                      ? "bg-teal-500 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Render Current Component - Each component handles its own data */}
        <div className="enquiry-content">
          <CurrentComponent />
        </div>
      </div>
    </section>
  );
};

export default EnquiryOptions;
