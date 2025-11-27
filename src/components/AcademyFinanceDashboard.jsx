import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress  
} from "@mui/material";
import {
  FaRupeeSign,
  FaChartLine,
  FaMoneyBillWave,
  FaPlus,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaEdit,
  FaTrash,
  FaChalkboardTeacher,
  FaUserGraduate
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PieChart } from "@mui/x-charts";
import { format, parseISO } from "date-fns";

// Import your academy finance actions
import { fetchAcademyFinance,deleteAcademyEarning  } from "../redux/actions";
import { yearOptions, monthOptions } from "../mockdata/function";

const AcademyFinanceDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [selectedDate, setSelectedDate] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
 const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    earning: null,
    loading: false
  });

  // Try different possible paths for academy finance data
  const academyFinance = useSelector((state) => 
    state.expenditure?.academyFinance || 
    state.expenditures?.academyFinance || 
    state.academyFinance || 
    {
      expenses: [],
      earnings: [],
      totalExpenses: 0,
      totalEarnings: 0,
      netBalance: 0,
      previousTotalExpenses: 0,
      previousTotalEarnings: 0,
      loading: false,
      error: null,
    }
  );

  const { 
    expenses, 
    earnings, 
    loading, 
    totalExpenses, 
    totalEarnings, 
    netBalance,
    previousTotalExpenses,
    previousTotalEarnings 
  } = academyFinance;

  // Fetch academy finance data when month/year changes
  useEffect(() => {
    dispatch(fetchAcademyFinance(selectedDate.year, selectedDate.month, "month"));
  }, [dispatch, selectedDate.year, selectedDate.month]);

  // Calculate financial metrics for academy finance
  const financialData = useMemo(() => {
    const currentEarnings = totalEarnings || 0;
    const currentExpenses = totalExpenses || 0;
    const previousEarnings = previousTotalEarnings || 0;
    const previousExpenses = previousTotalExpenses || 0;

    const netProfit = netBalance || currentEarnings - currentExpenses;
    const previousNetProfit = previousEarnings - previousExpenses;

    const earningsChange = previousEarnings !== 0 
      ? ((currentEarnings - previousEarnings) / previousEarnings) * 100 
      : currentEarnings > 0 ? 100 : 0;

    const expensesChange = previousExpenses !== 0 
      ? ((currentExpenses - previousExpenses) / previousExpenses) * 100 
      : currentExpenses > 0 ? 100 : 0;

    const profitChange = previousNetProfit !== 0 
      ? ((netProfit - previousNetProfit) / previousNetProfit) * 100 
      : netProfit > 0 ? 100 : 0;

    return {
      earnings: currentEarnings,
      expenses: currentExpenses,
      netProfit,
      earningsChange,
      expensesChange,
      profitChange,
      previousEarnings,
      previousExpenses
    };
  }, [totalEarnings, totalExpenses, netBalance, previousTotalEarnings, previousTotalExpenses]);

  // Categorize expenses for pie chart (from company expenses)
  const expenseCategories = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];
    
    const categories = expenses.reduce((acc, expense) => {
      const category = expense.employeeRole || expense.purpose || "Other";
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += expense.amount;
      return acc;
    }, {});

    return Object.entries(categories).map(([name, value], index) => ({
      id: index,
      value,
      label: name,
    }));
  }, [expenses]);

  // Categorize earnings by tutor for pie chart
  const earningsByTutor = useMemo(() => {
    if (!earnings || earnings.length === 0) return [];
    
    const tutors = earnings.reduce((acc, earning) => {
      const tutor = earning.tutorName || "Unknown Tutor";
      if (!acc[tutor]) {
        acc[tutor] = 0;
      }
      acc[tutor] += earning.amount;
      return acc;
    }, {});

    return Object.entries(tutors).map(([name, value], index) => ({
      id: index,
      value,
      label: name,
    }));
  }, [earnings]);

  const handleMonthChange = (e) => {
    setSelectedDate(prev => ({ ...prev, month: e.target.value }));
  };

  const handleYearChange = (e) => {
    setSelectedDate(prev => ({ ...prev, year: e.target.value }));
  };

  const handleAddExpense = () => {
  navigate("/add-expenditure", { 
    state: { 
      isCompanyExpense: true 
    } 
  });
};

  const handleAddEarning = () => {
    navigate("/add-academy-earnings");
  };

  const handleEditEarning = (earning) => {
    navigate("/add-academy-earnings", { state: { earningToEdit: earning } });
  };

