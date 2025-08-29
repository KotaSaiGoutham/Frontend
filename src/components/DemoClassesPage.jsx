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
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Slide,
  Button as MuiButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Tooltip,
  IconButton,
  Menu, // Import Menu
  MenuItem, // Import MenuItem
  ListItemIcon, // Import ListItemIcon
  ListItemText, // Import ListItemText
  Dialog, // Import Dialog for confirmation
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  FaChalkboardTeacher,
  FaSearch,
  FaUserCircle,
  FaPhone,
  FaUniversity,
  FaCalendarCheck,
  FaSearchDollar,
  FaPlus,
  FaArrowRight,
  FaEdit,
  FaTrashAlt,
  FaEllipsisV, // Import the ellipsis icon
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { streamOptions, yearOptions, statusOptions, demoStatusConfig } from "../mockdata/Options";

import {
  MuiInput,
  MuiDatePicker,
  MuiSelect,
} from "./customcomponents/MuiCustomFormFields";

import TableStatusSelect from "./customcomponents/TableStatusSelect";
import {
  fetchDemoClasses,
  updateDemoClassStatus,
  deleteDemoClass,
} from "../redux/actions";
import { ActionButtons } from "./customcomponents/TableStatusSelect";
import TableHeaders from "./students/TableHeaders";
import { demoTableColumns } from "../mockdata/Options";
const DemoClassesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { demoClasses, loading, error } = useSelector(
    (state) => state.demoClasses
  );
  const { user, loading: userLoading } = useSelector((state) => state.auth);

  // State for filters
  const [filters, setFilters] = useState({
    studentName: "",
    course: "",
    status: "",
    year: "",
    collegeName: "",
  });

  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState({
    sNo: true,
    studentName: true,
    contactNo: false,
    source: false,
    year: true,
    course: true,
    collegeName: false,
    demoDate: true,
    status: true,
    moveToStudents: true,
    actions: true,
  });

  // State for the actions menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const open = Boolean(anchorEl);

  // State for the delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchDemoClasses());
  }, [dispatch]);

  // Handler for opening the actions menu
  const handleClick = (event, demo) => {
    setAnchorEl(event.currentTarget);
    setSelectedDemo(demo);
  };

  // Handler for closing the actions menu
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedDemo(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleColumnToggle = (column) => (event) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [column]: event.target.checked,
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

  // Handler to open the delete confirmation dialog
  const handleDeleteClick = (demo) => {
    setSelectedDemo(demo);
    setIsDeleteDialogOpen(true);
  };

  // Handler to confirm deletion
  const handleConfirmDelete = () => {
    if (selectedDemo) {
      // Dispatch the delete action
      dispatch(deleteDemoClass(selectedDemo.id))
        .then(() => {
          // After a successful deletion, dispatch the fetch action
          dispatch(fetchDemoClasses());
        })
        .catch((error) => {
          // You might want to handle errors here, e.g., show an error message
          console.error("Failed to delete demo class:", error);
        });
    }
    setIsDeleteDialogOpen(false);
    handleClose();
  };

  // Handler to cancel deletion
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    handleClose();
  };

  const filteredDemoClasses = demoClasses.filter((demo) => {
    return (
      demo.studentName
        .toLowerCase()
        .includes(filters.studentName.toLowerCase()) &&
      (filters.course === "" || demo.course === filters.course) &&
      (filters.status === "" || demo.status === filters.status) &&
      (filters.year === "" || demo.year === filters.year) &&
      (filters.collegeName === "" ||
        demo.collegeName
          .toLowerCase()
          .includes(filters.collegeName.toLowerCase()))
    );
  });

  const sortedFilteredDemoClasses = filteredDemoClasses.sort((a, b) => {
    const dateA = a.demoDate
      ? new Date(a.demoDate.split(".").reverse().join("-"))
      : new Date(0);
    const dateB = b.demoDate
      ? new Date(b.demoDate.split(".").reverse().join("-"))
      : new Date(0);
    return dateB - dateA;
  });

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
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FaChalkboardTeacher
              style={{
                marginRight: "15px",
                fontSize: "2.5rem",
                color: "#1976d2",
              }}
            />
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{ color: "#292551", fontWeight: 700, mb: 0.5 }}
              >
                Demo Classes Overview
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage and filter your demo class records.
              </Typography>
            </Box>
          </Box>
          <MuiButton
            variant="contained"
            startIcon={<FaPlus />}
            onClick={() => navigate("/add-demo-class")}
            sx={{
              bgcolor: "#1976d2",
              "&:hover": { bgcolor: "#1565c0" },
              borderRadius: "8px",
              px: 3,
              py: 1.2,
              minWidth: "180px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            Add New Demo Class
          </MuiButton>
        </Paper>
      </Slide>

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
            <Alert severity="error">{error}</Alert>
          ) : sortedFilteredDemoClasses.length > 0 ? (
            <TableContainer
              component={Paper}
              elevation={3}
              sx={{
                borderRadius: 2,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
              }}
            >
              <Table sx={{ minWidth: 1200 }} aria-label="demo classes table">
                <TableHeaders
                  columns={demoTableColumns}
                  columnVisibility={columnVisibility}
                />
                <TableBody>
                  {sortedFilteredDemoClasses.map((demo, index) => (
                    <TableRow
                      key={demo.id}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "#fbfcfd" },
                        "&:hover": {
                          backgroundColor: "#eef7ff",
                          cursor: "pointer",
                        },
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      {columnVisibility.sNo && (
                        <TableCell
                          align="center"
                          sx={{ fontSize: "0.85rem", padding: "10px 8px" }}
                        >
                          {index + 1}
                        </TableCell>
                      )}
                      {columnVisibility.studentName && (
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "0.85rem",
                            padding: "10px 8px",
                          }}
                        >
                          {demo.studentName}
                        </TableCell>
                      )}
                      {columnVisibility.demoDate && (
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "0.85rem",
                            padding: "10px 8px",
                          }}
                        >
                          {new Date(demo.demoDate).toLocaleDateString("en-GB")}{" "}
                        </TableCell>
                      )}
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
                            value={demo.status || ""}
                            onChange={(e) =>
                              handleStatusChange(demo.id, e.target.value)
                            }
                            options={demoStatusConfig}
                          />
                        </TableCell>
                      )}
                      {columnVisibility.moveToStudents && (
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "0.85rem",
                            padding: "10px 8px",
                            minWidth: 180,
                          }}
                        >
                          {demo.status === "Success" ? (
                            <MuiButton
                              variant="contained"
                              size="small"
                              startIcon={<FaArrowRight />}
                              onClick={() => handleMoveToStudents(demo)}
                              sx={{
                                bgcolor: "#28a745",
                                "&:hover": { bgcolor: "#218838" },
                                borderRadius: "6px",
                                textTransform: "none",
                                fontSize: "0.8rem",
                                px: 1.5,
                                py: 0.5,
                              }}
                            >
                              Move
                            </MuiButton>
                          ) : (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              (Not Success)
                            </Typography>
                          )}
                        </TableCell>
                      )}
                      {columnVisibility.actions && (
                        <TableCell align="center" sx={{ py: 1.5 }}>
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
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
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              No demo classes found matching your criteria.
            </Alert>
          )}
        </Paper>
      </Slide>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCancelDelete}
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
          <MuiButton onClick={handleCancelDelete} color="primary">
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
