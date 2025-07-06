import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, parseISO, fromUnixTime } from "date-fns";
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
  Slide, // Import Slide for entrance animation
  Fade, // Import Fade for loading/error
  Typography,
  IconButton,
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
  FaMinusCircle,
  FaPlusCircle,
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
import {
  fetchStudents,
  updateStudentPaymentStatus,
  updateClassesCompleted,
} from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import PdfDownloadButton from "./customcomponents/PdfDownloadButton";

const StudentsTable = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const {
    students,
    loading: studentsLoading,
    error: studentsError,
    updatingStudent, // ID of student currently being updated
    updateError, // Error from update operation
    updateSuccess, // Success flag for update operation
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
  // const [updatingStudentId, setUpdatingStudentId] = useState(null); // Tracks which student is being updated
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [updatingClasses, setUpdatingClasses] = useState(null); // For classes completed
  const [lastUpdatedTimestamps, setLastUpdatedTimestamps] = useState({});

  const navigate = useNavigate();
  useEffect(() => {
    const newTimestamps = {};
    students.forEach((student) => {
      if (student.lastUpdatedClassesAt) {
        newTimestamps[student.id] = student.lastUpdatedClassesAt;
      }
    });
    setLastUpdatedTimestamps(newTimestamps);
  }, [students]);
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
  // In your component file (e.g., StudentList.jsx or wherever handlePaymentStatusToggle is defined)

  const handlePaymentStatusToggle = async (
    studentId,
    currentStatus,
    studentName
  ) => {
    const newStatus = currentStatus === "Paid" ? "Unpaid" : "Paid";
    try {
      // Dispatch the Redux action to update the payment status
      await dispatch(updateStudentPaymentStatus(studentId, currentStatus));

      // Display success message using the passed studentName
      setSnackbarMessage(
        `Payment status updated to "${newStatus}" for ${studentName}!`
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Removed all logic related to `updateTimestampTimeoutRef` and `lastUpdatedClassesAt`
      // as per your request to simplify.
    } catch (err) {
      setSnackbarMessage(`Failed to update payment status: ${err.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // --------------------------------
  // ClassesColumn.jsx   (or similar)
  // --------------------------------
const handleClassChange = async (studentId, increment) => {
  if (updatingClasses) return;
  setUpdatingClasses(studentId);

  const delta = increment ? 1 : -1;

  try {
    const updatedStudent = await dispatch(
      updateClassesCompleted(studentId, delta)
    );

    console.log("🎉  updatedStudent returned", updatedStudent); // <-- will be an object now

    setSnackbarMessage(
      `Classes completed updated to ${updatedStudent.classesCompleted} for ${updatedStudent.Name}!`
    );
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  } catch (err) {
    setSnackbarMessage(`Failed to update classes: ${err.message}`);
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  } finally {
    setUpdatingClasses(null);
  }
};



  const getPdfTitle = () => {
    if (sortedFilteredStudents.length === 0) {
      return "Timetable Report"; // Default if no data
    }

    // Get unique subjects from the filtered timetable
    const uniqueSubjects = [
      ...new Set(sortedFilteredStudents.map((item) => item.Subject)),
    ];
    const name = user?.name;

    if (uniqueSubjects.length === 1) {
      const subject = uniqueSubjects[0];
      if (subject === "Physics") {
        return `${name} Students`;
      } else if (subject === "Chemistry") {
        return `${name} Students`;
      }
    }
    // Default title if multiple subjects or subject doesn't match specific criteria
    return "Students";
  };
  // Function to get the PDF table headers
  const getPdfTableHeaders = (showSubjectColumn) => {
    const headers = [
      { key: "sno", label: "S.No." },
      { key: "Name", label: "Name" },
      { key: "Gender", label: "Gender" },
    ];

    if (showSubjectColumn) {
      headers.push({ key: "Subject", label: "Subject" });
    }

    headers.push(
      { key: "Year", label: "Year" },
      { key: "Stream", label: "Stream" },
      { key: "College", label: "College" },
      { key: "Group ", label: "Group" }, // Note the space in "Group " key
      { key: "Source", label: "Source" },
      { key: "Monthly Fee", label: "Monthly Fee" },
      { key: "Classes Completed", label: "Classes Completed" },
      { key: "nextClass", label: "Next Class" },
      { key: "admissionDate", label: "Admission Date" }, // <--- ADDED THIS LINE!
      { key: "Payment Status", label: "Payment Status" }
    );

    return headers;
  };

  // Function to get the PDF table rows
  const getPdfTableRows = (students, showSubjectColumn) => {
    return students.map((student, index) => {
      const row = {
        sno: index + 1,
        Name: student.Name || "N/A",
        Gender: student.Gender || "N/A",
      };

      if (showSubjectColumn) {
        row.Subject = student.Subject || "N/A";
      }

      row.Year = student.Year || "N/A";
      row.Stream = student.Stream || "N/A";
      row.College = student.College || "N/A";
      row["Group "] = student["Group "] || "N/A"; // Still need bracket notation for "Group "
      row.Source = student.Source || "N/A";
      row["Monthly Fee"] = (
        typeof student["Monthly Fee"] === "number"
          ? student["Monthly Fee"]
          : parseFloat(student["Monthly Fee"]) || 0
      ).toLocaleString("en-IN"); // → "12,000"
      row["Classes Completed"] = student.classesCompleted || 0; // Using 'classesCompleted' from your data

      // nextClass logic (you don't have nextClass in your shared data, so it will always be N/A)
      row.nextClass = student.nextClass
        ? format(parseISO(student.nextClass), "MMM dd, hh:mm a")
        : "N/A";

      row["Payment Status"] = student["Payment Status"] || "N/A";

      // --- FIX FOR [OBJECT OBJECT] START ---
      // Handle admissionDate: Convert seconds to a Date object and then format it
      if (
        student.admissionDate &&
        typeof student.admissionDate._seconds === "number"
      ) {
        const date = fromUnixTime(student.admissionDate._seconds); // Convert Unix timestamp (seconds) to Date
        row.admissionDate = format(date, "MMM dd, yyyy hh:mm a"); // Format as desired (added yyyy for year)
      } else {
        row.admissionDate = "N/A";
      }

      return row;
    });
  };
  const headerConfig = getPdfTableHeaders(showSubjectColumn); // [{key,label}, …]
  const pdfHeaders = headerConfig.map((h) => h.label); // ["S.No.", "Name", …]
  const pdfRows = getPdfTableRows(
    sortedFilteredStudents,
    showSubjectColumn
  ).map((rowObj) => headerConfig.map((h) => rowObj[h.key]));

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
      {/* Header Section */}
      <Slide
        direction="down"
        in={true}
        mountOnEnter
        unmountOnExit
        timeout={500}
      >
        <Paper
          elevation={6} // Increased elevation for more depth
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            borderRadius: "12px", // Rounded corners for consistency
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FaUsers
              style={{
                marginRight: "15px",
                fontSize: "2.5rem",
                color: "#1976d2", // Primary blue color
              }}
            />
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{ color: "#292551", fontWeight: 700, mb: 0.5 }} // Darker text for headings
              >
                Students Overview
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage and filter your student records.
              </Typography>
            </Box>
          </Box>
          {sortedFilteredStudents.length > 0 && (
            <PdfDownloadButton
              title={getPdfTitle()}
              headers={pdfHeaders} // ← now plain strings
              rows={pdfRows} // ← now arrays, no [object Object]
              buttonLabel="Download Students Data (PDF)"
              filename="Student_Report.pdf"
              reportDate={new Date()}
            />
          )}
          <MuiButton
            variant="contained"
            startIcon={<FaPlus />}
            onClick={() => navigate("/add-student")}
            sx={{
              bgcolor: "#1976d2", // Changed to primary blue
              "&:hover": { bgcolor: "#1565c0" }, // Darker blue on hover
              borderRadius: "8px",
              px: 3,
              py: 1.2,
              minWidth: "180px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
            }}
          >
            Add New Student
          </MuiButton>
        </Paper>
      </Slide>

      {/* Filters Section */}
      <Slide
        direction="right"
        in={true}
        mountOnEnter
        unmountOnExit
        timeout={600}
      >
        <Paper elevation={6} sx={{ p: 3, borderRadius: "12px" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{
                display: "flex",
                alignItems: "center",
                color: "#292551",
                fontWeight: 600,
              }}
            >
              <FaSearch
                style={{
                  marginRight: "10px",
                  fontSize: "1.8rem",
                  color: "#1976d2",
                }}
              />{" "}
              Filter Students
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(5, 1fr)",
              },
              gap: 2,
            }}
          >
            <MuiInput
              label="Student Name"
              name="studentName"
              value={filters.studentName}
              onChange={handleFilterChange}
              placeholder="Search by student name..."
              icon={FaUserCircle}
            />
            {showSubjectColumn && (
              <MuiSelect
                label="Subject"
                name="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                options={subjectOptions}
                icon={FaBookOpen}
              />
            )}

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
          </Box>
        </Paper>
      </Slide>

      {/* Students List Table */}
      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={700}>
        <Paper
          elevation={6}
          sx={{ p: 2, overflowX: "auto", borderRadius: "12px" }}
        >
          {sortedFilteredStudents.length > 0 ? (
            <TableContainer>
              <Table sx={{ minWidth: 1200 }} aria-label="student table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                    {" "}
                    {/* Light blue header */}
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        color: "#1a237e",
                        fontSize: "1.05rem",
                        padding: "12px 8px",
                      }}
                    >
                      S.No.
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        minWidth: 150,
                        p: 1.5,
                        textTransform: "uppercase",
                        fontSize: "0.9rem",
                        color: "#1a237e", // Dark blue for header text
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <FaUserCircle
                          style={{ marginRight: 8, color: "#1976d2" }}
                        />{" "}
                        {/* Primary blue icon */}
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
                        fontSize: "0.9rem",
                        color: "#1a237e",
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
                          style={{ marginRight: 8, color: "#1976d2" }}
                        />{" "}
                        {/* Primary blue icon */}
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
                          fontSize: "0.9rem",
                          color: "#1a237e",
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
                            style={{ marginRight: 8, color: "#1976d2" }}
                          />{" "}
                          {/* Primary blue icon */}
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
                        fontSize: "0.9rem",
                        color: "#1a237e",
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
                          style={{ marginRight: 8, color: "#1976d2" }}
                        />{" "}
                        {/* Primary blue icon */}
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
                        fontSize: "0.9rem",
                        color: "#1a237e",
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
                          style={{ marginRight: 8, color: "#1976d2" }}
                        />{" "}
                        {/* Primary blue icon */}
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
                        fontSize: "0.9rem",
                        color: "#1a237e",
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
                          style={{ marginRight: 8, color: "#1976d2" }}
                        />{" "}
                        {/* Primary blue icon */}
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
                        fontSize: "0.9rem",
                        color: "#1a237e",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FaUsers style={{ marginRight: 8, color: "#1976d2" }} />{" "}
                        {/* Primary blue icon */}
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
                        fontSize: "0.9rem",
                        color: "#1a237e",
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
                          style={{ marginRight: 8, color: "#1976d2" }}
                        />{" "}
                        {/* Primary blue icon */}
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
                        fontSize: "0.9rem",
                        color: "#1a237e",
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
                            style={{ marginRight: 8, color: "#1976d2" }}
                          />{" "}
                          {/* Primary blue icon */}
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
                        fontSize: "0.9rem",
                        color: "#1a237e",
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === "classesCompleted"}
                        direction={
                          orderBy === "classesCompleted" ? order : "asc"
                        }
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
                            style={{ marginRight: 8, color: "#1976d2" }}
                          />{" "}
                          {/* Primary blue icon */}
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
                        fontSize: "0.9rem",
                        color: "#1a237e",
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
                          style={{ marginRight: 8, color: "#1976d2" }}
                        />{" "}
                        {/* Primary blue icon */}
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
                        fontSize: "0.9rem",
                        color: "#1a237e",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FaIdCard
                          style={{ marginRight: 8, color: "#1976d2" }}
                        />{" "}
                        {/* Primary blue icon */}
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
                        backgroundColor:
                          index % 2 === 0 ? "#FFFFFF" : "#fbfbfb", // Alternating row colors
                        "&:hover": { backgroundColor: "#e9f7fe !important" }, // Soft light blue on hover
                        "& > td": {
                          borderBottom:
                            "1px solid rgba(0, 0, 0, 0.05) !important", // Lighter borders
                          fontSize: "0.95rem",
                          color: "#424242", // Darker text for content
                        },
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
                      <TableCell
                        align="center"
                        sx={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 0.5,
                            pointerEvents:
                              updatingClasses === student.id ? "none" : "auto",
                            opacity: updatingClasses === student.id ? 0.7 : 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleClassChange(student.id, false)
                              }
                            >
                              <FaMinusCircle fontSize="small" />
                            </IconButton>
                            {updatingClasses === student.id ? (
                              <CircularProgress size={20} color="primary" />
                            ) : (
                              <Typography
                                variant="body1"
                                component="span"
                                sx={{ fontWeight: 600 }}
                              >
                                {student["Classes Completed"] || 0}
                              </Typography>
                            )}
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleClassChange(student.id, true)
                              }
                            >
                              <FaPlusCircle fontSize="small" />
                            </IconButton>
                          </Box>
                          {lastUpdatedTimestamps[student.id] && (
                            <Fade in={true} timeout={1000}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: "0.7rem" }}
                              >
                                Last Updated:{" "}
                                {format(
                                  parseISO(lastUpdatedTimestamps[student.id]),
                                  "MMM dd, hh:mm a"
                                )}
                              </Typography>
                            </Fade>
                          )}
                          {student["Payment Status"] === "Unpaid" &&
                            (student["Classes Completed"] || 0) >= 12 && (
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "#ef5350", // Red color for the message
                                  fontWeight: "bold",
                                  mt: 0.5,
                                  fontSize: "0.75rem",
                                  animation:
                                    "pulse-red 1.5s infinite alternate", // Subtle animation
                                  "@keyframes pulse-red": {
                                    "0%": { opacity: 0.7 },
                                    "100%": { opacity: 1 },
                                  },
                                }}
                              >
                                Payment Pending!
                              </Typography>
                            )}
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                        {student.nextClass
                          ? format(parseISO(student.nextClass), "MMM dd, p")
                          : "N/A"}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                          },
                          pointerEvents:
                            updatingStudent === student.id ? "none" : "auto",
                          opacity: updatingStudent === student.id ? 0.7 : 1,
                        }}
                        onClick={() =>
                          handlePaymentStatusToggle(
                            student.id,
                            student["Payment Status"],
                            student.Name // Pass the student's name here
                          )
                        }
                      >
                        {updatingStudent === student.id ? (
                          <CircularProgress size={20} color="primary" />
                        ) : (
                          <span
                            className={`payment-status-badge ${String(
                              student["Payment Status"] || ""
                            ).toLowerCase()}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "4px 8px",
                              borderRadius: "16px",
                              fontWeight: "bold",
                              color:
                                student["Payment Status"] === "Paid"
                                  ? "#155724"
                                  : "#721c24",
                              backgroundColor:
                                student["Payment Status"] === "Paid"
                                  ? "#d4edda"
                                  : "#f8d7da",
                              border: `1px solid ${
                                student["Payment Status"] === "Paid"
                                  ? "#28a745"
                                  : "#dc3545"
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
            <Typography
              variant="body1"
              sx={{ textAlign: "center", p: 3, color: "text.secondary" }}
            >
              No students match your criteria.
            </Typography>
          )}
        </Paper>
      </Slide>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentsTable;
