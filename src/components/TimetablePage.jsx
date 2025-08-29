import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { topicOptions } from "../mockdata/Options";
import {
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBook,
  FaClock,
  FaFilter,
  FaPlusCircle,
  FaSearch,
  FaInfoCircle,
  FaHourglassHalf,
  FaExclamationCircle,
} from "react-icons/fa";
import { MdCurrencyRupee, MdEdit, MdDelete } from "react-icons/md";
import useDidMountEffect from "../components/customcomponents/useDidMountEffect";
import { getTodayDateForFilename } from "../mockdata/function";
import {
  format,
  parse,
  isValid,
  startOfDay,
  endOfDay,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval,
  differenceInMinutes,
  addWeeks,
  getDay,
  isSameDay,
  addHours,
  isAfter, // New: More explicit time comparison
  addMinutes,
  constructNow, // To calculate end time for "running" check
  parseISO,
} from "date-fns";
import { generateTimetables } from "../mockdata/function";
import { getTimetableRowStatus } from "../mockdata/function";
import {
  Typography,
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Alert,
  Slide,
  Fade,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Button,
  TableFooter,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import MuiAlert from "@mui/material/Alert";

import {
  MuiInput,
  MuiSelect,
  MuiButton,
  MuiDatePicker,
} from "../components/customcomponents/MuiCustomFormFields";

import "./TimetablePage.css";
import {
  fetchUpcomingClasses,
  fetchStudents,
  deleteTimetable,
  fetchAutoTimetablesForToday,
  updateAutoTimetableEntry,
  deleteAutoTimetable,
  saveOrFetchAutoTimetables,
} from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import PdfDownloadButton from "./customcomponents/PdfDownloadButton";
import { getDateFromTimetableItem } from "../mockdata/function";
import ExcelDownloadButton from "./customcomponents/ExcelDownloadButton";
const TimetablePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    timetables: manualTimetables, // Renamed from 'timetables' for clarity with autoTimetables
    loading: classesLoading,
    error: classesError,
  } = useSelector((state) => state.classes);
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useSelector((state) => state.students);
  const {
    timetables: autoTimetables, // NEW: This will hold auto-generated timetables
    loading: autoTimetablesLoading,
    error: autoTimetablesError,
    hasSavedToday: autoTimetablesHasSavedToday, // NEW: Track if auto-timetables were saved for today
  } = useSelector((state) => state.autoTimetables); // This is your NEW autoTimetables reducer
  const { user } = useSelector((state) => state.auth);
  const [generatedTimetables, setGeneratedTimetables] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDurationType, setFilterDurationType] = useState("Daily");
  const [filterDate, setFilterDate] = useState(new Date());

  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [timetableToDelete, setTimetableToDelete] = useState(null);

  const [isGeneratingAuto, setIsGeneratingAuto] = useState(false);
  const [autoGenerateErrorMsg, setAutoGenerateErrorMsg] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isDeleting, setIsDeleting] = useState(false); // For delete loading state

  const { currentUserFaculty, currentUserSubject, canAccessAll } =
    useMemo(() => {
      let faculty = "";
      let subject = "";
      let allAccess = false;
      if (user) {
        if (user.isPhysics) {
          faculty = "Dulam";
          subject = "Physics";
        } else if (user.isChemistry) {
          faculty = "Bollam";
          subject = "Chemistry";
        } else if (user.AllowAll) {
          allAccess = true;
        }
      }
      return {
        currentUserFaculty: faculty,
        currentUserSubject: subject,
        canAccessAll: allAccess,
      };
    }, [user]);

  const availableTopicOptions = useMemo(() => {
    return [...topicOptions].sort((a, b) => a.topic.localeCompare(b.topic));
  }, []);

  useEffect(() => {
    dispatch(fetchUpcomingClasses());
    dispatch(fetchStudents());
    if (user && user.id) {
      dispatch(fetchAutoTimetablesForToday());
    } else {
      console.warn(
        "Effect 1: User or user.id is not available yet for fetching auto timetables. Will retry if user becomes available."
      );
    }
  }, [dispatch, user]);

  const calculateDuration = useCallback((timeString) => {
    try {
      const [startTimeStr, endTimeStr] = timeString.split(" to ");
      if (!startTimeStr || !endTimeStr) return "N/A";

      const now = new Date();
      const startTime = parse(startTimeStr.trim(), "hh:mm a", now);
      let endTime = parse(endTimeStr.trim(), "hh:mm a", now);

      if (!isValid(startTime) || !isValid(endTime)) {
        return "N/A";
      }

      if (endTime.getTime() < startTime.getTime()) {
        endTime = addDays(endTime, 1);
      }

      const minutes = differenceInMinutes(endTime, startTime);
      if (isNaN(minutes)) return "N/A";

      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;

      if (hours === 0 && remainingMinutes === 0) {
        return "0 min";
      } else if (hours === 0) {
        return `${remainingMinutes} min`;
      } else if (remainingMinutes === 0) {
        return `${hours} hr`;
      } else {
        return `${hours} hr ${remainingMinutes} min`;
      }
    } catch (e) {
      return "N/A";
    }
  }, []);

  const combinedAndFilteredTimetables = useMemo(() => {
    // Combine manual and auto-generated timetables
    let combinedTimetables = [...manualTimetables, ...autoTimetables];

    let permissionFilteredTimetables = [];

    if (user && combinedTimetables && combinedTimetables.length > 0) {
      if (canAccessAll) {
        permissionFilteredTimetables = combinedTimetables;
      } else if (currentUserSubject) {
        permissionFilteredTimetables = combinedTimetables.filter(
          (schedule) => schedule.Subject?.trim() === currentUserSubject
        );
      } else {
        permissionFilteredTimetables = [];
      }
    } else if (!user) {
      permissionFilteredTimetables = [];
    }

    let currentTimetables = [...permissionFilteredTimetables];
    const now = new Date();

    let startDate = null;
    let endDate = null;

    switch (filterDurationType) {
      case "Daily":
        startDate = startOfDay(filterDate);
        endDate = endOfDay(filterDate);
        break;
      case "2days":
        startDate = startOfDay(now);
        endDate = endOfDay(addDays(now, 1));
        break;
      case "3days":
        startDate = startOfDay(now);
        endDate = endOfDay(addDays(now, 2));
        break;
      case "4days":
        startDate = startOfDay(now);
        endDate = endOfDay(addDays(now, 3));
        break;
      case "5days":
        startDate = startOfDay(now);
        endDate = endOfDay(addDays(now, 4));
        break;
      case "Week":
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case "Month":
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case "Year":
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      default:
        break;
    }

    if (startDate && endDate) {
      currentTimetables = currentTimetables.filter((item) => {
        // Use classDateTime (Firestore Timestamp) or parse Day string
        let itemDate;
        if (item.classDateTime && item.classDateTime.toDate) {
          itemDate = item.classDateTime.toDate();
        } else {
          itemDate = parse(item.Day, "dd/MM/yyyy", new Date());
        }

        return (
          isValid(itemDate) &&
          isWithinInterval(itemDate, { start: startDate, end: endDate })
        );
      });
    }

    if (searchTerm) {
      currentTimetables = currentTimetables.filter(
        (item) =>
          item.Faculty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Student?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Time?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Map to store student data by name and subject for quick lookup
    const studentSubjectDataMap = new Map();
    if (students && students.length > 0) {
      students.forEach((student) => {
        if (student.Name && student.Subject) {
          const key = `${student.Name.toLowerCase()}_${student.Subject.toLowerCase()}`;
          studentSubjectDataMap.set(key, student);
        }
      });
    }

    currentTimetables = currentTimetables.map((item) => {
      const studentNameLower = item.Student?.toLowerCase();
      const subjectLower = item.Subject?.toLowerCase();
      const lookupKey = `${studentNameLower}_${subjectLower}`;

      const matchedStudent = studentSubjectDataMap.get(lookupKey);
      let monthlyFeePerClass = "N/A";
      let studentId = null; // Initialize studentId

      if (matchedStudent) {
        studentId = matchedStudent.id; // Assign student ID
        let feeToUse = 0;
        if (
          typeof matchedStudent.monthlyFee === "number" &&
          matchedStudent.monthlyFee > 0
        ) {
          feeToUse = matchedStudent.monthlyFee;
        } else if (
          typeof matchedStudent["Monthly Fee"] === "string" &&
          parseFloat(matchedStudent["Monthly Fee"]) > 0
        ) {
          feeToUse = parseFloat(matchedStudent["Monthly Fee"]);
        }

        if (feeToUse > 0) {
          monthlyFeePerClass = (feeToUse / 12).toFixed(2);
        }
      }

      return {
        ...item,
        monthlyFeePerClass: monthlyFeePerClass,
        studentId: studentId, // Add the studentId key here
      };
    });

    currentTimetables.sort((a, b) => {
      const dateA = getDateFromTimetableItem(a);
      const dateB = getDateFromTimetableItem(b);

      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }

      const timeA = parse(a.Time?.split(" to ")[0], "hh:mm a", new Date());
      const timeB = parse(b.Time?.split(" to ")[0], "hh:mm a", new Date());
      return timeA.getTime() - timeB.getTime();
    });

    return currentTimetables;
  }, [
    manualTimetables,
    autoTimetables,
    searchTerm,
    filterDurationType,
    filterDate,
    user,
    students,
    currentUserSubject,
    canAccessAll,
    calculateDuration,
  ]);
  console.log("combinedAndFilteredTimetables", combinedAndFilteredTimetables);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterDurationChange = (e) => {
    console.log("e.target.value", e.target.value);
    setFilterDurationType(e.target.value);
    setFilterDate(new Date());
  };

  const handleAddTimetableClick = () => {
    // This will still add to the manual timetables
    navigate("/add-timetable");
  };

  const handleEditTimetable = (timetableItem) => {
    const isFromAutoTimetables = timetableItem.isAutoGenerated === true;

    navigate("/add-timetable", {
      state: {
        timetableToEdit: {
          ...timetableItem,
          isAutoGeneratedInDb: isFromAutoTimetables,
        },
      },
    });
  };

  const handleDeleteClick = (item) => {
    const isFromAutoTimetables = item.isAutoGenerated === true;
    setTimetableToDelete({
      ...item,
      isAutoGeneratedInDb: isFromAutoTimetables,
    });
    setOpenDeleteConfirm(true);
  };

  const handleTopicChange = useCallback(
    (timetableId, newTopicName, newTopicId) => {
      const timetableToUpdate = combinedAndFilteredTimetables.find(
        (item) => item.id === timetableId
      );

      if (timetableToUpdate) {
        const payload = {
          id: timetableToUpdate.id,
          Day: timetableToUpdate.Day,
          Faculty: timetableToUpdate.Faculty || user.name,
          Subject: timetableToUpdate.Subject,
          Time: timetableToUpdate.Time,
          Student: timetableToUpdate.Student,
          isAutoGenerated: timetableToUpdate.isAutoGenerated,
          Topic: newTopicName,
          topicId: newTopicId,
        };
        dispatch(updateAutoTimetableEntry(payload));
      } else {
        console.warn(`Timetable with ID ${timetableId} not found for update.`);
      }
    },
    [dispatch, combinedAndFilteredTimetables]
  );

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      if (timetableToDelete.isAutoGeneratedInDb) {
        await dispatch(deleteAutoTimetable(timetableToDelete.id)); // Use new action
        setSnackbarSeverity("success");
        setSnackbarMessage("Auto-generated timetable deleted successfully!");
      } else {
        await dispatch(deleteTimetable(timetableToDelete.id)); // Use existing action
        setSnackbarSeverity("success");
        setSnackbarMessage("Manual timetable deleted successfully!");
      }
      setOpenDeleteConfirm(false);
      setTimetableToDelete(null);
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage(
        `Failed to delete timetable: ${error.message || "Unknown error"}`
      );
      setSnackbarOpen(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  if (classesLoading || studentsLoading || isGeneratingAuto) {
    return (
      <Fade in={true} timeout={1000}>
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
          <CircularProgress sx={{ color: "#1976d2" }} />
          <Typography variant="h6" color="text.secondary">
            {isGeneratingAuto
              ? "Generating and processing timetables..."
              : "Loading timetables and student data..."}
          </Typography>
        </Box>
      </Fade>
    );
  }

  if (classesError || studentsError) {
    return (
      <Fade in={true} timeout={1000}>
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
              {classesError || studentsError}
            </Typography>
          </Alert>
          <MuiButton
            variant="contained"
            onClick={() => window.location.reload()}
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
      </Fade>
    );
  }

  const showSubjectColumn = user?.AllowAll;
  const getPdfTableHeaders = () => {
    const pdfHeaders = ["Student", "Lesson", "Date"];
    if (showSubjectColumn) {
      pdfHeaders.push("Faculty");
      pdfHeaders.push("Subject");
    }
    pdfHeaders.push("Time");
    pdfHeaders.push("Duration");
    pdfHeaders.push("Fee / Class");
    return pdfHeaders;
  };

  const getPdfTableRows = () => {
    // Only include non-auto-generated timetables for PDF, as proposed ones aren't saved yet
    return combinedAndFilteredTimetables.map((item) => {
      const row = [item.Student, item.Topic, item.Day];
      if (showSubjectColumn) {
        row.push(item.Faculty);
        row.push(item.Subject);
      }
      row.push(item.Time);
      row.push(calculateDuration(item.Time));
      row.push(
        item.monthlyFeePerClass !== "N/A"
          ? String(item.monthlyFeePerClass)
          : "N/A"
      );
      return row;
    });
  };
  const getPdfTitle = () => {
    const pdfTimetables = combinedAndFilteredTimetables.filter(
      (item) => !item.isAutoGenerated
    );
    if (pdfTimetables.length === 0) {
      return "Timetable Report";
    }

    const uniqueSubjects = [
      ...new Set(pdfTimetables.map((item) => item.Subject)),
    ];

    if (uniqueSubjects.length === 1) {
      const subject = uniqueSubjects[0];
      if (subject === "Physics") {
        return "Dulam Timetable";
      } else if (subject === "Chemistry") {
        return "Bollam Timetable";
      }
    }
    return "General Timetable Report";
  };
  const isLoading =
    classesLoading ||
    studentsLoading ||
    autoTimetablesLoading ||
    isGeneratingAuto ||
    isDeleting;
  const { sumHours, sumFee } = combinedAndFilteredTimetables.reduce(
    (acc, item) => {
      // Calculate duration safely
      const duration = parseFloat(calculateDuration(item.Time));
      if (!isNaN(duration)) {
        acc.sumHours += duration;
      }

      // Extract fee, remove '₹', and convert to number
      if (item.monthlyFeePerClass && item.monthlyFeePerClass !== "N/A") {
        const feeValue = parseFloat(item.monthlyFeePerClass.replace("₹", ""));
        if (!isNaN(feeValue)) {
          acc.sumFee += feeValue;
        }
      }
      return acc;
    },
    { sumHours: 0, sumFee: 0 } // Initial accumulator values
  );
  const missingTopicItems = combinedAndFilteredTimetables.filter(
    (item) => !item.Topic
  );
  const hasMissingTopics = missingTopicItems.length > 0;
  const tooltipMessage = hasMissingTopics
    ? `Action Required: To enable PDF download, please add a 'Topic' for the following entries: ${missingTopicItems
        .map(
          (item) =>
            item.id || `Item ${combinedAndFilteredTimetables.indexOf(item) + 1}`
        )
        .join(", ")}`
    : "Click to download your complete timetable for today in PDF format.";
  const subject = user?.isPhysics ? "Physics" : "Chemistry";
  const now = new Date();
  const current = {
    month: now.toLocaleString("default", { month: "long" }), // e.g., "July"
    year: now.getFullYear(), // e.g., 2025
  };
  const Exceltitle = `Electron Academy ${subject} class details ${current?.month} ${current?.year}`;
  // ✅ Define a function for date change
  // TimetablePage.jsx

  const handleDateChange = async (dateString) => {
    if (!dateString) {
      // Handle case where date is cleared
      setFilterDate(null);
      setGeneratedTimetables([]);
      return;
    }

    const selectedDate = parseISO(dateString);
    setFilterDate(selectedDate);

    const dateStr = format(selectedDate, "dd/MM/yyyy");
    const generated = generateTimetables({
      students,
      dateStr,
      user,
    });

    setGeneratedTimetables(generated);
    console.log("generated", generated);

    if (generated.length > 0) {
      try {
        console.log("finalGeneratedItems", generated);

        // --- CRITICAL FIX: Pass the date string and the generated data ---
        const dateStrForBackend = format(selectedDate, "yyyy-MM-dd");
        await dispatch(saveOrFetchAutoTimetables(dateStrForBackend, generated));
        // ------------------------------------------------------------------

        console.log(`Auto timetables saved via API for ${dateStr}`);
      } catch (err) {
        console.error("Error saving auto timetables:", err);
      }
    }
  };
  const handleNavigatetoStudentData = (studentId) => {
    const student = students.find((item) => item.id === studentId);
    if (student) {
      navigate(`/student/${student.studentId}`, {
        state: { studentData: student },
      });
    }
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
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading timetables...</Typography>
        </Box>
      )}
      {/* Header Card */}
      <Slide
        direction="down"
        in={true}
        mountOnEnter
        unmountOnExit
        timeout={500}
      >
        <Paper
          elevation={6}
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
            flexWrap: "wrap",
            gap: 2, // Gap between main sections (icon/text and buttons)
            borderRadius: "12px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FaCalendarAlt
              style={{
                marginRight: "15px",
                fontSize: "2.5rem",
                color: "#1976d2",
              }}
            />
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{ color: "#292551", fontWeight: 700, mb: 0.5 }}
              >
                Timetable
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View and manage your scheduled classes. Today is{" "}
                <span className="current-date">
                  {format(new Date(), "EEEE, MMMM dd,yyyy")}
                </span>
                .
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" }, // Stack on small screens, row on larger
              alignItems: { xs: "flex-start", sm: "center" }, // Align items at start/center
              flexWrap: "wrap", // Allow buttons to wrap
              gap: 2, // Gap between the buttons
              ml: { xs: 0, sm: 2 }, // Add left margin on larger screens if needed
              mt: { xs: 2, sm: 0 }, // Add top margin on small screens if wrapping
            }}
          >
            {combinedAndFilteredTimetables.length > 0 && (
              <Tooltip
                title={tooltipMessage}
                placement="top"
                slotProps={{
                  popper: {
                    sx: {
                      "& .MuiTooltip-tooltip": {
                        backgroundColor: hasMissingTopics ? "#d32f2f" : "#333",
                        color: "white",
                        fontSize: "0.9rem",
                        padding: "10px 15px",
                        borderRadius: "6px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                        maxWidth: "350px",
                        textAlign: "left",
                        lineHeight: "1.4",
                        fontWeight: hasMissingTopics ? "bold" : "normal",
                      },
                      "& .MuiTooltip-arrow": {
                        color: hasMissingTopics ? "#d32f2f" : "#333",
                      },
                    },
                  },
                }}
                arrow
              >
                <PdfDownloadButton
                  title={getPdfTitle()}
                  headers={getPdfTableHeaders()}
                  rows={getPdfTableRows()}
                  buttonLabel="Download Timetable (PDF)"
                  filename={`Timetable_Report_${getTodayDateForFilename()}.pdf`}
                  reportDate={new Date()}
                  disabled={hasMissingTopics}
                  totalHours={sumHours}
                  totalFee={sumFee}
                />
              </Tooltip>
            )}

            <ExcelDownloadButton
              data={students}
              filename="Electron_Academy_Student_Report.xlsx"
              buttonLabel="Download Weekly timtable with all sections"
              buttonProps={{ variant: "contained", color: "success" }}
              excelReportTitle={Exceltitle}
            />

            <MuiButton
              variant="contained"
              startIcon={<FaPlusCircle />}
              onClick={handleAddTimetableClick}
              sx={{
                bgcolor: "#1976d2",
                "&:hover": { bgcolor: "#1565c0" },
                borderRadius: "8px",
                px: 3,
                py: 1.2,
                minWidth: "180px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              Add Timetable
            </MuiButton>
          </Box>
        </Paper>
      </Slide>

      <Slide
        direction="right"
        in={true}
        mountOnEnter
        unmountOnExit
        timeout={600}
      >
        <Paper elevation={6} sx={{ p: 3, borderRadius: "12px" }}>
          {" "}
          {/* Increased elevation, rounded corners */}
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
                color: "#292551", // Darker text for headings
                fontWeight: 600,
              }}
            >
              <FaFilter
                style={{
                  marginRight: "10px",
                  fontSize: "1.8rem",
                  color: "#1976d2",
                }}
              />{" "}
              Filters
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {/* Search Input */}
            <Box
              sx={{
                flexGrow: 1,
                minWidth: { xs: "100%", sm: "200px" },
                maxWidth: { xs: "100%", sm: "350px" },
              }}
            >
              <MuiInput
                label="Search"
                icon={FaSearch}
                name="searchTerm"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by faculty, subject, topic, student..."
              />
            </Box>

            {/* <Box sx={{ minWidth: { xs: "100%", sm: "150px" } }}>
              <MuiSelect
                label="Show"
                name="filterDurationType"
                value={filterDurationType}
                onChange={handleFilterDurationChange}
                options={durationOptions}
                icon={FaCalendarAlt}
              />
            </Box> */}

            <Box sx={{ minWidth: { xs: "100%", sm: "150px" } }}>
              <MuiDatePicker
                label="Specific Date"
                icon={FaCalendarAlt}
                name="filterDate"
                value={format(filterDate, "yyyy-MM-dd")}
                onChange={handleDateChange}
              />
            </Box>
          </Box>
        </Paper>
      </Slide>

      {/* Timetable Table with Slide animation */}
      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={700}>
        <Paper
          elevation={6}
          sx={{ p: 2, overflowX: "auto", borderRadius: "12px" }}
        >
          {combinedAndFilteredTimetables.length > 0 ? (
            <TableContainer>
              <Table sx={{ minWidth: 800 }} aria-label="timetable">
                <TableHead></TableHead>
                <TableBody>
                  {combinedAndFilteredTimetables.map((item, index) => {
                    const now = new Date();
                    const rowStatus = getTimetableRowStatus(item, now);

                    let rowSx = {};
                    let disableActions = false;
                    let tooltipEditTitle = "Edit";
                    let tooltipDeleteTitle = "Delete";

                    switch (rowStatus) {
                      case "pastToday":
                      case "pastDay":
                        rowSx = {
                          background:
                            "linear-gradient(90deg, #ffebee, #ffcdd2)",
                          borderLeft: "6px solid #d32f2f",
                          "& > td": {
                            color: "#b71c1c",
                            fontWeight: 600,
                          },
                        };
                        disableActions = false;
                        tooltipEditTitle = "Past class";
                        tooltipDeleteTitle = item.isAutoGenerated
                          ? "Cannot delete past or auto-generated classes"
                          : "Delete past class";
                        break;

                      case "running":
                        rowSx = {
                          animation: "runningPulseBackground 2s infinite",
                          borderLeft: "6px solid #1976d2",
                          backgroundColor: "#e3f2fd",
                          "& > td": {
                            color: "#0d47a1",
                            fontWeight: 600,
                          },
                        };
                        break;

                      case "futureToday":
                        rowSx = {
                          background:
                            "linear-gradient(90deg, #e8f5e9, #a5d6a7)",
                          borderLeft: "6px solid #388e3c",
                          "& > td": {
                            color: "#1b5e20",
                            fontWeight: 600,
                          },
                        };
                        break;

                      case "future":
                      default:
                        rowSx = {
                          background:
                            "linear-gradient(to right, #e3fcef, #c8e6c9)",
                          borderLeft: "4px solid #43a047",
                          "& > td": {
                            color: "#1b5e20",
                            fontWeight: 600,
                          },
                        };
                        break;
                    }

                    if (
                      item.isAutoGenerated &&
                      ["futureToday", "future", "running"].includes(rowStatus)
                    ) {
                      tooltipDeleteTitle =
                        "Cannot delete auto-generated classes";
                    } else if (
                      item.isAutoGenerated &&
                      ["pastToday", "pastDay"].includes(rowStatus)
                    ) {
                      tooltipDeleteTitle =
                        "Cannot delete past or auto-generated classes";
                    }

                    return (
                      <TableRow
                        key={item.id || index}
                        sx={{
                          ...rowSx,
                          borderRadius: "8px",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: rowStatus.startsWith("past")
                              ? "#f0f0f0"
                              : "#e0f7fa !important",
                            transform: rowStatus.startsWith("past")
                              ? "none"
                              : "scale(1.01)",
                            boxShadow: rowStatus.startsWith("past")
                              ? "none"
                              : "0 4px 16px rgba(0,0,0,0.08)",
                          },
                          "& > td": {
                            borderBottom:
                              "1px solid rgba(0, 0, 0, 0.05) !important",
                            fontSize: "0.95rem",
                            color: rowStatus.startsWith("past")
                              ? "#9e9e9e"
                              : "#424242",
                            textAlign: "center",
                            transition: "color 0.3s ease-in-out",
                          },
                        }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell
                          onClick={() =>
                            handleNavigatetoStudentData(item.studentId)
                          }
                          sx={{
                            cursor: "pointer",
                            textDecoration: "underline", // This line is now active by default
                            color: "#1976d2", // A standard blue to signify a link
                            fontWeight: 500,
                            "&:hover": {
                              // You can add a different effect on hover, like a color change
                              color: "#0d47a1",
                              // or no change to the underline, since it's already there
                            },
                          }}
                        >
                          {item.Student}
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            {rowStatus === "running" && (
                              <Box
                                component="span"
                                sx={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: "50%",
                                  backgroundColor: "#4caf50",
                                  animation:
                                    "dotPulse 1.5s infinite ease-in-out",
                                  boxShadow: "0 0 10px rgba(76, 175, 80, 0.5)",
                                }}
                              />
                            )}
                            {item.isAutoGenerated ? (
                              <>
                                <TextField
                                  select
                                  value={item.Topic || ""}
                                  onChange={(e) => {
                                    const selectedTopicName = e.target.value;
                                    const selectedTopicObj =
                                      availableTopicOptions.find(
                                        (opt) => opt.topic === selectedTopicName
                                      );
                                    handleTopicChange(
                                      item.id,
                                      selectedTopicName,
                                      selectedTopicObj
                                        ? selectedTopicObj.id
                                        : null
                                    );
                                  }}
                                  variant="outlined"
                                  size="small"
                                  sx={{ minWidth: 150 }}
                                  label={item.Topic ? "" : "Select Lesson"}
                                  disabled={disableActions}
                                >
                                  <MenuItem value="" disabled>
                                    Select Lesson
                                  </MenuItem>
                                  {availableTopicOptions
                                    .filter(
                                      (opt) => opt.subject === item.Subject
                                    )
                                    .map((option) => (
                                      <MenuItem
                                        key={option.id}
                                        value={option.topic}
                                      >
                                        {option.topic}
                                      </MenuItem>
                                    ))}
                                </TextField>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    background:
                                      "linear-gradient(to right, #c5cae9, #9fa8da)",
                                    color: "#283593",
                                    px: 1,
                                    py: 0.4,
                                    borderRadius: "6px",
                                    fontWeight: 600,
                                    fontSize: "0.72rem",
                                    animation: "fadeInScale 0.4s ease-out",
                                    boxShadow: "0 0 6px rgba(63,81,181,0.3)",
                                  }}
                                >
                                  Auto
                                </Typography>
                              </>
                            ) : (
                              <>
                                <Typography sx={{ fontWeight: 500 }}>
                                  {item.Topic}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    background:
                                      "linear-gradient(to right, #bbdefb, #64b5f6)", // Blue

                                    color: "#6d4c41",
                                    px: 1,
                                    py: 0.4,
                                    borderRadius: "6px",
                                    fontWeight: 600,
                                    fontSize: "0.72rem",
                                    animation: "fadeInScale 0.4s ease-out",
                                    boxShadow: "0 0 6px rgba(255,213,79,0.4)",
                                    ml: 1,
                                  }}
                                >
                                  Manual
                                </Typography>
                              </>
                            )}
                          </Box>
                        </TableCell>

                        <TableCell>{item.Day}</TableCell>

                        {showSubjectColumn && (
                          <>
                            <TableCell>{item.Faculty}</TableCell>
                            <TableCell
                              sx={{
                                textDecoration: rowStatus.startsWith("past")
                                  ? "line-through"
                                  : "none",
                              }}
                            >
                              {item.Subject}
                            </TableCell>
                          </>
                        )}

                        <TableCell>{item.Time}</TableCell>

                        <TableCell>{calculateDuration(item.Time)}</TableCell>

                        <TableCell>
                          {item.monthlyFeePerClass !== "N/A"
                            ? `₹${item.monthlyFeePerClass}`
                            : "N/A"}
                        </TableCell>

                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Tooltip title={tooltipEditTitle}>
                              <span>
                                <IconButton
                                  aria-label="edit"
                                  size="small"
                                  onClick={() => handleEditTimetable(item)}
                                  sx={{
                                    color: "#1976d2",
                                    transition: "all 0.2s ease-in-out",
                                    "&:hover": {
                                      backgroundColor:
                                        "rgba(25, 118, 210, 0.1)",
                                      transform: "scale(1.1)",
                                    },
                                    "&.Mui-disabled": {
                                      color: "#bdbdbd",
                                    },
                                  }}
                                  disabled={disableActions}
                                >
                                  <MdEdit />
                                </IconButton>
                              </span>
                            </Tooltip>

                            <Tooltip title={tooltipDeleteTitle}>
                              <span>
                                <IconButton
                                  aria-label="delete"
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteClick(item)}
                                  sx={{
                                    transition: "all 0.2s ease-in-out",
                                    "&:hover": {
                                      backgroundColor: "rgba(211, 47, 47, 0.1)",
                                      transform: "scale(1.1)",
                                    },
                                    "&.Mui-disabled": {
                                      color: "#bdbdbd",
                                    },
                                  }}
                                  disabled={disableActions}
                                >
                                  <MdDelete />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow
                    sx={{
                      background: "rgba(240, 248, 255, 0.75)", // soft blue with transparency
                      backdropFilter: "blur(4px)", // glass effect
                      borderTop: "2px solid #90caf9",
                      "& > td": {
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        color: "#0d47a1",
                        padding: "14px 18px",
                        borderBottom: "none",
                        transition: "all 0.3s ease",
                      },
                      "&:hover > td": {
                        backgroundColor: "rgba(227, 242, 253, 0.4)", // subtle hover glow
                      },
                    }}
                  >
                    {/* Total Label Cell */}
                    <TableCell
                      colSpan={showSubjectColumn ? 7 : 5}
                      align="right"
                      sx={{
                        background:
                          "linear-gradient(to right, #e3f2fd, #bbdefb)",
                        borderRight: "1px solid rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="span"
                        sx={{
                          fontWeight: 800,
                          color: "#0d47a1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: 1.2,
                          letterSpacing: "0.04em",
                          textShadow: "0 1px 1px rgba(0,0,0,0.08)",
                        }}
                      >
                        <MdCurrencyRupee
                          style={{
                            color: "#1976d2",
                            fontSize: "1.6rem",
                            transform: "translateY(-1px)",
                          }}
                        />
                        GRAND TOTAL:
                      </Typography>
                    </TableCell>

                    {/* Total Hours */}
                    <TableCell align="center">
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#1b5e20",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.5,
                        }}
                      >
                        {sumHours.toFixed(2)}
                        <FaHourglassHalf
                          style={{
                            fontSize: "1.4rem",
                            color: "#388e3c",
                            marginLeft: "4px", // Ensures space between number and icon
                          }}
                        />
                      </Typography>
                    </TableCell>

                    {/* Total Fee */}
                    <TableCell align="center">
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#b71c1c",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <MdCurrencyRupee
                          style={{
                            fontSize: "1.6rem",
                            color: "#b71c1c",
                          }}
                        />
                        {sumFee.toFixed(2)}
                      </Typography>
                    </TableCell>

                    {/* Placeholder for summary or actions */}
                    <TableCell
                      align="center"
                      sx={{ color: "#546e7a", fontStyle: "italic" }}
                    >
                      {/* Optionally: `Classes: X` or leave empty */}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                p: 3,
                color: "text.secondary",
                minHeight: "200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaInfoCircle
                style={{ fontSize: "3rem", marginBottom: "15px" }}
              />
              <Typography variant="h6">No Timetables Found</Typography>
              <Typography variant="body2">
                Adjust your filters or add a new timetable.
                {autoGenerateErrorMsg && (
                  <Typography variant="body2" color="error">
                    {autoGenerateErrorMsg}
                  </Typography>
                )}
              </Typography>
            </Box>
          )}
        </Paper>
      </Slide>

      <Dialog
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="delete-dialog-title" sx={{ pb: 1 }}>
          Confirm Deletion
        </DialogTitle>

        <DialogContent dividers sx={{ pb: 2 }}>
          <Typography variant="body1" id="delete-dialog-description">
            Are you sure you want to delete the timetable on{" "}
            <Box
              component="span"
              sx={{ color: "#388e3c", fontWeight: 600, whiteSpace: "nowrap" }}
            >
              {timetableToDelete?.Day}
            </Box>{" "}
            at{" "}
            <Box
              component="span"
              sx={{ color: "#f57c00", fontWeight: 600, whiteSpace: "nowrap" }}
            >
              {timetableToDelete?.Time}
            </Box>{" "}
            for{" "}
            <Box
              component="span"
              sx={{ color: "#1976d2", fontWeight: 700, whiteSpace: "nowrap" }}
            >
              {timetableToDelete?.Student}
            </Box>
            ?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", p: 2 }}>
          <Stack direction="row" spacing={2}>
            <MuiButton
              onClick={() => setOpenDeleteConfirm(false)}
              disabled={isDeleting}
              variant="outlined"
              sx={{ minWidth: 100 }}
            >
              Cancel
            </MuiButton>
            <MuiButton
              onClick={handleDeleteConfirm}
              color="error"
              autoFocus
              disabled={isDeleting}
              sx={{ minWidth: 100 }}
            >
              {isDeleting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Delete"
              )}
            </MuiButton>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* General Snackbar for messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default TimetablePage;
