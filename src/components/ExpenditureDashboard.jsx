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
} from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";
import {
  FaTrashAlt,
  FaPlus,
  FaChartBar,
  FaChartPie,
  FaRupeeSign,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { fetchStudents, fetchExpenditures, deleteExpenditure } from "../redux/actions";
import "./ExpenditureDashboard.css";
import { yearOptions, monthOptions, expenditureColors } from "../mockdata/function";
import { ActionButtons } from "./customcomponents/TableStatusSelect";
import PdfDownloadButton from "./customcomponents/PdfDownloadButton";
import MetricCard from "./customcomponents/MetricCard";

const ExpenditureDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExpenditure, setSelectedExpenditure] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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

  const {
  expenditures,
  loading,
  error,
  totalStudentPayments,
  previousPeriodTotalPayments, // Add this line
  totalExpenditure,
  previousTotalExpenditure, // Add this line
} = useSelector((state) => state.expenditures);
console.log("223==>",expenditures,
  loading,
  error,
  totalStudentPayments,
  previousPeriodTotalPayments, // Add this line
  totalExpenditure,
  previousTotalExpenditure)
  console.log("totalExpenditure",totalExpenditure)
  const { students } = useSelector((state) => state.students);
  const { user } = useSelector((state) => state.auth);

  const { chartData } = useMemo(() => {
    if (!expenditures) return { chartData: [] };
    const groupedData = expenditures.reduce((acc, item) => {
      const purpose = item.purpose || "Uncategorized";
      if (!acc[purpose]) {
        acc[purpose] = { name: purpose, amount: 0 };
      }
      acc[purpose].amount += item.amount;
      return acc;
    }, {});

    return {
      chartData: Object.values(groupedData),
    };
  }, [expenditures]);

  const now = new Date();
  const isCurrentMonthYear =
    selectedDate.month === now.getMonth() + 1 &&
    selectedDate.year === now.getFullYear();

const revenueChange =
    totalStudentPayments?.previous !== 0
      ? ((totalStudentPayments?.current - totalStudentPayments?.previous) /
          totalStudentPayments?.previous) * 100
      : null; // Use null to show a dash if no previous data

  const expenditureChange =
    totalExpenditure?.previous !== 0
      ? ((totalExpenditure?.current - totalExpenditure?.previous) /
          totalExpenditure?.previous) * 100
      : null; // Use null to show a dash if no previous data

  const netProfit =
    (totalStudentPayments?.current || 0) - (totalExpenditure?.current || 0);

  const previousNetProfit =
    (totalStudentPayments?.previous || 0) - (totalExpenditure?.previous || 0);

  const netProfitChange = previousNetProfit !== 0
    ? ((netProfit - previousNetProfit) / previousNetProfit) * 100
    : netProfit > 0
    ? 100 // Going from 0 to a positive number can be represented as +100%
    : null; // For other cases like 0 to 0 or 0 to negativ

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

  useEffect(() => {
    const now = new Date();
    const isCurrentMonthYear =
      selectedDate.month === now.getMonth() + 1 &&
      selectedDate.year === now.getFullYear();

    dispatch(
      fetchExpenditures(
        selectedDate.year,
        selectedDate.month,
        isCurrentMonthYear ? "month" : null
      )
    );
    dispatch(fetchStudents());
  }, [dispatch, selectedDate.year, selectedDate.month]);

  const getPdfTitle = () => {
    const monthName =
      monthOptions.find((m) => m.value === selectedDate.month)?.label || "";
    return `${user.name} Expenditure - ${monthName.toUpperCase()} ${
      selectedDate.year
    }`;
  };

  const getPdfTableHeaders = () => {
    return ["S. No", "Purpose", "Work / Details", "Date", "Amount"];
  };

  const getPdfTableRows = () => {
    if (!expenditures || expenditures.length === 0) return [];
    return expenditures.map((row, index) => [
      index + 1,
      row.purpose,
      row.work,
      new Date(row.date).toLocaleDateString("en-GB"),
      row.amount.toLocaleString("en-IN"),
    ]);
  };

  const getPdfFilename = () => {
    const monthName =
      monthOptions.find((m) => m.value === selectedDate.month)?.label ||
      "Report";
    return `${user.name}_Expenditure_${monthName}_${selectedDate.year}.pdf`;
  };

  const handleEdit = (expenditureToEdit) => {
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
      <Paper
        elevation={3}
        sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: "#ffffff" }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Typography variant="h5" fontWeight="bold" color="primary.dark">
            📊 Monthly Expenditures
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <MuiButton
              variant="contained"
              startIcon={<FaPlus />}
              onClick={() => navigate("/add-expenditure")}
            >
              Add Expense
            </MuiButton>
            <PdfDownloadButton
              title={getPdfTitle()}
              headers={getPdfTableHeaders()}
              rows={getPdfTableRows()}
              totalFee={totalExpenditure?.current || 0}
              filename={getPdfFilename()}
              disabled={!expenditures || expenditures.length === 0}
              summaryBlock={{
                totalFeeCollection: totalStudentPayments?.current || 0,
                totalExpenditure: totalExpenditure?.current || 0,
                netProfit,
              }}
              charts={[
                {
                  chartData: {
                    labels: chartData.map((item) => item.name),
                    datasets: [
                      {
                        label: "Amount Spent",
                        data: chartData.map((item) => item.amount),
                        backgroundColor: expenditureColors.slice(
                          0,
                          chartData.length
                        ),
                      },
                    ],
                  },
                  chartOptions: {
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: "Where We Are Spending (₹)",
                      },
                    },
                  },
                },
              ]}
            />
          </Box>
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
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
     <MetricCard
        label="Total Fee Collection"
        value={totalStudentPayments?.current || 0}
  gradient="linear-gradient(135deg, #dcfce7, #bbf7d0)"
        icon={<FaRupeeSign />}
        percentage={revenueChange}
      />

      <MetricCard
        label="Total Expenditure"
        value={totalExpenditure?.current || 0}
        gradient="linear-gradient(135deg, #fee2e2, #fecaca)"
        icon={<FaRupeeSign />}
        percentage={expenditureChange}
      />

      <MetricCard
        label="Net Profit/Loss"
        value={netProfit}
       gradient={
                netProfit >= 0
                  ? "linear-gradient(135deg, #dcfce7, #bbf7d0)"
                  : "linear-gradient(135deg, #fee2e2, #fecaca)"
              }
              textColor={netProfit >= 0 ? "#166534" : "#991b1b"}
              icon={<FaRupeeSign />}

        percentage={netProfitChange}
      />
          </div>

         
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
                  <TableCell sx={{ fontWeight: "bold" }}>Work/Details</TableCell>
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
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
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
                    ₹{(totalExpenditure?.current || 0).toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </>
      )}
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