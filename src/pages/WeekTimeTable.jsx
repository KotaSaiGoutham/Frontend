import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClassSchedule, updateClassSchedule } from "../redux/actions";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Box,
  Grid,
  TextField,
  InputAdornment,
  CircularProgress,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Slide,
  Fade,
  Typography,
  IconButton,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Collapse,
  Drawer,
  Divider,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { getTimeValue } from "../mockdata/function";

// Enhanced Color definitions
const colors = {
  regular: "#C2F0C2", // Light Green for regular students
  revision: "green", // Light Red for revision students
  headerBackground: "#2c3e50", // Dark blue-gray header
  border: "#bdc3c7", // Border color
  text: "#2c3e50", // Dark text
  editButton: "#3498db", // Blue for edit button
  saveButton: "#27ae60", // Green for save button
  background: "#ecf0f1", // Light background
  cardBackground: "#ffffff",
  hover: "#f8f9fa",
  swapButton: "#9b59b6", // Purple for swap feature
};

// Enhanced Styles
const containerStyle = {
  padding: "10px",
};

const mainContainerStyle = {
  maxWidth: "1400px",
  margin: "0 auto",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "32px",
  flexWrap: "wrap",
  gap: "16px",
};

const titleStyle = {
  fontSize: "2.5rem",
  fontWeight: "800",
  background: "linear-gradient(135deg, #3498db 0%, #2c3e50 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  margin: "0",
  letterSpacing: "-0.5px",
};

const controlsStyle = {
  background: colors.cardBackground,
  borderRadius: "16px",
  padding: "15px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  marginBottom: "15px",
  border: `1px solid ${colors.border}`,
};

// Enhanced sticky header styles
const stickyHeaderStyle = {
  position: "sticky",
  top: 0,
  zIndex: 10,
  backgroundColor: colors.headerBackground,
};

// Enhanced Table cell styles
const headerCellStyle = {
  backgroundColor: colors.headerBackground,
  color: "white",
  fontWeight: "700",
  fontSize: "13px",
  textTransform: "uppercase",
  border: `1px solid ${colors.border}`,
  textAlign: "center",
  padding: "16px 12px",
  letterSpacing: "0.5px",
  position: "sticky",
  top: 0,
  zIndex: 10,
};
const nameHeaderCellStyle = {
  ...headerCellStyle,
  textAlign: "left",
  backgroundColor: colors.headerBackground,
  position: "sticky",
  left: 0,
  zIndex: 11, // Higher than other headers
};

const baseCellStyle = {
  border: `1px solid ${colors.border}`,
  padding: "16px 12px",
  textAlign: "center",
  color: colors.text,
  fontWeight: "700",
  transition: "all 0.2s ease-in-out",
};

const nameCellStyle = {
  ...baseCellStyle,
  textAlign: "left",
  fontWeight: "600",
  fontSize: "14px",
};

const timeStyle = {
  fontSize: "13px",
  fontWeight: "700",
  color: colors.text,
  padding: "6px 12px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.9)",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const emptyCellStyle = {
  ...baseCellStyle,
  color: "#95a5a6",
  fontStyle: "italic",
};

const clickableCellStyle = {
  ...baseCellStyle,
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: colors.hover,
    transform: "scale(1.02)",
  },
};

// Enhanced Modal styles
const editModalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1300,
  backdropFilter: "blur(4px)",
};

const editModalContentStyle = {
  backgroundColor: colors.cardBackground,
  borderRadius: "20px",
  padding: "32px",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  border: `1px solid ${colors.border}`,
  minWidth: "450px",
  maxWidth: "90vw",
  transform: "scale(0.95)",
  animation: "modalAppear 0.3s ease-out forwards",
};

