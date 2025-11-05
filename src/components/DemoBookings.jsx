import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
  Tooltip,
  alpha,
  useTheme,
  Avatar,
  Badge,
  Fade,
  Zoom,
  Slide
} from "@mui/material";
import {
  Phone,
  Email,
  CalendarToday,
  School,
  Subject,
  AccessTime,
  CheckCircle,
  Edit,
  Person,
  TrendingUp,
  FilterList,
  Refresh
} from "@mui/icons-material";
import { fetchDemoBookings, updateDemoStatus } from '../redux/actions';
import { formatFirebaseDate } from "../mockdata/function";

const DemoBookingsPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  
  const { 
    demoBookings = [], 
    loading = false, 
    error = null 
  } = useSelector(state => state.demoBookings || {});
  
  const [statusFilter, setStatusFilter] = useState("all");
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [contactReason, setContactReason] = useState("");
  const [stats, setStats] = useState({ total: 0, contacted: 0, pending: 0 });

  useEffect(() => {
    dispatch(fetchDemoBookings(statusFilter));
  }, [dispatch, statusFilter]);

  useEffect(() => {
    if (demoBookings.length > 0) {
      const contacted = demoBookings.filter(d => d.status === "contacted").length;
      const pending = demoBookings.filter(d => d.status === "not_contacted").length;
      setStats({
        total: demoBookings.length,
        contacted,
        pending
      });
    }
  }, [demoBookings]);

  const handleStatusChange = (demo) => {
    setSelectedDemo(demo);
    if (demo.status === "not_contacted") {
      setContactDialogOpen(true);
    } else {
      dispatch(updateDemoStatus(demo.id, "not_contacted", ""));
    }
  };

  const handleContactConfirm = () => {
    if (contactReason.trim()) {
      dispatch(updateDemoStatus(selectedDemo.id, "contacted", contactReason));
      setContactDialogOpen(false);
      setContactReason("");
      setSelectedDemo(null);
    }
  };

  const handleRefresh = () => {
    dispatch(fetchDemoBookings(statusFilter));
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      not_contacted: { 
        color: "warning", 
        label: "Pending Contact",
        gradient: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)"
      },
      contacted: { 
        color: "success", 
        label: "Contacted",
        gradient: "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)"
      }
    };

    const config = statusConfig[status] || { color: "default", label: status };
    
    return (
      <Chip
        label={config.label}
        sx={{
          background: config.gradient,
          color: "white",
          fontWeight: 600,
          fontSize: "0.75rem",
          height: 24,
          "& .MuiChip-label": { px: 1.5 }
        }}
        size="small"
      />
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const StatCard = ({ title, value, color, icon, delay = 0 }) => (
    <Zoom in={true} style={{ transitionDelay: `${delay}ms` }}>
      <Card sx={{
        p: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(theme.palette[color].main, 0.05)} 100%)`,
        border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
        borderRadius: 4,
        boxShadow: `0 8px 32px ${alpha(theme.palette[color].main, 0.1)}`,
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 48px ${alpha(theme.palette[color].main, 0.2)}`,
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h3" sx={{ 
              fontWeight: 800, 
              background: `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].dark} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              {value}
            </Typography>
            <Typography variant="body2" sx={{ 
              color: 'text.secondary',
              fontWeight: 600,
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '0.5px'
            }}>
              {title}
            </Typography>
          </Box>
          <Avatar sx={{
            background: `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].dark} 100%)`,
            width: 48,
            height: 48
          }}>
            {icon}
          </Avatar>
        </Box>
      </Card>
    </Zoom>
  );

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 400,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress sx={{ color: 'white', mb: 2 }} size={60} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Loading Demo Bookings...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 3, 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Bookings"
            value={stats.total}
            color="primary"
            icon={<TrendingUp />}
            delay={100}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Contacted"
            value={stats.contacted}
            color="success"
            icon={<CheckCircle />}
            delay={200}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Pending Contact"
            value={stats.pending}
            color="warning"
            icon={<AccessTime />}
            delay={300}
          />
        </Grid>
      </Grid>

      {/* Filters Section */}
      <Fade in={true} timeout={1000}>
        <Card sx={{
          p: 3,
          mb: 3,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterList color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Filters
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm="auto">
              <TextField
                select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                size="small"
                sx={{ 
                  minWidth: 200,
                  background: 'white',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              >
                <MenuItem value="all">All Bookings</MenuItem>
                <MenuItem value="not_contacted">Not Contacted</MenuItem>
                <MenuItem value="contacted">Contacted</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500
                }}>
                  Showing {demoBookings.length} bookings
                </Typography>
                <Tooltip title="Refresh Data">
                  <IconButton 
                    onClick={handleRefresh}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      color: 'white',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                      }
                    }}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Fade>

      {error && (
        <Fade in={true}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(244, 67, 54, 0.1)'
            }}
          >
            {error}
          </Alert>
        </Fade>
      )}

      {/* Demo Bookings Table */}
      <Fade in={true} timeout={1200}>
        <Card sx={{
          borderRadius: 4,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}>
                  {["Student Details", "Stream & Subject", "Contact Info", "Booking Date", "Status", "Actions"].map((header) => (
                    <TableCell 
                      key={header}
                      sx={{ 
                        color: 'white', 
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        py: 3,
                        borderBottom: 'none'
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {demoBookings.map((demo, index) => (
                  <TableRow 
                    key={demo.id}
                    sx={{ 
                      background: index % 2 === 0 ? 'rgba(102, 126, 234, 0.02)' : 'transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                        transform: 'translateX(8px)'
                      } 
                    }}
                  >
                    {/* Student Details */}
                    <TableCell sx={{ borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          width: 40,
                          height: 40
                        }}>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {demo.name}
                          </Typography>
                          {demo.message && (
                            <Tooltip title={demo.message} arrow>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: 'text.secondary',
                                  fontStyle: 'italic',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}
                              >
                                "{demo.message}"
                              </Typography>
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Stream & Subject */}
                    <TableCell sx={{ borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <School fontSize="small" sx={{ color: theme.palette.primary.main }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {demo.stream}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Subject fontSize="small" sx={{ color: theme.palette.secondary.main }} />
                          <Typography variant="body2">
                            {demo.subject}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Contact Info */}
                    <TableCell sx={{ borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Phone fontSize="small" />
                          <Typography variant="body2" sx={{ 
                            fontFamily: 'monospace',
                            fontWeight: 500
                          }}>
                            {demo.mobile}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Email fontSize="small" />
                          <Typography variant="body2" sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {demo.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Booking Date */}
                    <TableCell sx={{ borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatFirebaseDate(demo.createdAt)}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Status */}
                    <TableCell sx={{ borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                      {getStatusChip(demo.status)}
                      {demo.contactReason && (
                        <Tooltip title={`Contact Reason: ${demo.contactReason}`} arrow>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'block', 
                              mt: 0.5,
                              color: 'text.secondary',
                              fontStyle: 'italic'
                            }}
                          >
                            {demo.contactReason.length > 25 
                              ? `${demo.contactReason.substring(0, 25)}...` 
                              : demo.contactReason
                            }
                          </Typography>
                        </Tooltip>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell sx={{ borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                      <Tooltip 
                        title={demo.status === "not_contacted" ? "Mark as Contacted" : "Mark as Not Contacted"}
                        arrow
                      >
                        <IconButton
                          onClick={() => handleStatusChange(demo)}
                          sx={{
                            background: demo.status === "not_contacted" 
                              ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
                              : `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
                            color: 'white',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              boxShadow: `0 8px 25px ${alpha(demo.status === "not_contacted" ? theme.palette.success.main : theme.palette.warning.main, 0.3)}`
                            },
                            transition: 'all 0.3s ease'
                          }}
                          size="small"
                        >
                          {demo.status === "not_contacted" ? <CheckCircle /> : <Edit />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {(!demoBookings || demoBookings.length === 0) && (
            <Box sx={{ 
              p: 8, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
            }}>
              <CalendarToday sx={{ 
                fontSize: 64, 
                color: theme.palette.text.secondary, 
                mb: 2,
                opacity: 0.5
              }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.secondary' }}>
                No Demo Bookings Found
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 400, mx: 'auto' }}>
                {statusFilter === "all" 
                  ? "There are no demo bookings in the system yet." 
                  : `No ${statusFilter.replace('_', ' ')} demo bookings match your current filter.`
                }
              </Typography>
            </Box>
          )}
        </Card>
      </Fade>

      {/* Contact Reason Dialog */}
      <Dialog 
        open={contactDialogOpen} 
        onClose={() => setContactDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 700
        }}>
          Mark as Contacted
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
            You are marking <span style={{ fontWeight: 700, color: theme.palette.primary.main }}>{selectedDemo?.name}</span> as contacted. 
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Please provide details about your conversation or follow-up plan:
          </Typography>
          <TextField
            autoFocus
            label="Contact Reason"
            fullWidth
            multiline
            rows={4}
            value={contactReason}
            onChange={(e) => setContactReason(e.target.value)}
            placeholder="Example: Called the student, discussed course details, scheduled follow-up for tomorrow..."
            error={!contactReason.trim()}
            helperText={!contactReason.trim() ? "Contact reason is required to track follow-up actions" : "Provide specific details about the conversation"}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: 'white'
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setContactDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleContactConfirm}
            variant="contained"
            disabled={!contactReason.trim()}
            sx={{
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
              }
            }}
          >
            Confirm Contact
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DemoBookingsPage;