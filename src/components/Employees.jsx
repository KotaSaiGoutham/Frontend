// src/pages/Employees.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMoneyBillWave,
  FaUserTie,
  FaBuilding,
  FaWallet,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaFilter,
  FaUserCircle,
  FaPlusCircle,
  FaExclamationCircle,
  FaPhone,
  FaSortUp,
  FaSortDown, // Import sort icons
} from "react-icons/fa";
import { format, parseISO } from "date-fns";

// MUI Imports
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Alert,
  Grid,
  TableSortLabel, // Import TableSortLabel for better UX
} from "@mui/material";

// Custom MUI Form Fields (from src/components/MuiCustomFormFields.jsx)
import {
  MuiInput,
  MuiSelect,
  MuiButton,
} from "../components/customcomponents/MuiCustomFormFields";

import "./Employees.css"; // Keep existing custom styles for specific elements like badges
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees } from "../redux/actions"; // <-- Import setAuthError
// You might also need to import SET_AUTH_ERROR from types if you use it directly in component for some reason
// import { SET_AUTH_ERROR } from '../redux/types';

const Employees = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Should be declared here

  // --- Selectors to get state from Redux store ---
  // Assuming your employee data, loading, and error states are managed by an 'employees' reducer
  const employees = useSelector((state) => state.employees.employees); // The main employee data from Redux
  const employeesLoading = useSelector((state) => state.employees.loading); // Loading state from Redux
  const employeesError = useSelector((state) => state.employees.error); // Error state from Redux
