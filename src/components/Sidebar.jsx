// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
// Import all necessary icons for the sidebar options
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
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const location = useLocation();
    
    // State to manage the expanded/collapsed state of the Students section
    const [isStudentsExpanded, setIsStudentsExpanded] = useState(
        location.pathname.startsWith("/student-exams") ||
        location.pathname.startsWith("/week-syllabus") ||
        location.pathname.startsWith("/students")
    );

    const navItems = [
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
    ];

    // Separate array for sub-links
    const studentSubItems = [
        { name: "Marks", path: "/student-exams", icon: <FaBookOpen /> },
        { name: "Syllabus", path: "/week-syllabus", icon: <FaListAlt /> },
    ];

    // Function to toggle the expanded state (Only changes state)
    const toggleStudentsDropdown = () => {
        setIsStudentsExpanded(prev => !prev);
    };

    // Helper function to handle sidebar closing on mobile
    const handleLinkClick = () => {
        if (window.innerWidth <= 768) {
            toggleSidebar();
        }
    };

    // Function to determine if a parent link is active (including its children)
    const isStudentsSectionActive = 
        location.pathname.startsWith("/students") ||
        location.pathname.startsWith("/student-exams") ||
        location.pathname.startsWith("/week-syllabus");

    return (
        <>
            <div className="mobile-menu-toggle" onClick={toggleSidebar}>
                {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </div>

            <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <nav className="sidebar-nav">
                    <ul>
                        {navItems.map((item) => (
                            <React.Fragment key={item.name}>
                                <li>
                                    {item.isParent ? (
                                        // PARENT LINK (Students) - SWITCHED TO NAVLINK
                                        <NavLink
                                            to={item.path}
                                            className={`sidebar-nav-item ${isStudentsSectionActive ? "active" : ""}`}
                                            onClick={handleLinkClick} // Allows navigation to /students and closes on mobile
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {item.icon}
                                            <span>{item.name}</span>
                                            {/* ICON FOR TOGGLE - Uses e.stopPropagation() to prevent NavLink navigation */}
                                            <span 
                                                className="expand-icon" 
                                                onClick={(e) => {
                                                    // CRITICAL: Stop the click from bubbling up to the NavLink, 
                                                    // which would otherwise navigate.
                                                    e.stopPropagation(); 
                                                    e.preventDefault(); // Also helps prevent default anchor behavior if the link path is '#' or similar
                                                    toggleStudentsDropdown(); // Only toggle the state
                                                }}
                                                style={{ 
                                                    marginLeft: 'auto', 
                                                    display: 'flex', 
                                                    alignItems: 'center',
                                                    fontSize: '0.9em',
                                                    // Adjust padding to make the icon target easier to click
                                                    padding: '8px 0 8px 10px', 
                                                    marginRight: '-10px' 
                                                }}
                                            >
                                                {isStudentsExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                                            </span>
                                        </NavLink>
                                    ) : (
                                        // REGULAR NAV LINK
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

                                {/* SUB-LINKS (Rendered only if Students is the parent and expanded) */}
                                {item.name === "Students" && isStudentsExpanded && (
                                    <div className="sidebar-sub-menu">
                                        <ul>
                                            {studentSubItems.map((subItem) => (
                                                <li key={subItem.name}>
                                                    <NavLink
                                                        to={subItem.path}
                                                        className={({ isActive }) =>
                                                            `sidebar-nav-item sidebar-sub-item ${isActive ? "active-sub" : ""}`
                                                        }
                                                        onClick={handleLinkClick}
                                                        // Inline Styles for professional sub-menu background and look
                                                        style={({ isActive }) => ({
                                                            paddingLeft: '45px',
                                                            fontSize: '0.9em',
                                                            backgroundColor: isActive ? '#e5f0ff' : 'transparent', // Light blue active background
                                                            color: isActive ? '#1976d2' : 'white', // Blue/Gray text color
                                                            fontWeight: isActive ? 600 : 400,
                                                            borderRadius: '0', 
                                                            // Ensure hover works nicely (Note: CSS pseudo-classes like :hover 
                                                            // are best defined in the CSS file, but for a quick fix 
                                                            // this is often used in React)
                                                            // '&:hover': { backgroundColor: '#f0f4f8' } // This line is not valid JS/JSX style
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
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;