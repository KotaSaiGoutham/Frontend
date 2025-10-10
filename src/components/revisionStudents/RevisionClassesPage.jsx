import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Chip,
  Tooltip,
  IconButton,
  Fade,
  Button,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Refresh,
  Book,
  CalendarToday,
  NavigateBefore,
  NavigateNext,
  Edit,
  Check,
  Close,
} from "@mui/icons-material";
import {
  fetchRevisionClasses,
  updateStudentAttendance,
  addStudentExam,
  updateStudentExam,
} from "../../redux/actions";

// --- Styled Components ---

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  overflow: "hidden",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)",
  },
}));

const PaginationButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  color: "white",
  fontWeight: 600,
  padding: "10px 20px",
  borderRadius: "8px",
  "&:hover": {
    background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
  },
  "&:disabled": {
    background: "#cbd5e1",
    color: "#64748b",
    transform: "none",
    boxShadow: "none",
  },
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
  color: "white",
  fontWeight: 700,
  fontSize: "0.875rem",
  borderRight: "1px solid #475569",
  padding: "12px 8px",
  "&:first-of-type": {
    borderTopLeftRadius: "8px",
  },
  "&:last-child": {
    borderTopRightRadius: "8px",
    borderRight: "none",
  },
}));

// Different row styles for different types
const StudentRow = styled(TableRow)(({ istoday, rowtype }) => ({
  backgroundColor: istoday
    ? rowtype === "exam"
      ? "#fff3cd"
      : rowtype === "revision"
      ? "#f8f9fa"
      : "#ecfdf5"
    : rowtype === "exam"
    ? "#fff"
    : rowtype === "revision"
    ? "#f8f9fa"
    : "transparent",
  borderLeft: istoday ? "4px solid #3b82f6" : "none",
  borderBottom: "1px solid #f1f5f9",
  transition: "all 0.3s ease-in-out",
  animation:
    istoday && rowtype !== "revision"
      ? "pulseHighlight 2s ease-in-out infinite"
      : "none",
  "&:hover": {
    backgroundColor: istoday
      ? rowtype === "exam"
        ? "#ffeaa7"
        : rowtype === "revision"
        ? "#e9ecef"
        : "#bfdbfe"
      : rowtype === "exam"
      ? "#f8f9fa"
      : rowtype === "revision"
      ? "#e9ecef"
      : "#f8fafc",
  },
  "@keyframes pulseHighlight": {
    "0%": {
      boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.3)",
    },
    "70%": {
      boxShadow: "0 0 0 6px rgba(59, 130, 246, 0)",
    },
    "100%": {
      boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)",
    },
  },
}));

// Disabled row for revision dates
const DisabledRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#f8f9fa",
  opacity: 0.6,
  borderBottom: "1px solid #e9ecef",
  "& td": {
    color: "#6c757d",
  },
}));

const ATTENDANCE_STATUSES = ["Present", "Absent", "Late"];
const colorMap = {
  Present: "#10b981",
  Absent: "#ef4444",
  Late: "#f59e0b",
};

