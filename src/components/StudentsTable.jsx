import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  format,
  parseISO,
  fromUnixTime,
  parse,
  isFuture,
  constructNow,
} from "date-fns";
import "./StudentsTable.css";
// Material-UI Imports
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // 👈 New Icon
import { ConfirmationDialog } from "./customcomponents/Dialogs";
import {
  Table, TableBody, TableCell, TableContainer, TableRow, Paper, Box,
  CircularProgress, Snackbar, Alert, Slide, Fade, Typography, IconButton,
  FormControlLabel, Checkbox, Tooltip, Chip, Dialog, DialogTitle,
  DialogActions, DialogContent, DialogContentText, Button, Collapse,
  Drawer, Divider, Skeleton, TableHead, useTheme, useMediaQuery,
  Card, CardContent, Grid, Avatar, Grow
} from "@mui/material";
import { ActionButtons } from "./customcomponents/TableStatusSelect";
import { isRecentPayment, formatFirestoreDate } from "../mockdata/function";
import {
  FaSearch, FaUserGraduate, FaColumns, FaCheckCircle, FaExclamationCircle,
  FaUsers, FaIdCard, FaUserCircle, FaPlus, FaGraduationCap, FaMinusCircle,
  FaPlusCircle, FaUserCheck, FaUserTimes, FaFilter, FaPhone,
  FaChevronDown, FaChevronUp, FaEdit, FaTrash, FaWhatsapp, FaUniversity, FaLayerGroup, FaVenusMars
} from "react-icons/fa";
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
  fetchStudentsIfNeeded,
  updateStudentField,
  updateClassesCompleted,
  fetchUpcomingClasses,
  toggleStudentActiveStatus,
  deleteStudent,
  fetchAutoTimetablesForToday,
} from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import PdfDownloadButton from "./customcomponents/PdfDownloadButton";
import { ClassCounterDisplay } from "../mockdata/function";
import TableHeaders from "./students/TableHeaders";
import { studentColumns } from "../mockdata/Options";
import ClassesCompletedTable from "./students/ClassesCompletedTable";
import FeatureAnnouncement from "./FeatureAnnouncement";
const textEnterVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};
// 🚀 NEW: Table Skeleton Component
const TableSkeleton = ({ rows = 10, columnVisibility }) => {
  const baseColumns = ["S.No.", "Name"];

  const toggleableColumns = Object.entries(columnVisibility)
    .filter(([key, isVisible]) => isVisible)
    .map(([key]) => key);

  const finalColumns = [
    "sNo",
    "name",
    ...Object.keys(columnVisibility).filter((key) => columnVisibility[key])
  ];

  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
      <Table sx={{ minWidth: 1200 }} aria-label="loading skeleton table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
            {finalColumns.map((colKey, index) => (
              <TableCell key={index} sx={{ py: 1.5, width: index === 1 ? '15%' : 'auto' }}>
                <Skeleton animation="wave" width="80%" height={20} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {finalColumns.map((colKey, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton
                    animation="wave"
                    width={colKey === "name" ? "95%" : colKey.includes("classes") ? "60%" : "70%"}
                    height={30}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const MobileStudentCard = ({
  student,
  index,
  handleClassChange,
  updatingClasses,
  updatingStudent,
  handlePaymentStatusToggle,
  navigate,
  handleToggleStatusClick,
  handleDeleteClick,
  isRevisionProgramJEEMains2026Student
}) => {
  const [expanded, setExpanded] = useState(false);
  const isPaid = student["Payment Status"] === "Paid";
  const isActive = student.isActive;

  // Theme Colors based on Status
  const statusColor = isPaid ? "#2e7d32" : "#d32f2f"; // Green or Red
  const bgColor = isActive ? "#ffffff" : "#fff5f5";

  return (
    <Grow in={true} timeout={(index + 1) * 200}>
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: "16px",
          background: bgColor,
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          overflow: "hidden",
          position: "relative",
          transition: "transform 0.2s",
          "&:active": { transform: "scale(0.98)" }
        }}
      >
        {/* Status Strip (Left Border) */}
        <Box sx={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: "6px",
          background: `linear-gradient(180deg, ${statusColor} 0%, ${statusColor}40 100%)`
        }} />

        <CardContent sx={{ p: 2, pl: 3 }}> {/* Extra padding left for strip */}

          {/* --- TOP ROW: Name & Actions --- */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            {/* Left: Avatar & Name */}
            <Box display="flex" gap={1.5} alignItems="center" sx={{ maxWidth: "60%" }}>
              <Avatar
                sx={{
                  bgcolor: isPaid ? "#e8f5e9" : "#ffebee",
                  color: statusColor,
                  width: 45, height: 45,
                  fontWeight: "bold",
                  fontSize: "1.1rem"
                }}
              >
                {student.Name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Link
                  to={`/student/${student.id}/profile`}
                  state={{ studentData: student }}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      lineHeight: 1.2,
                      color: "#2d3748",
                      fontSize: "1rem", // Slightly adjusted for better mobile fit
                    }}
                  >
                    {student.Name}
                  </Typography>
                </Link>

                {/* 👇 Updated Row Layout */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap", // Ensures text wraps if screen is too narrow
                    gap: 0.8, // Gap between elements
                    mt: 0.5, // Margin top to separate from Name
                  }}
                >
                  {/* Subject & Stream */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#718096",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {student.Subject} {student.Stream ? `• ${student.Stream}` : ""}
                  </Typography>

                  {/* Vertical Separator (Only show if Gender exists) */}
                  {student.Gender && (
                    <Typography
                      variant="caption"
                      sx={{ color: "#cbd5e0", fontSize: "0.8rem" }}
                    >
                      |
                    </Typography>
                  )}

                  {/* Gender */}
                  {student.Gender && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#718096",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      {student.Gender}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Right: Payment Chip & Actions (MOVED HERE) */}
            <Box display="flex" flexDirection="column" alignItems="flex-end" gap={0.5}>
              <Chip
                label={student["Payment Status"]}
                size="small"
                icon={isPaid ? <FaCheckCircle size={10} /> : <FaExclamationCircle size={10} />}
                sx={{
                  fontWeight: "bold",
                  fontSize: "0.7rem",
                  height: "24px",
                  bgcolor: isPaid ? "#e8f5e9" : "#ffebee",
                  color: statusColor,
                  borderColor: isPaid ? "#c8e6c9" : "#ffcdd2",
                  borderWidth: "1px",
                  borderStyle: "solid"
                }}
                onClick={() => handlePaymentStatusToggle(student.id, student["Payment Status"], student.Name)}
              />

              {/* Compact Action Buttons */}
              <Box display="flex" gap={0.5} mt={0.5}>
                <IconButton
                  size="small"
                  onClick={() => navigate("/add-student", { state: { studentData: student, studentDataEdit: true } })}
                  sx={{ bgcolor: "#f7fafc", border: "1px solid #edf2f7", p: 0.5 }}
                >
                  <FaEdit size={12} color="#4a5568" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteClick(student)}
                  sx={{ bgcolor: "#fff5f5", border: "1px solid #fed7d7", p: 0.5 }}
                >
                  <FaTrash size={12} color="#e53e3e" />
                </IconButton>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 2, borderColor: "#f0f0f0" }} />

          {/* --- MIDDLE ROW: Key Stats (Fees & Classes) --- */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ bgcolor: "#f8f9fa", p: 1.5, borderRadius: "12px", textAlign: "center" }}>
                <Typography variant="caption" sx={{ color: "#a0aec0", fontWeight: 600, textTransform: "uppercase", fontSize: "0.65rem" }}>
                  Monthly Fee
                </Typography>
                <Typography variant="h6" sx={{ color: "#2d3748", fontWeight: 800 }}>
                  ₹{(typeof student["Monthly Fee"] === "number" ? student["Monthly Fee"] : parseFloat(student["Monthly Fee"]) || 0).toLocaleString()}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ bgcolor: "#f8f9fa", p: 1.5, borderRadius: "12px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="caption" sx={{ color: "#a0aec0", fontWeight: 600, textTransform: "uppercase", fontSize: "0.65rem", mb: 0.5 }}>
                  Classes
                </Typography>

                {!isRevisionProgramJEEMains2026Student ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleClassChange(student.id, false)}
                      disabled={updatingClasses === student.id}
                      sx={{ p: 0.5, bgcolor: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}
                    >
                      <FaMinusCircle color="#e53e3e" size={14} />
                    </IconButton>

                    {updatingClasses === student.id ? (
                      <CircularProgress size={16} />
                    ) : (
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#2d3748" }}>
                        {student.classesCompleted || 0}
                      </Typography>
                    )}

                    <IconButton
                      size="small"
                      onClick={() => handleClassChange(student.id, true)}
                      disabled={updatingClasses === student.id}
                      sx={{ p: 0.5, bgcolor: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}
                    >
                      <FaPlusCircle color="#38a169" size={14} />
                    </IconButton>
                  </Box>
                ) : (
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{student.revisionClassesCompleted || 0}</Typography>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* --- EXPAND TOGGLE --- */}
          <Button
            fullWidth
            onClick={() => setExpanded(!expanded)}
            endIcon={expanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            sx={{
              mt: 2,
              textTransform: "none",
              color: "#718096",
              fontSize: "0.85rem",
              bgcolor: "rgba(0,0,0,0.02)",
              borderRadius: "8px",
              py: 0.8
            }}
          >
            {expanded ? "Show Less" : "View Full Details"}
          </Button>

          {/* --- EXPANDED DETAILS --- */}
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 2, pt: 1 }}>

              {/* Section: Academic */}
              <Typography variant="caption" sx={{ color: "#cbd5e0", fontWeight: "bold", mb: 1, display: "block" }}>ACADEMIC INFO</Typography>
              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <FaGraduationCap color="#718096" size={12} />
                    <Typography variant="body2" color="text.secondary">Year: {student.Year || "N/A"}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <FaUniversity color="#718096" size={12} />
                    <Typography variant="body2" color="text.secondary">Clg: {student.College || "N/A"}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <FaLayerGroup color="#718096" size={12} />
                    <Typography variant="body2" color="text.secondary">Grp: {student["Group "] || "N/A"}</Typography>
                  </Box>
                </Grid>
                {/* <Grid item xs={6}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <FaVenusMars color="#718096" size={12}/>
                                <Typography variant="body2" color="text.secondary">{student.Gender || "N/A"}</Typography>
                            </Box>
                        </Grid> */}
              </Grid>

              {/* Section: Dates */}
              <Box sx={{ bgcolor: "#edf2f7", p: 1.5, borderRadius: "8px", mb: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" color="text.secondary">Start Date</Typography>
                  <Typography variant="caption" fontWeight="bold">{formatFirestoreDate(student.startDate)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">Next Class</Typography>
                  <Typography variant="caption" fontWeight="bold" color={student.nextClass ? "primary.main" : "inherit"}>
                    {student.nextClass ? format(student.nextClass, "MMM dd, hh:mm a") : "-"}
                  </Typography>
                </Box>
              </Box>

              {/* Section: Actions & Contact */}
              <Typography variant="caption" sx={{ color: "#cbd5e0", fontWeight: "bold", mb: 1, display: "block" }}>QUICK ACTIONS</Typography>

              <Box display="flex" gap={1} mb={2}>
                {student.ContactNumber && (
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    startIcon={<FaPhone />}
                    href={`tel:${student.ContactNumber}`}
                    sx={{ borderRadius: "8px", borderColor: "#cbd5e0", color: "#4a5568" }}
                  >
                    Call
                  </Button>
                )}
                {student.ContactNumber && (
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    startIcon={<FaWhatsapp />}
                    href={`https://wa.me/91${student.ContactNumber}`}
                    target="_blank"
                    sx={{ borderRadius: "8px", borderColor: "#48bb78", color: "#48bb78" }}
                  >
                    WhatsApp
                  </Button>
                )}
              </Box>

              {/* Activation Toggle */}
              <Box
                onClick={() => handleToggleStatusClick(student.id, student.isActive, student.Name)}
                sx={{
                  display: "flex", alignItems: "center", justifyItems: "center", cursor: "pointer",
                  p: 1.5, borderRadius: "8px", justifyContent: "center",
                  bgcolor: student.isActive ? "#f0fff4" : "#fff5f5",
                  border: `1px dashed ${student.isActive ? "#48bb78" : "#f56565"}`
                }}
              >
                {student.isActive ? <FaUserCheck color="#48bb78" /> : <FaUserTimes color="#f56565" />}
                <Typography variant="body2" sx={{ ml: 1, fontWeight: "bold", color: student.isActive ? "#2f855a" : "#c53030" }}>
                  {student.isActive ? "Account is Active" : "Account is Inactive"}
                </Typography>
              </Box>

            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </Grow>
  );
};


const StudentsTable = ({ isRevisionProgramJEEMains2026Student = false }) => {
  // 📱 Detect Mobile Screen
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // True if screen < 600px

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
    startDate: true,
    endDate: true,
    nextClass: false,
    paymentStatus: true,
    status: false,
    actions: true,
  });
  // Add this state at the top of your component
  const [expandedSections, setExpandedSections] = useState({
    header: true,
    filters: true,
    columns: false,
    table: true,
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };
  // Toggle function
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  const [animate, setAnimate] = useState(false);
  const handleColumnToggle = (columnName) => (event) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [columnName]: event.target.checked,
    }));
  };
  const [isTableOpen, setIsTableOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sortEnabled, setSortEnabled] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
    needsRefresh
  } = useSelector((state) => state.students);
  const {
    timetables,
    classUpdates,
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
  const initialFilters = {
    // <-- Define initial filters state
    studentName: "",
    subject: "",
    paymentStatus: "",
    gender: "",
    stream: "",
  };
  const [filters, setFilters] = useState(initialFilters);
  const [tempFilters, setTempFilters] = useState(initialFilters); // <-- New: Temporary filter state for the drawer

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
  const [displayedStudents, setDisplayedStudents] = useState(filteredStudents);
  useEffect(() => {
    if (user.role === "typist") {
      dispatch(fetchStudents());
    }
  }, [dispatch, user.role]);
  useEffect(() => {
    if (sortEnabled) {
      setDisplayedStudents(filteredStudents);
    }
  }, [filteredStudents, sortEnabled]);

  const open = Boolean(anchorEl);
  const handleApplyFilters = () => {
    // This is where you would trigger your main data fetching/filtering logic
    setFilters(tempFilters); // Apply the temporary filters to the main state
    setIsDrawerOpen(false); // Close the drawer
    // You would typically call a function here to fetch/update the student list
  };

  const handleClearFilters = () => {
    setTempFilters(initialFilters); // Clear temporary state
    setFilters(initialFilters); // Clear applied state
    setIsDrawerOpen(false);
  };
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
    dispatch(fetchStudentsIfNeeded());

    dispatch(
      fetchUpcomingClasses({ date: new Date().toLocaleDateString("en-GB") })
    );
    dispatch(fetchAutoTimetablesForToday());
  }, [dispatch, needsRefresh]);

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
    if (!students.length) {
      return;
    }
    const combinedTimetables = [...timetables, ...autoTimetables];

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
    let studentsToSort = [...filteredStudents].filter((student) => {
      if (isRevisionProgramJEEMains2026Student) {
        return student.isRevisionProgramJEEMains2026Student === true;
      } else {
        return student;
      }
    });

    // Apply sorting based on orderBy and order
    if (orderBy && sortEnabled) {
      studentsToSort.sort((a, b) => {
        let aValue, bValue;

        // Get the values to compare based on the column ID
        switch (orderBy) {
          case 'name': // Changed from 'Name' to match column ID
            aValue = a.Name?.toLowerCase() || '';
            bValue = b.Name?.toLowerCase() || '';
            break;
          case 'classesCompleted':
            aValue = a.isRevisionProgramJEEMains2026Student
              ? a.revisionClassesCompleted || 0
              : a.classesCompleted || 0;
            bValue = b.isRevisionProgramJEEMains2026Student
              ? b.revisionClassesCompleted || 0
              : b.classesCompleted || 0;
            break;
          case 'monthlyFee': // Changed from 'Monthly Fee' to match column ID
            aValue = typeof a["Monthly Fee"] === "number"
              ? a["Monthly Fee"]
              : parseFloat(a["Monthly Fee"]) || 0;
            bValue = typeof b["Monthly Fee"] === "number"
              ? b["Monthly Fee"]
              : parseFloat(b["Monthly Fee"]) || 0;
            break;
          case 'paymentStatus': // Changed from 'Payment Status' to match column ID
            aValue = a["Payment Status"] || '';
            bValue = b["Payment Status"] || '';
            break;
          case 'gender': // Changed from 'Gender' to match column ID
            aValue = a.Gender || '';
            bValue = b.Gender || '';
            break;
          case 'stream': // Changed from 'Stream' to match column ID
            aValue = a.Stream || '';
            bValue = b.Stream || '';
            break;
          case 'startDate':
            aValue = a.startDate ? new Date(a.startDate._seconds * 1000) : new Date(0);
            bValue = b.startDate ? new Date(b.startDate._seconds * 1000) : new Date(0);
            break;
          case 'endDate':
            aValue = a.endDate ? new Date(a.endDate._seconds * 1000) : new Date(0);
            bValue = b.endDate ? new Date(b.endDate._seconds * 1000) : new Date(0);
            break;
          default:
            return 0;
        }

        // Handle different value types for comparison
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          if (order === 'asc') {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        } else {
          // For numbers and dates
          if (order === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
        }
      });
    } else {
      // Default sorting when no specific column is selected
      return studentsToSort.sort((a, b) => {
        // 1. Primary: Sort by payment status AND paid date
        const aIsPaid = a["Payment Status"] === "Paid" && a.paidDate;
        const bIsPaid = b["Payment Status"] === "Paid" && b.paidDate;

        // If both are properly paid (status = Paid AND have paidDate), sort by most recent payment date first
        if (aIsPaid && bIsPaid) {
          const aPaidDate = new Date(a.paidDate._seconds * 1000);
          const bPaidDate = new Date(b.paidDate._seconds * 1000);

          if (aPaidDate.getTime() !== bPaidDate.getTime()) {
            return bPaidDate.getTime() - aPaidDate.getTime(); // Most recent first
          }
        }

        // If one is properly paid and other is not, paid comes first
        if (aIsPaid && !bIsPaid) return -1;
        if (!aIsPaid && bIsPaid) return 1;

        // Handle edge cases:
        const aHasPaymentRecord = a.paidDate;
        const bHasPaymentRecord = b.paidDate;

        // If both have payment records but are currently unpaid, sort by payment date
        if (aHasPaymentRecord && bHasPaymentRecord && !aIsPaid && !bIsPaid) {
          const aPaidDate = new Date(a.paidDate._seconds * 1000);
          const bPaidDate = new Date(b.paidDate._seconds * 1000);
          return bPaidDate.getTime() - aPaidDate.getTime();
        }

        // If one has payment record and other doesn't, the one with record comes first
        if (aHasPaymentRecord && !bHasPaymentRecord) return -1;
        if (!aHasPaymentRecord && bHasPaymentRecord) return 1;

        // 2. Secondary: For students with same payment status, sort by classes completed
        const aClasses = a.isRevisionProgramJEEMains2026Student
          ? a.revisionClassesCompleted || 0
          : a.classesCompleted || 0;
        const bClasses = b.isRevisionProgramJEEMains2026Student
          ? b.revisionClassesCompleted || 0
          : b.classesCompleted || 0;

        return bClasses - aClasses;
      });
    }

    return studentsToSort;
  }, [filteredStudents, isRevisionProgramJEEMains2026Student, orderBy, order, sortEnabled]);

  // Handles changes in filter input fields
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prevFilters) => ({
      // <-- Change setFilters to setTempFilters
      ...prevFilters,
      [name]: value,
    })); // IMPORTANT: Don't trigger the main data filter useEffect here, wait for Apply Filters button!
  };

  // Handles closing the Snackbar notification
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // In StudentsTable component - FIX THIS FUNCTION
  const handlePaymentStatusToggle = async (
    studentId,
    currentStatus,
    studentName
  ) => {
    setUpdatingStudent(studentId);
    try {
      const newStatus = currentStatus === "Paid" ? "Unpaid" : "Paid";
      // Correct call to updateStudentField
      await dispatch(updateStudentField(studentId, "Payment Status", newStatus));

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
    if (updatingClasses) return;

    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const currentClasses = student.classesCompleted || 0;
    const delta = increment ? 1 : -1;

    if (!increment && currentClasses === 0) {
      setSnackbarMessage("Cannot decrease classes below zero.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    setUpdatingClasses(studentId);

    try {
      const updatedStudent = await dispatch(
        updateClassesCompleted(studentId, delta, user.name)
      );

      // Force refresh of students data
      dispatch(fetchStudentsIfNeeded());

      // Check if the classes actually changed
      if (updatedStudent.classesCompleted !== currentClasses) {
        setSnackbarMessage(
          `Classes completed updated to ${updatedStudent.classesCompleted} for ${updatedStudent.Name}!`
        );
        setSnackbarSeverity("success");
      } else {
        // Classes didn't change - this happens when automatic calculation prevents decrease
        const automaticClasses = calculateAutomaticClasses(student);
        setSnackbarMessage(
          `Classes remain at ${currentClasses}. Automatic schedule shows ${automaticClasses} classes should be completed.`
        );
        setSnackbarSeverity("info");
      }
      setSnackbarOpen(true);

    } catch (err) {
      setSnackbarMessage(`Failed to update classes: ${err.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setUpdatingClasses(null);
    }
  };

  // Add this helper function to calculate automatic classes on frontend
  const calculateAutomaticClasses = (student) => {
    if (!student.paidDate || !student.classDateandTime || student.classDateandTime.length === 0) {
      return student.classesCompleted || 0;
    }

    const paidDate = student.paidDate._seconds ?
      new Date(student.paidDate._seconds * 1000) :
      new Date(student.paidDate);

    const currentDate = new Date();

    // Parse class schedule
    const dayMap = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };

    const classSchedule = student.classDateandTime.map(dayTime => {
      const [day, time] = dayTime.split('-');
      const isPM = time.includes('pm');
      let [hours, minutes] = time.replace('pm', '').replace('am', '').split(':').map(Number);

      // Convert to 24-hour format
      if (isPM && hours !== 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;

      return {
        day: dayMap[day],
        hours: hours,
        minutes: minutes
      };
    });

    let classCount = 0;
    let tempDate = new Date(paidDate);

    // Count classes from paid date to current date
    while (tempDate <= currentDate) {
      const dayOfWeek = tempDate.getDay();

      // Check if this day has a class that has already occurred
      classSchedule.forEach(schedule => {
        if (schedule.day === dayOfWeek) {
          // Create class datetime for comparison
          const classDateTime = new Date(tempDate);
          classDateTime.setHours(schedule.hours, schedule.minutes, 0, 0);

          // If class time has passed by current time, count it
          if (classDateTime <= currentDate) {
            classCount++;
          }
        }
      });

      // Move to next day
      tempDate.setDate(tempDate.getDate() + 1);
    }

    return classCount;
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

  const pdfHeaders = getPdfTableHeaders(columnVisibility);
  const pdfRows = getPdfTableRows(sortedFilteredStudents, columnVisibility);

  // 🚀 UPDATED: Display Skeleton while loading
  if (isLoading) {
    return (
      <Box
        sx={{
          p: 3,
          backgroundColor: "#f7f8fc",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 2, textAlign: "center" }}
        >
          <CircularProgress color="primary" size={20} sx={{ mr: 1 }} />
          Loading student data...
        </Typography>
        <TableSkeleton rows={10} columnVisibility={columnVisibility} />
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
  const handleViewClasses = (student) => {
    // You may need to refetch the student data here if it's stale
    // or just use the current student object
    setSelectedStudent(student);
    setIsTableOpen(true);
  };

  const handleCloseTable = () => {
    setIsTableOpen(false);
    setSelectedStudent(null);
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f8fc",
        p: isMobile ? 1 : 3, // 👈 Responsive Padding
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <FeatureAnnouncement user={user.role} Allowforotherthenfaculty={true} />
      {!isRevisionProgramJEEMains2026Student && (
        <Box
          sx={{
            backgroundColor: "#f7f8fc",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Simplified Header Section */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
              backgroundColor: "white", // Use a clean background
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)", // Subtle shadow for depth
            }}
          >
            {/* Title and Icon */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FaUsers
                style={{
                  marginRight: "15px",
                  fontSize: isMobile ? "2rem" : "2.5rem", // 👈 Responsive Icon Size
                  color: "#1976d2",
                }}
              />
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ color: "#292551", fontWeight: 700, mb: 0.5, fontSize: isMobile ? "1.5rem" : "2.125rem" }} // 👈 Responsive Font Size
                >
                  Students Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage and filter your student records.
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons Group */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", width: isMobile ? "100%" : "auto", flexDirection: isMobile ? "column" : "row" }}> {/* 👈 Responsive Flex Direction */}
              {sortedFilteredStudents.length > 0 && !isMobile && ( // Hide PDF download on mobile to save space, or keep it if needed
                <PdfDownloadButton
                  title={getPdfTitle()}
                  headers={pdfHeaders}
                  rows={pdfRows}
                  buttonLabel="Download Data (PDF)"
                  filename="Student_Data.pdf"
                  reportDate={new Date()}
                />
              )}
              {/* Filters Button (Opens Drawer) */}
              <MuiButton
                variant="outlined"
                startIcon={<FaFilter />}
                onClick={toggleDrawer(true)}
                sx={{
                  borderRadius: "8px",
                  px: 3,
                  py: 1.2,
                  minWidth: "120px",
                  width: isMobile ? "100%" : "auto", // 👈 Full width on mobile
                  color: "#1976d2",
                  borderColor: "#1976d2",
                  "&:hover": {
                    borderColor: "#1565c0",
                    bgcolor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              >
                Options & Filters
              </MuiButton>
              {/* Add New Student Button */}
              <MuiButton
                variant="contained"
                startIcon={<FaPlus />}
                onClick={() => navigate("/add-student")}
                sx={{
                  bgcolor: "#1976d2",
                  "&:hover": { bgcolor: "#1565c0" },
                  borderRadius: "8px",
                  px: 3,
                  py: 1.2,
                  minWidth: "180px",
                  width: isMobile ? "100%" : "auto", // 👈 Full width on mobile
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                Add New Student
              </MuiButton>
            </Box>
          </Box>

          {/* Filters and Columns Control Drawer */}
          <Drawer
            anchor="right"
            open={isDrawerOpen}
            onClose={toggleDrawer(false)}
            PaperProps={{
              sx: {
                width: { xs: 300, sm: 360, md: 400 },
                p: 2,
                backgroundColor: "#f7f8fc",
              },
            }}
          >
            {/* Drawer Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                pb: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "#292551",
                  fontWeight: 700,
                }}
              >
                <FaFilter
                  style={{
                    marginRight: "10px",
                    fontSize: "1.8rem",
                    color: "#1976d2",
                  }}
                />
                Options & Filters {/* Updated Header */}
              </Typography>
              <IconButton onClick={toggleDrawer(false)}>
                <CloseIcon size={16} />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 1 }} />

            {/* --- DATA FILTERS SECTION --- */}
            <Typography
              variant="h6"
              sx={{
                color: "#292551",
                fontWeight: 600,
                mb: 1,
                ml: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaSearch
                style={{
                  marginRight: "8px",
                  fontSize: "1.2rem",
                  color: "#1976d2",
                }}
              />
              Data Filters
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                p: 1,
              }}
            >
              <MuiInput
                label="Student Name"
                name="studentName"
                value={tempFilters.studentName}
                onChange={handleFilterChange}
                placeholder="Search by student name..."
                icon={FaUserCircle}
              />
              <MuiSelect
                label="Payment Status"
                name="paymentStatus"
                value={tempFilters.paymentStatus}
                onChange={handleFilterChange}
                options={paymentStatusOptions}
                icon={FaIdCard}
              />
              <MuiSelect
                label="Gender"
                name="gender"
                value={tempFilters.gender}
                onChange={handleFilterChange}
                options={genderOptions}
                icon={FaUsers}
              />
              <MuiSelect
                label="Stream"
                name="stream"
                value={tempFilters.stream}
                onChange={handleFilterChange}
                options={streamOptions}
                icon={FaGraduationCap}
              />
            </Box>

            {/* --- COLUMN VISIBILITY SECTION (Updated for Professional Look) --- */}
            <Divider sx={{ my: 3 }} />
            <Typography
              variant="h6"
              sx={{
                color: "#292551",
                fontWeight: 600,
                mb: 1,
                ml: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaColumns
                style={{
                  marginRight: "8px",
                  fontSize: "1.2rem",
                  color: "#1976d2",
                }}
              />
              Show/Hide Columns
            </Typography>
            <Box
              sx={{
                p: 1,
                overflowY: "auto",
                display: "grid",
                gridTemplateColumns: "1fr 1fr", // 2-column grid
                gap: 1,
              }}
            >
              {Object.entries(columnVisibility).map(([key, isVisible]) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={isVisible}
                      onChange={handleColumnToggle(key)}
                      name={key}
                      sx={{ p: 0.5 }} // Smaller padding for checkbox
                    />
                  }
                  label={
                    key === "sNo"
                      ? "S.No."
                      : key === "contactNumber"
                        ? "Contact No."
                        : key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())
                  }
                  sx={{
                    m: 0, // Remove outer margin
                    // Inline professional styles for the label and control
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.85rem",
                      color: "#4a4a4a",
                    },
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    backgroundColor: "white",
                    p: 0.5,
                    minWidth: "100%",
                  }}
                />
              ))}
            </Box>

            {/* --- ACTION BUTTONS (Footer of the Drawer) --- */}
            <Box
              sx={{
                p: 1,
                borderTop: "1px solid #eee",
                pt: 2,
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
                marginTop: "auto",
              }}
            >
              <MuiButton
                variant="outlined"
                onClick={handleClearFilters}
                sx={{ flexGrow: 1 }}
              >
                Clear All
              </MuiButton>
              <MuiButton
                variant="contained"
                onClick={handleApplyFilters}
                startIcon={<FaSearch />}
                sx={{
                  flexGrow: 1,
                  bgcolor: "#1976d2",
                  "&:hover": { bgcolor: "#1565c0" },
                }}
              >
                Apply Changes
              </MuiButton>
            </Box>
          </Drawer>
        </Box>
      )}

      {/* 📱 CONDITIONAL RENDERING: Mobile Cards vs Desktop Table */}
      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={700}>
        <Box>
          {sortedFilteredStudents.length > 0 ? (
            isMobile ? (
              // 📱 Mobile View: Render Cards
              <Box sx={{ pb: 8 }}> {/* Padding bottom for fab/scroll */}
                {sortedFilteredStudents.map((student) => (
                  <MobileStudentCard
                    key={student.id}
                    student={student}
                    columnVisibility={columnVisibility}
                    handleClassChange={handleClassChange}
                    updatingClasses={updatingClasses}
                    updatingStudent={updatingStudent}
                    handlePaymentStatusToggle={handlePaymentStatusToggle}
                    navigate={navigate}
                    handleToggleStatusClick={handleToggleStatusClick}
                    handleDeleteClick={handleDeleteClick}
                    isRevisionProgramJEEMains2026Student={isRevisionProgramJEEMains2026Student}
                  />
                ))}
              </Box>
            ) : (
              // 🖥️ Desktop View: Render Table
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
                            to={`/student/${student.id}/profile`}
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
                        {columnVisibility.classesCompleted &&
                          !student.isRevisionProgramJEEMains2026Student ? (
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
                                  updatingClasses === student.id ? "none" : "auto",
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
                                        lastUpdatedTimestamps[student.id]._seconds *
                                        1000
                                      ),
                                      "MMM dd, hh:mm a"
                                    )}
                                  </Typography>
                                </Fade>
                              )}
                            </Box>
                          </TableCell>
                        ) : (
                          <TableCell
                            align="center"
                            sx={{
                              fontSize: "0.9rem",
                              whiteSpace: "nowrap",
                              fontWeight: "medium",
                            }}
                          >
                            {student.revisionClassesCompleted}
                          </TableCell>
                        )}
                        {" "}
                        {columnVisibility.startDate && (
                          <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                            {" "}
                            {formatFirestoreDate(student.startDate)}
                            {" "}
                          </TableCell>
                        )}
                        {" "}
                        {columnVisibility.endDate && (
                          <TableCell align="center" sx={{ fontSize: "0.9rem" }}>
                            {" "}
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              {" "}
                              {/* Display the original endDate from the backend */}
                              {" "}
                              <Typography variant="body2" fontWeight="bold">
                                {" "}
                                {formatFirestoreDate(student.endDate)}
                                {" "}
                              </Typography>
                              {" "}
                            </Box>
                            {" "}
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
                              p: 1,
                            }}
                          >
                            {updatingStudent === student.id ? (
                              <CircularProgress size={20} color="primary" />
                            ) : (
                              <>
                                <Chip
                                  label={student["Payment Status"]}
                                  icon={
                                    student["Payment Status"] === "Unpaid" ? (
                                      <FaExclamationCircle
                                        style={{ fontSize: 16 }}
                                      />
                                    ) : (
                                      <FaCheckCircle style={{ fontSize: 16 }} />
                                    )
                                  }
                                  color={
                                    student["Payment Status"] === "Unpaid"
                                      ? "error"
                                      : "success"
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
                                {student["Payment Status"] === "Unpaid" &&
                                  !student.isRevisionProgramJEEMains2026Student &&
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

                                {/* ✅ New Button to View Classes */}
                                {/* {student.startDate && (
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<FaEye />}
                                onClick={() => handleViewClasses(student)}
                                sx={{ mt: 1 }}
                              >
                                View Classes
                              </Button>
                            )} */}
                              </>
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
                                border: `1px solid ${student.isActive ? "#4CAF50" : "#F44336"
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
            )
          ) : (
            <Typography
              variant="body1"
              sx={{ textAlign: "center", p: 3, color: "text.secondary" }}
            >
              No students match your criteria.
            </Typography>
          )}
        </Box>
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
      <Dialog
        open={isTableOpen}
        onClose={handleCloseTable}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Class Details
          <IconButton
            aria-label="close"
            onClick={handleCloseTable}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedStudent && (
            <ClassesCompletedTable
              student={selectedStudent}
              allTimetables={timetables}
              allAutoTimetables={autoTimetables}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default StudentsTable;
