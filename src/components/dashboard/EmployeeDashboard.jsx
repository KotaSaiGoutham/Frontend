import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaArrowLeft,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaChartLine,
  FaDownload,
  FaCreditCard,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaFilter
} from "react-icons/fa";
import { format, parseISO } from "date-fns";

// MUI Components
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  Divider,
  Paper,
  Grow,
  useTheme,
  FormControl,
  Select,
  MenuItem,
  Tooltip
} from "@mui/material";

// Import actions
import { 
  fetchEmployeeById, 
  fetchEmployeePayments,
  setCurrentEmployee 
} from "../../redux/actions";

import EmployeePaymentsTab from "./EmployeePaymentsTab";
import EmployeeProfileTab from "./EmployeeProfileTab";
import EmployeeAnalyticsTab from "./EmployeeAnalyticsTab";

// PDF Generator Import
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoPng from "/spaceship.png"; 

const EmployeeDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  
  const {
    currentEmployee,
    employeeLoading,
    employeeError,
    employeePayments,
    paymentsLoading
  } = useSelector((state) => state.employees);
  
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (id) {
      dispatch(fetchEmployeeById(id));
      dispatch(fetchEmployeePayments(id));
    }
    return () => {
      dispatch(setCurrentEmployee(null));
    };
  }, [id, dispatch]);

  // Statistics Calculation
  const stats = useMemo(() => {
    if (!employeePayments || !Array.isArray(employeePayments) || employeePayments.length === 0) {
      return { totalPaid: 0, totalMonths: 0, averagePayment: 0, currentMonthPayment: 0, consecutiveMonths: 0 };
    }
    
    const totalPaid = employeePayments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
    const totalMonths = employeePayments.length;
    const averagePayment = totalPaid / totalMonths;
    
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const currentMonthPayment = employeePayments.find(p => 
      p.month === currentMonth && p.year === currentYear
    );
    
    // Sort for consecutive calc
    const sortedPayments = [...employeePayments].sort((a, b) => {
      const dateA = new Date(a.year, a.month - 1);
      const dateB = new Date(b.year, b.month - 1);
      return dateB - dateA;
    });
    
    let consecutiveMonths = 0;
    if(sortedPayments.length > 0) {
        consecutiveMonths = 1; 
        for (let i = 0; i < sortedPayments.length - 1; i++) {
            const current = new Date(sortedPayments[i].year, sortedPayments[i].month - 1);
            const next = new Date(sortedPayments[i + 1].year, sortedPayments[i + 1].month - 1);
            const monthDiff = (current.getFullYear() - next.getFullYear()) * 12 + (current.getMonth() - next.getMonth());
            if (monthDiff === 1) consecutiveMonths++;
            else break;
        }
    }

    return {
      totalPaid,
      totalMonths,
      averagePayment,
      currentMonthPayment: currentMonthPayment?.paidAmount || 0,
      consecutiveMonths,
    };
  }, [employeePayments]);

  // FIX: Ensure Filtering Works Correctly
  const filteredPayments = useMemo(() => {
    if (!employeePayments || !Array.isArray(employeePayments)) return [];
    if (selectedMonth === "all") return employeePayments;
    
    // Parse selectedMonth which is in "YYYY-MM" format (e.g. "2025-12")
    const [yearStr, monthStr] = selectedMonth.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    return employeePayments.filter(p => p.year === year && p.month === month);
  }, [employeePayments, selectedMonth]);

  const availableMonths = useMemo(() => {
    if (!employeePayments || !Array.isArray(employeePayments)) return [];
    const monthsSet = new Set();
    employeePayments.forEach(p => {
      // Create standardized YYYY-MM format
      monthsSet.add(`${p.year}-${String(p.month).padStart(2, '0')}`);
    });
    // Sort descending
    return Array.from(monthsSet).sort().reverse();
  }, [employeePayments]);

  // Helper for dropdown display
  const formatMonthLabel = (monthStr) => {
      if(!monthStr) return "";
      const [year, month] = monthStr.split("-");
      const date = new Date(year, month - 1);
      return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
  };

  // --- PDF Export Logic ---
  const handleExportAllPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;

    const drawCompanyHeader = (doc, pageWidth, margin, yCursor, title, subtitle) => {
      try { doc.addImage(logoPng, "PNG", margin, yCursor, 100, 36); } catch (e) {}
      doc.setFontSize(9); doc.setTextColor(100);
      doc.text("Electron Academy", margin, yCursor + 55);
      doc.text("KPHB, Hyderabad", margin, yCursor + 68);
      doc.text("electronacademy.2019@gmail.com | +91 8341482438", margin, yCursor + 81);
      doc.setFontSize(22); doc.setTextColor(26, 35, 126);
      doc.text(title, pageWidth / 2, yCursor + 30, { align: "center" });
      if(subtitle) {
          doc.setFontSize(12); doc.setTextColor(80);
          doc.text(subtitle, pageWidth / 2, yCursor + 50, { align: "center" });
      }
      return yCursor + 81;
    };

    const headers = ["Month", "Payment Date", "Salary", "Status", "Paid Amount"];
    // Use filteredPayments to export only what is seen
    const rows = filteredPayments.map(p => {
        const monthStr = new Date(p.year, p.month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
        const status = p.salary === p.paidAmount ? "Full Payment" : "Partial";
        return [monthStr, p.paymentDate, p.salary, status, p.paidAmount];
    });

    const totalSum = rows.reduce((sum, row) => sum + (parseFloat(row[4]) || 0), 0);
    const footerRow = ["", "", "", "Total Paid:", `Rs. ${totalSum.toLocaleString("en-IN")}`];

    let headerBottomY = 0;

    const drawHeader = (data) => {
        if(data.pageNumber === 1) {
            let y = 20;
            const contentEnd = drawCompanyHeader(doc, pageWidth, margin, y, "Payment History Report", `Employee: ${currentEmployee?.name}`);
            let dynY = contentEnd + 25;
            doc.setFontSize(10); doc.setTextColor(0);
            doc.text(`Role: ${currentEmployee?.role || "N/A"}`, margin, dynY);
            doc.text(`Mobile: ${currentEmployee?.mobile || "N/A"}`, margin + 200, dynY);
            doc.setFontSize(9); doc.setTextColor(100);
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin, y + 20, { align: 'right' });
            doc.setDrawColor(200); doc.line(margin, dynY + 15, pageWidth - margin, dynY + 15);
            headerBottomY = dynY + 20;
        } else { headerBottomY = 40; }
    };

    autoTable(doc, {
        head: [headers], body: rows, foot: [footerRow],
        startY: 160, margin: { top: 160, left: margin, right: margin },
        showFoot: 'lastPage', theme: 'striped',
        headStyles: { fillColor: [26, 35, 126], textColor: 255, fontStyle: 'bold', halign: 'center' },
        footStyles: { fillColor: [26, 35, 126], textColor: 255, fontStyle: 'bold', halign: 'center' },
        bodyStyles: { textColor: 80, halign: 'center' },
        columnStyles: { 0: { halign: 'left' }, 2: { halign: 'center' }, 4: { halign: 'center', fontStyle: 'bold' } },
        didDrawPage: (data) => {
            if(data.pageNumber === 1) data.settings.margin.top = 40;
            drawHeader(data);
            const str = `Page ${doc.internal.getNumberOfPages()}`;
            doc.setFontSize(8); doc.setTextColor(150);
            doc.text(str, pageWidth / 2, pageHeight - 15, { align: 'center' });
        }
    });
    doc.save(`${currentEmployee?.name || 'Report'}_History.pdf`);
  };

  const handleTabChange = (event, newValue) => setActiveTab(newValue);
  const handleBack = () => navigate("/employees");

  if (employeeLoading || paymentsLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f5f7fa' }}><CircularProgress size={60} /></Box>;
  }

  if (employeeError || !currentEmployee) {
    return <Box sx={{ p: 3 }}><Alert severity="error">{employeeError || "Employee not found"}</Alert><Button startIcon={<FaArrowLeft />} onClick={handleBack} sx={{ mt: 2 }}>Back</Button></Box>;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', pb: 4 }}>
      {/* Top Navigation Bar */}
      <Paper elevation={0} sx={{ px: 3, py: 2, mb: 3, backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item display="flex" alignItems="center" gap={2}>
            <IconButton onClick={handleBack} sx={{ bgcolor: '#f1f5f9' }}><FaArrowLeft /></IconButton>
            <Typography variant="h5" fontWeight="700" color="#0f172a">Employee Dashboard</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Box sx={{ px: { xs: 2, md: 3 }, width: '100%', boxSizing: 'border-box' }}>
        
        {/* FIX 1: alignItems="flex-start" prevents layout shifts between tabs */}
        <Grid container spacing={3} alignItems="flex-start">
            
          {/* LEFT COLUMN: Profile */}
          <Grid item xs={12} md={3} lg={2.5}>
            <Grow in={true} timeout={500}>
              <Card sx={{ borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', position: 'sticky', top: 20 }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 5, pb: 4 }}>
                  <Avatar sx={{ width: 120, height: 120, mb: 2, fontSize: '3rem', bgcolor: '#fff', color: '#334155', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '4px solid #f8fafc' }}>
                    {currentEmployee.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h5" fontWeight="800" gutterBottom color="#1e293b" textAlign="center">{currentEmployee.name}</Typography>
                  <Chip label={currentEmployee.role || 'Employee'} size="small" sx={{ mb: 4, fontWeight: 600, bgcolor: '#f1f5f9', color: '#475569' }} />
                  
                  {/* Stats Box */}
                  <Box sx={{ width: '100%', mb: 3 }}>
                     <Box sx={{ p:2, mb: 2, bgcolor: currentEmployee.paid ? '#ecfdf5' : '#fef2f2', borderRadius: 3, border: '1px solid', borderColor: currentEmployee.paid ? '#d1fae5' : '#fee2e2' }}>
                        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                            {currentEmployee.paid ? <FaCheckCircle color="#10b981"/> : <FaTimesCircle color="#ef4444"/>}
                            <Typography fontWeight="700" color={currentEmployee.paid ? "#047857" : "#b91c1c"}>{currentEmployee.paid ? "Paid" : "Unpaid"}</Typography>
                        </Box>
                        <Typography variant="caption" display="block" textAlign="center" color="textSecondary" mt={0.5}>Current Month</Typography>
                     </Box>
                     <Box sx={{ p:2, bgcolor: '#f8fafc', borderRadius: 3, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                        <Typography variant="h6" fontWeight="800" color="#0f172a">₹{currentEmployee.salary?.toLocaleString()}</Typography>
                        <Typography variant="caption" color="textSecondary">Base Salary</Typography>
                     </Box>
                  </Box>
                  
                  <Divider sx={{ width: '100%', mb: 3 }} />
                  {/* Contact Info */}
                  <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      <Box display="flex" alignItems="center" gap={2}>
                          <Box sx={{ p: 1, borderRadius: '50%', bgcolor: '#f1f5f9' }}><FaPhoneAlt size={14} color="#64748b"/></Box>
                          <Box>
                              <Typography variant="caption" color="textSecondary" display="block">Mobile</Typography>
                              <Typography variant="body2" fontWeight="600" color="#334155">{currentEmployee.mobile || 'N/A'}</Typography>
                          </Box>
                      </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* RIGHT COLUMN: Content */}
          <Grid item xs={12} md={9} lg={9.5}>
            
            {/* Stats Row */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} lg={3}>
                    <ModernStatCard title="Total Paid" value={`₹${stats.totalPaid.toLocaleString()}`} icon={<FaMoneyBillWave size={22} color="#ffffff" />} color="#6366f1" />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <ModernStatCard title="Months Paid" value={stats.totalMonths} icon={<FaCalendarAlt size={22} color="#ffffff" />} color="#ec4899" />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <ModernStatCard title="Avg. Monthly" value={`₹${stats.averagePayment.toLocaleString(undefined, {maximumFractionDigits:0})}`} icon={<FaChartLine size={22} color="#ffffff" />} color="#06b6d4" subtitle={`${stats.consecutiveMonths} Month Streak`} />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <ModernStatCard title="This Month" value={`₹${stats.currentMonthPayment.toLocaleString()}`} icon={<FaCreditCard size={22} color="#ffffff" />} color="#10b981" subtitle={currentEmployee.paid ? "Completed" : "Pending"} />
                </Grid>
            </Grid>

            {/* Main Tabbed Content */}
            <Grow in={true} timeout={1400}>
                <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    
                    {/* Header: Tabs + Filters */}
                    <Box sx={{ 
                        borderBottom: 1, 
                        borderColor: 'divider', 
                        px: 3, 
                        pt: 2,
                        display: 'flex', 
                        flexWrap: 'wrap',
                        justifyContent: 'space-between', 
                        alignItems: 'center'
                    }}>
                        <Tabs 
                            value={activeTab} 
                            onChange={handleTabChange}
                            textColor="primary"
                            indicatorColor="primary"
                            sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem', mr: 2, pb: 2, minHeight: 50 } }}
                        >
                            <Tab label="Payment History" icon={<FaMoneyBillWave style={{marginBottom:0, marginRight: 8}} />} iconPosition="start" />
                            <Tab label="Details & Overview" icon={<FaUserTie style={{marginBottom:0, marginRight: 8}} />} iconPosition="start" />
                            <Tab label="Analytics" icon={<FaChartLine style={{marginBottom:0, marginRight: 8}} />} iconPosition="start" />
                        </Tabs>

                        {/* FILTERS & EXPORT - Only visible when Active Tab is 0 (Payment History) */}
                        {activeTab === 0 && (
                             <Box sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center' }}>
                                <FormControl size="small" sx={{ minWidth: 150 }}>
                                    <Select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        displayEmpty
                                        variant="outlined"
                                        sx={{ height: 40, borderRadius: 2, bgcolor: '#f8fafc', '& fieldset': { border: '1px solid #e2e8f0' } }}
                                        renderValue={(selected) => {
                                            if (selected === 'all') return <Box display="flex" alignItems="center" gap={1} color="#64748b"><FaFilter size={12} /> All Months</Box>;
                                            return formatMonthLabel(selected);
                                        }}
                                    >
                                        <MenuItem value="all">All Months</MenuItem>
                                        {availableMonths.map(month => (
                                            <MenuItem key={month} value={month}>{formatMonthLabel(month)}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Tooltip title="Export Report">
                                    <Button 
                                        variant="contained" 
                                        onClick={handleExportAllPDF}
                                        startIcon={<FaDownload size={14} />}
                                        sx={{ height: 40, borderRadius: 2, bgcolor: '#1e293b', textTransform: 'none' }}
                                    >
                                        Export
                                    </Button>
                                </Tooltip>
                             </Box>
                        )}
                    </Box>

                    <Box sx={{ p: 3, minHeight: 400, bgcolor: '#fff' }}>
                        {activeTab === 0 && (
                            <EmployeePaymentsTab 
                                payments={employeePayments || []}
                                filteredPayments={filteredPayments} // Passing correctly processed filtered data
                                employee={currentEmployee}
                                page={page}
                                setPage={setPage}
                                rowsPerPage={rowsPerPage}
                                setRowsPerPage={setRowsPerPage}
                            />
                        )}
                        {activeTab === 1 && <EmployeeProfileTab employee={currentEmployee} />}
                        {activeTab === 2 && <EmployeeAnalyticsTab payments={employeePayments || []} />}
                    </Box>
                </Paper>
            </Grow>

          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const ModernStatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%', borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden', bgcolor: '#fff' }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, bgcolor: color }} />
        <CardContent sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="caption" fontWeight="700" color="textSecondary" sx={{ mb: 0.5, letterSpacing: 0.5, display: 'block', textTransform: 'uppercase' }}>{title}</Typography>
                    <Typography variant="h4" fontWeight="800" color="#1e293b" sx={{ mb: 0.5, fontSize: { xs: '1.5rem', md: '1.8rem' } }}>{value}</Typography>
                    {subtitle && <Chip label={subtitle} size="small" sx={{ mt: 1, height: 24, fontSize: '0.75rem', fontWeight: 700, bgcolor: `${color}15`, color: color }} />}
                </Box>
                <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 16px -4px ${color}50`, flexShrink: 0, mt: 0.5 }}>{React.cloneElement(icon, { color: '#fff' })}</Box>
            </Box>
        </CardContent>
    </Card>
);

export default EmployeeDashboard;