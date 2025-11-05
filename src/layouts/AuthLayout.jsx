import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useSelector } from 'react-redux'; // Import useSelector
import './AuthLayout.css'; // Your existing CSS file

const AuthLayout = () => {
    // Access auth state directly from Redux store
    const { user, loading: authLoading, isAuthenticated } = useSelector(state => state.auth);

    // Determine if the current user is a student
    const isStudent = user && user.role === 'student';

    // Initialize sidebar open based on screen width
    // Sidebar is never open for students in this layout
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        return window.innerWidth > 768;
    });

    // Function to toggle sidebar (primarily used by mobile button)
    const toggleSidebar = () => {
        // Only allow toggling if it's not a student
        if (!isStudent) {
            setIsSidebarOpen(!isSidebarOpen);
        }
    };

    // Effect to handle sidebar state on window resize (for responsive behavior)
    useEffect(() => {
        const handleResize = () => {
            if (isStudent) {
                // If it's a student, sidebar is never open, so force false
                setIsSidebarOpen(false);
                return;
            }

            // For non-students:
            if (window.innerWidth > 768) {
                // On desktop, always keep sidebar open.
                setIsSidebarOpen(true);
            } else {
                // On mobile, if it was open and resized to mobile, close it by default
                setIsSidebarOpen(false); // Default to closed on mobile, user can toggle
            }
        };

        window.addEventListener('resize', handleResize);

        // Call once on mount to set initial state based on current user role and window size
        if (!authLoading) {
            handleResize();
        }

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [user, authLoading, isStudent]); // Re-run this effect when user, authLoading, or isStudent changes

    // If authentication is still loading, you might want to show a loading spinner
    if (authLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading layout...</div>;
    }

    // Determine if sidebar should be shown at all
    const showSidebar = !isStudent; // Sidebar is shown only if NOT a student

    // Determine the content class based on sidebar visibility and student role
    const contentClass = // For students, always center content
        ('sidebar-open') 

    return (
        <div className="auth-layout-container">
            {/* Conditionally render Sidebar */}
            {/* {showSidebar && ( */}
                <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} userRole={user.role}/>
            {/* )} */}

            {/* Main content area */}
            <div className={`auth-layout-content ${contentClass}`}>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
