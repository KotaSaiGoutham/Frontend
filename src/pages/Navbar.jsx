import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from '../redux/actions';
import "./Navbar.css";

const PROTECTED_BASE_PATHS = [
  "/dashboard",
  "/students",
  "/student/",
  "/timetable",
  "/employees",
  "/add-student",
  "/add-employee",
  "/add-timetable",
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

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

    const isCurrentPathProtected = PROTECTED_BASE_PATHS.some(basePath => location.pathname.startsWith(basePath));
    const isAuthRelatedPublicPage = AUTH_RELATED_PUBLIC_PAGES.includes(location.pathname);

    if (isAuthenticated && !isCurrentPathProtected && !isAuthRelatedPublicPage) {
      console.log(
        `Authenticated user navigated to a non-protected, non-auth public path: ${location.pathname}. Clearing authentication.`
      );
      dispatch(logoutUser());
    }
  }, [location.pathname, isAuthenticated, dispatch]);

  const handleLogoutClick = () => {
    dispatch(logoutUser());
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="navbar">
      <NavLink to="/" onClick={handleLinkClick} style={{ textDecoration: "none" }}>
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
        <NavLink to="/" onClick={handleLinkClick} exact activeClassName="active-link">
          Home
        </NavLink>
        <NavLink to="/ai-summarizer" onClick={handleLinkClick} activeClassName="active-link">
          AI <span className="try-it-highlight">Try it!</span>
        </NavLink>
        <NavLink to="/about" onClick={handleLinkClick} activeClassName="active-link">
          About Us
        </NavLink>
        <NavLink to="/teachers" onClick={handleLinkClick} activeClassName="active-link">
          Faculty
        </NavLink>
        <NavLink to="/careers" onClick={handleLinkClick} activeClassName="active-link">
          Careers{" "}
        </NavLink>
        {/* Removed Blog Link as requested */}
        {/* <NavLink to="/blog" onClick={handleLinkClick} activeClassName="active-link">
          Blog{" "}
        </NavLink> */}
        <NavLink to="/contact" onClick={handleLinkClick} activeClassName="active-link">
          Contact Us
        </NavLink>

        {/* Conditional rendering for auth buttons based on isAuthenticated state */}
        {isAuthenticated ? (
          // If authenticated, show Dashboard and Logout
          <div className="auth-buttons">
            <NavLink to="/dashboard" className="auth-btn" onClick={handleLinkClick} activeClassName="active-btn">
              Dashboard
            </NavLink>
            <button onClick={handleLogoutClick} className="auth-btn logout-btn">
              Logout
            </button>
          </div>
        ) : (
          // If not authenticated, show Sign Up, Login, AND Book Demo directly
          <div className="auth-buttons">
            <NavLink to="/signup" className="auth-btn auth-secondary-btn" onClick={handleLinkClick} activeClassName="active-btn">
              Sign Up
            </NavLink>
            <NavLink to="/login" className="auth-btn auth-secondary-btn" onClick={handleLinkClick} activeClassName="active-btn">
              Login
            </NavLink>
            {/* Book Demo is still prominent CTA, potentially with a different class to distinguish its style */}
            <NavLink to="/book-demo" className="book-btn demo-btn" onClick={handleLinkClick} activeClassName="active-btn">
              Book Demo
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
