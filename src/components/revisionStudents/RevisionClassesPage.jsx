// src/components/RevisionClassesPage.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  CircularProgress,
  Alert,
  FormControl,
  Select,
  MenuItem,
  Button as MuiButton,
  Chip,
  Tooltip,
  Avatar,
  Card,
  CardContent,
} from "@mui/material";
import { Save, Person, Schedule, Subject } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import {
  fetchRevisionClasses,
  updateClassAttendance,
} from "../../redux/actions";
// Styled Components with professional styling
const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  overflow: "hidden",
}));

const StatusBadge = styled(Chip)(({ status }) => ({
  fontWeight: 600,
  fontSize: "0.75rem",
  minWidth: "70px",
  backgroundColor: 
    status === "Present" ? "#10b981" :
    status === "Absent" ? "#ef4444" :
    status === "Late" ? "#f59e0b" : "#6b7280",
  color: "white",
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#1e293b",
  color: "white",
  fontWeight: 700,
  fontSize: "0.875rem",
  borderRight: "1px solid #334155",
  "&:last-child": {
    borderRight: "none",
  },
}));

const StudentRow = styled(TableRow)(({ iseven, islast }) => ({
  backgroundColor: iseven ? "#f8fafc" : "white",
  borderBottom: islast ? "2px solid #e2e8f0" : "1px solid #f1f5f9",
  "&:hover": {
    backgroundColor: "#f1f5f9",
    transform: "translateY(-1px)",
    transition: "all 0.2s ease",
  },
}));

const ClassHeaderRow = styled(TableRow)(({ isexam }) => ({
  backgroundColor: isexam ? "#fffbeb" : "#1e40af",
  color: isexam ? "#92400e" : "white",
  "& td": {
    borderBottom: isexam ? "2px solid #fbbf24" : "2px solid #3730a3",
    fontWeight: 700,
  },
}));

// Constants
const ATTENDANCE_STATUSES = ["Present", "Absent", "Late"];
const CURRENT_SUBJECT = "Physics";

