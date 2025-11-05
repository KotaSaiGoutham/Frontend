import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actions";
import "./Navbar.css";
import { FaDownload } from 'react-icons/fa';


const PROTECTED_BASE_PATHS = [
  "/dashboard",
  "/students",
  "/student/",
"/week-timetable",
  "/timetable",
  "/employees",
  "/add-student",
  "/add-employee",
  "/add-timetable",
  "/demo-classes",
  "/add-demo-class",
  "/add-expenditure",
  "/expenditure",
  "/reports",
  "/student-exams",
  "/add-student-exam",
  "/week-syllabus",
  "/analytics",
  '/revision-students',
  "/demo-bookings",
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const AUTH_RELATED_PUBLIC_PAGES = [
      "/login",
      "/signup",
      "/forgot-password",
      "/",
    ];

    const isCurrentPathProtected = PROTECTED_BASE_PATHS.some((basePath) =>
      location.pathname.startsWith(basePath)
    );
    const isAuthRelatedPublicPage = AUTH_RELATED_PUBLIC_PAGES.includes(
      location.pathname
    );

    if (
      isAuthenticated &&
      !isCurrentPathProtected &&
      !isAuthRelatedPublicPage
    ) {
      dispatch(logoutUser());
    }
  }, [location.pathname, isAuthenticated, dispatch]);

  const handleLogoutClick = () => {
    dispatch(logoutUser());
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="navbar-wrapper">
      <header className="navbar">
        <NavLink
          to="/"
          onClick={handleLinkClick}
          style={{ textDecoration: "none" }}
        >
          <div className="navbar-left">
            <img src="/spaceship.png" alt="Logo" className="logo" />
          </div>
        </NavLink>

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <span className="close-btn">&times;</span>
          ) : (
            <span>&#9776;</span>
          )}
        </div>
        <nav className={`navbar-right ${menuOpen ? "active" : ""}`}>
          <NavLink
            to="/"
            onClick={handleLinkClick}
            exact
            activeClassName="active-link"
          >
            Home
          </NavLink>
          
          <NavLink
            to="/about"
            onClick={handleLinkClick}
            activeClassName="active-link"
          >
            About Us
          </NavLink>
          <NavLink
            to="/teachers"
            onClick={handleLinkClick}
            activeClassName="active-link"
          >
            Faculty
          </NavLink>
          <NavLink
            to="/careers"
            onClick={handleLinkClick}
            activeClassName="active-link"
          >
            Careers
          </NavLink>
  <NavLink
            to="/contact"
            onClick={handleLinkClick}
            activeClassName="active-link"
          >
            Contact Us
          </NavLink>

<NavLink
  to="#"
  onClick={(e) => {
    e.preventDefault();
    handleLinkClick();
    window.open('/ElectronAcademy_Brochure.pdf', '_blank');
  }}
  activeClassName="active-link"
  className="program-highlight-link-desktop"
>
  <FaDownload style={{ marginRight: '8px' }} />
  Download Brochure
</NavLink>
        

          {/* The program link is now correctly placed here on the desktop layout */}
{/*           <NavLink
            to="/revision-program/details"
            onClick={handleLinkClick}
            activeClassName="active-link"
            className="program-highlight-link-desktop"
          >
            JEE Mains (Session 1) 90 Days Program
          </NavLink> */}
          
          {/* Conditional rendering for auth buttons based on isAuthenticated state */}
          {isAuthenticated ? (
            // If authenticated, show Dashboard and Logout
            <div className="auth-buttons">
              <NavLink
                to="/dashboard"
                className="auth-btn"
                onClick={handleLinkClick}
                activeClassName="active-btn"
              >
                Dashboard
              </NavLink>
              <button onClick={handleLogoutClick} className="auth-btn logout-btn">
                Logout
              </button>
            </div>
          ) : (
            // If not authenticated, show Login and Book Demo
            <div className="auth-buttons">
       <NavLink
                to="/book-demo"
                className="book-btn"
                onClick={handleLinkClick}
                activeClassName="active-btn"
              >
                Book Demo
              </NavLink>
              <NavLink
                to="/login"
                className="auth-btn auth-secondary-btn"
                onClick={handleLinkClick}
                activeClassName="active-btn"
              >
                Login
              </NavLink>
         
            </div>
          )}
        </nav>
      </header>

      {/* This container will only be visible on mobile screens */}
      <div className="program-highlight-container-mobile">
        <NavLink
      to="#"
  onClick={(e) => {
    e.preventDefault();
    handleLinkClick();
    window.open('/ElectronAcademy_Brochure.pdf', '_blank');
  }}
          activeClassName="active-link"
          className="program-highlight-link"
        >
    <FaDownload style={{ marginRight: '8px' }} />

  Download Brochure
        </NavLink>

      </div>
    </div>
  );
};

export default Navbar;