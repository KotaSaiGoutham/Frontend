import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
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
import { MdCurrencyRupee, MdEdit, MdDelete } from "react-icons/md"; // Import MdEdit, MdDelete

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
  parseISO,
  differenceInMinutes,
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
  Slide,
  Fade,
  // Dialog components for confirmation
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import {
  MuiInput,
  MuiSelect,
  MuiButton,
  MuiDatePicker,
} from "../components/customcomponents/MuiCustomFormFields";

import "./TimetablePage.css";
import { fetchUpcomingClasses, fetchStudents, deleteTimetable } from "../redux/actions"; // Import deleteTimetable
import { useSelector, useDispatch } from "react-redux";

const TimetablePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    timetables,
    loading: classesLoading,
    error: classesError,
  } = useSelector((state) => state.classes);
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useSelector((state) => state.students);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDurationType, setFilterDurationType] = useState("Daily");
  const [filterDate, setFilterDate] = useState(new Date());

  // State for Delete Confirmation Dialog
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [timetableToDelete, setTimetableToDelete] = useState(null); // Stores the item to be deleted

  useEffect(() => {
    dispatch(fetchUpcomingClasses());
    dispatch(fetchStudents());
  }, [dispatch, navigate]);

  const durationOptions = useMemo(() => {
    const today = new Date();
    const formatDateForLabel = (date) => format(date, "dd/MM/yyyy");

    return [
      { value: "Daily", label: `Daily (${formatDateForLabel(filterDate)})` },
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
      },
      {
        value: "Month",
        label: `This Month (until ${formatDateForLabel(endOfMonth(today))})`,
      },
      {
        value: "Year",
        label: `This Year (until ${formatDateForLabel(endOfYear(today))})`,
      },
    ];
  }, [filterDate]);

  const calculateDuration = (timeString) => {
    try {
      const [startTimeStr, endTimeStr] = timeString.split(" to ");
      if (!startTimeStr || !endTimeStr) return "N/A";

      const now = new Date();
      const startTime = parse(startTimeStr, "hh:mm a", now);
      let endTime = parse(endTimeStr, "hh:mm a", now);

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
      console.error("Error calculating duration for time string:", timeString, e);
      return "N/A";
    }
  };

  const sortedFilteredTimetables = useMemo(() => {
    let permissionFilteredTimetables = [];

    if (user && timetables && timetables.length > 0) {
      if (user.AllowAll) {
        permissionFilteredTimetables = timetables;
      } else if (user.isPhysics) {
        permissionFilteredTimetables = timetables.filter(
          (schedule) => schedule.Subject?.trim() === "Physics"
        );
      } else if (user.isChemistry) {
        permissionFilteredTimetables = timetables.filter(
          (schedule) => schedule.Subject?.trim() === "Chemistry"
        );
      } else {
        permissionFilteredTimetables = [];
        console.warn(
          "User has no specific subject permissions for timetables. Displaying no classes."
        );
      }
    } else if (!user) {
      console.warn(
        "User object not available, cannot apply timetable permissions."
      );
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

    const studentSubjectFeeMap = new Map();
    if (students && students.length > 0) {
      students.forEach((student) => {
        if (student.Name && student.Subject) {
          const key = `${student.Name.toLowerCase()}_${student.Subject.toLowerCase()}`;
          studentSubjectFeeMap.set(key, student);
        }
      });
    }

    currentTimetables = currentTimetables.map((item) => {
      const studentNameLower = item.Student?.toLowerCase();
      const subjectLower = item.Subject?.toLowerCase();
      const lookupKey = `${studentNameLower}_${subjectLower}`;

      const matchedStudent = studentSubjectFeeMap.get(lookupKey);
      let monthlyFeePerClass = "N/A";

      if (matchedStudent) {
        let feeToUse = 0;
        if (typeof matchedStudent.monthlyFee === 'number' && matchedStudent.monthlyFee > 0) {
          feeToUse = matchedStudent.monthlyFee;
        } else if (typeof matchedStudent['Monthly Fee'] === 'string' && parseFloat(matchedStudent['Monthly Fee']) > 0) {
          feeToUse = parseFloat(matchedStudent['Monthly Fee']);
        }

        if (feeToUse > 0) {
          monthlyFeePerClass = (feeToUse / 12).toFixed(2);
        }
      }

      return {
        ...item,
        monthlyFeePerClass: monthlyFeePerClass,
      };
    });

    currentTimetables.sort((a, b) => {
      const dateA = parse(a.Day, "dd/MM/yyyy", new Date());
      const dateB = parse(b.Day, "dd/MM/yyyy", new Date());

      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }

      const timeA = parse(a.Time.split(" to ")[0], "hh:mm a", new Date());
      const timeB = parse(b.Time.split(" to ")[0], "hh:mm a", new Date());
      return timeA.getTime() - timeB.getTime();
    });

    return currentTimetables;
  }, [timetables, searchTerm, filterDurationType, filterDate, user, students]);

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

  // --- New Handlers for Edit and Delete ---
  const handleEditTimetable = (timetableItem) => {
    // Navigate to add-timetable page, passing the full item data as state
    navigate("/add-timetable", { state: { timetableToEdit: timetableItem } });
  };

  const handleDeleteClick = (timetableItem) => {
    setTimetableToDelete(timetableItem);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setTimetableToDelete(null);
  };

  const handleConfirmDelete = async () => {
    console.log("timetableToDelete",timetableToDelete)
    if (timetableToDelete && timetableToDelete.id) {
      try {
        await dispatch(deleteTimetable(timetableToDelete.id));
        // Success feedback can be added here (e.g., a toast message)
      } catch (error) {
        // Error feedback can be added here
        console.error("Failed to delete timetable:", error);
        alert(`Failed to delete timetable: ${error.message}`); // Simple alert for now
      } finally {
        handleCloseDeleteConfirm();
      }
    }
  };
  // --- End New Handlers ---

  // Centralized loading and error states with Fade animation
  if (classesLoading || studentsLoading) {
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
            Loading timetables and student data...
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
      {/* Header Card with Slide animation */}
      <Slide direction="down" in={true} mountOnEnter unmountOnExit timeout={500}>
        <Paper
          elevation={6} // Increased elevation for more depth
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
            flexWrap: "wrap",
            gap: 2,
            borderRadius: "12px", // Rounded corners for consistency
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FaCalendarAlt
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
          <MuiButton
            variant="contained"
            startIcon={<FaPlusCircle />}
            onClick={handleAddTimetableClick}
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
            Add Timetable
          </MuiButton>
        </Paper>
      </Slide>

      {/* Filters and Search Section with Slide animation */}
      <Slide direction="right" in={true} mountOnEnter unmountOnExit timeout={600}>
        <Paper elevation={6} sx={{ p: 3, borderRadius: "12px" }}> {/* Increased elevation, rounded corners */}
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
              <FaFilter style={{ marginRight: "10px", fontSize: "1.8rem", color: "#1976d2" }} />{" "}
              Filters
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {/* Search Input */}
            <Box sx={{ flexGrow: 1, minWidth: { xs: "100%", sm: "200px" }, maxWidth: { xs: "100%", sm: "350px" } }}>
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
            <Box sx={{ minWidth: { xs: "100%", sm: "150px" } }}>
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
              <Box sx={{ minWidth: { xs: "100%", sm: "150px" } }}>
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
      </Slide>

      {/* Timetable Table with Slide animation */}
      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={700}>
        <Paper elevation={6} sx={{ p: 2, overflowX: "auto", borderRadius: "12px" }}> {/* Increased elevation, rounded corners */}
          {sortedFilteredTimetables.length > 0 ? (
            <TableContainer>
              <Table sx={{ minWidth: 800 }} aria-label="timetable">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#e3f2fd" }}> {/* Lighter blue background for header row */}
                    <TableCell
                      sx={{
                        color: "#1a237e", // Dark blue for header text
                        fontWeight: "bold",
                        fontSize: "1.05rem",
                        padding: "18px 12px",
                        textAlign: 'center',
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
                        <FaUserGraduate style={{ marginRight: "8px", color: "#1976d2" }} /> Student
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#1a237e",
                        fontWeight: "bold",
                        fontSize: "1.05rem",
                        padding: "18px 12px",
                        textAlign: 'center',
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
                        <FaInfoCircle style={{ marginRight: "8px", color: "#1976d2" }} /> Lesson
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#1a237e",
                        fontWeight: "bold",
                        fontSize: "1.05rem",
                        padding: "18px 12px",
                        textAlign: 'center',
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
                        <FaCalendarAlt style={{ marginRight: "8px", color: "#1976d2" }} /> Date
                      </Box>
                    </TableCell>
                    {showSubjectColumn && (
                      <TableCell
                        sx={{
                          color: "#1a237e",
                          fontWeight: "bold",
                          fontSize: "1.05rem",
                          padding: "18px 12px",
                          textAlign: 'center',
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
                          <FaChalkboardTeacher style={{ marginRight: "8px", color: "#1976d2" }} />{" "}
                          Faculty
                        </Box>
                      </TableCell>
                    )}
                    {showSubjectColumn && (
                      <TableCell
                        sx={{
                          color: "#1a237e",
                          fontWeight: "bold",
                          fontSize: "1.05rem",
                          padding: "18px 12px",
                          textAlign: 'center',
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
                          <FaBook style={{ marginRight: "8px", color: "#1976d2" }} /> Subject
                        </Box>
                      </TableCell>
                    )}
                    <TableCell
                      sx={{
                        color: "#1a237e",
                        fontWeight: "bold",
                        fontSize: "1.05rem",
                        padding: "18px 12px",
                        textAlign: 'center',
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
                        <FaClock style={{ marginRight: "8px", color: "#1976d2" }} /> Time
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#1a237e",
                        fontWeight: "bold",
                        fontSize: "1.05rem",
                        padding: "18px 12px",
                        textAlign: 'center',
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
                        <FaHourglassHalf style={{ marginRight: "8px", color: "#1976d2" }} /> Duration
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#1a237e",
                        fontWeight: "bold",
                        fontSize: "1.05rem",
                        padding: "18px 12px",
                        textAlign: 'center',
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
                        <MdCurrencyRupee style={{ marginRight: "8px", color: "#1976d2" }} /> Fee / Class
                      </Box>
                    </TableCell>
                    {/* New: Actions Table Header */}
                    <TableCell
                      sx={{
                        color: "#1a237e",
                        fontWeight: "bold",
                        fontSize: "1.05rem",
                        padding: "18px 12px",
                        textAlign: 'center',
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedFilteredTimetables.map((item, index) => (
                    <TableRow
                      key={item.id || index} // Use item.id if available, otherwise index
                      sx={{
                        backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#fbfbfb",
                        "&:hover": { backgroundColor: "#e9f7fe !important" }, // Changed hover color to a softer light blue
                        "& > td": {
                          borderBottom: "1px solid rgba(0, 0, 0, 0.05) !important",
                          fontSize: "0.95rem",
                          color: "#424242",
                          textAlign: 'center',
                        },
                      }}
                    >
                      <TableCell>{item.Student}</TableCell>
                      <TableCell>{item.Topic}</TableCell>
                      <TableCell>{item.Day}</TableCell>
                      {showSubjectColumn && (
                        <TableCell>{item.Faculty}</TableCell>
                      )}
                      {showSubjectColumn && (
                        <TableCell>{item.Subject}</TableCell>
                      )}
                      <TableCell>{item.Time}</TableCell>
                      <TableCell>{calculateDuration(item.Time)}</TableCell>
                      <TableCell>
                        {item.monthlyFeePerClass !== "N/A"
                          ? `₹${item.monthlyFeePerClass}`
                          : "N/A"}
                      </TableCell>
                      {/* New: Actions Table Cell */}
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          {/* <MuiButton
                            variant="outlined"
                            size="small"
                            startIcon={<MdEdit />}
                            onClick={() => handleEditTimetable(item)}
                            sx={{
                              borderColor: '#1976d2',
                              color: '#1976d2',
                              '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                borderColor: '#1565c0',
                                color: '#1565c0',
                              },
                            }}
                          >
                            Edit
                          </MuiButton> */}
                          <MuiButton
                            variant="outlined"
                            size="small"
                            startIcon={<MdDelete />}
                            color="error" // Use error color for delete button
                            onClick={() => handleDeleteClick(item)}
                            sx={{
                              borderColor: '#d32f2f',
                              color: '#d32f2f',
                              '&:hover': {
                                backgroundColor: 'rgba(211, 47, 47, 0.04)',
                                borderColor: '#c62828',
                                color: '#c62828',
                              },
                            }}
                          >
                            Delete
                          </MuiButton>
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
              No timetable entries found matching your filters.
            </Typography>
          )}
        </Paper>
      </Slide>

      {/* Delete Confirmation Dialog */}
   <Dialog
      open={openDeleteConfirm}
      onClose={handleCloseDeleteConfirm}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Confirm Deletion?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete the timetable entry for{" "}
          <b>{timetableToDelete?.Student}</b> on{" "}
          <b>{timetableToDelete?.Day}</b> at{" "}
          <b>{timetableToDelete?.Time}</b>? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions
        // Add sx prop to DialogActions to center the content
        sx={{
          justifyContent: 'center', // Centers items horizontally
          gap: 2, // Adds some space between buttons (optional)
        }}
      >
        <MuiButton onClick={handleCloseDeleteConfirm} color="primary">
          Cancel
        </MuiButton>
        <MuiButton onClick={handleConfirmDelete} color="error" autoFocus>
          Delete
        </MuiButton>
      </DialogActions>
    </Dialog>
    </Box>
  );
};

export default TimetablePage;