const RevisionClassesPage = () => {
  const [attendanceData, setAttendanceData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ text: "", severity: "info" });

  const dispatch = useDispatch();
  const { classes, loading, error } = useSelector((state) => state.classSchedule);
  const { students: allStudents } = useSelector((state) => state.students);

  // Filter and transform revision students
  const revisionStudents = allStudents
    .filter((student) => student.isRevisionProgramJEEMains2026Student === true)
    .filter((student) => student.Subject === CURRENT_SUBJECT || student.Subject === "All")
    .map((student) => ({
      ...student,
      track: student.Year?.toLowerCase().includes("1st year") || student.Year?.toLowerCase().includes("12th class") 
        ? "Track 1" 
        : student.Year?.toLowerCase().includes("2nd year") || student.Year?.toLowerCase().includes("13th class")
        ? "Track 2"
        : "N/A",
      studentName: student.Name,
    }))
    .sort((a, b) => a.studentName.localeCompare(b.studentName));

  // Filter students for each class
  const getStudentsForClass = useCallback((classData) => {
    const requiredTrack = classData.track?.toLowerCase().replace(/[()]/g, "").trim() || "";
    
    return revisionStudents.filter((student) => {
      const studentTrack = student.track?.toLowerCase().replace(/[()]/g, "").trim() || "";

      if (requiredTrack.includes("all tracks") || requiredTrack === "all" || requiredTrack.includes("&")) {
        return true;
      }

      return requiredTrack.includes(studentTrack) || studentTrack.includes(requiredTrack);
    });
  }, [revisionStudents]);

  // Initialize attendance data
  useEffect(() => {
    if (classes.length > 0 && revisionStudents.length > 0) {
      const initialAttendance = {};
      
      classes.forEach((classItem) => {
        if (classItem.subject !== CURRENT_SUBJECT && classItem.subject !== 'All') return;

        const classStudents = getStudentsForClass(classItem);
        classStudents.forEach((student) => {
          const key = `${classItem.id}_${student.id}`;
          const existingAttendance = classItem.attendance?.find(att => att.studentId === student.id);
          initialAttendance[key] = existingAttendance?.status || "Absent";
        });
      });
      
      setAttendanceData(initialAttendance);
    }
  }, [classes, revisionStudents, getStudentsForClass]);

  const handleAttendanceChange = (classId, studentId, status) => {
    const key = `${classId}_${studentId}`;
    setAttendanceData(prev => ({ ...prev, [key]: status }));
    setSaveMessage({ text: "", severity: "info" });
  };

  const handleSaveAllAttendance = async () => {
    setIsSaving(true);
    setSaveMessage({ text: "Saving all attendance records...", severity: "info" });

    try {
      const classAttendanceMap = {};
      Object.keys(attendanceData).forEach((key) => {
        const [classId, studentId] = key.split("_");
        const classItem = classes.find(c => c.id === classId);
        if (classItem && (classItem.subject === CURRENT_SUBJECT || classItem.subject === 'All')) {
          if (!classAttendanceMap[classId]) classAttendanceMap[classId] = [];
          classAttendanceMap[classId].push({ studentId, status: attendanceData[key] });
        }
      });

      const savePromises = Object.keys(classAttendanceMap).map(classId =>
        dispatch(updateClassAttendance(classId, classAttendanceMap[classId]))
      );

      await Promise.all(savePromises);
      setSaveMessage({ text: "✅ All attendance records saved successfully!", severity: "success" });
    } catch (error) {
      setSaveMessage({ text: `❌ Failed to save: ${error.message}`, severity: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    dispatch(fetchRevisionClasses(CURRENT_SUBJECT));
  }, [dispatch]);

  // Calculate class statistics
  const getClassStats = (classItem) => {
    const classStudents = getStudentsForClass(classItem);
    const presentCount = classStudents.filter(student => 
      attendanceData[`${classItem.id}_${student.id}`] === "Present"
    ).length;
    
    return { total: classStudents.length, present: presentCount, absent: classStudents.length - presentCount };
  };

  // Group classes by date for better organization
  const groupedClasses = classes
    .filter(classData => classData.subject === CURRENT_SUBJECT || classData.subject === "All")
    .reduce((acc, classItem) => {
      const date = classItem.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(classItem);
      return acc;
    }, {});

  return (
    <StyledPaper sx={{ p: 3, mt: 3 }}>


      {saveMessage.text && (
        <Alert severity={saveMessage.severity} sx={{ mb: 3, borderRadius: "8px" }}>
          {saveMessage.text}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
          <CircularProgress size={60} sx={{ color: "#1e40af" }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: "8px" }}>
          Error loading classes: {error}
        </Alert>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ 
          border: "1px solid #e2e8f0", 
          borderRadius: "8px",
          maxHeight: '75vh',
          background: "white"
        }}>
          <Table stickyHeader aria-label="attendance-table" sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <HeaderCell sx={{ width: "120px", textAlign: "center" }}>Date & Day</HeaderCell>
                <HeaderCell sx={{ width: "100px" }}>Class Track</HeaderCell>
                <HeaderCell sx={{ width: "250px" }}>Lesson/Topic</HeaderCell>
                <HeaderCell sx={{ width: "200px" }}>Student</HeaderCell>
                <HeaderCell sx={{ width: "100px" }}>Track</HeaderCell>
                <HeaderCell sx={{ width: "150px" }}>Attendance</HeaderCell>
                <HeaderCell sx={{ width: "100px", textAlign: "center" }}>Status</HeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(groupedClasses).length > 0 ? (
                Object.entries(groupedClasses).map(([date, dayClasses]) =>
                  dayClasses.map((classItem, classIndex) => {
                    const classStudents = getStudentsForClass(classItem);
                    const stats = getClassStats(classItem);
                    const isExamClass = classItem.subject === 'All';

                    return (
                      <React.Fragment key={classItem.id}>
                        {/* Class Header Row */}

                        {/* Lesson Info Row */}
                        {/* Student Rows */}
                        {classStudents.length > 0 ? (
                          classStudents.map((student, studentIndex) => {
                            const attendanceKey = `${classItem.id}_${student.id}`;
                            const currentStatus = attendanceData[attendanceKey] || "Absent";
                            const isEven = studentIndex % 2 === 0;
                            const isLast = studentIndex === classStudents.length - 1;

                            return (
                              <StudentRow 
                                key={`${classItem.id}_${student.id}`} 
                                iseven={isEven}
                                islast={isLast}
                              >
                                <TableCell sx={{ textAlign: "center", color: "#64748b", fontWeight: 500 }}>
                                  {studentIndex === 0 && (
                                    <Box>
                                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                                        {classItem.date}
                                      </Typography>
                                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                                        {classItem.day}
                                      </Typography>
                                    </Box>
                                  )}
                                </TableCell>
                                <TableCell sx={{ color: "#475569", fontWeight: 500 }}>
                                  {studentIndex === 0 && classItem.track}
                                </TableCell>
                                <TableCell sx={{ color: "#475569", fontWeight: 500 }}>
                                  {studentIndex === 0 && (
                                    <Tooltip title={classItem.lesson}>
                                      <Typography variant="body2" sx={{ 
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        maxWidth: "200px"
                                      }}>
                                        {classItem.lesson}
                                      </Typography>
                                    </Tooltip>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Avatar sx={{ 
                                      width: 32, 
                                      height: 32, 
                                      bgcolor: isEven ? "#1e40af" : "#64748b",
                                      fontSize: "0.875rem",
                                      fontWeight: 600
                                    }}>
                                      {student.studentName.split(' ').map(n => n[0]).join('')}
                                    </Avatar>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                                      {student.studentName}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Chip 
                                    label={student.track} 
                                    size="small"
                                    variant="outlined"
                                    sx={{ 
                                      borderColor: student.track === "Track 1" ? "#3b82f6" : "#8b5cf6",
                                      color: student.track === "Track 1" ? "#3b82f6" : "#8b5cf6",
                                      fontWeight: 600
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <Select
                                      value={currentStatus}
                                      onChange={(e) => handleAttendanceChange(classItem.id, student.id, e.target.value)}
                                      sx={{
                                        borderRadius: "6px",
                                        fontWeight: 600,
                                        "& .MuiSelect-select": {
                                          py: 0.75
                                        }
                                      }}
                                    >
                                      {ATTENDANCE_STATUSES.map((status) => (
                                        <MenuItem key={status} value={status} sx={{ fontWeight: 600 }}>
                                          {status}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  <StatusBadge status={currentStatus} />
                                </TableCell>
                              </StudentRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} sx={{ py: 3, textAlign: "center", color: "#64748b" }}>
                              <Typography variant="body1">
                                No students enrolled for this class
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={7} sx={{ py: 6, textAlign: "center" }}>
                    <Typography variant="h6" sx={{ color: "#64748b", mb: 1 }}>
                      No classes scheduled
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                      There are no classes scheduled for {CURRENT_SUBJECT} in the selected period.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </StyledPaper>
  );
};

export default RevisionClassesPage;