const handleDeleteEarning = async (earning) => {
    // Set the earning to be deleted in state for confirmation
    setDeleteConfirm({
      open: true,
      earning: earning,
      loading: false
    });
  };
 const confirmDelete = async () => {
    if (!deleteConfirm.earning) return;

    setDeleteConfirm(prev => ({ ...prev, loading: true }));

    try {
      await dispatch(deleteAcademyEarning(deleteConfirm.earning.id));
      
      // Refresh the data after successful deletion
      dispatch(fetchAcademyFinance(selectedDate.year, selectedDate.month, "month"));
      
      // Close confirmation dialog
      setDeleteConfirm({
        open: false,
        earning: null,
        loading: false
      });

      // Optional: Show success message
      // You can add a toast notification here if you have a notification system

    } catch (error) {
      console.error("Failed to delete earning:", error);
      setDeleteConfirm(prev => ({ ...prev, loading: false }));
      
      // Optional: Show error message
      // You can add an error toast notification here
    }
  };

  // Cancel delete function
  const cancelDelete = () => {
    setDeleteConfirm({
      open: false,
      earning: null,
      loading: false
    });
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  const currentMonthName = monthOptions.find(m => m.value === selectedDate.month)?.label || '';

const EarningsTable = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay: 0.3 }}
    style={{ height: '100%' }}
  >
    <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CardContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
            <FaChalkboardTeacher /> Academy Earnings
            <Chip 
              label={`Total: ${formatCurrency(totalEarnings || 0)}`} 
              color="success" 
              size="medium"
              variant="filled"
              sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}
            />
          </Typography>
        </Box>
        <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
          <Table stickyHeader size="medium" sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: 'background.paper', 
                  fontSize: '0.9rem',
                  minWidth: 120,
                  whiteSpace: 'nowrap'
                }}>
                  Date
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: 'background.paper', 
                  fontSize: '0.9rem',
                  minWidth: 120,
                  whiteSpace: 'nowrap'
                }}>
                  Tutor
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: 'background.paper', 
                  fontSize: '0.9rem',
                  minWidth: 120,
                  whiteSpace: 'nowrap'
                }}>
                  Students
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: 'background.paper', 
                  fontSize: '0.9rem',
                  minWidth: 150,
                  whiteSpace: 'nowrap'
                }}>
                  Purpose
                </TableCell>
                <TableCell align="right" sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: 'background.paper', 
                  fontSize: '0.9rem',
                  minWidth: 100,
                  whiteSpace: 'nowrap'
                }}>
                  Amount
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: 'background.paper', 
                  fontSize: '0.9rem',
                  minWidth: 120,
                  whiteSpace: 'nowrap'
                }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            
            {/* ADD THE MISSING TableBody COMPONENT */}
            <TableBody>
              {earnings && earnings.length > 0 ? (
                earnings.map((earning, index) => (
                  <TableRow 
                    key={earning.id}
                    component={motion.tr}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    hover 
                    sx={{ 
                      backgroundColor: index % 2 === 0 ? 'background.default' : 'background.paper',
                      '&:last-child td, &:last-child th': { border: 0 }
                    }}
                  >
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.95rem' }}>
                        {formatDate(earning.date)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.95rem' }}>
                        {earning.tutorName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={earning.studentNames || 'N/A'} 
                        size="medium" 
                        variant="outlined"
                        color="primary"
                        sx={{ fontSize: '0.85rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.95rem' }}>
                          {earning.purpose}
                        </Typography>
                        {earning.work && (
                          <Typography variant="body2" color="text.secondary" display="block" sx={{ fontSize: '0.85rem' }}>
                            {earning.work}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" fontWeight="bold" color="success.main" sx={{ fontSize: '1rem' }}>
                        {formatCurrency(earning.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Edit Earning">
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <IconButton 
                              size="medium" 
                              onClick={() => handleEditEarning(earning)}
                              color="primary"
                            >
                              <FaEdit size={16} />
                            </IconButton>
                          </motion.div>
                        </Tooltip>
                        <Tooltip title="Delete Earning">
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <IconButton 
                              size="medium" 
                              onClick={() => handleDeleteEarning(earning)}
                              color="error"
                            >
                              <FaTrash size={16} />
                            </IconButton>
                          </motion.div>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <FaChalkboardTeacher size={64} color="#ccc" />
                        <Typography color="text.secondary" sx={{ mt: 2, fontSize: '1.1rem' }}>
                          No academy earnings found
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                          {currentMonthName} {selectedDate.year}
                        </Typography>
                      </Box>
                    </motion.div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  </motion.div>
);

const ExpensesTable = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay: 0.5 }}
    style={{ height: '100%' }}
  >
    <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CardContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
            <FaMoneyBillWave /> Company Expenses
            <Chip 
              label={`Total: ${formatCurrency(totalExpenses || 0)}`} 
              color="error" 
              size="medium"
              variant="filled"
              sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}
            />
          </Typography>
        </Box>
        <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
          <Table stickyHeader size="medium" sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: 'background.paper', 
                  fontSize: '0.9rem',
                  minWidth: 120,
                  whiteSpace: 'nowrap'
                }}>
                  Date
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: 'background.paper', 
                  fontSize: '0.9rem',
                  minWidth: 140,
                  whiteSpace: 'nowrap'
                }}>
                  Employee
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: 'background.paper', 
                  fontSize: '0.9rem',
                  minWidth: 150,
                  whiteSpace: 'nowrap'
                }}>
                  Purpose
                </TableCell>
                <TableCell align="right" sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: 'background.paper', 
                  fontSize: '0.9rem',
                  minWidth: 100,
                  whiteSpace: 'nowrap'
                }}>
                  Amount
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: 'background.paper', 
                  fontSize: '0.9rem',
                  minWidth: 100,
                  whiteSpace: 'nowrap'
                }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses && expenses.length > 0 ? (
                expenses.map((expense, index) => (
                  <TableRow 
                    key={expense.id}
                    component={motion.tr}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    hover 
                    sx={{ 
                      backgroundColor: index % 2 === 0 ? 'background.default' : 'background.paper',
                      '&:last-child td, &:last-child th': { border: 0 }
                    }}
                  >
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.95rem' }}>
                        {formatDate(expense.date)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.95rem' }}>
                          {expense.employeeName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                          {expense.employeeMobile}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.95rem' }}>
                          {expense.purpose.match(/\(([^)]+)\)/)?.[1] || expense.purpose}
                        </Typography>
                        {expense.work && (
                          <Typography variant="body2" color="text.secondary" display="block" sx={{ fontSize: '0.85rem' }}>
                            {expense.work}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" fontWeight="bold" color="error.main" sx={{ fontSize: '1rem' }}>
                        {formatCurrency(expense.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={expense.paid ? "Paid" : "Pending"} 
                        size="medium" 
                        color={expense.paid ? "success" : "warning"}
                        variant={expense.paid ? "filled" : "outlined"}
                        sx={{ fontSize: '0.85rem', fontWeight: 'bold' }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <FaMoneyBillWave size={64} color="#ccc" />
                        <Typography color="text.secondary" sx={{ mt: 2, fontSize: '1.1rem' }}>
                          No company expenses found
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                          {currentMonthName} {selectedDate.year}
                        </Typography>
                      </Box>
                    </motion.div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  </motion.div>
);

  return (
    <Box sx={{ p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
                🎓 Academy Finance Dashboard
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.9, fontSize: '1.2rem' }}>
                {currentMonthName} {selectedDate.year} - Financial Overview
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2} justifyContent="flex-end">
                <Grid item xs={6} sm={4}>
                  <FormControl fullWidth size="medium" variant="outlined">
                    <InputLabel sx={{ color: 'white', fontSize: '1rem' }}>Month</InputLabel>
                    <Select
                      value={selectedDate.month}
                      onChange={handleMonthChange}
                      label="Month"
                      sx={{ 
                        color: 'white',
                        fontSize: '1rem',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' }
                      }}
                    >
                      {monthOptions.map(month => (
                        <MenuItem key={month.value} value={month.value} sx={{ fontSize: '1rem' }}>
                          {month.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControl fullWidth size="medium" variant="outlined">
                    <InputLabel sx={{ color: 'white', fontSize: '1rem' }}>Year</InputLabel>
                    <Select
                      value={selectedDate.year}
                      onChange={handleYearChange}
                      label="Year"
                      sx={{ 
                        color: 'white',
                        fontSize: '1rem',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' }
                      }}
                    >
                      {yearOptions.map(year => (
                        <MenuItem key={year} value={year} sx={{ fontSize: '1rem' }}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '100%' }}
          transition={{ duration: 0.5 }}
        >
          <LinearProgress sx={{ mb: 4, borderRadius: 2, height: 6 }} />
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  startIcon={<FaPlus />}
                  onClick={handleAddExpense}
                  size="large"
                  sx={{
                    fontSize: '1.1rem',
                    px: 4,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #ff5252 0%, #e53935 100%)'
                    }
                  }}
                >
                  Add Company Expense
                </Button>
              </motion.div>
            </Grid>
            <Grid item>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  startIcon={<FaPlus />}
                  onClick={handleAddEarning}
                  size="large"
                  sx={{
                    fontSize: '1.1rem',
                    px: 4,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #26a69a 0%, #00796b 100%)'
                    }
                  }}
                >
                  Add Academy Earning
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Financial Summary - Centered */}
      <Grid container justifyContent="center" sx={{ mb: 6 }}>
        <Grid item xs={12} lg={10}>
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, type: "spring" }}
          >
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
              <Typography variant="h4" gutterBottom color="primary" fontWeight="bold" align="center" sx={{ fontSize: '2rem', mb: 3 }}>
                📊 Financial Summary - {currentMonthName} {selectedDate.year}
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Box sx={{ textAlign: 'center', p: 3, backgroundColor: 'white', borderRadius: 3, boxShadow: 2 }}>
                      <Typography variant="h3" color="success.main" fontWeight="bold" sx={{ fontSize: '2.5rem' }}>
                        {formatCurrency(financialData.earnings)}
                      </Typography>
                      <Typography variant="h6" color="text.secondary" sx={{ fontSize: '1.2rem', mt: 1 }}>
                        Revenue
                      </Typography>
                      <Chip 
                        icon={financialData.earningsChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                        label={`${financialData.earningsChange >= 0 ? '+' : ''}${financialData.earningsChange.toFixed(1)}%`}
                        color={financialData.earningsChange >= 0 ? "success" : "error"}
                        size="medium"
                        sx={{ mt: 2, fontSize: '1rem', fontWeight: 'bold', py: 1 }}
                      />
                    </Box>
                  </motion.div>
                </Grid>
                <Grid item xs={12} md={4}>
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Box sx={{ textAlign: 'center', p: 3, backgroundColor: 'white', borderRadius: 3, boxShadow: 2 }}>
                      <Typography variant="h3" color="error.main" fontWeight="bold" sx={{ fontSize: '2.5rem' }}>
                        {formatCurrency(financialData.expenses)}
                      </Typography>
                      <Typography variant="h6" color="text.secondary" sx={{ fontSize: '1.2rem', mt: 1 }}>
                        Expenses 
                      </Typography>
                      <Chip 
                        icon={financialData.expensesChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                        label={`${financialData.expensesChange >= 0 ? '+' : ''}${financialData.expensesChange.toFixed(1)}%`}
                        color={financialData.expensesChange >= 0 ? "error" : "success"}
                        size="medium"
                        sx={{ mt: 2, fontSize: '1rem', fontWeight: 'bold', py: 1 }}
                      />
                    </Box>
                  </motion.div>
                </Grid>
                <Grid item xs={12} md={4}>
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Box sx={{ textAlign: 'center', p: 3, backgroundColor: 'white', borderRadius: 3, boxShadow: 2 }}>
                      <Typography 
                        variant="h3" 
                        color={financialData.netProfit >= 0 ? "success.main" : "error.main"} 
                        fontWeight="bold"
                        sx={{ fontSize: '2.5rem' }}
                      >
                        {formatCurrency(financialData.netProfit)}
                      </Typography>
                      <Typography variant="h6" color="text.secondary" sx={{ fontSize: '1.2rem', mt: 1 }}>
                        Deficit
                      </Typography>
                      <Chip 
                        icon={financialData.profitChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                        label={`${financialData.profitChange >= 0 ? '+' : ''}${financialData.profitChange.toFixed(1)}%`}
                        color={financialData.profitChange >= 0 ? "success" : "error"}
                        size="medium"
                        sx={{ mt: 2, fontSize: '1rem', fontWeight: 'bold', py: 1 }}
                      />
                    </Box>
                  </motion.div>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Earnings Section - Table and Pie Chart Side by Side */}
      <Grid container spacing={4} sx={{ mb: 4 }} justifyContent="center">
        <Grid item xs={12} lg={8}>
          <EarningsTable />
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{ height: '100%' }}
          >
            <Card elevation={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3 }}>
              <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main', mb: 2, fontSize: '1.3rem' }}>
                  <FaChalkboardTeacher /> Earnings by Tutor
                </Typography>
                {earningsByTutor.length > 0 ? (
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PieChart
                      series={[
                        {
                          data: earningsByTutor,
                          highlightScope: { faded: 'global', highlighted: 'item' },
                          faded: { innerRadius: 15, additionalRadius: -15 },
                        }
                      ]}
                      height={250}
                      width={320}
                      margin={{ top: 10, bottom: 60, left: 10, right: 10 }}
                      slotProps={{
                        legend: {
                          direction: 'column',
                          position: { vertical: 'bottom', horizontal: 'middle' },
                          padding: 0,
                          itemMarkWidth: 8,
                          itemMarkHeight: 8,
                          labelStyle: { fontSize: '0.9rem', fontWeight: 'bold' },
                        },
                      }}
                    />
                  </Box>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
                      <FaChalkboardTeacher size={48} color="#ccc" />
                      <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 2, fontSize: '1.1rem' }}>
                        No earnings data
                      </Typography>
                    </Box>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Expenses Section - Table and Pie Chart Side by Side */}
      <Grid container spacing={4} sx={{ mb: 4 }} justifyContent="center">
        <Grid item xs={12} lg={8}>
          <ExpensesTable />
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            style={{ height: '100%' }}
          >
            <Card elevation={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3 }}>
              <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main', mb: 2, fontSize: '1.3rem' }}>
                  <FaMoneyBillWave /> Expense Categories
                </Typography>
                {expenseCategories.length > 0 ? (
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PieChart
                      series={[
                        {
                          data: expenseCategories,
                          highlightScope: { faded: 'global', highlighted: 'item' },
                          faded: { innerRadius: 15, additionalRadius: -15 },
                        }
                      ]}
                      height={250}
                      width={320}
                      margin={{ top: 10, bottom: 60, left: 10, right: 10 }}
                      slotProps={{
                        legend: {
                          direction: 'column',
                          position: { vertical: 'bottom', horizontal: 'middle' },
                          padding: 0,
                          itemMarkWidth: 8,
                          itemMarkHeight: 8,
                          labelStyle: { fontSize: '0.9rem', fontWeight: 'bold' },
                        },
                      }}
                    />
                  </Box>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
                      <FaMoneyBillWave size={48} color="#ccc" />
                      <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 2, fontSize: '1.1rem' }}>
                        No expense data
                      </Typography>
                    </Box>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
       {deleteConfirm.open && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Paper elevation={8} sx={{ p: 4, borderRadius: 3, maxWidth: 400, width: '90vw' }}>
              <Typography variant="h5" gutterBottom color="error" fontWeight="bold">
                Confirm Delete
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Are you sure you want to delete this earning record?
              </Typography>
              {deleteConfirm.earning && (
                <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {deleteConfirm.earning.tutorName} - {formatCurrency(deleteConfirm.earning.amount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {deleteConfirm.earning.purpose}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(deleteConfirm.earning.date)}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  onClick={cancelDelete}
                  disabled={deleteConfirm.loading}
                  variant="outlined"
                  size="large"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  disabled={deleteConfirm.loading}
                  variant="contained"
                  color="error"
                  size="large"
                  startIcon={deleteConfirm.loading ? <CircularProgress size={16} /> : <FaTrash />}
                >
                  {deleteConfirm.loading ? 'Deleting...' : 'Delete'}
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </Box>
      )}

    </Box>
  );
};

export default AcademyFinanceDashboard;