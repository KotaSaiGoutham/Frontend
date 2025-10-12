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
  Comment,
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

// Track-based highlighting components with better colors
const Track1Highlight = styled(Box)({
  background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)",
  borderLeft: "4px solid #3b82f6",
  padding: "8px 12px",
  borderRadius: "8px",
  width: "100%",
  border: "1px solid #dbeafe",
});
const StudentBadge = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #fef3c7, #fffbeb)",
  border: "1px solid #f59e0b",
  borderRadius: "6px",
  padding: "4px 2px",
  textAlign: "center",
}));
const Track2Highlight = styled(Box)({
  background: "linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)",
  borderLeft: "4px solid #f59e0b",
  padding: "8px 12px",
  borderRadius: "8px",
  width: "100%",
  border: "1px solid #fef3c7",
});

const BothTracksHighlight = styled(Box)({
  background: "linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)",
  borderLeft: "4px solid #8b5cf6",
  padding: "8px 12px",
  borderRadius: "8px",
  width: "100%",
  border: "1px solid #e0e7ff",
});

const PaginationButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  color: "white",
  fontWeight: 600,
  padding: "8px 16px",
  borderRadius: "8px",
  fontSize: "0.8rem",
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
  fontSize: "0.75rem",
  borderRight: "1px solid #475569",
  padding: "8px 4px",
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

// Updated attendance statuses with short codes
const ATTENDANCE_STATUSES = [
  { value: "Present", label: "Present", color: "#10b981" },
  {
    value: "Absent",
    label: "Absent",
    fullLabel: "Student Absent",
    color: "#ef4444",
  },
  { value: "Late", label: "Late", color: "#f59e0b" },
  { value: "TutorAbsent", label: "TutorAbsent", color: "#6b7280" },
  { value: "Cancelled", label: "Cancelled", color: "#8b5cf6" },
  { value: "Rescheduled", label: "Rescheduled", color: "#06b6d4" },
];

