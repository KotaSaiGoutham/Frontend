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
  ToggleButtonGroup,
  ToggleButton,
  Card,
  LinearProgress,
  TableHead,
  Avatar,
  Grid,
  useTheme,       // <--- Added
  useMediaQuery,  // <--- Added
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
  FaTable,
  FaTh,
  FaStream,
  FaTachometerAlt,
  FaTrash,
  FaChevronDown,
  FaChevronRight,
  FaChartLine,
  FaCalendarAlt,
  FaUserGraduate,
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

// Helper functions
const calculateTotal = (exam, user) => {
  let total = 0;
  if (user?.isPhysics) total += exam.physics || 0;
  if (user?.isChemistry) total += exam.chemistry || 0;
  if (user?.isMaths) total += exam.maths || 0;
  return total;
};

const calculatePercentage = (exam, user) => {
  let maxTotal = 0;
  let scoredTotal = 0;
  
  if (user?.isPhysics) {
    maxTotal += exam.maxPhysics || 100;
    scoredTotal += exam.physics || 0;
  }
  if (user?.isChemistry) {
    maxTotal += exam.maxChemistry || 100;
    scoredTotal += exam.chemistry || 0;
  }
  if (user?.isMaths) {
    maxTotal += exam.maxMaths || 100;
    scoredTotal += exam.maths || 0;
  }
  
  return maxTotal > 0 ? Math.round((scoredTotal / maxTotal) * 100) : 0;
};

const calculateAverageScore = (exams, user) => {
  if (exams.length === 0) return 0;
  const totalPercentage = exams.reduce((sum, exam) => sum + calculatePercentage(exam, user), 0);
  return Math.round(totalPercentage / exams.length);
};

// Enhanced View Components
const CardView = ({ exams, user, handleEdit, handleDeleteClick, students }) => {
  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }, 
      gap: 3,
      padding: 2 
    }}>
      {exams.map((exam, index) => (
        <Card 
          key={exam.id} 
          sx={{ 
            p: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': { 
              transform: 'translateY(-8px) scale(1.02)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcf7f)',
            }
          }}
        >
          {/* Student Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
            <Avatar 
              sx={{ 
                width: 50, 
                height: 50, 
                bgcolor: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              {exam.studentName?.charAt(0)?.toUpperCase() || 'S'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: '800', fontSize: '1.1rem' }}>
                {exam.studentName}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.8rem' }}>
                {new Date(exam.examDate).toLocaleDateString('en-GB', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </Typography>
            </Box>
            <Chip 
              label={exam.status} 
              sx={{
                bgcolor: exam.status === 'Present' ? 'rgba(76, 175, 80, 0.9)' :
                        exam.status === 'Absent' ? 'rgba(244, 67, 54, 0.9)' :
                        exam.status === 'Pending' ? 'rgba(255, 152, 0, 0.9)' : 'rgba(158, 158, 158, 0.9)',
                color: 'white',
                fontWeight: '700',
                fontSize: '0.7rem',
                height: '24px'
              }}
            />
          </Box>

          {/* Exam Details */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 2, 
            mb: 3,
            background: 'rgba(255,255,255,0.1)',
            padding: 2,
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <FaGraduationCap style={{ fontSize: '1.2rem', marginBottom: '4px', opacity: 0.8 }} />
              <Typography variant="caption" sx={{ display: 'block', opacity: 0.8, fontSize: '0.7rem' }}>
                Stream
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '0.9rem' }}>
                {exam.stream}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <FaChartLine style={{ fontSize: '1.2rem', marginBottom: '4px', opacity: 0.8 }} />
              <Typography variant="caption" sx={{ display: 'block', opacity: 0.8, fontSize: '0.7rem' }}>
                Type
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '0.9rem' }}>
                {exam.examType}
              </Typography>
            </Box>
          </Box>

          {/* Scores with Progress Bars */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: '700', textAlign: 'center', opacity: 0.9 }}>
              SUBJECT SCORES
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {user?.isPhysics && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: '600', opacity: 0.9 }}>Physics</Typography>
                    <Typography variant="caption" sx={{ fontWeight: '700' }}>
                      {exam.physics || 0}/{exam.maxPhysics || 100}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={((exam.physics || 0) / (exam.maxPhysics || 100)) * 100} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#ff6b6b',
                        borderRadius: 3,
                      }
                    }}
                  />
                </Box>
              )}
              {user?.isChemistry && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: '600', opacity: 0.9 }}>Chemistry</Typography>
                    <Typography variant="caption" sx={{ fontWeight: '700' }}>
                      {exam.chemistry || 0}/{exam.maxChemistry || 100}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={((exam.chemistry || 0) / (exam.maxChemistry || 100)) * 100} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#4ecdc4',
                        borderRadius: 3,
                      }
                    }}
                  />
                </Box>
              )}
              {user?.isMaths && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: '600', opacity: 0.9 }}>Maths</Typography>
                    <Typography variant="caption" sx={{ fontWeight: '700' }}>
                      {exam.maths || 0}/{exam.maxMaths || 100}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={((exam.maths || 0) / (exam.maxMaths || 100)) * 100} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#45b7d1',
                        borderRadius: 3,
                      }
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <IconButton 
              size="small" 
              onClick={() => handleEdit(exam)}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                transition: 'all 0.3s ease',
                borderRadius: '10px',
                padding: '8px'
              }}
            >
              <FaEdit />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => handleDeleteClick(exam)} 
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(244,67,54,0.3)' },
                transition: 'all 0.3s ease',
                borderRadius: '10px',
                padding: '8px'
              }}
            >
              <FaTrash />
            </IconButton>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

