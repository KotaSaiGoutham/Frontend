import { useState } from "react";
import { NavLink } from "react-router-dom"; // Make sure NavLink is imported
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMenuOpen(false);
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
<div className="auth-buttons">
  <NavLink to="/signup" className="auth-btn" onClick={handleLinkClick} activeClassName="active-btn">
    Sign Up
  </NavLink>
  <NavLink to="/login" className="auth-btn" onClick={handleLinkClick} activeClassName="active-btn">
    Login
  </NavLink>
</div>


      </nav>
    </header>
  );
};

export default Navbar;