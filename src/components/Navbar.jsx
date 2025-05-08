import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMenuOpen(false); // Close menu on link click
  };

  return (
    <header className="navbar">
      <Link to="/" onClick={handleLinkClick} style={{ textDecoration: 'none' }}>
        <div className="navbar-left">
          <img src="/spaceship.png" alt="Logo" className="logo" />
          <h1 className="title">Electron Academy</h1>
        </div>
      </Link>

      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <nav className={`navbar-right ${menuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={handleLinkClick}>Home</Link>
        <Link to="/about" onClick={handleLinkClick}>About Us</Link>
        <Link to="/teachers" onClick={handleLinkClick}>Teachers</Link>
        <Link to="/contact" onClick={handleLinkClick}>Contact Us</Link>
        <Link to="/book-demo" className="book-demo" onClick={handleLinkClick}>Book Demo</Link>
      </nav>
    </header>
  );
};

export default Navbar;
