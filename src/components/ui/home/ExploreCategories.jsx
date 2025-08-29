import React, { useState } from "react";
import {
  BookOpen,
  GraduationCap,
  ArrowRight,
  Code,
  Languages,
  X,
  School,
  Activity
} from "lucide-react";

// Using Picsum for reliable placeholder images
const SchoolImg = "https://picsum.photos/id/201/800/600";
const LanguageImg = "https://picsum.photos/id/60/800/600";
const HobbyImg = "https://picsum.photos/id/96/800/600";
const ITImg = "https://picsum.photos/id/0/800/600";
const ExamImg = "https://picsum.photos/id/25/800/600";
const CollegeImg = "https://picsum.photos/id/26/800/600";

const categories = [
  // Tuition Categories
  { title: "Class 12 Tuition", image: SchoolImg, group: "Tuition", description: "CBSE/ICSE/State boards" },
  { title: "Class 11 Tuition", image: SchoolImg, group: "Tuition", description: "Science/Commerce/Arts" },
  { title: "Class 10 Tuition", image: SchoolImg, group: "Tuition", description: "Board exam preparation" },
  { title: "Class 9 Tuition", image: SchoolImg, group: "Tuition", description: "Foundation for board exams" },
  { title: "Class 8 Tuition", image: SchoolImg, group: "Tuition", description: "All subjects coaching" },
  { title: "Class 7 Tuition", image: SchoolImg, group: "Tuition", description: "Comprehensive learning" },
  { title: "Class 6 Tuition", image: SchoolImg, group: "Tuition", description: "Building strong basics" },
  { title: "Class I-V Tuition", image: SchoolImg, group: "Tuition", description: "Primary education" },
  { title: "Nursery-KG Tuition", image: SchoolImg, group: "Tuition", description: "Early childhood learning" },
  { title: "BTech Tuition", image: CollegeImg, group: "Tuition", description: "Engineering subjects" },
  { title: "BCom Tuition", image: CollegeImg, group: "Tuition", description: "Commerce subjects" },
  
  // Languages
  { title: "Spoken English", image: LanguageImg, group: "Languages", description: "Improve communication skills" },
  { title: "French Language", image: LanguageImg, group: "Languages", description: "Learn the language of love" },
  { title: "Spanish Language", image: LanguageImg, group: "Languages", description: "World's second most spoken language" },
  { title: "German Language", image: LanguageImg, group: "Languages", description: "Important European language" },
  { title: "Hindi Language", image: LanguageImg, group: "Languages", description: "India's national language" },
  { title: "IELTS Coaching", image: LanguageImg, group: "Languages", description: "Study abroad preparation" },
  { title: "TOEFL Coaching", image: LanguageImg, group: "Languages", description: "English proficiency test" },
  
  // Hobby Classes
  { title: "Singing", image: HobbyImg, group: "Hobbies", description: "Vocal training" },
  { title: "Yoga", image: HobbyImg, group: "Hobbies", description: "Mind and body wellness" },
  { title: "Dance", image: HobbyImg, group: "Hobbies", description: "Various dance forms" },
  { title: "Guitar", image: HobbyImg, group: "Hobbies", description: "String instrument training" },
  { title: "Personality Development", image: HobbyImg, group: "Hobbies", description: "Build confidence" },
  { title: "Cooking", image: HobbyImg, group: "Hobbies", description: "Culinary arts" },
  { title: "Photography", image: HobbyImg, group: "Hobbies", description: "Professional photography" },
  
  // IT Courses
  { title: "Python Training", image: ITImg, group: "IT Courses", description: "Popular programming language" },
  { title: "Java Training", image: ITImg, group: "IT Courses", description: "Object-oriented programming" },
  { title: "Web Development", image: ITImg, group: "IT Courses", description: "Frontend and backend" },
  { title: "Data Science", image: ITImg, group: "IT Courses", description: "AI, ML, Big Data" },
  { title: "Microsoft Excel", image: ITImg, group: "IT Courses", description: "Spreadsheet mastery" },
  
  // Exam Coaching
  { title: "CA Coaching", image: ExamImg, group: "Exam Coaching", description: "Chartered Accountancy" },
  { title: "Engineering Entrance", image: ExamImg, group: "Exam Coaching", description: "JEE/NEET preparation" },
  { title: "MBA Entrance", image: ExamImg, group: "Exam Coaching", description: "CAT/XAT coaching" },
  { title: "Bank Exam Coaching", image: ExamImg, group: "Exam Coaching", description: "IBPS/SBI preparation" },
  { title: "UPSC Coaching", image: ExamImg, group: "Exam Coaching", description: "Civil services preparation" }
];

