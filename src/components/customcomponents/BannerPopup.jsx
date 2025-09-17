import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
// Import both desktop and mobile banners
// import bannerImage from "../../assets/90daysRevisionprogram.jpeg"; // Old desktop banner
import desktopBannerImage from "../../assets/90daysRevisionprogram.jpeg"; // Desktop banner
import mobileBannerImage from "../../assets/90daysRevisionprogram-mobile.jpeg"; // Assuming a new mobile banner image

const BannerPopup = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for banner closure status and set up a resize listener
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener("resize", handleResize);

    const hasClosedBanner = sessionStorage.getItem("bannerClosed");
    if (!hasClosedBanner) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", handleResize);
      };
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCloseBanner = () => {
    setShowBanner(false);
    sessionStorage.setItem("bannerClosed", "true");
  };

  const handleKnowMore = () => {
    handleCloseBanner();
    setTimeout(() => {
      navigate("/revision-program/details");
    }, 50);
  };

  const handleEnrollNow = () => {
    handleCloseBanner();
    setTimeout(() => {
      navigate("/revision-program/register");
    }, 50);
  };

  // Determine which banner to display
  const currentBanner = isMobile ? mobileBannerImage : desktopBannerImage;

  return (
    <Dialog
      open={showBanner}
      onClose={handleCloseBanner}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: "relative" }}>
        <IconButton
          aria-label="close"
          onClick={handleCloseBanner}
          size="small"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
            backgroundColor: "red",
            "&:hover": {
              backgroundColor: "darkred",
            },
            zIndex: 10,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        {/* Use the dynamically selected banner image */}
        <img
          src={currentBanner}
          alt="JEE Main 2026 - 90 Days One-to-One Online Revision Program"
          style={{ width: "100%", height: "auto", display: "block" }}
        />

        {/* Clickable areas - Conditional positioning */}
        {isMobile ? (
          <>
            {/* Mobile clickable areas */}
            <div
              onClick={handleKnowMore}
              style={{
                position: "absolute",
                left: "14%",
                top: "73%",
                width: "30%",
                height: "5%",
                cursor: "pointer",
                zIndex: 10,
              }}
              aria-label="Know More"
            />
            <div
              onClick={handleEnrollNow}
              style={{
                position: "absolute",
                right: "14%",
                top: "73%",
                width: "30%",
                height: "5%",
                cursor: "pointer",
                zIndex: 10,
              }}
              aria-label="Enroll Now"
            />
          </>
        ) : (
          <>
            {/* Desktop clickable areas */}
            <div
              onClick={handleKnowMore}
              style={{
                position: "absolute",
                right: "28%",
                top: "70%",
                width: "15%",
                height: "8%",
                cursor: "pointer",
                zIndex: 10,
              }}
              aria-label="Know More"
            />
            <div
              onClick={handleEnrollNow}
              style={{
                position: "absolute",
                right: "11%",
                top: "70%",
                width: "15%",
                height: "8%",
                cursor: "pointer",
                zIndex: 10,
              }}
              aria-label="Enroll Now"
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BannerPopup;