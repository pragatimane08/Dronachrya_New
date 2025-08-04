// Loader.js
import React from 'react';

const Loader = () => {
  const text = 'Welcome To Dronacharya';

  return (
    <>
      <style>
        {`
          @keyframes fade-in-letter {
            0% {
              opacity: 0;
              transform: translateX(-10px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-fade-in-letter {
            animation: fade-in-letter 0.4s ease-out forwards;
          }

          /* Responsive adjustments */
          @media (max-width: 640px) {
            .responsive-text {
              font-size: 2rem !important;
              line-height: 2.5rem !important;
            }
          }
          @media (max-width: 480px) {
            .responsive-text {
              font-size: 1.75rem !important;
              line-height: 2.25rem !important;
            }
          }
          @media (max-width: 360px) {
            .responsive-text {
              font-size: 1.5rem !important;
              line-height: 2rem !important;
            }
          }
        `}
      </style>

      <div className="flex items-center justify-center h-screen bg-white px-4">
        <h1 
          className="text-3xl md:text-5xl font-bold flex gap-1 flex-wrap justify-center responsive-text" 
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          {text.split('').map((char, index) => (
            <span
              key={index}
              className="inline-block opacity-0 animate-fade-in-letter"
              style={{
                animationDelay: `${index * 0.05}s`,
                animationFillMode: 'forwards',
                color: index >= 11 && index <= 13 ? '#35BAA3' : '#4B38EF',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
      </div>
    </>
  );
};

export default Loader;
