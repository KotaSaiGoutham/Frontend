// src/layouts/AuthLayout.jsx
import React, { useState, useEffect } from 'react'; // Ensure useEffect is imported
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './AuthLayout.css';

const AuthLayout = () => {
    // Initialize sidebar open based on screen width
    // Set to true by default for desktop (width > 768px)
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

    // Function to toggle sidebar (primarily used by mobile button)
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Effect to handle sidebar state on window resize (for responsive behavior)
    useEffect(() => {
        const handleResize = () => {
            // On desktop, always keep sidebar open. On mobile, let it close/open by toggle.
            if (window.innerWidth > 768) {
                setIsSidebarOpen(true);
            } else {
                // If it was open and resized to mobile, close it by default
                if (isSidebarOpen) { // Only change if it's currently open
                   setIsSidebarOpen(false);
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isSidebarOpen]); // Add isSidebarOpen to dependencies if you want to react to its change here

    return (
        <div className="auth-layout-container">
            {/* Sidebar is always rendered within this layout */}
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main content area that adjusts based on sidebar */}
            {/* On desktop, this will always have margin-left for the sidebar */}
            {/* On mobile, this will be full width, and the sidebar will overlay */}
            <div className={`auth-layout-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                {/* Outlet renders the specific child route (Dashboard, StudentPortfolio, etc.) */}
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;