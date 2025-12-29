import React, { useMemo } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Divider,
  Grid
} from "@mui/material";
import {
  AccountBalanceWallet,
  CalendarToday,
  Schedule,
  Done,
  Close,
  Event
} from "@mui/icons-material";
import { useSelector } from "react-redux";

// --- HELPER: Currency Formatter ---
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

// --- COMPONENT: Mobile Payment Card (Defined OUTSIDE to prevent errors) ---
const PaymentCard = ({ data, index, isPending }) => {
  return (
    <Grid item xs={12} sm={6}>
      <Card
        elevation={2}
        sx={{
          borderRadius: 3,
          border: isPending ? "2px solid #f59e0b" : "1px solid #e2e8f0",
          background: isPending ? "#fffbeb" : "white",
          height: "100%",
          transition: "transform 0.2s",
          "&:active": { transform: "scale(0.98)" }
        }}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          {/* Header: ID and Status Chip */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700 }}>
              #{isPending ? "PENDING" : index + 1}
            </Typography>
            <Chip
              icon={
                isPending ? <Schedule sx={{ fontSize: "1rem !important" }} /> 
                : (data.paid ? <Done sx={{ fontSize: "1rem !important" }} /> : <Close sx={{ fontSize: "1rem !important" }} />)
              }
              label={isPending ? "Pending" : (data.paid ? "Paid" : "Unpaid")}
              color={isPending ? "warning" : (data.paid ? "success" : "error")}
              size="small"
              variant="filled"
              sx={{ fontWeight: 700, borderRadius: 1 }}
            />
          </Box>

          <Divider sx={{ my: 1.5, borderColor: isPending ? "#fcd34d" : "#f1f5f9" }} />

          {/* Details Grid */}
          <Grid container spacing={2} alignItems="center">
            {/* Left: Month */}
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: "0.7rem", textTransform: "uppercase" }}>
                Month
              </Typography>
              <Typography variant="body1" fontWeight={700} color="text.primary">
                {data.month ? dayjs(data.month, "YYYY-MM").format("MMM YYYY") : "N/A"}
              </Typography>
            </Grid>

            {/* Right: Amount */}
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: "0.7rem", textTransform: "uppercase" }}>
                Amount
              </Typography>
              <Typography variant="h6" fontWeight={800} sx={{ color: isPending ? "warning.main" : (data.paid ? "success.main" : "text.primary"), fontSize: "1.1rem" }}>
                {currencyFormatter.format(data.amount)}
              </Typography>
            </Grid>
            
            {/* Footer: Date */}
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mt: 0.5, 
                bgcolor: isPending ? 'rgba(245, 158, 11, 0.1)' : '#f8fafc', 
                p: 1, 
                borderRadius: 2 
              }}>
                {isPending ? <Schedule sx={{ fontSize: 16, color: "warning.dark" }} /> : <Event sx={{ fontSize: 16, color: "text.secondary" }} />}
                <Typography variant="body2" sx={{ color: isPending ? "warning.dark" : "text.secondary", fontWeight: 600, fontSize: "0.85rem" }}>
                  {isPending ? `Due: ${data.dueDate}` : `Paid On: ${data.date}`}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

