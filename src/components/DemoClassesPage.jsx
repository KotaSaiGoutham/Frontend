import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Slide,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Fade,
  useTheme,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Zoom,
  MenuItem
} from "@mui/material";
import {
  FaChalkboardTeacher,
  FaPlus,
  FaArrowRight,
  FaEdit,
  FaCalendarAlt,
  FaClock,
  FaUserGraduate,
  FaUniversity,
  FaPhone,
} from "react-icons/fa";
import {
  Person,
  School,
  Subject,
  Email,
  CalendarToday,
  CheckCircle,
  TrendingUp,
  AccessTime,
  FilterList,
  Refresh,
  Edit as EditIcon
} from "@mui/icons-material";

// Import your existing actions and helpers
import {
  fetchDemoClasses,
  updateDemoClassStatus,
  deleteDemoClass,
  updateDemoClass,
  fetchDemoBookings,
  updateDemoStatus
} from "../redux/actions";
import { demoStatusConfig } from "../mockdata/Options";
import { formatFirebaseDate } from "../mockdata/function";
import DemoProgressTracker from "./customcomponents/DemoProgressTracker";
import { ActionButtons } from "./customcomponents/TableStatusSelect";
import TableStatusSelect from "./customcomponents/TableStatusSelect";

// ==========================================
// SUB-COMPONENT: ACTIVE DEMO CLASSES VIEW
// ==========================================
const ActiveDemosView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { demoClasses, loading, error } = useSelector((state) => state.demoClasses);

  const [filters, setFilters] = useState({ studentName: "", course: "", status: "" });
  const [activeTab, setActiveTab] = useState(0); // Internal tab for status filtering
  const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
  const [currentRemarks, setCurrentRemarks] = useState("");
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchDemoClasses());
  }, [dispatch]);

  // Handlers
  const handleStatusChange = (demoId, newStatus) => dispatch(updateDemoClassStatus(demoId, newStatus));
  const handleDeleteClick = (demo) => { setSelectedDemo(demo); setIsDeleteDialogOpen(true); };
  const handleConfirmDelete = () => {
    if (selectedDemo) {
      dispatch(deleteDemoClass(selectedDemo.id)).then(() => dispatch(fetchDemoClasses()));
    }
    setIsDeleteDialogOpen(false);
  };
  const handleSaveRemarks = async () => {
    if (selectedDemo) {
      await dispatch(updateDemoClass({ ...selectedDemo, remarks: currentRemarks }));
      setIsRemarksDialogOpen(false);
    }
  };

  // Filtering Logic
  const filteredDemoClasses = demoClasses.filter((demo) => {
    const matchesSearch = demo.studentName.toLowerCase().includes(filters.studentName.toLowerCase());
    const matchesCourse = filters.course === "" || demo.course === filters.course;
    
    let matchesTab = true;
    if (activeTab === 1) matchesTab = demo.status === "Contacted";
    if (activeTab === 2) matchesTab = demo.status === "Demo scheduled";
    if (activeTab === 3) matchesTab = demo.status === "Demo completed";
    if (activeTab === 4) matchesTab = demo.status === "Success";

    return matchesSearch && matchesCourse && matchesTab && !demo.addstudenttostudenttable;
  });

  const sortedDemoClasses = [...filteredDemoClasses].sort((a, b) => {
    const dateA = a.demoDate ? new Date(a.demoDate.split(".").reverse().join("-")) : new Date(0);
    const dateB = b.demoDate ? new Date(b.demoDate.split(".").reverse().join("-")) : new Date(0);
    return dateB - dateA;
  });

  const getStatusColor = (status) => {
    const colors = {
      Contacted: "#9c27b0", "Demo scheduled": "#1976d2", "Demo completed": "#ed6c02",
      Success: "#2e7d32", Pending: "#757575", Cancelled: "#d32f2f",
    };
    return colors[status] || "#757575";
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Search & Tabs Header */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
        <Tabs 
            value={activeTab} 
            onChange={(e, v) => setActiveTab(v)} 
            variant="scrollable" 
            scrollButtons="auto"
            sx={{ 
                '& .MuiTab-root': { fontWeight: 600, borderRadius: 2, mx: 0.5, minHeight: 40 },
                '& .Mui-selected': { color: 'white !important', bgcolor: theme.palette.primary.main }
            }}
        >
          <Tab label="All Active" />
          <Tab label="Contacted" />
          <Tab label="Scheduled" />
          <Tab label="Completed" />
          <Tab label="Success" />
        </Tabs>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
            placeholder="Search Student..."
            size="small"
            value={filters.studentName}
            onChange={(e) => setFilters({...filters, studentName: e.target.value})}
            sx={{ minWidth: 200 }}
            />
             <Button
                variant="contained"
                startIcon={<FaPlus />}
                onClick={() => navigate("/add-demo-class")}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
                Add Demo
            </Button>
        </Box>
      </Paper>

      {/* Grid Content */}
      {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box> :
       sortedDemoClasses.length === 0 ? <Alert severity="info">No active demo classes found for this category.</Alert> :
       <Grid container spacing={3}>
        {sortedDemoClasses.map((demo) => (
          <Grid item xs={12} md={6} lg={4} key={demo.id}>
             <Fade in={true} timeout={500}>
            <Card sx={{ 
                height: "100%", 
                borderRadius: 4,
                borderLeft: `6px solid ${getStatusColor(demo.status)}`,
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)", boxShadow: theme.shadows[10] }
            }}>
              <CardContent>
                {/* Header: Avatar + Name + Dropdown */}
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: getStatusColor(demo.status), fontWeight: 'bold' }}>
                    {demo.studentName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="700" noWrap>{demo.studentName}</Typography>
                    <TableStatusSelect
                      value={demo.status || ""}
                      onChange={(e) => handleStatusChange(demo.id, e.target.value)}
                      options={demoStatusConfig}
                      compact
                      sx={{ mt: 0.5, width: 140 }}
                    />
                  </Box>
                  <ActionButtons
                    onEdit={() => navigate("/add-demo-class", { state: { demoToEdit: demo } })}
                    onDelete={() => handleDeleteClick(demo)}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                   <DemoProgressTracker currentStatus={demo.status} />
                </Box>

                {/* Details Section */}
                <Box sx={{ p: 2, bgcolor: alpha(theme.palette.grey[100], 0.5), borderRadius: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <FaUserGraduate color={theme.palette.primary.main} />
                        <Typography variant="body2" fontWeight="600">{demo.course}</Typography>
                    </Box>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FaCalendarAlt size={12} color="gray" />
                                <Typography variant="caption">
                                    {demo.demoDate ? new Date(demo.demoDate.split(".").reverse().join("-")).toLocaleDateString('en-GB') : 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FaClock size={12} color="gray" />
                                <Typography variant="caption">
                                     {demo.demoTime ? new Date(`1970-01-01T${demo.demoTime}:00`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        {demo.contactNo && (
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <FaPhone size={12} color="gray" />
                                    <Typography variant="caption">{demo.contactNo}</Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Box>

                {/* Footer: Remarks & Move */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => { setSelectedDemo(demo); setCurrentRemarks(demo.remarks || ""); setIsRemarksDialogOpen(true); }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', maxWidth: 150 }} noWrap>
                            {demo.remarks || "Add remarks..."}
                        </Typography>
                        <FaEdit size={12} style={{ marginLeft: 5, color: theme.palette.primary.main }} />
                    </Box>

                    {demo.status === "Success" && (
                        <Button
                            variant="contained"
                            color="success"
                            size="small"
                            endIcon={<FaArrowRight />}
                            onClick={() => navigate("/add-student", { state: { studentData: demo, isDemo: true } })}
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                        >
                            Enrol
                        </Button>
                    )}
                </Box>

              </CardContent>
            </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
      }

      {/* Dialogs */}
      <Dialog open={isRemarksDialogOpen} onClose={() => setIsRemarksDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Update Remarks</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Remarks" fullWidth multiline rows={4} value={currentRemarks} onChange={(e) => setCurrentRemarks(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRemarksDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveRemarks}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this demo?</DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// ==========================================
// SUB-COMPONENT: DEMO BOOKINGS VIEW
// ==========================================
const BookingsView = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { demoBookings = [], loading, error } = useSelector(state => state.demoBookings || {});
    const [statusFilter, setStatusFilter] = useState("all");
    const [contactDialogOpen, setContactDialogOpen] = useState(false);
    const [selectedDemo, setSelectedDemo] = useState(null);
    const [contactReason, setContactReason] = useState("");
    const [stats, setStats] = useState({ total: 0, contacted: 0, pending: 0 });

    useEffect(() => { dispatch(fetchDemoBookings(statusFilter)); }, [dispatch, statusFilter]);

    useEffect(() => {
        if (demoBookings.length > 0) {
            setStats({
                total: demoBookings.length,
                contacted: demoBookings.filter(d => d.status === "contacted").length,
                pending: demoBookings.filter(d => d.status === "not_contacted").length
            });
        }
    }, [demoBookings]);

    const handleStatusChange = (demo) => {
        setSelectedDemo(demo);
        if (demo.status === "not_contacted") setContactDialogOpen(true);
        else dispatch(updateDemoStatus(demo.id, "not_contacted", ""));
    };

    const handleContactConfirm = () => {
        if (contactReason.trim()) {
            dispatch(updateDemoStatus(selectedDemo.id, "contacted", contactReason));
            setContactDialogOpen(false); setContactReason(""); setSelectedDemo(null);
        }
    };

    const getStatusChip = (status) => {
        const config = status === 'contacted' 
            ? { color: "success", label: "Contacted", gradient: "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)" }
            : { color: "warning", label: "Pending", gradient: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)" };
        
        return <Chip label={config.label} size="small" sx={{ background: config.gradient, color: 'white', fontWeight: 600 }} />;
    };

    const StatCard = ({ title, value, color, icon }) => (
        <Card sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`, bgcolor: alpha(theme.palette[color].main, 0.05) }}>
            <Box>
                <Typography variant="h4" fontWeight="800" color={`${color}.main`}>{value}</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight="600" textTransform="uppercase">{title}</Typography>
            </Box>
            <Avatar sx={{ bgcolor: `${color}.main`, width: 48, height: 48 }}>{icon}</Avatar>
        </Card>
    );

    return (
        <Box sx={{ mt: 2 }}>
             {/* Stats Row */}
             <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}><StatCard title="Total Requests" value={stats.total} color="primary" icon={<TrendingUp />} /></Grid>
                <Grid item xs={12} md={4}><StatCard title="Contacted" value={stats.contacted} color="success" icon={<CheckCircle />} /></Grid>
                <Grid item xs={12} md={4}><StatCard title="Pending" value={stats.pending} color="warning" icon={<AccessTime />} /></Grid>
            </Grid>

            {/* Filter & Table */}
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FilterList color="primary" />
                        <Typography variant="h6" fontWeight="600">Booking Requests</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} size="small" sx={{ width: 180 }}>
                            <MenuItem value="all">All Requests</MenuItem>
                            <MenuItem value="not_contacted">Pending</MenuItem>
                            <MenuItem value="contacted">Contacted</MenuItem>
                        </TextField>
                        <Tooltip title="Refresh"><IconButton onClick={() => dispatch(fetchDemoBookings(statusFilter))} sx={{ bgcolor: theme.palette.primary.light, color: 'white', '&:hover': { bgcolor: theme.palette.primary.main } }}><Refresh /></IconButton></Tooltip>
                    </Box>
                </Box>

                {loading ? <CircularProgress /> : 
                 demoBookings.length === 0 ? <Alert severity="info">No booking requests found.</Alert> :
                 <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
                                {["Student", "Stream/Subject", "Contact", "Date", "Status", "Actions"].map(h => 
                                    <TableCell key={h} sx={{ fontWeight: 700, color: theme.palette.text.primary }}>{h}</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {demoBookings.map((demo) => (
                                <TableRow key={demo.id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 32, height: 32 }}><Person fontSize="small" /></Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="600">{demo.name}</Typography>
                                                {demo.message && <Typography variant="caption" color="text.secondary" noWrap display="block" maxWidth={150}>{demo.message}</Typography>}
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="600">{demo.stream}</Typography>
                                        <Typography variant="caption">{demo.subject}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><FaPhone size={10} color="gray"/><Typography variant="caption">{demo.mobile}</Typography></Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Email sx={{ fontSize: 12, color: "gray" }}/><Typography variant="caption">{demo.email}</Typography></Box>
                                    </TableCell>
                                    <TableCell>
                                         <Typography variant="body2" fontWeight="500">{formatFirebaseDate(demo.createdAt)}</Typography>
                                    </TableCell>
                                    <TableCell>{getStatusChip(demo.status)}</TableCell>
                                    <TableCell>
                                        <Tooltip title={demo.status === "not_contacted" ? "Mark Contacted" : "Edit Status"}>
                                            <IconButton size="small" onClick={() => handleStatusChange(demo)} color={demo.status === "not_contacted" ? "success" : "default"}>
                                                {demo.status === "not_contacted" ? <CheckCircle /> : <EditIcon />}
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 </TableContainer>
                }
            </Paper>

            <Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>Mark as Contacted</DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <DialogContentText sx={{ mt: 2, mb: 2 }}>What was the outcome of your conversation with <b>{selectedDemo?.name}</b>?</DialogContentText>
                    <TextField autoFocus label="Conversation Details" fullWidth multiline rows={4} value={contactReason} onChange={(e) => setContactReason(e.target.value)} />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setContactDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleContactConfirm} variant="contained" disabled={!contactReason.trim()}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

// ==========================================
// MAIN PARENT COMPONENT
// ==========================================
const DemoClassesPage = () => {
  const [mainTab, setMainTab] = useState(0);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f4f6f8", p: 3 }}>
      {/* Unified Header */}
      <Slide direction="down" in={true} mountOnEnter>
        <Paper
          elevation={4}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 4,
            background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 60, height: 60 }}>
                <FaChalkboardTeacher size={30} color="white" />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="800">Demo Management</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Track conversions and manage incoming booking requests</Typography>
            </Box>
          </Box>
          
          {/* Main Tab Switcher */}
          <Paper sx={{ bgcolor: "rgba(255,255,255,0.15)", borderRadius: 3, p: 0.5 }}>
            <Tabs 
                value={mainTab} 
                onChange={(e, v) => setMainTab(v)} 
                textColor="inherit"
                sx={{ 
                    '& .MuiTabs-indicator': { bgcolor: '#4caf50', height: 4, borderRadius: 2 },
                    '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)', fontWeight: 600, minHeight: 48, px: 3 },
                    '& .Mui-selected': { color: '#fff !important' }
                }}
            >
                <Tab label="Active Demo Classes" icon={<School style={{ marginRight: 8 }} />} iconPosition="start" />
                <Tab label="Incoming Bookings" icon={<CalendarToday style={{ marginRight: 8 }} />} iconPosition="start" />
            </Tabs>
          </Paper>
        </Paper>
      </Slide>

      {/* Content Rendering with Transition */}
      <Box sx={{ position: 'relative' }}>
        {mainTab === 0 && (
            <Fade in={mainTab === 0} timeout={600}>
                <Box>
                   <ActiveDemosView />
                </Box>
            </Fade>
        )}
        {mainTab === 1 && (
            <Fade in={mainTab === 1} timeout={600}>
                <Box>
                    <BookingsView />
                </Box>
            </Fade>
        )}
      </Box>
    </Box>
  );
};

export default DemoClassesPage;