import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; 
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from '@capacitor/splash-screen'; 
import ReactGA from "react-ga4";
import axios from "axios"; // <--- 1. ADDED THIS IMPORT

// --- BIOMETRIC IMPORTS ---
import { Preferences } from '@capacitor/preferences';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';
// ⚠️ IMPORTANT: Ensure you have this action in your redux actions file
import { loadUserFromToken } from "./redux/actions";

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

// Protected components
import Dashboard from "./components/Dashboard";
import StudentPortfolio from "./components/StudentPortfolio";
import TimetablePage from "./components/TimetablePage";
import Employees from "./components/Employees";
import AddStudent from "./components/AddStudent";
import AddEmployeePage from "./components/AddEmployeePage";
import StudentsTable from "./components/StudentsTable";
import AddTimetablePage from "./components/AddTimetablePage";
import DemoClassesPage from "./components/DemoClassesPage";
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
} from "./components/student-portfolio";
import Sidebar from "./components/Sidebar";
import DemoBookingsPage from "./components/DemoBookings";
import StudentStudyMaterials from "./components/student-portfolio/StudentStudyMaterials";
import AcademyFinanceDashboard from "./components/AcademyFinanceDashboard";
import AddAcademyEarning from "./components/AddAcademyEarning";
import StudyMaterialUpload from "./components/StudyMaterialUpload";
import QuestionPaperUpload from "./components/QuestionPaperUpload";
import TutorIdeasPage from "./components/TutorIdeas/TutorIdeasPage";
import AdmissionPage from "./components/AdmissionPage";
import StudentSyllabusFormPage from "./components/student-portfolio/StudentSyllabusFormPage";
import EmployeeDashboard from "./components/dashboard/EmployeeDashboard";
import ProfilePage from "./components/ProfilePage";
import ImportantFiles from "./components/ImportantFiles";
import MobileManager from "./components/MobileManager";

const GA4_MEASUREMENT_ID = "G-X618BEJF5H";

// --- SIMPLE TRACKER ---
const GATracker = () => {
  const location = useLocation();
  useEffect(() => {
    if (ReactGA.isInitialized) {
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname + location.search,
        title: location.pathname,
      });
    }
  }, [location]);
  return null;
};

