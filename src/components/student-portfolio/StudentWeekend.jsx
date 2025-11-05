import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  TextField,
  Button,
  Typography,
  Chip,
  Paper,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Tooltip,
} from "@mui/material";
import { PieChart, useDrawingArea } from "@mui/x-charts";
import { styled } from "@mui/material/styles";

import {
  Search as SearchIcon,
  Clear as ClearIcon,
  History as HistoryIcon,
  Event as EventIcon,
  Subject as SubjectIcon,
  Today as TodayIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  PieChart as PieChartIcon,
  TableChart as TableChartIcon,
} from "@mui/icons-material";
import DetailCard from "./components/DetailCard";
import {
  fetchStudentClasses,
  searchStudentClasses,
  clearSearchResults,
  fetchYearStatistics,
} from "../../redux/actions";

const StudentWeekend = () => {
  const { studentId } = useParams();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const { studentClasses, yearStatistics } = useSelector(
    (state) => state.classSchedule
  );
  const {
    pastClasses = [],
    futureClasses = [],
    loading,
    error,
    searchResults = [],
    searchQuery,
    totalResults = 0,
    searchLoading,
    searchError,
  } = studentClasses;

  const {
    firstYear,
    secondYear,
    loading: statsLoading,
    error: statsError,
  } = yearStatistics;
  // Add debugging logs
  console.log("🔍 Year Statistics State:", yearStatistics);
  console.log("🔍 First Year Data:", firstYear);
  console.log("🔍 Second Year Data:", secondYear);

  const currentStudent = useSelector((state) => state.auth?.currentStudent);

  useEffect(() => {
    dispatch(fetchStudentClasses());
    if (currentStudent?.id) {
      dispatch(fetchYearStatistics({ studentId: currentStudent.id }));
    }
  }, [dispatch, currentStudent?.id]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(
        searchStudentClasses({
          studentId,
          searchQuery: searchTerm.trim(),
        })
      );
    }
  };
