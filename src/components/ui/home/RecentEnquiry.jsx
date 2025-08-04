import React from "react";
import tutor from "../../../assets/img/enquiry3.png";
import tutor1 from "../../../assets/img/enquiry5.png";

const enquiries = [
  {
    name: "Manisha Raina",
    role: "Tutor",
    image: tutor1,
    specialty: "Mathematics & Physics",
  },
  {
    name: "Bharat Shaha",
    role: "Student",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    specialty: "Computer Science",
  },
  {
    name: "Nllam Desai",
    role: "Tutor",
    image: "https://randomuser.me/api/portraits/men/85.jpg",
    specialty: "Chemistry & Biology",
  },
  {
    name: "Anita Kapoor",
    role: "Tutor",
    image: tutor,
    specialty: "English & Literature",
  },
];

const RecentEnquiry = () => {
  return (
    <section className="py-5 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-center px-4 mt-[10px] mb-5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-24 h-24 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-16 right-10 w-32 h-32 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent">
            Recent Enquiries
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with our latest tutors and students who have joined our learning community
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Enquiries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {enquiries.map((person, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-white/50 relative overflow-hidden"
              style={{
                animationDelay: `${index * 150}ms`,
                animation: 'fadeInUp 0.8s ease-out forwards'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Role badge */}
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
                person.role === 'Tutor'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}>
                {person.role}
              </div>

              <div className="relative z-10">
                {/* Profile Image */}
                <div className="relative mb-4">
                  <div className="w-24 h-24 mx-auto relative">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl group-hover:border-blue-200 transition-all duration-300"
                    />
                    <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
                  </div>
                  <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-2 border-blue-200/50 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500"></div>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                    {person.name}
                  </h3>

                  {person.specialty && (
                    <p className="text-sm md:text-base text-gray-500 font-medium">
                      {person.specialty}
                    </p>
                  )}

                  {/* Action Button */}
                  <div className="pt-3">
                    <button className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      person.role === 'Tutor'
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg'
                    } transform hover:scale-105`}>
                      {person.role === 'Tutor' ? 'View Profile' : 'Connect'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-8">
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            View All Enquiries
          </button>
        </div>
      </div>

      {/* Animation style */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </section>
  );
};

export default RecentEnquiry;
