import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import "./StudentsTable.css";
// Material-UI Imports
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TableSortLabel,
  CircularProgress, // <--- Import CircularProgress for loading spinner
  Snackbar, // <--- Import Snackbar for notifications
  Alert, // <--- Import Alert for Snackbar content
} from "@mui/material";
// Import ALL necessary icons
import {
  FaSearch,
  FaUserGraduate,
  FaTransgender,
  FaDollarSign,
  FaBookOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaUsers,
  FaHourglassHalf,
  FaIdCard,
  FaUserCircle,
  FaPlus,
  FaGraduationCap,
  FaUniversity,
  FaSearchDollar,
  FaCalendarCheck,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import {
  MuiButton,
  MuiSelect,
  MuiInput,
} from "./customcomponents/MuiCustomFormFields";
import {
  genderOptions,
  paymentStatusOptions,
  subjectOptions,
} from "../mockdata/Options";
import { fetchStudents } from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import { updateStudentPaymentStatus } from "../redux/actions";
const StudentsTable = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const {
    students,
    loading: studentsLoading,
    error: studentsError,
     updatingStudent, // ID of student currently being updated
    updateError,     // Error from update operation
    updateSuccess    // Success flag for update operation
  } = useSelector((state) => state.students);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filters, setFilters] = useState({
    studentName: "",
    subject: "",
    paymentStatus: "",
    gender: "",
    stream: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [streamOptions, setStreamOptions] = useState([]);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");

  // State for handling payment status updates
  const [updatingStudentId, setUpdatingStudentId] = useState(null); // Tracks which student is being updated
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();

  // --- Data Fetching Effect ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    // if (!token) {
    //   console.warn("No authentication token found. Redirecting to login.");
    //   dispatch(logoutUser()); // Dispatch logout to clear any lingering Redux auth state
    //   dispatch(setAuthError("No authentication token found. Please log in.")); // Set an error message in Redux
    //   return; // Stop execution if no token
    // }

    // This is where you 'take call from middleware'.
    // Dispatching this action will trigger your apiMiddleware to fetch students.
    // The middleware will handle setting loading states, handling success/failure,
    // and updating the 'students' data in your Redux store.
    dispatch(fetchStudents());
  }, [dispatch]); // 'dispatch' is stable, so this effect runs once on component mount.

  // --- Filtering Effect ---
  useEffect(() => {
    // Start with the raw students data
    let studentsToFilter = [...students]; // Assuming 'students' here is your comprehensive list of all students

    // --- 1. Apply User Permission Filters FIRST ---
    if (user) {
      // Ensure user object is available
      if (user.AllowAll) {
        // If AllowAll is true, no subject-based filtering is needed at this stage
      } else if (user.isPhysics) {
        studentsToFilter = studentsToFilter.filter(
          (student) => student.Subject?.trim() === "Physics"
        );
      } else if (user.isChemistry) {
        studentsToFilter = studentsToFilter.filter(
          (student) => student.Subject?.trim() === "Chemistry"
        );
      } else {
        // If no specific subject permission and not AllowAll, then show no students by default
        // unless there's another explicit permission (e.g., student is assigned to a teacher's specific classes)
        studentsToFilter = [];
        console.warn(
          "User has no specific subject permissions (isPhysics, isChemistry) and not AllowAll. Initial student list will be empty."
        );
      }
    } else {
      // If user object is not available yet (e.g., still loading),
      // you might want to show no students or handle it as a loading state
      studentsToFilter = [];
      console.warn("User object not available for permission filtering.");
    }

    // --- 2. Apply other filters on top of the permission-filtered list ---

    if (filters.studentName) {
      studentsToFilter = studentsToFilter.filter((student) =>
        student.Name?.toLowerCase().includes(filters.studentName.toLowerCase())
      );
    }

    // IMPORTANT: If user.isPhysics or user.isChemistry is true, this 'filters.subject'
    // condition might become redundant or conflict, depending on how your UI handles it.
    // If a user *only* sees Physics students, they shouldn't be able to filter by 'Chemistry' subject.
    // You might want to disable or pre-set the subject filter input based on user permissions.
    if (filters.subject && filters.subject !== "") {
      // Ensure not empty string
      studentsToFilter = studentsToFilter.filter(
        (student) => student.Subject?.trim() === filters.subject.trim()
      );
    }

    if (filters.paymentStatus && filters.paymentStatus !== "") {
      studentsToFilter = studentsToFilter.filter(
        (student) =>
          student["Payment Status"]?.trim() === filters.paymentStatus.trim()
      );
    }

    if (filters.gender && filters.gender !== "") {
      studentsToFilter = studentsToFilter.filter(
        (student) => student.Gender?.trim() === filters.gender.trim()
      );
    }

    if (filters.stream && filters.stream !== "") {
      studentsToFilter = studentsToFilter.filter(
        (student) => student.Stream?.trim() === filters.stream.trim()
      );
    }

    setFilteredStudents(studentsToFilter);

    // Dependencies: Crucially, include 'user' in the dependency array
  }, [filters, students, user]);

  // --- Handle Sort Request ---
  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // --- Memoized Sorted Students Data ---
  const sortedFilteredStudents = useMemo(() => {
    if (!orderBy) return filteredStudents;

    return [...filteredStudents].sort((a, b) => {
      let aValue;
      let bValue;

      if (orderBy === "monthlyFee") {
        aValue =
          typeof a["Monthly Fee"] === "number"
            ? a["Monthly Fee"]
            : parseFloat(a["Monthly Fee"]) || 0;
        bValue =
          typeof b["Monthly Fee"] === "number"
            ? b["Monthly Fee"]
            : parseFloat(b["Monthly Fee"]) || 0;
      } else if (orderBy === "classesCompleted") {
        aValue =
          typeof a["Classes Completed"] === "number"
            ? a["Classes Completed"]
            : parseFloat(a["Classes Completed"]) || 0;
        bValue =
          typeof b["Classes Completed"] === "number"
            ? b["Classes Completed"]
            : parseFloat(b["Classes Completed"]) || 0;
      } else {
        // For other columns, you might want to implement string comparison or other logic
        // For now, return 0 if no specific sort logic is defined for the column
        const valA = a[orderBy];
        const valB = b[orderBy];

        if (typeof valA === "string" && typeof valB === "string") {
          return valA.localeCompare(valB);
        }
        if (typeof valA === "number" && typeof valB === "number") {
          return valA - valB;
        }
        return 0; // Default: no specific sorting
      }

      if (aValue < bValue) {
        return order === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredStudents, orderBy, order]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // --- NEW: Handle Payment Status Toggle ---
  if (students.loading) {
    return <div className="loading-message">Loading Dashboard...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        Error: {error}
        <button onClick={() => window.location.reload()}>
          Reload Dashboard
        </button>
      </div>
    );
  }
  const showSubjectColumn = user?.AllowAll; // It will be true only if user.AllowAll is true
  // Modified handlePaymentStatusToggle to use Redux action
 const handlePaymentStatusToggle = async (studentId, currentStatus) => {
    // Determine the new status
    const newStatus = currentStatus === "Paid" ? "Unpaid" : "Paid";

    // Optimistic UI update or just show loading state.
    // Dispatch the Redux action. The action's success/failure callbacks
    // will update the Redux state, which in turn triggers the useEffect for Snackbar.
    dispatch(updateStudentPaymentStatus(studentId, newStatus));

    // Optionally provide immediate feedback via Snackbar before API response
    setSnackbarMessage(`Setting payment status to '${newStatus}'...`);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };
  return (
    <div className="dashboard-container">
      {/* Filters Section */}
      <div className="dashboard-card filters-section">
        <h2>
          <FaSearch className="inline-block mr-2" />
          Filter Students
        </h2>
        <div className="filters-grid">
          {/* Student Name Filter */}
          <MuiInput
            label="Student Name"
            name="studentName"
            value={filters.studentName}
            onChange={handleFilterChange}
            placeholder="Search by student name..."
            icon={FaUserCircle}
          />

          {/* Subject Filter */}
          <MuiSelect
            label="Subject"
            name="subject"
            value={filters.subject}
            onChange={handleFilterChange}
            options={subjectOptions}
            icon={FaBookOpen}
          />

          {/* Payment Status Filter */}
          <MuiSelect
            label="Payment Status"
            name="paymentStatus"
            value={filters.paymentStatus}
            onChange={handleFilterChange}
            options={paymentStatusOptions}
            icon={FaIdCard}
          />
          <MuiSelect
            label="Gender"
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
            options={genderOptions}
            icon={FaUsers}
          />
          <MuiSelect
            label="Stream"
            name="stream"
            value={filters.stream}
            onChange={handleFilterChange}
            options={streamOptions}
            icon={FaGraduationCap}
          />
        </div>
      </div>

      {/* Students List Table */}
      <div className="dashboard-card students-table-container">
        <div className="students-table-header-flex">
          <h2>
            <FaUsers /> Students Overview
          </h2>
          <MuiButton
            variant="contained"
            color="primary"
            onClick={() => navigate("/add-student")}
            startIcon={<FaPlus />}
          >
            Add New Student
          </MuiButton>
        </div>
        {sortedFilteredStudents.length > 0 ? (
          <TableContainer
            component={Paper}
            sx={{
              boxShadow: 3,
              borderRadius: 2,
              overflowX: "auto",
              minWidth: "100%",
            }}
          >
            <Table sx={{ minWidth: 1200 }} aria-label="student table">
              <TableHead>
                <TableRow
                  sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}
                >
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    S.No.
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      minWidth: 150,
                      p: 1.5,
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                      color: "text.secondary",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <FaUserCircle style={{ marginRight: 8, color: "#333" }} />
                      Name
                    </Box>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      minWidth: 100,
                      p: 1.5,
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                      color: "text.secondary",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaTransgender
                        style={{ marginRight: 8, color: "#e91e63" }}
                      />
                      Gender
                    </Box>
                  </TableCell>
                  {showSubjectColumn && (
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        minWidth: 120,
                        p: 1.5,
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        color: "text.secondary",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FaBookOpen
                          style={{ marginRight: 8, color: "#03a9f4" }}
                        />
                        Subject
                      </Box>
                    </TableCell>
                  )}
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      minWidth: 80,
                      p: 1.5,
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                      color: "text.secondary",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaCalendarCheck
                        style={{ marginRight: 8, color: "#ff9800" }}
                      />
                      Year
                    </Box>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      minWidth: 120,
                      p: 1.5,
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                      color: "text.secondary",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaGraduationCap
                        style={{ marginRight: 8, color: "#4caf50" }}
                      />
                      Stream
                    </Box>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      minWidth: 150,
                      p: 1.5,
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                      color: "text.secondary",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaUniversity
                        style={{ marginRight: 8, color: "#673ab7" }}
                      />
                      College
                    </Box>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      minWidth: 100,
                      p: 1.5,
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                      color: "text.secondary",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaUsers style={{ marginRight: 8, color: "#9c27b0" }} />
                      Group
                    </Box>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      minWidth: 100,
                      p: 1.5,
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                      color: "text.secondary",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaSearchDollar
                        style={{ marginRight: 8, color: "#795548" }}
                      />
                      Source
                    </Box>
                  </TableCell>
                  <TableCell
                    align="right"
                    sortDirection={orderBy === "monthlyFee" ? order : false}
                    sx={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      minWidth: 140,
                      p: 1.5,
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                      color: "text.secondary",
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === "monthlyFee"}
                      direction={orderBy === "monthlyFee" ? order : "asc"}
                      onClick={() => handleSortRequest("monthlyFee")}
                      IconComponent={
                        orderBy === "monthlyFee"
                          ? order === "asc"
                            ? FaArrowUp
                            : FaArrowDown
                          : undefined
                      }
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        "& .MuiTableSortLabel-icon": {
                          marginLeft: "8px",
                          marginRight: "0px",
                        },
                        "& .MuiTableSortLabel-iconDirectionDesc": {
                          transform: "rotate(0deg)",
                        },
                        "& .MuiTableSortLabel-iconDirectionAsc": {
                          transform: "rotate(180deg)",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <FaDollarSign
                          style={{ marginRight: 8, color: "#28a745" }}
                        />
                        Monthly Fee
                      </Box>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="right"
                    sortDirection={
                      orderBy === "classesCompleted" ? order : false
                    }
                    sx={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      minWidth: 160,
                      p: 1.5,
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                      color: "text.secondary",
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === "classesCompleted"}
                      direction={orderBy === "classesCompleted" ? order : "asc"}
                      onClick={() => handleSortRequest("classesCompleted")}
                      IconComponent={
                        orderBy === "classesCompleted"
                          ? order === "asc"
                            ? FaArrowUp
                            : FaArrowDown
                          : undefined
                      }
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        "& .MuiTableSortLabel-icon": {
                          marginLeft: "8px",
                          marginRight: "0px",
                        },
                        "& .MuiTableSortLabel-iconDirectionDesc": {
                          transform: "rotate(0deg)",
                        },
                        "& .MuiTableSortLabel-iconDirectionAsc": {
                          transform: "rotate(180deg)",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <FaHourglassHalf
                          style={{ marginRight: 8, color: "#ffc107" }}
                        />
                        Classes Completed
                      </Box>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      minWidth: 150,
                      p: 1.5,
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                      color: "text.secondary",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaCalendarAlt
                        style={{ marginRight: 8, color: "#17a2b8" }}
                      />
                      Next Class
                    </Box>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      minWidth: 150,
                      p: 1.5,
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                      color: "text.secondary",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaIdCard style={{ marginRight: 8, color: "#6c757d" }} />
                      Payment Status
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedFilteredStudents.map((student, index) => (
                  <TableRow
                    key={student.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { backgroundColor: "action.hover" },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      align="center"
                      sx={{ fontSize: "0.9rem", fontWeight: "bold" }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontSize: "0.9rem" }}
                    >
                      <Link
                        to={`/student/${student.id}`}
                        state={{ studentData: student }}
                        className="student-name-link"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          textDecoration: "underline",
                          color: "inherit",
                          fontWeight: 500,
                        }}
                      >
                        <FaUserGraduate
                          style={{ marginRight: 8, color: "#007bff" }}
                        />
                        {student.Name}
                      </Link>
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                      {student.Gender || "N/A"}
                    </TableCell>
                    {showSubjectColumn && (
                      <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                        {student.Subject || "N/A"}
                      </TableCell>
                    )}
                    <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                      {student.Year || "N/A"}
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                      {student.Stream || "N/A"}
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                      {student.College || "N/A"}
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                      {student["Group "] || "N/A"}
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                      {student.Source || "N/A"}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: "0.9rem" }}>
                      ₹
                      {(typeof student["Monthly Fee"] === "number"
                        ? student["Monthly Fee"]
                        : parseFloat(student["Monthly Fee"]) || 0
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: "0.9rem" }}>
                      {student["Classes Completed"] || "N/A"}
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                      {student.nextClass
                        ? format(parseISO(student.nextClass), "MMM dd, p")
                        : "N/A"}
                    </TableCell>
                    {/* Payment Status Cell with Click Handler and Loading */}
                   <TableCell
                    align="center"
                    sx={{
                      fontSize: "0.9rem",
                      cursor: "pointer", // Always clickable to allow toggling
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)", // Hover effect for all states
                      },
                      // Disable pointer events if this specific student is being updated
                      pointerEvents: updatingStudent === student.id ? 'none' : 'auto',
                      // Optional: Visually indicate disabled state if needed beyond spinner
                      opacity: updatingStudent === student.id ? 0.7 : 1,
                    }}
                    onClick={() =>
                      handlePaymentStatusToggle(
                        student.id,
                        student["Payment Status"]
                      )
                    }
                  >
                    {/* Show CircularProgress if this student's payment status is being updated */}
                    {updatingStudent === student.id ? (
                      <CircularProgress size={20} color="primary" /> // Show spinner
                    ) : (
                      <span
                        className={`payment-status-badge ${String(student["Payment Status"] || '').toLowerCase()}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "4px 8px",
                          borderRadius: "16px",
                          fontWeight: "bold",
                          color:
                            student["Payment Status"] === "Paid"
                              ? "#155724" // Dark green for text
                              : "#721c24", // Dark red for text
                          backgroundColor:
                            student["Payment Status"] === "Paid"
                              ? "#d4edda" // Light green background
                              : "#f8d7da", // Light red background
                          border: `1px solid ${
                            student["Payment Status"] === "Paid"
                              ? "#28a745" // Green border
                              : "#dc3545" // Red border
                          }`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {student["Payment Status"] === "Paid" ? (
                          <FaCheckCircle style={{ marginRight: 4 }} />
                        ) : (
                          <FaExclamationCircle style={{ marginRight: 4 }} />
                        )}
                        {student["Payment Status"]}
                      </span>
                    )}
                  </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p className="no-students-message">
            No students match your criteria.
          </p>
        )}
      </div>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}

      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default StudentsTable;
