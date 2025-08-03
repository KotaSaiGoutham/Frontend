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
  Button as MuiButton, // Renamed to MuiButton to avoid conflict with react-icons/fa
  FormGroup,
  FormControlLabel,
  Checkbox,
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
  FaArrowRight, // NEW: Icon for "Move to Students" button
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { streamOptions, yearOptions, statusOptions } from "../mockdata/Options";

// Import your existing MuiInput and MuiDatePicker
import {
  MuiInput,
  MuiDatePicker,
  MuiSelect,
} from "./customcomponents/MuiCustomFormFields";

import TableStatusSelect from "./customcomponents/TableStatusSelect"; // Your specialized status select
import { fetchDemoClasses, updateDemoClassStatus } from "../redux/actions";

const DemoClassesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { demoClasses, loading, error } = useSelector(
    (state) => state.demoClasses
  );
  const { user, loading: userLoading } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    studentName: "",
    course: "",
    status: "",
    year: "",
    collegeName: "",
  });

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
    // NEW: Add visibility for the "Move to Students" column
    moveToStudents: true,
  });

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

  const handleColumnToggle = (column) => (event) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [column]: event.target.checked,
    }));
  };

  const handleStatusChange = (demoId, newStatus) => {
    dispatch(updateDemoClassStatus(demoId, newStatus));
  };

 const handleEdit = (student) => {
  navigate("/add-student", {
    state: { studentData: student, isDemo: true }
  });
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
      {/* Header Section (unchanged) */}
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

      {/* <Slide
        direction="right"
        in={true}
        mountOnEnter
        unmountOnExit
        timeout={600}
      >
        <Paper elevation={6} sx={{ p: 3, borderRadius: "12px" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{
                display: "flex",
                alignItems: "center",
                color: "#292551",
                fontWeight: 600,
              }}
            >
              <FaSearch
                style={{
                  marginRight: "10px",
                  fontSize: "1.8rem",
                  color: "#1976d2",
                }}
              />{" "}
              Filter Demo Classes
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
          >
            <MuiInput
              label="Student Name"
              name="studentName"
              value={filters.studentName}
              onChange={handleFilterChange}
              placeholder="Search by student name..."
              icon={FaUserCircle}
            />
            <MuiSelect
              label="Course"
              name="course"
              value={filters.course}
              onChange={handleFilterChange}
              options={streamOptions}
              icon={FaChalkboardTeacher}
            />
            <MuiSelect
              label="Status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              options={statusOptions}
              icon={FaCalendarCheck}
            />
            <MuiSelect
              label="Year"
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              options={yearOptions}
              icon={FaCalendarCheck}
            />
            <MuiInput
              label="College Name"
              name="collegeName"
              value={filters.collegeName}
              onChange={handleFilterChange}
              placeholder="Search by college name..."
              icon={FaUniversity}
            />
          </Box>
        </Paper>
      </Slide> */}

      <Paper
        elevation={6}
        sx={{ p: 2, overflowX: "auto", borderRadius: "12px" }}
      >
        <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Typography variant="h6" sx={{ width: "100%", mb: 1 }}>
            Show/Hide Columns:
          </Typography>
          <FormGroup row>
            {Object.entries(columnVisibility).map(([key, isVisible]) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={isVisible}
                    onChange={handleColumnToggle(key)}
                    name={key}
                  />
                }
                label={
                  key === "sNo"
                    ? "S.No."
                    : key === "contactNo"
                    ? "Contact No."
                    : key === "collegeName"
                    ? "College Name"
                    : key === "demoDate"
                    ? "Demo Date"
                    : key === "moveToStudents" // NEW: Added label for new column
                    ? "Move To Students"
                    : key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())
                }
              />
            ))}
          </FormGroup>
        </Box>
      </Paper>

      {/* Demo Classes List Table */}
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
                <TableHead
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                    backgroundColor: "#e3f2fd",
                  }}
                >
                  <TableRow
                    sx={{
                      borderBottom: "2px solid #1976d2",
                      backgroundColor: "#f5faff",
                    }}
                  >
                    {columnVisibility.sNo && (
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          color: "#1a237e",
                          fontSize: "1.05rem",
                          padding: "12px 8px",
                        }}
                      >
                        S.No.
                      </TableCell>
                    )}
                    {columnVisibility.studentName && (
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          minWidth: 150,
                          p: 1.5,
                          textTransform: "uppercase",
                          fontSize: "0.9rem",
                          color: "#1a237e",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <FaUserCircle
                            style={{ marginRight: 8, color: "#1976d2" }}
                          />
                          Student Name
                        </Box>
                      </TableCell>
                    )}
                    {columnVisibility.contactNo && (
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          minWidth: 150,
                          p: 1.5,
                          textTransform: "uppercase",
                          fontSize: "0.9rem",
                          color: "#1a237e",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FaPhone
                            style={{ marginRight: 8, color: "#1976d2" }}
                          />
                          Contact No.
                        </Box>
                      </TableCell>
                    )}
                    {columnVisibility.source && (
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          minWidth: 100,
                          p: 1.5,
                          textTransform: "uppercase",
                          fontSize: "0.9rem",
                          color: "#1a237e",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FaSearchDollar
                            style={{ marginRight: 8, color: "#1976d2" }}
                          />
                          Source
                        </Box>
                      </TableCell>
                    )}
                    {columnVisibility.year && (
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          minWidth: 80,
                          p: 1.5,
                          textTransform: "uppercase",
                          fontSize: "0.9rem",
                          color: "#1a237e",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FaCalendarCheck
                            style={{ marginRight: 8, color: "#1976d2" }}
                          />
                          Year
                        </Box>
                      </TableCell>
                    )}
                    {columnVisibility.course && (
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          minWidth: 120,
                          p: 1.5,
                          textTransform: "uppercase",
                          fontSize: "0.9rem",
                          color: "#1a237e",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FaChalkboardTeacher
                            style={{ marginRight: 8, color: "#1976d2" }}
                          />
                          Course
                        </Box>
                      </TableCell>
                    )}
                    {columnVisibility.collegeName && (
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          minWidth: 150,
                          p: 1.5,
                          textTransform: "uppercase",
                          fontSize: "0.9rem",
                          color: "#1a237e",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FaUniversity
                            style={{ marginRight: 8, color: "#1976d2" }}
                          />
                          College Name
                        </Box>
                      </TableCell>
                    )}
                    {columnVisibility.demoDate && (
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          minWidth: 120,
                          p: 1.5,
                          textTransform: "uppercase",
                          fontSize: "0.9rem",
                          color: "#1a237e",
                        }}
                      >
                        Demo Date
                      </TableCell>
                    )}
                    {columnVisibility.status && (
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          minWidth: 150,
                          p: 1.5,
                          textTransform: "uppercase",
                          fontSize: "0.9rem",
                          color: "#1a237e",
                        }}
                      >
                        Status
                      </TableCell>
                    )}
                    {/* NEW: Table header for "Move to Students" */}
                    {columnVisibility.moveToStudents && (
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          minWidth: 180, // Adjust minWidth as needed
                          p: 1.5,
                          textTransform: "uppercase",
                          fontSize: "0.9rem",
                          color: "#1a237e",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FaArrowRight
                            style={{ marginRight: 8, color: "#1976d2" }}
                          />
                          Move To Students
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
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
                          sx={{
                            fontSize: "0.85rem",
                            padding: "10px 8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {demo.studentName}
                        </TableCell>
                      )}
                      {columnVisibility.contactNo && (
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "0.85rem",
                            padding: "10px 8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {demo.contactNo}
                        </TableCell>
                      )}
                      {columnVisibility.source && (
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "0.85rem",
                            padding: "10px 8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {demo.source}
                        </TableCell>
                      )}
                      {columnVisibility.year && (
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "0.85rem",
                            padding: "10px 8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {demo.year}
                        </TableCell>
                      )}
                      {columnVisibility.course && (
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "0.85rem",
                            padding: "10px 8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {demo.course}
                        </TableCell>
                      )}
                      {columnVisibility.collegeName && (
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "0.85rem",
                            padding: "10px 8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {demo.collegeName}
                        </TableCell>
                      )}
                      {columnVisibility.demoDate && (
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "0.85rem",
                            padding: "10px 8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {demo.demoDate}
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
                          />
                        </TableCell>
                      )}
                      {/* NEW: Table cell for "Move to Students" button */}
                      {columnVisibility.moveToStudents && (
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "0.85rem",
                            padding: "10px 8px",
                            minWidth: 180,
                          }}
                        >
                          {demo.status === "Success" && (
                            <MuiButton
                              variant="contained"
                              size="small"
                              startIcon={<FaArrowRight />}
                              onClick={() => handleEdit(demo)}
                              sx={{
                                bgcolor: "#28a745", // Green color for success action
                                "&:hover": { bgcolor: "#218838" },
                                borderRadius: "6px",
                                textTransform: "none", // Prevent uppercase
                                fontSize: "0.8rem",
                                px: 1.5,
                                py: 0.5,
                              }}
                            >
                              Move
                            </MuiButton>
                          )}
                          {demo.status !== "Success" && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              (Not Success)
                            </Typography>
                          )}
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
    </Box>
  );
};

export default DemoClassesPage;
