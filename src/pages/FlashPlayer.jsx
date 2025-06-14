import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./FlashPlayer.css";

// Custom Arrow Components (no change needed here)
const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow next-arrow`}
      style={{ ...style, display: "block", right: "25px", zIndex: 1 }}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/>
      </svg>
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow prev-arrow`}
      style={{ ...style, display: "block", left: "25px", zIndex: 1 }}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.41 16.59l-4.58-4.59 4.58-4.59L14 5.41l-6 6 6 6z"/>
      </svg>
    </div>
  );
};

// Define desktop-specific banners
const desktopBanners = [
  "/intro-banner.jpg",
  "/intro-banner2.jpg",
  "/intro-banner3.jpg",
  "/intro-banner4.jpg",
  "/intro-banner5.jpg",
  "/intro-banner6.jpg",
  "/intro-banner7.jpg",
];

// Define the mobile-only banner
const mobileOnlyBanner = ["/intro-banner8.jpg"];

const FlashBanner = () => {
  // Initialize `isMobileView` based on the current window width to prevent initial flicker
  // `typeof window !== 'undefined'` is for server-side rendering compatibility
  const [isMobileView, setIsMobileView] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Determine which set of banners to display
  const bannersToDisplay = isMobileView
    ? mobileOnlyBanner // Only show banner 8 on mobile
    : desktopBanners; // Show all other banners on desktop
    console.log("bannersToDisplay",bannersToDisplay)

  // Base settings for the Slider.
  // These are the defaults that will apply unless overridden by `responsive` settings.
  const baseSliderSettings = {
    dots: true,
    infinite: true, // Default for desktop (multiple banners)
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Default for desktop (multiple banners)
    autoplaySpeed: 5000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    // Responsive settings that apply when the viewport width hits the breakpoint
    responsive: [
      {
        breakpoint: 768, // For screens 768px wide or less
        settings: {
          arrows: true, // KEEP arrows visible on mobile (as requested)
          dots: true, // KEEP dots visible on mobile (as requested)
          infinite: false, // Important: Disable infinite scroll for single mobile banner
          autoplay: false, // Important: Disable autoplay for single mobile banner
        },
      },
    ],
  };

  // --- Debugging Logs ---
  console.log("Current View (isMobileView):", isMobileView);
  console.log("Banners selected for display:", bannersToDisplay);
  console.log("Number of banners to display:", bannersToDisplay.length);
  // --- End Debugging Logs ---

  return (
    <section className="flash-banner">
      {/* Only render the Slider if there are banners to display to prevent errors */}
      {bannersToDisplay.length > 0 ? (
        <Slider
          // Use a key to force React Slick to re-initialize when the set of banners changes.
          // This is critical for it to pick up the new set of slides.
          key={isMobileView ? 'mobile-banner-set' : 'desktop-banner-set'}
          {...baseSliderSettings}
        >
          {bannersToDisplay.map((src, index) => (
            <div key={index} className="slide-wrapper">
              <img src={src} alt={`Banner ${index + 1}`} className="banner-img" />
            </div>
          ))}
        </Slider>
      ) : (
        // Optional: A fallback for when no banners are loaded (e.g., during initial state or if paths are wrong)
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          Loading banners... or no banners available.
        </div>
      )}
    </section>
  );
};

export default FlashBanner;