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
  Divider,
} from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";
import {
  FaTrashAlt,
  FaEdit,
  FaPlus,
  FaChartBar,
  FaChartPie,
  FaRupeeSign,
  FaDownload, // <-- ADDED: Icon for the download button
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
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

  const { expenditures, loading, error, totalStudentPayments } = useSelector(
    (state) => state.expenditures
  );

  const { students } = useSelector((state) => state.students);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchExpenditures(selectedDate.year, selectedDate.month));
    dispatch(fetchStudents());
  }, [dispatch, selectedDate]);

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

  // --- ADDED: Helper functions to prepare data for the PDF ---
  const getPdfTitle = () => {
    const monthName =
      monthOptions.find((m) => m.value === selectedDate.month)?.label || "";
    // This title format matches the one in your sample image
    return `${user.name} Expenditure - ${monthName.toUpperCase()} ${
      selectedDate.year
    }`;
  };

  const getPdfTableHeaders = () => {
    const baseHeaders = [
      "S. No",
      "Purpose",
      "Work / Details",
      "Date",
      "Amount",
    ];

    // Only add dummy column if we have totalExpenditure
    if (typeof totalExpenditure === "number") {
      return [...baseHeaders.slice(0, 4), "", baseHeaders[4]];
    }
    return baseHeaders;
  };

  const getPdfTableRows = () => {
    if (!expenditures || expenditures.length === 0) return [];
    return expenditures.map((row, index) => {
      const baseRow = [
        index + 1,
        row.purpose,
        row.work,
        new Date(row.date).toLocaleDateString("en-GB"),
        row.amount.toLocaleString("en-IN"),
      ];

      if (typeof totalExpenditure === "number") {
        return [...baseRow.slice(0, 4), "", baseRow[4]];
      }
      return baseRow;
    });
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
  console.log("totalExpenditure", totalExpenditure);
   let netProfitPercentage = 0;
  if (totalStudentPayments > 0) {
    netProfitPercentage = ((netProfit / totalStudentPayments) * 100).toFixed(2);
  }
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
          gap={2} // Added gap for better spacing
        >
          <Typography variant="h5" fontWeight="bold" color="primary.dark">
            📊 Monthly Expenditures
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            {" "}
            {/* Container for buttons */}
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
              totalFee={totalExpenditure}
              filename={getPdfFilename()}
              disabled={!expenditures || expenditures.length === 0}
              summaryBlock={{
                totalFeeCollection: totalStudentPayments,
                totalExpenditure,
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
                      datalabels: {
                        color: "#000",
                        anchor: "end",
                        align: "top",
                        formatter: (value) =>
                          `₹${value.toLocaleString("en-IN")}`,
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

      {/* ... The rest of your component remains the same ... */}
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
        value={totalStudentPayments || 0}
        gradient="linear-gradient(135deg, #e0e7ff, #c7d2fe)"
        icon={<FaRupeeSign />}
      />

      <MetricCard
        label="Total Expenditure"
        value={totalExpenditure}
        gradient="linear-gradient(135deg, #fee2e2, #fecaca)"
        icon={<FaRupeeSign />}
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
        percentage={netProfitPercentage} // ✅ only this card shows percentage
      />
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
