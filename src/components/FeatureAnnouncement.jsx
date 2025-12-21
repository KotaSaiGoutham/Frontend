import React, { useState, useEffect } from "react";
import {
  Dialog,
  IconButton,
  Button,
  Typography,
  Box,
  Slide,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux"; // To access user state
import { FaTimes, FaRocket, FaArrowRight, FaStar, FaUserCircle } from "react-icons/fa";
import { isWithinInterval, parseISO } from "date-fns";

// --- FEATURE CONFIGURATION ---
// Define distinct feature sets for different roles and paths
const FEATURE_SETS = {
  faculty_dashboard: [
    {
      id: "fac_imp_files",
      title: "New: Important Files Library",
      description: "A centralized hub to upload, manage, and share crucial documents and resources with ease.",
      icon: <FaStar size={20} color="#ffffff" />,
      color: "#6366f1", 
      route: "/important-files",
      btnText: "Try Important Files",
      startDate: "2025-12-21",
      endDate: "2025-12-25"
    },
    {
      id: "fac_profile",
      title: "New: My Profile",
      description: "Access and manage your personal details and account settings in one place.",
      icon: <FaUserCircle size={20} color="#ffffff" />,
      color: "#10b981", 
      route: "/profile",
      btnText: "View Profile",
      startDate: "2025-12-21",
      endDate: "2025-12-23"
    }
  ],
  typist_students: [
    {
      id: "typ_profile",
      title: "New: My Profile",
      description: "Access and manage your personal details and account settings in one place.",
      icon: <FaUserCircle size={20} color="#ffffff" />,
      color: "#10b981", 
      route: (user) => `/employee/${user?.employeeId}`, // Dynamic route function
      btnText: "View Profile",
      startDate: "2025-12-21",
      endDate: "2025-12-23"
    }
  ]
};

// Transition Animation
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// --- STYLES ---
const styles = {
  dialogPaper: {
    borderRadius: "20px",
    padding: "0",
    background: "transparent",
    boxShadow: "none",
    overflow: "visible"
  },
  contentContainer: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "30px",
    position: "relative",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    overflow: "hidden"
  },
  blob: {
    position: "absolute",
    top: "-50px",
    right: "-50px",
    width: "150px",
    height: "150px",
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    borderRadius: "50%",
    opacity: 0.1,
    filter: "blur(40px)",
    zIndex: 0
  },
  header: {
    textAlign: "center",
    marginBottom: "24px",
    position: "relative",
    zIndex: 1
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
    borderRadius: "20px",
    color: "white",
    fontSize: "0.75rem",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "12px",
    boxShadow: "0 4px 10px rgba(99, 102, 241, 0.3)"
  },
  featureCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    padding: "16px",
    marginBottom: "12px",
    borderRadius: "16px",
    background: "#f8fafc",
    border: "1px solid #f1f5f9",
    transition: "all 0.2s ease",
    cursor: "pointer",
    position: "relative",
    zIndex: 1
  },
  iconBox: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
  },
  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    color: "#94a3b8",
    zIndex: 10
  }
};

const FeatureAnnouncement = () => {
  const [open, setOpen] = useState(false);
  const [activeFeatures, setActiveFeatures] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  
  // Get User info from Redux
  const { user } = useSelector((state) => state.auth); 

  useEffect(() => {
    if (user) {
      checkEligibility();
    }
  }, [user, location.pathname]); // Re-run if user or route changes

  const checkEligibility = () => {
    const now = new Date();
    let relevantFeatures = [];
    let campaignKey = "";

    // 1. Determine which feature set to use based on Role & Route
    if (user.role === "faculty" && location.pathname === "/dashboard") {
      relevantFeatures = FEATURE_SETS.faculty_dashboard;
      campaignKey = "faculty_dashboard_v2.5"; 
    } else if (user.role === "typist" && location.pathname === "/students") {
      relevantFeatures = FEATURE_SETS.typist_students;
      campaignKey = "typist_students_v2.5";
    } else {
      return; // No features for this role/route combination
    }

    // 2. Filter features by Date
    const validFeatures = relevantFeatures.filter((feature) => {
      return isWithinInterval(now, {
        start: parseISO(feature.startDate),
        end: parseISO(feature.endDate)
      });
    });

    if (validFeatures.length === 0) return;

    setActiveFeatures(validFeatures);

    // 3. Check LocalStorage (Unique key per role/context)
    const hasSeen = localStorage.getItem(`feature_seen_${campaignKey}`);

    if (!hasSeen) {
      setTimeout(() => {
        setOpen(true);
      }, 1500);
    }
  };

  const handleClose = () => {
    setOpen(false);
    // Determine key again to save (could be optimized, but safe here)
    let campaignKey = "";
    if (user.role === "faculty") campaignKey = "faculty_dashboard_v2.5";
    else if (user.role === "typist") campaignKey = "typist_students_v2.5";
    
    if(campaignKey) localStorage.setItem(`feature_seen_${campaignKey}`, "true");
  };

  const handleTryIt = (route) => {
    handleClose();
    // Resolve route if it's a function (for dynamic IDs)
    const finalRoute = typeof route === 'function' ? route(user) : route;
    navigate(finalRoute);
  };

  if (activeFeatures.length === 0) return null;

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{ style: styles.dialogPaper }}
      aria-labelledby="new-feature-dialog"
    >
      <div style={styles.contentContainer}>
        <div style={styles.blob} />

        <IconButton style={styles.closeBtn} onClick={handleClose}>
          <FaTimes />
        </IconButton>

        <div style={styles.header}>
          <div style={styles.badge}>
            <FaRocket /> New Update
          </div>
          <Typography variant="h4" fontWeight="800" color="#1e293b" gutterBottom>
            What's New
          </Typography>
          <Typography variant="body1" color="#64748b">
            Check out the latest features available to you now.
          </Typography>
        </div>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {activeFeatures.map((feature) => (
            <div 
              key={feature.id} 
              style={styles.featureCard}
              className="feature-hover"
            >
              <div style={{ ...styles.iconBox, background: feature.color }}>
                {feature.icon}
              </div>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="700" color="#1e293b" fontSize="1rem">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="#64748b" fontSize="0.875rem" sx={{ mt: 0.5, mb: 1.5 }}>
                  {feature.description}
                </Typography>
                
                <Button 
                  size="small" 
                  variant="text" 
                  endIcon={<FaArrowRight />}
                  onClick={() => handleTryIt(feature.route)}
                  sx={{ 
                    color: feature.color, 
                    fontWeight: "700", 
                    textTransform: "none", 
                    padding: 0,
                    '&:hover': { background: 'transparent', opacity: 0.8 }
                  }}
                >
                  {feature.btnText || "Try it out"}
                </Button>
              </Box>
            </div>
          ))}
        </Box>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={handleClose}
            sx={{ 
              borderRadius: "12px", 
              padding: "12px", 
              background: "#1e293b",
              fontWeight: "600",
              textTransform: "none",
              fontSize: "1rem"
            }}
          >
            Got it, thanks!
          </Button>
        </Box>
      </div>
      
      <style>{`
        .feature-hover:hover {
          background: #ffffff !important;
          border-color: #e2e8f0 !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }
      `}</style>
    </Dialog>
  );
};

export default FeatureAnnouncement;