const EnhancedTable = ({ exams, user, columnVisibility, editingCell, handleStartEdit, handleSaveEdit, handleEdit, handleDeleteClick, handleStatusChange, students }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: '20px',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.5)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Table sx={{ minWidth: 1200 }} aria-label="student exams table">
        <TableHeaders columns={getExamTableColumns(user)} />
        <TableBody>
          {exams.map((exam, index) => {
            const studentData = students.find(
              (s) => s.id === exam.studentId
            );
            const examType = exam.examType || "E-EA";

            if (!columnVisibility.sNo) return null;

            return (
              <TableRow
                key={exam.id}
                sx={{
                  background: index % 2 === 0 ? 'rgba(102, 126, 234, 0.02)' : 'transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.08)',
                    transform: 'scale(1.002)',
                  },
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                }}
              >
                {/* S.No */}
                {columnVisibility.sNo && (
                  <TableCell
                    align="center"
                    sx={{ 
                      fontSize: "0.9rem", 
                      padding: "16px 12px",
                      fontWeight: '600',
                      color: 'primary.main'
                    }}
                  >
                    {index + 1}
                  </TableCell>
                )}

                {/* Student Name */}
                {columnVisibility.studentName && (
                  <TableCell
                    align="center"
                    sx={{ fontSize: "0.9rem", padding: "16px 12px" }}
                  >
                    <Tooltip
                      title={`Click to view details for ${exam.studentName}`}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 2,
                        }}
                      >
                        <Avatar 
                          sx={{ 
                            width: 36, 
                            height: 36, 
                            bgcolor: 'primary.main',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {exam.studentName?.charAt(0)?.toUpperCase() || 'S'}
                        </Avatar>
                        <Link
                          to={`/student/${exam.studentId}/profile`}
                          state={{ studentData: studentData }}
                          style={{
                            fontWeight: 600,
                            color: "#34495e",
                            textDecoration: "none",
                            transition: "all 0.3s ease",
                            fontSize: '0.95rem'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#2980b9";
                            e.currentTarget.style.textDecoration = "underline";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "#34495e";
                            e.currentTarget.style.textDecoration = "none";
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
                                sx={{
                                  height: "22px",
                                  fontSize: "0.6rem",
                                  fontWeight: "800",
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  color: "white",
                                  "& .MuiChip-label": {
                                    px: 0.5,
                                    py: 0.25,
                                  },
                                }}
                              />
                            )}
                            {exam.testType.includes("cumulativeTest") && (
                              <Chip
                                label="CT"
                                size="small"
                                sx={{
                                  height: "22px",
                                  fontSize: "0.6rem",
                                  fontWeight: "800",
                                  background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                                  color: "white",
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
                                sx={{
                                  height: "22px",
                                  fontSize: "0.6rem",
                                  fontWeight: "800",
                                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                                  color: "white",
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
                    sx={{ fontSize: "0.9rem", padding: "16px 12px" }}
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
                    sx={{ fontSize: "0.9rem", padding: "16px 12px" }}
                  >
                    {exam.stream}
                  </TableCell>
                )}

                {/* Topic */}
                {columnVisibility.topic && (
                  <TableCell
                    align="center"
                    sx={{ fontSize: "0.9rem", padding: "16px 12px" }}
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
                    sx={{ fontSize: "0.9rem", padding: "16px 12px" }}
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
                      fontSize: "0.9rem",
                      padding: "16px 12px",
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
  );
};

// Main Component
const StudentExamPage = ({ isRevisionProgramJEEMains2026Student = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  // --- ADDED: Theme and Media Query ---
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { studentExams, loading, error } = useSelector(
    (state) => state.studentExams
  );

  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useSelector((state) => state.students);

  // --- CHANGED: View Mode State Initialization and Effect ---
  // Default to 'card' if mobile, otherwise 'table' (or keep 'table' for desktop)
  const [viewMode, setViewMode] = useState('table');

  // Effect to automatically switch view mode based on screen size
  useEffect(() => {
    if (isMobile) {
      setViewMode('card');
    } else {
      // Optional: You can revert to table on desktop or leave it as is
      setViewMode('table'); 
    }
  }, [isMobile]);

  const [editingCell, setEditingCell] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  // Simplified Filters state - Only student filter
  const [filters, setFilters] = useState({
    studentName: "",
    examType: "E-EA",
  });

  // Temporary filters for drawer
  const [tempFilters, setTempFilters] = useState({
    studentName: "",
    examType: "E-EA",
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

  // Handle view mode change
  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

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

  // Handle filter changes
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
      examType: "E-EA",
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

  // Student options for dropdown
  const studentOptions = useMemo(() => {
    const uniqueStudents = [];
    const studentMap = new Map();
    
    studentExams.forEach(exam => {
      if (exam.studentName && !studentMap.has(exam.studentName)) {
        studentMap.set(exam.studentName, true);
        uniqueStudents.push({
          value: exam.studentName,
          label: exam.studentName
        });
      }
    });
    
    return [
      { value: "", label: "All Students" },
      ...uniqueStudents.sort((a, b) => a.label.localeCompare(b.label))
    ];
  }, [studentExams]);

  const examTypeOptions = [
    { value: "E-EA", label: "Exam by EA" },
    { value: "CA", label: "Exam by College" },
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
    dispatch(fetchStudentExams(filters.examType));
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
      dispatch(fetchStudentExams(filters.examType));
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
      dispatch(fetchStudentExams(filters.examType));
    }
  };

  useEffect(() => {
    dispatch(fetchStudentExams(filters.examType));
  }, [dispatch, filters.examType]);

  // Filter exams based on student selection
  const filteredAndSortedExams = useMemo(() => {
    let filteredExams = [...studentExams];

    // Filter by student name if selected
    if (filters.studentName) {
      filteredExams = filteredExams.filter((exam) =>
        exam.studentName?.toLowerCase().includes(filters.studentName.toLowerCase())
      );
    }

    // Filter by revision program students if the flag is true
    if (isRevisionProgramJEEMains2026Student && students && students.length > 0) {
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
        const revisionProgramStartDate = new Date("2025-10-06T00:00:00.000Z");
        const revisionProgramEndDate = new Date("2026-01-21T23:59:59.999Z");
        
        return (
          examDate >= revisionProgramStartDate &&
          examDate <= revisionProgramEndDate
        );
      });
    }

    // Sort the exams - LATEST EXAMS FIRST
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

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalExams = filteredAndSortedExams.length;
    const averageScore = calculateAverageScore(filteredAndSortedExams, user);
    
    // If a specific student is selected, calculate their specific stats
    if (filters.studentName) {
      const studentExams = filteredAndSortedExams.filter(
        exam => exam.studentName === filters.studentName
      );
      const studentAverage = calculateAverageScore(studentExams, user);
      
      return {
        totalExams: studentExams.length,
        averageScore: studentAverage,
        isStudentSpecific: true,
        studentName: filters.studentName
      };
    }
    
    return {
      totalExams,
      averageScore,
      isStudentSpecific: false
    };
  }, [filteredAndSortedExams, user, filters.studentName]);

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
    dispatch(fetchStudentExams(e.target.value));
    setFilters((prev) => ({ ...prev, examType: e.target.value }));
  };

  const renderView = () => {
    switch (viewMode) {
      case 'card':
        return <CardView exams={filteredAndSortedExams} user={user} handleEdit={handleEdit} handleDeleteClick={handleDeleteClick} students={students} />;
      default:
        return <EnhancedTable 
          exams={filteredAndSortedExams} 
          user={user} 
          columnVisibility={columnVisibility}
          editingCell={editingCell}
          handleStartEdit={handleStartEdit}
          handleSaveEdit={handleSaveEdit}
          handleEdit={handleEdit}
          handleDeleteClick={handleDeleteClick}
          handleStatusChange={handleStatusChange}
          students={students}
        />;
    }
  };

  // Enhanced View Switcher
  const ViewSwitcher = () => (
    <ToggleButtonGroup
      value={viewMode}
      exclusive
      onChange={handleViewModeChange}
      aria-label="view mode"
      sx={{
        bgcolor: 'white',
        borderRadius: '15px',
        padding: '4px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0,0,0,0.05)'
      }}
    >
      {[
        { value: 'table', icon: FaTable, label: 'Table', color: '#667eea' },
        { value: 'card', icon: FaTh, label: 'Cards', color: '#4ecdc4' },
      ].map(({ value, icon: Icon, label, color }) => (
        <ToggleButton
          key={value}
          value={value}
          aria-label={label}
          sx={{
            padding: '12px 20px',
            borderRadius: '12px',
            border: 'none',
            transition: 'all 0.3s ease',
            '&.Mui-selected': {
              bgcolor: color,
              color: 'white',
              transform: 'scale(1.05)',
              boxShadow: `0 6px 20px ${color}40`,
              '&:hover': {
                bgcolor: color,
              }
            },
            '&:not(.Mui-selected)': {
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.02)',
                transform: 'scale(1.02)',
              }
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon style={{ fontSize: '1.3rem' }} />
            <Typography variant="body2" sx={{ fontWeight: '600' }}>
              {label}
            </Typography>
          </Box>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );

// Balanced Statistics Cards Component (4 Cards)
const StatisticsCards = () => {
  const additionalStats = useMemo(() => {
    const presentExams = filteredAndSortedExams.filter(exam => exam.status === 'Present').length;
    const highPerformers = filteredAndSortedExams.filter(exam => calculatePercentage(exam, user) >= 75).length;
    const attendanceRate = statistics.totalExams > 0 
      ? Math.round((presentExams / statistics.totalExams) * 100)
      : 0;

    return {
      presentExams,
      attendanceRate,
      highPerformers
    };
  }, [filteredAndSortedExams, user, statistics.totalExams]);

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        flexWrap: 'wrap',
        justifyContent: { xs: 'center', sm: 'flex-start' }
      }}>
        {/* Total Exams Card */}
        <Paper
          sx={{
            p: 2,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            minWidth: '180px',
            flex: '1 1 auto',
            maxWidth: '220px',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <FaTachometerAlt style={{ fontSize: '1.5rem', opacity: 0.9, marginRight: '8px' }} />
            <Typography variant="h5" fontWeight="800">
              {statistics.totalExams}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: '600' }}>
            {statistics.isStudentSpecific ? `${statistics.studentName}'s Exams` : 'Total Exams'}
          </Typography>
        </Paper>

        {/* Average Score Card */}
        <Paper
          sx={{
            p: 2,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            minWidth: '180px',
            flex: '1 1 auto',
            maxWidth: '220px',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <FaChartLine style={{ fontSize: '1.5rem', opacity: 0.9, marginRight: '8px' }} />
            <Typography variant="h5" fontWeight="800">
              {statistics.averageScore}%
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: '600' }}>
            {statistics.isStudentSpecific ? `${statistics.studentName}'s Average` : 'Overall Average'}
          </Typography>
        </Paper>

      </Box>
    </Box>
  );
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
              borderRadius: "20px",
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.5)',
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '15px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: "15px",
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)'
                }}
              >
                <FaGraduationCap
                  style={{
                    fontSize: "2rem",
                    color: "white",
                  }}
                />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{ 
                    color: "#292551", 
                    fontWeight: 800, 
                    mb: 0.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                  }}
                >
                  Student Exams
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: '500' }}>
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
              {/* Student Filter */}
              <FormControl size="small" sx={{ width: 150, mb: 0 }}>
                <InputLabel sx={{ fontSize: "0.9rem" }}>Select Student</InputLabel>
                <Select
                  value={filters.studentName}
                  label="Select Student"
                  name="studentName"
                  onChange={(e) => setFilters(prev => ({ ...prev, studentName: e.target.value }))}
                  sx={{
                    height: "40px",
                    borderRadius: "12px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                    "& .MuiSelect-select": {
                      paddingTop: "8px",
                      paddingBottom: "8px",
                    },
                  }}
                >
                  {studentOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Exam Type Filter */}
              <FormControl size="small" sx={{ width: 150, mb: 0 }}>
                <InputLabel sx={{ fontSize: "0.9rem" }}>Exam Type</InputLabel>
                <Select
                  value={filters.examType}
                  label="Exam Type"
                  onChange={handleExamTypeChange}
                  sx={{
                    height: "40px",
                    borderRadius: "12px",
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

              {/* View Mode Switcher - Hide on Mobile */}
              {!isMobile && <ViewSwitcher />}

              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>

                <MuiButton
                  variant="contained"
                  startIcon={<FaPlus />}
                  onClick={() => navigate("/add-student-exam")}
                  sx={{
                    height: "40px",
                    bgcolor: "#1976d2",
                    "&:hover": { bgcolor: "#1565c0" },
                    borderRadius: "12px",
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

      {/* Statistics Cards */}
      <StatisticsCards />

      {/* Main Content Section */}
      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={700}>
        <Paper
          elevation={6}
          sx={{
            p: !isRevisionProgramJEEMains2026Student ? 3 : 1,
            overflowX: "auto",
            borderRadius: "20px",
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.5)',
            minHeight: '400px'
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: '400px' }}>
              <CircularProgress 
                size={60} 
                sx={{ 
                  color: 'primary.main',
                }} 
              />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ borderRadius: '15px', mt: 2 }}>
              {error.message || "An unknown error occurred"}
            </Alert>
          ) : filteredAndSortedExams.length > 0 ? (
            renderView()
          ) : (
            <Alert severity="info" sx={{ borderRadius: '15px', mt: 2 }}>
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