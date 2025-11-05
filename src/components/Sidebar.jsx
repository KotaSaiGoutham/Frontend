// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import {
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
  FaBook 
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ isSidebarOpen, toggleSidebar, userRole = "faculty" }) => {
  console.log("userRole",userRole)
  const location = useLocation();
  const { studentId } = useParams();

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

  // NEW: Toggle state for navigation mode on student portfolio pages
  const [navigationMode, setNavigationMode] = useState("faculty"); // "faculty" or "student"

  // ORIGINAL Faculty navigation items - ALL EXISTING ITEMS
  const facultyNavItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    {
      name: "Students",
      path: "/students",
      icon: <FaUsers />,
      isParent: true,
    },
    { name: "Timetable", path: "/timetable", icon: <FaCalendarAlt /> },
    {
      name: "Earning & Expenditure",
      path: "/expenditure",
      icon: <FaMoneyBillAlt />,
    },
    { name: "Reports", path: "/reports", icon: <FaFileAlt /> },
    {
      name: "Demo Class",
      path: "/demo-classes",
      icon: <FaChalkboardTeacher />,
    },
    { name: "Employees", path: "/employees", icon: <FaUsers /> },
    { name: "Analytics", path: "/analytics", icon: <FaChartBar /> },
    {
      name: "JEE Mains(2026) students",
      path: "/revision-students",
      icon: <FaGraduationCap />,
    },
      {
    name: "Demo Booked",
    path: "/demo-bookings",
    icon: <FaCalendarCheck />,
  },
  ];

  // ORIGINAL Student management sub-items
  const studentManagementSubItems = [
    { name: "Marks", path: "/student-exams", icon: <FaBookOpen /> },
    { name: "Syllabus", path: "/week-syllabus", icon: <FaListAlt /> },
  ];

  // Student portfolio sub-items - for faculty when viewing student portfolio
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
      name: "Results & Marks",
      path: `/student/${extractedStudentId}/results`,
      icon: <FaClipboardCheck />,
    },
    {
      name: "Classes Info",
      path: `/student/${extractedStudentId}/classes`,
      icon: <FaChalkboardTeacher />,
    },
    {
      name: "Payments",
      path: `/student/${extractedStudentId}/payments`,
      icon: <FaRupeeSign />,
    },
    {
      name: "Upload Files",
      path: `/student/${extractedStudentId}/upload`,
      icon: <FaFileUpload />,
    },
    {
      name: "Class PPT's",
      path: `/student/${extractedStudentId}/ppts`,
      icon: <FaFilePowerpoint />, 
    },
    {
      name: "Worksheets",
      path: `/student/${extractedStudentId}/worksheets`,
      icon: <FaTasks />,
    },
    {
      name: "Study Materials",
      path: `/student/${extractedStudentId}/study-materials`,
      icon: <FaBook />, // Changed to be more generic for study materials
    },
    {
      name: "Question Papers",
      path: `/student/${extractedStudentId}/papers`,
      icon: <FaFileAlt />,
    },
];

  // Student role navigation - limited access to their own portfolio
  const studentRoleNavItems = [
    {
      name: "Profile",
      path: `/student/${extractedStudentId}/profile`,
      icon: <FaUserCircle />,
    },
    {
      name: "My Syllabus",
      path: `/student/${extractedStudentId}/weekend`,
      icon: <FaCalendarAlt />,
    },
    {
      name: "My Results",
      path: `/student/${extractedStudentId}/results`,
      icon: <FaClipboardCheck />,
    },
    {
      name: "Study Materials",
      path: `/student/${extractedStudentId}/materials`,
      icon: <FaBook  />,
    },
    {
      name: "Worksheets",
      path: `/student/${extractedStudentId}/worksheets`,
      icon: <FaTasks />,
    },
  ];

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

  const isFaculty = userRole === "faculty";
  const isStudent = userRole === "student";

  // Auto-expand students section when on student portfolio pages for faculty
  useEffect(() => {
    if (isStudentPortfolioPage && isFaculty && !isStudentsExpanded) {
      setIsStudentsExpanded(true);
    }
  }, [
    isStudentPortfolioPage,
    isFaculty,
    isStudentsExpanded,
    extractedStudentId,
  ]);

  // Reset navigation mode when leaving student portfolio
  useEffect(() => {
    if (!isStudentPortfolioPage) {
      setNavigationMode("faculty");
    } else {
      setNavigationMode("student");
    }
  }, [isStudentPortfolioPage]);

  // Get navigation items based on role and context
  const getNavItems = () => {
    if (isStudent) {
      return studentRoleNavItems;
    }

    // For faculty on student portfolio pages with toggle
    if (isStudentPortfolioPage && isFaculty) {
      return navigationMode === "student"
        ? studentPortfolioSubItems
        : facultyNavItems;
    }

    // Default: faculty navigation
    return facultyNavItems;
  };

  // Get student sub-items for faculty
  const getStudentSubItems = () => {
    if (!isFaculty) return [];

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
        {/* NEW: Navigation Toggle for Faculty on Student Portfolio Pages */}
       {isFaculty && isStudentPortfolioPage && (
  <div className="navigation-toggle-container">
    <div className="navigation-toggle">
      <button
        className={`toggle-btn ${
          navigationMode === "faculty" ? "active" : ""
        }`}
        onClick={() => setNavigationMode("faculty")}
      >
        <FaUserTie className="toggle-icon" />
        <span className="toggle-text">Faculty</span>
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
                    isFaculty &&
                    navigationMode === "faculty" ? (
                      // PARENT LINK (Students) - Only for faculty in faculty mode
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
                        {/* Expand icon only for faculty in faculty mode */}
                        {isFaculty && navigationMode === "faculty" && (
                          <span
                            className="expand-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              toggleStudentsDropdown();
                            }}
                            style={{
                              marginLeft: "auto",
                              display: "flex",
                              alignItems: "center",
                              fontSize: "0.9em",
                              padding: "8px 0 8px 10px",
                              marginRight: "-10px",
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
                      // REGULAR NAV LINK for both roles and modes
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

                  {/* SUB-LINKS (Only for faculty in faculty mode on Students section) */}
                  {item.name === "Students" &&
                    isFaculty &&
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
                                    isStudentPortfolioPage
                                      ? "portfolio-sub-item"
                                      : "management-sub-item"
                                  } ${isActive ? "active-sub" : ""}`
                                }
                                onClick={handleLinkClick}
                                style={({ isActive }) => ({
                                  paddingLeft: "45px",
                                  fontSize: "0.9em",
                                  backgroundColor: isActive
                                    ? isStudentPortfolioPage
                                      ? "#fff3e0"
                                      : "#e5f0ff"
                                    : "transparent",
                                  color: isActive
                                    ? isStudentPortfolioPage
                                      ? "#e65100"
                                      : "#1976d2"
                                    : isStudentPortfolioPage
                                    ? "#ff9800"
                                    : "white",
                                  fontWeight: isActive ? 600 : 400,
                                  borderRadius: "0",
                                })}
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