const RevisionClassesPage = () => {
  const [savingState, setSavingState] = useState({});
  const [saveMessage, setSaveMessage] = useState({
    text: "",
    severity: "info",
  });
  const [examDialogOpen, setExamDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [studentExamStatus, setStudentExamStatus] = useState({});

  const dispatch = useDispatch();
  const {
    classes,
    loading,
    error,
    hasMore,
    hasPrevious: hasPreviousFromRedux,
    nextCursor,
    prevCursor,
  } = useSelector((state) => state.classSchedule);

  const { students: allStudents } = useSelector((state) => state.students);
  const { user } = useSelector((state) => state.auth);

  // Get today's date in DD.MM.YYYY format
  const getTodayDate = useCallback(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}.${month}.${year}`;
  }, []);

  const todayDate = getTodayDate();

  // Memoize revision students calculation
  const revisionStudents = useMemo(() => {
    return allStudents
      .filter(
        (student) => student.isRevisionProgramJEEMains2026Student === true
      )
      .map((student) => ({
        ...student,
        track:
          student.Year?.toLowerCase().includes("1st year") ||
          student.Year?.toLowerCase().includes("12th class")
            ? "Track 1"
            : "Track 2",
        studentName: student.Name,
        initials: student.Name.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
      }))
      .sort((a, b) => a.studentName.localeCompare(b.studentName));
  }, [allStudents]);

  // Get attendance status from Redux state
  const getAttendanceStatus = useCallback(
    (classId, studentId) => {
      const classItem = classes.find((c) => c.id === classId);
      if (!classItem || !classItem.attendance) return "";
      const attendance = classItem.attendance.find(
        (a) => a.studentId === studentId
      );
      return attendance?.status || "";
    },
    [classes]
  );

  const getExamStatus = useCallback(
    (classItem, studentId) => {
      if (!classItem.isExam) return null;
      const status = studentExamStatus[`${classItem.id}_${studentId}`];

      // FIX: Ensure we return a string or null, never an object
      if (typeof status === "object") {
        console.error("Invalid exam status object:", status);
        return null;
      }

      return status || null;
    },
    [studentExamStatus]
  );

  // Memoize students for each class
  const getStudentsForClass = useCallback(
    (classData) => {
      const isTrack1 = classData.track1;
      const isTrack2 = classData.track2;

      return revisionStudents.filter((student) => {
        const studentTrack = student.track;
        if (isTrack1 && isTrack2) return true;
        if (isTrack1 && studentTrack === "Track 1") return true;
        if (isTrack2 && studentTrack === "Track 2") return true;
        return false;
      });
    },
    [revisionStudents]
  );

  // Attendance change handler
  const handleAttendanceChange = async (classId, studentId, newStatus) => {
    const cellKey = `${classId}_${studentId}`;
    const classItem = classes.find((c) => c.id === classId);
    if (!classItem) return;

    const oldStatus = getAttendanceStatus(classId, studentId);
    if (oldStatus === newStatus) return;

    try {
      setSavingState((prev) => ({ ...prev, [cellKey]: true }));
      setSaveMessage({ text: "", severity: "info" });

      await dispatch(updateStudentAttendance(classId, studentId, newStatus));

      const studentName = revisionStudents.find(
        (s) => s.id === studentId
      )?.studentName;
      setSaveMessage({
        text: `${studentName} marked ${newStatus}`,
        severity: "success",
      });

      setTimeout(() => setSaveMessage({ text: "", severity: "info" }), 2000);
    } catch (error) {
      console.error("Error updating attendance:", error);
      setSaveMessage({
        text: `Failed to update attendance: ${error.message}`,
        severity: "error",
      });
      setTimeout(() => setSaveMessage({ text: "", severity: "info" }), 4000);
    } finally {
      setTimeout(() => {
        setSavingState((prev) => {
          const newState = { ...prev };
          delete newState[cellKey];
          return newState;
        });
      }, 500);
    }
  };

  const handleExamStatusChange = async (classItem, studentId, status) => {
    const examKey = `${classItem.id}_${studentId}`;

    const examData = {
      studentId: studentId,
      studentName:
        revisionStudents.find((s) => s.id === studentId)?.studentName ||
        "Unknown Student",
      examDate: new Date(
        classItem.date.split(".").reverse().join("-")
      ).toISOString(),
      examName: classItem.exam || "Revision Exam",
      status: status,
      topic: [classItem.topic || classItem.exam || "General"],
      testType: getTestTypeFromExam(classItem.exam),
      isRevisionProgramJEEMains2026Student: true,
      Subject: user?.isPhysics
        ? "Physics"
        : user?.isChemistry
        ? "Chemistry"
        : "General",
    };

    try {
      if (status === "Present") {
        await dispatch(addStudentExam(examData));
      }

      // Update local state
      setStudentExamStatus((prev) => ({
        ...prev,
        [examKey]: status,
      }));

      setSaveMessage({
        text: `Exam status updated to ${status}`,
        severity: "success",
      });
      setTimeout(() => setSaveMessage({ text: "", severity: "info" }), 2000);
    } catch (error) {
      console.error("Error updating exam status:", error);

      // FIX: Make sure we're not trying to render the error object
      const errorMessage = error?.message || "Failed to update exam status";

      setSaveMessage({
        text: errorMessage, // Use string, not error object
        severity: "error",
      });
      setTimeout(() => setSaveMessage({ text: "", severity: "info" }), 4000);
    }
  };

  // Helper function to determine test type from exam name
  const getTestTypeFromExam = (examName) => {
    if (!examName) return [];
    if (examName.includes("Weekend")) return ["weekendTest"];
    if (examName.includes("Cumulative")) return ["cumulativeTest"];
    if (examName.includes("Grand")) return ["grandTest"];
    return [];
  };

  // Open exam dialog
  const handleOpenExamDialog = (classItem) => {
    setSelectedExam(classItem);
    setExamDialogOpen(true);
  };

  // Close exam dialog
  const handleCloseExamDialog = () => {
    setExamDialogOpen(false);
    setSelectedExam(null);
  };

  // Pagination handlers
  const handleNextClasses = async () => {
    if (loading || classes.length === 0 || !hasMore || !nextCursor) return;
    await dispatch(
      fetchRevisionClasses({ cursorDate: nextCursor, direction: "next" })
    );
  };

  const handlePreviousClasses = async () => {
    if (loading || classes.length === 0 || !hasPreviousFromRedux || !prevCursor)
      return;
    await dispatch(
      fetchRevisionClasses({ cursorDate: prevCursor, direction: "prev" })
    );
  };

  // Refresh classes
  const handleRefresh = async () => {
    await dispatch(fetchRevisionClasses());
  };

  // Flatten classes for rendering
  const flattenedClasses = useMemo(() => {
    return classes.flatMap((classItem) => {
      const classStudents = getStudentsForClass(classItem);
      return classStudents.length > 0 ? [classItem] : [];
    });
  }, [classes, getStudentsForClass]);

  // Fetch initial classes on mount
  useEffect(() => {
    if (classes.length === 0 && !loading) {
      handleRefresh();
    }
  }, [dispatch]);

  // Determine row type and content
  const getRowTypeAndContent = (classItem) => {
    if (classItem.isExam) {
      return {
        type: "exam",
        content: classItem.exam,
        color: "#fff3cd",
        badgeColor: "linear-gradient(135deg, #ffc107, #ff8f00)",
      };
    } else if (classItem.revisionDate) {
      return {
        type: "revision",
        content: "Revision Day",
        color: "#f8f9fa",
        badgeColor: "linear-gradient(135deg, #6c757d, #495057)",
      };
    } else {
      return {
        type: "class",
        content: classItem.topic,
        color: "transparent",
        badgeColor:
          classItem.track1 && classItem.track2
            ? "linear-gradient(135deg, #3b82f6, #8b5cf6)"
            : classItem.track1
            ? "linear-gradient(135deg, #10b981, #059669)"
            : "linear-gradient(135deg, #f59e0b, #d97706)",
      };
    }
  };

  return (
    <Fade in timeout={800}>
      <StyledPaper sx={{ p: 3, mt: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}
            >
              Revision Classes & Exams
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b" }}>
              Today: {todayDate}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Tooltip title="Refresh to Current Classes" arrow>
              <IconButton
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  background: "#f1f5f9",
                  "&:hover": { background: "#e2e8f0" },
                }}
              >
                <Refresh color="action" />
              </IconButton>
            </Tooltip>
            <PaginationButton
              onClick={handlePreviousClasses}
              disabled={loading || !hasPreviousFromRedux}
              startIcon={<NavigateBefore />}
            >
              Previous
            </PaginationButton>
            <PaginationButton
              onClick={handleNextClasses}
              disabled={loading || !hasMore}
              endIcon={<NavigateNext />}
            >
              Next
            </PaginationButton>
          </Box>
        </Box>

        {/* Status Messages */}
        {saveMessage.text && (
          <Alert
            severity={saveMessage.severity}
            sx={{ mb: 2, borderRadius: "8px" }}
          >
            {saveMessage.text}
          </Alert>
        )}

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CircularProgress size={60} sx={{ color: "#3b82f6" }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: "8px" }}>
            Error loading classes: {error}
          </Alert>
        ) : (
          <>
            <TableContainer
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                background: "white",
                overflow: "auto",
                mb: 2,
              }}
            >
              <Table
                stickyHeader
                aria-label="attendance-table"
                sx={{ minWidth: 1200 }}
              >
                <TableHead>
                  <TableRow>
                    <HeaderCell sx={{ width: "140px", textAlign: "center" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <CalendarToday sx={{ fontSize: 18 }} />
                        Date & Day
                      </Box>
                    </HeaderCell>
                    <HeaderCell sx={{ width: "400px" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Book sx={{ fontSize: 18 }} />
                        Lesson/Topic/Exam
                      </Box>
                    </HeaderCell>
                    {revisionStudents.map((student) => (
                      <HeaderCell
                        key={student.id}
                        sx={{
                          width: "120px",
                          textAlign: "center",
                          minWidth: "120px",
                        }}
                      >
                        <Tooltip title={student.studentName} arrow>
                          <Box sx={{ p: 0.5 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                padding: "6px 8px",
                                background: "rgba(59, 130, 246, 0.1)",
                                borderRadius: "8px",
                                border: "1px solid rgba(59, 130, 246, 0.2)",
                              }}
                            >
                              <Box
                                sx={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: "6px",
                                  background:
                                    "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  fontWeight: 700,
                                  fontSize: "0.75rem",
                                  flexShrink: 0,
                                }}
                              >
                                {student.initials}
                              </Box>
                              <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontWeight: 600,
                                    color: "white",
                                    display: "block",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    fontSize: "0.75rem",
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {student.studentName.split(" ")[0]}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Tooltip>
                      </HeaderCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {flattenedClasses.length > 0 ? (
                    flattenedClasses.map((classItem) => {
                      const isToday = classItem.date === todayDate;
                      const rowInfo = getRowTypeAndContent(classItem);

                      // For revision dates, show disabled row
                      if (classItem.revisionDate) {
                        return (
                          <DisabledRow key={classItem.id}>
                            <TableCell
                              sx={{
                                textAlign: "center",
                                color: "#6c757d",
                                fontWeight: 500,
                                borderRight: "1px solid #e9ecef",
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 700,
                                    color: "#6c757d",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  {classItem.date}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#6c757d", fontWeight: 400 }}
                                >
                                  {classItem.dayOfWeek}
                                  {isToday && " • Today"}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#6c757d",
                                fontWeight: 600,
                                borderRight: "1px solid #e9ecef",
                                fontSize: "0.9rem",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography variant="body2">
                                  Revision Day
                                </Typography>
                                <Chip
                                  label="Revision"
                                  size="small"
                                  sx={{
                                    background: rowInfo.badgeColor,
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: "0.65rem",
                                    height: "20px",
                                  }}
                                />
                              </Box>
                            </TableCell>
                            {revisionStudents.map((student) => (
                              <TableCell
                                key={student.id}
                                sx={{
                                  textAlign: "center",
                                  padding: "8px 4px",
                                  borderRight: "1px solid #e9ecef",
                                  color: "#6c757d",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{ fontStyle: "italic" }}
                                >
                                  No Attendance
                                </Typography>
                              </TableCell>
                            ))}
                          </DisabledRow>
                        );
                      }

                      // For regular classes and exams
                      return (
                        <StudentRow
                          key={classItem.id}
                          istoday={isToday}
                          rowtype={rowInfo.type}
                        >
                          {/* Date & Day Cell */}
                          <TableCell
                            sx={{
                              textAlign: "center",
                              color: isToday ? "#60a5fa" : "#64748b",
                              fontWeight: isToday ? 700 : 500,
                              borderRight: "1px solid #f1f5f9",
                            }}
                          >
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 700,
                                  color: isToday ? "#1e40af" : "#1e293b",
                                  fontSize: "0.9rem",
                                }}
                              >
                                {classItem.date}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: isToday ? "#1e40af" : "#64748b",
                                  fontWeight: isToday ? 600 : 400,
                                }}
                              >
                                {classItem.dayOfWeek}
                                {isToday && " • Today"}
                              </Typography>
                            </Box>
                          </TableCell>

                          {/* Content Cell */}
                          <TableCell
                            sx={{
                              color: "#475569",
                              fontWeight: 600,
                              borderRight: "1px solid #f1f5f9",
                              fontSize: "0.9rem",
                              background: rowInfo.color,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography variant="body2">
                                {rowInfo.content}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                {classItem.isExam && (
                                  <Tooltip title="Edit Exam Details">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleOpenExamDialog(classItem)
                                      }
                                      sx={{ color: "#ffc107" }}
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                <Chip
                                  label={
                                    classItem.isExam
                                      ? "Exam"
                                      : classItem.track1 && classItem.track2
                                      ? "Both"
                                      : classItem.track1
                                      ? "1st Year"
                                      : "2nd Year"
                                  }
                                  size="small"
                                  sx={{
                                    background: rowInfo.badgeColor,
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: "0.65rem",
                                    height: "20px",
                                  }}
                                />
                              </Box>
                            </Box>
                          </TableCell>

                          {/* Student Cells */}
                          {revisionStudents.map((student) => {
                            const cellKey = `${classItem.id}_${student.id}`;
                            const isSaving = savingState[cellKey];

                            // For exam dates, show exam status controls
                            if (classItem.isExam) {
                              const examStatus = getExamStatus(
                                classItem,
                                student.id
                              );
                              return (
                                <TableCell
                                  key={student.id}
                                  sx={{
                                    textAlign: "center",
                                    padding: "8px 4px",
                                    borderRight: "1px solid #f1f5f9",
                                    position: "relative",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Tooltip title="Mark Present">
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleExamStatusChange(
                                            classItem,
                                            student.id,
                                            "Present"
                                          )
                                        }
                                        sx={{
                                          color:
                                            examStatus === "Present"
                                              ? "#10b981"
                                              : "#ccc",
                                        }}
                                      >
                                        <Check />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Mark Absent">
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleExamStatusChange(
                                            classItem,
                                            student.id,
                                            "Absent"
                                          )
                                        }
                                        sx={{
                                          color:
                                            examStatus === "Absent"
                                              ? "#ef4444"
                                              : "#ccc",
                                        }}
                                      >
                                        <Close />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                  {examStatus && (
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        display: "block",
                                        mt: 0.5,
                                        fontWeight: 600,
                                        color:
                                          examStatus === "Present"
                                            ? "#10b981"
                                            : "#ef4444",
                                      }}
                                    >
                                      {/* FIX: Ensure examStatus is always a string */}
                                      {typeof examStatus === "string"
                                        ? examStatus
                                        : String(examStatus)}
                                    </Typography>
                                  )}
                                </TableCell>
                              );
                            }

                            // For regular classes, show attendance dropdown
                            const currentStatus = getAttendanceStatus(
                              classItem.id,
                              student.id
                            );
                            return (
                              <TableCell
                                key={student.id}
                                sx={{
                                  textAlign: "center",
                                  padding: "8px 4px",
                                  borderRight: "1px solid #f1f5f9",
                                  position: "relative",
                                }}
                              >
                                <FormControl
                                  size="small"
                                  sx={{ width: "100%", minWidth: "120px" }}
                                >
                                  <Select
                                    value={currentStatus}
                                    onChange={(e) =>
                                      handleAttendanceChange(
                                        classItem.id,
                                        student.id,
                                        e.target.value
                                      )
                                    }
                                    disabled={isSaving}
                                    sx={{
                                      borderRadius: "8px",
                                      fontWeight: 600,
                                      width: "100%",
                                      "& .MuiSelect-select": {
                                        padding: "8px 12px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      },
                                      ...(currentStatus === "Present" && {
                                        background: "rgba(16, 185, 129, 0.1)",
                                        color: "#065f46",
                                      }),
                                      ...(currentStatus === "Absent" && {
                                        background: "rgba(239, 68, 68, 0.1)",
                                        color: "#7f1d1d",
                                      }),
                                      ...(currentStatus === "Late" && {
                                        background: "rgba(245, 158, 11, 0.1)",
                                        color: "#78350f",
                                      }),
                                    }}
                                  >
                                    {ATTENDANCE_STATUSES.map((status) => (
                                      <MenuItem
                                        key={status}
                                        value={status}
                                        sx={{
                                          fontWeight: 600,
                                          color: colorMap[status],
                                          justifyContent: "center",
                                          padding: "8px 16px",
                                        }}
                                      >
                                        {status}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                                {isSaving && (
                                  <Box
                                    sx={{
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      transform: "translate(-50%, -50%)",
                                    }}
                                  >
                                    <CircularProgress
                                      size={20}
                                      sx={{ color: colorMap[currentStatus] }}
                                    />
                                  </Box>
                                )}
                              </TableCell>
                            );
                          })}
                        </StudentRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={2 + revisionStudents.length}
                        sx={{ py: 6, textAlign: "center" }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ color: "#64748b", mb: 1 }}
                        >
                          No classes scheduled
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                          There are no classes scheduled in the selected period.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Exam Details Dialog */}
        <Dialog
          open={examDialogOpen}
          onClose={handleCloseExamDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Exam Details</DialogTitle>
          <DialogContent>
            {selectedExam && (
              <Box sx={{ pt: 2 }}>
                <TextField
                  fullWidth
                  label="Exam Name"
                  value={selectedExam.exam || ""}
                  margin="dense"
                  disabled
                />
                <TextField
                  fullWidth
                  label="Date"
                  value={selectedExam.date}
                  margin="dense"
                  disabled
                />
                <TextField
                  fullWidth
                  label="Day"
                  value={selectedExam.dayOfWeek}
                  margin="dense"
                  disabled
                />
                {/* Add more exam details fields as needed */}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseExamDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </StyledPaper>
    </Fade>
  );
};

export default RevisionClassesPage;
