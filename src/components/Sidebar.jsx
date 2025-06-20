// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
// Import all necessary icons for the sidebar options
import { FaChartLine, FaBars, FaTimes, FaUsers, FaCalendarAlt, FaMoneyBillAlt,FaHome } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const location = useLocation();

    // Define all navigation items for the sidebar
    const navItems = [
                { name: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
        { name: 'Students', path: '/students', icon: <FaUsers /> },
        { name: 'Timetable', path: '/timetable', icon: <FaCalendarAlt /> },
        { name: 'Employees', path: '/employees', icon: <FaMoneyBillAlt /> },
    ];

    return (
        <>
            {/* Mobile Menu Toggle Button */}
            <div className="mobile-menu-toggle" onClick={toggleSidebar}>
                {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </div>

            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <nav className="sidebar-nav">
                    <ul>
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `sidebar-nav-item ${
                                            // This logic ensures the 'Dashboard' link stays active
                                            // if any of its sub-paths (/dashboard/students, etc.) are active.
                                            // For other links, it just uses isActive.
                                            (item.path === '/students' && location.pathname.startsWith('/students')) || isActive
                                                ? 'active'
                                                : ''
                                        }`
                                    }
                                    onClick={() => {
                                        // Only close the sidebar on mobile after clicking a link
                                        if (window.innerWidth <= 768) {
                                            toggleSidebar();
                                        }
                                    }}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;