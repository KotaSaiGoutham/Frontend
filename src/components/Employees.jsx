// src/pages/Employees.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaMoneyBillWave, FaUserTie, FaBuilding, FaWallet, FaCheckCircle,
    FaTimesCircle, FaCalendarAlt, FaFilter, FaUserCircle, FaPlusCircle, FaExclamationCircle, FaPhone,
    FaSortUp, FaSortDown // Import sort icons
} from 'react-icons/fa';
import { format, parseISO } from 'date-fns';

// MUI Imports
import {
    Box, Typography, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
    CircularProgress, Alert, Grid, TableSortLabel // Import TableSortLabel for better UX
} from '@mui/material';

// Custom MUI Form Fields (from src/components/MuiCustomFormFields.jsx)
import { MuiInput, MuiSelect, MuiButton } from '../components/MuiCustomFormFields';

import './Employees.css'; // Keep existing custom styles for specific elements like badges

const Employees = () => {
    const [salaries, setSalaries] = useState([]);
    const [filteredSalaries, setFilteredSalaries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        name: '',
        role: '',
        paymentStatus: '',
    });
    // State for sorting: key of the column, and direction ('asc' or 'desc')
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const navigate = useNavigate();

    // Deriving unique roles from the fetched data
    const uniqueRoles = [...new Set(salaries.map(emp => emp.role))].sort();

    useEffect(() => {
        const fetchEmployees = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                setError('Authentication required. Please log in.');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError('');

            try {
                const response = await fetch('http://localhost:5000/api/data/empolyees', {
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

                setSalaries(data);
                setFilteredSalaries(data); // Initialize filtered salaries with all data

            } catch (err) {
                console.error('Error fetching employees:', err);
                setError(`Failed to load employees data: ${err.message}. Please try again.`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployees();
    }, [navigate]);

    useEffect(() => {
        let tempSalaries = [...salaries];

        // Apply filters
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

        // Apply sorting
        if (sortConfig.key) {
            tempSalaries.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        setFilteredSalaries(tempSalaries);
    }, [filters, salaries, sortConfig]); // Add sortConfig to dependency array

    // handleFilterChange for MuiInput and MuiSelect expects an event object
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

    // Function to handle sorting when a column header is clicked
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    if (isLoading) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80vh',
                gap: 2,
                backgroundColor: '#f7f8fc', // Match page background
                p: 3
            }}>
                <CircularProgress size={60} sx={{ color: '#292551' }} />
                <Typography variant="h6" color="text.secondary">Loading Employees...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80vh',
                gap: 2,
                backgroundColor: '#f7f8fc', // Match page background
                p: 3
            }}>
                <Alert severity="error" sx={{ width: '100%', maxWidth: 400, justifyContent: 'center' }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                         <FaExclamationCircle style={{ marginRight: '10px' }} /> Error: {error}
                    </Typography>
                </Alert>
                <MuiButton
                    variant="contained"
                    onClick={() => window.location.reload()}
                    sx={{
                        bgcolor: '#1976d2', // Standard Material-UI blue
                        '&:hover': { bgcolor: '#1565c0' },
                        borderRadius: '8px',
                        px: 3,
                        py: 1.2
                    }}
                >
                    Retry
                </MuiButton>
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#f7f8fc', // Consistent page background color
            p: 3, // Padding around the entire page content
            display: 'flex',
            flexDirection: 'column',
            gap: 3 // Spacing between different sections/cards
        }}>
            {/* Header Card */}
            <Paper elevation={3} sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(0, 0, 0, 0.08)', // Soft border for separation
            }}>
                <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', color: '#292551', fontWeight: 700 }}>
                    <FaMoneyBillWave style={{ marginRight: '10px', fontSize: '2.5rem' }} /> Employees Overview
                </Typography>
            </Paper>

            {/* Filters Section */}
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center', color: '#333', fontWeight: 600 }}>
                        <FaFilter style={{ marginRight: '10px', fontSize: '1.8rem' }} /> Filter Employees
                    </Typography>
                    <MuiButton
                        variant="contained"
                        startIcon={<FaPlusCircle />}
                        onClick={handleAddEmployeeClick}
                        sx={{
                            bgcolor: '#4caf50', // Green for add button
                            '&:hover': { bgcolor: '#388e3c' },
                            borderRadius: '8px',
                            px: 3,
                            py: 1.2
                        }}
                    >
                        Add Employee
                    </MuiButton>
                </Box>
                <Grid container spacing={2}> {/* Using Grid for responsive filter layout */}
                    <Grid item xs={12} sm={4}>
                        <MuiInput
                            label="Employee Name"
                            name="name"
                            value={filters.name}
                            onChange={handleFilterChange}
                            placeholder="Search by name..."
                            icon={FaUserCircle} // Pass icon component as prop
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <MuiSelect
                            label="Role"
                            name="role"
                            value={filters.role}
                            onChange={handleFilterChange}
                            options={[
                                { value: '', label: 'All Roles' },
                                ...uniqueRoles.map(role => ({ value: role, label: role }))
                            ]}
                            icon={FaBuilding} // Pass icon component as prop
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <MuiSelect
                            label="Payment Status"
                            name="paymentStatus"
                            value={filters.paymentStatus}
                            onChange={handleFilterChange}
                            options={[
                                { value: '', label: 'All Statuses' },
                                { value: 'paid', label: 'Paid' },
                                { value: 'unpaid', label: 'Unpaid' }
                            ]}
                            icon={FaWallet} // Pass icon component as prop
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Table Section */}
            <Paper elevation={3} sx={{ p: 2 }}>
                {filteredSalaries.length > 0 ? (
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }} aria-label="employees table">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#eff2f7' }}> {/* Light grey background for header */}
                                    <TableCell sx={{ color: '#333', fontWeight: 'bold', fontSize: '1.05rem', p: '18px 12px', textAlign: 'center' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaUserTie style={{ marginRight: '8px' }} /> Employee Name</Box>
                                    </TableCell>
                                    {/* Mobile Number Header */}
                                    <TableCell sx={{ color: '#333', fontWeight: 'bold', fontSize: '1.05rem', p: '18px 12px', textAlign: 'center' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaPhone style={{ marginRight: '8px' }} /> Mobile Number</Box>
                                    </TableCell>
                                    <TableCell sx={{ color: '#333', fontWeight: 'bold', fontSize: '1.05rem', p: '18px 12px', textAlign: 'center' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaBuilding style={{ marginRight: '8px' }} /> Role</Box>
                                    </TableCell>
                                    {/* Monthly Salary Header with Sorting */}
                                    <TableCell
                                        sx={{ color: '#333', fontWeight: 'bold', fontSize: '1.05rem', p: '18px 12px', textAlign: 'center' }}
                                        sortDirection={sortConfig.key === 'salary' ? sortConfig.direction : false}
                                    >
                                        <TableSortLabel
                                            active={sortConfig.key === 'salary'}
                                            direction={sortConfig.key === 'salary' ? sortConfig.direction : 'asc'}
                                            onClick={() => handleSort('salary')}
                                            sx={{ '& .MuiTableSortLabel-icon': { opacity: sortConfig.key === 'salary' ? 1 : 0.4 } }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <FaWallet style={{ marginRight: '8px' }} /> Monthly Salary
                                            </Box>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ color: '#333', fontWeight: 'bold', fontSize: '1.05rem', p: '18px 12px', textAlign: 'center' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaCalendarAlt style={{ marginRight: '8px' }} /> Last Paid Date</Box>
                                    </TableCell>
                                    <TableCell sx={{ color: '#333', fontWeight: 'bold', fontSize: '1.05rem', p: '18px 12px', textAlign: 'center' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaCheckCircle style={{ marginRight: '8px' }} /> Payment Status</Box>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredSalaries.map((employee, index) => (
                                    <TableRow
                                        key={employee.id}
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#f7f8fc', // Alternating row colors
                                            '&:hover': { backgroundColor: '#e3f2fd !important' }, // Hover effect on rows
                                            '& > td': { borderBottom: '1px solid rgba(0, 0, 0, 0.05) !important' } // Soft borders between cells
                                        }}
                                    >
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <FaUserCircle style={{ marginRight: '8px', fontSize: '1.5rem', color: '#555' }} />
                                                <Typography variant="body1">{employee.name}</Typography>
                                            </Box>
                                        </TableCell>
                                        {/* Mobile Number Cell */}
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Typography variant="body2">{employee.mobile || 'N/A'}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Typography variant="body2">{employee.role}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Typography variant="body2">₹{employee.salary.toLocaleString()}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Typography variant="body2">
                                                {employee.lastPaid ? format(parseISO(employee.lastPaid), 'MMM dd, yyyy') : 'N/A'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            {/* Retain original class for custom CSS styling of badges */}
                                            <Box className={`salary-status-badge ${employee.paid ? 'paid' : 'unpaid'}`}
                                                 sx={{ // Add some MUI sx props for direct inline styling if needed
                                                     display: 'inline-flex',
                                                     alignItems: 'center',
                                                     px: 1.5,
                                                     py: 0.5,
                                                     borderRadius: '16px',
                                                     fontWeight: 'bold',
                                                     fontSize: '0.85rem',
                                                     // These colors can be moved to CSS if preferred for consistency
                                                     '&.paid': {
                                                         bgcolor: '#e8f5e9', // Light green
                                                         color: '#2e7d32', // Dark green text
                                                     },
                                                     '&.unpaid': {
                                                         bgcolor: '#ffebee', // Light red
                                                         color: '#d32f2f', // Dark red text
                                                     },
                                                     '& svg': {
                                                         marginRight: '6px',
                                                         fontSize: '1rem',
                                                     }
                                                 }}
                                            >
                                                {employee.paid ? <FaCheckCircle /> : <FaTimesCircle />}
                                                {employee.paid ? 'Paid' : 'Unpaid'}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography variant="body1" sx={{ textAlign: 'center', p: 3, color: 'text.secondary' }}>
                        No employee data available matching your filters.
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default Employees;