import React, { useState, useEffect } from "react";
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
  Slide,
  Button as MuiButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Chip,
  Tooltip,
  Collapse,
  Menu,
  MenuItem,
  FormControl,
  Select,
  OutlinedInput,
  Fade,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  DeleteOutline,
  Payment,
  Edit,
  CheckCircleOutline,
  HighlightOff,
  PendingOutlined,
} from "@mui/icons-material";
import { keyframes, styled } from "@mui/material/styles";
import { revisionStudentsColumns,revisionStudentStatusConfig,revisionStudentspaymentStatusConfig } from "../../mockdata/Options";
// Import actions for fetching students and a new action for updating statuses
import {
  fetchRevisionStudents,
  deleteRevisionStudent,
  updatePaymentStatus,
  updateStudentStatus,
} from "../../redux/actions";
const GlowPaper = styled(Paper)(({ theme }) => ({
  background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  overflow: "hidden",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: "all 0.3s ease",
  "&:nth-of-type(odd)": {
    backgroundColor: "#fafbff",
  },
  "&:hover": {
    backgroundColor: "#f0f4ff",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(41, 37, 81, 0.1)",
  },
  "&.MuiTableRow-root": {
    position: "relative",
  },
}));

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -468px 0 }
  100% { background-position: 468px 0 }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.4); }
  50% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.8); }
  100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.4); }
`;

const bounce = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
`;




const SkeletonRow = () => (
  <TableRow>
    {[1, 2, 3, 4, 5, 6, 7, 8].map((cell) => (
      <TableCell key={cell}>
        <Box
          sx={{
            animation: `${shimmer} 1.5s infinite`,
            background:
              "linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%)",
            backgroundSize: "800px 104px",
            height: "20px",
            borderRadius: "4px",
          }}
        />
      </TableCell>
    ))}
  </TableRow>
);