const shouldShowSearchResults = searchTerm.trim() && searchQuery;
  const shouldShowRegularClasses = !searchTerm.trim() || !searchQuery;
  const handleClearSearch = () => {
    setSearchTerm("");
    dispatch(clearSearchResults());
    dispatch(fetchStudentClasses());
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const [day, month, year] = dateStr.split(".");
    return new Date(year, month - 1, day);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Date not available";
    const date = parseDate(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const isToday = (dateStr) => {
    const today = new Date();
    const classDate = parseDate(dateStr);
    return today.toDateString() === classDate.toDateString();
  };

  const getTrackLabel = (track1, track2) => {
    if (track1 && track2) return "Both Years";
    if (track1) return "1st Year";
    if (track2) return "2nd Year";
    return "No Track";
  };

  const getTrackColor = (track1, track2) => {
    if (track1 && track2) return "secondary";
    if (track1) return "primary";
    if (track2) return "info";
    return "default";
  };

  const renderClassItem = (cls) => (
    <ListItem
      key={cls.id}
      sx={{
        mb: 2,
        p: 1,
        borderRadius: 3,
        background: cls.track1 ? "#e3f2fd" : cls.track2 ? "#e8f5e8" : "#f5f5f5",
        border: isToday(cls.date) ? "2px solid #4caf50" : "1px solid #e0e0e0",
        "&:hover": {
          transform: "translateY(-2px)",
          transition: "all 0.3s ease-in-out",
          boxShadow: 3,
        },
      }}
    >
      <ListItemIcon>
        <Avatar
          sx={{
            bgcolor: cls.track1 ? "#1976d2" : "#2e7d32",
            width: 50,
            height: 50,
          }}
        >
          {isToday(cls.date) ? <TodayIcon color="success" /> : <EventIcon />}
        </Avatar>
      </ListItemIcon>

      <ListItemText
        primary={
          <Box
            sx={{ display: "flex", alignItems: "flex-start", mb: 1, gap: 1 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.1rem",
                fontWeight: 600,
                flexGrow: 1,
                lineHeight: 1.3,
              }}
            >
              {cls.topic}
            </Typography>
            {cls.studentAttendance && (
              <Chip
                icon={<CheckCircleIcon />}
                label={cls.studentAttendance.status}
                color="success"
                size="small"
                variant="filled"
                sx={{ minWidth: 100 }}
              />
            )}
          </Box>
        }
        secondary={
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
              mt: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Chip
                label={getTrackLabel(cls.track1, cls.track2)}
                color={getTrackColor(cls.track1, cls.track2)}
                size="small"
                variant="filled"
                icon={<SchoolIcon />}
              />
              <Chip
                label={cls.subject}
                color="primary"
                size="small"
                variant="outlined"
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                {formatDate(cls.date)}
              </Typography>
              {isToday(cls.date) && (
                <Chip
                  label="Today"
                  size="small"
                  color="success"
                  variant="filled"
                />
              )}
            </Box>
          </Box>
        }
      />
    </ListItem>
  );

  const pieChartData = [
    {
      name: "1st Year Completed",
      value: firstYear.completed || 0,
      color: "#F26E26",
    }, // orange
    {
      name: "1st Year Pending",
      value: firstYear.pending || 0,
      color: "#292551",
    }, // dark-indigo
    {
      name: "2nd Year Completed",
      value: secondYear.completed || 0,
      color: "#DB1A66",
    }, // hot-pink
    {
      name: "2nd Year Pending",
      value: secondYear.pending || 0,
      color: "#454E5B",
    }, // slate-gray
  ];
  const StyledText = styled("text")(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: "middle",
    dominantBaseline: "central",
    fontSize: 14,
    fontWeight: 500,
  }));
  const renderPieChart = () => {
    const total = pieChartData.reduce((sum, item) => sum + item.value, 0);

    // Better color scheme that matches the cards and has good contrast
    const improvedColors = [
      "#667eea", // Purple-blue (matches 1st year card)
      "#86efac", // Green (completed)
      "#fbbf24", // Yellow (pending)
      "#059669", // Emerald (matches 2nd year card)
      "#bbf7d0", // Light green (2nd year completed)
      "#fde68a", // Light yellow (2nd year pending)
    ];

    const muiPieData = pieChartData.map((item, index) => ({
      id: index,
      value: item.value,
      label: item.name,
      color: improvedColors[index % improvedColors.length],
    }));

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          height: "100%",
        }}
      >
        {/* Pie Chart */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            mb: { xs: 2, md: 0 },
          }}
        >
          <PieChart
            series={[
              {
                data: muiPieData,
                innerRadius: 30,
                outerRadius: 80,
                paddingAngle: 2,
                cornerRadius: 4,
                arcLabel: (params) => {
                  const percentage =
                    total > 0 ? ((params.value / total) * 100).toFixed(0) : "0";
                  return `${percentage}%`;
                },
                arcLabelMinAngle: 15,
                arcLabelRadius: "65%",
                highlightScope: { fade: "global", highlight: "item" },
              },
            ]}
            height={190}
            width={200}
            slotProps={{
              legend: {
                hidden: true,
              },
            }}
            sx={{
              [`& .MuiChartsArc-label`]: {
                fill: "white",
                fontWeight: "bold",
                fontSize: "14px",
                filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.5))",
              },
            }}
          />
        </Box>
      </Box>
    );
  };

  const renderClassSection = (
    classes,
    title,
    icon,
    emptyMessage = "No classes found"
  ) => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!classes || classes.length === 0) {
      return (
        <Box sx={{ textAlign: "center", p: 4 }}>
          {React.createElement(icon, {
            sx: { fontSize: 48, color: "text.secondary", mb: 2 },
          })}
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {emptyMessage}
          </Typography>
        </Box>
      );
    }

    // For "Recent Classes", reverse to show most recent first
    // For "Upcoming Classes", keep in chronological order
    const displayClasses =
      title === "Recent Classes" ? [...classes].reverse() : classes;

    return (
      <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "primary.main" }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              color: "text.secondary",
              fontStyle: "italic",
            }}
          >
            {title === "Recent Classes"
              ? "Last 7 classs"
              : "Upcoming 7 classes"}
          </Typography>
        </Box>
        <List sx={{ overflow: "auto", pr: 1 }}>
          {displayClasses.map((cls) => renderClassItem(cls))}
        </List>
      </Paper>
    );
  };

  const renderSearchResults = () => {
    if (searchLoading)
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      );
    if (searchError)
      return (
        <Alert severity="error" sx={{ mb: 2 }}>
          Search error: {searchError}
        </Alert>
      );

    if (searchResults && searchResults.length > 0) {
      return (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <SearchIcon sx={{ fontSize: 32, color: "primary.main", mr: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, flexGrow: 1 }}>
              Search Results for "{searchQuery}"
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={`${searchResults.length} classes found`}
                color="success"
                variant="filled"
              />
              <Button
                startIcon={<ClearIcon />}
                onClick={handleClearSearch}
                variant="outlined"
                size="small"
              >
                Clear
              </Button>
            </Box>
          </Box>
          <List sx={{ maxHeight: 500, overflow: "auto" }}>
            {searchResults.map((cls) => renderClassItem(cls))}
          </List>
        </Paper>
      );
    }

    if (searchQuery) {
      return (
        <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
          <SearchIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No results found for "{searchQuery}"
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Try searching with different keywords
          </Typography>
          <Button
            startIcon={<ClearIcon />}
            onClick={handleClearSearch}
            variant="outlined"
          >
            Clear Search
          </Button>
        </Paper>
      );
    }

    return null;
  };

  const showSearchResults =
    searchQuery && (searchResults.length > 0 || searchLoading || searchError);
  const renderStatisticsCards = () => {
    // Add safety checks
    if (!firstYear || !secondYear) {
      return (
        <Alert severity="warning" sx={{ mb: 3 }}>
          No statistics data available
        </Alert>
      );
    }

    // Tooltip component for lessons
    const LessonsTooltip = ({ lessons, title, children }) => (
      <Tooltip
        title={
          <Box sx={{ p: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              {title} ({(lessons || []).length})
            </Typography>
            {lessons && lessons.length > 0 ? (
              <Box sx={{ maxHeight: "150px", overflow: "auto" }}>
                {lessons.map((lesson, index) => (
                  <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                    • {lesson}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography variant="body2">No lessons available</Typography>
            )}
          </Box>
        }
        arrow
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: "background.paper",
              color: "text.primary",
              boxShadow: 3,
              border: "1px solid",
              borderColor: "divider",
              maxWidth: "300px",
            },
          },
        }}
      >
        <Box sx={{ cursor: "pointer", textAlign: "center" }}>{children}</Box>
      </Tooltip>
    );

    return (
      <Grid container spacing={3} sx={{ height: "100%" }}>
        {/* 1st Year Card */}
        <Grid item xs={12} lg={6}>
          <Card
            elevation={4}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "16px",
              color: "white",
              position: "relative",
              overflow: "visible",
              height: "100%",
              minHeight: 220,
              display: "flex",
              flexDirection: "column",
              "&:before": {
                content: '""',
                position: "absolute",
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "18px",
                zIndex: -1,
                opacity: 0.6,
                filter: "blur(10px)",
              },
            }}
          >
            <CardContent
              sx={{
                p: 3,
                position: "relative",
                zIndex: 1,
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box
                  sx={{
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "12px",
                    p: 1,
                    mr: 2,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 28, color: "white" }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, fontSize: "1.1rem" }}
                >
                  1st Year Progress
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 2,
                  textAlign: "center",
                  mb: 3,
                  flex: 1,
                }}
              >
                {/* Total */}
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                    {firstYear.total || 0}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.9, fontSize: "0.75rem" }}
                  >
                    Total
                  </Typography>
                </Box>

                {/* Completed */}
                <LessonsTooltip
                  lessons={firstYear.completedLessons || []}
                  title="Completed Lessons"
                >
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 800, mb: 0.5, color: "#86efac" }}
                    >
                      {firstYear.completed || 0}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.9, fontSize: "0.75rem" }}
                    >
                      Completed
                    </Typography>
                  </Box>
                </LessonsTooltip>

                {/* Pending */}
                <LessonsTooltip
                  lessons={firstYear.pendingLessons || []}
                  title="Pending Lessons"
                >
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 800, mb: 0.5, color: "#fbbf24" }}
                    >
                      {firstYear.pending || 0}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.9, fontSize: "0.75rem" }}
                    >
                      Pending
                    </Typography>
                  </Box>
                </LessonsTooltip>
              </Box>

              {/* Progress bar */}
              <Box sx={{ mt: "auto" }}>
                <Box
                  sx={{
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "10px",
                    height: "6px",
                    overflow: "hidden",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      background:
                        "linear-gradient(90deg, #86efac 0%, #4ade80 100%)",
                      height: "100%",
                      width: `${
                        firstYear.total
                          ? ((firstYear.completed || 0) / firstYear.total) * 100
                          : 0
                      }%`,
                      borderRadius: "10px",
                      transition: "width 0.5s ease-in-out",
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    opacity: 0.8,
                  }}
                >
                  {firstYear.total
                    ? Math.round(
                        ((firstYear.completed || 0) / firstYear.total) * 100
                      )
                    : 0}
                  % Complete
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 2nd Year Card */}
        <Grid item xs={12} lg={6}>
          <Card
            elevation={4}
            sx={{
              background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              borderRadius: "16px",
              color: "white",
              position: "relative",
              overflow: "visible",
              height: "100%",
              minHeight: 220,
              display: "flex",
              flexDirection: "column",
              "&:before": {
                content: '""',
                position: "absolute",
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                borderRadius: "18px",
                zIndex: -1,
                opacity: 0.6,
                filter: "blur(10px)",
              },
            }}
          >
            <CardContent
              sx={{
                p: 3,
                position: "relative",
                zIndex: 1,
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box
                  sx={{
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "12px",
                    p: 1,
                    mr: 2,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 28, color: "white" }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, fontSize: "1.1rem" }}
                >
                  2nd Year Progress
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 2,
                  textAlign: "center",
                  mb: 3,
                  flex: 1,
                }}
              >
                {/* Total */}
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                    {secondYear.total || 0}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.9, fontSize: "0.75rem" }}
                  >
                    Total
                  </Typography>
                </Box>

                {/* Completed */}
                <LessonsTooltip
                  lessons={secondYear.completedLessons || []}
                  title="Completed Lessons"
                >
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 800, mb: 0.5, color: "#bbf7d0" }}
                    >
                      {secondYear.completed || 0}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.9, fontSize: "0.75rem" }}
                    >
                      Completed
                    </Typography>
                  </Box>
                </LessonsTooltip>

                {/* Pending */}
                <LessonsTooltip
                  lessons={secondYear.pendingLessons || []}
                  title="Pending Lessons"
                >
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 800, mb: 0.5, color: "#fde68a" }}
                    >
                      {secondYear.pending || 0}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.9, fontSize: "0.75rem" }}
                    >
                      Pending
                    </Typography>
                  </Box>
                </LessonsTooltip>
              </Box>

              {/* Progress bar */}
              <Box sx={{ mt: "auto" }}>
                <Box
                  sx={{
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "10px",
                    height: "6px",
                    overflow: "hidden",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      background:
                        "linear-gradient(90deg, #bbf7d0 0%, #86efac 100%)",
                      height: "100%",
                      width: `${
                        secondYear.total
                          ? ((secondYear.completed || 0) / secondYear.total) *
                            100
                          : 0
                      }%`,
                      borderRadius: "10px",
                      transition: "width 0.5s ease-in-out",
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    opacity: 0.8,
                  }}
                >
                  {secondYear.total
                    ? Math.round(
                        ((secondYear.completed || 0) / secondYear.total) * 100
                      )
                    : 0}
                  % Complete
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <div className="student-portfolio-tab premium light-theme">
      <div className="tab-content premium">
        <div className="weekend-syllabus-container">
          <Box sx={{ p: 1 }}>
            {/* Search Section */}

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                Error loading classes: {error}
              </Alert>
            )}

            {statsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : statsError ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                Error loading statistics: {statsError}
              </Alert>
            ) : (
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Statistics Cards - Left Side */}
                <Grid item xs={12} lg={7}>
                  {renderStatisticsCards()}
                </Grid>

                {/* Pie Chart - Right Side */}
                <Grid item xs={12} lg={5}>
                  <Card
                    elevation={4}
                    sx={{
                      p: 2, // Reduced padding
                      height: "100%",
                      minHeight: 200, // Reduced min-height
                      display: "flex",
                      flexDirection: "column",
                      background:
                        "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                      borderRadius: "16px",
                      border: "1px solid rgba(255,255,255,0.3)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 700,
                        mb: 2, // Reduced margin
                        color: "text.primary",
                        fontSize: "1rem", // Slightly smaller
                      }}
                    >
                      <PieChartIcon
                        sx={{
                          mr: 1,
                          color: "primary.main",
                          fontSize: "1.2rem",
                        }}
                      />
                      Progress Overview
                    </Typography>
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      {renderPieChart()}
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            )}

            <>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  mb: 4,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: 3,
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "white",
                    mb: 3,
                    fontWeight: 600,
                  }}
                >
                  <SearchIcon sx={{ mr: 2 }} /> Search Classes
                </Typography>
                <form onSubmit={handleSearch}>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <TextField
                      fullWidth
                      placeholder="Search by topic or subject (e.g., 'Current Electricity')"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SubjectIcon sx={{ color: "#667eea" }} />
                          </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setSearchTerm("")}
                              edge="end"
                              sx={{ color: "#667eea" }}
                            >
                              <ClearIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: { backgroundColor: "white", borderRadius: 2 },
                      }}
                      size="medium"
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={
                        searchLoading ? (
                          <CircularProgress size={20} sx={{ color: "white" }} />
                        ) : (
                          <SearchIcon />
                        )
                      }
                      // disabled={searchLoading || !searchTerm.trim()}
                      sx={{
                        minWidth: 140,
                        height: 56,
                        background: "rgba(255,255,255,0.9)",
                        color: "#667eea",
                        borderRadius: 2,
                        fontWeight: 600,
                      }}
                    >
                      {searchLoading ? "Searching" : "Search"}
                    </Button>
                  </Box>
                </form>
              </Paper>
                    {shouldShowSearchResults  ? (
              // Show only search results when there's an active search
              renderSearchResults()
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                  width: "100%",
                }}
              >
                <Box>
                  {renderClassSection(
                    pastClasses,
                    "Recent Classes",
                    HistoryIcon,
                    "No past classes available"
                  )}
                </Box>
                <Box>
                  {renderClassSection(
                    futureClasses,
                    "Upcoming Classes",
                    EventIcon,
                    "No upcoming classes scheduled"
                  )}
                </Box>
              </Box>
            )}
            </>


          </Box>
        </div>
      </div>
    </div>
  );
};

export default StudentWeekend;
