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
  FaEllipsisV
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
  Menu,
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
  Chip,
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

// --- UPDATED SORTING FUNCTION ---
const sortTimetableList = (timetableList) => {
  return timetableList.sort((a, b) => {
    // 1. Get the Date objects
    const dateA = getDateFromTimetableItem(a);
    const dateB = getDateFromTimetableItem(b);

    // FIX: Normalize to Midnight (Start of Day). 
    // We only want to compare the Calendar Date, not the time inside the ISO string.
    const dayA = startOfDay(dateA).getTime();
    const dayB = startOfDay(dateB).getTime();

    // Only return here if they are truly different DAYS
    if (dayA !== dayB) {
      return dayA - dayB;
    }

    // 2. Sort by Time String (Chronological: 01:00 AM -> 11:00 PM)
    const getStartTimeValue = (timeStr) => {
      // Handle empty/null times by pushing them to the end
      if (!timeStr || typeof timeStr !== 'string') return 9999999999999;

      try {
        // Extract start time part (e.g., "05:00 AM" from "05:00 AM to 06:00 AM")
        const [startTimePart] = timeStr.split(" to ");
        if (!startTimePart) return 9999999999999;

        // Parse time against a fixed reference date (Jan 1, 2000)
        // This ensures 05:00 AM is always earlier than 05:00 PM regardless of the actual date
        const referenceDate = new Date(2000, 0, 1);

        // Try parsing "hh:mm a" (12-hour format with AM/PM)
        let parsedTime = parse(startTimePart.trim(), "hh:mm a", referenceDate);

        // Fallback for missing space "05:00AM"
        if (!isValid(parsedTime)) {
          parsedTime = parse(startTimePart.trim(), "hh:mma", referenceDate);
        }

        // Fallback for 24hr format "17:00"
        if (!isValid(parsedTime)) {
          parsedTime = parse(startTimePart.trim(), "HH:mm", referenceDate);
        }

        if (isValid(parsedTime)) {
          return parsedTime.getTime();
        }

        return 9999999999999;
      } catch (error) {
        return 9999999999999;
      }
    };

    return getStartTimeValue(a.Time) - getStartTimeValue(b.Time);
  });
};

