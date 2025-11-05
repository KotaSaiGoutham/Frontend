import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaChalkboardTeacher,
  FaBookOpen,
  FaCheckCircle,
  FaChartLine,
  FaClock,
  FaUserCheck,
  FaUserTimes,
  FaHourglassHalf,
  FaCalendarAlt,
  FaUsers,
  FaChartPie,
} from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Fade,
  Slide,
  Grow,
  Zoom,
  Chip,
  Avatar,
  useTheme,
  alpha
} from "@mui/material";
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { keyframes } from "@emotion/react";
import DetailCard from "./components/DetailCard";
import { fetchAttendanceSummary } from "../../redux/actions";

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const StudentClasses = () => {
  const { studentId } = useParams();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [studentData, setStudentData] = useState(null);
  const [animatedValues, setAnimatedValues] = useState({});
  
  const { attendanceSummary, loading, error } = useSelector(state => state.revisionExams.attendance);

  useEffect(() => {
    if (studentId) {
      dispatch(fetchAttendanceSummary(studentId, "all"));
    }
  }, [studentId, dispatch]);

  useEffect(() => {
    if (attendanceSummary?.summaries?.[activeTab]) {
      const summary = attendanceSummary.summaries[activeTab];
      setAnimatedValues({
        present: summary.presentCount,
        absent: summary.absentCount,
        pending: summary.pendingCount,
        percentage: summary.attendancePercentage
      });
    }
  }, [attendanceSummary, activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const StatCard = ({ icon, title, value, color, delay = 0 }) => (
    <Zoom in={true} style={{ transitionDelay: `${delay}ms` }}>
      <Card 
        sx={{ 
          background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
          border: `1px solid ${alpha(color, 0.2)}`,
          borderRadius: 3,
          boxShadow: `0 8px 32px ${alpha(color, 0.1)}`,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 16px 48px ${alpha(color, 0.2)}`,
          }
        }}
      >
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.7)} 100%)`,
              margin: '0 auto 16px',
              animation: `${pulse} 2s infinite`,
            }}
          >
            {React.cloneElement(icon, { 
              size: 24, 
              color: 'white' 
            })}
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: theme.palette.text.secondary,
              mb: 1
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              color: color,
              background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.8)})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Zoom>
  );

  const SessionSummary = ({ summary, sessionNumber }) => {
    if (!summary) return null;

    const pieChartData = [
      { 
        id: 0, 
        value: summary.presentCount, 
        label: 'Present', 
        color: '#4caf50' 
      },
      { 
        id: 1, 
        value: summary.absentCount, 
        label: 'Absent', 
        color: '#f44336' 
      },
      { 
        id: 2, 
        value: summary.pendingCount, 
        label: 'Pending', 
        color: '#ff9800' 
      },
    ];

    return (
      <Box sx={{ animation: `${fadeInUp} 0.6s ease-out` }}>
        {/* Summary Table */}
        <Fade in={true} timeout={800}>
          <TableContainer 
            component={Paper} 
            sx={{ 
              mb: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden'
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaCalendarAlt />
                      S.No
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaClock />
                      Days
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaBookOpen />
                      Total Classes
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaCheckCircle />
                      Completed
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaChartLine />
                      Total Hours
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaUsers />
                      Completed Hours
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow 
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      transform: 'scale(1.01)',
                      transition: 'all 0.2s ease'
                    } 
                  }}
                >
                  <TableCell>
                    <Chip 
                      label={sessionNumber} 
                      color="primary" 
                      variant="filled"
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        {summary.totalDays} Days
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {summary.period}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" fontWeight={700} color="primary">
                      {summary.totalClasses}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" fontWeight={700} color="success.main">
                      {summary.presentCount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" fontWeight={700} color="info.main">
                      {summary.totalHours}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" fontWeight={700} color="success.main">
                      {summary.completedHours}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>

        {/* Statistics Cards */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3, 
            mb: 4 
          }}
        >
          <StatCard
            icon={<FaUserCheck />}
            title="Present"
            value={summary.presentCount}
            color="#4caf50"
            delay={100}
          />
          <StatCard
            icon={<FaUserTimes />}
            title="Absent"
            value={summary.absentCount}
            color="#f44336"
            delay={200}
          />
          <StatCard
            icon={<FaHourglassHalf />}
            title="Pending"
            value={summary.pendingCount}
            color="#ff9800"
            delay={300}
          />
          <StatCard
            icon={<FaChartPie />}
            title="Attendance %"
            value={`${summary.attendancePercentage}%`}
            color="#2196f3"
            delay={400}
          />
        </Box>

        {/* Pie Chart */}
        {pieChartData.some(item => item.value > 0) && (
          <Slide direction="up" in={true} timeout={1000}>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                borderRadius: 3,
                p: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <PieChart
                series={[
                  {
                    data: pieChartData,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30 },
                    arcLabel: (item) => `${item.value}`,
                    arcLabelMinAngle: 45,
                  }
                ]}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fill: 'white',
                    fontWeight: 'bold',
                    fontSize: '14px',
                  },
                }}
                width={400}
                height={300}
                slotProps={{
                  legend: {
                    direction: 'row',
                    position: { vertical: 'bottom', horizontal: 'middle' },
                    padding: 0,
                    labelStyle: {
                      fontSize: 14,
                      fontWeight: 600,
                    },
                  },
                }}
              />
            </Box>
          </Slide>
        )}
      </Box>
    );
  };

  return (
    <div className="student-portfolio-tab premium light-theme">
      <div className="tab-content premium">
        <DetailCard 
          title="Classes info" 
          icon={FaChalkboardTeacher} 
          delay={400}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          {loading ? (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                py: 8,
                animation: `${fadeInUp} 0.6s ease-out`
              }}
            >
              <CircularProgress 
                size={60} 
                thickness={4}
                sx={{ 
                  color: 'primary.main',
                  mb: 2,
                  animation: `${pulse} 2s infinite`
                }} 
              />
              <Typography variant="h6" color="text.secondary">
                Loading attendance analytics...
              </Typography>
            </Box>
          ) : attendanceSummary?.summaries?.length > 0 ? (
            <Box sx={{ animation: `${fadeInUp} 0.6s ease-out` }}>
              {/* Tabs for Sessions */}
              <Box 
                sx={{ 
                  borderBottom: 1, 
                  borderColor: 'divider', 
                  mb: 4,
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  borderRadius: 2,
                  p: 1
                }}
              >
                <Tabs 
                  value={activeTab} 
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{
                    '& .MuiTab-root': {
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 2,
                      margin: '0 4px',
                      transition: 'all 0.3s ease',
                      minHeight: 48,
                      '&.Mui-selected': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                      },
                      '&:hover': {
                        background: alpha(theme.palette.primary.main, 0.1),
                        transform: 'translateY(-2px)',
                      }
                    },
                    '& .MuiTabs-indicator': {
                      display: 'none',
                    }
                  }}
                >
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FaCalendarAlt />
                        Session 1 (06.10.2025 - 15.11.2025)
                      </Box>
                    } 
                  />
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FaCalendarAlt />
                        Session 2 (16.11.2025 - 27.01.2026)
                      </Box>
                    } 
                  />
                </Tabs>
              </Box>

              {/* Session Content */}
              {activeTab === 0 && (
                <SessionSummary 
                  summary={attendanceSummary.summaries[0]} 
                  sessionNumber={1} 
                />
              )}
              {activeTab === 1 && (
                <SessionSummary 
                  summary={attendanceSummary.summaries[1]} 
                  sessionNumber={2} 
                />
              )}

              {/* Overall Summary */}
              {attendanceSummary.summaries.length === 2 && (
                <Fade in={true} timeout={1200}>
                  <Box 
                    sx={{ 
                      mt: 4, 
                      p: 4, 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 3,
                      color: 'white',
                      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                      animation: `${slideInRight} 0.8s ease-out`
                    }}
                  >
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                      📊 Combined Performance Summary
                    </Typography>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                      gap: 3 
                    }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                          {attendanceSummary.summaries[0].totalClasses + attendanceSummary.summaries[1].totalClasses}
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                          Total Classes
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: '#4caf50' }}>
                          {attendanceSummary.summaries[0].presentCount + attendanceSummary.summaries[1].presentCount}
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                          Total Present
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                          {attendanceSummary.summaries[0].totalHours + attendanceSummary.summaries[1].totalHours}
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                          Total Hours
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: '#2196f3' }}>
                          {Math.round(
                            ((attendanceSummary.summaries[0].presentCount + attendanceSummary.summaries[1].presentCount) / 
                             (attendanceSummary.summaries[0].totalClasses + attendanceSummary.summaries[1].totalClasses)) * 100
                          )}%
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                          Overall Attendance
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Fade>
              )}
            </Box>
          ) : (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                animation: `${fadeInUp} 0.6s ease-out`
              }}
            >
              <FaChartLine size={64} color={theme.palette.text.secondary} />
              <Typography variant="h4" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
                No Attendance Data
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Attendance analytics will appear here once data is available
              </Typography>
            </Box>
          )}
        </DetailCard>
      </div>
    </div>
  );
};

export default StudentClasses;