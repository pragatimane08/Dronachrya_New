// // src/pages/Home.js
// import React, { useState, useEffect, useRef } from "react";
// import Loader from "./Loader";
// import Layout from "../../layout/MainLayout"; 
// import HeroSection from "./HeroSection";
// import HowitWorks_tutor from "./HowItWorks_tutor";
// import HowitWorks_student from "./HowItWorks_student";
// import ExploreCategories from "./ExploreCategories";
// import RecentEnquiry from "./RecentEnquiry";
// import LookingToTeach from "./LookingToTeach";
// import TestimonialCard from "./TestimonialCard";

// const Home = () => {
//   const [loading, setLoading] = useState(true);
//   const exploreCategoriesRef = useRef(null);
//   const lookingToTeachRef = useRef(null); 

//   useEffect(() => {
//     // Simulate loading delay
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (loading) return;

//     const scrollToSection = () => {
//       // Check for hash first
//       const hash = window.location.hash;
      
//       // Scroll to ExploreCategories
//       if (hash === '#explore-categories' && exploreCategoriesRef.current) {
//         setTimeout(() => {
//           exploreCategoriesRef.current.scrollIntoView({ 
//             behavior: 'smooth',
//             block: 'start'
//           });
//         }, 100);
//       }
      
//       // Scroll to LookingToTeach
//       if (hash === '#looking-to-teach' && lookingToTeachRef.current) {
//         setTimeout(() => {
//           lookingToTeachRef.current.scrollIntoView({ 
//             behavior: 'smooth',
//             block: 'start'
//           });
//         }, 100);
//       }

//       // Check for query parameters
//       const urlParams = new URLSearchParams(window.location.search);
//       const scrollTo = urlParams.get('scrollTo');
      
//       if (scrollTo === 'explore-categories' && exploreCategoriesRef.current) {
//         setTimeout(() => {
//           exploreCategoriesRef.current.scrollIntoView({ 
//             behavior: 'smooth',
//             block: 'start'
//           });
//           window.history.replaceState({}, document.title, window.location.pathname);
//         }, 100);
//       }
      
//       if (scrollTo === 'looking-to-teach' && lookingToTeachRef.current) {
//         setTimeout(() => {
//           lookingToTeachRef.current.scrollIntoView({ 
//             behavior: 'smooth',
//             block: 'start'
//           });
//           window.history.replaceState({}, document.title, window.location.pathname);
//         }, 100);
//       }

//       // Check sessionStorage
//       if (sessionStorage.getItem('scrollToExploreCategories') === 'true' && exploreCategoriesRef.current) {
//         setTimeout(() => {
//           exploreCategoriesRef.current.scrollIntoView({ 
//             behavior: 'smooth',
//             block: 'start'
//           });
//           sessionStorage.removeItem('scrollToExploreCategories');
//         }, 100);
//       }
      
//       if (sessionStorage.getItem('scrollToLookingToTeach') === 'true' && lookingToTeachRef.current) {
//         setTimeout(() => {
//           lookingToTeachRef.current.scrollIntoView({ 
//             behavior: 'smooth',
//             block: 'start'
//           });
//           sessionStorage.removeItem('scrollToLookingToTeach');
//         }, 100);
//       }
//     };

//     scrollToSection();
    
//     // Listen for hash changes
//     window.addEventListener('hashchange', scrollToSection);
//     return () => window.removeEventListener('hashchange', scrollToSection);
//   }, [loading]);

//   if (loading) return <Loader />;

//   return (
//     <Layout>
//       <HeroSection />
//       <HowitWorks_tutor />
//       <section 
//         id="explore-categories" 
//         ref={exploreCategoriesRef}
//         style={{scrollMarginTop: '80px'}}
//       >
//         <ExploreCategories />
//       </section>
//       <HowitWorks_student />
//       <RecentEnquiry />
//       <section 
//         id="looking-to-teach" 
//         ref={lookingToTeachRef} // Add ref here
//         style={{scrollMarginTop: '80px'}}
//       >
//         <LookingToTeach />
//       </section>
//       <TestimonialCard />
//     </Layout>
//   );
// };

// export default Home;

// src/pages/Home.js
import React, { useState, useEffect, useRef } from "react";
import Loader from "./Loader";
import Layout from "../../layout/MainLayout";
import HeroSection from "./HeroSection";
import HowitWorks_tutor from "./HowItWorks_tutor";
import HowitWorks_student from "./HowItWorks_student";
import ExploreCategories from "./ExploreCategories";
import RecentEnquiry from "./RecentEnquiry";
import LookingToTeach from "./LookingToTeach";
import TestimonialCard from "./TestimonialCard";

const Home = () => {
  const [loading, setLoading] = useState(() => {
    // Show loader only on the first visit
    const hasVisited = sessionStorage.getItem("homeVisited");
    return !hasVisited; 
  });

  const exploreCategoriesRef = useRef(null);
  const lookingToTeachRef = useRef(null);

  useEffect(() => {
    if (loading) {
      // Mark that user has visited after showing loader
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("homeVisited", "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Scroll logic
  useEffect(() => {
    if (loading) return;

    const scrollToSection = () => {
      const hash = window.location.hash;

      if (hash === "#explore-categories" && exploreCategoriesRef.current) {
        setTimeout(() => {
          exploreCategoriesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }

      if (hash === "#looking-to-teach" && lookingToTeachRef.current) {
        setTimeout(() => {
          lookingToTeachRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }

      const urlParams = new URLSearchParams(window.location.search);
      const scrollTo = urlParams.get("scrollTo");

      if (scrollTo === "explore-categories" && exploreCategoriesRef.current) {
        setTimeout(() => {
          exploreCategoriesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          window.history.replaceState({}, document.title, window.location.pathname);
        }, 100);
      }

      if (scrollTo === "looking-to-teach" && lookingToTeachRef.current) {
        setTimeout(() => {
          lookingToTeachRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          window.history.replaceState({}, document.title, window.location.pathname);
        }, 100);
      }

      if (
        sessionStorage.getItem("scrollToExploreCategories") === "true" &&
        exploreCategoriesRef.current
      ) {
        setTimeout(() => {
          exploreCategoriesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          sessionStorage.removeItem("scrollToExploreCategories");
        }, 100);
      }

      if (
        sessionStorage.getItem("scrollToLookingToTeach") === "true" &&
        lookingToTeachRef.current
      ) {
        setTimeout(() => {
          lookingToTeachRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          sessionStorage.removeItem("scrollToLookingToTeach");
        }, 100);
      }
    };

    scrollToSection();

    window.addEventListener("hashchange", scrollToSection);
    return () => window.removeEventListener("hashchange", scrollToSection);
  }, [loading]);

  if (loading) return <Loader />;

  return (
    <Layout>
      <HeroSection />
      <HowitWorks_tutor />
      <section
        id="explore-categories"
        ref={exploreCategoriesRef}
        style={{ scrollMarginTop: "80px" }}
      >
        <ExploreCategories />
      </section>
      <HowitWorks_student />
      <RecentEnquiry />
      <section
        id="looking-to-teach"
        ref={lookingToTeachRef}
        style={{ scrollMarginTop: "80px" }}
      >
        <LookingToTeach />
      </section>
      <TestimonialCard />
    </Layout>
  );
};

export default Home;
