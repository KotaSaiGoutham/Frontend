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
      // The style prop passed by react-slick already contains positioning for `right`,
      // but if you explicitly set it here, it will override.
      // For mobile responsiveness, rely more on CSS classes.
      // Removed inline `right: "25px"` as it will be handled by CSS
      style={{ ...style, display: "block", zIndex: 1 }}
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
      // Similar to next arrow, remove inline `left: "25px"`
      style={{ ...style, display: "block", zIndex: 1 }}
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
const mobileOnlyBanners = ["/intro-banner8.jpg","/intro-banner9.jpg","/intro-banner10.jpg","/intro-banner11.jpg","/intro-banner12.jpg"];

const FlashBanner = () => {
  // Initialize `isMobileView` based on the current window width to prevent initial flicker
  const [isMobileView, setIsMobileView] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const bannersToDisplay = isMobileView
    ? mobileOnlyBanners
    : desktopBanners;

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
          arrows: true, // KEEP arrows visible on mobile
          dots: true, // KEEP dots visible on mobile
          infinite: true, // <--- **IMPORTANT CHANGE HERE: Set to true if you want looping**
          autoplay: false, // You might still want autoplay off for mobile
        },
      },
    ],
  };
  return (
    <section className="flash-banner">
      {bannersToDisplay.length > 0 ? (
        <Slider
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
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          Loading banners... or no banners available.
        </div>
      )}
    </section>
  );
};

export default FlashBanner;