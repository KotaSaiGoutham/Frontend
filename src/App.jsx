import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation, // <-- Import useLocation
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // <-- Import useDispatch and useSelector

// Import your authentication actions
import { logoutUser } from "./redux/actions";
// Import your components
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Teachers from "./pages/Teachers";
import Contact from "./pages/Contact";
import BookDemo from "./pages/BookDemo";
import Careers from "./pages/Carrers"; // Ensure this matches your filename and export
import Blog from "./pages/Blog";
import PageSummarizer from "./pages/Pagesummarizer";
import PhysicsPage from "./pages/Physics";
import ChemistryPage from "./pages/chemistrypage";
import MathsPage from "./pages/MathsPage";
import BiologyPage from "./pages/BiologyPage";
import ScrollToTop from "./pages/ScrollToTop";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

// Protected components (components within the authenticated part of your app)
import Dashboard from "./components/Dashboard";
import StudentPortfolio from "./components/StudentPortfolio";
import TimetablePage from "./components/TimetablePage";
import Employees from "./components/Employees";
import AddStudent from "./components/AddStudent";
import AddEmployeePage from "./components/AddEmployeePage";
import StudentsTable from "./components/StudentsTable";
import AddTimetablePage from "./components/AddTimetablePage";

// Layout for authenticated routes
import AuthLayout from "./layouts/AuthLayout";

// MUI Theme Provider
import { ThemeProvider } from "@mui/material/styles";
import theme from "./components/customcomponents/theme";

// A simple PrivateRoute component to protect routes
// This component checks for a token in localStorage, you can also check Redux's isAuthenticated here
const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Get from Redux
  const token = localStorage.getItem("token"); // Also check localStorage for robustness on initial load
  return isAuthenticated || token ? children : <Navigate to="/login" />;
};

// Define an array of base protected paths
// For dynamic routes like "/student/:id", we'll check if the path starts with "/student/
function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Get auth status from Redux
  console.log("isAuthenticated",isAuthenticated)


  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ScrollToTop /> {/* Handles scrolling on route change */}
        <div>
          <Navbar /> {/* Your global Navbar */}

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/blog" element={<Blog />} />
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

            {/* Protected Routes - Nested structure */}
            {/* The outer Route with AuthLayout and PrivateRoute ensures */}
            {/* that all nested routes inherit the layout and require authentication. */}
            <Route element={<PrivateRoute><AuthLayout /></PrivateRoute>}>
              {/* Individual protected routes inside the AuthLayout */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<StudentsTable />} />
              <Route path="/student/:id" element={<StudentPortfolio />} />
              <Route path="/timetable" element={<TimetablePage />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/add-student" element={<AddStudent />} />
              <Route path="/add-employee" element={<AddEmployeePage />} />
              <Route path="/add-timetable" element={<AddTimetablePage />} />
            </Route>

            {/* Fallback Route: Redirects unhandled paths based on authentication status */}
            {/* This should be the last route in your Routes list */}
            <Route
              path="*" // Matches any path not matched by previous routes
              element={
                <Navigate
                  to={isAuthenticated ? "/dashboard" : "/login"} // Redirect to dashboard if logged in, else to login
                  replace // Replaces the current entry in the history stack
                />
              }
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;