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
  Container,
  Card,
  CardContent,
  alpha,
  useTheme,
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
  FaReceipt,
  FaInfoCircle,
  FaWallet,
  FaCreditCard,
  FaMoneyCheckAlt,
  FaExclamationTriangle,
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
  const theme = useTheme();

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
    salaryexpenditures,
    previousPayments,
    previousSalaryExpenditures,
    previousManualExpenditures,
    payments,
    loading,
    error,
    totalStudentPayments,
    totalExpenditure,
    previousTotalPayments,
    previousTotalExpenditure,
  } = useSelector((state) => state.expenditures);
  console.log("expenditures", expenditures);

  // Combine and filter all expenditures for CURRENT month
  const combinedExpenditures = useMemo(() => {
    const allExpenditures = [];

    // Add regular expenditures
    if (expenditures && expenditures.length > 0) {
      allExpenditures.push(
        ...expenditures.map((exp) => ({
          ...exp,
          type: "expenditure",
          createdBy: exp.createdBy || user.subject,
        }))
      );
    }

    // Add manual expenditures
    if (manualexpenditures && manualexpenditures.length > 0) {
      allExpenditures.push(
        ...manualexpenditures.map((exp) => ({
          ...exp,
          type: "manualexpenditure",
          createdBy: exp.createdBy || user.subject,
        }))
      );
    }

    // Add salary expenditures
    if (salaryexpenditures && salaryexpenditures.length > 0) {
      allExpenditures.push(
        ...salaryexpenditures.map((exp) => ({
          ...exp,
          type: "salaryexpenditure",
          createdBy: exp.createdBy || user.subject,
          isSalary: true,
          source: "employeesalarydetails",
        }))
      );
    }

    return allExpenditures;
  }, [expenditures, manualexpenditures, salaryexpenditures, user.subject]);

  // Combine all expenditures for PREVIOUS month from API
  const previousMonthCombinedExpenditures = useMemo(() => {
    const allExpenditures = [];

    // Add previous month regular expenditures from API
    // Check if there are expenditures that belong to previous month
    const prevMonthExpenditures = expenditures.filter((exp) => {
      const expDate = new Date(exp.date);
      const prevMonth = selectedDate.month === 1 ? 12 : selectedDate.month - 1;
      const prevYear =
        selectedDate.month === 1 ? selectedDate.year - 1 : selectedDate.year;

      return (
        expDate.getMonth() + 1 === prevMonth &&
        expDate.getFullYear() === prevYear &&
        exp.createdBy === user.subject
      );
    });

    if (prevMonthExpenditures.length > 0) {
      allExpenditures.push(
        ...prevMonthExpenditures.map((exp) => ({
          ...exp,
          type: "expenditure",
          createdBy: exp.createdBy || user.subject,
        }))
      );
    }

    // Add previous month salary expenditures from API
    if (previousSalaryExpenditures && previousSalaryExpenditures.length > 0) {
      allExpenditures.push(
        ...previousSalaryExpenditures.map((exp) => ({
          ...exp,
          type: "salaryexpenditure",
          createdBy: exp.createdBy || user.subject,
          isSalary: true,
          source: "employeesalarydetails",
        }))
      );
    }

    // Add previous month manual expenditures from API
    if (previousManualExpenditures && previousManualExpenditures.length > 0) {
      allExpenditures.push(
        ...previousManualExpenditures.map((exp) => ({
          ...exp,
          type: "manualexpenditure",
          createdBy: exp.createdBy || user.subject,
        }))
      );
    }

    return allExpenditures;
  }, [
    expenditures,
    previousSalaryExpenditures,
    previousManualExpenditures,
    user.subject,
    selectedDate.month,
    selectedDate.year,
  ]);

  // Filter expenditures by current user for CURRENT month
  const filteredExpenditures = useMemo(() => {
    return combinedExpenditures.filter((row) => row.createdBy === user.subject);
  }, [combinedExpenditures, user.subject]);

  // Filter expenditures by current user for PREVIOUS month
  const previousMonthFilteredExpenditures = useMemo(() => {
    return previousMonthCombinedExpenditures.filter(
      (row) => row.createdBy === user.subject
    );
  }, [previousMonthCombinedExpenditures, user.subject]);

  // Calculate previous month data using API data
  const previousMonthData = useMemo(() => {
    let prevFeeCollection = 0;
    let prevTotalExpenditure = 0;
    let prevPendingFees = 0;

    // Calculate previous month's fee collection from API
    if (previousPayments && previousPayments.length > 0) {
      // Get unique student IDs who paid in previous month
      const prevPaidStudentIds = new Set(
        previousPayments.map((p) => p.studentId)
      );

      // Calculate total paid amount
      prevFeeCollection = previousPayments.reduce((sum, payment) => {
        // Filter based on user's subject preference
        const student = students.find((s) => s.id === payment.studentId);
        if (!student) return sum;

        if (user.AllowAll) return sum + (payment.amount || 0);
        if (user.isPhysics && student.Subject === "Physics")
          return sum + (payment.amount || 0);
        if (user.isChemistry && student.Subject === "Chemistry")
          return sum + (payment.amount || 0);
        return sum;
      }, 0);
    } else {
      // Fallback to API total if available
      prevFeeCollection = previousTotalPayments || 0;
    }

    // Use the API's previousTotalExpenditure directly
    // This is the correct total expenditure for previous month (27155 in your case)
    prevTotalExpenditure = previousTotalExpenditure || 0;

    // Calculate previous month's pending fees
    const prevMonthActiveStudents = students
      .filter((s) => s.isActive)
      .filter((student) => {
        if (user.AllowAll) return true;
        if (user.isPhysics && student.Subject === "Physics") return true;
        if (user.isChemistry && student.Subject === "Chemistry") return true;
        return false;
      });

    // Get previous month string
    const prevMonthString = `${selectedDate.year}-${String(
      selectedDate.month === 1 ? 12 : selectedDate.month - 1
    ).padStart(2, "0")}`;

    // Get paid student IDs for previous month
    const prevPaidStudentIds = new Set(
      (previousPayments || [])
        .filter((p) => p.month === prevMonthString)
        .map((p) => p.studentId)
    );

    // Calculate pending fees
    prevPendingFees = prevMonthActiveStudents
      .filter((s) => !prevPaidStudentIds.has(s.id))
      .reduce((sum, s) => sum + (parseFloat(s["Monthly Fee"]) || 0), 0);

    // Calculate previous month's net profit
    const prevNetProfit = prevFeeCollection - prevTotalExpenditure;

    return {
      feeCollection: prevFeeCollection,
      totalExpenditure: prevTotalExpenditure, // This will be 27155
      pendingFees: prevPendingFees,
      netProfit: prevNetProfit,
    };
  }, [
    previousPayments,
    students,
    user,
    previousTotalPayments,
    previousTotalExpenditure,
    selectedDate.month,
    selectedDate.year,
  ]);
  console.log("previousMonthData", previousMonthData);

  // Helper function to calculate percentage change
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return ((current - previous) / previous) * 100;
  };

  // Chart data for CURRENT month
  const { chartData } = useMemo(() => {
    if (!filteredExpenditures || filteredExpenditures.length === 0)
      return { chartData: [] };

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

  // Paid student IDs for CURRENT month
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

  // Current month calculations
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

  const netProfit = (paidStudentSum || 0) - (totalFilteredExpenditure || 0);

  // Percentage calculations
  const feeCollectionPercentage = calculatePercentageChange(
    paidStudentSum,
    previousMonthData.feeCollection
  );

  const expenditurePercentage = calculatePercentageChange(
    totalFilteredExpenditure,
    previousMonthData.totalExpenditure
  );

  const pendingFeesPercentage = calculatePercentageChange(
    pendingStudentSum,
    previousMonthData.pendingFees
  );

  const netProfitPercentage = calculatePercentageChange(
    netProfit,
    previousMonthData.netProfit
  );

  // Filtered students for table
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
        if (user.AllowAll) return true;
        if (user.isPhysics && student.Subject === "Physics") return true;
        if (user.isChemistry && student.Subject === "Chemistry") return true;
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

  // PDF functions
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
      row.type === "manualexpenditure"
        ? "Manual Expense"
        : row.type === "salaryexpenditure"
        ? "Salary Expense"
        : "Regular Expense",
    ]);
  };

  const getPdfFilename = () => {
    const monthName =
      monthOptions.find((m) => m.value === selectedDate.month)?.label ||
      "Report";
    return `${user.name}_Expenditure_${monthName}_${selectedDate.year}.pdf`;
  };

  // Handlers
  const handleDelete = (expenditure) => {
    if (
      expenditure.isSalary ||
      expenditure.source === "employeesalarydetails"
    ) {
      showSnackbar(
        "Salary payments cannot be deleted. They are automatically generated.",
        "warning"
      );
      return;
    }

    setSelectedExpenditure(expenditure);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (expenditureToEdit) => {
    if (
      expenditureToEdit.isSalary ||
      expenditureToEdit.source === "employeesalarydetails"
    ) {
      showSnackbar(
        "Salary payments cannot be edited. They are automatically generated from employee payments.",
        "warning"
      );
      return;
    }

    const editRoute =
      expenditureToEdit.type === "manualexpenditure"
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

  const confirmDelete = async () => {
    if (selectedExpenditure) {
      dispatch(
        deleteExpenditure(selectedExpenditure.id, selectedExpenditure.type)
      );
      setSnackbar({
        open: true,
        message: `Deleted: ${selectedExpenditure.purpose} (₹${selectedExpenditure.amount})`,
        severity: "success",
      });

      setTimeout(() => {
        setRefreshTrigger((prev) => prev + 1);
      }, 500);
    }
    setDeleteDialogOpen(false);
    setSelectedExpenditure(null);
  };

  // Fetch data
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
  }, [dispatch, selectedDate.year, selectedDate.month, refreshTrigger]);

  const dialogData = selectedExpenditure
    ? {
        Date: new Date(selectedExpenditure.date).toLocaleDateString("en-GB"),
        Purpose: selectedExpenditure.purpose,
        Amount: `₹${selectedExpenditure.amount.toLocaleString("en-IN")}`,
        Type:
          selectedExpenditure.type === "manualexpenditure"
            ? "Manual Expense"
            : selectedExpenditure.type === "salaryexpenditure"
            ? "Salary Expense"
            : "Regular Expense",
      }
    : null;

  // Enhanced Metric Card component - UPDATED VERSION
  const EnhancedMetricCard = ({
    label,
    value,
    icon,
    percentage,
    previousValue,
    color = "primary",
    variant = "gradient",
  }) => {
    const formattedValue = `₹${value?.toLocaleString("en-IN") || "0"}`;
    const isPositive = percentage >= 0;
    const iconColor = theme.palette[color]?.main || theme.palette.primary.main;

    const gradients = {
      primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      success: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
      error: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)", // Red/Coral
      warning: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
      info: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    };

    return (
      <Card
        component={motion.div}
        whileHover={{ y: -5, boxShadow: theme.shadows[6] }}
        sx={{
          height: "100%",
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          background:
            variant === "gradient"
              ? gradients[color]
              : alpha(theme.palette[color].main, 0.1),
          border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
        }}
      >
        <CardContent
          sx={{
            p: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1, mr: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: variant === "gradient" ? "white" : "text.secondary",
                  fontWeight: 500,
                  letterSpacing: 0.5,
                  mb: 1,
                  fontSize: "0.875rem",
                }}
              >
                {label}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: variant === "gradient" ? "white" : "text.primary",
                  lineHeight: 1.2,
                  fontSize: { xs: "1.5rem", sm: "1.75rem" },
                }}
              >
                {formattedValue}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  variant === "gradient"
                    ? alpha("#fff", 0.2)
                    : alpha(iconColor, 0.1),
                color: variant === "gradient" ? "white" : iconColor,
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
          </Box>

          {percentage !== undefined && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: "auto",
                pt: 2,
                borderTop: `1px solid ${
                  variant === "gradient"
                    ? alpha("#fff", 0.15)
                    : alpha("#000", 0.1)
                }`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      variant === "gradient"
                        ? alpha("#fff", 0.8)
                        : "text.secondary",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    mr: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  vs prev:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 1.2,
                    py: 0.5,
                    borderRadius: 1.5,
                    backgroundColor:
                      variant === "gradient"
                        ? alpha(isPositive ? "#4caf50" : "#f44336", 0.3)
                        : alpha(isPositive ? "#4caf50" : "#f44336", 0.1),
                    color:
                      variant === "gradient"
                        ? "white"
                        : isPositive
                        ? "success.main"
                        : "error.main",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                  >
                    {isPositive ? "↗" : "↘"} {Math.abs(percentage).toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            backgroundColor: "background.paper",
            mb: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="primary.main"
                gutterBottom
              >
                📊 Monthly Expenditure Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {
                  monthOptions.find((m) => m.value === selectedDate.month)
                    ?.label
                }{" "}
                {selectedDate.year}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
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
                <FormControl size="small" sx={{ minWidth: 120 }}>
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
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <MuiButton
                  component={motion.button}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  variant="contained"
                  startIcon={<FaPlus />}
                  onClick={() => navigate("/add-expenditure")}
                  sx={{ flexShrink: 0, borderRadius: 2 }}
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
            </Box>
          </Box>
        </Paper>
      </motion.div>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <>
          {/* Enhanced Metrics Section - Full Width */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <EnhancedMetricCard
                label="Fee Collection"
                value={paidStudentSum}
                icon={<FaWallet size={20} />}
                percentage={feeCollectionPercentage}
                previousValue={previousMonthData.feeCollection}
                color="primary"
                variant="gradient"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <EnhancedMetricCard
                label="Total Expenditure"
                value={totalFilteredExpenditure || 0}
                icon={<FaCreditCard size={20} />}
                percentage={expenditurePercentage}
                previousValue={previousMonthData.totalExpenditure}
                color="error"
                variant="gradient"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <EnhancedMetricCard
                label="Net Profit/Loss"
                value={netProfit}
                icon={<FaMoneyCheckAlt size={20} />}
                percentage={netProfitPercentage}
                previousValue={previousMonthData.netProfit}
                color={netProfit >= 0 ? "success" : "error"}
                variant="gradient"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <EnhancedMetricCard
                label="Pending Fees"
                value={pendingStudentSum || 0}
                icon={<FaExclamationTriangle size={20} />}
                // percentage={pendingFeesPercentage}
                previousValue={previousMonthData.pendingFees}
                color="warning"
                variant="gradient"
              />
            </Grid>
          </Grid>

          {/* Charts Section - Full Width Row */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 3,
                      gap: 1,
                    }}
                  >
                    <FaChartBar color={theme.palette.primary.main} />
                    <Typography variant="h6" fontWeight="bold">
                      Financial Overview
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
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
                          data: [
                            previousMonthData.feeCollection || 0,
                            paidStudentSum || 0,
                          ],
                          label: "Fee Collection",
                          color: "#4caf50",
                        },
                        {
                          data: [
                            previousMonthData.totalExpenditure || 0,
                            totalFilteredExpenditure || 0,
                          ],
                          label: "Expenditure",
                          color: "#f44336",
                        },
                      ]}
                      height={280}
                    />
                  </Box>
                </Paper>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 3,
                      gap: 1,
                    }}
                  >
                    <FaChartPie color={theme.palette.secondary.main} />
                    <Typography variant="h6" fontWeight="bold">
                      Expense Distribution
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 280,
                    }}
                  >
                    {pieChartData.length > 0 ? (
                      <PieChart
                        series={[
                          {
                            data: pieChartData,
                            highlightScope: {
                              faded: "global",
                              highlight: "item",
                            },
                            faded: {
                              innerRadius: 20,
                              additionalRadius: -20,
                              color: "gray",
                            },
                            innerRadius: 40,
                          },
                        ]}
                        height={280}
                        width={200}
                        slotProps={{
                          legend: {
                            direction: "column",
                            position: {
                              vertical: "middle",
                              horizontal: "right",
                            },
                            padding: 0,
                          },
                        }}
                      />
                    ) : (
                      <Box sx={{ textAlign: "center", py: 5 }}>
                        <Typography color="text.secondary" variant="body2">
                          No expense data available
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>

          {/* Tables Section - Equal Space */}
          <Grid container spacing={3}>
            {/* Student Payments Table */}
            <Grid item xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: "100%",
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FaUserCircle color={theme.palette.primary.main} />
                      <Typography variant="h6" fontWeight="bold">
                        Student Payments
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      {filteredStudents.length} students
                    </Typography>
                  </Box>

                  <TableContainer
                    sx={{
                      maxHeight: 400,
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow
                          sx={{
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.05
                            ),
                            "& th": {
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                              borderBottom: `2px solid ${alpha(
                                theme.palette.primary.main,
                                0.1
                              )}`,
                            },
                          }}
                        >
                          <TableHeadCell>S.No</TableHeadCell>
                          <TableHeadCell>Name</TableHeadCell>
                          {showSubjectColumn && (
                            <TableHeadCell>Subject</TableHeadCell>
                          )}
                          <TableHeadCell>Paid Date</TableHeadCell>
                          <TableHeadCell>Amount (₹)</TableHeadCell>
                          <TableHeadCell>Status</TableHeadCell>
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
                                hover
                                sx={{
                                  backgroundColor: hasPaid
                                    ? "inherit"
                                    : alpha(theme.palette.error.main, 0.04),
                                  "&:last-child td": { borderBottom: 0 },
                                }}
                              >
                                <TableCell
                                  align="center"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {index + 1}
                                </TableCell>
                                <TableCell>
                                  <Link
                                    to={`/student/${student.id}`}
                                    state={{ studentData: student }}
                                    style={{
                                      textDecoration: "none",
                                      color: "inherit",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {student.Name}
                                  </Link>
                                </TableCell>
                                {showSubjectColumn && (
                                  <TableCell align="center">
                                    <Box
                                      sx={{
                                        display: "inline-block",
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 1,
                                        backgroundColor:
                                          student.Subject === "Physics"
                                            ? alpha("#1565c0", 0.1)
                                            : alpha("#7b1fa2", 0.1),
                                        color:
                                          student.Subject === "Physics"
                                            ? "#1565c0"
                                            : "#7b1fa2",
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                      }}
                                    >
                                      {student.Subject}
                                    </Box>
                                  </TableCell>
                                )}
                                <TableCell
                                  align="center"
                                  sx={{ color: "text.secondary" }}
                                >
                                  {hasPaid
                                    ? new Date(
                                        paymentDetails?.paidOn
                                      ).toLocaleDateString("en-GB")
                                    : "-"}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {hasPaid
                                    ? paymentDetails?.amount?.toLocaleString(
                                        "en-IN"
                                      )
                                    : student["Monthly Fee"]?.toLocaleString(
                                        "en-IN"
                                      )}
                                </TableCell>
                                <TableCell align="center">
                                  <Box
                                    sx={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                      px: 1.5,
                                      py: 0.5,
                                      borderRadius: 1,
                                      backgroundColor: hasPaid
                                        ? alpha("#4caf50", 0.1)
                                        : alpha("#f44336", 0.1),
                                      color: hasPaid ? "#2e7d32" : "#d32f2f",
                                      fontSize: "0.75rem",
                                      fontWeight: 600,
                                      border: `1px solid ${
                                        hasPaid
                                          ? alpha("#4caf50", 0.2)
                                          : alpha("#f44336", 0.2)
                                      }`,
                                    }}
                                  >
                                    {hasPaid ? "✓ Paid" : "Pending"}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={showSubjectColumn ? 6 : 5}
                              align="center"
                              sx={{ py: 4 }}
                            >
                              <Typography
                                color="text.secondary"
                                variant="body2"
                              >
                                No student data available
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                      <TableFooter>
                        <TableRow
                          sx={{
                            backgroundColor: alpha(
                              theme.palette.success.main,
                              0.05
                            ),
                            "& td": {
                              fontWeight: 600,
                              borderTop: `2px solid ${alpha(
                                theme.palette.success.main,
                                0.1
                              )}`,
                            },
                          }}
                        >
                          <TableCell
                            colSpan={showSubjectColumn ? 4 : 3}
                            align="right"
                            sx={{ fontSize: "0.9rem" }}
                          >
                            Total Collected:
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              fontSize: "0.9rem",
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
              </motion.div>
            </Grid>

            {/* Expenditures Table */}
            <Grid item xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: "100%",
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FaReceipt color={theme.palette.warning.main} />
                      <Typography variant="h6" fontWeight="bold">
                        Expenditures
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      {filteredExpenditures.length} expenses
                    </Typography>
                  </Box>

                  <TableContainer
                    sx={{
                      maxHeight: 400,
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow
                          sx={{
                            backgroundColor: alpha(
                              theme.palette.warning.main,
                              0.05
                            ),
                            "& th": {
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                              borderBottom: `2px solid ${alpha(
                                theme.palette.warning.main,
                                0.1
                              )}`,
                            },
                          }}
                        >
                          <TableHeadCell>S.No</TableHeadCell>
                          <TableHeadCell>Date</TableHeadCell>
                          <TableHeadCell>Purpose</TableHeadCell>
                          <TableHeadCell>Amount (₹)</TableHeadCell>
                          <TableHeadCell>Actions</TableHeadCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredExpenditures.length > 0 ? (
                          filteredExpenditures.map((row, index) => (
                            <TableRow
                              key={`${row.type}-${row.id}`}
                              hover
                              sx={{ "&:last-child td": { borderBottom: 0 } }}
                            >
                              <TableCell
                                align="center"
                                sx={{ fontWeight: 500 }}
                              >
                                {index + 1}
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ color: "text.secondary" }}
                              >
                                {new Date(row.date).toLocaleDateString("en-GB")}
                              </TableCell>
                              <TableCell>
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>
                                    {row.purpose}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {row.work}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Box
                                  sx={{
                                    display: "inline-block",
                                    px: 2,
                                    py: 0.75,
                                    borderRadius: 1,
                                    backgroundColor: alpha("#f44336", 0.1),
                                    color: "#d32f2f",
                                    fontWeight: 600,
                                    fontSize: "0.875rem",
                                    border: `1px solid ${alpha(
                                      "#f44336",
                                      0.2
                                    )}`,
                                  }}
                                >
                                  ₹{row.amount.toLocaleString("en-IN")}
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                {row.isSalary ? (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontStyle: "italic",
                                      color: "text.secondary",
                                      px: 1.5,
                                      py: 0.5,
                                      backgroundColor: alpha("#9e9e9e", 0.1),
                                      borderRadius: 1,
                                      display: "inline-block",
                                    }}
                                  >
                                    Auto-generated
                                  </Typography>
                                ) : (
                                  <ActionButtons
                                    onEdit={() => handleEdit(row)}
                                    onDelete={() => handleDelete(row)}
                                    size="small"
                                  />
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              align="center"
                              sx={{ py: 4 }}
                            >
                              <Typography
                                color="text.secondary"
                                variant="body2"
                              >
                                No expenditures found for this month
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                      <TableFooter>
                        <TableRow
                          sx={{
                            backgroundColor: alpha(
                              theme.palette.error.main,
                              0.05
                            ),
                            "& td": {
                              fontWeight: 600,
                              borderTop: `2px solid ${alpha(
                                theme.palette.error.main,
                                0.1
                              )}`,
                            },
                          }}
                        >
                          <TableCell
                            colSpan={3}
                            align="right"
                            sx={{ fontSize: "0.9rem" }}
                          >
                            Total Expenditure:
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              fontSize: "0.9rem",
                              color: "error.main",
                            }}
                          >
                            ₹
                            {(totalFilteredExpenditure || 0).toLocaleString(
                              "en-IN"
                            )}
                          </TableCell>
                          <TableCell />
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TableContainer>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
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
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ExpenditureDashboard;
