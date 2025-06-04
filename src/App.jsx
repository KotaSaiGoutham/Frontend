import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Teachers from "./pages/Teachers";
import Contact from "./pages/Contact";
import BookDemo from "./pages/BookDemo";
import Careers from "./pages/Carrers"; // Ensure this matches your filename and export
import Blog from "./pages/Blog"
// It's good practice to have a global CSS file for body/html
// import './App.css'; // If you have one, ensure it has the base styles below

function App() {
  return (
    <Router>
      {/* Make the main app container a flex column */}
        <Navbar />
        {/* This div will take the remaining vertical space */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/careers" element={<Careers />} /> {/* Corrected typo if any */}
                        <Route path="/blog" element={<Blog />} /> {/* Corrected typo if any */}


            <Route path="/contact" element={<Contact />} />
            <Route path="/book-demo" element={<BookDemo />} />
          </Routes>
    </Router>
  );
}

export default App;