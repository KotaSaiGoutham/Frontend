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
import DemoClassesPage from "./components/DemoClassesPage";
// Layout for authenticated routes
import AuthLayout from "./layouts/AuthLayout";
import AddDemoClassPage from "./components/AddDemoClassPage";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./components/customcomponents/theme";
import AddExpenditure from "./components/AddExpenditure";
import ExpenditureDashboard from "./components/ExpenditureDashboard";
import { SnackbarProvider } from "./components/customcomponents/SnackbarContext";
import Reports from "./components/Reports";
import StudentExam from "./components/StudentExam";
import Analytics from "./components/Analytics";
import AddStudentExamPage from "./components/AddStudentExamPage";
import WeekSyllabusPage from "./components/WeekSyallabus";
import RevisionProgramme from "./components/utils/revisionProgramme";
import RevisionProgramDetails from "./components/utils/RevisionProgramDetails";
import RevisionStudentsPage from "./components/revisionStudents/RevisionStudentsPage";
import RevisionRegistratedStudents from "./components/revisionStudents/RevisionRegistratedStudents";
const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Get from Redux
  const token = localStorage.getItem("token"); // Also check localStorage for robustness on initial load
  return isAuthenticated || token ? children : <Navigate to="/login" />;
};

// Define an array of base protected paths
// For dynamic routes like "/student/:id", we'll check if the path starts with "/student/
function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Get auth status from Redux

  return (
    <SnackbarProvider>
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
              <Route
                path="/revision-program/register"
                element={<RevisionProgramme />}
              />
              <Route
                path="/revision-program/details"
                element={<RevisionProgramDetails />}
              />

              <Route
                element={
                  <PrivateRoute>
                    <AuthLayout />
                  </PrivateRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/students" element={<StudentsTable />} />
                <Route path="/demo-classes" element={<DemoClassesPage />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/student-exams" element={<StudentExam />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/week-syllabus" element={<WeekSyllabusPage />} />
                <Route
                  path="/add-student-exam"
                  element={<AddStudentExamPage />}
                />
                <Route path="/add-demo-class" element={<AddDemoClassPage />} />{" "}
                {/* NEW ROUTE */}
                <Route
                  path="/add-expenditure"
                  element={<AddExpenditure />}
                />{" "}
                {/* NEW ROUTE */}
                <Route
                  path="/expenditure"
                  element={<ExpenditureDashboard />}
                />{" "}
                {/* NEW ROUTE */}
                <Route path="/student/:id" element={<StudentPortfolio />} />
                <Route path="/timetable" element={<TimetablePage />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/add-student" element={<AddStudent />} />
                <Route path="/add-employee" element={<AddEmployeePage />} />
                <Route path="/add-timetable" element={<AddTimetablePage />} />
                <Route
                  path="/revision-students"
                  element={<RevisionStudentsPage />}
                />
                <Route
                  path="/revision-registrated-students"
                  element={<RevisionRegistratedStudents />}
                />
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
    </SnackbarProvider>
  );
}

export default App;