// --- APP ENTRY LOGIC ---
const AppEntryRedirect = () => {
  const isApp = Capacitor.isNativePlatform();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  if (isApp && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Dashboard />;
};

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = localStorage.getItem("token");
  return isAuthenticated || token ? children : <Navigate to="/login" />;
};

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVerifyingBio, setIsVerifyingBio] = useState(true); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // --- 1. BIOMETRIC CHECK LOGIC ---
  useEffect(() => {
    const checkBiometrics = async () => {
        // A. If not mobile, stop immediately
        if (!Capacitor.isNativePlatform()) {
            setIsVerifyingBio(false);
            // SplashScreen.hide();
            return;
        }

        try {
            // B. Check if enabled
            const { value: isEnabled } = await Preferences.get({ key: 'bio_enabled' });
            
            if (isEnabled !== 'true') {
                console.log("Biometrics not enabled in preferences.");
                setIsVerifyingBio(false);
                // SplashScreen.hide();
                return;
            }

            // C. Scan Fingerprint
            await NativeBiometric.verifyIdentity({
                reason: "Log in",
                title: "Welcome Back",
                subtitle: "Confirm Identity",
                description: "Scan to continue"
            });

            // D. Success! Get Token
            const { value: token } = await Preferences.get({ key: 'user_token' });

            if (token) {
                console.log("Bio Success. Token Found. Logging in...");

                // --- 2. CRITICAL FIX: SYNC STORAGE & HEADERS ---
                // Sync to LocalStorage (needed for legacy logic)
                localStorage.setItem("token", token);
                
                // Force Axios Header (needed for immediate API calls)
                // This prevents the "Unknown Error" / 401 on cold start
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; 

               if (token) {
   // ✅ Pass the token variable here
   dispatch(loadUserFromToken(token)); 
}
            } else {
                console.log("Bio passed but no token found in Preferences.");
            }

        } catch (error) {
            console.log("Biometric failed, cancelled, or error:", error);
        } finally {
            // --- 3. CRITICAL FIX: ALWAYS RUN THIS ---
            // This ensures the loading screen disappears even if login fails
            setIsVerifyingBio(false);
            // SplashScreen.hide(); 
        }
    };

    // Safety Timeout: Force app to load if Biometrics gets stuck for 5 seconds
    const safetyTimer = setTimeout(() => {
        console.warn("Biometric check timed out. Forcing app load.");
        setIsVerifyingBio(false);
        // SplashScreen.hide();
    }, 5000);

    checkBiometrics();

    // Cleanup timer
    return () => clearTimeout(safetyTimer);

  }, [dispatch]);

  // --- 2. INITIALIZATION (GA & WEB SPLASH) ---
  useEffect(() => {
    if (GA4_MEASUREMENT_ID) {
      ReactGA.initialize(GA4_MEASUREMENT_ID);
    }
    
    // Only hide splash here if NOT on mobile (mobile hides it after bio check)
    if (!Capacitor.isNativePlatform()) {
        // SplashScreen.hide();
    }
  }, []);

  // --- 3. SHOW LOADING WHILE SCANNING FACE ---
  if (isVerifyingBio && Capacitor.isNativePlatform()) {
      return (
        <div style={{ 
            height: '100vh', 
            width: '100vw', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: '#fff',
            flexDirection: 'column'
        }}>
            {/* Make sure this image path is correct */}
            <img src="/spaceship.png" alt="Loading..." style={{ width: 100, marginBottom: 20 }} />
            <p style={{ fontFamily: 'sans-serif', color: '#666' }}>Verifying Identity...</p>
        </div>
      );
  }

  return (
    <SnackbarProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <GATracker />
          <MobileManager/>
          <ScrollToTop />
          <div>
            <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            {isAuthenticated && (
              <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            )}
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<AppEntryRedirect />} />
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
              <Route path="/revision-program/register" element={<RevisionProgramme />} />
              <Route path="/revision-program/details" element={<RevisionProgramDetails />} />

              {/* Protected Routes */}
              <Route element={<PrivateRoute><AuthLayout /></PrivateRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/students" element={<StudentsTable />} />
                <Route path="/demo-classes" element={<DemoClassesPage />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/student-exams" element={<StudentExam />} />
                <Route path="/analytics" element={<AnalyticsComp />} />
                <Route path="/week-syllabus" element={<WeekSyllabusPage />} />
                <Route path="/add-student-exam" element={<AddStudentExamPage />} />
                <Route path="/add-demo-class" element={<AddDemoClassPage />} />
                <Route path="/add-expenditure" element={<AddExpenditure />} />
                <Route path="/add-academy-earnings" element={<AddAcademyEarning />} />
                <Route path="/Ideas" element={<TutorIdeasPage />} />
                <Route path="/expenditure" element={<ExpenditureDashboard />} />
                <Route path="/student/:id" element={<StudentPortfolio />} />
                <Route path="/timetable" element={<TimeTableManager />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/admissions" element={<AdmissionPage />} />
                <Route path="/upload-study-materials" element={<StudyMaterialUpload />} />
                <Route path="/upload-question-papers" element={<QuestionPaperUpload />} />
                <Route path="/important-files" element={<ImportantFiles />} />
                <Route path="/employee/:id" element={<EmployeeDashboard />} />
                <Route path="/add-student" element={<AddStudent />} />
                <Route path="/add-employee" element={<AddEmployeePage />} />
                <Route path="/add-timetable" element={<AddTimetablePage />} />
                <Route path="/revision-students" element={<RevisionStudentsPage />} />
                <Route path="/revision-registrated-students" element={<RevisionRegistratedStudents />} />
                <Route path="/demo-bookings" element={<DemoBookingsPage />} />
                <Route path="/academy-finance-dashboard" element={<AcademyFinanceDashboard />} />
                
                {/* New Student Portfolio Routes */}
                <Route path="/student/:studentId/profile" element={<StudentProfile />} />
                <Route path="/student/:studentId/weekend" element={<StudentWeekend />} />
                <Route path="/student/:studentId/results" element={<StudentResults />} />
                <Route path="/student/:studentId/classes" element={<StudentClasses />} />
                <Route path="/student/:studentId/payments" element={<StudentPayments />} />
                <Route path="/student/:studentId/ppts" element={<StudentPPTs />} />
                <Route path="/student/:studentId/worksheets" element={<StudentWorksheets />} />
                <Route path="/student/:studentId/papers" element={<StudentPapers />} />
                <Route path="/student/:studentId/upload" element={<StudentUpload />} />
                <Route path="/student/:studentId/study-materials" element={<StudentStudyMaterials />} />
                <Route path="/student/:studentId/student-syallabus-entry" element={<StudentSyllabusFormPage />} />
                <Route path="/student/:studentId" element={<Navigate to="/student/:studentId/profile" replace />} />
              </Route>

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;