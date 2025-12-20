// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaLightbulb,
  FaChalkboardTeacher,
  FaBars,
  FaTimes,
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillAlt,
  FaHome,
  FaChartBar,
  FaFileAlt,
  FaBookOpen,
  FaListAlt,
  FaGraduationCap,
  FaChevronDown,
  FaChevronUp,
  FaUserCircle,
  FaIdCard,
  FaClipboardCheck,
  FaFilePowerpoint,
  FaTasks,
  FaFileUpload,
  FaInfoCircle,
  FaDollarSign,
  FaUserTie,
  FaUserGraduate,
  FaRupeeSign,
  FaCalendarCheck,
  FaBook,
  FaSearch,
} from "react-icons/fa";
import "./Sidebar.css";
import { setCurrentStudent } from "../redux/actions";

const Sidebar = ({ isSidebarOpen, toggleSidebar, userRole = "faculty" }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { studentId } = useParams();
  const user = useSelector((state) => state.auth.user);
  console.log("user",user)
  const currentStudent = useSelector((state) => state.auth?.currentStudent);
  const students = useSelector((state) => state.students?.students || []);
  const isRevisonStudent =
    !!currentStudent?.isRevisionProgramJEEMains2026Student || false;

  // Check if we're on any student portfolio page
  const isStudentPortfolioPage =
    location.pathname.includes("/student/") &&
    location.pathname.match(/\/student\/([^\/]+)/)?.[1];

  // Extract studentId from pathname if not in params
  const extractedStudentId =
    studentId || location.pathname.match(/\/student\/([^\/]+)/)?.[1];

  // State to manage the expanded/collapsed state of the Students section
  const [isStudentsExpanded, setIsStudentsExpanded] = useState(
    location.pathname.startsWith("/student-exams") ||
      location.pathname.startsWith("/week-syllabus") ||
      location.pathname.startsWith("/students") ||
      isStudentPortfolioPage
  );

  // Toggle state for navigation mode on student portfolio pages
  const [navigationMode, setNavigationMode] = useState("faculty");

  // Student search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // --- ROLE CHECKS ---
  const isFaculty = userRole === "faculty";
  const isStudent = userRole === "student";
  const isTypist = userRole === "typist";

  // Faculty navigation items
  const facultyNavItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    {
      name: "JEE (2026)",
      path: "/revision-students",
      icon: <FaGraduationCap />,
    },
    { name: "Students", path: "/students", icon: <FaUsers />, isParent: true },
    { name: "Timetable", path: "/timetable", icon: <FaCalendarAlt /> },
    { name: "Admissions", path: "/admissions", icon: <FaUserGraduate /> },
    {
      name: "Earning & Expenditure",
      path: "/expenditure",
      icon: <FaMoneyBillAlt />,
    },
    {
      name: "Academy Finance",
      path: "/academy-finance-dashboard",
      icon: <FaMoneyBillAlt />,
    },
    {
      name: "Demo Class",
      path: "/demo-classes",
      icon: <FaChalkboardTeacher />,
    },
    { name: "Demo Booked", path: "/demo-bookings", icon: <FaCalendarCheck /> },
    { name: "Employees", path: "/employees", icon: <FaUsers /> },
    { name: "Reports", path: "/reports", icon: <FaFileAlt /> },
    { name: "Analytics", path: "/analytics", icon: <FaChartBar /> },
    {
      name: "Study Materials",
      path: "/upload-study-materials",
      icon: <FaFileUpload />,
    },
    {
      name: "Question Papers",
      path: "/upload-question-papers",
      icon: <FaFileAlt />,
    },
    { name: "Ideas", path: "/Ideas", icon: <FaLightbulb /> },
     { name: "My Profile", path:"/profile", icon:<FaUserCircle/>}


  ];

  // Typist navigation items
  const typistNavItems = [
    { name: "Students", path: "/students", icon: <FaUsers />, isParent: true },
     {
      name: "JEE (2026)",
      path: "/revision-students",
      icon: <FaGraduationCap />,
    },
        { name: "Timetable", path: "/timetable", icon: <FaCalendarAlt /> },

    {
      name: "Study Materials",
      path: "/upload-study-materials",
      icon: <FaFileUpload />,
    },
    {
      name: "Question Papers",
      path: "/upload-question-papers",
      icon: <FaFileAlt />,
    },
    { name: "My Profile", path:`/employee/${user?.employeeId}`, icon:<FaUserCircle/>}
  ];

  // Student management sub-items (Visible when expanded)
  const studentManagementSubItems = [
    { name: "Marks", path: "/student-exams", icon: <FaBookOpen /> },
    { name: "Syllabus", path: "/week-syllabus", icon: <FaListAlt /> },
  ];

  // Student portfolio sub-items (When viewing a specific student)
  const studentPortfolioSubItems = [
    {
      name: "Profile",
      path: `/student/${extractedStudentId}/profile`,
      icon: <FaUserCircle />,
    },
    {
      name: "Syllabus",
      path: `/student/${extractedStudentId}/weekend`,
      icon: <FaCalendarAlt />,
    },
    {
      name: "Question Papers",
      path: `/student/${extractedStudentId}/papers`,
      icon: <FaFileAlt />,
    },
    {
      name: "Results & Marks",
      path: `/student/${extractedStudentId}/results`,
      icon: <FaClipboardCheck />,
    },
    {
      name: "Add Syllabus",
      path: `/student/${extractedStudentId}/student-syallabus-entry`,
      icon: <FaBookOpen />,
    },
    {
      name: "Study Materials",
      path: `/student/${extractedStudentId}/study-materials`,
      icon: <FaBook />,
    },
    {
      name: "Payments",
      path: `/student/${extractedStudentId}/payments`,
      icon: <FaRupeeSign />,
    },
  ];

  // Student role navigation (For actual students logged in)
  const studentRoleNavItems = [
    {
      name: "Profile",
      path: `/student/${extractedStudentId}/profile`,
      icon: <FaUserCircle />,
    },
    {
      name: "Syllabus",
      path: `/student/${extractedStudentId}/weekend`,
      icon: <FaCalendarAlt />,
    },
    {
      name: "Results & Marks",
      path: `/student/${extractedStudentId}/results`,
      icon: <FaClipboardCheck />,
    },
    {
      name: "Add Syllabus",
      path: `/student/${extractedStudentId}/student-syallabus-entry`,
      icon: <FaClipboardCheck />,
    },
    ...(isRevisonStudent
      ? [
          {
            name: "Classes Info",
            path: `/student/${extractedStudentId}/classes`,
            icon: <FaChalkboardTeacher />,
          },
        ]
      : []),
    {
      name: "Study Materials",
      path: `/student/${extractedStudentId}/study-materials`,
      icon: <FaBook />,
    },
    {
      name: "Question Papers",
      path: `/student/${extractedStudentId}/papers`,
      icon: <FaFileAlt />,
    },
    {
      name: "Payments",
      path: `/student/${extractedStudentId}/payments`,
      icon: <FaRupeeSign />,
    },
  ];

  // Search functionality
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const filtered = students.filter((student) =>
        student.Name?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleStudentSelect = async (student) => {
    setSearchQuery("");
    setShowSearchResults(false);
    setSearchResults([]);

    dispatch(setCurrentStudent(student));
    navigate(`/student/${student.id}/profile`);

    if (navigationMode === "faculty") {
      setNavigationMode("student");
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowSearchResults(false);
    }, 200);
  };

  const toggleStudentsDropdown = () => {
    setIsStudentsExpanded((prev) => !prev);
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      toggleSidebar();
    }
  };

  const isStudentsSectionActive =
    location.pathname.startsWith("/students") ||
    location.pathname.startsWith("/student-exams") ||
    location.pathname.startsWith("/week-syllabus") ||
    isStudentPortfolioPage;

  // Effects
  useEffect(() => {
    // If faculty or typist on a portfolio page, ensure students section is expanded
    if (
      isStudentPortfolioPage &&
      (isFaculty || isTypist) &&
      !isStudentsExpanded
    ) {
      setIsStudentsExpanded(true);
    }
  }, [
    isStudentPortfolioPage,
    isFaculty,
    isTypist,
    isStudentsExpanded,
    extractedStudentId,
  ]);

  useEffect(() => {
    if (!isStudentPortfolioPage) {
      setNavigationMode("faculty");
    } else {
      setNavigationMode("student");
    }
  }, [isStudentPortfolioPage]);

  // --- NAVIGATION ITEM SELECTION LOGIC ---
  const getNavItems = () => {
    // 1. Check Student Role first
    if (isStudent) {
      return studentRoleNavItems;
    }

    // 2. Check if on Portfolio Page (Apply to both Faculty AND Typist)
    if (isStudentPortfolioPage && (isFaculty || isTypist)) {
      // If in "Student View" mode, show portfolio items
      if (navigationMode === "student") {
        return studentPortfolioSubItems;
      }
      // If in "Staff View" mode, return role-specific main items
      return isTypist ? typistNavItems : facultyNavItems;
    }

    // 3. Default Views (Not on portfolio page)
    if (isTypist) {
      return typistNavItems;
    }

    return facultyNavItems;
  };

  // Get student sub-items for faculty AND typist
  const getStudentSubItems = () => {
    if (!isFaculty && !isTypist) return [];
    return studentManagementSubItems;
  };

  const navItemsToShow = getNavItems();
  const studentSubItemsToShow = getStudentSubItems();

  return (
    <>
      <div className="mobile-menu-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </div>

      <aside
        className={`sidebar ${isSidebarOpen ? "open" : ""} ${
          isStudent ? "student-role" : "faculty-role"
        }`}
      >
        {/* Student Search for Faculty/Typist on Student Portfolio Pages */}
        {(isFaculty || isTypist) &&
          isStudentPortfolioPage &&
          navigationMode === "student" && (
            <div className="student-search-container">
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search students by name..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onBlur={handleSearchBlur}
                  onFocus={() =>
                    searchQuery.length > 0 && setShowSearchResults(true)
                  }
                  className="student-search-input"
                />

                {showSearchResults && searchResults.length > 0 && (
                  <div className="search-results-dropdown">
                    {searchResults.map((student) => (
                      <div
                        key={student.id}
                        className="search-result-item"
                        onClick={() => handleStudentSelect(student)}
                      >
                        <div className="student-name">{student.Name}</div>
                        <div className="student-details">
                          {student.Stream} • {student.Year}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showSearchResults &&
                  searchQuery.length > 0 &&
                  searchResults.length === 0 && (
                    <div className="search-results-dropdown">
                      <div className="no-results">No students found</div>
                    </div>
                  )}
              </div>
            </div>
          )}

        {/* Navigation Toggle for Faculty/Typist on Student Portfolio Pages */}
        {(isFaculty || isTypist) && isStudentPortfolioPage && (
          <div className="navigation-toggle-container">
            <div className="navigation-toggle">
              <button
                className={`toggle-btn ${
                  navigationMode === "faculty" ? "active" : ""
                }`}
                onClick={() => setNavigationMode("faculty")}
              >
                <FaUserTie className="toggle-icon" />
                <span className="toggle-text">
                  {isTypist ? "Typist" : "Faculty"}
                </span>
              </button>
              <button
                className={`toggle-btn ${
                  navigationMode === "student" ? "active" : ""
                }`}
                onClick={() => setNavigationMode("student")}
              >
                <FaUserGraduate className="toggle-icon" />
                <span className="toggle-text">Student</span>
              </button>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          <div className="sidebar-nav-scroll-container">
            <ul>
              {navItemsToShow.map((item) => (
                <React.Fragment key={item.name}>
                  <li>
                    {item.isParent &&
                    (isFaculty || isTypist) &&
                    navigationMode === "faculty" ? (
                      <NavLink
                        to={item.path}
                        className={`sidebar-nav-item ${
                          isStudentsSectionActive ? "active" : ""
                        }`}
                        onClick={handleLinkClick}
                        style={{ cursor: "pointer" }}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                        {(isFaculty || isTypist) &&
                          navigationMode === "faculty" && (
                            <span
                              className="expand-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                toggleStudentsDropdown();
                              }}
                            >
                              {isStudentsExpanded ? (
                                <FaChevronUp size={12} />
                              ) : (
                                <FaChevronDown size={12} />
                              )}
                            </span>
                          )}
                      </NavLink>
                    ) : (
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `sidebar-nav-item ${isActive ? "active" : ""}`
                        }
                        onClick={handleLinkClick}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </NavLink>
                    )}
                  </li>

                  {/* Show Students Sub-Menu for Faculty AND Typist */}
                  {item.name === "Students" &&
                    (isFaculty || isTypist) &&
                    navigationMode === "faculty" &&
                    isStudentsExpanded &&
                    studentSubItemsToShow.length > 0 && (
                      <div className="sidebar-sub-menu">
                        <ul>
                          {studentSubItemsToShow.map((subItem) => (
                            <li key={subItem.name}>
                              <NavLink
                                to={subItem.path}
                                className={({ isActive }) =>
                                  `sidebar-nav-item sidebar-sub-item ${
                                    isActive ? "active-sub" : ""
                                  }`
                                }
                                onClick={handleLinkClick}
                              >
                                {subItem.icon}
                                <span>{subItem.name}</span>
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </React.Fragment>
              ))}
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;