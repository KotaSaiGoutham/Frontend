import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Grid,
  LinearProgress,
} from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import TopicIcon from "@mui/icons-material/Topic";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

// Helper functions
const normalizeTimestamp = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp.toDate) return timestamp;
  if (timestamp._seconds && typeof timestamp._nanoseconds === "number") {
    return new Timestamp(timestamp._seconds, timestamp._nanoseconds);
  }
  if (typeof timestamp === "string") {
    try {
      const date = new Date(timestamp);
      return Timestamp.fromDate(date);
    } catch (e) {
      console.error("Error creating Timestamp from string:", timestamp, e);
      return null;
    }
  }
  return null;
};

const formatDate = (timestamp) => {
  const normalized = normalizeTimestamp(timestamp);
  if (!normalized) return "";
  const date = normalized.toDate();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const stripTimeFromDate = (date) => {
  if (!date) return null;
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const getDurationInHours = (timeString) => {
  if (!timeString) return 0;
  const parts = timeString.split(" to ");
  if (parts.length !== 2) return 0;

  const startDate = new Date(`2000/01/01 ${parts[0]}`);
  const endDate = new Date(`2000/01/01 ${parts[1]}`);

  if (endDate < startDate) endDate.setDate(endDate.getDate() + 1);
  const durationMs = endDate - startDate;
  return durationMs / (1000 * 60 * 60);
};

const ClassesCompletedTable = ({
  student,
  allTimetables,
  allAutoTimetables,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const studentStartDate = normalizeTimestamp(student.startDate);
  const studentEndDate = normalizeTimestamp(student.endDate);

  if (!student || !studentStartDate || !studentEndDate) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
          backgroundColor: "rgba(178, 31, 98, 0.04)",
          borderRadius: 2,
          border: "1px dashed rgba(178, 31, 98, 0.3)",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            textAlign: "center",
            p: 4,
            fontSize: 18,
            fontWeight: 300,
          }}
        >
          No class data available for this student within the current payment
          cycle.
        </Typography>
      </Box>
    );
  }

  // Determine the table title based on the current date
  const isPaymentCycleOngoing = new Date() < studentEndDate.toDate();
  const StatusIcon = isPaymentCycleOngoing ? PendingIcon : CheckCircleIcon;
  const statusText = isPaymentCycleOngoing ? "In Progress" : "Completed";

  // Merge the two timetable arrays
  const mergedTimetables = [...allTimetables, ...allAutoTimetables];

  // Filter and sort the classes
  const classesData = mergedTimetables
    .filter((item) => {
      if (item.Student !== student.Name || item.Subject !== student.Subject)
        return false;
      const classDate = normalizeTimestamp(
        item.classDateTime || item.dateTimeISO || item.generationDate
      );
      if (!classDate) return false;

      const classDateOnly = stripTimeFromDate(classDate.toDate());
      const startDateOnly = stripTimeFromDate(studentStartDate.toDate());
      const endDateOnly = stripTimeFromDate(studentEndDate.toDate());

      return classDateOnly >= startDateOnly && classDateOnly <= endDateOnly;
    })
    .map((item) => ({
      date: item.classDateTime || item.dateTimeISO || item.generationDate,
      time: item.Time,
      duration: getDurationInHours(item.Time),
      topic: item.Topic,
    }))
    .sort((a, b) => {
      const dateA = normalizeTimestamp(a.date)?.toDate().getTime();
      const dateB = normalizeTimestamp(b.date)?.toDate().getTime();
      return dateA - dateB;
    });

  const totalDuration = classesData.reduce(
    (sum, current) => sum + current.duration,
    0
  );
  const progressPercentage = isPaymentCycleOngoing
    ? Math.min(100, (totalDuration / 12) * 100)
    : 100;

  // Handle copy to clipboard
  const handleCopyToClipboard = () => {
    const textToCopy = generateShareText();
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setSnackbarMessage("Copied to clipboard!");
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        setSnackbarMessage("Failed to copy to clipboard");
        setSnackbarOpen(true);
      });
  };

  // Generate shareable text
  const generateShareText = () => {
    const status = isPaymentCycleOngoing ? "In Progress" : "Completed";
    let text = `*${student.Name}'s Classes ${status}*\n`;
    text += `Period: ${formatDate(student.startDate)} - ${formatDate(
      student.endDate
    )}\n\n`;

    if (classesData.length === 0) {
      text += "No classes recorded for this period";
    } else {
      text += "*Classes Completed:*\n";
      classesData.forEach((classItem, index) => {
        text += `${index + 1}. ${formatDate(classItem.date)} | ${
          classItem.time
        } | ${classItem.duration.toFixed(1)}h | ${classItem.topic}\n`;
      });
      text += `\n*Total: ${totalDuration.toFixed(1)} hours*`;
    }

    return text;
  };

  // Handle WhatsApp share
  const handleWhatsAppShare = () => {
    const text = generateShareText();
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, "_blank");
  };

  const handlePdfDownload = () => {
    // Create a simple HTML page for download
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${student.Name}'s Classes Report</title>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 40px; 
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #B21F62;
              padding-bottom: 15px;
            }
            h1 { 
              color: #B21F62; 
              margin: 0;
              font-size: 24px;
            }
            .subtitle {
              color: #666;
              font-size: 16px;
              margin-top: 5px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0; 
              font-size: 14px;
            }
            th { 
              background-color: #B21F62; 
              color: white; 
              padding: 12px; 
              text-align: left; 
              font-weight: bold;
            }
            td { 
              padding: 10px; 
              border-bottom: 1px solid #ddd; 
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            tr:hover {
              background-color: #f1f1f1;
            }
            .total { 
              font-weight: bold; 
              background-color: #ffedc9; 
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            .no-data {
              text-align: center;
              padding: 40px;
              font-style: italic;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${student.Name}'s Classes ${isPaymentCycleOngoing ? "Progress" : "Completed"}</h1>
            <div class="subtitle">Period: ${formatDate(student.startDate)} - ${formatDate(student.endDate)}</div>
          </div>
          
          ${classesData.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Lesson</th>
              </tr>
            </thead>
            <tbody>
              ${classesData.map((classItem, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${formatDate(classItem.date)}</td>
                  <td>${classItem.time}</td>
                  <td>${classItem.duration.toFixed(1)}h</td>
                  <td>${classItem.topic}</td>
                </tr>
              `).join('')}
              <tr class="total">
                <td colspan="3" style="text-align: right;"><strong>Total Duration:</strong></td>
                <td><strong>${totalDuration.toFixed(1)} hours</strong></td>
                <td></td>
              </tr>
            </tbody>
          </table>
          ` : `
          <div class="no-data">
            No classes recorded for this period
          </div>
          `}
          
          <div class="footer">
            Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
          </div>
        </body>
      </html>
    `;

    // Create a blob with the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${student.Name.replace(/\s+/g, '_')}_Classes_Report.html`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setSnackbarMessage("Report downloaded successfully!");
    setSnackbarOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Summary Card */}
      <Card
        sx={{
          mb: 2,
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          background: "linear-gradient(135deg, #B21F62 0%, #ffb703 100%)",
          color: "white",
        }}
      >
        <CardContent sx={{ p: 1.5 }}>
          <Grid
            container
            alignItems="center"
            spacing={2}
            justifyContent="space-between"
          >
            {/* Left Side: Student Info and Progress */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <StatusIcon sx={{ fontSize: 28 }} />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, fontSize: "1.2rem" }}
                    >
                      {student.Name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label={formatDate(student.startDate)}
                        size="small"
                        sx={{
                          backgroundColor: "#B21F62",
                          color: "white",
                          fontWeight: 500,
                          fontSize: "0.7rem",
                        }}
                      />
                      <Typography variant="body2" sx={{ color: "white" }}>
                        to
                      </Typography>
                      <Chip
                        label={formatDate(student.endDate)}
                        size="small"
                        sx={{
                          backgroundColor: "#ffb703",
                          color: "black",
                          fontWeight: 500,
                          fontSize: "0.7rem",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                {isPaymentCycleOngoing && (
                  <Box sx={{ width: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                        Course Progress
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.8rem", fontWeight: 500 }}
                      >
                        {progressPercentage.toFixed(0)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progressPercentage}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "white",
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Right Side: Status and Action Buttons */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "column" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  gap: 2,
                  height: "100%",
                }}
              >
                {/* Status Badge */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 1,
                  }}
                >
                  <StatusIcon sx={{ fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {statusText}
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <Tooltip title="Copy to clipboard">
                    <IconButton
                      size="small"
                      onClick={handleCopyToClipboard}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.25)",
                        },
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Share via WhatsApp">
                    <IconButton
                      size="small"
                      onClick={handleWhatsAppShare}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.25)",
                        },
                      }}
                    >
                      <WhatsAppIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download as PDF">
                    <IconButton
                      size="small"
                      onClick={handlePdfDownload}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.25)",
                        },
                      }}
                    >
                      <PictureAsPdfIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Classes Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          background: "white",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="classes table">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#ffedc9",
                borderBottom: "2px solid",
                borderColor: "divider",
              }}
            >
              <TableCell
                sx={{
                  color: "#B21F62",
                  fontWeight: 600,
                  py: 1.5,
                  fontSize: "0.9rem",
                  pl: 3,
                  width: "10%",
                }}
              >
                S.No
              </TableCell>
              <TableCell
                sx={{
                  color: "#B21F62",
                  fontWeight: 600,
                  py: 1.5,
                  fontSize: "0.9rem",
                  width: "20%",
                }}
              >
                <CalendarMonthIcon
                  sx={{
                    verticalAlign: "middle",
                    mr: 1,
                    color: "#B21F62",
                    fontSize: 18,
                  }}
                />
                Date
              </TableCell>
              <TableCell
                sx={{
                  color: "#B21F62",
                  fontWeight: 600,
                  py: 1.5,
                  fontSize: "0.9rem",
                  width: "20%",
                }}
              >
                <AccessTimeIcon
                  sx={{
                    verticalAlign: "middle",
                    mr: 1,
                    color: "#B21F62",
                    fontSize: 18,
                  }}
                />
                Timings
              </TableCell>
              <TableCell
                sx={{
                  color: "#B21F62",
                  fontWeight: 600,
                  py: 1.5,
                  fontSize: "0.9rem",
                  width: "15%",
                }}
              >
                <HourglassEmptyIcon
                  sx={{
                    verticalAlign: "middle",
                    mr: 1,
                    color: "#B21F62",
                    fontSize: 18,
                  }}
                />
                Duration
              </TableCell>
              <TableCell
                sx={{
                  color: "#B21F62",
                  fontWeight: 600,
                  py: 1.5,
                  fontSize: "0.9rem",
                  pr: 3,
                  width: "35%",
                }}
              >
                <TopicIcon
                  sx={{
                    verticalAlign: "middle",
                    mr: 1,
                    color: "#B21F62",
                    fontSize: 18,
                  }}
                />
                Lesson
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {classesData.map((row, index) => (
                <TableRow
                  key={index}
                  component={motion.tr}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  sx={{
                    backgroundColor:
                      index % 2 === 0 ? "rgba(178, 31, 98, 0.04)" : "transparent",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(178, 31, 98, 0.08)",
                    },
                    "&:last-child td": {
                      borderBottom: "none",
                    },
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                      py: 2,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      pl: 3,
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.primary",
                      fontWeight: 500,
                      py: 2,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    {formatDate(row.date)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.primary",
                      fontWeight: 500,
                      py: 2,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    {row.time}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.primary",
                      fontWeight: 500,
                      py: 2,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Chip
                      label={`${row.duration.toFixed(1)} hr`}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(178, 31, 98, 0.1)",
                        color: "#B21F62",
                        fontWeight: 500,
                        fontSize: "0.75rem",
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.primary",
                      fontWeight: 500,
                      py: 2,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      pr: 3,
                    }}
                  >
                    {row.topic}
                  </TableCell>
                </TableRow>
              ))}
            </AnimatePresence>

            {classesData.length > 0 && (
              <TableRow
                sx={{
                  backgroundColor: "#B21F62",
                  "&:hover": {
                    backgroundColor: "#9c1a53",
                  },
                }}
              >
                <TableCell
                  colSpan={3}
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    textAlign: "right",
                    border: "none",
                    py: 2,
                    fontSize: "0.95rem",
                    pl: 3,
                  }}
                >
                  Total Duration:
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    border: "none",
                    py: 2,
                    fontSize: "1rem",
                  }}
                >
                  {`${totalDuration.toFixed(1)} hr${
                    totalDuration !== 1 ? "s" : ""
                  }`}
                </TableCell>
                <TableCell
                  sx={{
                    border: "none",
                    py: 2,
                    pr: 3,
                  }}
                />
              </TableRow>
            )}
          </TableBody>
        </Table>

        {classesData.length === 0 && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No classes recorded for this period
            </Typography>
          </Box>
        )}
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%", backgroundColor: "#ffedc9", color: "#B21F62" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default ClassesCompletedTable;