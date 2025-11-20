import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FindFilterSidebar from "./FindFilterSidebar";
import TutorCard from "./TutorCard";
import { searchTutors, recommendedTutors } from "../../../../api/services/tutorService";
import Layout from "../layout/MainLayout";
import subjectsData from "../../home/HomePageComponent/HomePage/subjectsData";

const initialFiltersFromYou = {
  name: "",
  subjects: [],
  classes: [],
  board: [],
  availability: [],
  languages: [],
  teaching_modes: [],
  experience: "",
  budgetMin: "",
  budgetMax: "",
  location: "",
  gender: "Any",
};

export default function FindTutorShow() {
  const [filters, setFilters] = useState(initialFiltersFromYou);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usingRecommended, setUsingRecommended] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const [demoFilters, setDemoFilters] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.demoFilters) {
      const demoData = location.state.demoFilters;
      setDemoFilters(demoData);
      setFilters(demoData);
      runSearch(demoData);
      window.history.replaceState({}, document.title);
    } else {
      runSearch(filters);
    }
  }, [location.state]);

  const runSearch = async (f) => {
    setLoading(true);
    setError("");
    try {
      const data = await searchTutors(f);
      setTutors(data);
      setUsingRecommended(false);
    } catch (e) {
      console.error("Search error:", e);
      setError(e?.response?.data?.message || e.message || "Failed to fetch tutors");
      setTutors([]);
    } finally {
      setLoading(false);
    }
  };

  const runRecommended = async (f) => {
    setLoading(true);
    setError("");
    try {
      const data = await recommendedTutors(f);
      setTutors(data);
      setUsingRecommended(true);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to fetch recommended tutors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("demoFilters");
    if (saved) {
      const parsed = JSON.parse(saved);
      setFilters(parsed);
      setDemoFilters(parsed);
      runSearch(parsed);
      localStorage.removeItem("demoFilters");
    }
  }, []);

  const onApplyFilters = (next) => {
    setFilters(next);
    setDemoFilters(null);
    runSearch(next);
  };

  const onClearFilters = (cleared) => {
    setFilters(cleared);
    setDemoFilters(null);
    runSearch(cleared);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-10"> 
        {/* added pt-20 so content starts below navbar */}
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0 flex items-center">
                <button
                  onClick={() => navigate("/student-dashboard")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-teal-600 text-teal-600 text-sm font-medium hover:bg-teal-50 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                    className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" />
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M5 10v10h14V10" />
                  </svg>
                  <span>Go to Dashboard</span>
                </button>
              </div>

              <div className="flex-1 flex flex-col items-center text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Find Your Perfect Tutor
                </h1>
                <p className="text-gray-600 mt-2 text-sm md:text-base max-w-xl">
                  Browse through our verified tutors and find the best match for your learning needs
                </p>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-80">
              <FindFilterSidebar
                defaultFilters={initialFiltersFromYou}
                onApplyFilters={onApplyFilters}
                onClearFilters={onClearFilters}
                subjectsData={subjectsData}
                demoData={demoFilters}
              />
            </div>

            {/* Results */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-md p-5 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {loading ? "Loading…" : `${tutors.length} Tutors`}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {demoFilters
                        ? "Based on your demo preferences"
                        : usingRecommended
                          ? "Based on your saved profile"
                          : "Matching your filters"}
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-800 border border-red-200 rounded-xl p-4 mb-4">
                  {error}
                </div>
              )}

              <div className="grid gap-4">
                {!loading && tutors.length === 0 && !error && (
                  <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                      No tutors found
                    </h3>
                    <p className="text-gray-500">Try adjusting your filters</p>
                  </div>
                )}

                {tutors.map((t) => (
                  <TutorCard key={t.user_id || t.id} tutor={t} />
                ))}

                {loading && (
                  <div className="bg-white rounded-2xl shadow-md p-6 text-gray-600">
                    Fetching tutors…
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
