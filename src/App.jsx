import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Teachers from "./pages/Teachers";
import Contact from "./pages/Contact";
import BookDemo from "./pages/BookDemo";
import Careers from "./pages/Carrers"; // Ensure this matches your filename and export
import Blog from "./pages/Blog";
import PageSummarizer from "./pages/Pagesummarizer";
// It's good practice to have a global CSS file for body/html
// import './App.css'; // If you have one, ensure it has the base styles below
import PhysicsPage from "./pages/Physics";
import ChemistryPage from "./pages/chemistrypage";
import MathsPage from "./pages/MathsPage";
import BiologyPage from "./pages/BiologyPage";
import ScrollToTop from "./components/ScrollToTop";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./components/Dashboard"; // Import the new Dashboard component
import StudentPortfolio from "./components/StudentPortfolio"; // Placeholder for the next section
import TimetablePage from "./components/TimetablePage";
import Employees from "./components/Employees";
// A simple PrivateRoute component to protect routes
import AuthLayout from "./layouts/AuthLayout"; // <-- AuthLayout is imported here
import AddStudent from './components/AddStudent'
import AddEmployeePage from "./components/AddEmployeePage";
import StudentsTable from "./components/StudentsTable";
import AddTimetablePage from "./components/AddTimetablePage";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};
function App() {
  return (
    <Router>
      <ScrollToTop /> {/* ✅ Handles scrolling on route change */}
      <div>
        {/* Make the main app container a flex column */}
        <Navbar />

        {/* This div will take the remaining vertical space */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/careers" element={<Careers />} />{" "}
          {/* Corrected typo if any */}
          <Route path="/blog" element={<Blog />} />{" "}
          {/* Corrected typo if any */}
          <Route path="/ai-summarizer" element={<PageSummarizer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book-demo" element={<BookDemo />} />
          <Route path="/subjects/physics" element={<PhysicsPage />} />
          <Route path="/subjects/chemistry" element={<ChemistryPage />} />
          <Route path="/subjects/maths" element={<MathsPage />} />
          <Route path="/subjects/biology" element={<BiologyPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            element={
              <PrivateRoute>
                <AuthLayout />
              </PrivateRoute>
            }
          >
            {/* Protected Routes */}
                <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/students"
              element={
                <PrivateRoute>
                  <StudentsTable />
                </PrivateRoute>
              }
            />
            {/* Placeholder for individual student portfolio page */}
            <Route
              path="/student/:id"
              element={
                <PrivateRoute>
                  <StudentPortfolio />{" "}
                  {/* We will create this in the next step */}
                </PrivateRoute>
              }
            />
            <Route
              path="/timetable"
              element={
                <PrivateRoute>
                  <TimetablePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <PrivateRoute>
                  <Employees />
                </PrivateRoute>
              }
            />
              <Route
              path="/add-student"
              element={
                <PrivateRoute>
                  <AddStudent />
                </PrivateRoute>
              }
            />
             <Route
              path="/add-employee"
              element={
                <PrivateRoute>
                  <AddEmployeePage />
                </PrivateRoute>
              }
            />
              <Route
              path="/add-timetable"
              element={
                <PrivateRoute>
                  <AddTimetablePage />
                </PrivateRoute>
              }
            />
          </Route>
          {/* Redirect root to login or dashboard if already logged in */}
          <Route
            path="/"
            element={
              <Navigate
                to={localStorage.getItem("token") ? "/students" : "/login"}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
