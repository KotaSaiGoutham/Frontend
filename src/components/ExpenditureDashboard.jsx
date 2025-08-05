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
import { fetchStudents } from "../redux/actions";
import "./ExpenditureDashboard.css";

// Mock Data - Replace with API call
const mockExpenditureData = [
  {
    id: "1",
    date: "2025-07-05T00:00:00.000Z",
    purpose: "Marketing",
    work: "Bulk SMS",
    amount: 9000,
  },
  {
    id: "2",
    date: "2025-07-05T00:00:00.000Z",
    purpose: "Marketing",
    work: "My Home Mangala Add",
    amount: 2360,
  },
  {
    id: "3",
    date: "2025-07-01T00:00:00.000Z",
    purpose: "Software",
    work: "Zoom Online Tool",
    amount: 1600,
  },
  {
    id: "4",
    date: "2025-07-01T00:00:00.000Z",
    purpose: "Academics",
    work: "Janardhan QP + Result",
    amount: 1520,
  },
  {
    id: "5",
    date: "2025-07-10T00:00:00.000Z",
    purpose: "Utilities",
    work: "Electricity Bill",
    amount: 4500,
  },
  {
    id: "6",
    date: "2025-07-15T00:00:00.000Z",
    purpose: "Salary",
    work: "Teacher A Salary",
    amount: 25000,
  },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF1943",
];

const ExpenditureDashboard = () => {
  const navigate = useNavigate();
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState({
    month: new Date().getMonth() + 1, // 1-12
    year: new Date().getFullYear(),
  });

  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useSelector((state) => state.students);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  let filteredStudents = [];
  if (students && students.length > 0 && user) {
    if (user.AllowAll) {
      filteredStudents = students;
    } else if (user.isPhysics) {
      filteredStudents = students.filter(
        (student) => student.Subject === "Physics"
      );
    } else if (user.isChemistry) {
      filteredStudents = students.filter(
        (student) => student.Subject === "Chemistry"
      );
    } else {
      filteredStudents = [];
      console.warn(
        "User has no specific subject permissions (isPhysics, isChemistry) and not AllowAll. Displaying no students."
      );
    }
    filteredStudents = filteredStudents.filter(
      (student) => student.isActive === true
    );
  }

  const totalFeeCollection = useMemo(() => {
    return filteredStudents.reduce((sum, student) => {
      const paymentStatus = student["Payment Status"];
      const monthlyFee =
        typeof student.monthlyFee === "number"
          ? student.monthlyFee
          : parseFloat(student["Monthly Fee"]);

      if (paymentStatus === "Paid" && !isNaN(monthlyFee)) {
        return sum + monthlyFee;
      }
      return sum;
    }, 0);
  }, [filteredStudents]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        dispatch(fetchStudents());
        setExpenditures(mockExpenditureData);
      } catch (err) {
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedDate, dispatch]);

  const { totalExpenditure, chartData } = useMemo(() => {
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

  const barChartData = useMemo(() => {
    return [
      {
        data: chartData.map((item) => item.amount),
        label: "Amount Spent",
        color: "#1976d2",
      },
    ];
  }, [chartData]);

  const pieChartData = useMemo(() => {
    return chartData.map((item, index) => ({
      id: index,
      value: item.amount,
      label: item.name,
      color: COLORS[index % COLORS.length],
    }));
  }, [chartData]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        setExpenditures(expenditures.filter((e) => e.id !== id));
      } catch (err) {
        alert("Failed to delete expense.");
      }
    }
  };

  const handleMonthChange = (e) => {
    setSelectedDate((prev) => ({ ...prev, month: e.target.value }));
  };

  const handleYearChange = (e) => {
    setSelectedDate((prev) => ({ ...prev, year: e.target.value }));
  };

  const yearOptions = [2023, 2024, 2025, 2026];
  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const netProfit = totalFeeCollection - totalExpenditure;

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

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          {/* Summary Card */}
          <div className="metrics-grid">
            <div className="dashboard-card metric-card fade-in-up">
              <div className="metric-icon metric-icon-fee">
                <FaRupeeSign />
              </div>
              <div className="metric-info">
                <p className="metric-label">Total Fee Collection</p>
                <p className="metric-value">
                  ₹{totalFeeCollection.toLocaleString("en-IN")}
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

          {/* Charts Section - Equal and more space */}
          <Grid
            container
            spacing={3}
            sx={{ mb: 3,mt:5 }}
            justifyContent="space-evenly"
          >
            <Grid item xs={12} lg={6}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: 500 }}>
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
                  height={400}
                  width={500}
                  animation={true}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: 500 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  <FaChartPie /> Expense Distribution
                </Typography>
                <PieChart
                  series={[
                    {
                      data: pieChartData,
                      highlightScope: { fade: "global", highlight: "item" },
                      faded: {
                        innerRadius: 30,
                        additionalRadius: -30,
                        color: "gray",
                      },
                    },
                  ]}
                  height={400}
                  width={500}
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
                    sx={{
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      "&:nth-of-type(even)": {
                        backgroundColor: "#fafafa",
                      },
                    }}
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
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        sx={{ mx: 0.5 }}
                        onClick={() => navigate(`/edit-expenditure/${row.id}`)}
                      >
                        <FaEdit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        sx={{ mx: 0.5 }}
                        onClick={() => handleDelete(row.id)}
                      >
                        <FaTrashAlt />
                      </IconButton>
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
    </Box>
  );
};

export default ExpenditureDashboard;