const TableStatusSelect = ({ value, onChange, options }) => {
  const statusOptions = Object.keys(options);
  const [selected, setSelected] = useState(value || "");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setSelected(value);
    if (value) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <Select
        value={selected}
        onChange={onChange}
        displayEmpty
        input={<OutlinedInput notched={false} />}
        renderValue={(selectedVal) => {
          const config = options[selectedVal];
          if (!config) return <Box>Select Status</Box>;

          return (
            <Fade in={!!selectedVal}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: config.backgroundColor,
                  color: config.color,
                  px: 1.5,
                  py: 0.6,
                  borderRadius: 1.5,
                  fontWeight: 600,
                  justifyContent: "center",
                  minWidth: "110px",
                  textAlign: "center",
                  transition: "all 0.4s ease",
                  animation: animate ? `${glow} 0.6s ease` : "none",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    animation: animate ? `${bounce} 0.4s ease` : "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {config.icon}
                </Box>
                {config.label}
              </Box>
            </Fade>
          );
        }}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
          "& .MuiSelect-icon": {
            color: "#1976d2",
            right: 8,
          },
        }}
      >
        {statusOptions.map((status) => {
          const config = options[status];
          return (
            <MenuItem
              key={status}
              value={status}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: config.backgroundColor,
                color: config.color,
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: config.backgroundColor,
                  opacity: 0.9,
                },
              }}
            >
              {config.icon}
              {config.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

const RevisionStudentsPage = () => {
  const dispatch = useDispatch();
  const { students, loading, error } = useSelector(
    (state) => state.studentprogram
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [updatingPayment, setUpdatingPayment] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    dispatch(fetchRevisionStudents());
  }, [dispatch]);

  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedStudent) {
      dispatch(deleteRevisionStudent(selectedStudent.id));
    }
    setIsDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setSelectedStudent(null);
  };

  const handleRowExpand = (studentId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleStudentStatusChange = (studentId, newStatus) => {
    dispatch(updateStudentStatus(studentId, newStatus));
  };

  const handlePaymentStatusChange = async (
    studentId,
    installmentNumber,
    newStatus
  ) => {
    setUpdatingPayment({ studentId, installmentNumber });
    try {
      await dispatch(
        updatePaymentStatus(studentId, installmentNumber, newStatus)
      );
    } catch (err) {
      console.error("Failed to update payment status:", err);
    } finally {
      setUpdatingPayment(null);
    }
  };

  const handlePaymentToggle = (studentId, installmentNumber, currentStatus) => {
    const newStatus = currentStatus === "Paid" ? "Unpaid" : "Paid";
    handlePaymentStatusChange(studentId, installmentNumber, newStatus);
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f8fc",
        p: 3,
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Slide
        direction="down"
        in={true}
        mountOnEnter
        unmountOnExit
        timeout={500}
      >
        <GlowPaper
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            animation: `${fadeIn} 0.5s ease-out`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  color: "#292551",
                  fontWeight: 700,
                  mb: 0.5,
                  background: "linear-gradient(45deg, #292551, #3b82f6)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Revision Program Students
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View and manage students enrolled in the revision program.
              </Typography>
            </Box>
          </Box>
        </GlowPaper>
      </Slide>
      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={700}>
        <GlowPaper
          sx={{
            p: 2,
            overflowX: "auto",
            animation: `${slideUp} 0.7s ease-out`,
          }}
        >
          {loading ? (
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table sx={{ minWidth: 1200 }} aria-label="students table">
                <TableHead>
                  <TableRow>
                    {revisionStudentsColumns.map((column) => (
                      <TableCell
                        key={column.id}
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          color: "#1e3a8a",
                          borderBottom: "2px solid #3b82f6",
                          fontSize: "1rem",
                          p: 2,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(5)].map((_, index) => (
                    <SkeletonRow key={index} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : error ? (
            <Alert
              severity="error"
              sx={{
                borderRadius: "12px",
                animation: `${pulse} 0.5s ease-in-out`,
              }}
            >
              {error}
            </Alert>
          ) : students.length > 0 ? (
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table
                stickyHeader
                sx={{ minWidth: 1200 }}
                aria-label="students table"
              >
                <TableHead>
                  <TableRow>
                    {revisionStudentsColumns.map((column) => (
                      <TableCell
                        key={column.id}
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          color: "#1e3a8a",
                          borderBottom: "2px solid #3b82f6",
                          fontSize: "1rem",
                          p: 2,
                          whiteSpace: "nowrap",
                          backgroundColor: "#f8faff",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student, index) => (
                    <React.Fragment key={student.id}>
                      <StyledTableRow
                        onMouseEnter={() => setHoveredRow(student.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        sx={{
                          ...(hoveredRow === student.id && {
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              borderRadius: "8px",
                              boxShadow: "0 0 0 2px #3b82f6",
                              pointerEvents: "none",
                            },
                          }),
                        }}
                      >
                        <TableCell
                          align="center"
                          sx={{ fontSize: "0.9rem", p: 1.5 }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "0.9rem",
                            p: 1.5,
                            fontWeight: "bold",
                          }}
                        >
                          {student.fullName}
                        </TableCell>

                        {/* New Cells for contact numbers, subjects, and batch preference */}
                        <TableCell
                          align="center"
                          sx={{ fontSize: "0.9rem", p: 1.5 }}
                        >
                          {student.studentContactNumber}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontSize: "0.9rem", p: 1.5 }}
                        >
                          {student.parentContactNumber}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontSize: "0.9rem", p: 1.5 }}
                        >
                          {student.courseAppliedFor}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontSize: "0.9rem", p: 1.5 }}
                        >
                          {student.currentClass}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontSize: "0.9rem", p: 1.5 }}
                        >
                          {student.subjects === "ALL"
                            ? "Physics, Chemistry, Maths"
                            : student.subjects === "ONLYCHEM"
                            ? "Chemistry"
                            : "Not specified"}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontSize: "0.9rem", p: 1.5 }}
                        >
                          {student.batchPreference}
                        </TableCell>
                        {/* End of new cells */}

                        <TableCell
                          align="center"
                          sx={{ fontSize: "0.9rem", p: 1.5 }}
                        >
                          {new Date(
                            student.registrationDate._seconds * 1000
                          ).toLocaleDateString("en-GB")}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontSize: "0.9rem", p: 1.5 }}
                        >
                          <TableStatusSelect
                            value={student.status || "Inactive"}
                            onChange={(e) =>
                              handleStudentStatusChange(
                                student.id,
                                e.target.value
                              )
                            }
                            options={revisionStudentStatusConfig}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View Payment Plan" arrow>
                            <IconButton
                              onClick={() => handleRowExpand(student.id)}
                              sx={{
                                transition: "all 0.3s ease",
                                color: expandedRows[student.id]
                                  ? "primary.main"
                                  : "text.secondary",
                                backgroundColor: expandedRows[student.id]
                                  ? "rgba(59, 130, 246, 0.1)"
                                  : "transparent",
                                "&:hover": {
                                  color: "primary.dark",
                                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                                  transform: "rotate(180deg)",
                                },
                              }}
                            >
                              {expandedRows[student.id] ? (
                                <KeyboardArrowUp />
                              ) : (
                                <KeyboardArrowDown />
                              )}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </StyledTableRow>
                      {student.status === "Success" && (
                        <TableRow>
                          <TableCell
                            colSpan={revisionStudentsColumns.length}
                            sx={{ p: 0, border: 0 }}
                          >
                            <Collapse
                              in={expandedRows[student.id]}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box
                                sx={{
                                  p: 3,
                                  borderLeft: "4px solid #3b82f6",
                                  backgroundColor: "#f8faff",
                                  borderRadius: "0 0 8px 8px",
                                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                                  m: 1,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    mb: 2,
                                    color: "#292551",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Payment sx={{ mr: 1 }} /> Payment Plan for{" "}
                                  {student.fullName}
                                </Typography>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell sx={{ fontWeight: "bold" }}>
                                        Installment
                                      </TableCell>
                                      <TableCell sx={{ fontWeight: "bold" }}>
                                        Due Date
                                      </TableCell>
                                      <TableCell sx={{ fontWeight: "bold" }}>
                                        Amount
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          textAlign: "center",
                                        }}
                                      >
                                        Status
                                      </TableCell>
                                      <TableCell sx={{ fontWeight: "bold" }}>
                                        Toggle Payment
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {student.payments.map((payment) => (
                                      <TableRow
                                        key={payment.installment}
                                        sx={{
                                          "&:hover": {
                                            backgroundColor: "#f0f4ff",
                                          },
                                          transition: "all 0.2s ease",
                                        }}
                                      >
                                        <TableCell>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: "50%",
                                                backgroundColor: "#e3f2fd",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                mr: 1,
                                                fontWeight: "bold",
                                                color: "#1e88e5",
                                              }}
                                            >
                                              {payment.installment}
                                            </Box>
                                            Installment #{payment.installment}
                                          </Box>
                                        </TableCell>
                                        <TableCell>
                                          {new Date(
                                            payment.dueDate
                                          ).toLocaleDateString("en-GB")}
                                        </TableCell>
                                        <TableCell>
                                          <Box
                                            sx={{
                                              fontWeight: "bold",
                                              color: "#1e3a8a",
                                              display: "inline-flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            ₹{payment.amount}
                                          </Box>
                                        </TableCell>
                                        <TableCell>
                                          {updatingPayment?.studentId ===
                                            student.id &&
                                          updatingPayment?.installmentNumber ===
                                            payment.installment ? (
                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              <CircularProgress
                                                size={16}
                                                sx={{ mr: 1 }}
                                              />
                                              Updating...
                                            </Box>
                                          ) : (
                                            <TableStatusSelect
                                              value={payment.status}
                                              onChange={(e) =>
                                                handlePaymentStatusChange(
                                                  student.id,
                                                  payment.installment,
                                                  e.target.value
                                                )
                                              }
                                              options={revisionStudentspaymentStatusConfig}
                                            />
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          <Tooltip
                                            title={`Mark as ${
                                              payment.status === "Paid"
                                                ? "Unpaid"
                                                : "Paid"
                                            }`}
                                            arrow
                                          >
                                            <FormControlLabel
                                              control={
                                                <Switch
                                                  checked={
                                                    payment.status === "Paid"
                                                  }
                                                  onChange={() =>
                                                    handlePaymentToggle(
                                                      student.id,
                                                      payment.installment,
                                                      payment.status
                                                    )
                                                  }
                                                  disabled={
                                                    updatingPayment?.studentId ===
                                                      student.id &&
                                                    updatingPayment?.installmentNumber ===
                                                      payment.installment
                                                  }
                                                  color="success"
                                                />
                                              }
                                              label={
                                                payment.status === "Paid"
                                                  ? "Paid"
                                                  : "Unpaid"
                                              }
                                              sx={{
                                                "& .MuiFormControlLabel-label":
                                                  {
                                                    fontSize: "0.8rem",
                                                    fontWeight: "bold",
                                                    color:
                                                      payment.status === "Paid"
                                                        ? "#2e7d32"
                                                        : "#c62828",
                                                  },
                                              }}
                                            />
                                          </Tooltip>
                                          {payment.status === "Paid" &&
                                            payment.paidDate && (
                                              <Box
                                                sx={{
                                                  fontSize: "0.75rem",
                                                  color: "text.secondary",
                                                  mt: 0.5,
                                                }}
                                              >
                                                Paid on:{" "}
                                                {new Date(
                                                  payment.paidDate
                                                ).toLocaleDateString("en-GB")}
                                              </Box>
                                            )}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert
              severity="info"
              sx={{
                mt: 2,
                borderRadius: "12px",
                animation: `${fadeIn} 0.5s ease-out`,
              }}
            >
              No revision program students found.
            </Alert>
          )}
        </GlowPaper>
      </Slide>
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ color: "#d32f2f" }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the student{" "}
            <span style={{ fontWeight: "bold" }}>
              {selectedStudent?.fullName}
            </span>
            ? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton
            onClick={handleCancelDelete}
            color="primary"
            variant="outlined"
            sx={{ borderRadius: "20px" }}
          >
            Cancel
          </MuiButton>
          <MuiButton
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            autoFocus
            sx={{ borderRadius: "20px" }}
          >
            Delete
          </MuiButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RevisionStudentsPage;
