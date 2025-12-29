// src/components/customcomponents/StudentDetailsDialog.js
import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TableSortLabel,
  Chip,
  Tooltip,
  Skeleton,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  PersonOff as PersonOffIcon,
  Sort as SortIcon, // Added for mobile sort indication if needed
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { clearMonthlyStudentDetails } from "../../redux/actions";

const StudentDetailsDialog = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  // Check if screen size is mobile (sm or down)
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    monthlyStudentDetails,
    selectedStudentMonth,
    studentDetailsLoading,
    studentDetailsOpen,
    selectedSubject,
  } = useSelector((state) => state.students);

  const [sortConfig, setSortConfig] = useState({
    key: "admissionDate",
    direction: "asc",
  });

  const handleClose = () => {
    dispatch(clearMonthlyStudentDetails());
    setSortConfig({ key: "admissionDate", direction: "asc" });
  };

  const formatMonthYear = (monthYear) => {
    if (!monthYear) return "";
    const [year, month] = monthYear.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return "N/A";
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = useMemo(() => {
    if (!monthlyStudentDetails) return [];

    let sortableItems = [...monthlyStudentDetails];

    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === "name") {
          const nameA = a.name ? a.name.toLowerCase() : "";
          const nameB = b.name ? b.name.toLowerCase() : "";
          if (nameA < nameB) return sortConfig.direction === "asc" ? -1 : 1;
          if (nameA > nameB) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        }
        if (sortConfig.key === "admissionDate") {
          const dateA = a.admissionDate?._seconds || 0;
          const dateB = b.admissionDate?._seconds || 0;
          return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
        }
        if (sortConfig.key === "monthlyFee") {
          const feeA = a.monthlyFee || 0;
          const feeB = b.monthlyFee || 0;
          return sortConfig.direction === "asc" ? feeA - feeB : feeB - feeA;
        }
        if (sortConfig.key === "totalPaid") {
          const paidA = a.totalPaid || 0;
          const paidB = b.totalPaid || 0;
          return sortConfig.direction === "asc" ? paidA - paidB : paidB - paidA;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [monthlyStudentDetails, sortConfig]);

  if (!studentDetailsOpen) return null;

  const totalPaidAmount =
    monthlyStudentDetails?.reduce(
      (sum, student) => sum + (student.totalPaid || 0),
      0
    ) || 0;

  // --- Constants & Styles ---
  const STICKY_NAME_WIDTH = "220px"; // Only used for desktop now

  const getHeaderStyle = (width = "auto", align = "center", isStickyLeft = false) => ({
    fontWeight: "bold",
    fontSize: "1rem",
    textAlign: align,
    px: 0.5,
    py: 1.5,
    width: width,
    whiteSpace: "nowrap",
    bgcolor: "grey.50",
    zIndex: isStickyLeft ? 3 : 1,
    ...(isStickyLeft && {
      position: "sticky",
      left: 0,
      borderRight: "1px solid rgba(224, 224, 224, 1)",
      boxShadow: "2px 0 5px -2px rgba(0,0,0,0.1)",
    }),
  });

  const getCellStyle = (align = "center", isStickyLeft = false, maxWidth = "auto") => ({
    textAlign: align,
    px: 0.5,
    py: 1.25,
    fontSize: "0.95rem",
    bgcolor: isStickyLeft ? "white" : "inherit",
    zIndex: isStickyLeft ? 2 : "auto",
    maxWidth: maxWidth,
    ...(isStickyLeft && {
      position: "sticky",
      left: 0,
      borderRight: "1px solid rgba(224, 224, 224, 1)",
      boxShadow: "2px 0 5px -2px rgba(0,0,0,0.1)",
    }),
  });

  // --- Render Skeleton for Mobile Cards ---
  const renderMobileSkeletons = () => (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Grid item xs={12} key={index}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Skeleton variant="text" width="60%" height={30} />
                <Skeleton variant="circular" width={24} height={24} />
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="text" width="30%" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Dialog
      open={studentDetailsOpen}
      onClose={handleClose}
      maxWidth={false}
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: isMobile ? 1.5 : 2,
          px: isMobile ? 2 : 3,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            component="div"
            fontSize={isMobile ? "1rem" : "1.25rem"}
          >
            Student Details
            {selectedSubject && selectedSubject !== "All" && ` (${selectedSubject})`}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ opacity: 0.9, mt: 0.5 }}
            fontSize={isMobile ? "0.8rem" : "0.9rem"}
          >
            {formatMonthYear(selectedStudentMonth)} • Total:{" "}
            {studentDetailsLoading ? (
              "..."
            ) : (
              monthlyStudentDetails?.length || 0
            )}{" "}
            students
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{ color: "white" }}
          size={isMobile ? "small" : "medium"}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: isMobile ? "#f5f5f5" : "white" }}>
        
        {/* ========================================================= */}
        {/* MOBILE VIEW (GRID / CARDS)                 */}
        {/* ========================================================= */}
        {isMobile ? (
          <Box sx={{ height: "calc(100vh - 130px)", overflowY: "auto", pb: 4 }}>
            {studentDetailsLoading ? (
              renderMobileSkeletons()
            ) : (
              <Grid container spacing={1.5} sx={{ p: 1.5 }}>
                {sortedStudents.map((student, index) => (
                  <Grid item xs={12} key={student.id}>
                    <Card
                      elevation={2}
                      sx={{
                        borderRadius: 2,
                        borderLeft: student.deactivated ? "4px solid #ef5350" : "4px solid #66bb6a",
                      }}
                    >
                      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                        {/* Header: Name + Status */}
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box sx={{ maxWidth: "70%" }}>
                            <Typography variant="subtitle1" fontWeight="bold" noWrap>
                              {index + 1}. {student.name}
                            </Typography>
                            {student.deactivated && (
                                <Typography variant="caption" color="error" display="block">
                                    Left on: {formatDate(student.deactivatedAt)}
                                </Typography>
                            )}
                          </Box>
                          
                          <Chip
                            label={student.deactivated ? "Left" : "Active"}
                            size="small"
                            color={student.deactivated ? "error" : "success"}
                            variant="outlined"
                            sx={{ fontWeight: "bold", height: 24 }}
                          />
                        </Box>

                        <Divider sx={{ my: 1.5, opacity: 0.6 }} />

                        {/* Body: Fee Info */}
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box textAlign="left">
                            <Typography variant="caption" color="text.secondary" display="block">
                              Monthly Fee
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" color="primary.main">
                              {formatAmount(student.monthlyFee)}
                            </Typography>
                          </Box>
                          
                          <Box textAlign="right">
                            <Typography variant="caption" color="text.secondary" display="block">
                              Total Paid
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" color="success.main">
                              {formatAmount(student.totalPaid)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        ) : (
          /* ========================================================= */
          /* DESKTOP VIEW (TABLE)                      */
          /* ========================================================= */
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              height: "60vh",
              maxHeight: "60vh",
              overflow: "auto",
            }}
          >
            <Table sx={{ minWidth: 800 }} stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={getHeaderStyle("50px")}>Sl</TableCell>

                  <TableCell
                    sx={getHeaderStyle(STICKY_NAME_WIDTH, "left", true)}
                    onClick={() => handleSort("name")}
                  >
                    <TableSortLabel
                      active={sortConfig.key === "name"}
                      direction={sortConfig.key === "name" ? sortConfig.direction : "asc"}
                    >
                      Student Name
                    </TableSortLabel>
                  </TableCell>

                  <TableCell sx={getHeaderStyle("90px")}>Status</TableCell>

                  <TableCell
                    sx={getHeaderStyle("110px")}
                    onClick={() => handleSort("monthlyFee")}
                  >
                    <TableSortLabel
                      active={sortConfig.key === "monthlyFee"}
                      direction={
                        sortConfig.key === "monthlyFee" ? sortConfig.direction : "asc"
                      }
                    >
                      Fee
                    </TableSortLabel>
                  </TableCell>

                  <TableCell
                    sx={getHeaderStyle("110px")}
                    onClick={() => handleSort("totalPaid")}
                  >
                    <TableSortLabel
                      active={sortConfig.key === "totalPaid"}
                      direction={
                        sortConfig.key === "totalPaid" ? sortConfig.direction : "asc"
                      }
                    >
                      Paid
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentDetailsLoading
                  ? Array.from({ length: 8 }, (_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell sx={{position:'sticky', left:0, bgcolor:'white'}}><Skeleton /></TableCell>
                        <TableCell colSpan={3}><Skeleton /></TableCell>
                      </TableRow>
                    ))
                  : sortedStudents.map((student, index) => (
                      <TableRow
                        key={student.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        <TableCell sx={getCellStyle()}>
                          {index + 1}
                        </TableCell>

                        <TableCell sx={getCellStyle("left", true, STICKY_NAME_WIDTH)}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Tooltip title={student.name || ""} placement="right" arrow>
                              <Typography
                                variant="body1"
                                fontWeight="medium"
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  width: "100%",
                                  display: "block"
                                }}
                              >
                                {student.name}
                              </Typography>
                            </Tooltip>
                            {student.deactivated && (
                              <Tooltip title="Student Left">
                                <PersonOffIcon color="error" sx={{ fontSize: "1rem" }} />
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>

                        <TableCell sx={getCellStyle()}>
                          <Chip
                            label={student.deactivated ? "Left" : "Active"}
                            size="small"
                            color={student.deactivated ? "error" : "success"}
                            variant="filled"
                            sx={{ height: "20px", fontSize: "0.65rem", fontWeight: "bold" }}
                          />
                        </TableCell>

                        <TableCell sx={getCellStyle()}>
                          <Typography fontWeight="bold" color="primary.main">
                            {formatAmount(student.monthlyFee)}
                          </Typography>
                        </TableCell>

                        <TableCell sx={getCellStyle()}>
                          <Typography fontWeight="bold" color="success.main">
                            {formatAmount(student.totalPaid)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          bgcolor: "grey.50",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: isMobile ? "center" : "flex-end",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", gap: isMobile ? 0.5 : 2 }}>
            <Typography
              variant="h6"
              color="primary.main"
              fontSize={isMobile ? "1rem" : "1.1rem"}
            >
              Total Paid Amount:
            </Typography>
            {studentDetailsLoading ? (
              <Skeleton variant="text" width={100} />
            ) : (
              <Typography
                variant="h5"
                fontWeight="bold"
                color="success.main"
                fontSize={isMobile ? "1.2rem" : "1.3rem"}
              >
                {formatAmount(totalPaidAmount)}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default StudentDetailsDialog;