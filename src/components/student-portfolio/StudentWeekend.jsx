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
  Book as BookIcon,
  CalendarToday as CalendarTodayIcon,
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

  const currentStudent = useSelector((state) => state.auth?.currentStudent);
  const isRevisonStudent =
    !!currentStudent?.isRevisionProgramJEEMains2026Student;
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

  // Process weekSyllabus data for non-revision students
  const getWeekSyllabusData = () => {
    if (
      !currentStudent?.weekSyllabus ||
      !Array.isArray(currentStudent.weekSyllabus)
    ) {
      return [];
    }

    // Sort syllabus by date (latest first)
    return currentStudent.weekSyllabus
      .filter((syllabus) => syllabus && syllabus.date && syllabus.topic)
      .sort((a, b) => {
        const dateA = a.date?._seconds
          ? new Date(a.date._seconds * 1000)
          : new Date(0);
        const dateB = b.date?._seconds
          ? new Date(b.date._seconds * 1000)
          : new Date(0);
        return dateB - dateA; // Latest first
      });
  };

  const weekSyllabusData = getWeekSyllabusData();

  const formatSyllabusDate = (dateObj) => {
    if (!dateObj || !dateObj._seconds) return "Date not available";

    const date = new Date(dateObj._seconds * 1000);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  // Render Week Syllabus for non-revision students
  const renderWeekSyllabus = () => {
    if (weekSyllabusData.length === 0) {
      return (
        <Paper elevation={3} sx={{ p: 4, textAlign: "center", mb: 3 }}>
          <BookIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Syllabus Available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Weekly syllabus data will appear here when available.
          </Typography>
        </Paper>
      );
    }

    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <BookIcon sx={{ fontSize: 32, color: "primary.main", mr: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, flexGrow: 1 }}>
            Weekly Syllabus
          </Typography>
          <Chip
            label={`${weekSyllabusData.length} topics`}
            color="primary"
            variant="filled"
          />
        </Box>

        <List sx={{ maxHeight: 500, overflow: "auto" }}>
          {weekSyllabusData.map((syllabus, index) => (
            <ListItem
              key={syllabus.id || index}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 3,
                background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                border: "1px solid #dee2e6",
                "&:hover": {
                  transform: "translateY(-2px)",
                  transition: "all 0.3s ease-in-out",
                  boxShadow: 2,
                },
              }}
            >
              <ListItemIcon>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 50,
                    height: 50,
                  }}
                >
                  <CalendarTodayIcon />
                </Avatar>
              </ListItemIcon>

              <ListItemText
                primary={
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      mb: 1,
                      color: "text.primary",
                    }}
                  >
                    {syllabus.topic}
                  </Typography>
                }
                secondary={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <CalendarTodayIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      {formatSyllabusDate(syllabus.date)}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  };

  const pieChartData = [
    {
      name: "1st Year Completed",
      value: firstYear?.completed || 0,
      color: "#F26E26",
    },
    {
      name: "1st Year Pending",
      value: firstYear?.pending || 0,
      color: "#292551",
    },
    {
      name: "2nd Year Completed",
      value: secondYear?.completed || 0,
      color: "#DB1A66",
    },
    {
      name: "2nd Year Pending",
      value: secondYear?.pending || 0,
      color: "#454E5B",
    },
  ];

  const renderPieChart = () => {
  const total = pieChartData.reduce((sum, item) => sum + item.value, 0);
  const improvedColors = [
    "#667eea",
    "#86efac", 
    "#fbbf24",
    "#059669",
    "#bbf7d0",
    "#fde68a",
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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <PieChart
        series={[
          {
            data: muiPieData,
            innerRadius: 25,
            outerRadius: 55,
            paddingAngle: 1,
            cornerRadius: 2,
            arcLabel: (params) => {
              const percentage =
                total > 0 ? ((params.value / total) * 100).toFixed(0) : "0";
              return `${percentage}%`;
            },
            arcLabelMinAngle: 20,
            arcLabelRadius: "70%",
            highlightScope: { fade: "global", highlight: "item" },
          },
        ]}
        height={150}
        width={150}
        slotProps={{
          legend: {
            hidden: true,
          },
        }}
        sx={{
          [`& .MuiChartsArc-label`]: {
            fill: "white",
            fontWeight: "bold",
            fontSize: "10px",
            filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.5))",
          },
        }}
      />
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
              ? "Last 7 classes"
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

  // Rest of your existing functions (renderStatisticsCards, etc.) remain the same
  const renderStatisticsCards = () => {
    if (!firstYear || !secondYear) {
      return (
        <Alert severity="warning" sx={{ mb: 3 }}>
          No statistics data available
        </Alert>
      );
    }

    const adjustedStats = getAdjustedStatistics();
    const laggingTopics = getDetailedLaggingTopics();

    // Calculate total progress across both years (adjusted)
    const totalCompleted =
      adjustedStats.firstYear.adjustedCompleted +
      adjustedStats.secondYear.adjustedCompleted;
    const totalPending =
      adjustedStats.firstYear.adjustedPending +
      adjustedStats.secondYear.adjustedPending;
    const totalLagging = adjustedStats.totalLagging;
    const totalLessons = (firstYear.total || 0) + (secondYear.total || 0);
    const totalProgressPercentage =
      totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

    // Combine lessons for tooltips
    const allCompletedLessons = [
      ...(firstYear.completedLessons || []).map(
        (lesson) => `1st Year: ${lesson}`
      ),
      ...(secondYear.completedLessons || []).map(
        (lesson) => `2nd Year: ${lesson}`
      ),
    ];

    const allPendingLessons = [
      ...(firstYear.pendingLessons || []).map(
        (lesson) => `1st Year: ${lesson}`
      ),
      ...(secondYear.pendingLessons || []).map(
        (lesson) => `2nd Year: ${lesson}`
      ),
    ];

    const allLaggingLessons = [
      ...laggingTopics.firstYear.map((lesson) => `1st Year: ${lesson}`),
      ...laggingTopics.secondYear.map((lesson) => `2nd Year: ${lesson}`),
    ];
    const LessonsTooltip = ({ lessons, title, children, type = "default" }) => {
      const getBorderColor = () => {
        switch (type) {
          case "completed":
            return "#10b981";
          case "pending":
            return "#f59e0b";
          case "lagging":
            return "#ef4444";
          default:
            return "primary.main";
        }
      };

      return (
        <Tooltip
          title={
            <Box sx={{ p: 2, maxWidth: 400 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  color: getBorderColor(),
                  borderBottom: "2px solid",
                  borderColor: getBorderColor(),
                  pb: 1,
                }}
              >
                {title} ({lessons?.length || 0})
              </Typography>
              {lessons && lessons.length > 0 ? (
                <Box sx={{ maxHeight: "200px", overflow: "auto" }}>
                  {lessons.map((lesson, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        mb: 1.5,
                        p: 1,
                        borderRadius: 2,
                        backgroundColor:
                          index % 2 === 0 ? "rgba(0,0,0,0.02)" : "transparent",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "rgba(0,0,0,0.04)",
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: 24,
                          height: 24,
                          borderRadius: "50%",
                          backgroundColor: getBorderColor(),
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          mr: 2,
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          lineHeight: 1.4,
                          color: "text.primary",
                        }}
                      >
                        {lesson}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 3,
                    color: "text.secondary",
                  }}
                >
                  <Typography variant="body2">No lessons available</Typography>
                </Box>
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
                borderRadius: 2,
                "& .MuiTooltip-arrow": {
                  color: "background.paper",
                },
              },
            },
          }}
        >
          <Box
            sx={{
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            {children}
          </Box>
        </Tooltip>
      );
    };
    return (
      <Grid container spacing={3} sx={{ height: "100%" }}>
        {/* Total Progress Card */}
      <Grid item xs={12} lg={4}>
  <Card
    elevation={4}
    sx={{
      background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      borderRadius: "16px",
      color: "white",
      position: "relative",
      overflow: "visible",
      // height: "100%",
      minHeight: 150,
      display: "flex",
      flexDirection: "column",
      "&:before": {
        content: '""',
        position: "absolute",
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
        borderRadius: "18px",
        zIndex: -1,
        opacity: 0.6,
        filter: "blur(10px)",
      },
    }}
  >
    <CardContent
      sx={{
        p: 1,
        position: "relative",
        zIndex: 1,
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            background: "rgba(255,255,255,0.2)",
            borderRadius: "10px",
            p: 0.8,
            mr: 1.5,
            backdropFilter: "blur(10px)",
          }}
        >
          <SchoolIcon sx={{ fontSize: 22, color: "white" }} />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, fontSize: "0.9rem" }}
        >
          Total Progress
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 0.5,
          textAlign: "center",
          mb: 2,
          flex: 1,
        }}
      >
        {/* Total */}
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.3, fontSize: "1.5rem" }}>
            {totalLessons}
          </Typography>
          <Typography
            variant="caption"
            sx={{ opacity: 0.9, fontSize: "0.65rem" }}
          >
            Total
          </Typography>
        </Box>

        {/* Completed */}
        <LessonsTooltip
          lessons={allCompletedLessons}
          title="Completed Lessons"
          type="completed"
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, mb: 0.3, color: "#86efac", fontSize: "1.5rem" }}
            >
              {totalCompleted}
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.9, fontSize: "0.65rem" }}
            >
              Completed
            </Typography>
          </Box>
        </LessonsTooltip>

        {/* Pending */}
        <LessonsTooltip
          lessons={allPendingLessons}
          title="Pending Lessons"
          type="pending"
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, mb: 0.3, color: "#fbbf24", fontSize: "1.5rem" }}
            >
              {totalPending}
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.9, fontSize: "0.65rem" }}
            >
              Pending
            </Typography>
          </Box>
        </LessonsTooltip>

        {/* Lagging */}
        <LessonsTooltip
          lessons={allLaggingLessons}
          title="Lagging Topics"
          type="lagging"
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, mb: 0.3, color: "#f87171", fontSize: "1.5rem" }}
            >
              {totalLagging}
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.9, fontSize: "0.65rem" }}
            >
              Lagging
            </Typography>
          </Box>
        </LessonsTooltip>
      </Box>

      {/* Progress bar */}
      <Box sx={{ mt: "auto" }}>
        <Box
          sx={{
            background: "rgba(255,255,255,0.2)",
            borderRadius: "8px",
            height: "5px",
            overflow: "hidden",
            mb: 0.8,
          }}
        >
          <Box
            sx={{
              background:
                "linear-gradient(90deg, #86efac 0%, #4ade80 100%)",
              height: "100%",
              width: `${totalProgressPercentage}%`,
              borderRadius: "8px",
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
            fontSize: "0.65rem"
          }}
        >
          {totalProgressPercentage}% Complete
        </Typography>
      </Box>
    </CardContent>
  </Card>