console.log("employees",employees)
  // Local state for filtering and sorting, initialized from Redux data
  const [filteredSalaries, setFilteredSalaries] = useState([]); // Will be initialized from `employees`
  const [filters, setFilters] = useState({
    name: "",
    role: "",
    paymentStatus: "",
  });
  // State for sorting: key of the column, and direction ('asc' or 'desc')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Deriving unique roles from the fetched Redux data
  // This useEffect will run whenever `employees` (from Redux) changes
  const uniqueRoles = React.useMemo(() => {
    return [...new Set(employees.map((emp) => emp.role))].sort();
  }, [employees]);

  // --- Initial data fetch using Redux action ---
  useEffect(() => {
    // Dispatch the Redux action to fetch employees
    dispatch(fetchEmployees());

    // The loading and error states are now managed by the Redux store
    // through the `fetchEmployees` action and its corresponding reducer.
  }, [dispatch, navigate]); // Dependencies: dispatch (stable), navigate (stable)

  // --- Effect for Filtering and Sorting ---
  // This useEffect now depends on `employees` (from Redux) and local `filters`/`sortConfig`
  useEffect(() => {
    // Start with the raw employees data from Redux, not a local `salaries` state
    let tempSalaries = [...employees];

    // Apply filters
    if (filters.name) {
      tempSalaries = tempSalaries.filter((employee) =>
        employee.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.role) {
      tempSalaries = tempSalaries.filter(
        (employee) => employee.role === filters.role
      );
    }

    if (filters.paymentStatus) {
      const isPaid = filters.paymentStatus === "paid";
      tempSalaries = tempSalaries.filter(
        (employee) => employee.paid === isPaid
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      tempSalaries.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle string comparison (case-insensitive for names/roles)
        if (typeof aValue === "string" && typeof bValue === "string") {
          const comparison = aValue.localeCompare(bValue);
          return sortConfig.direction === "asc" ? comparison : -comparison;
        }

        // Handle numeric/boolean comparison
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredSalaries(tempSalaries);
  }, [filters, employees, sortConfig]); // Depend on Redux `employees` data

  // --- Handle filter change ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // --- Handle Add Employee button click ---
  const handleAddEmployeeClick = () => {
    navigate("/add-employee");
  };

  // --- Handle column sorting ---
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // --- Conditional Rendering for Loading and Error States ---
  if (employeesLoading) {
    // Use Redux loading state
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          gap: 2,
          backgroundColor: "#f7f8fc",
          p: 3,
        }}
      >
        <CircularProgress size={60} sx={{ color: "#292551" }} />
        <Typography variant="h6" color="text.secondary">
          Loading Employees...
        </Typography>
      </Box>
    );
  }

  // Combine employeesError and authErrorFromStore for display
  if (employeesError) {
    const displayError = employeesError;
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          gap: 2,
          backgroundColor: "#f7f8fc",
          p: 3,
        }}
      >
        <Alert
          severity="error"
          sx={{ width: "100%", maxWidth: 400, justifyContent: "center" }}
        >
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <FaExclamationCircle style={{ marginRight: "10px" }} /> Error:{" "}
            {displayError}
          </Typography>
        </Alert>
        <MuiButton
          variant="contained"
          onClick={() => dispatch(fetchEmployees())} // Retry fetching data
          sx={{
            bgcolor: "#1976d2",
            "&:hover": { bgcolor: "#1565c0" },
            borderRadius: "8px",
            px: 3,
            py: 1.2,
          }}
        >
          Retry
        </MuiButton>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f8fc",
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Header Card */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            display: "flex",
            alignItems: "center",
            color: "#292551",
            fontWeight: 700,
          }}
        >
          <FaMoneyBillWave
            style={{ marginRight: "10px", fontSize: "2.5rem" }}
          />{" "}
          Employees Overview
        </Typography>
      </Paper>

      {/* Filters Section */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#333",
              fontWeight: 600,
            }}
          >
            <FaFilter style={{ marginRight: "10px", fontSize: "1.8rem" }} />{" "}
            Filter Employees
          </Typography>
          <MuiButton
            variant="contained"
            startIcon={<FaPlusCircle />}
            onClick={handleAddEmployeeClick}
            sx={{
              bgcolor: "#4caf50",
              "&:hover": { bgcolor: "#388e3c" },
              borderRadius: "8px",
              px: 3,
              py: 1.2,
            }}
          >
            Add Employee
          </MuiButton>
        </Box>
        <div className="filters-grid">
            <MuiInput
              label="Employee Name"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Search by name..."
              icon={FaUserCircle}
            />
            <MuiSelect
              label="Role"
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All Roles" },
                ...uniqueRoles.map((role) => ({ value: role, label: role })),
              ]}
              icon={FaBuilding}
            />
            <MuiSelect
              label="Payment Status"
              name="paymentStatus"
              value={filters.paymentStatus}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All Statuses" },
                { value: "paid", label: "Paid" },
                { value: "unpaid", label: "Unpaid" },
              ]}
              icon={FaWallet}
            />
        </div>
      </Paper>

      {/* Table Section */}
      <Paper elevation={3} sx={{ p: 2 }}>
        {filteredSalaries.length > 0 ? (
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="employees table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#eff2f7" }}>
                  <TableCell
                    sx={{
                      color: "#333",
                      fontWeight: "bold",
                      fontSize: "1.05rem",
                      p: "18px 12px",
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaUserTie style={{ marginRight: "8px" }} /> Employee Name
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#333",
                      fontWeight: "bold",
                      fontSize: "1.05rem",
                      p: "18px 12px",
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaPhone style={{ marginRight: "8px" }} /> Mobile Number
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#333",
                      fontWeight: "bold",
                      fontSize: "1.05rem",
                      p: "18px 12px",
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaBuilding style={{ marginRight: "8px" }} /> Role
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#333",
                      fontWeight: "bold",
                      fontSize: "1.05rem",
                      p: "18px 12px",
                      textAlign: "center",
                    }}
                    sortDirection={
                      sortConfig.key === "salary" ? sortConfig.direction : false
                    }
                  >
                    <TableSortLabel
                      active={sortConfig.key === "salary"}
                      direction={
                        sortConfig.key === "salary"
                          ? sortConfig.direction
                          : "asc"
                      }
                      onClick={() => handleSort("salary")}
                      sx={{
                        "& .MuiTableSortLabel-icon": {
                          opacity: sortConfig.key === "salary" ? 1 : 0.4,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FaWallet style={{ marginRight: "8px" }} /> Monthly
                        Salary
                      </Box>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#333",
                      fontWeight: "bold",
                      fontSize: "1.05rem",
                      p: "18px 12px",
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaCalendarAlt style={{ marginRight: "8px" }} /> Last Paid
                      Date
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#333",
                      fontWeight: "bold",
                      fontSize: "1.05rem",
                      p: "18px 12px",
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaCheckCircle style={{ marginRight: "8px" }} /> Payment
                      Status
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSalaries.map((employee, index) => (
                  <TableRow
                    key={employee.id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#f7f8fc",
                      "&:hover": { backgroundColor: "#e3f2fd !important" },
                      "& > td": {
                        borderBottom:
                          "1px solid rgba(0, 0, 0, 0.05) !important",
                      },
                    }}
                  >
                    <TableCell sx={{ textAlign: "left" }}>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start", // ⬅️ Correct value for left-alignment
    }}
  >
    <FaUserCircle
      style={{
        marginRight: "8px",
        fontSize: "1.5rem",
        color: "#555",
      }}
    />
    <Typography variant="body1">{employee.name}</Typography>
  </Box>
</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Typography variant="body2">
                        {employee.mobile || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Typography variant="body2">{employee.role}</Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Typography variant="body2">
                        ₹{employee.salary.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Typography variant="body2">
                        {employee.lastPaid
                          ? format(parseISO(employee.lastPaid), "MMM dd, yyyy")
                          : "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Box
                        className={`salary-status-badge ${
                          employee.paid ? "paid" : "unpaid"
                        }`}
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "16px",
                          fontWeight: "bold",
                          fontSize: "0.85rem",
                          "&.paid": {
                            bgcolor: "#e8f5e9",
                            color: "#2e7d32",
                          },
                          "&.unpaid": {
                            bgcolor: "#ffebee",
                            color: "#d32f2f",
                          },
                          "& svg": {
                            marginRight: "6px",
                            fontSize: "1rem",
                          },
                        }}
                      >
                        {employee.paid ? <FaCheckCircle /> : <FaTimesCircle />}
                        {employee.paid ? "Paid" : "Unpaid"}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography
            variant="body1"
            sx={{ textAlign: "center", p: 3, color: "text.secondary" }}
          >
            No employee data available matching your filters.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Employees;
