import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  ArrowRight,
  Code,
  Languages,
  X,
  School,
  Activity,
} from "lucide-react";

// Local images
import TutionImage from "../../../../../assets/img/tution.jpg";
import HobiesImage from "../../../../../assets/img/hobies.jpg";
import ExamCoachingImage from "../../../../../assets/img/examcoaching.jpg";
import LanguageImage from "../../../../../assets/img/language.jpg";
import HobbyImage from "../../../../../assets/img/hobies.jpg";
import ITImage from "../../../../../assets/img/itcourse.jpg";
import CollegeImage from "../../../../../assets/img/tution.jpg"; // using tution.jpg as per your request

// Categories array
const categories = [
  { title: "Class 12 Tuition", image: TutionImage, group: "Tuition", description: "CBSE/ICSE/State boards" },
  { title: "Class 11 Tuition", image: TutionImage, group: "Tuition", description: "Science/Commerce/Arts" },
  { title: "Class 10 Tuition", image: TutionImage, group: "Tuition", description: "Board exam preparation" },
  { title: "Class 9 Tuition", image: TutionImage, group: "Tuition", description: "Foundation for board exams" },
  { title: "Class 8 Tuition", image: TutionImage, group: "Tuition", description: "All subjects coaching" },
  { title: "Class 7 Tuition", image: TutionImage, group: "Tuition", description: "Comprehensive learning" },
  { title: "Class 6 Tuition", image: TutionImage, group: "Tuition", description: "Building strong basics" },
  { title: "Class I-V Tuition", image: TutionImage, group: "Tuition", description: "Primary education" },
  { title: "Nursery-KG Tuition", image: TutionImage, group: "Tuition", description: "Early childhood learning" },
  { title: "BTech Tuition", image: CollegeImage, group: "Tuition", description: "Engineering subjects" },
  { title: "BCom Tuition", image: CollegeImage, group: "Tuition", description: "Commerce subjects" },

  { title: "Spoken English", image: LanguageImage, group: "Languages", description: "Improve communication skills" },
  { title: "French Language", image: LanguageImage, group: "Languages", description: "Learn the language of love" },
  { title: "Spanish Language", image: LanguageImage, group: "Languages", description: "World's second most spoken language" },
  { title: "German Language", image: LanguageImage, group: "Languages", description: "Important European language" },
  { title: "Hindi Language", image: LanguageImage, group: "Languages", description: "India's national language" },
  { title: "IELTS Coaching", image: LanguageImage, group: "Languages", description: "Study abroad preparation" },
  { title: "TOEFL Coaching", image: LanguageImage, group: "Languages", description: "English proficiency test" },

  { title: "Singing", image: HobbyImage, group: "Hobbies", description: "Vocal training" },
  { title: "Yoga", image: HobbyImage, group: "Hobbies", description: "Mind and body wellness" },
  { title: "Dance", image: HobbyImage, group: "Hobbies", description: "Various dance forms" },
  { title: "Guitar", image: HobbyImage, group: "Hobbies", description: "String instrument training" },
  { title: "Personality Development", image: HobbyImage, group: "Hobbies", description: "Build confidence" },
  { title: "Cooking", image: HobbyImage, group: "Hobbies", description: "Culinary arts" },
  { title: "Photography", image: HobbyImage, group: "Hobbies", description: "Professional photography" },

  { title: "Python Training", image: ITImage, group: "IT Courses", description: "Popular programming language" },
  { title: "Java Training", image: ITImage, group: "IT Courses", description: "Object-oriented programming" },
  { title: "Web Development", image: ITImage, group: "IT Courses", description: "Frontend and backend" },
  { title: "Data Science", image: ITImage, group: "IT Courses", description: "AI, ML, Big Data" },
  { title: "Microsoft Excel", image: ITImage, group: "IT Courses", description: "Spreadsheet mastery" },

  { title: "CA Coaching", image: ExamCoachingImage, group: "Exam Coaching", description: "Chartered Accountancy" },
  { title: "Engineering Entrance", image: ExamCoachingImage, group: "Exam Coaching", description: "JEE/NEET preparation" },
  { title: "MBA Entrance", image: ExamCoachingImage, group: "Exam Coaching", description: "CAT/XAT coaching" },
  { title: "Bank Exam Coaching", image: ExamCoachingImage, group: "Exam Coaching", description: "IBPS/SBI preparation" },
  { title: "UPSC Coaching", image: ExamCoachingImage, group: "Exam Coaching", description: "Civil services preparation" },
];

