import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaStar, FaLightbulb, FaChalkboardTeacher, FaUsers,
  FaCalendarAlt, FaMoneyBillAlt, FaHome, FaChartBar, FaFileAlt, FaBookOpen,
  FaListAlt, FaGraduationCap, FaChevronDown, FaChevronUp, FaUserCircle,
  FaIdCard, FaClipboardCheck, FaFilePowerpoint, FaTasks, FaFileUpload,
  FaInfoCircle, FaDollarSign, FaUserTie, FaUserGraduate, FaRupeeSign,
  FaCalendarCheck, FaBook, FaSearch, FaSignOutAlt
} from "react-icons/fa";
import "./Sidebar.css";
import { setCurrentStudent, logoutUser } from "../redux/actions";

const Sidebar = ({ isSidebarOpen, toggleSidebar, userRole = "faculty" }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { studentId } = useParams();
  const user = useSelector((state) => state.auth.user);

  const currentStudent = useSelector((state) => state.auth?.currentStudent);
  const students = useSelector((state) => state.students?.students || []);
  const isRevisonStudent = !!currentStudent?.isRevisionProgramJEEMains2026Student || false;
  const isStudentPortfolioPage = location.pathname.includes("/student/") && location.pathname.match(/\/student\/([^\/]+)/)?.[1];
  const extractedStudentId = studentId || location.pathname.match(/\/student\/([^\/]+)/)?.[1];

  const [isStudentsExpanded, setIsStudentsExpanded] = useState(
    location.pathname.startsWith("/student-exams") ||
    location.pathname.startsWith("/week-syllabus") ||
    location.pathname.startsWith("/students") ||
    isStudentPortfolioPage
  );

  const [navigationMode, setNavigationMode] = useState("faculty");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const isFaculty = userRole === "faculty";
  const isStudent = userRole === "student";
  const isTypist = userRole === "typist";

  // Navigation Items
  const facultyNavItems = [
    { name: "My Profile", path: "/profile", icon: <FaUserCircle /> },
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "JEE (2026)", path: "/revision-students", icon: <FaGraduationCap /> },
    { name: "Students", path: "/students", icon: <FaUsers />, isParent: true },
    { name: "Timetable", path: "/timetable", icon: <FaCalendarAlt /> },
    { name: "Admissions", path: "/admissions", icon: <FaUserGraduate /> },
    { name: "Earning & Expenditure", path: "/expenditure", icon: <FaMoneyBillAlt /> },
    { name: "Academy Finance", path: "/academy-finance-dashboard", icon: <FaMoneyBillAlt /> },
    { name: "Demo Class", path: "/demo-classes", icon: <FaChalkboardTeacher /> },
    { name: "Employees", path: "/employees", icon: <FaUsers /> },
    { name: "Important Files", path: "/important-files", icon: <FaStar /> },
    { name: "Study Materials", path: "/upload-study-materials", icon: <FaFileUpload /> },
    { name: "Question Papers", path: "/upload-question-papers", icon: <FaFileAlt /> },
    // { name: "Reports", path: "/reports", icon: <FaFileAlt /> },
    // { name: "Analytics", path: "/analytics", icon: <FaChartBar /> },
    { name: "Ideas", path: "/Ideas", icon: <FaLightbulb /> },
  ];

  const typistNavItems = [
    { name: "My Profile", path: `/employee/${user?.employeeId}`, icon: <FaUserCircle /> },
    { name: "Students", path: "/students", icon: <FaUsers />, isParent: true },
    { name: "JEE (2026)", path: "/revision-students", icon: <FaGraduationCap /> },
    { name: "Timetable", path: "/timetable", icon: <FaCalendarAlt /> },
    { name: "Study Materials", path: "/upload-study-materials", icon: <FaFileUpload /> },
    { name: "Question Papers", path: "/upload-question-papers", icon: <FaFileAlt /> },
  ];

  const studentManagementSubItems = [
    { name: "Marks", path: "/student-exams", icon: <FaBookOpen /> },
    { name: "Syllabus", path: "/week-syllabus", icon: <FaListAlt /> },
  ];

  const studentPortfolioSubItems = [
    { name: "Profile", path: `/student/${extractedStudentId}/profile`, icon: <FaUserCircle /> },
    { name: "Uploads", path: `/student/${extractedStudentId}/upload`, icon: <FaRupeeSign /> },
    { name: "Syllabus", path: `/student/${extractedStudentId}/weekend`, icon: <FaCalendarAlt /> },
    { name: "Question Papers", path: `/student/${extractedStudentId}/papers`, icon: <FaFileAlt /> },
    { name: "Results & Marks", path: `/student/${extractedStudentId}/results`, icon: <FaClipboardCheck /> },
    { name: "Add Syllabus", path: `/student/${extractedStudentId}/student-syallabus-entry`, icon: <FaBookOpen /> },
    { name: "Study Materials", path: `/student/${extractedStudentId}/study-materials`, icon: <FaBook /> },
    { name: "Payments", path: `/student/${extractedStudentId}/payments`, icon: <FaRupeeSign /> },
  ];

  const studentRoleNavItems = [
    { name: "Profile", path: `/student/${extractedStudentId}/profile`, icon: <FaUserCircle /> },
    { name: "Syllabus", path: `/student/${extractedStudentId}/weekend`, icon: <FaCalendarAlt /> },
    { name: "Results & Marks", path: `/student/${extractedStudentId}/results`, icon: <FaClipboardCheck /> },
    { name: "Add Syllabus", path: `/student/${extractedStudentId}/student-syallabus-entry`, icon: <FaClipboardCheck /> },
    ...(isRevisonStudent ? [{ name: "Classes Info", path: `/student/${extractedStudentId}/classes`, icon: <FaChalkboardTeacher /> }] : []),
    { name: "Study Materials", path: `/student/${extractedStudentId}/study-materials`, icon: <FaBook /> },
    { name: "Question Papers", path: `/student/${extractedStudentId}/papers`, icon: <FaFileAlt /> },
    { name: "Payments", path: `/student/${extractedStudentId}/payments`, icon: <FaRupeeSign /> },
  ];

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      const filtered = students.filter((student) => student.Name?.toLowerCase().includes(query.toLowerCase()));
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
    if (navigationMode === "faculty") setNavigationMode("student");
  };

  const handleSearchBlur = () => { setTimeout(() => { setShowSearchResults(false); }, 200); };
  const toggleStudentsDropdown = () => { setIsStudentsExpanded((prev) => !prev); };
  const handleLinkClick = () => { if (window.innerWidth <= 768) { toggleSidebar(); } };

  const isStudentsSectionActive = location.pathname.startsWith("/students") || location.pathname.startsWith("/student-exams") || location.pathname.startsWith("/week-syllabus") || isStudentPortfolioPage;

  useEffect(() => {
    if (isStudentPortfolioPage && (isFaculty || isTypist) && !isStudentsExpanded) {
      setIsStudentsExpanded(true);
    }
  }, [isStudentPortfolioPage, isFaculty, isTypist, isStudentsExpanded]);

  useEffect(() => {
    if (!isStudentPortfolioPage) { setNavigationMode("faculty"); } else { setNavigationMode("student"); }
  }, [isStudentPortfolioPage]);

  const getNavItems = () => {
    if (isStudent) return studentRoleNavItems;
    if (isStudentPortfolioPage && (isFaculty || isTypist)) {
      if (navigationMode === "student") return studentPortfolioSubItems;
      return isTypist ? typistNavItems : facultyNavItems;
    }
    if (isTypist) return typistNavItems;
    return facultyNavItems;
  };

  const getStudentSubItems = () => {
    if (!isFaculty && !isTypist) return [];
    return studentManagementSubItems;
  };

  const navItemsToShow = getNavItems();
  const studentSubItemsToShow = getStudentSubItems();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
    if (window.innerWidth <= 768) toggleSidebar();
  };

  return (
    <aside className={`sidebar ${isSidebarOpen ? "open" : ""} ${isStudent ? "student-role" : "faculty-role"}`}>

      {/* Student Search */}
      {(isFaculty || isTypist) && isStudentPortfolioPage && navigationMode === "student" && (
        <div className="student-search-container">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search students..." value={searchQuery} onChange={handleSearchChange} onBlur={handleSearchBlur} onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)} className="student-search-input" />
            {showSearchResults && searchResults.length > 0 && (
              <div className="search-results-dropdown">
                {searchResults.map((student) => (
                  <div key={student.id} className="search-result-item" onClick={() => handleStudentSelect(student)}>
                    <div className="student-name">{student.Name}</div>
                    <div className="student-details">{student.Stream} • {student.Year}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Role Toggle */}
      {(isFaculty || isTypist) && isStudentPortfolioPage && (
        <div className="navigation-toggle-container">
          <div className="navigation-toggle">
            <button className={`toggle-btn ${navigationMode === "faculty" ? "active" : ""}`} onClick={() => setNavigationMode("faculty")}>
              <FaUserTie className="toggle-icon" /> <span className="toggle-text">{isTypist ? "Typist" : "Faculty"}</span>
            </button>
            <button className={`toggle-btn ${navigationMode === "student" ? "active" : ""}`} onClick={() => setNavigationMode("student")}>
              <FaUserGraduate className="toggle-icon" /> <span className="toggle-text">Student</span>
            </button>
          </div>
        </div>
      )}

      {/* Nav List */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-scroll-container">
          <ul>
            {navItemsToShow.map((item) => (
              <React.Fragment key={item.name}>
                <li>
                  {item.isParent && (isFaculty || isTypist) && navigationMode === "faculty" ? (
                    <NavLink to={item.path} className={`sidebar-nav-item ${isStudentsSectionActive ? "active" : ""}`} onClick={handleLinkClick} style={{ cursor: "pointer" }}>
                      {item.icon} <span>{item.name}</span>
                      {(isFaculty || isTypist) && navigationMode === "faculty" && (
                        <span className="expand-icon" onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleStudentsDropdown(); }}>
                          {isStudentsExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                        </span>
                      )}
                    </NavLink>
                  ) : (
                    <NavLink to={item.path} className={({ isActive }) => `sidebar-nav-item ${isActive ? "active" : ""}`} onClick={handleLinkClick}>
                      {item.icon} <span>{item.name}</span>
                    </NavLink>
                  )}
                </li>

                {item.name === "Students" && (isFaculty || isTypist) && navigationMode === "faculty" && isStudentsExpanded && studentSubItemsToShow.length > 0 && (
                  <div className="sidebar-sub-menu">
                    <ul>
                      {studentSubItemsToShow.map((subItem) => (
                        <li key={subItem.name}>
                          <NavLink to={subItem.path} className={({ isActive }) => `sidebar-nav-item sidebar-sub-item ${isActive ? "active-sub" : ""}`} onClick={handleLinkClick}>
                            {subItem.icon} <span>{subItem.name}</span>
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
        {window.innerWidth <= 768 && (
          <div className="sidebar-footer">
            <button className="sidebar-logout-btn" onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;