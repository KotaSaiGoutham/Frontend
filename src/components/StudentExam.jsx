import React, { useEffect, useState } from "react";
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
} from "@mui/material";

import { FaGraduationCap, FaPlus, FaEdit, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
const StudentExamPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { studentExams, loading, error } = useSelector(
    (state) => state.studentExams
  );
  const [editingCell, setEditingCell] = useState(null); // { examId: '...', field: 'physics' }

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
      // Replaced alert with a more user-friendly message
      // A modal or snackbar would be a better alternative
      console.error(`The score for ${field} cannot be greater than ${maxScore}.`);
      setEditingCell(null); // Exit edit mode
      return;
    }

    const updatedExam = { ...examToUpdate, [field]: Number(newValue) };
    dispatch(updateStudentExam(updatedExam));
    setEditingCell(null); // Exit edit mode
  };
  const handleEdit = (exam) => {
    navigate("/add-student-exam", { state: { examToEdit: exam } });
  };

  // State and handlers for the custom delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const handleDeleteClick = (exam) => {
    setSelectedExam(exam);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedExam) {
      dispatch(deleteStudentExam(selectedExam.id));
    }
    setIsDeleteDialogOpen(false);
    setSelectedExam(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setSelectedExam(null);
  };

  const handleStatusChange = (examId, newStatus) => {
    const examToUpdate = filteredExams.find((exam) => exam.id === examId);
    if (examToUpdate) {
      const updatedExam = { ...examToUpdate, status: newStatus };
      dispatch(updateStudentExam(updatedExam));
    }
  };

  useEffect(() => {
    dispatch(fetchStudentExams());
  }, [dispatch]);

  const [filters, setFilters] = useState({
    studentName: "",
    stream: "",
    status: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Filtering logic
  const filteredExams = studentExams.filter((exam) => {
    const matchesName = exam.studentName
      ?.toLowerCase()
      .includes(filters.studentName.toLowerCase());
    const matchesStream =
      filters.stream === "" ||
      exam.stream?.toLowerCase() === filters.stream.toLowerCase();
    const matchesStatus =
      filters.status === "" ||
      exam.status?.toLowerCase() === filters.status.toLowerCase();
    return matchesName && matchesStream && matchesStatus;
  });

  // Data to display in the confirmation dialog
  const dialogData = selectedExam
    ? {
        "Student Name": selectedExam.studentName,
        "Exam Date": new Date(selectedExam.examDate).toLocaleDateString(
          "en-GB"
        ),
        Stream: selectedExam.stream,
      }
    : null;

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
      {/* Header and other UI elements... */}
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
          <MuiButton
            variant="contained"
            startIcon={<FaPlus />}
            onClick={() => navigate("/add-student-exam")}
            sx={{
              bgcolor: "#1976d2",
              "&:hover": { bgcolor: "#1565c0" },
              borderRadius: "8px",
              px: 3,
              py: 1.2,
              minWidth: "180px",
            }}
          >
            Add Exam Record
          </MuiButton>
        </Paper>
      </Slide>

      {/* Table Section */}
      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={700}>
        <Paper
          elevation={6}
          sx={{ p: 2, overflowX: "auto", borderRadius: "12px" }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">
              {error.message || "An unknown error occurred"}
            </Alert>
          ) : filteredExams.length > 0 ? (
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
                  {filteredExams.map((exam, index) => (
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
                      <TableCell
                        align="center"
                        sx={{ fontSize: "0.85rem", padding: "10px 8px" }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontSize: "0.85rem", padding: "10px 8px" }}
                      >
                        {exam.studentName}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontSize: "0.85rem", padding: "10px 8px" }}
                      >
                        {new Date(exam.examDate).toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontSize: "0.85rem", padding: "10px 8px" }}
                      >
                        {exam.stream}
                      </TableCell>
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

                      {user.isPhysics && (
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
                                size="small" // Changed to 'small'
                                InputProps={{
                                  inputProps: {
                                    min: 0,
                                    max: exam.maxPhysics || 100,
                                  },
                                }}
                                sx={{ width: "70px" }} // Add a fixed width to make it smaller
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
                              <Typography>{exam.physics || 0}</Typography>
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

                      {/* Chemistry Cell */}
                      {user.isChemistry && (
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
                                size="small" // Changed to 'small'
                                InputProps={{
                                  inputProps: {
                                    min: 0,
                                    max: exam.maxChemistry || 100,
                                  },
                                }}
                                sx={{ width: "70px" }} // Add a fixed width to make it smaller
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
                              <Typography>{exam.chemistry || 0}</Typography>
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
                      <TableCell
                        align="center"
                        sx={{ fontSize: "0.85rem", padding: "10px 8px" }}
                      >
                        {(exam.maths || 0) +
                          (exam.physics || 0) +
                          (exam.chemistry || 0)}{" "}
                        /{" "}
                        {(exam.maxMaths || 0) +
                          (exam.maxPhysics || 0) +
                          (exam.maxChemistry || 0)}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.5 }}>
                        <Box sx={{ display: "inline-flex", gap: 0.5 }}>
                          <ActionButtons
                            onEdit={() => handleEdit(exam)}
                            onDelete={() => handleDeleteClick(exam)}
                            size="small"
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              No exam records found matching your criteria.
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
