import React, { useState, useEffect, useMemo, useCallback } from "react";
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
} from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";
import { motion } from "framer-motion";

import {
  FaTrashAlt,
  FaPlus,
  FaChartBar,
  FaChartPie,
  FaRupeeSign,
  FaUserCircle,
  FaCalendarCheck,
  FaGraduationCap,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaCheckCircle,
  FaEdit,
  FaClipboardList,
  FaBriefcase,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { fetchExpenditures, deleteExpenditure } from "../redux/actions";
import {
  yearOptions,
  monthOptions,
  expenditureColors,
} from "../mockdata/function";
import { ActionButtons } from "./customcomponents/TableStatusSelect";
import PdfDownloadButton from "./customcomponents/PdfDownloadButton";
import MetricCard from "./customcomponents/MetricCard";
import TableHeadCell from "./customcomponents/TableHeadCell";
import { DeleteConfirmationDialog } from "./customcomponents/Dialogs";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "./customcomponents/SnackbarContext";

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
  const { showSnackbar } = useSnackbar();
 const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { user } = useSelector((state) => state.auth);
  const { students } = useSelector((state) => state.students);

  const {
    expenditures,
    manualexpenditures,
    payments,
    loading,
    error,
    totalStudentPayments,
    totalExpenditure,
  } = useSelector((state) => state.expenditures);

  // Combine and filter both expenditures and manualexpenditures
  const combinedExpenditures = useMemo(() => {
    const allExpenditures = [];
    
    // Add regular expenditures with type identifier
    if (expenditures && expenditures.length > 0) {
      allExpenditures.push(...expenditures.map(exp => ({
        ...exp,
        type: 'expenditure',
        createdBy: exp.createdBy || user.subject
      })));
    }
    
    // Add manual expenditures with type identifier
    if (manualexpenditures && manualexpenditures.length > 0) {
      allExpenditures.push(...manualexpenditures.map(exp => ({
        ...exp,
        type: 'manualexpenditure',
        createdBy: exp.createdBy || user.subject
      })));
    }
    
    return allExpenditures;
  }, [expenditures, manualexpenditures, user.subject]);

  // Filter expenditures by current user
  const filteredExpenditures = useMemo(() => {
    return combinedExpenditures.filter(
      (row) => row.createdBy === user.subject
    );
  }, [combinedExpenditures, user.subject]);

  const { chartData } = useMemo(() => {
    if (!filteredExpenditures || filteredExpenditures.length === 0) return { chartData: [] };
    
    const groupedData = filteredExpenditures.reduce((acc, item) => {
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
  }, [filteredExpenditures]);

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

  const getPdfTitle = () => {
    const monthName =
      monthOptions.find((m) => m.value === selectedDate.month)?.label || "";
    return `${user.name} Expenditure - ${monthName.toUpperCase()} ${
      selectedDate.year
    }`;
  };

  const getPdfTableHeaders = () => {
    return ["S. No", "Purpose", "Work / Details", "Date", "Amount", "Type"];
  };

  const getPdfTableRows = () => {
    if (!filteredExpenditures || filteredExpenditures.length === 0) return [];
    return filteredExpenditures.map((row, index) => [
      index + 1,
      row.purpose,
      row.work,
      new Date(row.date).toLocaleDateString("en-GB"),
      row.amount.toLocaleString("en-IN"),
      row.type === 'manualexpenditure' ? 'Manual Expense' : 'Regular Expense'
    ]);
  };

  const getPdfFilename = () => {
    const monthName =
      monthOptions.find((m) => m.value === selectedDate.month)?.label ||
      "Report";
    return `${user.name}_Expenditure_${monthName}_${selectedDate.year}.pdf`;
  };

  const handleDelete = (expenditure) => {
    // Check if it's a salary record (non-editable)
    if (expenditure.isSalary || expenditure.source === 'employeesalarydetails') {
      showSnackbar("Salary payments cannot be deleted. They are automatically generated.", "warning");
      return;
    }
    
    setSelectedExpenditure(expenditure);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (expenditureToEdit) => {
    // Check if it's a salary record (non-editable)
    if (expenditureToEdit.isSalary || expenditureToEdit.source === 'employeesalarydetails') {
      showSnackbar("Salary payments cannot be edited. They are automatically generated from employee payments.", "warning");
      return;
    }
    
    // Navigate to appropriate edit page based on type
    const editRoute = expenditureToEdit.type === 'manualexpenditure' 
      ? "/add-manual-expenditure" 
      : "/add-expenditure";
    
    navigate(editRoute, { state: { expenditureToEdit } });
  };

  const handleMonthChange = (e) => {
    setSelectedDate((prev) => ({ ...prev, month: e.target.value }));
  };

  const handleYearChange = (e) => {
    setSelectedDate((prev) => ({ ...prev, year: e.target.value }));
  };

  const paidStudentIds = useMemo(() => {
    if (!payments || !students) return new Set();
    const selectedMonthString = `${selectedDate.year}-${String(
      selectedDate.month
    ).padStart(2, "0")}`;
    return new Set(
      payments
        .filter((p) => p.month === selectedMonthString)
        .map((p) => p.studentId)
    );
  }, [payments, students, selectedDate.month, selectedDate.year]);

  const paidStudentSum = useMemo(() => {
    const activePaidStudents = students
      .filter((student) => student.isActive === true)
      .filter((student) => {
        if (user.AllowAll) return true;
        if (user.isPhysics && student.Subject === "Physics") return true;
        if (user.isChemistry && student.Subject === "Chemistry") return true;
        return false;
      })
      .filter((student) => paidStudentIds.has(student.id));

    const total = activePaidStudents.reduce((sum, student) => {
      const payment = payments.find(
        (p) =>
          p.studentId === student.id &&
          p.month ===
            `${selectedDate.year}-${String(selectedDate.month).padStart(
              2,
              "0"
            )}`
      );
      return sum + (payment?.amount || 0);
    }, 0);

    return total;
  }, [
    students,
    payments,
    paidStudentIds,
    user,
    selectedDate.month,
    selectedDate.year,
  ]);

  const totalFilteredExpenditure = filteredExpenditures.reduce(
    (sum, row) => sum + (row.amount || 0),
    0
  );

  const now = new Date();
  const isCurrentMonthYear =
    selectedDate.month === now.getMonth() + 1 &&
    selectedDate.year === now.getFullYear();

  const revenueChange =
    totalStudentPayments?.previous !== 0
      ? ((paidStudentSum - totalStudentPayments?.previous) /
          totalStudentPayments?.previous) *
        100
      : null;

  const expenditureChange =
    totalExpenditure?.previous !== 0
      ? ((totalFilteredExpenditure - totalExpenditure?.previous) /
          totalExpenditure?.previous) *
        100
      : null;

  const netProfit = (paidStudentSum || 0) - (totalFilteredExpenditure || 0);

  const previousNetProfit =
    (totalStudentPayments?.previous || 0) - (totalExpenditure?.previous || 0);

  const netProfitChange =
    previousNetProfit !== 0
      ? ((netProfit - previousNetProfit) / previousNetProfit) * 100
      : netProfit > 0
      ? 100
      : null;


const confirmDelete = async () => {
  if (selectedExpenditure) {
    dispatch(deleteExpenditure(selectedExpenditure.id, selectedExpenditure.type));
    setSnackbar({
      open: true,
      message: `Deleted: ${selectedExpenditure.purpose} (₹${selectedExpenditure.amount})`,
      severity: "success",
    });
    
    // Trigger refresh after a short delay
    setTimeout(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 500);
  }
  setDeleteDialogOpen(false);
  setSelectedExpenditure(null);
};

// Add refreshTrigger to useEffect dependencies
useEffect(() => {
  dispatch(
    fetchExpenditures(
      selectedDate.year,
      selectedDate.month,
      isCurrentMonthYear ? "month" : null
    )
  );
}, [dispatch, selectedDate.year, selectedDate.month, isCurrentMonthYear, refreshTrigger]);

  const dialogData = selectedExpenditure
    ? {
        Date: new Date(selectedExpenditure.date).toLocaleDateString("en-GB"),
        Purpose: selectedExpenditure.purpose,
        Amount: `₹${selectedExpenditure.amount.toLocaleString("en-IN")}`,
        Type: selectedExpenditure.type === 'manualexpenditure' ? 'Manual Expense' : 'Regular Expense'
      }
    : null;

  const pendingStudentSum = useMemo(() => {
    const monthString = `${selectedDate.year}-${String(
      selectedDate.month
    ).padStart(2, "0")}`;
    const paidStudentIds = new Set(
      payments.filter((p) => p.month === monthString).map((p) => p.studentId)
    );

    const activeStudents = students.filter((s) => s.isActive);

    // Filter students based on the user's subject preference
    const filteredStudents = activeStudents.filter((student) => {
      if (user.AllowAll) return true;
      if (user.isPhysics && student.Subject === "Physics") return true;
      if (user.isChemistry && student.Subject === "Chemistry") return true;
      return false;
    });

    const pendingStudents = filteredStudents.filter(
      (s) => !paidStudentIds.has(s.id)
    );

    return pendingStudents.reduce(
      (sum, s) => sum + (parseFloat(s["Monthly Fee"]) || 0),
      0
    );
  }, [payments, students, user, selectedDate.month, selectedDate.year]);

  const getPreviousMonthData = useCallback(
    (type) => {
      const prevDate = new Date(selectedDate.year, selectedDate.month - 2, 1);
      const prevMonth = prevDate.getMonth() + 1;
      const prevYear = prevDate.getFullYear();

      if (type === "revenue") {
        const prevPayments = payments.filter((p) => {
          const pDate = new Date(p.paidOn);
          return (
            pDate.getMonth() + 1 === prevMonth &&
            pDate.getFullYear() === prevYear
          );
        });
        return prevPayments.reduce((sum, p) => sum + p.amount, 0);
      } else if (type === "expenditure") {
        const prevExpenditures = combinedExpenditures.filter((exp) => {
          const expDate = new Date(exp.date);
          return (
            expDate.getMonth() + 1 === prevMonth &&
            expDate.getFullYear() === prevYear
          );
        });
        return prevExpenditures.reduce((sum, exp) => sum + exp.amount, 0);
      }
      return 0;
    },
    [selectedDate, payments, combinedExpenditures]
  );

  const filteredStudents = useMemo(() => {
    const monthString = `${selectedDate.year}-${String(
      selectedDate.month
    ).padStart(2, "0")}`;
    const paidStudentIds = new Set(
      payments.filter((p) => p.month === monthString).map((p) => p.studentId)
    );

    return students
      .filter((student) => student.isActive === true)
      .filter((student) => {
        // Apply the user's subject preference filter
        if (user.AllowAll) {
          return true;
        }
        if (user.isPhysics && student.Subject === "Physics") {
          return true;
        }
        if (user.isChemistry && student.Subject === "Chemistry") {
          return true;
        }
        return false;
      })
      .sort((a, b) => {
        const aPaid = paidStudentIds.has(a.id);
        const bPaid = paidStudentIds.has(b.id);
        if (aPaid && !bPaid) return -1;
        if (!aPaid && bPaid) return 1;
        if (aPaid && bPaid) {
          const aPayment = payments.find(
            (p) => p.studentId === a.id && p.month === monthString
          );
          const bPayment = payments.find(
            (p) => p.studentId === b.id && p.month === monthString
          );
          const dateA = new Date(aPayment?.paidOn);
          const dateB = new Date(bPayment?.paidOn);
          return dateA - dateB;
        }
        return 0;
      });
  }, [students, paidStudentIds, payments, selectedDate, user]);

  const showSubjectColumn = user?.AllowAll;

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "background.default",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: { xs: 2, md: 4 },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={4}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            backgroundColor: "background.paper",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h5" fontWeight="bold" color="primary.dark">
            📊 Monthly Expenditures
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "space-between", sm: "flex-end" },
              alignItems: "center",
            }}
          >
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ width: "auto" }}
            >
              <Grid item xs={6} sm="auto">
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
              <Grid item xs={6} sm="auto">
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
            <MuiButton
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variant="contained"
              startIcon={<FaPlus />}
              onClick={() => navigate("/add-expenditure")}
              sx={{ flexShrink: 0 }}
            >
              Add Expense
            </MuiButton>
            <PdfDownloadButton
              title={getPdfTitle()}
              headers={getPdfTableHeaders()}
              rows={getPdfTableRows()}
              totalFee={totalFilteredExpenditure || 0}
              filename={getPdfFilename()}
              disabled={
                !filteredExpenditures || filteredExpenditures.length === 0
              }
              summaryBlock={{
                totalFeeCollection: paidStudentSum || 0,
                totalExpenditure: totalFilteredExpenditure || 0,
                netProfit,
              }}
              charts={[]}
            />
          </Box>
        </Paper>
      </motion.div>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {/* Left side - Metric Cards */}
            <Grid item xs={12} md={4}>
              <Grid
                container
                spacing={1.25}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <Grid item>
                  <MetricCard
                    label="Total Fee Collection"
                    value={paidStudentSum}
                    gradient="linear-gradient(135deg, #e3f2fd, #bbdefb)"
                    icon={<FaRupeeSign />}
                    percentage={revenueChange}
                  />
                </Grid>
                <Grid item>
                  <MetricCard
                    label="Total Expenditure"
                    value={totalFilteredExpenditure || 0}
                    gradient="linear-gradient(135deg, #ffebee, #ffcdd2)"
                    icon={<FaRupeeSign />}
                    percentage={expenditureChange}
                  />
                </Grid>
                <Grid item>
                  <MetricCard
                    label="Pending Fee Amount"
                    value={pendingStudentSum || 0}
                    gradient="linear-gradient(135deg, #fff8e1, #ffecb3)"
                    icon={<FaRupeeSign />}
                  />
                </Grid>
                <Grid item>
                  <MetricCard
                    label="Net Profit/Loss"
                    value={netProfit}
                    gradient={
                      netProfit >= 0
                        ? "linear-gradient(135deg, #e0f7fa, #b2ebf2)"
                        : "linear-gradient(135deg, #ffebee, #ffcdd2)"
                    }
                    textColor={netProfit >= 0 ? "green" : "red"}
                    icon={<FaRupeeSign />}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Middle - Bar Chart */}
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Paper
                  elevation={4}
                  sx={{ p: 3, borderRadius: 3, height: 350 }}
                >
                  <Typography variant="h6" color="primary" gutterBottom>
                    <FaChartBar /> Monthly Financial Overview
                  </Typography>
                  <BarChart
                    xAxis={[
                      {
                        scaleType: "band",
                        data: [
                          monthOptions.find(
                            (m) =>
                              m.value ===
                              (selectedDate.month === 1
                                ? 12
                                : selectedDate.month - 1)
                          )?.label,
                          monthOptions.find(
                            (m) => m.value === selectedDate.month
                          )?.label,
                        ],
                        label: "Month",
                      },
                    ]}
                    yAxis={[{ label: "Amount (₹)" }]}
                    series={[
                      {
                        data: [getPreviousMonthData("revenue"), paidStudentSum],
                        label: "Fee Collection",
                        color: "#2196f3",
                      },
                      {
                        data: [
                          getPreviousMonthData("expenditure"),
                          totalFilteredExpenditure,
                        ],
                        label: "Expenditure",
                        color: "#f44336",
                      },
                    ]}
                    height={250}
                  />
                </Paper>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Paper
                  elevation={4}
                  sx={{ p: 3, borderRadius: 3, height: 350 }}
                >
                  <Typography variant="h6" color="primary" gutterBottom>
                    <FaChartPie /> Expenditures
                  </Typography>
                  <PieChart
                    series={[
                      {
                        data: pieChartData,
                        highlightScope: {
                          faded: "global",
                          highlight: "item",
                        },
                        faded: {
                          innerRadius: 30,
                          additionalRadius: -30,
                          color: "gray",
                        },
                      },
                    ]}
                    height={250}
                  />
                </Paper>
              </motion.div>
            </Grid>
          </Grid>

          <Paper elevation={4} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Paid Students for{" "}
              {monthOptions.find((m) => m.value === selectedDate.month)?.label}{" "}
              {selectedDate.year}
            </Typography>
            <TableContainer>
              <Table stickyHeader size="small">
                <TableHead
                  sx={{
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                  }}
                >
                  <TableRow>
                    <TableHeadCell>S.No</TableHeadCell>
                    <TableHeadCell icon={<FaUserCircle />}>Name</TableHeadCell>
                    {showSubjectColumn && (
                      <TableHeadCell icon={<FaGraduationCap />}>
                        Subject
                      </TableHeadCell>
                    )}

                    <TableHeadCell icon={<FaCalendarAlt />}>
                      Paid Date
                    </TableHeadCell>
                    <TableHeadCell icon={<FaMoneyBillWave />}>
                      Fee Paid (₹)
                    </TableHeadCell>
                    <TableHeadCell icon={<FaCheckCircle />}>
                      Status
                    </TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => {
                      const hasPaid = paidStudentIds.has(student.id);
                      const paymentDetails = payments.find(
                        (p) =>
                          p.studentId === student.id &&
                          p.month ===
                            `${selectedDate.year}-${String(
                              selectedDate.month
                            ).padStart(2, "0")}`
                      );
                      return (
                        <TableRow
                          key={student.id}
                          sx={{
                            backgroundColor: hasPaid
                              ? "inherit"
                              : "error.lightest",
                            "&:hover": {
                              backgroundColor: hasPaid
                                ? "action.hover"
                                : "error.lighter",
                            },
                          }}
                        >
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell
                            sx={{ fontSize: "0.9rem", p: 1.5 }}
                            align="center"
                          >
                            <Link
                              to={`/student/${student.id}`}
                              state={{ studentData: student }}
                              className="student-name-link"
                              style={{
                                textDecoration: "underline",
                                color: "inherit",
                                fontWeight: 500,
                                display: "block",
                              }}
                            >
                              {student.Name}
                            </Link>
                          </TableCell>
                          {showSubjectColumn && (
                            <TableCell align="center">
                              {student.Subject}
                            </TableCell>
                          )}

                          <TableCell align="center">
                            {hasPaid
                              ? new Date(
                                  paymentDetails?.paidOn
                                ).toLocaleDateString("en-GB")
                              : "-"}
                          </TableCell>
                          <TableCell align="center">
                            {hasPaid
                              ? paymentDetails?.amount?.toLocaleString("en-IN")
                              : student["Monthly Fee"]?.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell align="center">
                            {hasPaid ? (
                              <Box
                                sx={{
                                  color: "success.main",
                                  fontWeight: "bold",
                                }}
                              >
                                Paid
                              </Box>
                            ) : (
                              <Box
                                sx={{ color: "error.main", fontWeight: "bold" }}
                              >
                                Pending
                              </Box>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No active students found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter
                  sx={{
                    borderTop: "2px solid",
                    borderColor: "primary.main",
                  }}
                >
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="right"
                      sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    >
                      Total Fees Collected :
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        color: "success.main",
                      }}
                    >
                      ₹{(paidStudentSum || 0).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Paper>

          <Paper elevation={4} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Monthly Expenditures
            </Typography>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table
                stickyHeader
                sx={{ minWidth: 650 }}
                aria-label="expenditure table"
              >
                <TableHead
                  sx={{
                    backgroundColor: "primary.light",
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                  }}
                >
                  <TableRow>
                    <TableHeadCell>S.No</TableHeadCell>
                    <TableHeadCell icon={<FaCalendarAlt />}>Date</TableHeadCell>
                    <TableHeadCell icon={<FaClipboardList />}>
                      Purpose
                    </TableHeadCell>
                    <TableHeadCell icon={<FaBriefcase />}>
                      Work/Details
                    </TableHeadCell>
                    <TableHeadCell icon={<FaMoneyBillWave />}>
                      Amount (₹)
                    </TableHeadCell>
                    <TableHeadCell icon={<FaEdit />}>Actions</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredExpenditures.length > 0 ? (
                    filteredExpenditures.map((row, index) => (
                      <TableRow
                        key={`${row.type}-${row.id}`}
                        sx={{ 
                          "&:hover": { backgroundColor: "action.hover" },
                          backgroundColor: "inherit"
                        }}
                      >
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">
                          {new Date(row.date).toLocaleDateString("en-GB")}
                          {row.isSalary}
                        </TableCell>
                        <TableCell align="center">
                          {row.purpose}
                        </TableCell>
                        <TableCell align="center">{row.work}</TableCell>
                        <TableCell align="center">
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
                            {row.isSalary ? (
                              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                Salary non editable
                              </Typography>
                            ) : (
                              <ActionButtons
                                onEdit={() => handleEdit(row)}
                                onDelete={() => handleDelete(row)}
                              />
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No expenditures found for this month.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter
                  sx={{
                    borderTop: "2px solid",
                    borderColor: "primary.main",
                  }}
                >
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="right"
                      sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    >
                      Total Expenditure :
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        color: "error.main",
                      }}
                    >
                      ₹{(totalFilteredExpenditure || 0).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this expenditure?"
        data={dialogData}
      />
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