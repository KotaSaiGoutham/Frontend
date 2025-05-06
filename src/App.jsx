import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Teachers from './pages/Teachers';
import Contact from './pages/Contact';
import BookDemo from './pages/BookDemo';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book-demo" element={<BookDemo />} />
      </Routes>
    </Router>
  );
}

export default App;
