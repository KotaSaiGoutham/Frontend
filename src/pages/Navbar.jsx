import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, getUserProfileIcon } from "../redux/actions";
import "./Navbar.css";
import { FaDownload, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import NotificationBell from "../components/NotificationBell";
import { Capacitor } from '@capacitor/core';
import { Avatar, Skeleton, Box, Typography } from "@mui/material";

const PROTECTED_BASE_PATHS = [
  "/important-files", "/profile", "/dashboard", "/students", "/admissions",
  "/student/", "/week-timetable", "/timetable", "/employees", "/employee/",
  "/add-student", "/add-employee", "/add-timetable", "/demo-classes",
  "/add-demo-class", "/add-expenditure", "/expenditure", "/reports",
  "/student-exams", "/add-student-exam", "/week-syllabus", "/analytics",
  '/revision-students', "/demo-bookings", "/academy-finance-dashboard",
  "/add-academy-earnings", "/upload-study-materials", "/upload-question-papers",
  "/Ideas"
];

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const isApp = Capacitor.isNativePlatform();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasLocalStorageData, setHasLocalStorageData] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const { photoUrl, isLoading: isProfileLoading } = useSelector((state) => state.profile);

  useEffect(() => {
    const checkLocalStorageData = () => {
      const potentialKeys = ['user', 'token', 'authToken', 'userData', 'persist:root', 'reduxState', 'electron-academy-data'];
      for (let key of potentialKeys) {
        const data = localStorage.getItem(key);
        if (data && data !== 'null' && data !== 'undefined' && data !== '{}' && data !== '[]') {
          setHasLocalStorageData(true);
          return;
        }
      }
      setHasLocalStorageData(false);
    };
    checkLocalStorageData();
    window.addEventListener('storage', checkLocalStorageData);
    return () => window.removeEventListener('storage', checkLocalStorageData);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(getUserProfileIcon(user.id));
    }
  }, [dispatch, isAuthenticated, user?.id]);

  const { timetables } = useSelector((state) => state.classes);
  const { students } = useSelector((state) => state.students);
  const { employees } = useSelector((state) => state.employees);
  const { timetables: autoTimetables } = useSelector((state) => state.autoTimetables);
  const { demoClasses } = useSelector((state) => state.demoClasses);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const AUTH_RELATED_PUBLIC_PAGES = ["/login", "/signup", "/forgot-password","/biometric-login", "/"];
    const isCurrentPathProtected = PROTECTED_BASE_PATHS.some((basePath) => location.pathname.startsWith(basePath));
    const isAuthRelatedPublicPage = AUTH_RELATED_PUBLIC_PAGES.includes(location.pathname);

    if (isAuthenticated && !isCurrentPathProtected && !isAuthRelatedPublicPage) {
      dispatch(logoutUser());
    }
  }, [location.pathname, isAuthenticated, dispatch]);

  const handleLogoutClick = async () => {
    dispatch(logoutUser());
    setMenuOpen(false);
    navigate("/login");
  };

  const filteredStudents = useSelector((state) => state.students.students || []);
  const filteredTimetables = [];
  const filteredDemoClasses = [];

  const shouldShowDashboard = isAuthenticated || hasLocalStorageData;

  // --- Helper Component for Profile (Used twice: Desktop & Mobile) ---
  const UserProfileDisplay = ({ isMobile }) => (
    <NavLink
      to="/profile"
      onClick={handleLinkClick}
      style={{
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px', // Slightly increased gap for better visual separation
        marginLeft: isMobile ? '10px' : '0'
      }}
    >
      {/* 1. Removed minWidth to fix spacing gap */}
      {/* 2. Changed textAlign to 'right' so text always hugs the avatar */}
      <Box sx={{ display: 'block', textAlign: 'right' }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: 'white', // Auto-switch color for mobile (usually white bg) vs desktop
            lineHeight: 1.2,
            fontSize: '0.70rem'
          }}
        >
          {user?.name || "User"}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: isMobile ? '#666' : '#ccc', // Auto-switch subtitle color
            fontSize: '0.65rem',
            display: 'block'
          }}
        >
          {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Online'}
        </Typography>
      </Box>

      {isProfileLoading ? (
        <Skeleton
          variant="circular"
          width={38}
          height={38}
          animation="wave"
          sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
        />
      ) : (
        <Avatar
          src={photoUrl}
          alt={user?.name}
          sx={{
            width: 38,
            height: 38,
            bgcolor: '#1a237e',
            color: '#fff',
            border: '2px solid #fff',
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
      )}
    </NavLink>
  );

  return (
    <div className="navbar-wrapper">
      <header className="navbar">

        {isAuthenticated && shouldShowDashboard && (
          <div className="mobile-nav-toggle" onClick={toggleSidebar}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </div>
        )}

        <div className="navbar-left" style={{ display: 'flex', alignItems: 'center' }}>
          <NavLink to="/" onClick={handleLinkClick} style={{ textDecoration: "none" }}>
            <img src="/spaceship.png" alt="Logo" className="logo" />
          </NavLink>

          {/* --- MOBILE ONLY: Profile Display (Next to Logo) --- */}
          {isAuthenticated && shouldShowDashboard && (
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <UserProfileDisplay isMobile={true} />
            </Box>
          )}
        </div>

        {!shouldShowDashboard && (
          <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <span className="close-btn">&times;</span> : <span>&#9776;</span>}
          </div>
        )}

        <nav className={`navbar-right ${menuOpen ? "active" : ""}`}>
          {!isAuthenticated && (
            <>
              <NavLink to="/" onClick={handleLinkClick} exact activeClassName="active-link">Home</NavLink>
              <NavLink to="/about" onClick={handleLinkClick} activeClassName="active-link">About Us</NavLink>
              <NavLink to="/teachers" onClick={handleLinkClick} activeClassName="active-link">Faculty</NavLink>
              <NavLink to="/careers" onClick={handleLinkClick} activeClassName="active-link">Careers</NavLink>
              <NavLink to="/contact" onClick={handleLinkClick} activeClassName="active-link">Contact Us</NavLink>

              <NavLink to="#" onClick={(e) => { e.preventDefault(); handleLinkClick(); window.open('/ElectronAcademy_Brochure.pdf', '_blank'); }} activeClassName="active-link" className="program-highlight-link-desktop">
                <FaDownload style={{ marginRight: '8px' }} /> Download Brochure
              </NavLink>
            </>
          )}

          {shouldShowDashboard ? (
            <div className="auth-buttons" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {isAuthenticated && (
                <>
                  {/* --- DESKTOP ONLY: Profile Display (Hidden on Mobile to avoid duplication) --- */}
                  <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <UserProfileDisplay isMobile={false} />
                  </Box>

                  <div className="notification-bell-navbar">
                    <NotificationBell
                      filteredTimetables={filteredTimetables}
                      filteredDemoClasses={filteredDemoClasses}
                      filteredStudents={filteredStudents}
                      combinedActivity={[]}
                      classesError={null}
                      studentsError={null}
                      employeesError={null}
                    />
                  </div>
                </>
              )}

              <NavLink to="/dashboard" className="auth-btn" onClick={handleLinkClick} activeClassName="active-btn">
                Dashboard
              </NavLink>
              <button onClick={handleLogoutClick} className="auth-btn logout-btn">
                <FaSignOutAlt /> <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <NavLink to="/book-demo" className="book-btn" onClick={handleLinkClick} activeClassName="active-btn">
                Book Demo
              </NavLink>
              <NavLink to="/login" className="auth-btn auth-secondary-btn" onClick={handleLinkClick} activeClassName="active-btn">
                Login
              </NavLink>
            </div>
          )}
        </nav>
      </header>

    </div>
  );
};

export default Navbar;