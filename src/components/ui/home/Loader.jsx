import React from "react";

const Loader = () => {
  const text = "Welcome To Dronacharya";

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

          /* Base styles */
          .responsive-text {
            font-size: 4rem;
            line-height: 4.5rem;
            letter-spacing: 0.02em;
          }

          /* Large tablets and small desktops (1024px and down) */
          @media (max-width: 1024px) {
            .responsive-text {
              font-size: 3.5rem !important;
              line-height: 4rem !important;
            }
          }

          /* Tablets portrait (768px and down) */
          @media (max-width: 768px) {
            .responsive-text {
              font-size: 3rem !important;
              line-height: 3.5rem !important;
              letter-spacing: 0.01em !important;
            }
          }

          /* Small tablets and large phones (640px and down) */
          @media (max-width: 640px) {
            .responsive-text {
              font-size: 2.5rem !important;
              line-height: 3rem !important;
              letter-spacing: 0 !important;
            }
          }

          /* Most phones (480px and down) */
          @media (max-width: 480px) {
            .responsive-text {
              font-size: 2rem !important;
              line-height: 2.5rem !important;
            }
          }

          /* iPhone 14/13/12 Pro Max */
          @media (max-width: 430px) {
            .responsive-text {
              font-size: 1.875rem !important;
              line-height: 2.25rem !important;
            }
          }

          /* iPhone 14/13/12/11 */
          @media (max-width: 390px) {
            .responsive-text {
              font-size: 1.75rem !important;
              line-height: 2.125rem !important;
            }
          }

          /* Small phones and iPhone SE */
          @media (max-width: 360px) {
            .responsive-text {
              font-size: 1.625rem !important;
              line-height: 2rem !important;
            }
          }

          /* Very small phones */
          @media (max-width: 320px) {
            .responsive-text {
              font-size: 1.5rem !important;
              line-height: 1.875rem !important;
            }
          }

          /* Landscape orientation for phones */
          @media (max-height: 500px) and (orientation: landscape) {
            .responsive-text {
              font-size: 1.75rem !important;
              line-height: 2rem !important;
            }
            .loader-container {
              padding: 1rem !important;
            }
          }

          /* Ultra-wide screens */
          @media (min-width: 1920px) {
            .responsive-text {
              font-size: 5rem !important;
              line-height: 5.5rem !important;
            }
          }
        `}
      </style>

      <div className="loader-container flex items-center justify-center min-h-screen bg-white px-2 py-8">
        <div className="text-center w-full overflow-x-auto">
          <h1
            className="responsive-text font-bold inline-flex justify-center items-center"
            style={{
              fontFamily:
                'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            {text.split("").map((char, index) => (
              <span
                key={index}
                className="inline-block opacity-0 animate-fade-in-letter"
                style={{
                  animationDelay: `${index * 0.05}s`,
                  animationFillMode: "forwards",
                  color: index >= 11 && index <= 13 ? "#35BAA3" : "#4B38EF",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
        </div>
      </div>
    </>
  );
};

export default Loader;