const TimetablePage = ({ isRevisionProgramJEEMains2026Student = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    timetables: manualTimetables,
    loading: classesLoading,
    error: classesError,
  } = useSelector((state) => state.classes);
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useSelector((state) => state.students);
  const {
    timetables: autoTimetables,
    loading: autoTimetablesLoading,
  } = useSelector((state) => state.autoTimetables);
  const { user } = useSelector((state) => state.auth);
  // State for the "More Options" menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
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
  const [isDeleting, setIsDeleting] = useState(false);

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
    if (!user || !user.id || !students || students.length === 0) {
      return;
    }

    let selectedDate;
    if (location.state?.date) {
      selectedDate = parse(location.state.date, "dd/MM/yyyy", new Date());
      if (!isValid(selectedDate)) {
        selectedDate = new Date();
      }
    } else {
      selectedDate = new Date();
    }

    const dateStrForBackend = format(selectedDate, "yyyy-MM-dd");
    setFilterDate(selectedDate);
    // Avoid double calling logic inside handleDateChange immediately if not needed
    // handleDateChange(dateStrForBackend); 
  }, [dispatch, user, students, location.state]);

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
    let combinedTimetables = [...manualTimetables, ...autoTimetables];

    const uniqueTimetables = new Map();
    combinedTimetables.forEach((item) => {
      const key = `${item.Student}-${item.Time}`;
      uniqueTimetables.set(key, item);
    });
    let permissionFilteredTimetables = Array.from(uniqueTimetables.values());

    if (
      user &&
      permissionFilteredTimetables &&
      permissionFilteredTimetables.length > 0
    ) {
      if (canAccessAll) {
      } else if (currentUserSubject) {
        permissionFilteredTimetables = permissionFilteredTimetables.filter(
          (schedule) => schedule.Subject?.trim() === currentUserSubject
        );
      } else {
        permissionFilteredTimetables = [];
      }
    } else if (!user) {
      permissionFilteredTimetables = [];
    }

    if (
      isRevisionProgramJEEMains2026Student &&
      students &&
      students.length > 0
    ) {
      const revisionStudentIds = new Set(
        students
          .filter(
            (student) => student.isRevisionProgramJEEMains2026Student === true
          )
          .map((student) => student.id)
      );

      permissionFilteredTimetables = permissionFilteredTimetables.filter(
        (item) => {
          if (item.studentId && revisionStudentIds.has(item.studentId)) {
            return true;
          }
          if (item.Student && students) {
            const matchingStudent = students.find(
              (student) =>
                student.Name === item.Student &&
                student.isRevisionProgramJEEMains2026Student === true
            );
            return matchingStudent !== undefined;
          }
          return false;
        }
      );
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
      let studentId = null;
      let isRevisionStudent = false;

      if (matchedStudent) {
        studentId = matchedStudent.id;
        isRevisionStudent = matchedStudent.isRevisionProgramJEEMains2026Student;
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
        monthlyFeePerClass: isRevisionStudent ? "1000" : monthlyFeePerClass,
        studentId: studentId,
        isRevisionStudent: isRevisionStudent,
      };
    });

    // --- APPLY SORTING HERE ---
    // This ensures the data is sorted by time just before being returned to the component
    return sortTimetableList(currentTimetables);

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
    isRevisionProgramJEEMains2026Student,
  ]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterDurationChange = (e) => {
    setFilterDurationType(e.target.value);
    setFilterDate(new Date());
  };

  const handleAddTimetableClick = () => {
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

        dispatch(updateAutoTimetableEntry(payload)).then(() => {
          setFilterDate(new Date(filterDate));
        });
      }
    },
    [dispatch, combinedAndFilteredTimetables, user, filterDate]
  );

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      if (timetableToDelete.isAutoGeneratedInDb) {
        await dispatch(deleteAutoTimetable(timetableToDelete.id));
        setSnackbarSeverity("success");
        setSnackbarMessage("Auto-generated timetable deleted successfully!");
      } else {
        await dispatch(deleteTimetable(timetableToDelete.id));
        await dispatch(
          fetchUpcomingClasses({
            date: filterDate.toLocaleDateString("en-GB"),
          })
        );
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
      const duration = parseFloat(calculateDuration(item.Time));
      if (!isNaN(duration)) {
        acc.sumHours += duration;
      }

      if (item.monthlyFeePerClass && item.monthlyFeePerClass !== "N/A") {
        const feeValue = parseFloat(item.monthlyFeePerClass.replace("₹", ""));
        if (!isNaN(feeValue) && !isNaN(duration)) {
          acc.sumFee += feeValue * duration;
        }
      }
      return acc;
    },
    { sumHours: 0, sumFee: 0 }
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
    month: now.toLocaleString("default", { month: "long" }),
    year: now.getFullYear(),
  };
  const Exceltitle = `Electron Academy ${subject} class details ${current?.month} ${current?.year}`;

  const handleDateChange = async (dateString) => {
    if (!dateString) {
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

    if (generated.length > 0) {
      try {
        const dateStrForBackend = format(selectedDate, "yyyy-MM-dd");
        await dispatch(saveOrFetchAutoTimetables(dateStrForBackend, generated));

        const [year, month, day] = dateStrForBackend.split("-");
        const formattedDate = `${day}/${month}/${year}`;
        await dispatch(fetchUpcomingClasses({ date: formattedDate }));
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
        p: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading timetables...</Typography>
        </Box>
      )}
      {!isRevisionProgramJEEMains2026Student && (
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
              p: 2, // Increased padding slightly for better spacing
              borderRadius: "12px",
              mb: 1
            }}
          >
            <Box sx={{
              display: "flex",
              alignItems: "center", // Align items vertically center
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2
            }}>

              {/* --- LEFT SIDE: HEADER --- */}
              <Box sx={{ display: "flex", alignItems: "flex-start", minWidth: 200 }}>
                <FaCalendarAlt
                  style={{
                    marginRight: "15px",
                    fontSize: "2rem",
                    color: "#1976d2",
                    marginTop: "4px"
                  }}
                />
                <Box>
                  <Typography
                    variant="h6"
                    component="h1"
                    sx={{ color: "#292551", fontWeight: 700, mb: 0.5, lineHeight: 1.2 }}
                  >
                    Timetable Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Today is{" "}
                    <span className="current-date">
                      {format(new Date(), "EEEE, MMM dd, yyyy")}
                    </span>
                  </Typography>
                </Box>
              </Box>

              {/* --- RIGHT SIDE: FILTERS & ACTIONS --- */}
              <Box sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1.5,
                flexWrap: "wrap", // Allows items to wrap on mobile
                flex: 1,
                justifyContent: { xs: "flex-start", md: "flex-end" } // Left align on mobile, right on desktop
              }}>

                {/* 1. SEARCH INPUT */}
                <Box
                  sx={{
                    minWidth: { xs: "100%", sm: "200px" },
                    maxWidth: { xs: "100%", sm: "250px" },
                    flexGrow: 1
                  }}
                >
                  <MuiInput
                    label="Search"
                    icon={FaSearch}
                    name="searchTerm"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search..."
                    size="small"
                  />
                </Box>

                {/* 2. DATE FILTER */}
                <Box sx={{ minWidth: { xs: "100%", sm: "150px" }, flexGrow: { xs: 1, sm: 0 } }}>
                  <MuiDatePicker
                    label="Filter Date"
                    icon={FaCalendarAlt}
                    name="filterDate"
                    value={format(filterDate, "yyyy-MM-dd")}
                    onChange={handleDateChange}
                    size="small"
                  />
                </Box>

                {/* 3. ADD BUTTON */}
                <MuiButton
                  variant="contained"
                  startIcon={<FaPlusCircle />}
                  onClick={handleAddTimetableClick}
                  sx={{
                    bgcolor: "#1976d2",
                    "&:hover": { bgcolor: "#1565c0" },
                    borderRadius: "8px",
                    px: 2,
                    py: 1,
                    whiteSpace: "nowrap",
                    minWidth: "auto",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                  size="small"
                >
                  Add Timetable
                </MuiButton>

                {/* 4. MORE OPTIONS MENU */}
                <IconButton
                  id="download-options-button"
                  aria-controls={openMenu ? 'download-options-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openMenu ? 'true' : undefined}
                  onClick={handleMenuClick}
                  sx={{ bgcolor: 'rgba(0,0,0,0.04)' }}
                >
                  <FaEllipsisV size={16} color="#555" />
                </IconButton>

                {/* --- DROPDOWN MENU CONTENT --- */}
                <Menu
                  id="download-options-menu"
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleMenuClose}
                  MenuListProps={{
                    'aria-labelledby': 'download-options-button',
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {/* PDF Option */}
                  {combinedAndFilteredTimetables.length > 0 && (
                    <MenuItem sx={{ p: 0 }}>
                      <Tooltip
                        title={tooltipMessage}
                        placement="left"
                        slotProps={{
                          popper: {
                            sx: {
                              "& .MuiTooltip-tooltip": {
                                backgroundColor: hasMissingTopics ? "#d32f2f" : "#333",
                                color: "white",
                              },
                              "& .MuiTooltip-arrow": {
                                color: hasMissingTopics ? "#d32f2f" : "#333",
                              },
                            },
                          },
                        }}
                        arrow
                      >
                        <Box onClick={handleMenuClose} sx={{ width: '100%' }}>
                          <PdfDownloadButton
                            title={getPdfTitle()}
                            headers={getPdfTableHeaders()}
                            rows={getPdfTableRows()}
                            buttonLabel="Download PDF"
                            filename={`Timetable_Report_${getTodayDateForFilename()}.pdf`}
                            reportDate={new Date()}
                            totalHours={sumHours}
                            totalFee={sumFee}
                            buttonProps={{
                              variant: "text",
                              fullWidth: true,
                              sx: { justifyContent: "flex-start", color: "text.primary", px: 2, py: 1 }
                            }}
                            size="small"
                          />
                        </Box>
                      </Tooltip>
                    </MenuItem>
                  )}

                  {/* Excel Option */}
                  <MenuItem sx={{ p: 0 }}>
                    <Box onClick={handleMenuClose} sx={{ width: '100%' }}>
                      <ExcelDownloadButton
                        data={students}
                        filename="Electron_Academy_Student_Report.xlsx"
                        buttonLabel="Download Excel"
                        buttonProps={{
                          variant: "text",
                          color: "inherit",
                          size: "small",
                          fullWidth: true,
                          sx: { justifyContent: "flex-start", color: "text.primary", px: 2, py: 1 }
                        }}
                        excelReportTitle={Exceltitle}
                      />
                    </Box>
                  </MenuItem>
                </Menu>

              </Box>
            </Box>
          </Paper>
        </Slide>
      )}

      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={700}>
        <Paper
          elevation={6}
          sx={{ p: 2, overflowX: "auto", borderRadius: "12px" }}
        >
          {combinedAndFilteredTimetables.length > 0 ? (
            <TableContainer>
              <Table sx={{ minWidth: 800 }} aria-label="timetable">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Sl No</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Student Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Name of the Lesson</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", textAlign: "center" }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", textAlign: "center" }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Duration</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Fee/Hour</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
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
                            textAlign: "left",
                            cursor: "pointer",
                            textDecoration: "underline",
                            color: "#1976d2",
                            fontWeight: 500,
                            "&:hover": {
                              color: "#0d47a1",
                            },
                          }}
                        >
                          {item.Student}
                          {item.isRevisionStudent &&
                            !isRevisionProgramJEEMains2026Student && (
                              <Chip
                                size="small"
                                label="Revision"
                                color="warning"
                                sx={{ marginLeft: 1, height: "20px" }}
                              />
                            )}
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
                                      "linear-gradient(to right, #bbdefb, #64b5f6)",

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
                            ? `₹${parseFloat(item.monthlyFeePerClass) *
                            parseInt(calculateDuration(item.Time))
                            }`
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
                      background: "rgba(240, 248, 255, 0.75)",
                      backdropFilter: "blur(4px)",
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
                        backgroundColor: "rgba(227, 242, 253, 0.4)",
                      },
                    }}
                  >
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
                            marginLeft: "4px",
                          }}
                        />
                      </Typography>
                    </TableCell>

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

                    <TableCell
                      align="center"
                      sx={{ color: "#546e7a", fontStyle: "italic" }}
                    >
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