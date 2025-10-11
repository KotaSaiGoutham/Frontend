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
  Tooltip,
  IconButton,
  Fade,
  Button,
  TextField,
  Tabs,
  Tab,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Refresh,
  Edit,
  Check,
  Close,
  NavigateBefore,
  NavigateNext,
  CalendarToday,
} from "@mui/icons-material";
import {
  fetchRevisionExams,
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

const HeaderCell = styled(TableCell)(({ theme }) => ({
  background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
  color: "white",
  fontWeight: 700,
  fontSize: "0.75rem",
  borderRight: "1px solid #475569",
  padding: "8px 4px",
  textAlign: "center",
  "&:first-of-type": {
    borderTopLeftRadius: "8px",
  },
  "&:last-child": {
    borderTopRightRadius: "8px",
    borderRight: "none",
  },
}));

const SubjectHeaderCell = styled(HeaderCell)(({ theme }) => ({
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  minWidth: "60px",
  fontSize: "0.7rem",
}));

const StudentHeaderGroup = styled(TableRow)(({ theme }) => ({
  "& > th": {
    background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    borderRight: "1px solid #475569",
    padding: "4px",
  },
}));

const ExamRow = styled(TableRow)(({ istoday }) => ({
  backgroundColor: istoday ? "#fff3cd" : "#fff",
  borderLeft: istoday ? "4px solid #3b82f6" : "none",
  borderBottom: "1px solid #f1f5f9",
  transition: "all 0.3s ease-in-out",
  animation: istoday ? "pulseHighlight 2s ease-in-out infinite" : "none",
  "&:hover": {
    backgroundColor: istoday ? "#ffeaa7" : "#f8f9fa",
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

const StudentBadge = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #fef3c7, #fffbeb)",
  border: "1px solid #f59e0b",
  borderRadius: "6px",
  padding: "4px 2px",
  textAlign: "center",
}));

const RevisionExamsPage = () => {
  const [savingState, setSavingState] = useState({});
  const [saveMessage, setSaveMessage] = useState({
    text: "",
    severity: "info",
  });
  const [editingExam, setEditingExam] = useState({});
  const [examMarks, setExamMarks] = useState({});
  const [examData, setExamData] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  const dispatch = useDispatch();
  const { exams, loading, error } = useSelector((state) => state.revisionExams);

  const { students: allStudents } = useSelector((state) => state.students);
  const { user } = useSelector((state) => state.auth);

  const getTodayDate = useCallback(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}.${month}.${year}`;
  }, []);

  const todayDate = getTodayDate();

  // Student configuration based on your screenshot
  const studentConfig = useMemo(
    () => [
      {
        id: "amal",
        name: "Amal",
        shortName: "Amal",
        initials: "A",
        isCommon: true,
      },
      {
        id: "gagan",
        name: "Gagan",
        shortName: "Gagan",
        initials: "G",
        isCommon: true,
      },
      {
        id: "sriya",
        name: "Sriya JEE",
        shortName: "Sriya",
        initials: "S",
        isCommon: true,
      },
      {
        id: "ananya",
        name: "Ananya",
        shortName: "Ananya",
        initials: "A",
        isCommon: true,
      },
      {
        id: "nithya",
        name: "Nithya",
        shortName: "Nithya",
        initials: "N",
        isCommon: false,
      },
      {
        id: "navya",
        name: "Navya",
        shortName: "Navya",
        initials: "N",
        isCommon: false,
      },
    ],
    []
  );

  const revisionStudents = useMemo(() => {
    return studentConfig.map((config) => {
      const matchedStudent = allStudents.find((student) => {
        const studentName = student.Name || student.studentName || "";
        return studentName.toLowerCase().includes(config.name.toLowerCase());
      });

      return {
        id: matchedStudent?.id || config.id,
        studentName: config.name,
        shortName: config.shortName,
        initials: config.initials,
        isCommonStudent: config.isCommon,
        originalName:
          matchedStudent?.Name || matchedStudent?.studentName || config.name,
      };
    });
  }, [allStudents, studentConfig]);

  const { weekendExams, cumulativeExams, grandTestExams } = useMemo(() => {
    const weekend = exams.filter((exam) => exam.exam?.includes("Weekend"));
    const cumulative = exams.filter((exam) =>
      exam.exam?.includes("Cumulative")
    );
    const grand = exams.filter((exam) => exam.exam?.includes("Grand"));

    return {
      weekendExams: weekend,
      cumulativeExams: cumulative,
      grandTestExams: grand,
    };
  }, [exams]);

  const handleEditExam = (examId, studentId, subject, existingData = null) => {
    const examKey = `${examId}_${studentId}_${subject}`;
    setEditingExam((prev) => ({ ...prev, [examKey]: true }));

    if (existingData) {
      setExamMarks((prev) => ({
        ...prev,
        [examKey]: {
          [subject]: existingData[subject] || "",
        },
      }));
    } else {
      setExamMarks((prev) => ({
        ...prev,
        [examKey]: {
          [subject]: "",
        },
      }));
    }
  };

  const handleExamMarkChange = (examId, studentId, subject, value) => {
    const examKey = `${examId}_${studentId}_${subject}`;
    setExamMarks((prev) => ({
      ...prev,
      [examKey]: {
        [subject]: value,
      },
    }));
  };

  const handleSaveExam = async (examItem, student, subject) => {
    const examKey = `${examItem.id}_${student.id}`;
    const subjectKey = `${examItem.id}_${student.id}_${subject}`;
    const marks = examMarks[subjectKey] || {};
    const cellKey = `${examItem.id}_${student.id}_${subject}`;

    const subjectMark = Number(marks[subject]) || 0;

    // Get existing exam data to preserve other subject marks
    const existingExam = examData[examKey];
    const currentPhysics = existingExam?.physics || 0;
    const currentChemistry = existingExam?.chemistry || 0;
    const currentMaths = existingExam?.maths || 0;

    let physicsMarks = currentPhysics;
    let chemistryMarks = currentChemistry;
    let mathsMarks = currentMaths;

    // Update the specific subject mark
    if (subject === "physics") physicsMarks = subjectMark;
    if (subject === "chemistry") chemistryMarks = subjectMark;
    if (subject === "maths") mathsMarks = subjectMark;

    const total = physicsMarks + chemistryMarks + mathsMarks;

    const examDataToSave = {
      classId: examItem.id,
      studentId: student.id,
      studentName: student.studentName,
      originalStudentName: student.originalName,
      examDate: new Date(
        examItem.date.split(".").reverse().join("-")
      ).toISOString(),
      examName: examItem.exam || "Revision Exam",
      status: "Present",
      topic: [examItem.exam || "General"],
      testType: getTestTypeFromExam(examItem.exam),
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
      isCommonStudent: student.isCommonStudent,
    };

    try {
      setSavingState((prev) => ({ ...prev, [cellKey]: true }));

      let result;
      if (existingExam && existingExam.examRecordId) {
        examDataToSave.id = existingExam.examRecordId;
        result = await dispatch(updateStudentExam(examDataToSave));
      } else {
        result = await dispatch(addStudentExam(examDataToSave));
      }

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
        text: `${
          subject.charAt(0).toUpperCase() + subject.slice(1)
        } marks saved successfully!`,
        severity: "success",
      });

      setEditingExam((prev) => {
        const newState = { ...prev };
        delete newState[subjectKey];
        return newState;
      });

      setTimeout(() => setSaveMessage({ text: "", severity: "info" }), 2000);
    } catch (error) {
      console.error("Error saving exam:", error);
      setSaveMessage({ text: "Failed to save exam marks", severity: "error" });
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

  const handleCancelExam = (examId, studentId, subject) => {
    const examKey = `${examId}_${studentId}_${subject}`;
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

  const getTestTypeFromExam = (examName) => {
    if (!examName) return [];
    if (examName.includes("Weekend")) return ["weekendTest"];
    if (examName.includes("Cumulative")) return ["cumulativeTest"];
    if (examName.includes("Grand")) return ["grandTest"];
    return [];
  };

  const handleRefresh = async () => {
    await dispatch(fetchRevisionExams());
  };

  useEffect(() => {
    const loadExamData = () => {
      if (!exams || exams.length === 0) return;
      const examDataMap = {};

      exams.forEach((examItem) => {
        if (examItem.examData && Array.isArray(examItem.examData)) {
          examItem.examData.forEach((exam) => {
            const examKey = `${examItem.id}_${exam.studentId}`;
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
      });

      setExamData(examDataMap);
    };

    loadExamData();
  }, [exams]);

  useEffect(() => {
    if (exams.length === 0 && !loading) {
      handleRefresh();
    }
  }, [dispatch]);

  const renderSubjectMarks = (examItem, student, subject) => {
    const examKey = `${examItem.id}_${student.id}`;
    const subjectKey = `${examItem.id}_${student.id}_${subject}`;
    const isEditing = editingExam[subjectKey];
    const marks = examMarks[subjectKey] || {};
    const savedExam = examData[examKey];
    const cellKey = `${examItem.id}_${student.id}_${subject}`;
    const isSaving = savingState[cellKey];

    const subjectMark = savedExam ? savedExam[subject] || 0 : 0;

    if (isEditing) {
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, p: 0.5 }}>
          <TextField
            size="small"
            type="number"
            value={marks[subject] || ""}
            onChange={(e) =>
              handleExamMarkChange(
                examItem.id,
                student.id,
                subject,
                e.target.value
              )
            }
            inputProps={{
              min: 0,
              max: 100,
              style: {
                fontSize: "0.7rem",
                padding: "2px 4px",
                width: "40px",
                textAlign: "center",
              },
            }}
            sx={{
              width: "60px",
              "& .MuiInputBase-root": { height: "28px" },
            }}
            autoFocus
          />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Tooltip title="Save">
              <IconButton
                size="small"
                onClick={() => handleSaveExam(examItem, student, subject)}
                disabled={isSaving}
                sx={{ color: "#10b981", padding: "1px" }}
              >
                {isSaving ? (
                  <CircularProgress size={14} />
                ) : (
                  <Check fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel">
              <IconButton
                size="small"
                onClick={() =>
                  handleCancelExam(examItem.id, student.id, subject)
                }
                disabled={isSaving}
                sx={{ color: "#ef4444", padding: "1px" }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
          p: 0.5,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            fontSize: "0.75rem",
            minWidth: "20px",
            textAlign: "center",
          }}
        >
          {subjectMark > 0 ? subjectMark : "-"}
        </Typography>
        <Tooltip title={`Edit ${subject} marks`}>
          <IconButton
            size="small"
            onClick={() =>
              handleEditExam(examItem.id, student.id, subject, savedExam)
            }
            sx={{ color: "#3b82f6", padding: "2px" }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  const renderExamTable = (examsList, title) => {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 700, color: "#1e293b" }}
        >
          {title} ({examsList.length})
        </Typography>
        <TableContainer
          sx={{
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            background: "white",
            overflow: "auto",
          }}
        >
          <Table size="small">
            <TableHead>
              {/* First header row - Student names spanning both P and C columns */}
              <StudentHeaderGroup>
                <HeaderCell sx={{ width: "60px", textAlign: "center" }}>
                  S.No.
                </HeaderCell>
                <HeaderCell sx={{ width: "100px", textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.5,
                    }}
                  >
                    <CalendarToday sx={{ fontSize: 14 }} />
                    <span>Date</span>
                  </Box>
                </HeaderCell>
                <HeaderCell sx={{ width: "80px", textAlign: "center" }}>
                  Day
                </HeaderCell>
                <HeaderCell sx={{ width: "200px", textAlign: "center" }}>
                  Type of Exam
                </HeaderCell>
                {revisionStudents.map((student) => (
                  <HeaderCell
                    key={student.id}
                    colSpan={student.isCommonStudent ? 2 : 1} // Only 1 column for non-common students
                    sx={{
                      textAlign: "center",
                      background:
                        "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                    }}
                  >
                    <StudentBadge>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: "4px",
                          background: "#f59e0b",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: 700,
                          fontSize: "0.6rem",
                          margin: "0 auto 2px auto",
                        }}
                      >
                        {student.initials}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: "#78350f",
                          fontSize: "0.65rem",
                        }}
                      >
                        {student.shortName}
                      </Typography>
                    </StudentBadge>
                  </HeaderCell>
                ))}
              </StudentHeaderGroup>

              {/* Second header row - Subject columns (P and C) for each student */}
              <TableRow>
                <HeaderCell
                  sx={{
                    background:
                      "linear-gradient(135deg, #334155 0%, #475569 100%)",
                  }}
                ></HeaderCell>
                <HeaderCell
                  sx={{
                    background:
                      "linear-gradient(135deg, #334155 0%, #475569 100%)",
                  }}
                ></HeaderCell>
                <HeaderCell
                  sx={{
                    background:
                      "linear-gradient(135deg, #334155 0%, #475569 100%)",
                  }}
                ></HeaderCell>
                <HeaderCell
                  sx={{
                    background:
                      "linear-gradient(135deg, #334155 0%, #475569 100%)",
                  }}
                ></HeaderCell>
                {revisionStudents.map((student) => (
                  <React.Fragment key={student.id}>
                    {/* For common students, show both P and C columns */}
                    {student.isCommonStudent ? (
                      <>
                        <SubjectHeaderCell>P</SubjectHeaderCell>
                        <SubjectHeaderCell>C</SubjectHeaderCell>
                      </>
                    ) : (
                      /* For non-common students, show only P column */
                      <SubjectHeaderCell>P</SubjectHeaderCell>
                    )}
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {examsList.length > 0 ? (
                examsList.map((examItem, index) => {
                  const isToday = examItem.date === todayDate;
                  return (
                    <ExamRow key={examItem.id} istoday={isToday}>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: "8px 4px",
                          borderRight: "1px solid #f1f5f9",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: "#475569",
                            fontSize: "0.75rem",
                          }}
                        >
                          {index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: "8px 4px",
                          borderRight: "1px solid #f1f5f9",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            color: isToday ? "#1e40af" : "#1e293b",
                            fontSize: "0.75rem",
                          }}
                        >
                          {examItem.date}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: "8px 4px",
                          borderRight: "1px solid #f1f5f9",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: isToday ? "#1e40af" : "#64748b",
                            fontWeight: isToday ? 600 : 400,
                            fontSize: "0.7rem",
                          }}
                        >
                          {examItem.dayOfWeek}
                          {isToday && " • Today"}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "8px 4px",
                          borderRight: "1px solid #f1f5f9",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            color: "#475569",
                          }}
                        >
                          {examItem.exam}
                        </Typography>
                      </TableCell>
                      {revisionStudents.map((student) => (
                        <React.Fragment key={student.id}>
                          {/* For common students, show both Physics and Chemistry columns */}
                          {student.isCommonStudent ? (
                            <>
                              <TableCell
                                sx={{
                                  textAlign: "center",
                                  padding: "0px",
                                  borderRight: "1px solid #f1f5f9",
                                }}
                              >
                                {renderSubjectMarks(
                                  examItem,
                                  student,
                                  "physics"
                                )}
                              </TableCell>
                              <TableCell
                                sx={{
                                  textAlign: "center",
                                  padding: "0px",
                                  borderRight: "1px solid #f1f5f9",
                                }}
                              >
                                {renderSubjectMarks(
                                  examItem,
                                  student,
                                  "chemistry"
                                )}
                              </TableCell>
                            </>
                          ) : (
                            /* For non-common students, show only Physics column */
                            <TableCell
                              sx={{
                                textAlign: "center",
                                padding: "0px",
                                borderRight: "1px solid #f1f5f9",
                              }}
                            >
                              {renderSubjectMarks(examItem, student, "physics")}
                            </TableCell>
                          )}
                        </React.Fragment>
                      ))}
                    </ExamRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      4 +
                      revisionStudents.reduce(
                        (total, student) =>
                          total + (student.isCommonStudent ? 2 : 1),
                        0
                      )
                    }
                    sx={{ py: 4, textAlign: "center" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "#64748b", fontSize: "0.85rem" }}
                    >
                      No {title.toLowerCase()} found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };
  return (
    <Fade in timeout={800}>
      <StyledPaper sx={{ p: 3 }}>
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
              Revision Program Exams
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#64748b", fontSize: "0.9rem" }}
            >
              Today: {todayDate}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Tooltip title="Refresh Exams" arrow>
              <IconButton
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  background: "#f1f5f9",
                  "&:hover": { background: "#e2e8f0" },
                  padding: "8px",
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

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
            <CircularProgress size={50} sx={{ color: "#3b82f6" }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: "8px" }}>
            Error loading exams: {error}
          </Alert>
        ) : (
          <>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                mb: 3,
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTab-root": {
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textTransform: "none",
                  minWidth: "auto",
                  px: 3,
                  py: 1,
                },
              }}
            >
              <Tab label={`Weekend Exams (${weekendExams.length})`} />
              <Tab label={`Cumulative Exams (${cumulativeExams.length})`} />
              <Tab label={`Grand Tests (${grandTestExams.length})`} />
            </Tabs>

            {activeTab === 0 && renderExamTable(weekendExams, "Weekend Exams")}
            {activeTab === 1 &&
              renderExamTable(cumulativeExams, "Cumulative Exams")}
            {activeTab === 2 && renderExamTable(grandTestExams, "Grand Tests")}
          </>
        )}
      </StyledPaper>
    </Fade>
  );
};

export default RevisionExamsPage;
