// src/pages/Employees.js
import React, { useState, useEffect, useRef } from "react";
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
  FaEdit,
  FaCheck,
  FaEye,
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
  IconButton,
  TextField,
  TableSortLabel, 
  Tooltip,
  Chip,
} from "@mui/material";

import {
  MuiInput,
  MuiSelect,
  MuiButton,
} from "../components/customcomponents/MuiCustomFormFields";

import "./Employees.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees, updateEmployeeData } from "../redux/actions";

const Employees = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const employees = useSelector((state) => state.employees.employees);
  const employeesLoading = useSelector((state) => state.employees.loading);
  const employeesError = useSelector((state) => state.employees.error);
  const [editingRow, setEditingRow] = useState(null);
  const [newSalary, setNewSalary] = useState(""); 

  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    role: "",
    paymentStatus: "",
  });
  
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const uniqueRoles = React.useMemo(() => {
    return [...new Set(employees.map((emp) => emp.role))].sort();
  }, [employees]);
  
  // 💡 NEW MEMO: Calculate Total Payroll
  const totalPayroll = React.useMemo(() => {
    return filteredEmployees.reduce((sum, employee) => sum + (employee.salary || 0), 0);
  }, [filteredEmployees]);
  
  // 💡 NEW FORMATTER: Consistent Indian Rupee formatting
  const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });


  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch, navigate]);

  useEffect(() => {
    let tempEmployees = [...employees];

    if (filters.name) {
      tempEmployees = tempEmployees.filter((employee) =>
        employee.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    if (filters.role) {
      tempEmployees = tempEmployees.filter(
        (employee) => employee.role === filters.role
      );
    }
    if (filters.paymentStatus) {
      const isPaid = filters.paymentStatus === "paid";
      tempEmployees = tempEmployees.filter(
        (employee) => employee.paid === isPaid
      );
    } 

    if (sortConfig.key) {
      tempEmployees.sort((a, b) => {
        // First, sort by paid status to keep paid employees on top
        if (a.paid !== b.paid) {
          return a.paid ? -1 : 1; 
        } 

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key]; 

        // Handle string sorting (e.g., name)
        if (typeof aValue === "string" && typeof bValue === "string") {
          const comparison = aValue.localeCompare(bValue);
          return sortConfig.direction === "asc" ? comparison : -comparison;
        } 

        // Handle number sorting (e.g., salary) and date sorting (lastPaid) 
        if (sortConfig.key === "lastPaid") {
          const dateA = aValue ? parseISO(aValue).getTime() : 0;
          const dateB = bValue ? parseISO(bValue).getTime() : 0;
          return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
        } 

        // Fallback for other numerical values like salary
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    setFilteredEmployees(tempEmployees);
  }, [filters, employees, sortConfig]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleAddEmployeeClick = () => {
    navigate("/add-employee");
  };

  const handleSort = (key) => {
    let direction = "asc";
    
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSaveClick = async (employeeId) => {
    if (!newSalary || isNaN(newSalary)) {
      alert("Please enter a valid salary");
      return;
    }
    await dispatch(
      updateEmployeeData(employeeId, { salary: Number(newSalary) })
    );
    setEditingRow(null);
    setNewSalary(""); 
  };

  const isEmployeePaidThisMonth = (employee) => {
    return employee.paid === true;
  };

  const handlePaidToggle = async (employee) => {
    // If already paid, don't allow toggling back to unpaid
    if (employee.paid) {
      alert(
        "Employee already paid for this month. Payment status will reset automatically on 1st of next month."
      );
      return;
    }

    const newPaidStatus = !employee.paid;

    try {
      await dispatch(updateEmployeeData(employee.id, { paid: newPaidStatus }));

      if (newPaidStatus) {
        alert(`Payment marked as paid for ${employee.name}`);
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert(error.message || "Failed to update payment status");
    }
  };

  const handleEditClick = (employee) => {
    // Allow salary editing even if paid, but show warning
    if (employee.paid && isEmployeePaidThisMonth(employee)) {
      if (
        !window.confirm(
          "This employee has already been paid for this month. Changing salary will not affect this month's payment. Continue?"
        )
      ) {
        return;
      }
    }
    setEditingRow(employee.id);
    setNewSalary(employee.salary.toString());
  };

  // NEW: Handle employee name click to navigate to dashboard
  const handleEmployeeNameClick = (employee) => {
    console.log("employee",employee)
    navigate(`/employee/${employee.id}`);
  };

  // --- Conditional Rendering for Loading and Error States ---
  if (employeesLoading) {
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

  if (employeesError) {
    // Safely extract error message
    let displayError = "An error occurred while fetching employees";

    if (typeof employeesError === "string") {
      displayError = employeesError;
    } else if (employeesError?.error) {
      displayError = employeesError.error;
    } else if (employeesError?.message) {
      displayError = employeesError.message;
    } else if (typeof employeesError === "object") {
      // If it's an object, stringify it for display
      displayError = JSON.stringify(employeesError);
    }

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
          onClick={() => dispatch(fetchEmployees())}
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

      <Paper elevation={3} sx={{ p: 2 }}>
        {filteredEmployees.length > 0 ? (
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
                    Sl No
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
                      sortConfig.key === "name" ? sortConfig.direction : false
                    }
                  >
                    <TableSortLabel
                      active={sortConfig.key === "name"}
                      direction={
                        sortConfig.key === "name" ? sortConfig.direction : "asc"
                      }
                      onClick={() => handleSort("name")}
                      sx={{
                        "& .MuiTableSortLabel-icon": {
                          opacity: sortConfig.key === "name" ? 1 : 0.4,
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
                        <FaUserTie style={{ marginRight: "8px" }} /> Employee
                        Name
                      </Box>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#333",
                        fontWeight: "bold",
                        fontSize: "1.05rem",
                        p: "18px 12px",
                      }}
                    >
                      <FaPhone style={{ marginRight: "8px" }} /> Mobile Number
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#333",
                        fontWeight: "bold",
                        fontSize: "1.05rem",
                        p: "18px 12px",
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
                {filteredEmployees.map((employee, index) => (
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
                    <TableCell sx={{ textAlign: "center" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ textAlign: "left" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          cursor: "pointer",
                          "&:hover": {
                            textDecoration: "underline",
                            color: "#1976d2",
                          },
                        }}
                        onClick={() => handleEmployeeNameClick(employee)}
                      >
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <FaUserTie style={{ fontSize: "0.9rem", color: "#666" }} />
                          {employee.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Typography variant="body2">
                        {employee.mobile || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Chip
                        label={employee.role}
                        size="small"
                        sx={{
                          backgroundColor: "#e3f2fd",
                          color: "#1976d2",
                          fontWeight: 500,
                          borderRadius: "4px",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {editingRow === employee.id ? (
                          <>
                            <TextField
                              variant="outlined"
                              size="small"
                              value={newSalary}
                              onChange={(e) => setNewSalary(e.target.value)}
                              type="number"
                              inputProps={{ min: 0, step: 100 }}
                              sx={{ width: 100, mr: 1 }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleSaveClick(employee.id)}
                            >
                              <FaCheck style={{ color: "green" }} />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {currencyFormatter.format(employee.salary)}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleEditClick(employee)}
                              sx={{ ml: 1 }}
                            >
                              <FaEdit style={{ color: "#666" }} />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Typography variant="body2">
                        {employee.lastPaid &&
                        typeof employee.lastPaid === "string"
                          ? format(parseISO(employee.lastPaid), "MMM dd, yyyy")
                          : "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Tooltip
                        title={
                          employee.paid
                            ? "Already paid for this month. Will reset to unpaid on 1st of next month."
                            : "Click to mark as paid for current month"
                        }
                        placement="bottom"
                        arrow
                      >
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "16px",
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                            cursor: employee.paid ? "not-allowed" : "pointer",
                            backgroundColor: employee.paid
                              ? "#e8f5e9"
                              : "#ffebee",
                            color: employee.paid ? "#2e7d32" : "#d32f2f",
                            opacity: employee.paid ? 0.6 : 1,
                            "&:hover": {
                              opacity: employee.paid ? 0.6 : 0.8,
                              backgroundColor: employee.paid
                                ? "#d4edda"
                                : "#f8d7da",
                            },
                          }}
                          onClick={() =>
                            !employee.paid && handlePaidToggle(employee)
                          }
                        >
                          {employee.paid ? (
                            <FaCheckCircle />
                          ) : (
                            <FaTimesCircle />
                          )}
                          <Typography
                            variant="body2"
                            component="span"
                            sx={{ ml: 1, fontWeight: "bold" }}
                          >
                            {employee.paid ? "Paid" : "Unpaid"}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* 🌟 NEW ROW: Total Payroll Sum 🌟 */}
                <TableRow sx={{ backgroundColor: '#e3f2fd', '&:last-child td': { borderBottom: 0 } }}>
                    {/* The column span is 4 (Sl No, Name, Mobile, Role) */}
                    <TableCell colSpan={4} sx={{ 
                        fontWeight: 'bold', 
                        fontSize: '1.1rem', 
                        color: '#1a237e',
                        textAlign: 'right',
                        p: '16px 12px'
                    }}>
                        Total Monthly Payment
                    </TableCell>
                    <TableCell sx={{ 
                        fontWeight: 'bold', 
                        fontSize: '1.1rem', 
                        color: '#1a237e', 
                        textAlign: 'center',
                        p: '16px 12px'
                    }}>
                        {currencyFormatter.format(totalPayroll)}
                    </TableCell>
                    {/* These cells are empty to complete the row columns */}
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                </TableRow>
                {/* 🌟 END NEW ROW 🌟 */}
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