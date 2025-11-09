import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ReactGA from "react-ga4";

const GA4_MEASUREMENT_ID = "G-X618BEJF5H";

const GATracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
      title: location.pathname,
    });
  }, [location]);

  return null;
};

// Import your components
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Teachers from "./pages/Teachers";
import Contact from "./pages/Contact";
import BookDemo from "./pages/BookDemo";
import Careers from "./pages/Carrers";
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
import AnalyticsComp from "./components/Analytics";
import AddStudentExamPage from "./components/AddStudentExamPage";
import WeekSyllabusPage from "./components/WeekSyallabus";
import RevisionProgramme from "./components/utils/revisionProgramme";
import RevisionProgramDetails from "./components/utils/RevisionProgramDetails";
import RevisionStudentsPage from "./components/revisionStudents/RevisionStudentsPage";
import RevisionRegistratedStudents from "./components/revisionStudents/RevisionRegistratedStudents";
import TimeTableManager from "./pages/TimeTableManager";
import {
  StudentProfile,
  StudentWeekend,
  StudentUpload,
  StudentPPTs,
  StudentWorksheets,
  StudentPapers,
  StudentResults,
  StudentClasses,
  StudentPayments,
  StudentOthers,
} from "./components/student-portfolio";
import DemoBookingsPage from "./components/DemoBookings";
import StudentStudyMaterials from "./components/student-portfolio/StudentStudyMaterials";
import AcademyFinanceDashboard from "./components/AcademyFinanceDashboard";
import AddAcademyEarning from "./components/AddAcademyEarning";
import StudyMaterialUpload from "./components/StudyMaterialUpload";
import QuestionPaperUpload from "./components/QuestionPaperUpload";
import TutorIdeasPage from "./components/TutorIdeas/TutorIdeasPage";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = localStorage.getItem("token");
  return isAuthenticated || token ? children : <Navigate to="/login" />;
};

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Initialize GA4 only once when the App component mounts
  useEffect(() => {
    if (
      GA4_MEASUREMENT_ID &&
      GA4_MEASUREMENT_ID !== "YOUR_MEASUREMENT_ID_HERE"
    ) {
      ReactGA.initialize(GA4_MEASUREMENT_ID);
    }
  }, []);

  return (
    <SnackbarProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <GATracker />
          <ScrollToTop />
          <div>
            <Navbar />
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

              {/* Protected Routes - All routes inside AuthLayout are protected by PrivateRoute */}
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
                <Route path="/analytics" element={<AnalyticsComp />} />
                <Route path="/week-syllabus" element={<WeekSyllabusPage />} />
                <Route
                  path="/add-student-exam"
                  element={<AddStudentExamPage />}
                />
                <Route path="/add-demo-class" element={<AddDemoClassPage />} />
                <Route path="/add-expenditure" element={<AddExpenditure />} />
                <Route
                  path="/add-academy-earnings"
                  element={<AddAcademyEarning />}
                />
                  <Route
                  path="/Ideas"
                  element={<TutorIdeasPage />}
                />

                <Route path="/expenditure" element={<ExpenditureDashboard />} />

                {/* Old Student Portfolio Route (you can remove this if migrating completely) */}
                <Route path="/student/:id" element={<StudentPortfolio />} />

                <Route path="/timetable" element={<TimeTableManager />} />
                <Route path="/employees" element={<Employees />} />
                <Route
                  path="/upload-study-materials"
                  element={<StudyMaterialUpload />}
                />
                <Route
                  path="/upload-question-papers"
                  element={<QuestionPaperUpload />}
                />

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
                <Route path="/demo-bookings" element={<DemoBookingsPage />} />
                <Route
                  path="/academy-finance-dashboard"
                  element={<AcademyFinanceDashboard />}
                />

                {/* New Student Portfolio Routes */}
                <Route
                  path="/student/:studentId/profile"
                  element={<StudentProfile />}
                />
                <Route
                  path="/student/:studentId/weekend"
                  element={<StudentWeekend />}
                />
                <Route
                  path="/student/:studentId/results"
                  element={<StudentResults />}
                />
                <Route
                  path="/student/:studentId/classes"
                  element={<StudentClasses />}
                />
                <Route
                  path="/student/:studentId/payments"
                  element={<StudentPayments />}
                />
                <Route
                  path="/student/:studentId/ppts"
                  element={<StudentPPTs />}
                />
                <Route
                  path="/student/:studentId/worksheets"
                  element={<StudentWorksheets />}
                />
                <Route
                  path="/student/:studentId/papers"
                  element={<StudentPapers />}
                />
                <Route
                  path="/student/:studentId/upload"
                  element={<StudentUpload />}
                />
                <Route
                  path="/student/:studentId/study-materials"
                  element={<StudentStudyMaterials />}
                />

                <Route
                  path="/student/:studentId"
                  element={
                    <Navigate to="/student/:studentId/profile" replace />
                  }
                />
              </Route>

              {/* Fallback Route */}
              <Route
                path="*"
                element={
                  <Navigate
                    to={isAuthenticated ? "/dashboard" : "/login"}
                    replace
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
