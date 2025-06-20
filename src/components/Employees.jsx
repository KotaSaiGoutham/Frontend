// Employees.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaMoneyBillWave, FaUserTie, FaBuilding, FaWallet, FaCheckCircle,
    FaTimesCircle, FaCalendarAlt, FaFilter, FaUserCircle, FaPlusCircle
} from 'react-icons/fa';
import './Employees.css';
import { format, parseISO } from 'date-fns'; // Make sure parseISO is imported for date strings

const Employees = () => {
    const [salaries, setSalaries] = useState([]); // Renamed from salaries to employees for clarity in state
    const [filteredSalaries, setFilteredSalaries] = useState([]); // Will still hold filtered employees
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        name: '',
        role: '',
        paymentStatus: '',
    });
    const navigate = useNavigate();

    // REMOVE mockSalariesData as you will be fetching real data

    // uniqueRoles will be derived from the fetched data
    const uniqueRoles = [...new Set(salaries.map(emp => emp.role))].sort(); // Use 'salaries' state

    useEffect(() => {
        const fetchEmployees = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                // You might want to display a message to the user here
                setError('Authentication required. Please log in.');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(''); // Clear previous errors

            try {
                const response = await fetch('http://localhost:5000/api/data/empolyees', { // **Adjust this URL** to your backend
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch employees.');
                }

                const data = await response.json();
                console.log("Fetched employees:", data);

                // Assuming `data` is an array of employee objects
                setSalaries(data); // Set the raw fetched data to 'salaries' state
                setFilteredSalaries(data); // Initially, filtered data is all data

            } catch (err) {
                console.error('Error fetching employees:', err);
                setError(`Failed to load employees data: ${err.message}. Please try again.`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployees();
    }, [navigate]); // Depend on 'navigate' if it's used inside, or [] if only for initial fetch

    // The filtering logic based on `filters` and `salaries` remains the same
    useEffect(() => {
        let tempSalaries = [...salaries]; // Use the 'salaries' state (all fetched employees)

        if (filters.name) {
            tempSalaries = tempSalaries.filter(employee =>
                employee.name.toLowerCase().includes(filters.name.toLowerCase())
            );
        }

        if (filters.role) {
            tempSalaries = tempSalaries.filter(employee =>
                employee.role === filters.role
            );
        }

        if (filters.paymentStatus) {
            const isPaid = filters.paymentStatus === 'paid';
            tempSalaries = tempSalaries.filter(employee =>
                employee.paid === isPaid
            );
        }

        setFilteredSalaries(tempSalaries);
    }, [filters, salaries]); // Re-filter when filters or salaries (the raw data) change

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleAddEmployeeClick = () => {
        navigate('/add-employee');
    };

    if (isLoading) {
        return (
            <div className="salaries-loading-message">
                <div className="spinner"></div>
                Loading Employees...
            </div>
        );
    }

    if (error) {
        return (
            <div className="salaries-error-message">
                <h3>Error: {error}</h3>
                <button
                    onClick={() => window.location.reload()}
                    className="salaries-retry-button"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="salaries-page-container">
            <div className="salaries-header-card">
                <h1><FaMoneyBillWave className="header-icon" /> Employees Overview</h1>
               
            </div>

        {/* Filters Section */}
<div className="salaries-card filters-section">
    <div className="filters-header"> {/* New div for header and button alignment */}
        <h2><FaFilter className="section-icon" /> Filter Employees</h2>
        <button
            className="add-employee-button"
            onClick={handleAddEmployeeClick}
        >
            <FaPlusCircle /> Add Employee
        </button>
    </div>
    <div className="filters-grid">
        <div className="filter-group">
            <label htmlFor="name">Employee Name</label>
            <input
                type="text"
                id="name"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder="Search by name..."
            />
        </div>
        <div className="filter-group">
            <label htmlFor="role">Role</label>
            <select
                id="role"
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
            >
                <option value="">All Roles</option>
                {/* Use uniqueRoles derived from fetched data */}
                {/* Make sure 'uniqueRoles' is defined in your component's state/logic */}
                {/* Example: {Array.from(new Set(employees.map(emp => emp.Role))).map(role => ( */}
                {/* <option key={role} value={role}>{role}</option> */}
                {/* ))} */}
                {uniqueRoles && uniqueRoles.map(role => ( // Added a check for uniqueRoles
                    <option key={role} value={role}>{role}</option>
                ))}
            </select>
        </div>
        <div className="filter-group">
            <label htmlFor="paymentStatus">Payment Status</label>
            <select
                id="paymentStatus"
                name="paymentStatus"
                value={filters.paymentStatus}
                onChange={handleFilterChange}
            >
                <option value="">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
            </select>
        </div>
    </div>
</div>

            <div className="salaries-card salaries-table-container">
                {filteredSalaries.length > 0 ? (
                    <div className="salaries-table-wrapper">
                        <table className="salaries-table">
                            <thead>
                                <tr>
                                    <th><div className="header-content"><FaUserTie /> Employee Name</div></th>
                                    <th><div className="header-content"><FaBuilding /> Role</div></th>
                                    <th><div className="header-content"><FaWallet /> Monthly Salary</div></th>
                                    <th><div className="header-content"><FaCalendarAlt /> Last Paid Date</div></th>
                                    <th><div className="header-content"><FaCheckCircle /> Payment Status</div></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSalaries.map((employee) => (
                                    <tr key={employee.id}>
                                        <td>
                                            <div className="employee-info">
                                                <FaUserCircle className="employee-avatar" />
                                                {employee.name}
                                            </div>
                                        </td>
                                        <td>{employee.role}</td>
                                        <td>₹{employee.salary.toLocaleString()}</td>
                                        <td>
                                            {/* Ensure lastPaid is a valid date string or null before formatting */}
                                            {employee.lastPaid ? format(parseISO(employee.lastPaid), 'MMM dd, yyyy') : 'N/A'}
                                        </td>
                                        <td>
                                            <span className={`salary-status-badge ${employee.paid ? 'paid' : 'unpaid'}`}>
                                                {employee.paid ? <FaCheckCircle /> : <FaTimesCircle />}
                                                {employee.paid ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="no-salaries-message">No employee data available matching your filters.</p>
                )}
            </div>
        </div>
    );
};

export default Employees;