const ClassSchedule = () => {
  const dispatch = useDispatch();
  // Add safe access with default values
  const {
    classSchedule = {},
    loading,
    error,
  } = useSelector((state) => state.students);
  console.log("classSchedule",classSchedule)

  // Provide safe defaults for classSchedule properties
  const safeClassSchedule = {
    data: classSchedule.data || [],
    loading: classSchedule.loading || false,
    error: classSchedule.error || null,
    updating: classSchedule.updating || false,
    updateError: classSchedule.updateError || null,
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCell, setEditingCell] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDay, setSelectedDay] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // New states for student swap feature
  const [swapMode, setSwapMode] = useState(false);
  const [selectedStudentForSwap, setSelectedStudentForSwap] = useState(null);
  const [targetStudentForSwap, setTargetStudentForSwap] = useState("");
  const [swapHistory, setSwapHistory] = useState([]);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Update useEffect to use new action
  useEffect(() => {
    dispatch(fetchClassSchedule());
  }, [dispatch]);

  const formatTimeForDisplay = (timeString) => {
    const timeMatch = timeString.match(/(\d{1,2}):(\d{2})(am|pm)/i);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const period = timeMatch[3].toLowerCase();
      return `${hour}${period}`;
    }
    return timeString;
  };

  // Update scheduleData to use safeClassSchedule.data
  const scheduleData = useMemo(() => {
    if (!safeClassSchedule.data || safeClassSchedule.data.length === 0)
      return [];

    return safeClassSchedule.data.map((student) => {
      const studentSchedule = {
        id: student.id,
        name: student.Name || student.name,
        studentType: student.isRevisionProgramJEEMains2026Student
          ? "revision"
          : "regular",
        mon: "",
        tue: "",
        wed: "",
        thu: "",
        fri: "",
        sat: "",
        sun: "",
      };

      if (student.classDateandTime && Array.isArray(student.classDateandTime)) {
        student.classDateandTime.forEach((classTime) => {
          const [day, time] = classTime.split("-");
          if (day && time) {
            const dayKey = day.toLowerCase().substring(0, 3);
            const formattedTime = formatTimeForDisplay(time);

            if (studentSchedule[dayKey]) {
              studentSchedule[dayKey] += `, ${formattedTime}`;
            } else {
              studentSchedule[dayKey] = formattedTime;
            }
          }
        });
      }
      return studentSchedule;
    });
  }, [safeClassSchedule.data]); // Update dependency

  const formatTimeForStorage = (timeString) => {
    const timeMatch = timeString.match(/(\d{1,2})(am|pm)/i);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const period = timeMatch[2].toLowerCase();
      const formattedHour = hour.toString().padStart(2, "0");
      return `${formattedHour}:00${period}`;
    }
    return timeString;
  };

  const getFullDayName = (shortDay) => {
    const dayMap = {
      mon: "Monday",
      tue: "Tuesday",
      wed: "Wednesday",
      thu: "Thursday",
      fri: "Friday",
      sat: "Saturday",
      sun: "Sunday",
    };
    return dayMap[shortDay] || shortDay;
  };

  const handleEditClick = (studentId, day, currentValue) => {
    if (isEditMode) {
      setEditingCell({ studentId, day });
      setTempValue(currentValue || "");
    }
  };

  // Update handleSave to use safeClassSchedule.data
  const handleSave = async () => {
    if (!editingCell) return;
    const { studentId, day } = editingCell;

    try {
      const newTimes = tempValue
        .split(",")
        .map((time) => time.trim())
        .filter((time) => time);
      const dayFullName = getFullDayName(day);

      const newClassDateandTime = newTimes.map((time) => {
        const formattedTime = formatTimeForStorage(time);
        return `${dayFullName}-${formattedTime}`;
      });

      // Get current student to preserve other day schedules - use safe access
      const currentStudent = safeClassSchedule.data.find(
        (s) => s.id === studentId
      );
      const existingSchedules = (currentStudent?.classDateandTime || []).filter(
        (schedule) =>
          !schedule.toLowerCase().startsWith(dayFullName.toLowerCase())
      );

      const updatedSchedules = [...existingSchedules, ...newClassDateandTime];

      console.log(
        "Updating student:",
        studentId,
        "with schedules:",
        updatedSchedules
      );

      // Use the new update action
      await dispatch(
        updateClassSchedule(studentId, { classDateandTime: updatedSchedules })
      );

      setEditingCell(null);
      setTempValue("");
    } catch (error) {
      console.error("Error updating schedule:", error);
      alert("Failed to update schedule");
    }
  };

  // NEW FUNCTION: Handle student schedule swap
  const handleStudentSwap = async () => {
    if (!selectedStudentForSwap || !targetStudentForSwap) {
      alert("Please select both source and target students");
      return;
    }

    if (selectedStudentForSwap === targetStudentForSwap) {
      alert("Cannot swap schedule with the same student");
      return;
    }

    try {
      // Get current schedules for both students
      const sourceStudent = safeClassSchedule.data.find(
        (s) => s.id === selectedStudentForSwap
      );
      const targetStudent = safeClassSchedule.data.find(
        (s) => s.id === targetStudentForSwap
      );

      if (!sourceStudent || !targetStudent) {
        alert("Students not found");
        return;
      }

      // Swap the classDateandTime arrays
      const sourceSchedule = sourceStudent.classDateandTime || [];
      const targetSchedule = targetStudent.classDateandTime || [];

      // Update both students
      await Promise.all([
        dispatch(
          updateClassSchedule(selectedStudentForSwap, {
            classDateandTime: targetSchedule,
          })
        ),
        dispatch(
          updateClassSchedule(targetStudentForSwap, {
            classDateandTime: sourceSchedule,
          })
        ),
      ]);

      // Add to swap history
      const newSwapRecord = {
        id: Date.now(),
        sourceStudent: sourceStudent.Name || sourceStudent.name,
        targetStudent: targetStudent.Name || targetStudent.name,
        timestamp: new Date().toLocaleString(),
        sourceStudentId: selectedStudentForSwap,
        targetStudentId: targetStudentForSwap,
      };

      setSwapHistory((prev) => [newSwapRecord, ...prev.slice(0, 9)]); // Keep last 10 records

      // Reset swap state
      setSelectedStudentForSwap(null);
      setTargetStudentForSwap("");
      setSwapMode(false);

      alert("Student schedules swapped successfully!");
    } catch (error) {
      console.error("Error swapping schedules:", error);
      alert("Failed to swap schedules");
    }
  };

  // NEW FUNCTION: Handle student selection for swap
  const handleStudentSelectForSwap = (studentId) => {
    if (!swapMode) {
      setSwapMode(true);
      setSelectedStudentForSwap(studentId);
    } else {
      setTargetStudentForSwap(studentId);
    }
  };

  const handleCancel = () => {
    setEditingCell(null);
    setTempValue("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && editingCell) {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const filteredScheduleData = useMemo(
    () =>
      scheduleData.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedDay === "all" || student[selectedDay])
      ),
    [scheduleData, searchTerm, selectedDay]
  );
  console.log("filteredScheduleData",filteredScheduleData)

