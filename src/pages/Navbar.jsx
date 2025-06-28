import { useState, useEffect } from "react"; // Import useEffect
import { NavLink, useLocation, useNavigate } from "react-router-dom"; // Import useLocation, useNavigate
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch, useSelector
import { logoutUser } from '../redux/actions'; // Import your logout action
import "./Navbar.css";

// Define your protected paths here (or import them from a central config file if preferred)
const PROTECTED_BASE_PATHS = [
  "/dashboard",
  "/students",
  "/student/", // For dynamic student IDs
  "/timetable",
  "/employees",
  "/add-student",
  "/add-employee",
  "/add-timetable",
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation(); // Get current location
  const navigate = useNavigate(); // For manual logout redirection
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated); // Get auth status from Redux

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  // --- Auto-logout useEffect (Moved here from App.js) ---
  useEffect(() => {
    // Define public routes that are explicitly related to authentication (login, signup, forgot-password)
    // or the main home page. These should NOT trigger a logout if an authenticated user visits them.
    const AUTH_RELATED_PUBLIC_PAGES = [
      "/login",
      "/signup",
      "/forgot-password",
      "/", // Home page is public
    ];

    // Determine if the current path is considered a protected route
    const isCurrentPathProtected = PROTECTED_BASE_PATHS.some(basePath => location.pathname.startsWith(basePath));

    // Determine if the current path is an auth-related public page
    const isAuthRelatedPublicPage = AUTH_RELATED_PUBLIC_PAGES.includes(location.pathname);

    // Logic for automatic logout:
    // If user is authenticated AND
    // the current path is NOT a protected route AND
    // the current path is NOT an auth-related public page
    if (isAuthenticated && !isCurrentPathProtected && !isAuthRelatedPublicPage) {
      console.log(
        `Authenticated user navigated to a non-protected, non-auth public path: ${location.pathname}. Clearing authentication.`
      );
      dispatch(logoutUser()); // This clears isAuthenticated in Redux and localStorage
      // No explicit navigate('/login') here; rely on App.js's PrivateRoute/fallback
      // to redirect once isAuthenticated becomes false.
    }
  }, [location.pathname, isAuthenticated, dispatch]); // Dependencies: responds to changes in path, auth status

  // Handle manual logout (e.g., from a logout button in Navbar)
  const handleLogoutClick = () => {
    dispatch(logoutUser());
    setMenuOpen(false); // Close menu on logout
    navigate('/login'); // Redirect to login page after manual logout
  };

  return (
    <header className="navbar">
      {/* Use NavLink for the logo if it also navigates to home */}
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
        {/* MODIFIED AI LINK HERE */}
        <NavLink to="/ai-summarizer" onClick={handleLinkClick} activeClassName="active-link">
          AI <span className="try-it-highlight">Try it!</span>
        </NavLink>
        {/* END MODIFIED AI LINK */}
        <NavLink to="/about" onClick={handleLinkClick} activeClassName="active-link">
          About Us
        </NavLink>
        <NavLink to="/teachers" onClick={handleLinkClick} activeClassName="active-link">
          Faculty
        </NavLink>
        <NavLink to="/careers" onClick={handleLinkClick} activeClassName="active-link">
          Careers{" "}
        </NavLink>
        <NavLink to="/blog" onClick={handleLinkClick} activeClassName="active-link">
          Blog{" "}
        </NavLink>
        <NavLink to="/contact" onClick={handleLinkClick} activeClassName="active-link">
          Contact Us
        </NavLink>
        <NavLink to="/book-demo" className="book-btn demo-btn" onClick={handleLinkClick} activeClassName="active-btn">
          Book Demo
        </NavLink>

        {/* Conditional rendering for auth buttons based on isAuthenticated state */}
        {isAuthenticated ? (
          // If authenticated, show Dashboard and Logout
          <div className="auth-buttons">
            <NavLink to="/dashboard" className="auth-btn" onClick={handleLinkClick} activeClassName="active-btn">
              Dashboard
            </NavLink>
            <button onClick={handleLogoutClick} className="auth-btn logout-btn"> {/* Use a button for logout */}
              Logout
            </button>
          </div>
        ) : (
          // If not authenticated, show Sign Up and Login
          <div className="auth-buttons">
            <NavLink to="/signup" className="auth-btn" onClick={handleLinkClick} activeClassName="active-btn">
              Sign Up
            </NavLink>
            <NavLink to="/login" className="auth-btn" onClick={handleLinkClick} activeClassName="active-btn">
              Login
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;