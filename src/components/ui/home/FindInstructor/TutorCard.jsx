import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { FiArrowLeft, FiMoreVertical, FiShare2 } from "react-icons/fi";

const TutorProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("profile"); // default tab
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const tutor = {
    name: "Dr. Neetu",
    image: "https://via.placeholder.com/150",
    mode: "Online Classes",
    experience: 10,
    location: "Vidhyadhar Nagar Sector 5, Jaipur, India - 302039",
    lastActive: "Within 6 months",
    education: [
      {
        degree: "Master of Science (M.Sc.)",
        year: 2012,
        university: "Rajasthan University",
      },
      {
        degree: "Doctor of Philosophy (Ph.D.)",
        year: 2015,
        university: "Rajasthan University",
      },
    ],
    verifiedInfo: [
      "ID Verified",
      "Education Verified",
      "Phone Verified",
      "Email Verified",
    ],
    taughtSchools: ["Biyani Girls College, Vidyadhar Nagar Naya Khera, Jaipur"],
    classLocation: {
      online: true,
      studentHome: false,
      tutorHome: false,
    },
    bscExperienceYears: 10,
    bscSubjects:
      "Cell Biology, Plant Biotechnology, Ecology and Phytogeography, Environmental Management / Bioinformatics, Reproductive Biology of Angiosperms, Biology: Introduction to Biology with Practicals, Technical writing and Communication in English / Computational skills, Biodiversity, Chemistry, Molecular Biology, Plant Resource Utilization, Plant Development and Anatomy, Plant Systematics & Evolution, Plant Physiology, Genetics & Genomics, Plant Metabolism & Biochemistry",
    schoolOrCollegeExperience: "10 years experience in teaching at college level.",
    classType: "Regular Classes",
    classStrength: "Group Classes, One on one/ Private Tuitions",
    taughtInSchool: true,
    bscBranch: "BSc Botany",
    detailedTeachingExperience: "10 years experience in teaching M.Sc. and B.Sc. Botany.",
    overview:
      "I am an Experienced faculty of Science with PhD in Botany. I have more than 10 years of experience in teaching B.SC & M.Sc students. I have vast experience in Online teaching and Home tuitions for (science, EVS, Hindi, Maths) grade 1-5, and Botany, Microbiology, Plant Pathology, Plant Taxonomy, Environmental Science for B.Sc and M.Sc students.",
    languages: [
      { name: "Hindi", level: "Mother Tongue (Native)" },
      { name: "English", level: "Basic" },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      {/* Subject Header with Menu */}
      <div className="flex justify-between items-center border-b py-3 px-4 bg-gray-50 mb-4">
        <div className="flex items-center gap-3">
          <FiArrowLeft className="text-xl cursor-pointer" />
          <span className="font-medium">BSc Tuition</span>
        </div>

        <div className="flex items-center gap-4 relative">
          <FiShare2 className="text-gray-500 cursor-pointer" />

          <div className="relative">
            <FiMoreVertical
              className="text-gray-500 cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border z-50">
                <button
                  onClick={() => {
                    setReportOpen(true);
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Report this profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {reportOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px] shadow-xl relative">
            <button
              onClick={() => setReportOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h2 className="text-lg font-semibold mb-3">
              Is this listing inaccurate or duplicate? Any other problem?
            </h2>
            <textarea
              placeholder="Please tell us about the problem and we will fix it."
              className="w-full border rounded-md p-3 h-28 mb-4"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="flex gap-6 mb-6">
        <img
          src={tutor.image}
          alt={tutor.name}
          className="w-28 h-28 rounded-lg object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{tutor.name}</h2>
          <p className="text-teal-600 font-semibold">{tutor.mode}</p>
          <p className="text-gray-600">{tutor.experience} yrs of Exp</p>
          <p className="text-gray-600">{tutor.location}</p>
          <p className="text-gray-500 text-sm">
            Last Active - {tutor.lastActive}
          </p>

          {/* Contact Buttons */}
          <div className="mt-4">
            <p className="text-gray-600 mb-2">
              Contact to Book a Free Demo Class.
            </p>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                <FaEnvelope className="text-sm" />{" "}
                <span className="font-medium">Message</span>
              </button>
              <button className="flex items-center gap-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50">
                <FaPhone className="text-sm" />{" "}
                <span className="font-medium">Call</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6 flex gap-6">
        <button
          className={`pb-2 ${
            activeTab === "profile"
              ? "border-b-2 border-teal-500 text-teal-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`pb-2 ${
            activeTab === "classes"
              ? "border-b-2 border-teal-500 text-teal-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("classes")}
        >
          Classes
        </button>
        <button
          className={`pb-2 ${
            activeTab === "reviews"
              ? "border-b-2 border-teal-500 text-teal-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && (
        <>
          {/* Overview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Overview</h3>
            <p className="text-gray-700">{tutor.overview}</p>
          </div>

          {/* Languages */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Languages Spoken</h3>
            {tutor.languages.map((lang, idx) => (
              <div
                key={idx}
                className="flex justify-between text-gray-700 mb-1"
              >
                <span>{lang.name}</span>
                <span>{lang.level}</span>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Education</h3>
            <ul className="list-disc list-inside text-gray-700">
              {tutor.education.map((edu, idx) => (
                <li key={idx}>
                  {edu.university} - {edu.degree} ({edu.year})
                </li>
              ))}
            </ul>
          </div>

          {/* Address */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Address</h3>
            <p className="text-gray-700">{tutor.location}</p>
          </div>

          {/* Classes Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Class Location</h3>
            <div className="text-gray-700 space-y-1">
              <p className="flex items-center gap-2">
                {tutor.classLocation.online ? (
                  <FaCheckCircle className="text-green-600" />
                ) : (
                  <FaTimesCircle className="text-red-500" />
                )}
                Online Classes
              </p>
              <p className="flex items-center gap-2">
                {tutor.classLocation.studentHome ? (
                  <FaCheckCircle className="text-green-600" />
                ) : (
                  <FaTimesCircle className="text-red-500" />
                )}
                Student's Home
              </p>
              <p className="flex items-center gap-2">
                {tutor.classLocation.tutorHome ? (
                  <FaCheckCircle className="text-green-600" />
                ) : (
                  <FaTimesCircle className="text-red-500" />
                )}
                Tutor's Home
              </p>
            </div>
          </div>

          <p className="mb-2">
            <strong>Years of Experience in BSc Tuition:</strong>{" "}
            {tutor.bscExperienceYears}
          </p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">BSc Botany Subjects</h3>
            <p className="text-gray-700">{tutor.bscSubjects}</p>
          </div>

          <p>
            <strong>Experience in School or College:</strong>{" "}
            {tutor.schoolOrCollegeExperience}
          </p>
          <p>
            <strong>Type of Class:</strong> {tutor.classType}
          </p>
          <p>
            <strong>Class Strength:</strong> {tutor.classStrength}
          </p>
          <p>
            <strong>Taught in School or College:</strong>{" "}
            {tutor.taughtInSchool ? "Yes" : "No"}
          </p>
          <p>
            <strong>BSc Branch:</strong> {tutor.bscBranch}
          </p>
          <p>
            <strong>Detailed Teaching Experience:</strong>{" "}
            {tutor.detailedTeachingExperience}
          </p>

          {/* Reviews Section */}
          <div className="mb-6 mt-6">
            <h3 className="text-lg font-semibold mb-2">Reviews</h3>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-gray-700">No Reviews yet!</p>
              <a
                href="#"
                className="text-blue-600 font-medium hover:underline"
              >
                Be the first one to Review
              </a>
            </div>
          </div>
        </>
      )}

      {/* Classes Tab */}
      {activeTab === "classes" && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Class Location</h3>
            <div className="text-gray-700 space-y-1">
              <p className="flex items-center gap-2">
                {tutor.classLocation.online ? (
                  <FaCheckCircle className="text-green-600" />
                ) : (
                  <FaTimesCircle className="text-red-500" />
                )}
                Online Classes
              </p>
              <p className="flex items-center gap-2">
                {tutor.classLocation.studentHome ? (
                  <FaCheckCircle className="text-green-600" />
                ) : (
                  <FaTimesCircle className="text-red-500" />
                )}
                Student's Home
              </p>
              <p className="flex items-center gap-2">
                {tutor.classLocation.tutorHome ? (
                  <FaCheckCircle className="text-green-600" />
                ) : (
                  <FaTimesCircle className="text-red-500" />
                )}
                Tutor's Home
              </p>
            </div>
          </div>

          <p className="mb-2">
            <strong>Years of Experience in BSc Tuition:</strong>{" "}
            {tutor.bscExperienceYears}
          </p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">BSc Botany Subjects</h3>
            <p className="text-gray-700">{tutor.bscSubjects}</p>
          </div>

          <p>
            <strong>Experience in School or College:</strong>{" "}
            {tutor.schoolOrCollegeExperience}
          </p>
          <p>
            <strong>Type of Class:</strong> {tutor.classType}
          </p>
          <p>
            <strong>Class Strength:</strong> {tutor.classStrength}
          </p>
          <p>
            <strong>Taught in School or College:</strong>{" "}
            {tutor.taughtInSchool ? "Yes" : "No"}
          </p>
          <p>
            <strong>BSc Branch:</strong> {tutor.bscBranch}
          </p>
          <p>
            <strong>Detailed Teaching Experience:</strong>{" "}
            {tutor.detailedTeachingExperience}
          </p>
        </>
      )}

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Reviews</h3>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="text-gray-700">No Reviews yet!</p>
            <a href="#" className="text-blue-600 font-medium hover:underline">
              Be the first one to Review
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorProfile;
