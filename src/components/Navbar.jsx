import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Link to the CSS file

const Navbar = () => {
  return (
    <header className="navbar">
       <Link to="/" style={{textDecoration:"none"}}>
      <div className="navbar-left">
        <img src="/spaceship.png" alt="Logo" className="logo" />
        <h1 className="title">Electron Academy</h1>
      </div>
      </Link>
      <nav className="navbar-right">
      <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/teachers">Teachers</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/book-demo" className="book-demo">Book Demo</Link>
      </nav>
    </header>
  );
};

export default Navbar;