const sortedData = useMemo(() => {
  if (!filteredScheduleData.length) return [];
  
  return [...filteredScheduleData].sort((a, b) => {
    // Find the earliest time across ALL days for each student
    const findEarliestTime = (student) => {
      let earliestTime = Infinity;
      
      days.forEach(day => {
        const dayKey = day.toLowerCase();
        const times = student[dayKey];
        if (times) {
          const timeArray = times.split(',').map(time => time.trim());
          const minTimeForDay = Math.min(...timeArray.map(time => getTimeValue(time)));
          earliestTime = Math.min(earliestTime, minTimeForDay);
        }
      });
      
      return earliestTime;
    };

    const aEarliestTime = findEarliestTime(a);
    const bEarliestTime = findEarliestTime(b);

    // If both have no classes
    if (aEarliestTime === Infinity && bEarliestTime === Infinity) return 0;
    if (aEarliestTime === Infinity) return 1; // a has no classes, put at end
    if (bEarliestTime === Infinity) return -1; // b has no classes, put at end

    // Compare by earliest time across the entire week
    if (aEarliestTime !== bEarliestTime) {
      return aEarliestTime - bEarliestTime;
    }

    // If same earliest time, find the SECOND earliest time and compare
    const findSecondEarliestTime = (student, firstEarliest) => {
      let secondEarliest = Infinity;
      
      days.forEach(day => {
        const dayKey = day.toLowerCase();
        const times = student[dayKey];
        if (times) {
          const timeArray = times.split(',').map(time => time.trim());
          timeArray.forEach(time => {
            const timeValue = getTimeValue(time);
            if (timeValue > firstEarliest && timeValue < secondEarliest) {
              secondEarliest = timeValue;
            }
          });
        }
      });
      
      return secondEarliest;
    };

    const aSecondEarliest = findSecondEarliestTime(a, aEarliestTime);
    const bSecondEarliest = findSecondEarliestTime(b, bEarliestTime);

    if (aSecondEarliest !== bSecondEarliest) {
      return aSecondEarliest - bSecondEarliest;
    }

    // If still same, sort by name
    return a.name.localeCompare(b.name);
  });
}, [filteredScheduleData, days]);
  console.log("sortedData",sortedData)

  // Calculate statistics - update to use scheduleData
  const stats = useMemo(() => {
    const totalStudents = scheduleData.length;
    const revisionStudents = scheduleData.filter(
      (s) => s.studentType === "revision"
    ).length;
    const regularStudents = totalStudents - revisionStudents;
    const totalClasses = scheduleData.reduce((acc, student) => {
      return (
        acc +
        days.reduce((dayAcc, day) => {
          const times = student[day.toLowerCase()];
          return dayAcc + (times ? times.split(",").length : 0);
        }, 0)
      );
    }, 0);

    const today = new Date()
      .toLocaleDateString("en", { weekday: "short" })
      .toLowerCase();
    const activeToday = scheduleData.filter((s) => s[today]).length;

    return {
      totalStudents,
      revisionStudents,
      regularStudents,
      totalClasses,
      activeToday,
    };
  }, [scheduleData, days]);

