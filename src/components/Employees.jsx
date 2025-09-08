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
  TableSortLabel, // This is already imported, good.
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

  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    role: "",
    paymentStatus: "",
  });
  // ✅ Change initial sort key to 'name' to have it sorted by default if desired
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  const uniqueRoles = React.useMemo(() => {
    return [...new Set(employees.map((emp) => emp.role))].sort();
  }, [employees]);

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

    // Custom sort logic: Sort by 'paid' status first (paid employees on top),
    // then by 'lastPaid' date for paid employees, and finally by other columns.
    if (sortConfig.key) {
      tempEmployees.sort((a, b) => {
        // First, sort by paid status to keep paid employees on top
        if (a.paid !== b.paid) {
          return a.paid ? -1 : 1; // -1 for a, a.paid = true, a comes before b
        }

        // If both are paid or both are unpaid, apply the user's sort
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle string sorting (e.g., name)
        if (typeof aValue === "string" && typeof bValue === "string") {
          const comparison = aValue.localeCompare(bValue);
          return sortConfig.direction === "asc" ? comparison : -comparison;
        }

        // Handle number sorting (e.g., salary) and date sorting (lastPaid)
        // For 'lastPaid', we want to sort in descending order by default for the latest date.
        if (sortConfig.key === 'lastPaid') {
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
    // ✅ This logic is perfect and works for any sortable column
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // --- Handlers for new functionality ---
  const handleEditClick = (employee) => {
    setEditingRow(employee.id);
    setNewSalary(employee.salary);
  };

  const handleSaveClick = async (employeeId) => {
    await dispatch(
      updateEmployeeData(employeeId, { salary: Number(newSalary) })
    );
    setEditingRow(null);
  };

  const handlePaidToggle = (employee) => {
    const newPaidStatus = !employee.paid;
    const updatedData = {
      paid: newPaidStatus,
    };
    dispatch(updateEmployeeData(employee.id, updatedData));
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
                    // ✅ Add the sort direction and onClick handler here
                    sortDirection={sortConfig.key === "name" ? sortConfig.direction : false}
                  >
                    <TableSortLabel
                      active={sortConfig.key === "name"}
                      direction={sortConfig.key === "name" ? sortConfig.direction : "asc"}
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
                        <FaUserTie style={{ marginRight: "8px" }} /> Employee Name
                      </Box>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
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
                  <TableCell sx={{ textAlign: "center" }}>
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
                {filteredEmployees.map((employee, index) => (
                  <TableRow
                    key={employee.id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#f7f8fc",
                      "&:hover": { backgroundColor: "#e3f2fd !important" },
                      "& > td": {
                        borderBottom: "1px solid rgba(0, 0, 0, 0.05) !important",
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
                        }}
                      >
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
                            <Typography variant="body2">
                              ₹{employee.salary.toLocaleString()}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleEditClick(employee)}
                              sx={{ ml: 1 }}
                            >
                              <FaEdit style={{ color: "grey" }} />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Typography variant="body2">
                        {employee.lastPaid && typeof employee.lastPaid === "string"
                          ? format(parseISO(employee.lastPaid), "MMM dd, yyyy")
                          : "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "16px",
                          fontWeight: "bold",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          backgroundColor: employee.paid ? "#e8f5e9" : "#ffebee",
                          color: employee.paid ? "#2e7d32" : "#d32f2f",
                          "&:hover": {
                            opacity: 0.8,
                          },
                        }}
                        onClick={() => handlePaidToggle(employee)}
                      >
                        {employee.paid ? <FaCheckCircle /> : <FaTimesCircle />}
                        <Typography
                          variant="body2"
                          component="span"
                          sx={{ ml: 1, fontWeight: "bold" }}
                        >
                          {employee.paid ? "Paid" : "Unpaid"}
                        </Typography>
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
