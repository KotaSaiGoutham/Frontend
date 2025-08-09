import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  IconButton,
  CircularProgress,
  Alert,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TableFooter,
  Button as MuiButton,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Fade,
  Divider 
} from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";
import {
  FaTrashAlt,
  FaEdit,
  FaPlus,
  FaChartBar,
  FaChartPie,
  FaRupeeSign,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
// Import your actions
import {
  fetchStudents,
  fetchExpenditures,
  deleteExpenditure,
} from "../redux/actions";
import "./ExpenditureDashboard.css";
import {
  yearOptions,
  monthOptions,
  expenditureColors,
} from "../mockdata/function";
import { ActionButtons } from "./customcomponents/TableStatusSelect";

const ExpenditureDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState({
    month: new Date().getMonth() + 1, // 1-12 (Current Month)
    year: new Date().getFullYear(), // Current Year
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExpenditure, setSelectedExpenditure] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  // --- Get State from Redux Store ---
  const confirmDelete = () => {
    if (selectedExpenditure) {
      dispatch(deleteExpenditure(selectedExpenditure.id));
      setSnackbar({
        open: true,
        message: `Deleted: ${selectedExpenditure.purpose} (₹${selectedExpenditure.amount})`,
        severity: "success",
      });
    }
    setDeleteDialogOpen(false);
    setSelectedExpenditure(null);
  };

  const { expenditures, loading, error,totalStudentPayments  } = useSelector(
    (state) => state.expenditures
  );
  console.log("totalStudentPayments",totalStudentPayments)

  const { students } = useSelector((state) => state.students);
  const { user } = useSelector((state) => state.auth);

  // --- Data Fetching Effect ---
  useEffect(() => {
    // Fetch expenditures for the selected month and year
    dispatch(fetchExpenditures(selectedDate.year, selectedDate.month));

    // Also fetch students data if needed for fee calculation
    dispatch(fetchStudents());
  }, [dispatch, selectedDate]); // Re-run when user changes the date


  const { totalExpenditure, chartData } = useMemo(() => {
    if (!expenditures) return { totalExpenditure: 0, chartData: [] };

    const total = expenditures.reduce((sum, item) => sum + item.amount, 0);
    const groupedData = expenditures.reduce((acc, item) => {
      const purpose = item.purpose || "Uncategorized";
      if (!acc[purpose]) {
        acc[purpose] = { name: purpose, amount: 0 };
      }
      acc[purpose].amount += item.amount;
      return acc;
    }, {});

    return {
      totalExpenditure: total,
      chartData: Object.values(groupedData),
    };
  }, [expenditures]);

  const netProfit = totalStudentPayments - totalExpenditure;

  // --- Chart Data Preparation ---
  const barChartData = useMemo(
    () => [
      {
        data: chartData.map((item) => item.amount),
        label: "Amount Spent",
        color: "#1976d2",
      },
    ],
    [chartData]
  );

  const pieChartData = useMemo(
    () =>
      chartData.map((item, index) => ({
        id: index,
        value: item.amount,
        label: item.name,
        color: expenditureColors[index % expenditureColors.length],
      })),
    [chartData]
  );

  // --- Handler Functions ---
  const handleEdit = (expenditureToEdit) => {
    // Navigate to the form, passing the expense data in the state
    navigate("/add-expenditure", { state: { expenditureToEdit } });
  };

  const handleDelete = (expenditure) => {
    setSelectedExpenditure(expenditure);
    setDeleteDialogOpen(true);
  };

  const handleMonthChange = (e) => {
    setSelectedDate((prev) => ({ ...prev, month: e.target.value }));
  };

  const handleYearChange = (e) => {
    setSelectedDate((prev) => ({ ...prev, year: e.target.value }));
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      {/* Header and Controls */}
      <Paper
        elevation={3}
        sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: "#ffffff" }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          <Typography variant="h5" fontWeight="bold" color="primary.dark">
            📊 Monthly Expenditures
          </Typography>
          <MuiButton
            variant="contained"
            startIcon={<FaPlus />}
            sx={{ mt: { xs: 2, sm: 0 } }}
            onClick={() => navigate("/add-expenditure")}
          >
            Add Expense
          </MuiButton>
        </Box>
        <Grid container spacing={2} sx={{ mt: 2 }} alignItems="center">
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedDate.month}
                label="Month"
                onChange={handleMonthChange}
              >
                {monthOptions.map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    {m.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedDate.year}
                label="Year"
                onChange={handleYearChange}
              >
                {yearOptions.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Conditional Rendering for Loading/Error states */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="metrics-grid">
            <div className="dashboard-card metric-card fade-in-up">
              <div className="metric-icon metric-icon-fee">
                <FaRupeeSign />
              </div>
              <div className="metric-info">
                <p className="metric-label">Total Fee Collection</p>
                <p className="metric-value">
                  ₹{!!totalStudentPayments? totalStudentPayments.toLocaleString("en-IN"):0}
                </p>
              </div>
            </div>

            <div className="dashboard-card metric-card fade-in-up delay-1">
              <div className="metric-icon metric-icon-expenditure">
                <FaRupeeSign />
              </div>
              <div className="metric-info">
                <p className="metric-label">Total Expenditure</p>
                <p className="metric-value">
                  ₹{totalExpenditure.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <div className="dashboard-card metric-card fade-in-up delay-2">
              <div className="metric-icon metric-icon-profit">
                <FaRupeeSign />
              </div>
              <div className="metric-info">
                <p className="metric-label">Net Profit/Loss</p>
                <p
                  className="metric-value"
                  style={{ color: netProfit >= 0 ? "green" : "red" }}
                >
                  ₹{netProfit.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <Grid
            container
            spacing={3}
            sx={{ mb: 3, mt: 5 }}
            justifyContent="space-evenly"
          >
            <Grid item xs={12} lg={6}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: 380 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  <FaChartBar /> Expenses by Category
                </Typography>
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: chartData.map((item) => item.name),
                      label: "Category",
                    },
                  ]}
                  series={barChartData}
                  height={300}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: 380 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  <FaChartPie /> Expense Distribution
                </Typography>
                <PieChart
                  series={[
                    {
                      data: pieChartData,
                      highlightScope: { faded: "global", highlight: "item" },
                      faded: {
                        innerRadius: 30,
                        additionalRadius: -30,
                        color: "gray",
                      },
                    },
                  ]}
                  height={300}
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Table Section */}
          <TableContainer
            component={Paper}
            elevation={3}
            sx={{ borderRadius: 2 }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="expenditure table">
              <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>S.No</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Purpose</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Work/Details
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Amount (₹)
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenditures.map((row, index) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {new Date(row.date).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell>{row.purpose}</TableCell>
                    <TableCell>{row.work}</TableCell>
                    <TableCell align="right">
                      {row.amount.toLocaleString("en-IN")}
                    </TableCell>
<TableCell align="center" sx={{ py: 1.5 }}>
  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
    <ActionButtons 
      onEdit={() => handleEdit(row)} 
      onDelete={() => handleDelete(row)} 
    />
  </Box>
</TableCell>


                  </TableRow>
                ))}
              </TableBody>
              <TableFooter sx={{ backgroundColor: "#f0f4f8" }}>
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="right"
                    sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                  >
                    Total Expenditure
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      color: "error.main",
                    }}
                  >
                    ₹{totalExpenditure.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </>
      )}
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          {selectedExpenditure && (
            <>
              <Typography>
                Are you sure you want to delete this expenditure?
              </Typography>
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: "#f9f9f9",
                  borderRadius: 2,
                }}
              >
                <Typography>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedExpenditure.date).toLocaleDateString(
                    "en-GB"
                  )}
                </Typography>
                <Typography>
                  <strong>Purpose:</strong> {selectedExpenditure.purpose}
                </Typography>
                <Typography>
                  <strong>Amount:</strong> ₹
                  {selectedExpenditure.amount.toLocaleString("en-IN")}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </MuiButton>
          <MuiButton onClick={confirmDelete} color="error" variant="contained">
            Delete
          </MuiButton>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            ...(snackbar.severity === "success" && { color: "#fff" }),
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExpenditureDashboard;
