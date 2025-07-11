import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, parseISO, fromUnixTime, parse, isFuture } from "date-fns";
import "./StudentsTable.css"; // Ensure this CSS file exists for styling
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
  CircularProgress,
  Snackbar,
  Alert, // Original Alert from Material-UI
  Slide,
  Fade,
  Typography,
  IconButton,
  FormControlLabel, // <-- Import this
  Checkbox, // <-- Import this
  FormGroup, // <-- Import this
  Tooltip,
  Chip,
} from "@mui/material";
// Import ALL necessary icons from react-icons/fa
import { isRecentPayment } from "../mockdata/funcation";
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
  FaPhone,
} from "react-icons/fa";
// Assuming these are your custom components and mock data
import { getPdfTableHeaders, getPdfTableRows } from "../mockdata/funcation";
import {
  MuiButton,
  MuiSelect,
  MuiInput,
} from "./customcomponents/MuiCustomFormFields";
import {
  genderOptions,
  paymentStatusOptions,
  subjectOptions,
  streamOptions,
} from "../mockdata/Options";
// Redux actions
import {
  fetchStudents,
  updateStudentPaymentStatus,
  updateClassesCompleted,
  fetchUpcomingClasses, // This action should fetch timetables
} from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";
// PDF Download Button component
import PdfDownloadButton from "./customcomponents/PdfDownloadButton";
import { ClassCounterDisplay } from "../mockdata/funcation";

