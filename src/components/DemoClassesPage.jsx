import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DemoProgressTracker from "./customcomponents/DemoProgressTracker";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
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
  TextField,
  Tooltip,
  Chip,
  Avatar,
  Badge,
  Tabs,
  Tab,
} from "@mui/material";
import {
  FaChalkboardTeacher,
  FaPlus,
  FaArrowRight,
  FaEdit,
  FaCalendarAlt,
  FaClock,
  FaUserGraduate,
  FaUniversity,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { demoStatusConfig } from "../mockdata/Options";

import {
  fetchDemoClasses,
  updateDemoClassStatus,
  deleteDemoClass,
  updateDemoClass,
} from "../redux/actions";
import { ActionButtons } from "./customcomponents/TableStatusSelect";
import TableStatusSelect from "./customcomponents/TableStatusSelect";
import { formatFirebaseDate } from "../mockdata/function";

const DemoClassesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { demoClasses, loading, error } = useSelector(
    (state) => state.demoClasses
  );

  // State for filters
  const [filters, setFilters] = useState({
    studentName: "",
    course: "",
    status: "",
  });

  // State for remarks dialog
  const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
  const [currentRemarks, setCurrentRemarks] = useState("");
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchDemoClasses());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleStatusChange = (demoId, newStatus) => {
    dispatch(updateDemoClassStatus(demoId, newStatus));
  };

  const handleMoveToStudents = (student) => {
    navigate("/add-student", {
      state: { studentData: student, isDemo: true },
    });
  };

  const handleDeleteClick = (demo) => {
    setSelectedDemo(demo);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedDemo) {
      dispatch(deleteDemoClass(selectedDemo.id))
        .then(() => {
          dispatch(fetchDemoClasses());
        })
        .catch((error) => {
          console.error("Failed to delete demo class:", error);
        });
    }
    setIsDeleteDialogOpen(false);
  };

  const handleSaveRemarks = async () => {
    if (selectedDemo) {
      const updatedDemo = {
        ...selectedDemo,
        remarks: currentRemarks,
      };
      try {
        await dispatch(updateDemoClass(updatedDemo));
        setIsRemarksDialogOpen(false);
        setSelectedDemo(null);
        setCurrentRemarks("");
      } catch (error) {
        console.error("Failed to update remarks:", error);
      }
    }
  };

  // Filter demo classes based on filters and tab selection
  const filteredDemoClasses = demoClasses.filter((demo) => {
    const matchesSearch = demo.studentName
      .toLowerCase()
      .includes(filters.studentName.toLowerCase());

    const matchesCourse =
      filters.course === "" || demo.course === filters.course;
    const matchesStatus =
      filters.status === "" || demo.status === filters.status;

    // Tab filtering
    let matchesTab = true;
    if (activeTab === 1) matchesTab = demo.status === "Contacted";
    if (activeTab === 2) matchesTab = demo.status === "Demo scheduled";
    if (activeTab === 3) matchesTab = demo.status === "Demo completed";
    if (activeTab === 4) matchesTab = demo.status === "Success";

    return (
      matchesSearch &&
      matchesCourse &&
      matchesStatus &&
      matchesTab &&
      !demo.addstudenttostudenttable
    );
  });

  // Sort by date (newest first)
  const sortedDemoClasses = [...filteredDemoClasses].sort((a, b) => {
    const dateA = a.demoDate
      ? new Date(a.demoDate.split(".").reverse().join("-"))
      : new Date(0);
    const dateB = b.demoDate
      ? new Date(b.demoDate.split(".").reverse().join("-"))
      : new Date(0);
    return dateB - dateA;
  });

  // Status color mapping
  const getStatusColor = (status) => {
    const colors = {
      Contacted: "#9c27b0",
      "Demo scheduled": "#1976d2",
      "Demo completed": "#ed6c02",
      Success: "#2e7d32",
      Pending: "#757575",
      Cancelled: "#d32f2f",
    };
    return colors[status] || "#757575";
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
      {/* Header */}
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
            flexWrap: "wrap",
            gap: 2,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FaChalkboardTeacher
              style={{
                marginRight: "15px",
                fontSize: "2.5rem",
                color: "white",
              }}
            />
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: 700, mb: 0.5 }}
              >
                Demo Classes Overview
              </Typography>
              <Typography sx={{ opacity: 0.9 }}>
                Manage and track your demo class conversions
              </Typography>
            </Box>
          </Box>
          <MuiButton
            variant="contained"
            startIcon={<FaPlus />}
            onClick={() => navigate("/add-demo-class")}
            sx={{
              bgcolor: "white",
              color: "#667eea",
              "&:hover": { bgcolor: "#f5f5f5" },
              borderRadius: "8px",
              px: 3,
              py: 1.2,
              minWidth: "180px",
              fontWeight: 600,
            }}
          >
            Add New Demo
          </MuiButton>
        </Paper>
      </Slide>

      {/* Demo Classes Cards */}
      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={1100}>
        <Paper elevation={3} sx={{ p: 2, borderRadius: "12px" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">
              {error.error || "An unexpected error occurred."}
            </Alert>
          ) : sortedDemoClasses.length > 0 ? (
            <Grid container spacing={5} >
              {sortedDemoClasses.map((demo) => (
                <Grid item xs={12} md={6} lg={4} key={demo.id} style={{width:470}}>
                  <Card
                    elevation={2}
                    sx={{
                      height: "100%",
                      transition: "all 0.3s ease",
                      borderLeft: `4px solid ${getStatusColor(demo.status)}`,
                      "&:hover": {
                        elevation: 4,
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Header with Student Info and Actions */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                       <Box
  sx={{
    display: "flex",
    alignItems: "flex-start", // align from top
    gap: 2,
  }}
>
  <Avatar
    sx={{
      width: 56,
      height: 56,
      bgcolor: getStatusColor(demo.status),
      fontSize: "1.2rem",
      fontWeight: "bold",
      flexShrink: 0, // prevents squishing
      mt: 0.5, // subtle vertical alignment tweak
    }}
  >
    {demo.studentName.charAt(0).toUpperCase()}
  </Avatar>

  <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
    <Typography
      variant="h6"
      component="h3"
      fontWeight="600"
      sx={{ lineHeight: 1.2, mb: 0.8 }}
    >
      {demo.studentName}
    </Typography>
    <TableStatusSelect
      value={demo.status || ""}
      onChange={(e) => handleStatusChange(demo.id, e.target.value)}
      options={demoStatusConfig}
      fullWidth
      size="small"
      sx={{
        mt: 0,
        width: 180, // keeps dropdown narrower for better look
      }}
      compact
    />
  </Box>
</Box>

                        <ActionButtons
                          onEdit={() => {
                            navigate("/add-demo-class", {
                              state: { demoToEdit: demo },
                            });
                          }}
                          onDelete={() => handleDeleteClick(demo)}
                          size="small"
                        />
                      </Box>

                      {/* Progress Tracker */}
                      <Box sx={{ mb: 3 }}>
                        <DemoProgressTracker currentStatus={demo.status} />
                      </Box>

                      {/* Course and Details */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.5,
                          mb: 3,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <FaUserGraduate size={16} color="#666" />
                          <Typography variant="body1" fontWeight="500">
                            {demo.course}
                          </Typography>
                        </Box>

                        {demo.collegeName && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <FaUniversity size={16} color="#666" />
                            <Typography variant="body2" color="text.secondary">
                              {demo.collegeName}
                            </Typography>
                          </Box>
                        )}

                        {demo.contactNo && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <FaPhone size={14} color="#666" />
                            <Typography variant="body2" color="text.secondary">
                              {demo.contactNo}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Date and Time */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1,
                          mb: 3,
                          p: 2,
                          backgroundColor: "#f8f9fa",
                          borderRadius: 2,
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <FaCalendarAlt size={16} color="#1976d2" />
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              Date
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {new Date(demo.demoDate).toLocaleDateString(
                                "en-GB"
                              )}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <FaClock size={16} color="#1976d2" />
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              Time
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {new Date(
                                `1970-01-01T${demo.demoTime}:00`
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Remarks Section */}
                      <Box sx={{ mb: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            fontWeight="600"
                          >
                            Remarks
                          </Typography>
                          <Tooltip title="Edit Remarks">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedDemo(demo);
                                setCurrentRemarks(demo.remarks || "");
                                setIsRemarksDialogOpen(true);
                              }}
                            >
                              <FaEdit size={14} color="#666" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            p: 1.5,
                            backgroundColor: "#f8f9fa",
                            borderRadius: 1,
                            border: "1px solid #e0e0e0",
                            minHeight: "60px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {demo.remarks || "No remarks added"}
                        </Typography>
                      </Box>

                      {/* Actions Footer */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          pt: 2,
                          borderTop: "1px solid #e0e0e0",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Added:{" "}
                           { formatFirebaseDate(demo.createdAt)}
                        </Typography>

                        {demo.status === "Success" ? (
                          <MuiButton
                            variant="contained"
                            size="small"
                            startIcon={<FaArrowRight />}
                            onClick={() => handleMoveToStudents(demo)}
                            sx={{
                              bgcolor: "#4caf50",
                              "&:hover": { bgcolor: "#388e3c" },
                              borderRadius: "6px",
                              textTransform: "none",
                              fontSize: "0.8rem",
                              px: 2,
                              py: 0.8,
                              fontWeight: "600",
                            }}
                          >
                            Move to Students
                          </MuiButton>
                        ) : (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontStyle="italic"
                          >
                            Complete demo to move
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              No demo classes found matching your criteria.
            </Alert>
          )}
        </Paper>
      </Slide>

      {/* Remarks Edit Dialog */}
      <Dialog
        open={isRemarksDialogOpen}
        onClose={() => setIsRemarksDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Remarks for {selectedDemo?.studentName}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update the remarks for this demo class below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="remarks"
            label="Remarks"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={currentRemarks}
            onChange={(e) => setCurrentRemarks(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <MuiButton
            onClick={() => setIsRemarksDialogOpen(false)}
            color="error"
          >
            Cancel
          </MuiButton>
          <MuiButton
            onClick={handleSaveRemarks}
            color="primary"
            variant="contained"
          >
            Save
          </MuiButton>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the demo class for{" "}
            <span style={{ fontWeight: "bold" }}>
              {selectedDemo?.studentName}
            </span>
            ? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton
            onClick={() => setIsDeleteDialogOpen(false)}
            color="primary"
          >
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

export default DemoClassesPage;
