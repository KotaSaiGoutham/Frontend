// src/pages/Employees.js
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees, updateEmployeeData } from "../redux/actions";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion"; // Animation Library

// Icons
import {
  FaMoneyBillWave,
  FaUserTie,
  FaBuilding,
  FaWallet,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter,
  FaPlus,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaEdit,
  FaCheck,
  FaPhoneAlt,
  FaUsers
} from "react-icons/fa";
import { MdClose, MdRefresh } from "react-icons/md";

// MUI Imports
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Alert,
  IconButton,
  TextField,
  Tooltip,
  Chip,
  Avatar,
  Drawer,
  Button,
  Grid,
  InputAdornment,
  Divider,
  useTheme,
  alpha
} from "@mui/material";

// Custom Components (Assuming these exist, updated usage slightly)
import { MuiSelect } from "../components/customcomponents/MuiCustomFormFields";

const Employees = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  // Redux State
  const { employees, loading, error } = useSelector((state) => state.employees);

  // Local State
  const [editingRow, setEditingRow] = useState(null);
  const [newSalary, setNewSalary] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  
  const [filters, setFilters] = useState({
    name: "",
    role: "",
    paymentStatus: "",
  });

  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  // --- Memos & Calculations ---

  const uniqueRoles = useMemo(() => {
    return [...new Set(employees.map((emp) => emp.role))].sort();
  }, [employees]);

  const stats = useMemo(() => {
    const totalPayroll = filteredEmployees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
    const paidCount = filteredEmployees.filter(e => e.paid).length;
    const unpaidCount = filteredEmployees.length - paidCount;
    return { totalPayroll, paidCount, unpaidCount, totalCount: filteredEmployees.length };
  }, [filteredEmployees]);

  const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // --- Effects ---

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    let temp = [...employees];

    // Filtering
    if (filters.name) {
      temp = temp.filter((e) => e.name.toLowerCase().includes(filters.name.toLowerCase()));
    }
    if (filters.role) {
      temp = temp.filter((e) => e.role === filters.role);
    }
    if (filters.paymentStatus) {
      const isPaid = filters.paymentStatus === "paid";
      temp = temp.filter((e) => e.paid === isPaid);
    }

    // Sorting
    if (sortConfig.key) {
      temp.sort((a, b) => {
        if (a.paid !== b.paid) return a.paid ? -1 : 1; // Always keep paid top/bottom logic if desired, or remove this

        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (sortConfig.key === "lastPaid") {
           const dateA = aVal ? parseISO(aVal).getTime() : 0;
           const dateB = bVal ? parseISO(bVal).getTime() : 0;
           return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
        }

        if (typeof aVal === "string") {
          return sortConfig.direction === "asc" 
            ? aVal.localeCompare(bVal) 
            : bVal.localeCompare(aVal);
        }
        
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      });
    }

    setFilteredEmployees(temp);
  }, [filters, employees, sortConfig]);

  // --- Handlers ---

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ name: "", role: "", paymentStatus: "" });
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const handleSaveSalary = async (id) => {
    if (!newSalary || isNaN(newSalary)) return alert("Invalid salary");
    await dispatch(updateEmployeeData(id, { salary: Number(newSalary) }));
    setEditingRow(null);
    setNewSalary("");
  };

  const handlePaidToggle = async (emp) => {
    if (emp.paid) return alert("Already paid for this month.");
    try {
      await dispatch(updateEmployeeData(emp.id, { paid: !emp.paid }));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Components ---

  const StatCard = ({ title, value, icon, color, subtext }) => (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, #ffffff 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-5px)', boxShadow: `0 10px 20px ${alpha(color, 0.15)}` }
      }}
    >
      <Box>
        <Typography variant="body2" color="text.secondary" fontWeight="600" textTransform="uppercase" letterSpacing={1}>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="800" sx={{ color: '#2d3748', my: 1 }}>
          {value}
        </Typography>
        {subtext && <Typography variant="caption" color="text.secondary">{subtext}</Typography>}
      </Box>
      <Box sx={{ 
        p: 2, 
        borderRadius: '50%', 
        bgcolor: color, 
        color: 'white',
        boxShadow: `0 4px 12px ${alpha(color, 0.4)}`
      }}>
        {icon}
      </Box>
    </Paper>
  );

  // --- Render Loading/Error ---

  if (loading) return (
    <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f4f6f8' }}>
      <CircularProgress size={60} thickness={4} />
    </Box>
  );

  if (error) return (
    <Box sx={{ p: 4, bgcolor: '#f4f6f8', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Alert severity="error" variant="filled" sx={{ width: '100%', maxWidth: 600, borderRadius: 2 }}>
        {typeof error === 'object' ? error.message : error}
        <Button color="inherit" size="small" sx={{ ml: 2 }} onClick={() => dispatch(fetchEmployees())}>Retry</Button>
      </Alert>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8", p: { xs: 2, md: 4 } }}>
      
      {/* 1. Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
           <Typography variant="h4" fontWeight="800" sx={{ background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
             Employee Dashboard
           </Typography>
           <Typography variant="body1" color="text.secondary">Manage your team and payroll</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<FaPlus />} 
          onClick={() => navigate("/add-employee")}
          sx={{ 
            borderRadius: 3, 
            textTransform: 'none', 
            fontSize: '1rem', 
            px: 3, 
            py: 1.2,
            background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
            boxShadow: '0 4px 14px 0 rgba(26,35,126,0.4)'
          }}
        >
          Add Employee
        </Button>
      </Box>

      {/* 3. Toolbar & Search */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 3, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          border: '1px solid rgba(0,0,0,0.06)' 
        }}
      >
        <TextField
          placeholder="Search employees..."
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          size="small"
          InputProps={{
            startAdornment: <InputAdornment position="start"><FaSearch color="#9e9e9e"/></InputAdornment>,
          }}
          sx={{ width: { xs: '100%', md: 300 }, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />

        <Button
          variant="outlined"
          startIcon={<FaFilter />}
          onClick={() => setIsFilterOpen(true)}
          sx={{ borderRadius: 3, textTransform: 'none', borderColor: '#e0e0e0', color: '#555' }}
        >
          Filters
          {(filters.role || filters.paymentStatus) && (
            <Box sx={{ ml: 1, width: 8, height: 8, bgcolor: 'red', borderRadius: '50%' }} />
          )}
        </Button>
      </Paper>

      {/* 4. Data Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              {[
                { label: "Employee", key: "name", align: "left" },
                { label: "Role", key: "role", align: "center" },
                { label: "Mobile", key: "mobile", align: "center" },
                { label: "Salary", key: "salary", align: "center" },
                { label: "Last Paid", key: "lastPaid", align: "center" },
                { label: "Status", key: "paid", align: "center" },
              ].map((head) => (
                <TableCell key={head.key} align={head.align} sx={{ py: 2.5 }}>
                  <Box 
                    component="span" 
                    onClick={() => handleSort(head.key)}
                    sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      cursor: 'pointer', 
                      fontWeight: 700,
                      color: sortConfig.key === head.key ? '#1a237e' : '#757575',
                      '&:hover': { color: '#1a237e' }
                    }}
                  >
                    {head.label}
                    {sortConfig.key === head.key && (
                       sortConfig.direction === 'asc' 
                       ? <FaSortAmountUp style={{ marginLeft: 8, fontSize: 12 }} /> 
                       : <FaSortAmountDown style={{ marginLeft: 8, fontSize: 12 }} />
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            <AnimatePresence>
              {filteredEmployees.map((employee, index) => (
                <TableRow
                  key={employee.id}
                  component={motion.tr}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                  sx={{ 
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) },
                    transition: 'background-color 0.2s'
                  }}
                >
                  {/* Name & Avatar */}
                  <TableCell onClick={() => navigate(`/employee/${employee.id}`)} sx={{ cursor: 'pointer' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: stringToColor(employee.name),
                          width: 40, height: 40, fontSize: '1rem', fontWeight: 'bold'
                        }}
                      >
                        {getInitials(employee.name)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="600" color="text.primary" style={{textDecoration:"underline"}}>
                          {employee.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Role */}
                  <TableCell align="center">
                    <Chip 
                      label={employee.role} 
                      size="small" 
                      sx={{ 
                        borderRadius: 2, 
                        fontWeight: 600, 
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        color: theme.palette.secondary.main
                      }} 
                    />
                  </TableCell>

                  {/* Mobile */}
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: 'text.secondary' }}>
                      <FaPhoneAlt size={12} />
                      <Typography variant="body2">{employee.mobile || "N/A"}</Typography>
                    </Box>
                  </TableCell>

                  {/* Salary (Editable) */}
                  <TableCell align="center">
                    {editingRow === employee.id ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TextField
                          autoFocus
                          type="number"
                          size="small"
                          value={newSalary}
                          onChange={(e) => setNewSalary(e.target.value)}
                          sx={{ width: 100, '& input': { py: 0.5 } }}
                        />
                        <IconButton size="small" color="success" onClick={() => handleSaveSalary(employee.id)}>
                          <FaCheck size={14} />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => setEditingRow(null)}>
                          <MdClose size={16} />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="600">
                           {currencyFormatter.format(employee.salary)}
                        </Typography>
                        <Tooltip title="Edit Salary">
                          <IconButton size="small" onClick={() => { setEditingRow(employee.id); setNewSalary(employee.salary); }}>
                            <FaEdit size={12} color="#bdbdbd" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </TableCell>

                  {/* Last Paid */}
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                       {employee.lastPaid ? format(parseISO(employee.lastPaid), "MMM dd, yyyy") : "-"}
                    </Typography>
                  </TableCell>

                  {/* Paid Status Toggle */}
                  <TableCell align="center">
                     <Chip
                       icon={employee.paid ? <FaCheckCircle /> : <FaTimesCircle />}
                       label={employee.paid ? "Paid" : "Unpaid"}
                       onClick={() => handlePaidToggle(employee)}
                       sx={{
                         fontWeight: "bold",
                         borderRadius: 2,
                         cursor: employee.paid ? "default" : "pointer",
                         bgcolor: employee.paid ? alpha("#2e7d32", 0.1) : alpha("#c62828", 0.1),
                         color: employee.paid ? "#2e7d32" : "#c62828",
                         border: `1px solid ${employee.paid ? alpha("#2e7d32", 0.2) : alpha("#c62828", 0.2)}`,
                         "&:hover": {
                           bgcolor: !employee.paid && alpha("#c62828", 0.2)
                         }
                       }}
                     />
                  </TableCell>
                </TableRow>
              ))}
            </AnimatePresence>

            {/* Total Row */}
            <TableRow sx={{ bgcolor: '#e3f2fd', borderTop: '2px solid #90caf9' }}>
               <TableCell colSpan={3} align="right">
                 <Typography variant="subtitle1" fontWeight="bold" color="primary.main">TOTAL MONTHLY PAYROLL</Typography>
               </TableCell>
               <TableCell align="center">
                 <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                    {currencyFormatter.format(stats.totalPayroll)}
                 </Typography>
               </TableCell>
               <TableCell colSpan={2} />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* 5. Filter Drawer */}
      <Drawer
        anchor="right"
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        PaperProps={{ sx: { width: 320, p: 3, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h6" fontWeight="700">Filter Employees</Typography>
          <IconButton onClick={() => setIsFilterOpen(false)}><MdClose /></IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <MuiSelect
            label="Filter by Role"
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            options={[{ value: "", label: "All Roles" }, ...uniqueRoles.map(r => ({ value: r, label: r }))]}
            icon={FaBuilding}
          />
          
          <MuiSelect
            label="Payment Status"
            name="paymentStatus"
            value={filters.paymentStatus}
            onChange={handleFilterChange}
            options={[
              { value: "", label: "All Statuses" },
              { value: "paid", label: "Paid" },
              { value: "unpaid", label: "Unpaid" },
            ]}
            icon={FaWallet}
          />

          <Divider sx={{ my: 1 }} />

          <Button 
            variant="contained" 
            fullWidth 
            onClick={() => setIsFilterOpen(false)}
            sx={{ borderRadius: 2, textTransform: 'none', py: 1.2 }}
          >
            Apply Filters
          </Button>

          <Button 
            variant="text" 
            fullWidth 
            startIcon={<MdRefresh />}
            onClick={clearFilters}
            sx={{ borderRadius: 2, textTransform: 'none', color: 'text.secondary' }}
          >
            Reset Filters
          </Button>
        </Box>
      </Drawer>

    </Box>
  );
};

// --- Helpers for Avatar Colors ---
const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

const getInitials = (name) => {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
};

export default Employees;