const renderTimeSlots = (times) => {
  if (!times) {
    return <span style={{ color: '#95a5a6', fontStyle: 'italic' }}>-</span>;
  }

  const timeArray = times.split(',').map((time) => time.trim());

  // Sort times within the same cell
  const sortedTimes = timeArray.sort((a, b) => {
    return getTimeValue(a) - getTimeValue(b);
  });

  if (sortedTimes.length === 1) {
    return <span style={timeStyle}>{sortedTimes[0]}</span>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {sortedTimes.map((time, index) => (
        <span key={index} style={timeStyle}>
          {time}
        </span>
      ))}
    </Box>
  );
};

  // NEW COMPONENT: Student Dropdown for Swap
  const StudentSwapDropdown = ({ studentId, studentName }) => {
    const otherStudents = scheduleData.filter(
      (student) => student.id !== studentId
    );

    return (
      <Select
        value={targetStudentForSwap}
        onChange={(e) => setTargetStudentForSwap(e.target.value)}
        size="small"
        sx={{
          minWidth: 200,
          borderRadius: 2,
          backgroundColor: "white",
          "& .MuiSelect-select": { py: 0.5 },
        }}
        displayEmpty
      >
        <MenuItem value="">
          <em>Select student to swap with...</em>
        </MenuItem>
        {otherStudents.map((student) => (
          <MenuItem key={student.id} value={student.id}>
            {student.name} ({student.studentType})
          </MenuItem>
        ))}
      </Select>
    );
  };
  // Add this function to your component, right after the renderGridView function
  const renderListView = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {sortedData.map((student, index) => {
        const isRevision = student.studentType === "revision";
        const isSelectedForSwap = selectedStudentForSwap === student.id;

        return (
          <Card
            key={student.id}
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              border: isSelectedForSwap
                ? "2px solid #9b59b6"
                : "1px solid #bdc3c7",
              backgroundColor: isRevision
                ? "rgba(255, 114, 111, 0.1)"
                : "rgba(119, 221, 119, 0.1)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Header with student info and actions */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight="700" gutterBottom>
                    {student.name}
                  </Typography>
                </Box>

                {/* Actions */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <Tooltip
                    title={
                      swapMode
                        ? "Select for schedule swap"
                        : "Swap schedule with another student"
                    }
                  >
                    <Button
                      variant={isSelectedForSwap ? "contained" : "outlined"}
                      color="secondary"
                      size="small"
                      startIcon={<SwapHorizIcon />}
                      onClick={() => handleStudentSelectForSwap(student.id)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      {swapMode
                        ? isSelectedForSwap
                          ? "Selected"
                          : "Select"
                        : "Swap"}
                    </Button>
                  </Tooltip>

                  {/* Swap dropdown when selected */}
                  {isSelectedForSwap && (
                    <Box
                      sx={{
                        mt: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        minWidth: 200,
                      }}
                    >
                      <StudentSwapDropdown
                        studentId={student.id}
                        studentName={student.name}
                      />
                      {targetStudentForSwap && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={handleStudentSwap}
                          sx={{ mt: 1 }}
                        >
                          Confirm Swap
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Schedule days */}
              <Grid container spacing={2}>
                {days.map((day) => {
                  const dayKey = day.toLowerCase();
                  const cellValue = student[dayKey];
                  const isEditing =
                    editingCell?.studentId === student.id &&
                    editingCell?.day === dayKey;

                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={day}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: "white",
                          border: "1px solid #e0e0e0",
                          cursor: isEditMode ? "pointer" : "default",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": isEditMode
                            ? {
                                backgroundColor: "#f5f5f5",
                                transform: "scale(1.02)",
                              }
                            : {},
                        }}
                        onClick={() =>
                          handleEditClick(student.id, dayKey, cellValue)
                        }
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight="700"
                          color="text.primary"
                          gutterBottom
                        >
                          {day}
                        </Typography>
                        <Box sx={{ minHeight: 24 }}>
                          {cellValue ? (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.5,
                              }}
                            >
                              {cellValue.split(",").map((time, idx) => (
                                <Chip
                                  key={idx}
                                  label={time.trim()}
                                  size="small"
                                  sx={{
                                    backgroundColor: isRevision
                                      ? "#ff6f61"
                                      : "#77dd77",
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                  }}
                                />
                              ))}
                            </Box>
                          ) : (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontStyle="italic"
                            >
                              No class
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        );
      })}

      {sortedData.length === 0 && (
        <Box sx={{ textAlign: "center", padding: "60px 20px" }}>
          <Box sx={{ fontSize: "64px", mb: 2, opacity: 0.3 }}>📚</Box>
          <Typography variant="h5" color="text.primary" gutterBottom>
            No students found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {searchTerm || selectedDay !== "all"
              ? "Try adjusting your search criteria or filters"
              : "No schedule data available for display"}
          </Typography>
        </Box>
      )}
    </Box>
  );
const tableContainerStyle = {
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  border: `1px solid ${colors.border}`,
  overflow: "hidden",
  background: colors.cardBackground,
  position: "relative",
};
const renderGridView = () => (
  <TableContainer 
    component={Paper} 
    sx={{ 
      borderRadius: "16px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
      border: `1px solid ${colors.border}`,
      background: colors.cardBackground,
      maxHeight: "70vh", // This controls the table height
      overflow: "auto",
    }}
  >
    <Table stickyHeader sx={{ minWidth: 800 }}>
      <TableHead>
        <TableRow>
          <TableCell style={headerCellStyle} sx={{ width: "80px" }}>
            S.No
          </TableCell>
          <TableCell style={nameHeaderCellStyle} sx={{ minWidth: "180px" }}>
            Student Name
          </TableCell>
          <TableCell style={headerCellStyle} sx={{ width: "150px", textAlign: "center" }}>
            Actions
          </TableCell>
          {days.map((day) => {
            const dayKey = day.toLowerCase();
            // Calculate number of classes for this day
            const dayClassCount = sortedData.reduce((count, student) => {
              const times = student[dayKey];
              if (times) {
                return count + times.split(',').length;
              }
              return count;
            }, 0);

            return (
              <TableCell key={day} style={headerCellStyle} sx={{ minWidth: "120px" }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="subtitle2" fontWeight="700">
                    {day}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)', 
                      borderRadius: '10px', 
                      px: 1, 
                      py: 0.5,
                      mt: 0.5,
                      fontSize: '0.7rem'
                    }}
                  >
                    {dayClassCount} class{dayClassCount !== 1 ? 'es' : ''}
                  </Typography>
                </Box>
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedData.map((student, index) => {
          const isRevision = student.studentType === "revision";
          const rowStyle = {
            backgroundColor: isRevision ? colors.revision : colors.regular,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: isRevision
                ? "rgba(255, 114, 111, 0.9)"
                : "rgba(119, 221, 119, 0.9)",
              transform: "translateY(-1px)",
            },
          };

          const isSelectedForSwap = selectedStudentForSwap === student.id;
          const highlightStyle = isSelectedForSwap
            ? {
                boxShadow: "0 0 0 3px #9b59b6",
                backgroundColor: isRevision
                  ? "rgba(255, 114, 111, 0.7)"
                  : "rgba(119, 221, 119, 0.7)",
              }
            : {};

          return (
            <TableRow key={student.id} sx={{ ...rowStyle, ...highlightStyle }}>
              <TableCell style={nameCellStyle}>
                <Chip
                  label={index + 1}
                  size="small"
                  sx={{
                    bgcolor: "white",
                    color: colors.text,
                    fontWeight: 700,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
              </TableCell>
              
              <TableCell style={nameCellStyle}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body1"
                    fontWeight="800"
                    color={isRevision ? "white" : "black"}
                  >
                    {student.name}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell style={baseCellStyle}>
                <Tooltip
                  title={
                    swapMode
                      ? isSelectedForSwap
                        ? "Select target student from dropdown"
                        : "Click to select as target for swap"
                      : "Swap schedule with another student"
                  }
                >
                  <Button
                    variant={isSelectedForSwap ? "contained" : "outlined"}
                    color="secondary"
                    size="small"
                    startIcon={<SwapHorizIcon />}
                    onClick={() => handleStudentSelectForSwap(student.id)}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      backgroundColor: isSelectedForSwap
                        ? "#4B0082"
                        : "transparent",
                      borderColor: isSelectedForSwap ? "#4B0082" : "#000080",
                      color: isSelectedForSwap ? "white" : "#000080",
                      "&:hover": {
                        backgroundColor: isSelectedForSwap
                          ? "#3A0069"
                          : "rgba(0, 0, 128, 0.1)",
                        borderColor: "#000080",
                      },
                    }}
                  >
                    {swapMode
                      ? isSelectedForSwap
                        ? "Selected"
                        : "Select"
                      : "Swap"}
                  </Button>
                </Tooltip>

                {isSelectedForSwap && (
                  <Box sx={{ mt: 1 }}>
                    <StudentSwapDropdown
                      studentId={student.id}
                      studentName={student.name}
                    />
                    {targetStudentForSwap && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={handleStudentSwap}
                        sx={{
                          mt: 1,
                          width: "100%",
                          backgroundColor: "#006400",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#004d00",
                          },
                        }}
                      >
                        Confirm Swap
                      </Button>
                    )}
                  </Box>
                )}
              </TableCell>

              {days.map((day) => {
                const dayKey = day.toLowerCase();
                const cellValue = student[dayKey];
                const isEditing =
                  editingCell?.studentId === student.id &&
                  editingCell?.day === dayKey;

                const cellStyle = isEditMode
                  ? clickableCellStyle
                  : baseCellStyle;

                return (
                  <TableCell
                    key={day}
                    sx={cellStyle}
                    onClick={() =>
                      handleEditClick(student.id, dayKey, cellValue)
                    }
                  >
                    {renderTimeSlots(cellValue)}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>

    {sortedData.length === 0 && (
      <Box sx={{ textAlign: "center", padding: "60px 20px" }}>
        <Box sx={{ fontSize: "64px", mb: 2, opacity: 0.3 }}>📚</Box>
        <Typography variant="h5" color="text.primary" gutterBottom>
          No students found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {searchTerm || selectedDay !== "all"
            ? "Try adjusting your search criteria or filters"
            : "No schedule data available for display"}
        </Typography>
      </Box>
    )}
  </TableContainer>
);
  // Update loading state to use safeClassSchedule.loading
  if (safeClassSchedule.loading) {
    return (
      <Box style={containerStyle}>
        <Box style={mainContainerStyle}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
            flexDirection="column"
            gap={3}
          >
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" color="text.secondary">
              Loading Schedule Data...
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // Update error handling to use safeClassSchedule.error
  if (safeClassSchedule.error) {
    return (
      <Box style={containerStyle}>
        <Box style={mainContainerStyle}>
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 3,
              "& .MuiAlert-message": { fontSize: "16px" },
            }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => dispatch(fetchClassSchedule())}
              >
                Retry
              </Button>
            }
          >
            <Typography variant="h6" gutterBottom>
              Error Loading Schedule
            </Typography>
            <Typography variant="body2">{safeClassSchedule.error}</Typography>
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box style={containerStyle}>
      <Box style={mainContainerStyle}>
        <Box style={controlsStyle}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            {/* Left side - Search */}
            <Grid item xs={12} md={6}>
              <TextField
                style={{ width: 350 }}
                placeholder="Search students by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    background: "white",
                  },
                }}
              />
            </Grid>

            {/* Right side - Controls */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                }}
              >
                {/* Day Filter */}
                <Select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  size="medium"
                  sx={{ borderRadius: 3, minWidth: 120 }}
                >
                  <MenuItem value="all">All Days</MenuItem>
                  {days.map((day) => (
                    <MenuItem key={day} value={day.toLowerCase()}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>

                {/* View Mode Toggle */}
                <Button
                  variant="outlined"
                  startIcon={
                    viewMode === "grid" ? <ListIcon /> : <GridViewIcon />
                  }
                  onClick={() =>
                    setViewMode(viewMode === "grid" ? "list" : "grid")
                  }
                  size="medium"
                  sx={{ borderRadius: 3 }}
                >
                  {viewMode === "grid" ? "List View" : "Grid View"}
                </Button>

                {/* Swap Mode Toggle */}
                <Button
                  variant={swapMode ? "contained" : "outlined"}
                  color="secondary"
                  startIcon={<SwapHorizIcon />}
                  onClick={() => {
                    setSwapMode(!swapMode);
                    setSelectedStudentForSwap(null);
                    setTargetStudentForSwap("");
                  }}
                  size="medium"
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    fontWeight: 600,
                    backgroundColor: swapMode
                      ? colors.swapButton
                      : "transparent",
                    "&:hover": {
                      backgroundColor: swapMode
                        ? "#8e44ad"
                        : "rgba(155, 89, 182, 0.1)",
                    },
                  }}
                >
                  {swapMode ? "Cancel Swap" : "Swap Schedules"}
                </Button>

                {/* Edit Mode Toggle */}
                <Button
                  variant={isEditMode ? "contained" : "outlined"}
                  color={isEditMode ? "success" : "primary"}
                  startIcon={isEditMode ? <CheckIcon /> : <EditIcon />}
                  onClick={() => setIsEditMode(!isEditMode)}
                  size="medium"
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    fontWeight: 600,
                  }}
                >
                  {isEditMode ? "Finish Editing" : "Edit Schedule"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Swap Mode Banner */}
        {swapMode && (
          <Alert
            severity="info"
            sx={{
              mb: 3,
              borderRadius: 3,
              "& .MuiAlert-message": {
                fontSize: "15px",
                fontWeight: 500,
              },
            }}
            icon={<SwapHorizIcon />}
          >
            <strong>Swap Mode Active</strong> - Click on a student's "Swap"
            button to select them, then choose another student from the dropdown
            to swap their complete schedules.
          </Alert>
        )}

        {/* Edit Mode Banner - Show update status */}
        {isEditMode && !swapMode && (
          <Alert
            severity="warning"
            sx={{
              mb: 3,
              borderRadius: 3,
              "& .MuiAlert-message": {
                fontSize: "15px",
                fontWeight: 500,
              },
            }}
            icon={<EditIcon />}
          >
            <strong>Edit Mode Active</strong> - Click on any time slot to add or
            modify class times. Use comma-separated values for multiple classes
            (e.g., "9am, 2pm").
          </Alert>
        )}

        {/* Show update loading state */}
        {safeClassSchedule.updating && (
          <Alert
            severity="info"
            sx={{
              mb: 2,
              borderRadius: 3,
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={16} />
              <Typography>Updating schedule...</Typography>
            </Box>
          </Alert>
        )}

        {/* Show update error */}
        {safeClassSchedule.updateError && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 3,
            }}
            onClose={() => {}} // You can add a clear error action if needed
          >
            <Typography>
              Update failed: {safeClassSchedule.updateError}
            </Typography>
          </Alert>
        )}

        {/* Render appropriate view */}
        {viewMode === "grid" ? renderGridView() : renderListView()}

        {/* Swap History Section */}
        {swapHistory.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Recent Schedule Swaps
            </Typography>
            <Box style={tableContainerStyle} sx={{ p: 3 }}>
              {swapHistory.map((swap) => (
                <Card key={swap.id} sx={{ mb: 2, p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <SwapHorizIcon color="secondary" />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" fontWeight="600">
                        {swap.sourceStudent} ↔ {swap.targetStudent}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {swap.timestamp}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedStudentForSwap(swap.sourceStudentId);
                        setTargetStudentForSwap(swap.targetStudentId);
                        setSwapMode(true);
                      }}
                    >
                      Redo Swap
                    </Button>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Edit Modal - Use safe access */}
      {editingCell && (
        <Box style={editModalStyle} onClick={handleCancel}>
          <Box
            style={editModalContentStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography variant="h5" gutterBottom fontWeight="600">
              Edit Schedule for{" "}
              {
                safeClassSchedule.data.find(
                  (s) => s.id === editingCell.studentId
                )?.Name
              }
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {getFullDayName(editingCell.day)}
            </Typography>

            <TextField
              fullWidth
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter times (e.g., 9am, 2pm, 5pm)"
              autoFocus
              sx={{ mb: 3, mt: 2 }}
              helperText="Separate multiple times with commas"
            />

            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                fullWidth
                size="large"
                sx={{ borderRadius: 2, py: 1.5 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                fullWidth
                color="success"
                size="large"
                disabled={safeClassSchedule.updating}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  background: `linear-gradient(135deg, ${colors.saveButton}, #219a52)`,
                  "&:hover": {
                    background: `linear-gradient(135deg, #219a52, #1e7e44)`,
                  },
                }}
              >
                {safeClassSchedule.updating ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ClassSchedule;