// --- MAIN COMPONENT ---
const PaymentHistoryTable = ({ payments = [], monthlyFee = 0 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); 

  // Get current student for pending installment check
  const currentStudent = useSelector((state) => state.auth?.currentStudent);

  const { rows, totalPaid, paidCount, totalAmount, pendingInstallment } = useMemo(() => {
    let total = 0;
    let paid = 0;
    let totalPossible = 0;
    let pendingInstallmentData = null;

    const processedRows = payments
      .map((p) => {
        let jsDate = null;

        if (p.paidOn) {
          if (p.paidOn._seconds) {
            jsDate = new Date(p.paidOn._seconds * 1000);
          } else if (p.paidOn instanceof Date) {
            jsDate = p.paidOn;
          } else if (typeof p.paidOn === "string") {
            jsDate = new Date(p.paidOn);
          }
        }

        if (!jsDate || isNaN(jsDate.getTime())) {
          return null;
        }

        const isPaid = p.amount > 0;
        const amount = p.amount || 0;
        if (isPaid) {
          total += amount;
          paid++;
        }
        totalPossible += amount || 0;

        return {
          id: p.id,
          date: dayjs(jsDate).format("DD MMM YYYY"),
          month: p.month,
          paid: isPaid,
          amount: amount,
          rawDate: jsDate,
        };
      })
      .filter(Boolean);

    processedRows.sort((a, b) => b.rawDate - a.rawDate);

    // Logic for pending installment
    if (currentStudent?.isRevisionProgramJEEMains2026Student && currentStudent?.revisionProgramFee) {
      const { installments } = currentStudent.revisionProgramFee;
      if (installments && installments.installment2 && installments.installment2.status === "unpaid") {
        pendingInstallmentData = {
          id: "pending-installment-2",
          date: installments.installment2.dueDate, // Used for desktop display
          month: "2025-11",
          paid: false,
          amount: installments.installment2.amount,
          rawDate: new Date(2025, 10, 15), // Used for sorting
          isPending: true,
          dueDate: installments.installment2.dueDate // Used for display logic
        };
      }
    }

    return {
      rows: processedRows,
      totalPaid: total,
      paidCount: paid,
      totalAmount: totalPossible,
      pendingInstallment: pendingInstallmentData,
    };
  }, [payments, monthlyFee, currentStudent]); // Added currentStudent to dependency array

  if (!rows.length && !pendingInstallment) {
    return (
      <Box
        sx={{
          p: 6,
          textAlign: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          borderRadius: 3,
          border: "1px solid #e2e8f0",
        }}
      >
        <AccountBalanceWallet sx={{ fontSize: 64, color: "text.secondary", mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          No payment history available
        </Typography>
      </Box>
    );
  }

  // --- MOBILE / GRID VIEW RENDER ---
  if (isMobile) {
    return (
      <Box sx={{ width: "100%" }}>
        <Grid container spacing={2}>
          {pendingInstallment && (
            <PaymentCard data={pendingInstallment} isPending={true} />
          )}
          {rows.map((row, index) => (
            <PaymentCard key={row.id} data={row} index={index} isPending={false} />
          ))}
        </Grid>
        
        {/* Total Summary Card for Mobile */}
        <Paper elevation={3} sx={{ p: 2, borderRadius: 3, background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", color: "white", mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight={600}>Total Paid</Typography>
            <Typography variant="h6" fontWeight={700} sx={{ color: "#4ade80" }}>
              {currencyFormatter.format(totalPaid)}
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }

  // --- DESKTOP TABLE VIEW RENDER ---
  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer
        component={Paper}
        elevation={4}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          border: "1px solid #e2e8f0",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
              <TableCell sx={{ fontWeight: 700, color: "white", fontSize: "16px", textAlign: "center", py: 3, width: "100px" }}>
                Sl. No.
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "white", fontSize: "16px", textAlign: "center", py: 3 }}>
                Month
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "white", fontSize: "16px", textAlign: "center", py: 3 }}>
                Date Paid
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "white", fontSize: "16px", textAlign: "center", py: 3 }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "white", fontSize: "16px", textAlign: "center", py: 3 }}>
                Amount
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {pendingInstallment && (
              <TableRow
                key={pendingInstallment.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                  border: "2px solid #f59e0b",
                }}
              >
                <TableCell sx={{ textAlign: "center", py: 2.5 }}>
                  <Typography variant="body1" fontWeight={600} sx={{ fontSize: "15px", color: "#d97706" }}>
                    N/A
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: "center", py: 2.5 }}>
                  <Typography variant="body1" fontWeight={600} sx={{ fontSize: "15px", color: "#d97706" }}>
                    {pendingInstallment.month ? dayjs(pendingInstallment.month, "YYYY-MM").format("MMM YYYY") : "N/A"}
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: "center", py: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                    <Schedule sx={{ fontSize: 18, color: "#d97706" }} />
                    <Typography variant="body1" sx={{ fontSize: "15px", color: "#d97706", fontWeight: 600 }}>
                      Due: {pendingInstallment.dueDate}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ textAlign: "center", py: 2.5 }}>
                  <Chip icon={<Schedule />} label="Pending" color="warning" variant="filled" sx={{ fontWeight: 600 }} />
                </TableCell>
                <TableCell sx={{ textAlign: "center", py: 2.5 }}>
                  <Typography variant="body1" fontWeight={600} sx={{ fontSize: "15px", color: "warning.main" }}>
                    {currencyFormatter.format(pendingInstallment.amount)}
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {rows.map((row, index) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)" },
                  background: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                  transition: "all 0.2s ease",
                }}
              >
                <TableCell sx={{ textAlign: "center", py: 2.5 }}>
                  <Typography variant="body1" fontWeight={600} sx={{ fontSize: "15px" }}>{index + 1}</Typography>
                </TableCell>
                <TableCell sx={{ textAlign: "center", py: 2.5 }}>
                  <Typography variant="body1" fontWeight={600} sx={{ fontSize: "15px" }}>
                    {row.month ? dayjs(row.month, "YYYY-MM").format("MMM YYYY") : "N/A"}
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: "center", py: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                    <CalendarToday sx={{ fontSize: 18, color: "text.secondary" }} />
                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: "15px" }}>{row.date}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ textAlign: "center", py: 2.5 }}>
                  <Chip
                    icon={row.paid ? <Done /> : <Close />}
                    label={row.paid ? "Paid" : "Unpaid"}
                    color={row.paid ? "success" : "error"}
                    variant="filled"
                    sx={{ fontWeight: 700, minWidth: 90, borderRadius: "8px" }}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "center", py: 2.5 }}>
                  <Typography variant="body1" fontWeight={600} sx={{ fontSize: "15px", color: row.paid ? "success.main" : "text.secondary" }}>
                    {currencyFormatter.format(row.amount)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}

            <TableRow sx={{ background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)", borderTop: "2px solid #cbd5e1" }}>
              <TableCell colSpan={3} />
              <TableCell sx={{ py: 2.5, textAlign: "center" }}>
                <Typography variant="body1" fontWeight={700} sx={{ fontSize: "16px", color: "text.primary" }}>
                  Total Paid:
                </Typography>
              </TableCell>
              <TableCell sx={{ py: 2.5, textAlign: "center" }}>
                <Typography variant="body1" fontWeight={700} sx={{ fontSize: "16px", color: "success.main" }}>
                  {currencyFormatter.format(totalPaid)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

PaymentHistoryTable.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      paidOn: PropTypes.any,
      month: PropTypes.string,
    })
  ).isRequired,
  monthlyFee: PropTypes.number,
};

export default PaymentHistoryTable;