</Grid>

        {/* 1st Year Card */}
     <Grid item xs={12} lg={4}>
  <Card
    elevation={4}
    sx={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: "16px",
      color: "white",
      position: "relative",
      overflow: "visible",
      // height: "100%",
      minHeight: 180,
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
        p: 1,
        position: "relative",
        zIndex: 1,
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            background: "rgba(255,255,255,0.2)",
            borderRadius: "10px",
            p: 0.8,
            mr: 1.5,
            backdropFilter: "blur(10px)",
          }}
        >
          <SchoolIcon sx={{ fontSize: 22, color: "white" }} />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, fontSize: "0.9rem" }}
        >
          1st Year Progress
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 0.5,
          textAlign: "center",
          mb: 2,
          flex: 1,
        }}
      >
        {/* Total */}
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.3, fontSize: "1.5rem" }}>
            {firstYear.total || 0}
          </Typography>
          <Typography
            variant="caption"
            sx={{ opacity: 0.9, fontSize: "0.65rem" }}
          >
            Total
          </Typography>
        </Box>

        {/* Completed */}
        <LessonsTooltip
          lessons={firstYear.completedLessons || []}
          title="Completed Lessons"
          type="completed"
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, mb: 0.3, color: "#86efac", fontSize: "1.5rem" }}
            >
              {adjustedStats.firstYear.adjustedCompleted}
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.9, fontSize: "0.65rem" }}
            >
              Completed
            </Typography>
          </Box>
        </LessonsTooltip>

        {/* Pending */}
        <LessonsTooltip
          lessons={firstYear.pendingLessons || []}
          title="Pending Lessons"
          type="pending"
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, mb: 0.3, color: "#fbbf24", fontSize: "1.5rem" }}
            >
              {adjustedStats.firstYear.adjustedPending}
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.9, fontSize: "0.65rem" }}
            >
              Pending
            </Typography>
          </Box>
        </LessonsTooltip>

        {/* Lagging */}
        <LessonsTooltip
          lessons={laggingTopics.firstYear}
          title="Lagging Topics"
          type="lagging"
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, mb: 0.3, color: "#f87171", fontSize: "1.5rem" }}
            >
              {adjustedStats.firstYear.lagging}
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.9, fontSize: "0.65rem" }}
            >
              Lagging
            </Typography>
          </Box>
        </LessonsTooltip>
      </Box>

      {/* Progress bar */}
      <Box sx={{ mt: "auto" }}>
        <Box
          sx={{
            background: "rgba(255,255,255,0.2)",
            borderRadius: "8px",
            height: "5px",
            overflow: "hidden",
            mb: 0.8,
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(90deg, #86efac 0%, #4ade80 100%)",
              height: "100%",
              width: `${firstYear.total ? Math.round((adjustedStats.firstYear.adjustedCompleted / firstYear.total) * 100) : 0}%`,
              borderRadius: "8px",
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
            fontSize: "0.65rem"
          }}
        >
          {firstYear.total ? Math.round((adjustedStats.firstYear.adjustedCompleted / firstYear.total) * 100) : 0}% Complete
        </Typography>
      </Box>
    </CardContent>
  </Card>
</Grid>

{/* 2nd Year Card */}
<Grid item xs={12} lg={4}>
  <Card
    elevation={4}
    sx={{
      background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
      borderRadius: "16px",
      color: "white",
      position: "relative",
      overflow: "visible",
      // height: "100%",
      minHeight: 180,
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
        p: 1,
        position: "relative",
        zIndex: 1,
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            background: "rgba(255,255,255,0.2)",
            borderRadius: "10px",
            p: 0.8,
            mr: 1.5,
            backdropFilter: "blur(10px)",
          }}
        >
          <SchoolIcon sx={{ fontSize: 22, color: "white" }} />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, fontSize: "0.9rem" }}
        >
          2nd Year Progress
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 0.5,
          textAlign: "center",
          mb: 2,
          flex: 1,
        }}
      >
        {/* Total */}
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.3, fontSize: "1.5rem" }}>
            {secondYear.total || 0}
          </Typography>
          <Typography
            variant="caption"
            sx={{ opacity: 0.9, fontSize: "0.65rem" }}
          >
            Total
          </Typography>
        </Box>

        {/* Completed */}
        <LessonsTooltip
          lessons={secondYear.completedLessons || []}
          title="Completed Lessons"
          type="completed"
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, mb: 0.3, color: "#bbf7d0", fontSize: "1.5rem" }}
            >
              {adjustedStats.secondYear.adjustedCompleted}
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.9, fontSize: "0.65rem" }}
            >
              Completed
            </Typography>
          </Box>
        </LessonsTooltip>

        {/* Pending */}
        <LessonsTooltip
          lessons={secondYear.pendingLessons || []}
          title="Pending Lessons"
          type="pending"
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, mb: 0.3, color: "#fde68a", fontSize: "1.5rem" }}
            >
              {adjustedStats.secondYear.adjustedPending}
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.9, fontSize: "0.65rem" }}
            >
              Pending
            </Typography>
          </Box>
        </LessonsTooltip>

        {/* Lagging */}
        <LessonsTooltip
          lessons={laggingTopics.secondYear}
          title="Lagging Topics"
          type="lagging"
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, mb: 0.3, color: "#f87171", fontSize: "1.5rem" }}
            >
              {adjustedStats.secondYear.lagging}
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.9, fontSize: "0.65rem" }}
            >
              Lagging
            </Typography>
          </Box>
        </LessonsTooltip>
      </Box>

      {/* Progress bar */}
      <Box sx={{ mt: "auto" }}>
        <Box
          sx={{
            background: "rgba(255,255,255,0.2)",
            borderRadius: "8px",
            height: "5px",
            overflow: "hidden",
            mb: 0.8,
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(90deg, #bbf7d0 0%, #86efac 100%)",
              height: "100%",
              width: `${secondYear.total ? Math.round((adjustedStats.secondYear.adjustedCompleted / secondYear.total) * 100) : 0}%`,
              borderRadius: "8px",
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
            fontSize: "0.65rem"
          }}
        >
          {secondYear.total ? Math.round((adjustedStats.secondYear.adjustedCompleted / secondYear.total) * 100) : 0}% Complete
        </Typography>
      </Box>
    </CardContent>
  </Card>
</Grid>
      </Grid>
    );
  };
  const getLaggingTopics = () => {
    if (!currentStudent?.Name) return [];

    const studentName = currentStudent.Name.toLowerCase();

    // Static mapping of lagging topics by student name
    const laggingTopicsMap = {
      // Gagan - no lagging topics
      gagan: [],

      // Amal - no lagging topics
      amal: [],

      // Ananya - no lagging topics
      ananya: [],

      // Navya - specific lagging topics
      navya: ["ELECTROMAGNETIC INDUCTION"],

      // Nithya - specific lagging topics
      nithya: ["ELECTROMAGNETIC INDUCTION"],

      // Sriya - specific lagging topics
      sriya: ["ELECTROSTATIC POTENTIAL AND CAPACITANCE", "CURRENT ELECTRICITY"],
    };

    // Find matching student name (case insensitive)
    const matchedKey = Object.keys(laggingTopicsMap).find((key) =>
      studentName.includes(key.toLowerCase())
    );

    return matchedKey ? laggingTopicsMap[matchedKey] : [];
  };
  const getDetailedLaggingTopics = () => {
    const laggingTopics = getLaggingTopics();

    if (laggingTopics.length === 0) return { firstYear: [], secondYear: [] };

    const laggingByYear = {
      firstYear: [],
      secondYear: [],
    };

    laggingTopics.forEach((topic) => {
      // Determine which year this topic belongs to
      if (
        firstYear?.completedLessons?.includes(topic) ||
        firstYear?.pendingLessons?.includes(topic)
      ) {
        laggingByYear.firstYear.push(topic);
      } else if (
        secondYear?.completedLessons?.includes(topic) ||
        secondYear?.pendingLessons?.includes(topic)
      ) {
        laggingByYear.secondYear.push(topic);
      } else {
        // Default to 2nd year if not found
        laggingByYear.secondYear.push(topic);
      }
    });

    return laggingByYear;
  };
  const getAdjustedStatistics = () => {
    const laggingTopics = getDetailedLaggingTopics();

    const firstYearLaggingCount = laggingTopics.firstYear.length;
    const secondYearLaggingCount = laggingTopics.secondYear.length;

    // Adjust completed count by subtracting lagging topics
    const adjustedFirstYearCompleted = Math.max(
      0,
      (firstYear?.completed || 0) - firstYearLaggingCount
    );
    const adjustedSecondYearCompleted = Math.max(
      0,
      (secondYear?.completed || 0) - secondYearLaggingCount
    );

    // Adjust pending count by subtracting lagging topics (if they were in pending)
    const adjustedFirstYearPending = Math.max(
      0,
      (firstYear?.pending || 0) - firstYearLaggingCount
    );
    const adjustedSecondYearPending = Math.max(
      0,
      (secondYear?.pending || 0) - secondYearLaggingCount
    );

    return {
      firstYear: {
        ...firstYear,
        adjustedCompleted: adjustedFirstYearCompleted,
        adjustedPending: adjustedFirstYearPending,
        lagging: firstYearLaggingCount,
      },
      secondYear: {
        ...secondYear,
        adjustedCompleted: adjustedSecondYearCompleted,
        adjustedPending: adjustedSecondYearPending,
        lagging: secondYearLaggingCount,
      },
      totalLagging: firstYearLaggingCount + secondYearLaggingCount,
    };
  };
  return (
    <div className="student-portfolio-tab premium light-theme">
      <div className="tab-content premium">
        <div className="weekend-syllabus-container">
          <Box sx={{ p: 1 }}>
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
              isRevisonStudent && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} lg={7}>
                    {renderStatisticsCards()}
                  </Grid>
                <Grid item xs={12} lg={5}>
  <Card
    elevation={4}
    sx={{
      p: 1.5,
      height: "100%",
      minHeight: 180,
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
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
        mb: 1.5,
        color: "text.primary",
        fontSize: "0.9rem",
      }}
    >
      <PieChartIcon
        sx={{
          mr: 1,
          color: "primary.main",
          fontSize: "1rem",
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
        alignItems: "center",
      }}
    >
      {renderPieChart()}
    </Box>
  </Card>
</Grid>
                </Grid>
              )
            )}

            {/* Show different content based on revision status */}
            {isRevisonStudent ? (
              // Revision Student Content
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
                            <CircularProgress
                              size={20}
                              sx={{ color: "white" }}
                            />
                          ) : (
                            <SearchIcon />
                          )
                        }
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

                {shouldShowSearchResults ? (
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
            ) : (
              // Non-Revision Student Content (Week Syllabus)
              renderWeekSyllabus()
            )}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default StudentWeekend;
