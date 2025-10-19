import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Alert,
  CircularProgress,
  Slide,
  Button as MuiButton,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Drawer,
  Divider,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import {
  FaGraduationCap,
  FaPlus,
  FaEdit,
  FaCheck,
  FaFilter,
  FaSearch,
  FaColumns,
  FaUserCircle,
  FaIdCard,
  FaUsers,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import {
  fetchStudentExams,
  deleteStudentExam,
  updateStudentExam,
} from "../redux/actions";
import { ActionButtons } from "./customcomponents/TableStatusSelect";
import { examStatusConfig, getExamTableColumns } from "../mockdata/Options";
import TableHeaders from "./students/TableHeaders";
import TableStatusSelect from "./customcomponents/TableStatusSelect";
import { DeleteConfirmationDialog } from "./customcomponents/Dialogs";
import { MuiInput, MuiSelect } from "./customcomponents/MuiCustomFormFields";

const StudentExamPage = ({ isRevisionProgramJEEMains2026Student = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { studentExams, loading, error } = useSelector(
    (state) => state.studentExams
  );

  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useSelector((state) => state.students);

  const [editingCell, setEditingCell] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    studentName: "",
    stream: "",
    status: "",
    examType: "",
  });

  // Temporary filters for drawer
  const [tempFilters, setTempFilters] = useState({
    studentName: "",
    stream: "",
    status: "",
    examType: "",
  });

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    sNo: true,
    studentName: true,
    examDate: true,
    stream: true,
    topic: true,
    examType: true,
    status: true,
    physics: true,
    chemistry: true,
    maths: true,
    actions: true,
  });

  // Toggle drawer
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsDrawerOpen(open);
    if (open) {
      setTempFilters(filters);
    }
  };

  // Handle filter changes in drawer
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filters from drawer
  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setIsDrawerOpen(false);
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters = {
      studentName: "",
      stream: "",
      status: "",
      examType: "",
    };
    setTempFilters(clearedFilters);
    setFilters(clearedFilters);
  };

  // Handle column visibility toggle
  const handleColumnToggle = (columnKey) => (event) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnKey]: event.target.checked,
    }));
  };

  // Filter options
  const streamOptions = [
    { value: "", label: "All Streams" },
    { value: "JEE", label: "JEE" },
    { value: "NEET", label: "NEET" },
    { value: "Foundation", label: "Foundation" },
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Present", label: "Present" },
    { value: "Absent", label: "Absent" },
    { value: "Pending", label: "Pending" },
    { value: "Rescheduled", label: "Rescheduled" },
  ];

  const examTypeOptions = [
    { value: "", label: "All Types" },
    { value: "E-EA", label: "Exam by EA" },
    { value: "CA", label: "Exam by Collage" },
  ];

  const handleStartEdit = (examId, field) => {
    setEditingCell({ examId, field });
  };

  const handleSaveEdit = (examId, field, newValue) => {
    const examToUpdate = studentExams.find((exam) => exam.id === examId);
    if (!examToUpdate) return;

    const maxScore =
      examToUpdate[`max${field.charAt(0).toUpperCase() + field.slice(1)}`] ||
      100;

    if (Number(newValue) > maxScore) {
      console.error(
        `The score for ${field} cannot be greater than ${maxScore}.`
      );
      setEditingCell(null);
      return;
    }

    const updatedExam = { ...examToUpdate, [field]: Number(newValue) };
    dispatch(updateStudentExam(updatedExam));
    setEditingCell(null);
    dispatch(fetchStudentExams());
  };

  const handleEdit = (exam) => {
    navigate("/add-student-exam", { state: { examToEdit: exam } });
  };

  const handleDeleteClick = (exam) => {
    setSelectedExam(exam);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedExam) {
      dispatch(deleteStudentExam(selectedExam.id));
      dispatch(fetchStudentExams());
    }
    setIsDeleteDialogOpen(false);
    setSelectedExam(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setSelectedExam(null);
  };

  const handleStatusChange = (examId, newStatus) => {
    const examToUpdate = filteredAndSortedExams.find(
      (exam) => exam.id === examId
    );
    if (examToUpdate) {
      const updatedExam = { ...examToUpdate, status: newStatus };
      dispatch(updateStudentExam(updatedExam));
      dispatch(fetchStudentExams());
    }
  };

  useEffect(() => {
    dispatch(fetchStudentExams());
  }, [dispatch]);

  // Filter exams based on revision program flag and date range
  const filteredAndSortedExams = useMemo(() => {
    let filteredExams = [...studentExams];

    // Revision program date range: 6th October 2025 to 21st January 2026
    const revisionProgramStartDate = new Date("2025-10-06T00:00:00.000Z");
    const revisionProgramEndDate = new Date("2026-01-21T23:59:59.999Z");

    // Filter by revision program students if the flag is true
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

      filteredExams = filteredExams.filter((exam) => {
        const isRevisionStudent =
          (exam.studentId && revisionStudentIds.has(exam.studentId)) ||
          (exam.studentName &&
            students &&
            students.find(
              (student) =>
                student.Name === exam.studentName &&
                student.isRevisionProgramJEEMains2026Student === true
            ));

        if (!isRevisionStudent) {
          return false;
        }

        const examDate = new Date(exam.examDate);
        return (
          examDate >= revisionProgramStartDate &&
          examDate <= revisionProgramEndDate
        );
      });
    }

    // Apply user filters
    filteredExams = filteredExams.filter((exam) => {
      const matchesName = exam.studentName
        ?.toLowerCase()
        .includes(filters.studentName.toLowerCase());
      const matchesStream =
        filters.stream === "" ||
        exam.stream?.toLowerCase() === filters.stream.toLowerCase();
      const matchesStatus =
        filters.status === "" ||
        exam.status?.toLowerCase() === filters.status.toLowerCase();

      const examType = exam.examType || "E-EA";
      const matchesExamType =
        filters.examType === "" ||
        examType.toLowerCase() === filters.examType.toLowerCase();

      return matchesName && matchesStream && matchesStatus && matchesExamType;
    });

    // Sort the exams - LATEST EXAMS FIRST for all students
    return filteredExams.sort((a, b) => {
      const examDateA = new Date(a.examDate);
      const examDateB = new Date(b.examDate);
      const dateComparison = examDateB - examDateA;

      if (dateComparison === 0) {
        const createdDateA = new Date(
          a.createdAt._seconds * 1000 + a.createdAt._nanoseconds / 1000000
        );
        const createdDateB = new Date(
          b.createdAt._seconds * 1000 + b.createdAt._nanoseconds / 1000000
        );
        const createdDateComparison = createdDateB - createdDateA;

        if (createdDateComparison === 0) {
          const nameA = a.studentName.toLowerCase();
          const nameB = b.studentName.toLowerCase();
          return nameA.localeCompare(nameB);
        }

        return createdDateComparison;
      }

      return dateComparison;
    });
  }, [studentExams, students, isRevisionProgramJEEMains2026Student, filters]);

  const dialogData = selectedExam
    ? {
        "Student Name": selectedExam.studentName,
        "Exam Date": new Date(selectedExam.examDate).toLocaleDateString(
          "en-GB"
        ),
        Stream: selectedExam.stream,
      }
    : null;
  const handleExamTypeChange = (e) => {
    setFilters((prev) => ({ ...prev, examType: e.target.value }));
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
              p: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: "12px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FaGraduationCap
                style={{
                  marginRight: "15px",
                  fontSize: "2.5rem",
                  color: "#1976d2",
                }}
              />
              <Box>
                <Typography
                  variant="h4"
                  sx={{ color: "#292551", fontWeight: 700, mb: 0.5 }}
                >
                  Student Exams
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage and track student exam performance.
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              {/* Exam Type Filter - Better aligned */}
              <FormControl size="small" sx={{ width: 200, mb: 0 }}>
                <InputLabel sx={{ fontSize: "0.9rem" }}>Exam Type</InputLabel>
                <Select
                  value={filters.examType}
                  label="Exam Type"
                  onChange={handleExamTypeChange}
                  sx={{
                    height: "40px",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                    "& .MuiSelect-select": {
                      paddingTop: "8px",
                      paddingBottom: "8px",
                    },
                  }}
                >
                  {examTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <MuiButton
                  variant="outlined"
                  startIcon={<FaFilter />}
                  onClick={toggleDrawer(true)}
                  sx={{
                    height: "40px",
                    borderRadius: "8px",
                    px: 2,
                    minWidth: "auto",
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
                <MuiButton
                  variant="contained"
                  startIcon={<FaPlus />}
                  onClick={() => navigate("/add-student-exam")}
                  sx={{
                    height: "40px",
                    bgcolor: "#1976d2",
                    "&:hover": { bgcolor: "#1565c0" },
                    borderRadius: "8px",
                    px: 2,
                    minWidth: "auto",
                    whiteSpace: "nowrap",
                  }}
                >
                  Add Exam
                </MuiButton>
              </Box>
            </Box>
          </Paper>
        </Slide>
      )}

      {/* Filters Drawer */}
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
            Options & Filters
          </Typography>
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon size={16} />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 1 }} />

        {/* DATA FILTERS SECTION */}
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
            label="Stream"
            name="stream"
            value={tempFilters.stream}
            onChange={handleFilterChange}
            options={streamOptions}
            icon={FaGraduationCap}
          />
          <MuiSelect
            label="Status"
            name="status"
            value={tempFilters.status}
            onChange={handleFilterChange}
            options={statusOptions}
            icon={FaIdCard}
          />
        </Box>

        {/* COLUMN VISIBILITY SECTION */}
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
            gridTemplateColumns: "1fr 1fr",
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
                  sx={{ p: 0.5 }}
                />
              }
              label={
                key === "sNo"
                  ? "S.No."
                  : key === "studentName"
                  ? "Student Name"
                  : key === "examDate"
                  ? "Exam Date"
                  : key === "examType"
                  ? "Exam Type"
                  : key === "actions"
                  ? "Actions"
                  : key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())
              }
              sx={{
                m: 0,
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

        {/* ACTION BUTTONS */}
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

      {/* Table Section */}
      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={700}>
        <Paper
          elevation={6}
          sx={{
            p: !isRevisionProgramJEEMains2026Student ? 2 : 0.5,
            overflowX: "auto",
            borderRadius: "12px",
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">
              {error.message || "An unknown error occurred"}
            </Alert>
          ) : filteredAndSortedExams.length > 0 ? (
            <TableContainer
              component={Paper}
              elevation={3}
              sx={{
                borderRadius: 2,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
              }}
            >
              <Table sx={{ minWidth: 1200 }} aria-label="student exams table">
                <TableHeaders columns={getExamTableColumns(user)} />
                <TableBody>
                  {filteredAndSortedExams.map((exam, index) => {
                    const studentData = students.find(
                      (s) => s.id === exam.studentId
                    );
                    const examType = exam.examType || "E-EA";

                    // Skip rendering if column is hidden
                    if (!columnVisibility.sNo) return null;

                    return (
                      <TableRow
                        key={exam.id}
                        sx={{
                          "&:nth-of-type(odd)": { backgroundColor: "#fbfcfd" },
                          "&:hover": {
                            backgroundColor: "#eef7ff",
                            cursor: "pointer",
                          },
                          borderBottom: "1px solid #e0e0e0",
                        }}
                      >
                        {/* S.No */}
                        {columnVisibility.sNo && (
                          <TableCell
                            align="center"
                            sx={{ fontSize: "0.85rem", padding: "10px 8px" }}
                          >
                            {index + 1}
                          </TableCell>
                        )}

                        {/* Student Name */}
                        {columnVisibility.studentName && (
                          <TableCell
                            align="center"
                            sx={{ fontSize: "0.85rem", padding: "10px 8px" }}
                          >
                            <Tooltip
                              title={`Click to view details for ${exam.studentName}`}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 1.5,
                                }}
                              >
                                <Link
                                  to={`/student/${exam.studentId}`}
                                  state={{ studentData: studentData }}
                                  style={{
                                    fontWeight: 500,
                                    color: "#34495e",
                                    textDecoration: "none",
                                    transition:
                                      "color 0.2s ease, text-decoration 0.2s ease",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.color = "#2980b9";
                                    e.currentTarget.style.textDecoration =
                                      "underline";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color = "#34495e";
                                    e.currentTarget.style.textDecoration =
                                      "none";
                                  }}
                                >
                                  {exam.studentName}
                                </Link>
                                {exam.testType && exam.testType.length > 0 && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: 0.5,
                                      alignItems: "center",
                                    }}
                                  >
                                    {exam.testType.includes("weekendTest") && (
                                      <Chip
                                        label="WT"
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                          height: "20px",
                                          fontSize: "0.65rem",
                                          fontWeight: "700",
                                          color: "#1976d2",
                                          borderColor: "#1976d2",
                                          backgroundColor: "#e3f2fd",
                                          "& .MuiChip-label": {
                                            px: 0.5,
                                            py: 0.25,
                                          },
                                        }}
                                      />
                                    )}
                                    {exam.testType.includes(
                                      "cumulativeTest"
                                    ) && (
                                      <Chip
                                        label="CT"
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                          height: "20px",
                                          fontSize: "0.65rem",
                                          fontWeight: "700",
                                          color: "#7b1fa2",
                                          borderColor: "#7b1fa2",
                                          backgroundColor: "#f3e5f5",
                                          "& .MuiChip-label": {
                                            px: 0.5,
                                            py: 0.25,
                                          },
                                        }}
                                      />
                                    )}
                                    {exam.testType.includes("grandTest") && (
                                      <Chip
                                        label="GT"
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                          height: "20px",
                                          fontSize: "0.65rem",
                                          fontWeight: "700",
                                          color: "#2e7d32",
                                          borderColor: "#2e7d32",
                                          backgroundColor: "#e8f5e8",
                                          "& .MuiChip-label": {
                                            px: 0.5,
                                            py: 0.25,
                                          },
                                        }}
                                      />
                                    )}
                                  </Box>
                                )}
                              </Box>
                            </Tooltip>
                          </TableCell>
                        )}

                        {/* Exam Date */}
                        {columnVisibility.examDate && (
                          <TableCell
                            align="center"
                            sx={{ fontSize: "0.85rem", padding: "10px 8px" }}
                          >
                            {new Date(exam.examDate).toLocaleDateString(
                              "en-GB"
                            )}
                          </TableCell>
                        )}

                        {/* Stream */}
                        {columnVisibility.stream && (
                          <TableCell
                            align="center"
                            sx={{ fontSize: "0.85rem", padding: "10px 8px" }}
                          >
                            {exam.stream}
                          </TableCell>
                        )}

                        {/* Topic */}
                        {columnVisibility.topic && (
                          <TableCell
                            align="center"
                            sx={{ fontSize: "0.85rem", padding: "10px 8px" }}
                          >
                            {Array.isArray(exam.topic)
                              ? exam.topic.join(", ")
                              : exam.topic || "-"}
                          </TableCell>
                        )}

                        {/* Exam Type */}
                        {columnVisibility.examType && (
                          <TableCell
                            align="center"
                            sx={{ fontSize: "0.85rem", padding: "10px 8px" }}
                          >
                            {examType === "CA" ? (
                              <Chip
                                label="CA"
                                size="small"
                                sx={{
                                  backgroundColor: "#d32f2f",
                                  color: "white",
                                  fontSize: "0.7rem",
                                  fontWeight: "bold",
                                }}
                              />
                            ) : (
                              <Chip
                                label="E-EA"
                                size="small"
                                sx={{
                                  backgroundColor: "#1976d2",
                                  color: "white",
                                  fontSize: "0.7rem",
                                  fontWeight: "bold",
                                }}
                              />
                            )}
                          </TableCell>
                        )}

                        {/* Status */}
                        {columnVisibility.status && (
                          <TableCell
                            align="center"
                            sx={{
                              fontSize: "0.85rem",
                              padding: "10px 8px",
                              minWidth: 150,
                            }}
                          >
                            <TableStatusSelect
                              value={exam.status || ""}
                              onChange={(e) =>
                                handleStatusChange(exam.id, e.target.value)
                              }
                              options={examStatusConfig}
                            />
                          </TableCell>
                        )}

                        {/* Subject Columns */}
                        {user.isPhysics && columnVisibility.physics && (
                          <TableCell align="center">
                            {editingCell?.examId === exam.id &&
                            editingCell?.field === "physics" ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 1,
                                }}
                              >
                                <TextField
                                  defaultValue={exam.physics || 0}
                                  type="number"
                                  size="small"
                                  InputProps={{
                                    inputProps: {
                                      min: 0,
                                      max: exam.maxPhysics || 100,
                                    },
                                  }}
                                  sx={{ width: "70px" }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleSaveEdit(
                                        exam.id,
                                        "physics",
                                        e.target.value
                                      );
                                    }
                                  }}
                                />
                                <IconButton
                                  onClick={(e) =>
                                    handleSaveEdit(
                                      exam.id,
                                      "physics",
                                      e.currentTarget.previousElementSibling.querySelector(
                                        "input"
                                      ).value
                                    )
                                  }
                                  size="small"
                                  color="success"
                                >
                                  <FaCheck />
                                </IconButton>
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 1,
                                }}
                              >
                                <Typography>
                                  {`${exam.physics || 0}/${
                                    exam.maxPhysics || 100
                                  }`}
                                </Typography>
                                <IconButton
                                  onClick={() =>
                                    handleStartEdit(exam.id, "physics")
                                  }
                                  size="small"
                                >
                                  <FaEdit />
                                </IconButton>
                              </Box>
                            )}
                          </TableCell>
                        )}

                        {user.isChemistry && columnVisibility.chemistry && (
                          <TableCell align="center">
                            {editingCell?.examId === exam.id &&
                            editingCell?.field === "chemistry" ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 1,
                                }}
                              >
                                <TextField
                                  defaultValue={exam.chemistry || 0}
                                  type="number"
                                  size="small"
                                  InputProps={{
                                    inputProps: {
                                      min: 0,
                                      max: exam.maxChemistry || 100,
                                    },
                                  }}
                                  sx={{ width: "70px" }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleSaveEdit(
                                        exam.id,
                                        "chemistry",
                                        e.target.value
                                      );
                                    }
                                  }}
                                />
                                <IconButton
                                  onClick={(e) =>
                                    handleSaveEdit(
                                      exam.id,
                                      "chemistry",
                                      e.currentTarget.previousElementSibling.querySelector(
                                        "input"
                                      ).value
                                    )
                                  }
                                  size="small"
                                  color="success"
                                >
                                  <FaCheck />
                                </IconButton>
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 1,
                                }}
                              >
                                <Typography>
                                  {`${exam.chemistry || 0}/${
                                    exam.maxChemistry || 100
                                  }`}
                                </Typography>
                                <IconButton
                                  onClick={() =>
                                    handleStartEdit(exam.id, "chemistry")
                                  }
                                  size="small"
                                >
                                  <FaEdit />
                                </IconButton>
                              </Box>
                            )}
                          </TableCell>
                        )}

                        {user.isMaths && columnVisibility.maths && (
                          <TableCell align="center">
                            <Typography>{`${exam.maths || 0}/${
                              exam.maxMaths || 100
                            }`}</Typography>
                          </TableCell>
                        )}

                        {/* Actions */}
                        {columnVisibility.actions && (
                          <TableCell align="center" sx={{ py: 1.5 }}>
                            <Box sx={{ display: "inline-flex", gap: 0.5 }}>
                              <ActionButtons
                                onEdit={() => handleEdit(exam)}
                                onDelete={() => handleDeleteClick(exam)}
                                size="small"
                              />
                            </Box>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              {isRevisionProgramJEEMains2026Student
                ? "No revision program exam records found matching your criteria."
                : "No exam records found matching your criteria."}
            </Alert>
          )}
        </Paper>
      </Slide>

      {/* Custom Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this exam record? This action cannot be undone."
        data={dialogData}
      />
    </Box>
  );
};

export default StudentExamPage;