// Custom Alert component for Snackbar, using forwardRef as recommended by Material-UI
// This allows the Snackbar to correctly pass its ref to the Alert component.
const MuiAlert = React.forwardRef(function MuiAlert(props, ref) {
  return <Alert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StudentsTable = () => {
  const [columnVisibility, setColumnVisibility] = useState({
    gender: false,
    subject: false,
    year: false,
    stream: false,
    college: false,
    group: false,
    source: false,
    contactNumber: true,
    motherContact: false,
    fatherContact: false,
    monthlyFee: true,
    classesCompleted: true,
    nextClass: false,
    paymentStatus: true,
  });
  const [animate, setAnimate] = useState(false);

  // Handler for checkbox changes
  const handleColumnToggle = (columnName) => (event) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [columnName]: event.target.checked,
    }));
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors for Redux state
  const { user } = useSelector((state) => state.auth);
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useSelector((state) => state.students);

  const {
    timetables, // The actual data for upcoming classes
    loading: classesLoading, // Loading state for timetables
    error: classesError, // Error state for timetables
  } = useSelector((state) => state.classes);

  // Local component states
  const [studentsWithNextClass, setStudentsWithNextClass] = useState([]); // Students augmented with next class info
  const [filteredStudents, setFilteredStudents] = useState([]); // Students after applying filters
  const [filters, setFilters] = useState({
    studentName: "",
    subject: "",
    paymentStatus: "",
    gender: "",
    stream: "",
  });
  const [isLoading, setIsLoading] = useState(true); // Combined loading state for initial data fetch
  const [error, setError] = useState(""); // Combined error message
  const [orderBy, setOrderBy] = useState(""); // Column to sort by
  const [order, setOrder] = useState("asc"); // Sort order ('asc' or 'desc')
  const [updatingStudent, setUpdatingStudent] = useState(null); // Tracks which student's payment status is updating
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Controls Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Message for Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Severity for Snackbar ('success', 'error', 'info', 'warning')
  const [updatingClasses, setUpdatingClasses] = useState(null); // Tracks which student's classes completed is updating
  const [lastUpdatedTimestamps, setLastUpdatedTimestamps] = useState({}); // For displaying last updated time for classes

  // Effect to populate lastUpdatedTimestamps from student data
  // useEffect(() => {
  //   const newTimestamps = {};
  //   students.forEach((student) => {
  //     if (student.lastUpdatedClassesAt) {
  //       newTimestamps[student.id] = student.lastUpdatedClassesAt;
  //     }
  //   });
  //   setLastUpdatedTimestamps(newTimestamps);
  // }, [students]);

  // --- Data Fetching Effect ---
  // Dispatches actions to fetch both students and upcoming classes (timetables) on component mount.
  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchUpcomingClasses());
  }, [dispatch]); // `dispatch` is stable, so this runs once.

  useEffect(() => {
    setIsLoading(studentsLoading || classesLoading); // True if either students or classes are loading
    if (studentsError) {
      setError(studentsError);
    } else if (classesError) {
      setError(classesError);
    } else {
      setError(""); // Clear error if no errors from Redux
    }
  }, [studentsLoading, classesLoading, studentsError, classesError]); // Dependencies ensure this runs when relevant states change

  // --- Effect to augment students with nextClass from timetables ---
  // This effect runs when `students` or `timetables` data changes.
  // It matches students with their earliest upcoming class from the timetables.
  useEffect(() => {
    // Only proceed if both students and timetables data are available
    if (!students.length || !timetables.length) {
      setStudentsWithNextClass(students); // If data is missing, use raw students
      return;
    }

    const augmentedStudents = students.map((student) => {
      // Filter timetables to find classes for the current student
      const studentUpcomingClasses = timetables.filter(
        // Case-insensitive comparison for student names
        (uc) => uc.Student?.toLowerCase() === student.Name?.toLowerCase()
      );

      let soonestFutureClass = null; // To store the earliest upcoming class Date object

      studentUpcomingClasses.forEach((uc) => {
        const datePart = uc.Day; // e.g., "06/07/2025"
        // Extract time part (e.g., "11:00 PM" from "11:00 PM to 12:00 AM")
        const timePart = uc.Time?.split(" ")[0];
        const ampmPart = uc.Time?.split(" ")[1];

        if (datePart && timePart && ampmPart) {
          try {
            // Combine date and time string for parsing
            const combinedDateTimeString = `${datePart} ${timePart} ${ampmPart}`;
            // Parse the string into a Date object using the specified format
            const classDateTime = parse(
              combinedDateTimeString,
              "dd/MM/yyyy hh:mm a",
              new Date()
            );

            // Check if the parsed class date/time is in the future
            if (isFuture(classDateTime)) {
              // If it's the first future class found, or earlier than a previously found one
              if (!soonestFutureClass || classDateTime < soonestFutureClass) {
                soonestFutureClass = classDateTime;
              }
            }
          } catch (e) {
            console.warn(
              `Error parsing date for student ${student.Name}, class ${uc.Day} ${uc.Time}:`,
              e
            );
          }
        }
      });

      return {
        ...student,
        nextClass: soonestFutureClass, // Add the earliest upcoming class Date object to the student
      };
    });

    setStudentsWithNextClass(augmentedStudents);
  }, [students, timetables]); // Re-run this effect when `students` or `timetables` change

  useEffect(() => {
    let studentsToFilter = [...studentsWithNextClass]; // Start with augmented students

    // 1. Apply User Permission Filters FIRST
    if (user) {
      if (user.AllowAll) {
        // If AllowAll is true, no subject-based filtering is needed
      } else if (user.isPhysics) {
        studentsToFilter = studentsToFilter.filter(
          (student) => student.Subject?.trim() === "Physics"
        );
      } else if (user.isChemistry) {
        studentsToFilter = studentsToFilter.filter(
          (student) => student.Subject?.trim() === "Chemistry"
        );
      } else {
        // If no specific subject permission and not AllowAll, show no students by default
        studentsToFilter = [];
        console.warn(
          "User has no specific subject permissions (isPhysics, isChemistry) and not AllowAll. Initial student list will be empty."
        );
      }
    } else {
      studentsToFilter = []; // If user object is not available yet, show no students
      console.warn("User object not available for permission filtering.");
    }

    if (filters.studentName) {
      studentsToFilter = studentsToFilter.filter((student) =>
        student.Name?.toLowerCase().includes(filters.studentName.toLowerCase())
      );
    }

    if (filters.subject && filters.subject !== "") {
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
  }, [filters, studentsWithNextClass, user]); // Dependencies: `studentsWithNextClass` is crucial here

  // --- Handle Sort Request ---
  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedFilteredStudents = useMemo(() => {
    if (!orderBy) return filteredStudents; // If no sort order, return as is

    return [...filteredStudents].sort((a, b) => {
      let aValue;
      let bValue;

      // Custom sorting logic for specific columns
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
      } else if (orderBy === "nextClass") {
        // Sort by the actual Date object. `Infinity` handles null/N/A values, placing them at the end.
        aValue = a.nextClass ? a.nextClass.getTime() : Infinity;
        bValue = b.nextClass ? b.nextClass.getTime() : Infinity;
      } else {
        // Default string or number comparison for other columns
        const valA = a[orderBy];
        const valB = b[orderBy];

        if (typeof valA === "string" && typeof valB === "string") {
          return valA.localeCompare(valB);
        }
        if (typeof valA === "number" && typeof valB === "number") {
          return valA - valB;
        }
        return 0; // No specific sorting logic, maintain original order
      }

      // Apply ascending or descending order
      if (aValue < bValue) {
        return order === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === "asc" ? 1 : -1;
      }
      return 0; // Values are equal
    });
  }, [filteredStudents, orderBy, order]);

  // Handles changes in filter input fields
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Handles closing the Snackbar notification
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handlePaymentStatusToggle = async (
    studentId,
    currentStatus,
    studentName
  ) => {
    const newStatus = currentStatus === "Paid" ? "Unpaid" : "Paid";

    setUpdatingStudent(studentId); // Show loading spinner for this student's row
    try {
      await dispatch(updateStudentPaymentStatus(studentId, currentStatus));

      setSnackbarSeverity(newStatus === "Paid" ? "success" : "error");
      setSnackbarMessage(
        `Payment status updated to "${newStatus}" for ${studentName}!`
      );
      setSnackbarOpen(true); // Show Snackbar
    } catch (err) {
      setSnackbarMessage(`Failed to update payment status: ${err.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setUpdatingStudent(null); // Hide loading spinner
    }
  };

  const handleClassChange = async (studentId, increment) => {
    if (updatingClasses) return; // Prevent multiple updates simultaneously
    setUpdatingClasses(studentId); // Show loading spinner for this student's classes

    const delta = increment ? 1 : -1; // Determine if incrementing or decrementing

    try {
      // Dispatch the action to update classes completed
      const updatedStudent = await dispatch(
        updateClassesCompleted(studentId, delta)
      );

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
      setUpdatingClasses(null); // Hide loading spinner
    }
  };

  const getPdfTitle = () => {
    if (sortedFilteredStudents.length === 0) {
      return "Timetable Report"; // Default title if no data
    }

    const uniqueSubjects = [
      ...new Set(sortedFilteredStudents.map((item) => item.Subject)),
    ];
    const name = user?.name; // Get user's name if available

    if (uniqueSubjects.length === 1) {
      const subject = uniqueSubjects[0];
      if (subject === "Physics" || subject === "Chemistry") {
        return `${name} Students`; // Specific title for Physics/Chemistry teachers
      }
    }
    return "Students"; // Generic title
  };

  const showSubjectColumn = user?.AllowAll;
  const pdfHeaders = getPdfTableHeaders(columnVisibility, showSubjectColumn);
  const pdfRows = getPdfTableRows(
    sortedFilteredStudents,
    columnVisibility,
    showSubjectColumn
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress color="primary" size={60} />
        <Typography variant="h6" color="text.secondary" sx={{ ml: 2 }}>
          Loading student data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Fade in={true} timeout={500}>
        <Box sx={{ textAlign: "center", p: 4, color: "error.main" }}>
          <Typography variant="h5" component="p" sx={{ mb: 2 }}>
            <FaExclamationCircle style={{ marginRight: "10px" }} />
            Error: {error}
          </Typography>
          <MuiButton
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()} // Allows user to retry fetching data
          >
            Reload Dashboard
          </MuiButton>
        </Box>
      </Fade>
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
              filename="Student_Data.pdf"
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
      <Paper
        elevation={6}
        sx={{ p: 2, overflowX: "auto", borderRadius: "12px" }}
      >
        <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Typography variant="h6" sx={{ width: "100%", mb: 1 }}>
            Show/Hide Columns:
          </Typography>
          <FormGroup row>
            {Object.entries(columnVisibility).map(([key, isVisible]) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={isVisible}
                    onChange={handleColumnToggle(key)}
                    name={key}
                  />
                }
                label={
                  // Display human-readable names for labels
                  key === "sNo"
                    ? "S.No."
                    : key === "contactNumber"
                    ? "Contact No."
                    : key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())
                }
              />
            ))}
          </FormGroup>
        </Box>
      </Paper>
      {/* Students List Table */}
      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={700}>
        <Paper
          elevation={6}
          sx={{ p: 2, overflowX: "auto", borderRadius: "12px" }}
        >
          {sortedFilteredStudents.length > 0 ? (
            <TableContainer
              component={Paper}
              elevation={3}
              sx={{
                borderRadius: 2,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
              }}
            >
              {" "}
              <Table sx={{ minWidth: 1200 }} aria-label="student table">
                <TableHead
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                    backgroundColor: "#e3f2fd",
                  }}
                >
                  <TableRow
                    sx={{
                      borderBottom: "2px solid #1976d2",
                      backgroundColor: "#f5faff",
                    }}
                  >
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
                        color: "#1a237e",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <FaUserCircle
                          style={{ marginRight: 8, color: "#1976d2" }}
                        />{" "}
                        Name
                        {/* Add sorting icon here */}
                      </Box>
                    </TableCell>
                    {columnVisibility.gender && (
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
                          Gender
                        </Box>
                      </TableCell>
                    )}
                    {columnVisibility.subject && showSubjectColumn && (
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
                          Subject
                        </Box>
                      </TableCell>
                    )}
                    {columnVisibility.year && (
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
                          Year
                        </Box>
                      </TableCell>
                    )}
                    {columnVisibility.stream && (
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
                          Stream
                        </Box>
                      </TableCell>
                    )}
                    {columnVisibility.college && (
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
                          College
                        </Box>
                      </TableCell>
                    )}
                    {columnVisibility.group && (
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
                          <FaUsers
                            style={{ marginRight: 8, color: "#1976d2" }}
                          />{" "}
                          Group
                        </Box>
                      </TableCell>
                    )}
                    {columnVisibility.source && (
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
                          Source
                        </Box>
                      </TableCell>
                    )}
                    {columnVisibility.contactNumber && (
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
                          <FaPhone
                            style={{ marginRight: 8, color: "#1976d2" }}
                          />
                          Contact No.
                        </Box>
                      </TableCell>
                    )}
                    {columnVisibility.motherContact && (
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
                          <FaPhone
                            style={{ marginRight: 8, color: "#1976d2" }}
                          />
                          Mother Contact
                        </Box>
                      </TableCell>
                    )}
                    {columnVisibility.fatherContact && (
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
                          <FaPhone
                            style={{ marginRight: 8, color: "#1976d2" }}
                          />
                          Father Contact
                        </Box>
                      </TableCell>
                    )}
                    {columnVisibility.monthlyFee && (
                      <TableCell
                        align="right"
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
                        Monthly Fee
                      </TableCell>
                    )}
                    {columnVisibility.classesCompleted && (
                      <TableCell
                        align="center"
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
                        Classes Completed
                      </TableCell>
                    )}
                    {columnVisibility.nextClass && (
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
                        Next Class
                      </TableCell>
                    )}
                    {columnVisibility.paymentStatus && (
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
                        Payment Status
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedFilteredStudents.map((student, index) => (
                    <TableRow
                      key={student.id}
                      sx={{
                        backgroundColor: isRecentPayment(student)
                          ? "#e8f5e9"
                          : index % 2 === 0
                          ? "#FFFFFF"
                          : "#fbfbfb",
                        transition: "background-color 0.2s ease-in-out",

                        // 👇 Add the animation only if student is recently paid
                        animation: isRecentPayment(student)
                          ? "highlightFade 2s ease-in-out infinite"
                          : "none",

                        "&:hover": {
                          backgroundColor: "#e1f5fe",
                        },
                        "& > td": {
                          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                          fontSize: "0.95rem",
                          color: "#424242",
                        },

                        // 👇 THIS is where you define @keyframes
                        "@keyframes highlightFade": {
                          "0%": {
                            boxShadow: "0 0 0px rgba(76, 175, 80, 0.0)",
                          },
                          "50%": {
                            boxShadow: "0 0 10px rgba(76, 175, 80, 0.5)",
                          },
                          "100%": {
                            boxShadow: "0 0 0px rgba(76, 175, 80, 0.0)",
                          },
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
                        {/* Consider making the entire row clickable or using a dedicated action button for details */}
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
                      {columnVisibility.gender && (
                        <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                          {student.Gender || "N/A"}
                        </TableCell>
                      )}
                      {columnVisibility.subject && showSubjectColumn && (
                        <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                          {student.Subject || "N/A"}
                        </TableCell>
                      )}
                      {columnVisibility.year && (
                        <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                          {student.Year || "N/A"}
                        </TableCell>
                      )}
                      {columnVisibility.stream && (
                        <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                          {student.Stream || "N/A"}
                        </TableCell>
                      )}
                      {columnVisibility.college && (
                        <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                          {student.College || "N/A"}
                        </TableCell>
                      )}
                      {columnVisibility.group && (
                        <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                          {student["Group "] || "N/A"}
                        </TableCell>
                      )}
                      {columnVisibility.source && (
                        <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                          {student.Source || "N/A"}
                        </TableCell>
                      )}
                      {columnVisibility.contactNumber && (
                        <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                          {student.ContactNumber || ""}
                        </TableCell>
                      )}
                      {columnVisibility.motherContact && (
                        <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                          {student.mother_contact || ""}
                        </TableCell>
                      )}
                      {columnVisibility.fatherContact && (
                        <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                          {student.father_contact || ""}
                        </TableCell>
                      )}
                      {columnVisibility.monthlyFee && (
                        <TableCell align="right" sx={{ fontSize: "0.9rem" }}>
                          ₹
                          {(typeof student["Monthly Fee"] === "number"
                            ? student["Monthly Fee"]
                            : parseFloat(student["Monthly Fee"]) || 0
                          ).toLocaleString()}
                        </TableCell>
                      )}
                      {columnVisibility.classesCompleted && (
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
                                updatingClasses === student.id
                                  ? "none"
                                  : "auto",
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
                              <Tooltip title="Decrease classes completed">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleClassChange(student.id, false)
                                  }
                                  color="error"
                                  sx={{
                                    transition:
                                      "transform 0.2s ease-in-out, color 0.2s ease-in-out",
                                    "&:hover": {
                                      transform: "scale(1.1)",
                                      color: "error.dark",
                                    },
                                    "&:active": {
                                      transform: "scale(0.9)",
                                    },
                                  }}
                                >
                                  <FaMinusCircle fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <ClassCounterDisplay
                                student={student}
                                updatingClasses={updatingClasses}
                              />
                              <Tooltip title="Increase classes completed">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleClassChange(student.id, true)
                                  }
                                  color="success"
                                  sx={{
                                    transition:
                                      "transform 0.2s ease-in-out, color 0.2s ease-in-out",
                                    "&:hover": {
                                      transform: "scale(1.1)",
                                      color: "success.dark",
                                    },
                                    "&:active": {
                                      transform: "scale(0.9)",
                                    },
                                  }}
                                >
                                  <FaPlusCircle fontSize="small" />
                                </IconButton>
                              </Tooltip>
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
                              (student.classesCompleted || 0) >= 12 && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "#ef5350",
                                    fontWeight: "bold",
                                    mt: 0.5,
                                    fontSize: "0.75rem",
                                    animation:
                                      "pulse-red 1.5s infinite alternate",
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
                      )}
                      {columnVisibility.nextClass && (
                        <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                          {student.nextClass
                            ? format(student.nextClass, "MMM dd, hh:mm a")
                            : "N/A"}
                        </TableCell>
                      )}
                      {columnVisibility.paymentStatus && (
                        <TableCell
                          sx={{
                            // existing props
                            fontSize: "0.9rem",
                            pointerEvents:
                              updatingStudent === student.id ? "none" : "auto",
                            opacity: updatingStudent === student.id ? 0.7 : 1,

                            /* 👇 added flex‑box centering */
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            // (optional) trim a little padding so the chip looks tight
                          }}
                        >
                          {updatingStudent === student.id ? (
                            <CircularProgress size={20} color="primary" />
                          ) : (
                            <Chip
                              label={student["Payment Status"]}
                              icon={
                                student["Payment Status"] === "Paid" ? (
                                  <FaCheckCircle style={{ fontSize: 16 }} />
                                ) : (
                                  <FaExclamationCircle
                                    style={{ fontSize: 16 }}
                                  />
                                )
                              }
                              color={
                                student["Payment Status"] === "Paid"
                                  ? "success"
                                  : "error"
                              }
                              variant="outlined"
                              onClick={() =>
                                handlePaymentStatusToggle(
                                  student.id,
                                  student["Payment Status"],
                                  student.Name
                                )
                              }
                              sx={{
                                cursor: "pointer",
                                fontWeight: "bold",
                                "&:hover": { boxShadow: 1 },
                              }}
                            />
                          )}
                        </TableCell>
                      )}
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