const groupedCategories = categories.reduce((acc, curr) => {
  if (!acc[curr.group]) acc[curr.group] = [];
  acc[curr.group].push(curr);
  return acc;
}, {});

const mainCategories = [
  {
    title: "Tuition",
    description: "School and college tuition",
    image: SchoolImg,
    icon: School,
    count: groupedCategories["Tuition"]?.length || 0,
    color: "#D4DEFF"
  },
  {
    title: "Languages",
    description: "Learn new languages",
    image: LanguageImg,
    icon: Languages,
    count: groupedCategories["Languages"]?.length || 0,
    color: "#FFD4D4"
  },
  {
    title: "Hobbies",
    description: "Creative and performing arts",
    image: HobbyImg,
    icon: Activity,
    count: groupedCategories["Hobbies"]?.length || 0,
    color: "#D4FFE0"
  },
  {
    title: "IT Courses",
    description: "Tech skills development",
    image: ITImg,
    icon: Code,
    count: groupedCategories["IT Courses"]?.length || 0,
    color: "#FFEED4"
  },
  {
    title: "Exam Coaching",
    description: "Competitive exam preparation",
    image: ExamImg,
    icon: GraduationCap,
    count: groupedCategories["Exam Coaching"]?.length || 0,
    color: "#E8D4FF"
  }
];

const ExploreCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showRegistrationMessage, setShowRegistrationMessage] = useState(false);

  // Fallback image in case of loading errors
  const fallbackImage = "https://picsum.photos/id/1/800/600";

  const handleLearnMoreClick = () => {
    setShowRegistrationMessage(true);
    
    // Redirect to location selector after 2 seconds
    setTimeout(() => {
      window.location.href = "/book-demo";
    }, 2000);
  };

  return (
    <section id="explore-categories" className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 px-4 py-12 sm:py-14 font-[system-ui]">
      {/* Header */}
      <div className="text-center mb-10 md:mb-12 max-w-4xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-lg mb-4 sm:mb-5">
          <BookOpen className="w-6 h-6 text-[#426beb]" />
        </div>
        <h2 className="text-3xl sm:text-2xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
          Find a Tutor for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2F4380] to-[#35BAA3]">Anything!</span>
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 mx-auto">
          Discover expert tutors for all your learning needs
        </p>
      </div>

      {/* Main Category Cards */}
      <div className="max-w-7xl mx-auto">
        {/* First Row - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-6 lg:mb-8 px-4 sm:px-6">
          {mainCategories.slice(0, 3).map((cat, i) => {
            const isActive = selectedCategory === cat.title;
            const Icon = cat.icon;
            return (
              <div
                key={i}
                onClick={() => setSelectedCategory(isActive ? null : cat.title)}
                className={`group cursor-pointer transition-all duration-300 ${isActive ? "ring-2 ring-[#2F4380] rounded-xl" : ""}`}
              >
                <div className={`rounded-xl overflow-hidden shadow-sm bg-white h-full flex flex-col border border-gray-100 hover:shadow-md transition-shadow duration-300`}>
                  <div className="relative h-48 sm:h-56">
                    <img 
                      src={cat.image} 
                      alt={cat.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.src = fallbackImage;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/30 text-white text-xs sm:text-sm rounded-full font-medium backdrop-blur-sm">
                      {cat.count} Courses
                    </div>
                    <div className="absolute top-3 right-3 p-2 bg-white/30 rounded-full backdrop-blur-sm">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  <div className="bg-white p-4 sm:p-5 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 line-clamp-1">{cat.title}</h3>
                      <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 line-clamp-2">{cat.description}</p>
                    </div>
                    <button 
                      className={`w-full mt-3 sm:mt-4 py-2 sm:py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${isActive ? "bg-[#2F4380] text-white" : "bg-[#B8C9FF] text-[#2F4380] hover:bg-[#AACBF8]"}`}
                    >
                      {isActive ? "View Courses" : "Explore"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Second Row - 2 Centered Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 px-4 sm:px-6 max-w-4xl mx-auto">
          {mainCategories.slice(3, 5).map((cat, i) => {
            const isActive = selectedCategory === cat.title;
            const Icon = cat.icon;
            return (
              <div
                key={i + 3}
                onClick={() => setSelectedCategory(isActive ? null : cat.title)}
                className={`group cursor-pointer transition-all duration-300 ${isActive ? "ring-2 ring-[#2F4380] rounded-xl" : ""}`}
              >
                <div className={`rounded-xl overflow-hidden shadow-sm bg-white h-full flex flex-col border border-gray-100 hover:shadow-md transition-shadow duration-300`}>
                  <div className="relative h-48 sm:h-56">
                    <img 
                      src={cat.image} 
                      alt={cat.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.src = fallbackImage;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/30 text-white text-xs sm:text-sm rounded-full font-medium backdrop-blur-sm">
                      {cat.count} Courses
                    </div>
                    <div className="absolute top-3 right-3 p-2 bg-white/30 rounded-full backdrop-blur-sm">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  <div className="bg-white p-4 sm:p-5 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 line-clamp-1">{cat.title}</h3>
                      <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 line-clamp-2">{cat.description}</p>
                    </div>
                    <button 
                      className={`w-full mt-3 sm:mt-4 py-2 sm:py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${isActive ? "bg-[#2F4380] text-white" : "bg-[#B8C9FF] text-[#2F4380] hover:bg-[#AACBF8]"}`}
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

      {/* Subcategories View */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center p-0 sm:p-4">
          <div className="w-full max-w-6xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slideUp max-h-[85vh] sm:max-h-[90vh] overflow-hidden">
            <div className="p-6 max-h-[calc(85vh-48px)] sm:max-h-[calc(90vh-48px)] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pt-2 pb-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div 
                    className="p-2 sm:p-2.5 rounded-full"
                    style={{ backgroundColor: mainCategories.find(c => c.title === selectedCategory)?.color || "#D4DEFF" }}
                  >
                    {React.createElement(
                      mainCategories.find(c => c.title === selectedCategory)?.icon || BookOpen,
                      { className: "w-5 h-5 sm:w-6 sm:h-6 text-[#2F4380]" }
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedCategory}</h3>
                    <p className="text-sm sm:text-base text-gray-600">Choose from our specialized courses</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCategory(null)} 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pb-4">
                {groupedCategories[selectedCategory]?.map((course, index) => (
                  <div
                    key={index}
                    className="group bg-white p-4 sm:p-5 border border-gray-200 rounded-xl hover:shadow-sm transition-all hover:border-[#2F4380] cursor-pointer"
                    style={{ 
                      backgroundColor: mainCategories.find(c => c.title === selectedCategory)?.color + "40" || "#D4DEFF40",
                      borderColor: mainCategories.find(c => c.title === selectedCategory)?.color || "#D4DEFF"
                    }}
                    onClick={handleLearnMoreClick}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0">
                        <div 
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: mainCategories.find(c => c.title === selectedCategory)?.color || "#D4DEFF" }}
                        >
                          {React.createElement(
                            mainCategories.find(c => c.title === selectedCategory)?.icon || BookOpen,
                            { className: "w-6 h-6 text-white" }
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-[#2F4380] line-clamp-1">{course.title}</h4>
                        <p className="text-sm sm:text-base text-gray-600 line-clamp-1 sm:line-clamp-2">{course.description}</p>
                        <div className="text-sm sm:text-base text-[#2F4380] flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                          <span>Learn More</span>
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
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

      {/* Registration Message Modal */}
      {showRegistrationMessage && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full animate-scaleIn">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Registration Required</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Please register as a student to access our courses. Redirecting to location selection...
                </p>
              </div>
              <div className="mt-6">
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Loading...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
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
      `}</style>
    </section>
  );
};

export default ExploreCategories;