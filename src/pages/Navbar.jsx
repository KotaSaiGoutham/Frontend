import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actions";
import "./Navbar.css";
import { FaDownload,FaSignOutAlt } from 'react-icons/fa';
import NotificationBell from "../components/NotificationBell";
import { parse, isValid, isAfter } from "date-fns";
import { persistor } from "../redux/store";

const PROTECTED_BASE_PATHS = [
  "/profile",
  "/dashboard",
  "/students",
  "/admissions",
  "/student/",
  "/week-timetable",
  "/timetable",
  "/employees",
  "/employee/",
  "/add-student",
  "/add-employee",
  "/add-timetable",
  "/demo-classes",
  "/add-demo-class",
  "/add-expenditure",
  "/expenditure",
  "/reports",
  "/student-exams",
  "/add-student-exam",
  "/week-syllabus",
  "/analytics",
  '/revision-students',
  "/demo-bookings",
  "/academy-finance-dashboard",
  "/add-academy-earnings",
  "/upload-study-materials",
  "/upload-question-papers",
  "/Ideas"
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasLocalStorageData, setHasLocalStorageData] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  // Check if there's any relevant data in localStorage
  useEffect(() => {
    const checkLocalStorageData = () => {
      // Check for various keys that might contain user data
      const potentialKeys = [
        'user',
        'token',
        'authToken',
        'userData',
        'persist:root',
        'reduxState',
        'electron-academy-data'
      ];
      
      for (let key of potentialKeys) {
        const data = localStorage.getItem(key);
        if (data && data !== 'null' && data !== 'undefined' && data !== '{}' && data !== '[]') {
          try {
            const parsedData = JSON.parse(data);
            if (parsedData && Object.keys(parsedData).length > 0) {
              setHasLocalStorageData(true);
              return;
            }
          } catch {
            // If it's not JSON but has content, consider it as data
            if (data.length > 10) {
              setHasLocalStorageData(true);
              return;
            }
          }
        }
      }
      setHasLocalStorageData(false);
    };

    checkLocalStorageData();
    
    // Also check when storage changes
    const handleStorageChange = () => {
      checkLocalStorageData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Get data from Redux store for notifications
  const {
    timetables,
    loading: classesLoading,
    error: classesError,
  } = useSelector((state) => state.classes);
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useSelector((state) => state.students);
  const {
    employees,
    loading: employeesLoading,
    error: employeesError,
  } = useSelector((state) => state.employees);
  const {
    timetables: autoTimetables,
    loading: autoTimetablesLoading,
    error: autoTimetablesError,
  } = useSelector((state) => state.autoTimetables);
  const { demoClasses, loading: demoClassesLoading, error: demoClassesError } = useSelector(
    (state) => state.demoClasses
  );
  const { payments } = useSelector((state) => state.expenditures);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const AUTH_RELATED_PUBLIC_PAGES = [
      "/login",
      "/signup",
      "/forgot-password",
      "/",
    ];

    const isCurrentPathProtected = PROTECTED_BASE_PATHS.some((basePath) =>
      location.pathname.startsWith(basePath)
    );
    const isAuthRelatedPublicPage = AUTH_RELATED_PUBLIC_PAGES.includes(
      location.pathname
    );

    if (
      isAuthenticated &&
      !isCurrentPathProtected &&
      !isAuthRelatedPublicPage
    ) {
      dispatch(logoutUser());
    }
  }, [location.pathname, isAuthenticated, dispatch]);

 const handleLogoutClick = async () => {
dispatch(logoutUser());
    setMenuOpen(false);
    navigate("/login");
};

  // Filter data based on user permissions (similar to Dashboard)
  const filteredStudents = useSelector((state) => {
    const students = state.students.students || [];
    const user = state.auth.user;
    if (!user) return [];
    
    let result = [];
    if (students.length > 0) {
      if (user.AllowAll) {
        result = students;
      } else if (user.isPhysics) {
        result = students.filter(
          (student) => student.Subject === "Physics"
        );
      } else if (user.isChemistry) {
        result = students.filter(
          (student) => student.Subject === "Chemistry"
        );
      }
      result = result.filter(
        (student) => student.isActive === true
      );
    }
    return result;
  });

  const allTimetables = [...(timetables || []), ...(autoTimetables || [])];

  const filteredTimetables = useSelector((state) => {
    const allTimetables = [...(state.classes.timetables || []), ...(state.autoTimetables.timetables || [])];
    const user = state.auth.user;
    if (!user) return [];
    
    let result = [];
    if (allTimetables.length > 0) {
      let permissionFilteredTimetables = [];

      if (user.AllowAll) {
        permissionFilteredTimetables = allTimetables;
      } else if (user.isPhysics) {
        permissionFilteredTimetables = allTimetables.filter(
          (schedule) => schedule.Subject === "Physics"
        );
      } else if (user.isChemistry) {
        permissionFilteredTimetables = allTimetables.filter(
          (schedule) => schedule.Subject === "Chemistry"
        );
      } else {
        permissionFilteredTimetables = [];
      }

      const now = new Date();
      result = permissionFilteredTimetables.filter((schedule) => {
        try {
          const classStartTimeStr = schedule.Time?.split(" to ")[0];
          if (!classStartTimeStr) return false;
          
          const classDateTime = parse(
            `${schedule.Day} ${classStartTimeStr}`,
            "dd/MM/yyyy hh:mm a",
            new Date()
          );
          return isValid(classDateTime) && isAfter(classDateTime, now);
        } catch (e) {
          return false;
        }
      });

      result.sort((a, b) => {
        try {
          const dateA = parse(
            `${a.Day} ${a.Time.split(" to ")[0]}`,
            "dd/MM/yyyy hh:mm a",
            new Date()
          );
          const dateB = parse(
            `${b.Day} ${b.Time.split(" to ")[0]}`,
            "dd/MM/yyyy hh:mm a",
            new Date()
          );

          if (isValid(dateA) && isValid(dateB)) {
            return dateA.getTime() - dateB.getTime();
          }
        } catch (e) {
          // Handle parsing errors
        }
        return 0;
      });
    }
    return result;
  });

  const userHasSubjectPreference = user?.isPhysics || user?.isChemistry;

  const filteredDemoClasses = useSelector((state) => {
    const demoClasses = state.demoClasses.demoClasses || [];
    const user = state.auth.user;
    if (!user) return demoClasses;
    
    return userHasSubjectPreference
      ? demoClasses.filter((demo) => {
          const demoSubject = demo.Subject?.toLowerCase();
          return (
            (user.isPhysics && demoSubject === "physics") ||
            (user.isChemistry && demoSubject === "chemistry") ||
            (user.isMaths && demoSubject === "maths")
          );
        })
      : demoClasses;
  });

  // Determine if we should show Dashboard link
  const shouldShowDashboard = isAuthenticated || hasLocalStorageData;

  return (
    <div className="navbar-wrapper">
      <header className="navbar">
        <NavLink
          to="/"
          onClick={handleLinkClick}
          style={{ textDecoration: "none" }}
        >
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
     {!isAuthenticated && (
           <>
           <NavLink
            to="/"
            onClick={handleLinkClick}
            exact
            activeClassName="active-link"
          >
            Home
          </NavLink>
          
          <NavLink
            to="/about"
            onClick={handleLinkClick}
            activeClassName="active-link"
          >
            About Us
          </NavLink>
          <NavLink
            to="/teachers"
            onClick={handleLinkClick}
            activeClassName="active-link"
          >
            Faculty
          </NavLink>
          <NavLink
            to="/careers"
            onClick={handleLinkClick}
            activeClassName="active-link"
          >
            Careers
          </NavLink>
          <NavLink
            to="/contact"
            onClick={handleLinkClick}
            activeClassName="active-link"
          >
            Contact Us
          </NavLink>
         </>
        )}

          {/* Download Brochure - Only show when NOT authenticated */}
          {!isAuthenticated && (
            <>
              <NavLink
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick();
                  window.open('/ElectronAcademy_Brochure.pdf', '_blank');
                }}
                activeClassName="active-link"
                className="program-highlight-link-desktop"
              >
                <FaDownload style={{ marginRight: '8px' }} />
                Download Brochure
              </NavLink>
            </>
          )}

          {/* Conditional rendering for auth buttons based on isAuthenticated state */}
          {shouldShowDashboard ? (
            // If authenticated OR has localStorage data, show Notification Bell, Dashboard and Logout
            <div className="auth-buttons">
              {/* Notification Bell - Only show when authenticated */}
              {isAuthenticated && (
                <div>
                  <NotificationBell
                    filteredTimetables={filteredTimetables}
                    filteredDemoClasses={filteredDemoClasses}
                    filteredStudents={filteredStudents}
                    combinedActivity={[]} 
                    classesError={classesError}
                    studentsError={studentsError}
                    employeesError={employeesError}
                  />
                </div>
              )}
              
              <NavLink
                to="/dashboard"
                className="auth-btn"
                onClick={handleLinkClick} 
                activeClassName="active-btn"
              >
                Dashboard
              </NavLink>
<button onClick={handleLogoutClick} className="auth-btn logout-btn">
  <FaSignOutAlt />
  <span>Logout</span>
</button>
            </div>
          ) : (
            // If not authenticated and no localStorage data, show Login and Book Demo
            <div className="auth-buttons">
              <NavLink
                to="/book-demo"
                className="book-btn"
                onClick={handleLinkClick}
                activeClassName="active-btn"
              >
                Book Demo
              </NavLink>
              <NavLink
                to="/login"
                className="auth-btn auth-secondary-btn"
                onClick={handleLinkClick}
                activeClassName="active-btn"
              >
                Login
              </NavLink>
            </div>
          )}
        </nav>
      </header>

      {/* This container will only be visible on mobile screens - Only show when NOT authenticated */}
      {!isAuthenticated && (
        <div className="program-highlight-container-mobile">
          <NavLink
            to="#"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick();
              window.open('/ElectronAcademy_Brochure.pdf', '_blank');
            }}
            activeClassName="active-link"
            className="program-highlight-link"
          >
            <FaDownload style={{ marginRight: '8px' }} />
            Download Brochure
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Navbar;