const colorMap = {
  Present: "#10b981",
  Absent: "#ef4444",
  Late: "#f59e0b",
  TutorAbsent: "#6b7280",
  Cancelled: "#8b5cf6",
  Rescheduled: "#06b6d4",
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
  const [editingExam, setEditingExam] = useState({});
  const [examMarks, setExamMarks] = useState({});
  const [examData, setExamData] = useState({});
  const [remarks, setRemarks] = useState({});
  const [remarksDialog, setRemarksDialog] = useState({
    open: false,
    classId: null,
    studentId: null,
    currentRemarks: "",
  });

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

  const revisionStudents = useMemo(() => {
    // Get all revision students from both subjects
    const allRevisionStudents = allStudents.filter(
      (student) => student.isRevisionProgramJEEMains2026Student === true
    );

    // Common student names (these students take both Physics and Chemistry)
    const commonStudentNames = [
      "Gagan",
      "Amal",
      "Sriya Jee",
      "Sriya.JEE",
      "Ananya",
    ];

    // Physics-only student names
    const physicsOnlyNames = ["Nithya", "Navya"];

    // Filter students based on user role
    let filteredStudents = allRevisionStudents.filter((student) => {
      const studentName = student.Name || student.studentName || "";

      if (user?.isPhysics) {
        // Physics users see common students + physics-only students
        return (
          commonStudentNames.some((name) =>
            studentName.toLowerCase().includes(name.toLowerCase())
          ) ||
          physicsOnlyNames.some((name) =>
            studentName.toLowerCase().includes(name.toLowerCase())
          )
        );
      } else if (user?.isChemistry) {
        // Chemistry users only see common students
        return commonStudentNames.some((name) =>
          studentName.toLowerCase().includes(name.toLowerCase())
        );
      }
      return false;
    });

    // Map and sort students with consistent naming
    return filteredStudents
      .map((student) => {
        const studentName = student.Name || student.studentName || "";
        let normalizedName = studentName;

        // Normalize names for consistent display
        if (studentName.toLowerCase().includes("sriya")) {
          normalizedName = "Sriya JEE";
        }

        const isCommonStudent = commonStudentNames.some((name) =>
          studentName.toLowerCase().includes(name.toLowerCase())
        );

        return {
          ...student,
          track:
            student.Year?.toLowerCase().includes("1st year") ||
            student.Year?.toLowerCase().includes("12th class")
              ? "Track 1"
              : "Track 2",
          studentName: normalizedName,
          originalName: studentName, // Keep original for reference
          initials: normalizedName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase(),
          isCommonStudent: isCommonStudent,
        };
      })
      .sort((a, b) => {
        // Sort by name order instead of ID
        const nameOrder = {
          gagan: 1,
          amal: 2,
          sriya: 4,
          ananya: 3,
          nithya: 5,
          navya: 6,
        };

        const aName = a.studentName.toLowerCase();
        const bName = b.studentName.toLowerCase();

        const aOrder = Object.keys(nameOrder).find((key) => aName.includes(key))
          ? nameOrder[Object.keys(nameOrder).find((key) => aName.includes(key))]
          : 999;
        const bOrder = Object.keys(nameOrder).find((key) => bName.includes(key))
          ? nameOrder[Object.keys(nameOrder).find((key) => bName.includes(key))]
          : 999;

        return aOrder - bOrder;
      });
  }, [allStudents, user]);

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

  // Get remarks for attendance
  const getRemarks = useCallback(
    (classId, studentId) => {
      return remarks[`${classId}_${studentId}`] || "";
    },
    [remarks]
  );

  // Handle remarks change
  const handleRemarksChange = (classId, studentId, remark) => {
    setRemarks((prev) => ({
      ...prev,
      [`${classId}_${studentId}`]: remark,
    }));
  };

  // Open remarks dialog
  const handleOpenRemarksDialog = (classId, studentId) => {
    setRemarksDialog({
      open: true,
      classId,
      studentId,
      currentRemarks: getRemarks(classId, studentId),
    });
  };

  // Close remarks dialog
  const handleCloseRemarksDialog = () => {
    setRemarksDialog({
      open: false,
      classId: null,
      studentId: null,
      currentRemarks: "",
    });
  };

  // Save remarks
  const handleSaveRemarks = () => {
    const { classId, studentId, currentRemarks } = remarksDialog;
    if (classId && studentId) {
      handleRemarksChange(classId, studentId, currentRemarks);
    }
    handleCloseRemarksDialog();
  };

  const handleEditExam = (classId, studentId, existingData = null) => {
    const examKey = `${classId}_${studentId}`;

    console.log("Editing exam:", examKey, "Existing data:", existingData);

    setEditingExam((prev) => ({ ...prev, [examKey]: true }));

    if (existingData) {
      setExamMarks((prev) => ({
        ...prev,
        [examKey]: {
          physics: existingData.physics || "",
          chemistry: existingData.chemistry || "",
          maths: existingData.maths || "",
        },
      }));
    } else {
      // Initialize empty marks if no existing data
      setExamMarks((prev) => ({
        ...prev,
        [examKey]: {
          physics: "",
          chemistry: "",
          maths: "",
        },
      }));
    }
  };

  const handleExamMarkChange = (classId, studentId, subject, value) => {
    const examKey = `${classId}_${studentId}`;

    setExamMarks((prev) => ({
      ...prev,
      [examKey]: {
        ...(prev[examKey] || {}),
        [subject]: value,
      },
    }));
  };

  const handleSaveExam = async (classItem, student) => {
    const examKey = `${classItem.id}_${student.id}`;
    const marks = examMarks[examKey] || {};
    const cellKey = `${classItem.id}_${student.id}`;

    const isCommonStudent = student.isCommonStudent;

    // Get marks based on user role and student type
    let physicsMarks = 0,
      chemistryMarks = 0,
      mathsMarks = 0;

    if (isCommonStudent) {
      // For common students, both subjects can be entered regardless of user role
      physicsMarks = Number(marks.physics) || 0;
      chemistryMarks = Number(marks.chemistry) || 0;
      mathsMarks = Number(marks.maths) || 0;
    } else {
      // For single-subject students, only their subject
      if (user?.isPhysics) physicsMarks = Number(marks.physics) || 0;
      if (user?.isChemistry) chemistryMarks = Number(marks.chemistry) || 0;
      if (user?.isMaths) mathsMarks = Number(marks.maths) || 0;
    }

    // Calculate total based on student type
    const total = isCommonStudent
      ? physicsMarks + chemistryMarks + mathsMarks
      : physicsMarks + chemistryMarks + mathsMarks;

    const examDataToSave = {
      classId: classItem.id,
      studentId: student.id,
      studentName: student.studentName,
      originalStudentName: student.originalName,
      examDate: new Date(
        classItem.date.split(".").reverse().join("-")
      ).toISOString(),
      examName: classItem.exam || "Revision Exam",
      status: "Present",
      topic: [classItem.exam || "General"],
      testType: getTestTypeFromExam(classItem.exam),
      isRevisionProgramJEEMains2026Student: true,
      Subject: user?.isPhysics
        ? "Physics"
        : user?.isChemistry
        ? "Chemistry"
        : user?.isMaths
        ? "Maths"
        : "General",
      total: total,
      physics: physicsMarks,
      chemistry: chemistryMarks,
      maths: mathsMarks,
      isCommonStudent: isCommonStudent,
    };

    try {
      setSavingState((prev) => ({ ...prev, [cellKey]: true }));

      // Check if exam already exists in our local state
      const existingExam = examData[examKey];

      let result;
      if (existingExam && existingExam.examRecordId) {
        // Update existing exam
        examDataToSave.id = existingExam.examRecordId;
        console.log("Updating exam with ID:", existingExam.examRecordId);
        result = await dispatch(updateStudentExam(examDataToSave));
      } else {
        // Add new exam
        console.log("Adding new exam");
        result = await dispatch(addStudentExam(examDataToSave));
      }

      // Update local exam data state
      if (result) {
        setExamData((prev) => ({
          ...prev,
          [examKey]: {
            ...examDataToSave,
            examRecordId:
              result?.exam?.id ||
              existingExam?.examRecordId ||
              result?.exam?.examRecordId,
          },
        }));
      }

      setSaveMessage({
        text: `Exam marks ${existingExam ? "updated" : "saved"} successfully!`,
        severity: "success",
      });

      // Clear editing state
      setEditingExam((prev) => {
        const newState = { ...prev };
        delete newState[examKey];
        return newState;
      });

      setTimeout(() => setSaveMessage({ text: "", severity: "info" }), 2000);
    } catch (error) {
      console.error("Error saving exam:", error);
      setSaveMessage({
        text: "Failed to save exam marks",
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

  const handleCancelExam = (classId, studentId) => {
    const examKey = `${classId}_${studentId}`;
    setEditingExam((prev) => {
      const newState = { ...prev };
      delete newState[examKey];
      return newState;
    });
    setExamMarks((prev) => {
      const newState = { ...prev };
      delete newState[examKey];
      return newState;
    });
  };

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
      const errorMessage = error?.message || "Failed to update exam status";
      setSaveMessage({
        text: errorMessage,
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
      // Always include exams and revision dates regardless of students
      if (classItem.isExam || classItem.exam || classItem.revisionDate) {
        return [classItem];
      }
      // For regular classes, check if there are students
      const classStudents = getStudentsForClass(classItem);
      return classStudents.length > 0 ? [classItem] : [];
    });
  }, [classes, getStudentsForClass]);

  // Fetch initial classes on mount and load exam data
  useEffect(() => {
    const loadExamData = () => {
      if (!classes || classes.length === 0) return;

      const examDataMap = {};

      classes.forEach((classItem) => {
        if (classItem.isExam || classItem.exam) {
          // Check if class has examData from Redux
          if (classItem.examData && Array.isArray(classItem.examData)) {
            classItem.examData.forEach((exam) => {
              // Use studentId consistently to match the JSX
              const examKey = `${classItem.id}_${exam.studentId}`;
              examDataMap[examKey] = {
                examRecordId: exam.examRecordId || exam.id,
                physics: exam.physics || 0,
                chemistry: exam.chemistry || 0,
                maths: exam.maths || 0,
                total: exam.total || 0,
                subject: exam.subject,
                studentName: exam.studentName,
                studentId: exam.studentId,
              };
            });
          }
        }
      });

      console.log("Loaded exam data:", examDataMap);
      setExamData(examDataMap);
    };

    loadExamData();
  }, [classes]);

  useEffect(() => {
    if (classes.length === 0 && !loading) {
      handleRefresh();
    }
  }, [dispatch]);

  // Debug useEffect to track state changes
  useEffect(() => {
    console.log("Current editingExam state:", editingExam);
    console.log("Current examMarks state:", examMarks);
    console.log("Current examData state:", examData);
  }, [editingExam, examMarks, examData]);

  const getRowTypeAndContent = (classItem) => {
    if (classItem.isExam || classItem.exam) {
      return {
        type: "exam",
        content: classItem.exam || "Exam",
        color: "#f3e5f5", // Very Light Lavender/Purple background
        badgeColor: "linear-gradient(135deg, #9c27b0, #6a1b9a)", // Deep Purple/Violet gradient
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

  // Render content with track-based highlighting
  const renderContentWithTrackHighlight = (classItem, content) => {
    if (classItem.revisionDate || classItem.isExam) {
      return (
        <Typography
          variant="body2"
          sx={{ fontSize: "0.8rem", fontWeight: 500 }}
        >
          {content}
        </Typography>
      );
    }

    if (classItem.track1 && !classItem.track2) {
      return (
        <Track1Highlight>
          <Typography
            variant="body2"
            sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#1e40af" }}
          >
            {content}
          </Typography>
        </Track1Highlight>
      );
    } else if (classItem.track2 && !classItem.track1) {
      return (
        <Track2Highlight>
          <Typography
            variant="body2"
            sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#78350f" }}
          >
            {content}
          </Typography>
        </Track2Highlight>
      );
    } else if (classItem.track1 && classItem.track2) {
      return (
        <BothTracksHighlight>
          <Typography
            variant="body2"
            sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#3730a3" }}
          >
            {content}
          </Typography>
        </BothTracksHighlight>
      );
    } else {
      return (
        <Typography
          variant="body2"
          sx={{ fontSize: "0.8rem", fontWeight: 500 }}
        >
          {content}
        </Typography>
      );
    }
  };

  return (
    <Fade in timeout={800}>
      <StyledPaper sx={{ p: 2, mt: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}
            >
              Revision Classes & Exams
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#64748b", fontSize: "0.8rem" }}
            >
              Today: {todayDate}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Tooltip title="Refresh to Current Classes" arrow>
              <IconButton
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  background: "#f1f5f9",
                  "&:hover": { background: "#e2e8f0" },
                  padding: "6px",
                }}
              >
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>
            <PaginationButton
              onClick={handlePreviousClasses}
              disabled={loading || !hasPreviousFromRedux}
              startIcon={<NavigateBefore />}
              size="small"
            >
              Prev
            </PaginationButton>
            <PaginationButton
              onClick={handleNextClasses}
              disabled={loading || !hasMore}
              endIcon={<NavigateNext />}
              size="small"
            >
              Next
            </PaginationButton>
          </Box>
        </Box>

        {/* Status Messages */}
        {saveMessage.text && (
          <Alert
            severity={saveMessage.severity}
            sx={{ mb: 2, borderRadius: "8px", fontSize: "0.8rem" }}
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
              py: 6,
            }}
          >
            <CircularProgress size={40} sx={{ color: "#3b82f6" }} />
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            sx={{ borderRadius: "8px", fontSize: "0.8rem" }}
          >
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
                maxHeight: "calc(100vh - 200px)",
              }}
            >
              <Table
                stickyHeader
                aria-label="attendance-table"
                sx={{ minWidth: 800 }}
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <HeaderCell sx={{ width: "100px", textAlign: "center" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.5,
                        }}
                      >
                        <CalendarToday sx={{ fontSize: 16 }} />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                          Date & Day
                        </Typography>
                      </Box>
                    </HeaderCell>
                    <HeaderCell sx={{ width: "250px" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Book sx={{ fontSize: 16 }} />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                          Lesson/Topic/Exam
                        </Typography>
                      </Box>
                    </HeaderCell>
                    {revisionStudents.map((student) => (
                      <HeaderCell
                        key={student.id}
                        sx={{
                          textAlign: "center",
                          background:
                            "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                        }}
                      >
                        <StudentBadge>
                          <Typography
                            variant="body1" // Use body1 for larger text base
                            sx={{
                              fontWeight: 900, // Extra bold
                              color: "#78350f",

                              fontSize: "1rem", // Significantly larger font size
                            }}
                          >
                            {student.studentName}
                          </Typography>
                        </StudentBadge>
                      </HeaderCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {flattenedClasses.length > 0 ? (
                    flattenedClasses.map((classItem) => {
                      const isToday = classItem.date === todayDate;
                      const rowInfo = getRowTypeAndContent(classItem);

                      if (classItem.revisionDate) {
                        return (
                          <DisabledRow key={classItem.id}>
                            <TableCell
                              sx={{
                                textAlign: "center",
                                color: "#6c757d",
                                fontWeight: 500,
                                borderRight: "1px solid #e9ecef",
                                padding: "6px 4px",
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontWeight: 700,
                                    color: "#6c757d",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {classItem.date}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "#6c757d",
                                    fontWeight: 400,
                                    fontSize: "0.7rem",
                                    display: "block",
                                  }}
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
                                fontSize: "0.75rem",
                                padding: "6px 4px",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography variant="caption">
                                  Revision Day
                                </Typography>
                                <Chip
                                  label="Revision"
                                  size="small"
                                  sx={{
                                    background: rowInfo.badgeColor,
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: "0.55rem",
                                    height: "18px",
                                  }}
                                />
                              </Box>
                            </TableCell>
                            {revisionStudents.map((student) => (
                              <TableCell
                                key={student.id}
                                sx={{
                                  textAlign: "center",
                                  padding: "4px 2px",
                                  borderRight: "1px solid #e9ecef",
                                  color: "#6c757d",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontStyle: "italic",
                                    fontSize: "0.7rem",
                                  }}
                                >
                                  No Attendance
                                </Typography>
                              </TableCell>
                            ))}
                          </DisabledRow>
                        );
                      }

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
                              padding: "6px 4px",
                            }}
                          >
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 700,
                                  color: isToday ? "#1e40af" : "#1e293b",
                                  fontSize: "0.75rem",
                                  display: "block",
                                }}
                              >
                                {classItem.date}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: isToday ? "#1e40af" : "#64748b",
                                  fontWeight: isToday ? 600 : 400,
                                  fontSize: "0.7rem",
                                  display: "block",
                                }}
                              >
                                {classItem.dayOfWeek}
                                {isToday && " • Today"}
                              </Typography>
                            </Box>
                          </TableCell>

                          {/* Lesson/Topic Cell */}
                          <TableCell
                            sx={{
                              color: "#475569",
                              fontWeight: 600,
                              borderRight: "1px solid #f1f5f9",
                              fontSize: "0.75rem",
                              background: rowInfo.color,
                              padding: "6px 4px",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 0.5,
                              }}
                            >
                              <Box sx={{ flex: 1 }}>
                                {renderContentWithTrackHighlight(
                                  classItem,
                                  rowInfo.content
                                )}
                              </Box>
                              {classItem.isExam && (
                                <Tooltip title="Edit Exam Details">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleOpenExamDialog(classItem)
                                    }
                                    sx={{ color: "#ffc107", padding: "2px" }}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>

                          {/* Student Cells */}
                          {revisionStudents.map((student) => {
                            const cellKey = `${classItem.id}_${student.id}`;
                            const isSaving = savingState[cellKey];
                            const currentRemarks = getRemarks(
                              classItem.id,
                              student.id
                            );

                            if (classItem.isExam || classItem.exam) {
                              const examKey = `${classItem.id}_${student.id}`;
                              const isEditing = editingExam[examKey];
                              const marks = examMarks[examKey] || {};
                              const savedExam = examData[examKey];

                              return (
                                <TableCell
                                  key={student.id}
                                  sx={{
                                    textAlign: "center",
                                    padding: "4px 2px",
                                    borderRight: "1px solid #f1f5f9",
                                    position: "relative",
                                  }}
                                >
                                  {isEditing ? (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 0.5,
                                      }}
                                    >
                                      {/* For common students, show both Physics and Chemistry inputs */}
                                      {(student.isCommonStudent ||
                                        user?.isPhysics) && (
                                        <TextField
                                          size="small"
                                          type="number"
                                          label="Physics"
                                          value={marks.physics || ""}
                                          onChange={(e) =>
                                            handleExamMarkChange(
                                              classItem.id,
                                              student.id,
                                              "physics",
                                              e.target.value
                                            )
                                          }
                                          inputProps={{ min: 0, max: 100 }}
                                          sx={{
                                            width: "100%",
                                            "& .MuiInputBase-input": {
                                              fontSize: "0.7rem",
                                              padding: "4px 8px",
                                            },
                                          }}
                                        />
                                      )}
                                      {(student.isCommonStudent ||
                                        user?.isChemistry) && (
                                        <TextField
                                          size="small"
                                          type="number"
                                          label="Chemistry"
                                          value={marks.chemistry || ""}
                                          onChange={(e) =>
                                            handleExamMarkChange(
                                              classItem.id,
                                              student.id,
                                              "chemistry",
                                              e.target.value
                                            )
                                          }
                                          inputProps={{ min: 0, max: 100 }}
                                          sx={{
                                            width: "100%",
                                            "& .MuiInputBase-input": {
                                              fontSize: "0.7rem",
                                              padding: "4px 8px",
                                            },
                                          }}
                                        />
                                      )}
                                      {user?.isMaths && (
                                        <TextField
                                          size="small"
                                          type="number"
                                          label="Maths"
                                          value={marks.maths || ""}
                                          onChange={(e) =>
                                            handleExamMarkChange(
                                              classItem.id,
                                              student.id,
                                              "maths",
                                              e.target.value
                                            )
                                          }
                                          inputProps={{ min: 0, max: 100 }}
                                          sx={{
                                            width: "100%",
                                            "& .MuiInputBase-input": {
                                              fontSize: "0.7rem",
                                              padding: "4px 8px",
                                            },
                                          }}
                                        />
                                      )}
                                      <Box
                                        sx={{
                                          display: "flex",
                                          gap: 0.5,
                                          justifyContent: "center",
                                        }}
                                      >
                                        <Tooltip title="Save Marks">
                                          <IconButton
                                            size="small"
                                            onClick={() =>
                                              handleSaveExam(classItem, student)
                                            }
                                            disabled={isSaving}
                                            sx={{
                                              color: "#10b981",
                                              padding: "2px",
                                            }}
                                          >
                                            {isSaving ? (
                                              <CircularProgress size={16} />
                                            ) : (
                                              <Check fontSize="small" />
                                            )}
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Cancel">
                                          <IconButton
                                            size="small"
                                            onClick={() =>
                                              handleCancelExam(
                                                classItem.id,
                                                student.id
                                              )
                                            }
                                            disabled={isSaving}
                                            sx={{
                                              color: "#ef4444",
                                              padding: "2px",
                                            }}
                                          >
                                            <Close fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                      </Box>
                                    </Box>
                                  ) : savedExam ? (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                      }}
                                    >
                                      <Box sx={{ flex: 1 }}>
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            fontWeight: 600,
                                            fontSize: "0.65rem",
                                            display: "block",
                                          }}
                                        >
                                          {/* Show marks based on student type and user role */}
                                          {(student.isCommonStudent ||
                                            user?.isPhysics) &&
                                            `P:${savedExam.physics || 0}`}
                                          {(student.isCommonStudent ||
                                            user?.isChemistry) &&
                                            ` C:${savedExam.chemistry || 0}`}
                                          {user?.isMaths &&
                                            ` M:${savedExam.maths || 0}`}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            fontWeight: 700,
                                            color: "#1976d2",
                                            fontSize: "0.7rem",
                                            display: "block",
                                          }}
                                        >
                                          Total:
                                          {(() => {
                                            let total = 0;

                                            if (
                                              student.isCommonStudent ||
                                              user?.isPhysics
                                            ) {
                                              total += savedExam.physics || 0;
                                            }
                                            if (
                                              student.isCommonStudent ||
                                              user?.isChemistry
                                            ) {
                                              total += savedExam.chemistry || 0;
                                            }
                                            if (user?.isMaths) {
                                              total += savedExam.maths || 0;
                                            }

                                            return total;
                                          })()}
                                          /{student.isCommonStudent ? 200 : 100}
                                        </Typography>
                                      </Box>
                                      <Tooltip title="Edit Marks">
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            handleEditExam(
                                              classItem.id,
                                              student.id,
                                              savedExam
                                            )
                                          }
                                          sx={{
                                            color: "#f59e0b",
                                            padding: "2px",
                                          }}
                                        >
                                          <Edit fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  ) : (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                      }}
                                    >
                                      <Tooltip title="Add Marks">
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            handleEditExam(
                                              classItem.id,
                                              student.id
                                            )
                                          }
                                          sx={{
                                            color: "#3b82f6",
                                            padding: "2px",
                                          }}
                                        >
                                          <Edit fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  )}
                                </TableCell>
                              );
                            }

                            // For regular classes, show attendance dropdown with remarks
                            const currentStatus = getAttendanceStatus(
                              classItem.id,
                              student.id
                            );
                            const statusConfig = ATTENDANCE_STATUSES.find(
                              (status) => status.value === currentStatus
                            );

                            return (
                              <TableCell
                                key={student.id}
                                sx={{
                                  textAlign: "center",
                                  padding: "4px 2px",
                                  borderRight: "1px solid #f1f5f9",
                                  position: "relative",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 0.5,
                                    alignItems: "center",
                                  }}
                                >
                                  <FormControl
                                    size="small"
                                    sx={{ width: "100%" }}
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
                                        borderRadius: "4px",
                                        fontWeight: 600,
                                        width: "100%",
                                        fontSize: "0.7rem",
                                        height: "28px",
                                        "& .MuiSelect-select": {
                                          padding: "4px 8px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        },
                                        ...(currentStatus && {
                                          background: `${colorMap[currentStatus]}15`,
                                          color: colorMap[currentStatus],
                                          border: `1px solid ${colorMap[currentStatus]}30`,
                                        }),
                                      }}
                                      renderValue={(value) => {
                                        const status = ATTENDANCE_STATUSES.find(
                                          (s) => s.value === value
                                        );
                                        return status ? status.label : value;
                                      }}
                                    >
                                      {ATTENDANCE_STATUSES.map((status) => (
                                        <MenuItem
                                          key={status.value}
                                          value={status.value}
                                          sx={{
                                            fontWeight: 600,
                                            color: status.color,
                                            justifyContent: "center",
                                            padding: "6px 12px",
                                            fontSize: "0.7rem",
                                          }}
                                        >
                                          {status.label}
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
                                        size={16}
                                        sx={{ color: colorMap[currentStatus] }}
                                      />
                                    </Box>
                                  )}
                                </Box>
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
                          sx={{ color: "#64748b", mb: 1, fontSize: "0.9rem" }}
                        >
                          No classes scheduled
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#94a3b8", fontSize: "0.8rem" }}
                        >
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
          <DialogTitle sx={{ fontSize: "1rem", padding: "16px 16px 8px" }}>
            Exam Details
          </DialogTitle>
          <DialogContent sx={{ padding: "8px 16px" }}>
            {selectedExam && (
              <Box sx={{ pt: 1 }}>
                <TextField
                  fullWidth
                  label="Exam Name"
                  value={selectedExam.exam || ""}
                  margin="dense"
                  disabled
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Date"
                  value={selectedExam.date}
                  margin="dense"
                  disabled
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Day"
                  value={selectedExam.dayOfWeek}
                  margin="dense"
                  disabled
                  size="small"
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ padding: "8px 16px 16px" }}>
            <Button onClick={handleCloseExamDialog} size="small">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </StyledPaper>
    </Fade>
  );
};

export default RevisionClassesPage;
