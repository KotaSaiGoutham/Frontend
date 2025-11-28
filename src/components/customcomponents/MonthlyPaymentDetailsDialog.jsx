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
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { clearMonthlyPaymentDetails } from "../../redux/actions";

const MonthlyPaymentDetailsDialog = () => {
  const dispatch = useDispatch();
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

  return (
    <Dialog
      open={!!monthlyPaymentDetails}
      onClose={handleClose}
      // 1. CHANGED: maxWidth="md" reduces the overall width, bringing columns closer
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
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
          py: 2,
        }}
      >
        <Box>
          <Typography variant="h6" component="div" fontSize="1.25rem">
            Payment Details - {formatMonthYear(selectedMonth)}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ opacity: 0.9, mt: 0.5 }}
            fontSize="0.9rem"
          >
            Total: {formatAmount(totalAmount)} • {monthlyPaymentDetails.length}{" "}
            payments
          </Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: "white" }} size="medium">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 600 }}>
            <TableHead sx={{ bgcolor: "grey.50" }}>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.2rem", // Slightly reduced font size
                    textAlign: "center",
                    px: 0.5, // 2. CHANGED: Reduced padding
                    py: 1.5,
                    width: "8%", // 3. CHANGED: Fixed width
                  }}
                >
                  Sl No
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    textAlign: "left", // Name looks better left aligned usually
                    paddingLeft: 2,
                    px: 0.5,
                    py: 1.5,
                    cursor: "pointer",
                    width: "15%", // 3. CHANGED: Fixed width
                  }}
                  onClick={() => handleSort("studentName")}
                >
                  <TableSortLabel
                    active={sortConfig.key === "studentName"}
                    direction={
                      sortConfig.key === "studentName"
                        ? sortConfig.direction
                        : "asc"
                    }
                    onClick={() => handleSort("studentName")}
                  >
                    Student Name
                  </TableSortLabel>
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    textAlign: "center",
                    px: 0.5,
                    py: 1.5,
                    width: "12%", // 3. CHANGED: Fixed width
                  }}
                >
                  Stream
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    textAlign: "center",
                    px: 0.5,
                    py: 1.5,
                    width: "15%", // 3. CHANGED: Fixed width
                  }}
                >
                  Year
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    textAlign: "center",
                    px: 0.5,
                    py: 1.5,
                    cursor: "pointer",
                    width: "20%", // 3. CHANGED: Fixed width
                  }}
                  onClick={() => handleSort("paidOn")}
                >
                  <TableSortLabel
                    active={sortConfig.key === "paidOn"}
                    direction={
                      sortConfig.key === "paidOn" ? sortConfig.direction : "asc"
                    }
                    onClick={() => handleSort("paidOn")}
                  >
                    Paid On
                  </TableSortLabel>
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    textAlign: "center",
                    px: 0.5,
                    py: 1.5,
                    cursor: "pointer",
                    width: "15%", // 3. CHANGED: Fixed width
                  }}
                  onClick={() => handleSort("amount")}
                >
                  <TableSortLabel
                    active={sortConfig.key === "amount"}
                    direction={
                      sortConfig.key === "amount" ? sortConfig.direction : "asc"
                    }
                    onClick={() => handleSort("amount")}
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
                  <TableCell
                    sx={{
                      textAlign: "center",
                      px: 0.5, // Reduced padding
                      py: 1.25,
                    }}
                  >
                    <Typography variant="body1" fontSize="1.1rem">
                      {index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "left", // Align names left
                      paddingLeft: 2,
                      px: 0.5,
                      py: 1.25,
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      fontSize="1.1rem"
                    >
                      {payment.studentName}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      px: 0.5,
                      py: 1.25,
                    }}
                  >
                    <Typography variant="body1" fontSize="1.1rem">
                      {payment.stream}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      px: 0.5,
                      py: 1.25,
                    }}
                  >
                    <Typography variant="body1" fontSize="1.1rem">
                      {formatClassYear(payment.year)}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      px: 0.5,
                      py: 1.25,
                    }}
                  >
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      fontSize="1.1rem"
                    >
                      {formatDate(payment.paidOn)}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      px: 0.5,
                      py: 1.25,
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="success.main"
                      fontSize="1.1rem"
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
            justifyContent: "flex-end",
            width: "100%",
            alignItems: "center",
            gap: 2,
            pr: 4.5,
          }}
        >
          <Typography variant="h6" color="primary.main" fontSize="1.1rem">
            Total Collection :
          </Typography>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="success.main"
            fontSize="1.3rem"
            sx={{ minWidth: "120px", textAlign: "center" }}
          >
            {formatAmount(totalAmount)}
          </Typography>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default MonthlyPaymentDetailsDialog;