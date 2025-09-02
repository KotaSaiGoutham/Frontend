import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, parseISO, fromUnixTime, parse, isFuture, constructNow } from "date-fns";
import "./StudentsTable.css"; // Ensure this CSS file exists for styling
// Material-UI Imports
import { ConfirmationDialog } from "./customcomponents/Dialogs";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
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
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import { ActionButtons } from "./customcomponents/TableStatusSelect";
// Import ALL necessary icons from react-icons/fa
import { isRecentPayment,formatFirestoreDate,calculateExpectedEndDate } from "../mockdata/function";
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
  FaMoneyBillWave, // Icon for Monthly Fee
  FaClipboardList, // Icon for Classes Completed
  FaUserCheck,
  FaUserTimes,
  FaEllipsisV,
  FaEdit,
  FaTrashAlt,
  FaCalendarTimes,
} from "react-icons/fa";
// Assuming these are your custom components and mock data
import { getPdfTableHeaders, getPdfTableRows } from "../mockdata/function";
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
  updateStudentField,
  updateClassesCompleted,
  fetchUpcomingClasses, // This action should fetch timetables
  toggleStudentActiveStatus,
  deleteStudent,
  fetchAutoTimetablesForToday,
  fetchClassUpdates
} from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import PdfDownloadButton from "./customcomponents/PdfDownloadButton";
import { ClassCounterDisplay } from "../mockdata/function";
import TableHeaders from "./students/TableHeaders";
import { studentColumns } from "../mockdata/Options";

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
    contactNumber: false,
    motherContact: false,
    fatherContact: false,
    monthlyFee: true,
    classesCompleted: true,
    startDate :true,
    endDate :true,
    nextClass: false,
    paymentStatus: true,
    status: false,
    actions: true,
  });
  const [animate, setAnimate] = useState(false);
  const handleColumnToggle = (columnName) => (event) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [columnName]: event.target.checked,
    }));
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useSelector((state) => state.students);
   const {
    classUpdates,
    loading: classUpdatesLoading,
    error: classUpdatesError,
  } = useSelector((state) => state.classes);
  console.log("classUpdates",classUpdates)

  const {
    timetables,
    loading: classesLoading,
    error: classesError,
  } = useSelector((state) => state.classes);
  const { timetables: autoTimetables, loading: autoTimetablesLoading } =
    useSelector((state) => state.autoTimetables);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [studentToUpdate, setStudentToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [studentsWithNextClass, setStudentsWithNextClass] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
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
  // Inside your component function
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event, student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };
  // Dialog handlers
  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setOpenDeleteDialog(true);
  };
  const handleConfirmDelete = async () => {
    if (studentToDelete) {
      try {
        await dispatch(deleteStudent(studentToDelete.id));
        setSnackbarSeverity("success");
        setSnackbarMessage(`Successfully deleted ${studentToDelete.Name}.`);
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Failed to delete student:", error);
        setSnackbarSeverity("error");
        setSnackbarMessage(
          `Failed to delete ${studentToDelete.Name}. Please try again.`
        );
        setSnackbarOpen(true);
      } finally {
        // Always close the dialog and clear the state, regardless of success or failure
        setOpenDeleteDialog(false);
        setStudentToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setSelectedStudent(null);
  };
  // Effect to populate lastUpdatedTimestamps from student data
  useEffect(() => {
    const newTimestamps = {};
    students.forEach((student) => {
      if (student.lastUpdatedClassesAt) {
        newTimestamps[student.id] = student.lastUpdatedClassesAt;
      }
    });
    setLastUpdatedTimestamps(newTimestamps);
  }, [students]);

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchClassUpdates())
    dispatch(fetchUpcomingClasses({date :new Date().toLocaleDateString("en-GB")}));
    dispatch(fetchAutoTimetablesForToday());
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(studentsLoading || classesLoading); // True if either students or classes are loading
    if (studentsError) {
      setError(studentsError);
    } else if (classesError) {
      setError(classesError);
    } else {
      setError("");
    }
  }, [studentsLoading, classesLoading, studentsError, classesError]);

  useEffect(() => {
    // Exit early if essential data is missing
    console.log("students===>", students);
    if (!students.length) {
      return;
    }
    const combinedTimetables = [...timetables, ...autoTimetables];
    console.log("combinedTimetables===>", combinedTimetables);

    let augmentedStudents = [];
    if (combinedTimetables.length > 0) {
      augmentedStudents = students.map((student) => {
        const studentUpcomingClasses = combinedTimetables.filter(
          (uc) => uc.Student?.toLowerCase() === student.Name?.toLowerCase()
        );

        let soonestFutureClass = null;

        studentUpcomingClasses.forEach((uc) => {
          const datePart = uc.Day;
          const timePart = uc.Time?.split(" ")[0];
          const ampmPart = uc.Time?.split(" ")[1];

          if (datePart && timePart && ampmPart) {
            try {
              const combinedDateTimeString = `${datePart} ${timePart} ${ampmPart}`;
              const classDateTime = parse(
                combinedDateTimeString,
                "dd/MM/yyyy hh:mm a",
                new Date()
              );

              if (isFuture(classDateTime)) {
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
          nextClass: soonestFutureClass,
        };
      });
    } else {
      augmentedStudents = students.map((student) => ({
        ...student,
        nextClass: null,
      }));
    }
    console.log("augmentedStudents", augmentedStudents);

    setStudentsWithNextClass(augmentedStudents);
  }, [students, timetables, autoTimetables]);
  useEffect(() => {
    let studentsToFilter = [...studentsWithNextClass]; // Start with augmented students
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
    const finalSortedStudents = studentsToFilter.sort((a, b) => {
      const aClasses =
        typeof a.classesCompleted === "number"
          ? a.classesCompleted
          : parseFloat(a.classesCompleted) || 0;
      const bClasses =
        typeof b.classesCompleted === "number"
          ? b.classesCompleted
          : parseFloat(b.classesCompleted) || 0;

      // For Descending order (highest classesCompleted first)
      return bClasses - aClasses;

      // For Ascending order (lowest classesCompleted first)
      // return aClasses - bClasses;
    });

    setFilteredStudents(finalSortedStudents); // Set the sorted list
  }, [filters, studentsWithNextClass, user]); // Dependencies: `studentsWithNextClass` is crucial here
  const handleIsActiveToggle = async (
    studentId,
    currentIsActive,
    studentName
  ) => {
    setUpdatingStudent(studentId);
    try {
      // Dispatch the specific toggleStudentActiveStatus action
      await dispatch(toggleStudentActiveStatus(studentId, currentIsActive));
      const newStatusText = !currentIsActive ? "Active" : "Inactive";
      setSnackbarSeverity("success");
      setSnackbarMessage(`${studentName} is now ${newStatusText}.`);
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(
        `Failed to update active status for ${studentName}: ${err.message}`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setUpdatingStudent(null);
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setStudentToUpdate(null);
    setNewStatus(null);
  };

  const handleConfirmStatusChange = async () => {
    if (studentToUpdate && newStatus !== null) {
      await handleIsActiveToggle(
        studentToUpdate.id,
        !newStatus,
        studentToUpdate.name
      );
    }
    setConfirmDialogOpen(false);
    setStudentToUpdate(null);
    setNewStatus(null);
  };
  const handleToggleStatusClick = (studentId, currentStatus, studentName) => {
    setStudentToUpdate({ id: studentId, name: studentName }); // Ensure 'name' is correct case here
    setNewStatus(!currentStatus); // If currently active, new status is inactive; if inactive, new status is active
    setConfirmDialogOpen(true);
  };
  const sortedFilteredStudents = useMemo(() => {
    // Create a mutable copy of filteredStudents to sort
    let studentsToSort = [...filteredStudents];

    studentsToSort.sort((a, b) => {
      // --- Primary Sort: Inactive students move to the bottom ---
      // If 'a' is active and 'b' is inactive, 'a' comes first (-1)
      if (a.isActive && !b.isActive) {
        return -1;
      }
      // If 'a' is inactive and 'b' is active, 'a' comes after 'b' (1)
      if (!a.isActive && b.isActive) {
        return 1;
      }

      // --- Secondary Sort: Apply user's selected orderBy and order only if primary sort is equal ---
      // (i.e., both are active OR both are inactive)

      if (!orderBy) {
        return 0; // If no orderBy selected, maintain original relative order within status groups
      }

      let aValue;
      let bValue;

      switch (orderBy) {
        case "name":
          aValue = a.Name?.toLowerCase() || "";
          bValue = b.Name?.toLowerCase() || "";
          return order === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);

        case "monthlyFee":
          aValue =
            typeof a["Monthly Fee"] === "number"
              ? a["Monthly Fee"]
              : parseFloat(a["Monthly Fee"]) || 0;
          bValue =
            typeof b["Monthly Fee"] === "number"
              ? b["Monthly Fee"]
              : parseFloat(b["Monthly Fee"]) || 0;
          break; // Use break for switch cases

        case "classesCompleted":
          aValue =
            typeof a.classesCompleted === "number"
              ? a.classesCompleted
              : parseFloat(a.classesCompleted) || 0;
          bValue =
            typeof b.classesCompleted === "number"
              ? b.classesCompleted
              : parseFloat(b.classesCompleted) || 0;
          break;

        case "nextClass":
          // Helper to get time value, handling Firestore Timestamps
          const getTimestampValue = (timestamp) => {
            if (!timestamp) return Infinity; // Puts null/undefined dates at the very end
            if (
              timestamp._seconds !== undefined &&
              timestamp._nanoseconds !== undefined
            ) {
              // It's a Firestore Timestamp object
              return new Date(
                timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000
              ).getTime();
            }
            // Assume it's already a Date object or something directly usable by new Date()
            return new Date(timestamp).getTime();
          };
          aValue = getTimestampValue(a.nextClass);
          bValue = getTimestampValue(b.nextClass);
          break;

        case "paymentStatus":
          // Custom sort order for Payment Status (e.g., Paid before Unpaid)
          const statusOrder = { Paid: 1, Unpaid: 2 };
          aValue = statusOrder[a["Payment Status"]] || Infinity;
          bValue = statusOrder[b["Payment Status"]] || Infinity;
          break;

        // Add other specific cases for numerical or custom sorting here if needed
        // For general string properties (like Gender, Subject, Year, etc.)
        case "Gender":
        case "Subject":
        case "Year":
        case "Stream":
        case "College":
        case "Group ": // Note the space in "Group "
        case "Source":
          aValue = (a[orderBy] || "").toLowerCase();
          bValue = (b[orderBy] || "").toLowerCase();
          return order === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);

        default:
          // Fallback for any other column, assumes simple comparison (strings or numbers)
          const valA = a[orderBy];
          const valB = b[orderBy];

          if (typeof valA === "string" && typeof valB === "string") {
            return valA.localeCompare(valB);
          }
          if (typeof valA === "number" && typeof valB === "number") {
            return valA - valB;
          }
          return 0; // If types are mixed or uncomparable, maintain relative order
      }

      // Apply the ascending/descending order for numerical/date comparisons from switch cases
      if (aValue < bValue) {
        return order === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === "asc" ? 1 : -1;
      }
      return 0; // Values are equal for the secondary sort
    });

    return studentsToSort;
  }, [filteredStudents, orderBy, order]); // Dependencies: Re-run when these change

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
    setUpdatingStudent(studentId);
    try {
      await dispatch(
        updateStudentField(studentId, "Payment Status", newStatus)
      ); // Use generic action
      setSnackbarSeverity(newStatus === "Paid" ? "success" : "error");
      setSnackbarMessage(
        `Payment status updated to "${newStatus}" for ${studentName}!`
      );
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(
        `Failed to update payment status for ${studentName}: ${err.message}`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setUpdatingStudent(null);
    }
  };
  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleClassChange = async (studentId, increment) => {
    if (updatingClasses) return; // Prevent multiple updates simultaneously
    setUpdatingClasses(studentId); // Show loading spinner for this student's classes

    const delta = increment ? 1 : -1; // Determine if incrementing or decrementing

    try {
      // Dispatch the action to update classes completed
      const updatedStudent = await dispatch(
        updateClassesCompleted(studentId, delta, user.name)
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
  const handleOpenDialog = (student, increase) => {
    setSelectedStudent(student);
    setDialogAction(increase);
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (selectedStudent && dialogAction !== null) {
      handleClassChange(selectedStudent.id, dialogAction);
    }
    setDialogOpen(false);
    setSelectedStudent(null);
    setDialogAction(null);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setSelectedStudent(null);
    setDialogAction(null);
  };
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
                <TableHeaders
                  columns={studentColumns}
                  order={order}
                  orderBy={orderBy}
                  handleSortRequest={handleSortRequest}
                  columnVisibility={columnVisibility}
                  showSubjectColumn={showSubjectColumn}
                />
                <TableBody>
                  {sortedFilteredStudents.map((student, index) => (
                    <TableRow
                      key={student.id}
                      sx={{
                        backgroundColor: isRecentPayment(student)
                          ? "#e8f5e9"
                          : student.isActive // New condition for inactive status
                          ? index % 2 === 0
                            ? "#FFFFFF"
                            : "#fbfbfb"
                          : "#ffebee", // Light red for inactive rows (Material Design error.light)
                        transition: "background-color 0.2s ease-in-out",

                        animation: isRecentPayment(student)
                          ? "highlightFade 2s ease-in-out infinite"
                          : "none",

                        "&:hover": {
                          backgroundColor: student.isActive
                            ? "#e1f5fe"
                            : "#ffcdd2", // Slightly darker red on hover for inactive
                        },
                        "& > td": {
                          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                          fontSize: "0.95rem",
                          color: student.isActive ? "#424242" : "#D32F2F", // Make text red for inactive rows
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
                        <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
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
                              gap: 0.2,
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
                                gap: 0.2,
                              }}
                            >
                              <Tooltip title="Decrease classes completed">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleClassChange(student.id, false)
                                  } // Changed
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
                                  } // Changed
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
                                  Last Class Updated:{" "}
                                  {format(
                                    // Corrected: Convert the Firestore timestamp object to a JavaScript Date object
                                    new Date(
                                      lastUpdatedTimestamps[student.id]
                                        ._seconds * 1000
                                    ),
                                    "MMM dd, hh:mm a"
                                  )}
                                </Typography>
                              </Fade>
                            )}
                          </Box>
                        </TableCell>
                      )}
                      {columnVisibility.startDate && (
                        <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                          {formatFirestoreDate(student.startDate)}
                        </TableCell>
                      )}
                      {/* Add End Date Column */}
                      {columnVisibility.endDate && (
                        <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* Display the original endDate from the backend */}
                            <Typography variant="body2" fontWeight="bold">
                              {formatFirestoreDate(student.endDate)}
                            </Typography>

                          </Box>
                        </TableCell>
                      )}
                      {columnVisibility.nextClass && (
                        <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                          {student.nextClass
                            ? format(student.nextClass, "MMM dd, hh:mm a")
                            : "-"}
                        </TableCell>
                      )}
                      {columnVisibility.paymentStatus && (
                        <TableCell
                          sx={{
                            fontSize: "0.9rem",
                            pointerEvents:
                              updatingStudent === student.id ? "none" : "auto",
                            opacity: updatingStudent === student.id ? 0.7 : 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            // Remove gap to make it more compact, let spacing be handled by child elements
                            p: 1, // Add padding to the cell itself
                          }}
                        >
                          {updatingStudent === student.id ? (
                            <CircularProgress size={20} color="primary" />
                          ) : (
                            <>
                              <Chip
                                label={
                                  student.classesCompleted > 12
                                    ? "Unpaid"
                                    : "Paid"
                                }
                                icon={
                                  student.classesCompleted > 12 ? (
                                    <FaExclamationCircle
                                      style={{ fontSize: 16 }}
                                    />
                                  ) : (
                                    <FaCheckCircle style={{ fontSize: 16 }} />
                                  )
                                }
                                color={
                                  student.classesCompleted > 12
                                    ? "error"
                                    : "success"
                                }
                                variant="outlined"
                                onClick={() =>
                                  handlePaymentStatusToggle(
                                    student.id,
                                    student.classesCompleted > 12
                                      ? "Unpaid"
                                      : "Paid", // Pass the dynamically determined status
                                    student.Name
                                  )
                                }
                                sx={{
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                  "&:hover": { boxShadow: 1 },
                                }}
                              />
                            </>
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
                        </TableCell>
                      )}
                      {columnVisibility.status && (
                        <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                          <Box
                            onClick={() =>
                              handleToggleStatusClick(
                                student.id,
                                student.isActive,
                                student.Name
                              )
                            }
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 0.8, // Space between icon and text
                              cursor: "pointer",
                              padding: "6px 10px",
                              borderRadius: "20px",
                              border: `1px solid ${
                                student.isActive ? "#4CAF50" : "#F44336"
                              }`,
                              backgroundColor: student.isActive
                                ? "rgba(76, 175, 80, 0.1)"
                                : "rgba(244, 67, 54, 0.1)", // Light background tint
                              "&:hover": { boxShadow: 1 },
                            }}
                          >
                            {student.isActive ? (
                              <FaUserCheck style={{ color: "#4CAF50" }} />
                            ) : (
                              <FaUserTimes style={{ color: "#F44336" }} />
                            )}
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: "bold",
                                color: student.isActive ? "#4CAF50" : "#F44336",
                              }}
                            >
                              {student.isActive ? "Active" : "Inactive"}
                            </Typography>
                          </Box>
                        </TableCell>
                      )}
                      {columnVisibility.actions && (
                        <TableCell align="center" sx={{ py: 1.5 }}>
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.2,
                            }}
                          >
                            <ActionButtons
                              onEdit={() => {
                                navigate("/add-student", {
                                  state: {
                                    studentData: student,
                                    studentDataEdit: true,
                                  },
                                });
                              }}
                              onDelete={() => handleDeleteClick(student)}
                              size="small"
                            />
                          </Box>
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
          sx={{
            width: "100%",
            backgroundColor:
              snackbarSeverity === "success"
                ? snackbarMessage.includes("Inactive")
                  ? "#d32f2f"
                  : "#2e7d32" // Red for Inactive, Green for Active
                : undefined,
            color:
              snackbarSeverity === "success"
                ? snackbarMessage.includes("Inactive")
                  ? "black"
                  : "white" // Red for Inactive, Green for Active
                : undefined,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-status-dialog-title"
        aria-describedby="confirm-status-dialog-description"
      >
        <DialogTitle id="confirm-status-dialog-title">
          {newStatus ? "Activate Student" : "Deactivate Student"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-status-dialog-description">
            Are you sure you want to {newStatus ? "activate" : "deactivate"}{" "}
            student <strong>{studentToUpdate?.name}</strong>? This will mark
            them as {newStatus ? "active" : "inactive"}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </MuiButton>
          <MuiButton
            onClick={handleConfirmStatusChange}
            color={newStatus ? "success" : "error"}
            variant="contained"
            autoFocus
          >
            Confirm {newStatus ? "Activation" : "Deactivation"}
          </MuiButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete} // This handler closes the dialog without taking action
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to permanently delete{" "}
            <strong style={{ color: "red" }}>{selectedStudent?.Name}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* This button cancels the action */}
          <MuiButton onClick={handleCancelDelete} color="primary">
            Cancel
          </MuiButton>

          {/* This button confirms the action and calls your function */}
          <MuiButton
            onClick={handleConfirmDelete} // Call the handleConfirmDelete function here
            color="error"
            autoFocus
          >
            Delete
          </MuiButton>
        </DialogActions>
      </Dialog>
      <ConfirmationDialog
        open={dialogOpen}
        studentName={selectedStudent?.Name || ""}
        isIncreaseAction={dialogAction}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </Box>
  );
};

export default StudentsTable;
