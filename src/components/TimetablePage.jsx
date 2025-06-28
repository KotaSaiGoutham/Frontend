// src/pages/TimetablePage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBook,
  FaClock,
  FaFilter,
  FaPlusCircle,
  FaSearch,
  FaArrowRight,
  FaMoneyBillWave,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle, // Added FaInfoCircle
} from "react-icons/fa";
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
  subDays,
  subWeeks,
  subMonths,
  subYears,
  parseISO,
} from "date-fns";
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
} from "@mui/material";

import {
  MuiInput,
  MuiSelect,
  MuiButton,
  MuiDatePicker,
} from "../components/customcomponents/MuiCustomFormFields"; // Ensure MuiDatePicker is imported

import "./TimetablePage.css";
import { fetchUpcomingClasses } from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";

const TimetablePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    timetables,
    loading: classesLoading,
    error: classesError,
  } = useSelector((state) => state.classes);
  const { user } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDurationType, setFilterDurationType] = useState("Daily");
  const [filterDate, setFilterDate] = useState(new Date());
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If token is missing, dispatch an auth error and redirect to login
      dispatch({
        type: SET_AUTH_ERROR,
        payload: "Authentication required. Please log in.",
      });
      navigate("/login");
      return;
    }

    // Dispatch the Redux action to fetch timetables
    dispatch(fetchUpcomingClasses());
  }, [dispatch, navigate]); // Add dispatch to the dependency array

  // Options for the new duration filter dropdown with dynamic dates
  const durationOptions = useMemo(() => {
    const today = new Date(); // Get current date for calculations

    // Helper function to format dates
    const formatDateForLabel = (date) => format(date, "dd/MM/yyyy");

    return [
      { value: "Daily", label: `Daily (${formatDateForLabel(filterDate)})` }, // Daily uses the selected `filterDate`
      {
        value: "2days",
        label: `Next 2 Days (until ${formatDateForLabel(addDays(today, 1))})`,
      },
      {
        value: "3days",
        label: `Next 3 Days (until ${formatDateForLabel(addDays(today, 2))})`,
      },
      {
        value: "4days",
        label: `Next 4 Days (until ${formatDateForLabel(addDays(today, 3))})`,
      },
      {
        value: "5days",
        label: `Next 5 Days (until ${formatDateForLabel(addDays(today, 4))})`,
      },
      {
        value: "Week",
        label: `This Week (until ${formatDateForLabel(
          endOfWeek(today, { weekStartsOn: 1 })
        )})`,
      }, // weekStartsOn: 1 for Monday
      {
        value: "Month",
        label: `This Month (until ${formatDateForLabel(endOfMonth(today))})`,
      },
      {
        value: "Year",
        label: `This Year (until ${formatDateForLabel(endOfYear(today))})`,
      },
    ];
  }, [filterDate]); // Re-generate options if `filterDate` changes (only relevant for 'Daily' label)

  const sortedFilteredTimetables = useMemo(() => {
    let permissionFilteredTimetables = [];

    // --- 1. Apply User Permission Logic ---
    if (user && timetables && timetables.length > 0) {
      if (user.AllowAll) {
        permissionFilteredTimetables = timetables; // If AllowAll is true, show all
      } else if (user.isPhysics) {
        permissionFilteredTimetables = timetables.filter(
          (schedule) => schedule.Subject?.trim() === "Physics"
        );
      } else if (user.isChemistry) {
        permissionFilteredTimetables = timetables.filter(
          (schedule) => schedule.Subject?.trim() === "Chemistry"
        );
      } else {
        // If user has no specific subject permission and is not AllowAll,
        // then show no timetables.
        permissionFilteredTimetables = [];
        console.warn(
          "User has no specific subject permissions for timetables. Displaying no classes."
        );
      }
    } else if (!user) {
      // Handle case where user object might not be loaded yet or is null
      console.warn(
        "User object not available, cannot apply timetable permissions."
      );
      permissionFilteredTimetables = []; // Default to empty if no user context
    }

    // -
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
        const itemDate = parse(item.Day, "dd/MM/yyyy", new Date());
        return (
          isValid(itemDate) &&
          isWithinInterval(itemDate, { start: startDate, end: endDate })
        );
      });
    }

    if (searchTerm) {
      currentTimetables = currentTimetables.filter(
        (item) =>
          item.Faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Student.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Time.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    currentTimetables.sort((a, b) => {
      const dateA = parse(a.Day, "dd/MM/yyyy", new Date());
      const dateB = parse(b.Day, "dd/MM/yyyy", new Date());

      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }

      const timeA = a.Time.split(" to ")[0];
      const timeB = b.Time.split(" to ")[0];
      return timeA.localeCompare(timeB);
    });

    return currentTimetables;
  }, [timetables, searchTerm, filterDurationType, filterDate]); // Dependencies for re-running memo

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterDurationChange = (e) => {
    setFilterDurationType(e.target.value);
    // When duration changes, reset filterDate to today for consistency,
    // as 2days/week/month/year are relative to 'now'
    setFilterDate(new Date());
  };

  const handleAddTimetableClick = () => {
    navigate("/add-timetable");
  };

  if (error) {
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
            {error}
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
    );
  }
  const showSubjectColumn = user?.AllowAll; // It will be true only if user.AllowAll is true

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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FaCalendarAlt
            style={{
              marginRight: "15px",
              fontSize: "2.5rem",
              color: "#292551",
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
                {format(new Date(), "EEEE, MMMM dd, yyyy")}
              </span>
              .
            </Typography>
          </Box>
        </Box>
        <MuiButton
          variant="contained"
          startIcon={<FaPlusCircle />}
          onClick={handleAddTimetableClick}
          sx={{
            bgcolor: "#4caf50",
            "&:hover": { bgcolor: "#388e3c" },
            borderRadius: "8px",
            px: 3,
            py: 1.2,
          }}
        >
          Add Timetable
        </MuiButton>
      </Paper>

      {/* Filters and Search Section */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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
            Filters
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {/* Search Input */}
          <Box sx={{ flexGrow: 1, minWidth: "200px", maxWidth: "350px" }}>
            <MuiInput
              label="Search"
              icon={FaSearch}
              name="searchTerm"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by faculty, subject, topic, student..."
            />
          </Box>

          {/* New: Duration Filter Dropdown */}
          <Box sx={{ minWidth: "150px" }}>
            <MuiSelect
              label="Show"
              name="filterDurationType"
              value={filterDurationType}
              onChange={handleFilterDurationChange}
              options={durationOptions}
              icon={FaCalendarAlt}
            />
          </Box>

          {/* Only show DatePicker if 'Daily' filter is selected */}
          {filterDurationType === "Daily" && (
            <Box sx={{ minWidth: "150px" }}>
              <MuiDatePicker
                label="Specific Date"
                icon={FaCalendarAlt}
                name="filterDate"
                value={format(filterDate, "yyyy-MM-dd")}
                onChange={(e) => setFilterDate(parseISO(e.target.value))}
              />
            </Box>
          )}
        </Box>
      </Paper>

      {/* Timetable Table */}
      <Paper elevation={3} sx={{ p: 2, overflowX: "auto" }}>
        {sortedFilteredTimetables.length > 0 ? (
          <TableContainer>
            <Table sx={{ minWidth: 800 }} aria-label="timetable">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#eff2f7" }}>
                  <TableCell
                    sx={{
                      color: "#333",
                      fontWeight: "bold",
                      fontSize: "1.05rem",
                      padding: "18px 12px",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <FaUserGraduate style={{ marginRight: "8px" }} /> Student
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#333",
                      fontWeight: "bold",
                      fontSize: "1.05rem",
                      padding: "18px 12px",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <FaInfoCircle style={{ marginRight: "8px" }} /> Topic
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#333",
                      fontWeight: "bold",
                      fontSize: "1.05rem",
                      padding: "18px 12px",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <FaCalendarAlt style={{ marginRight: "8px" }} /> Day
                    </Box>
                  </TableCell>
                  {showSubjectColumn && (
                    <TableCell
                      sx={{
                        color: "#333",
                        fontWeight: "bold",
                        fontSize: "1.05rem",
                        padding: "18px 12px",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <FaChalkboardTeacher style={{ marginRight: "8px" }} />{" "}
                        Faculty
                      </Box>
                    </TableCell>
                  )}
                  {showSubjectColumn && (
                    <TableCell
                      sx={{
                        color: "#333",
                        fontWeight: "bold",
                        fontSize: "1.05rem",
                        padding: "18px 12px",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <FaBook style={{ marginRight: "8px" }} /> Subject
                      </Box>
                    </TableCell>
                  )}

                  <TableCell
                    sx={{
                      color: "#333",
                      fontWeight: "bold",
                      fontSize: "1.05rem",
                      padding: "18px 12px",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <FaClock style={{ marginRight: "8px" }} /> Time
                    </Box>
                  </TableCell>

                  {/* Add other table headers as needed for your data structure */}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedFilteredTimetables.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#f7f8fc",
                      "&:hover": { backgroundColor: "#e3f2fd !important" },
                      "& > td": {
                        borderBottom:
                          "1px solid rgba(0, 0, 0, 0.05) !important",
                      },
                    }}
                  >
                    <TableCell sx={{ fontSize: "0.9rem" }}>
                      {item.Student}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.9rem" }}>
                      {item.Topic}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.9rem" }}>
                      {item.Day}
                    </TableCell>
                    {showSubjectColumn && (
                      <TableCell sx={{ fontSize: "0.9rem" }}>
                        {item.Faculty}
                      </TableCell>
                    )}
                    {showSubjectColumn && (
                      <TableCell sx={{ fontSize: "0.9rem" }}>
                        {item.Subject}
                      </TableCell>
                    )}
                    <TableCell sx={{ fontSize: "0.9rem" }}>
                      {item.Time}
                    </TableCell>

                    {/* Add other table cells */}
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
            No timetable entries found matching your filters.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default TimetablePage;
