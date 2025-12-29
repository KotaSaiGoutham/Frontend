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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { clearMonthlyPaymentDetails } from "../../redux/actions";

const MonthlyPaymentDetailsDialog = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  // Check if screen size is mobile (sm or down)
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { monthlyPaymentDetails, selectedMonth } = useSelector(
    (state) => state.expenditures
  );

  const [sortConfig, setSortConfig] = useState({
    key: "paidOn",
    direction: "desc",
  });

  const handleClose = () => {
    dispatch(clearMonthlyPaymentDetails());
    setSortConfig({ key: "paidOn", direction: "desc" });
  };

  const formatMonthYear = (monthYear) => {
    if (!monthYear) return "";
    const [year, month] = monthYear.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
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

  const formatClassYear = (yearString) => {
    if (!yearString) return "";
    const text = yearString.toString().toLowerCase().trim();
    if (text === "11th class" || text === "1st year") return "1st Year";
    if (text === "12th class" || text === "2nd year") return "2nd Year";
    return yearString;
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedDetails = useMemo(() => {
    if (!monthlyPaymentDetails) return [];

    let sortableItems = [...monthlyPaymentDetails];

    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === "studentName") {
          const nameA = a.studentName ? a.studentName.toLowerCase() : "";
          const nameB = b.studentName ? b.studentName.toLowerCase() : "";
          if (nameA < nameB) return sortConfig.direction === "asc" ? -1 : 1;
          if (nameA > nameB) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        }
        if (sortConfig.key === "paidOn") {
          const dateA = a.paidOn?._seconds || 0;
          const dateB = b.paidOn?._seconds || 0;
          if (dateA < dateB) return sortConfig.direction === "asc" ? -1 : 1;
          if (dateA > dateB) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        }
        if (sortConfig.key === "amount") {
          const amountA = a.amount || 0;
          const amountB = b.amount || 0;
          if (amountA < amountB) return sortConfig.direction === "asc" ? -1 : 1;
          if (amountA > amountB) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [monthlyPaymentDetails, sortConfig]);

  if (!monthlyPaymentDetails) return null;

  const totalAmount = monthlyPaymentDetails.reduce(
    (sum, payment) => sum + (payment.amount || 0),
    0
  );

  // Common Header Style Helper
  const getHeaderStyle = (
    width = "auto",
    align = "center",
    isStickyLeft = false
  ) => ({
    fontWeight: "bold",
    fontSize: isMobile ? "0.9rem" : "1.1rem",
    textAlign: align,
    px: isMobile ? 1 : 0.5,
    py: 1.5,
    width: width,
    whiteSpace: "nowrap",
    bgcolor: "grey.50",
    zIndex: isStickyLeft ? 3 : 1,
    ...(isStickyLeft && {
      position: "sticky",
      left: 0,
      borderRight: "1px solid rgba(224, 224, 224, 1)",
    }),
  });

  // Common Cell Style Helper
  const getCellStyle = (align = "center", isStickyLeft = false) => ({
    textAlign: align,
    px: isMobile ? 1 : 0.5,
    py: 1.25,
    fontSize: isMobile ? "0.85rem" : "1rem",
    bgcolor: isStickyLeft ? "white" : "inherit",
    zIndex: isStickyLeft ? 2 : "auto",
    ...(isStickyLeft && {
      position: "sticky",
      left: 0,
      borderRight: "1px solid rgba(224, 224, 224, 1)",
    }),
  });

  return (
    <Dialog
      open={!!monthlyPaymentDetails}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile} // Full screen on mobile
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
            Payment Details
            {!isMobile && ` - ${formatMonthYear(selectedMonth)}`}
          </Typography>
          {isMobile && (
            <Typography
              variant="caption"
              sx={{ opacity: 0.9, display: "block" }}
            >
              {formatMonthYear(selectedMonth)}
            </Typography>
          )}
          <Typography
            variant="subtitle2"
            sx={{ opacity: 0.9, mt: 0.5 }}
            fontSize={isMobile ? "0.8rem" : "0.9rem"}
          >
            Total: {formatAmount(totalAmount)} • {monthlyPaymentDetails.length}{" "}
            payments
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

      <DialogContent sx={{ p: 0 }}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            // Dynamic height: Viewport - Header/Footer estimate
            height: isMobile ? "calc(100vh - 130px)" : "auto",
            maxHeight: isMobile ? "none" : "60vh",
            overflow: "auto",
          }}
        >
          <Table sx={{ minWidth: isMobile ? 650 : 600 }} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={getHeaderStyle("50px")}>Sl</TableCell>

                <TableCell
                  sx={getHeaderStyle("auto", "left", true)} // Stick Name to Left
                  onClick={() => handleSort("studentName")}
                >
                  <TableSortLabel
                    active={sortConfig.key === "studentName"}
                    direction={
                      sortConfig.key === "studentName"
                        ? sortConfig.direction
                        : "asc"
                    }
                  >
                    Student Name
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={getHeaderStyle("100px")}>Stream</TableCell>
                <TableCell sx={getHeaderStyle("100px")}>Year</TableCell>

                <TableCell
                  sx={getHeaderStyle("120px")}
                  onClick={() => handleSort("paidOn")}
                >
                  <TableSortLabel
                    active={sortConfig.key === "paidOn"}
                    direction={
                      sortConfig.key === "paidOn"
                        ? sortConfig.direction
                        : "asc"
                    }
                  >
                    Paid On
                  </TableSortLabel>
                </TableCell>

                <TableCell
                  sx={getHeaderStyle("120px")}
                  onClick={() => handleSort("amount")}
                >
                  <TableSortLabel
                    active={sortConfig.key === "amount"}
                    direction={
                      sortConfig.key === "amount"
                        ? sortConfig.direction
                        : "asc"
                    }
                  >
                    Amount
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedDetails.map((payment, index) => (
                <TableRow
                  key={payment.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <TableCell sx={getCellStyle()}>
                    {index + 1}
                  </TableCell>

                  <TableCell sx={getCellStyle("left", true)}> {/* Stick Name to Left */}
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      fontSize={isMobile ? "0.9rem" : "1rem"}
                      noWrap
                    >
                      {payment.studentName}
                    </Typography>
                  </TableCell>

                  <TableCell sx={getCellStyle()}>
                    {payment.stream}
                  </TableCell>

                  <TableCell sx={getCellStyle()}>
                    {formatClassYear(payment.year)}
                  </TableCell>

                  <TableCell sx={getCellStyle()}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontSize="inherit"
                    >
                      {formatDate(payment.paidOn)}
                    </Typography>
                  </TableCell>

                  <TableCell sx={getCellStyle()}>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="success.main"
                      fontSize="inherit"
                    >
                      {formatAmount(payment.amount)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
            justifyContent: isMobile ? "center" : "flex-end", // Center on mobile
            width: "100%",
            alignItems: "center",
            pr: isMobile ? 0 : 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row", // Stack vertical on mobile
              alignItems: "center",
              gap: isMobile ? 0.5 : 2,
            }}
          >
            <Typography
              variant="h6"
              color="primary.main"
              fontSize={isMobile ? "1rem" : "1.1rem"}
            >
              Total Collection:
            </Typography>
            <Typography
              variant="h5"
              fontWeight="bold"
              color="success.main"
              fontSize={isMobile ? "1.2rem" : "1.3rem"}
              sx={{ minWidth: "120px", textAlign: "center" }}
            >
              {formatAmount(totalAmount)}
            </Typography>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default MonthlyPaymentDetailsDialog;