// Group categories
const groupedCategories = categories.reduce((acc, curr) => {
  if (!acc[curr.group]) acc[curr.group] = [];
  acc[curr.group].push(curr);
  return acc;
}, {});

// Main categories
const mainCategories = [
  {
    title: "Tuition",
    description: "School and college tuition",
    image: TutionImage,
    icon: School,
    count: groupedCategories["Tuition"]?.length || 0,
    color: "#D4DEFF",
  },
  {
    title: "Languages",
    description: "Learn new languages",
    image: LanguageImage,
    icon: Languages,
    count: groupedCategories["Languages"]?.length || 0,
    color: "#FFD4D4",
  },
  {
    title: "Hobbies",
    description: "Creative and performing arts",
    image: HobiesImage,
    icon: Activity,
    count: groupedCategories["Hobbies"]?.length || 0,
    color: "#D4FFE0",
  },
  {
    title: "IT Courses",
    description: "Tech skills development",
    image: ITImage,
    icon: Code,
    count: groupedCategories["IT Courses"]?.length || 0,
    color: "#FFEED4",
  },
  {
    title: "Exam Coaching",
    description: "Competitive exam preparation",
    image: ExamCoachingImage,
    icon: GraduationCap,
    count: groupedCategories["Exam Coaching"]?.length || 0,
    color: "#E8D4FF",
  },
];

const ExploreCategories = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const fallbackImage = "https://picsum.photos/id/1/800/600";

  // In ExploreCategories component
  const handleLearnMoreClick = (course) => {
    navigate("/book-demo", {
      state: {
        subject: course.title,
        class: "",
        fromExploreCategories: true
      }
    });
   
    // Also store in localStorage for page refresh handling
    localStorage.setItem("cameFromExploreCategories", "true");
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = selectedCategory ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [selectedCategory]);

  return (
    <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 px-3 sm:px-4 md:px-5 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 font-[system-ui] min-h-screen">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 max-w-3xl md:max-w-4xl mx-auto">
        <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-white rounded-full shadow-lg mb-3 sm:mb-4 md:mb-5">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#426beb]" />
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight px-2">
          Find a Tutor for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2F4380] to-[#35BAA3]">
            Anything!
          </span>
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mx-auto px-3">
          Discover expert tutors for all your learning needs
        </p>
      </div>

      {/* Main Categories */}
      <div className="max-w-6xl md:max-w-5xl lg:max-w-7xl mx-auto">
        {/* Top 3 categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {mainCategories.slice(0, 3).map((cat, i) => {
            const isActive = selectedCategory === cat.title;
            const Icon = cat.icon;

            return (
              <div
                key={i}
                onClick={() => setSelectedCategory(isActive ? null : cat.title)}
                className={`group cursor-pointer transition-all duration-300 ${
                  isActive ? "ring-2 ring-[#2F4380] rounded-xl" : ""
                }`}
              >
                <div className="rounded-xl overflow-hidden shadow-sm bg-white h-full flex flex-col border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <div className="relative h-40 sm:h-44 md:h-48 lg:h-56">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => (e.target.src = fallbackImage)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 left-3 px-2 py-1 sm:px-2.5 sm:py-1.5 bg-white/30 text-white text-xs sm:text-sm rounded-full font-medium backdrop-blur-sm">
                      {cat.count} Courses
                    </div>
                    <div className="absolute top-3 right-3 p-2 bg-white/30 rounded-full backdrop-blur-sm">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  <div className="bg-white p-4 sm:p-5 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 line-clamp-1">
                        {cat.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                    <button
                      className={`w-full mt-3 sm:mt-4 py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
                        isActive
                          ? "bg-[#2F4380] text-white"
                          : "bg-[#B8C9FF] text-[#2F4380] hover:bg-[#AACBF8]"
                      }`}
                    >
                      {isActive ? "View Courses" : "Explore"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom 2 categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8 max-w-3xl md:max-w-4xl mx-auto">
          {mainCategories.slice(3, 5).map((cat, i) => {
            const isActive = selectedCategory === cat.title;
            const Icon = cat.icon;

            return (
              <div
                key={i + 3}
                onClick={() => setSelectedCategory(isActive ? null : cat.title)}
                className={`group cursor-pointer transition-all duration-300 ${
                  isActive ? "ring-2 ring-[#2F4380] rounded-xl" : ""
                }`}
              >
                <div className="rounded-xl overflow-hidden shadow-sm bg-white h-full flex flex-col border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <div className="relative h-40 sm:h-44 md:h-48 lg:h-56">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => (e.target.src = fallbackImage)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 left-3 px-2 py-1 sm:px-2.5 sm:py-1.5 bg-white/30 text-white text-xs sm:text-sm rounded-full font-medium backdrop-blur-sm">
                      {cat.count} Courses
                    </div>
                    <div className="absolute top-3 right-3 p-2 bg-white/30 rounded-full backdrop-blur-sm">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  <div className="bg-white p-4 sm:p-5 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 line-clamp-1">
                        {cat.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                    <button
                      className={`w-full mt-3 sm:mt-4 py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
                        isActive
                          ? "bg-[#2F4380] text-white"
                          : "bg-[#B8C9FF] text-[#2F4380] hover:bg-[#AACBF8]"
                      }`}
                    >
                      {isActive ? "View Courses" : "Explore"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-6xl md:max-w-4xl lg:max-w-6xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slideUp max-h-[95vh] sm:max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className="p-2 sm:p-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      mainCategories.find((c) => c.title === selectedCategory)
                        ?.color || "#D4DEFF",
                  }}
                >
                  {React.createElement(
                    mainCategories.find((c) => c.title === selectedCategory)
                      ?.icon || BookOpen,
                    { className: "w-5 h-5 sm:w-6 sm:h-6 text-[#2F4380]" }
                  )}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {selectedCategory}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">
                    Choose from our specialized courses
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
              </button>
            </div>

            {/* Subcategories */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {groupedCategories[selectedCategory]?.map((course, index) => (
                  <div
                    key={index}
                    className="group bg-white p-3 sm:p-4 md:p-5 border border-gray-200 rounded-lg sm:rounded-xl hover:shadow-sm transition-all hover:border-[#2F4380] cursor-pointer min-h-[100px] sm:min-h-[120px]"
                    style={{
                      backgroundColor:
                        (mainCategories.find(
                          (c) => c.title === selectedCategory
                        )?.color || "#D4DEFF") + "40",
                      borderColor:
                        mainCategories.find(
                          (c) => c.title === selectedCategory
                        )?.color || "#D4DEFF",
                    }}
                    onClick={() => handleLearnMoreClick(course)}
                  >
                    <div className="flex items-start gap-3 sm:gap-4 h-full">
                      <div className="flex-shrink-0">
                        <div
                          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor:
                              mainCategories.find(
                                (c) => c.title === selectedCategory
                              )?.color || "#D4DEFF",
                          }}
                        >
                          {React.createElement(
                            mainCategories.find(
                              (c) => c.title === selectedCategory
                            )?.icon || BookOpen,
                            { className: "w-5 h-5 sm:w-6 sm:h-6 text-white" }
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                        <div>
                          <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 group-hover:text-[#2F4380] line-clamp-2 leading-tight">
                            {course.title}
                          </h4>
                          <p className="text-xs sm:text-sm md:text-base text-gray-600 line-clamp-2 mt-1 sm:mt-2">
                            {course.description}
                          </p>
                        </div>
                        <div className="text-xs sm:text-sm md:text-base text-[#2F4380] flex items-center gap-1 sm:gap-2 mt-2 sm:mt-3">
                          <span>Learn More</span>
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 640px) {
          .cursor-pointer {
            min-height: 44px;
          }
        }

        @media (max-width: 480px) {
          .grid {
            gap: 1rem;
          }
        }

        @media (min-width: 481px) and (max-width: 768px) {
          .grid {
            gap: 1.1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default ExploreCategories;
