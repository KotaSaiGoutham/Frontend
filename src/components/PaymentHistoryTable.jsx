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
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Payment,
  AccountBalanceWallet,
  CalendarToday,
  TrendingUp,
} from "@mui/icons-material";

const PaymentHistoryTable = ({ payments = [] }) => {
  const { rows, totalPaid, paidCount, totalAmount } = useMemo(() => {
    let total = 0;
    let paid = 0;
    let totalPossible = 0;

    const rows = payments
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
          console.warn("Invalid date for payment:", p.id, p.paidOn);
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

    rows.sort((a, b) => b.rawDate - a.rawDate);
    return {
      rows,
      totalPaid: total,
      paidCount: paid,
      totalAmount: totalPossible,
    };
  }, [payments]);
  console.log("rows",rows)

  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const paymentRate =
    payments.length > 0 ? (paidCount / payments.length) * 100 : 0;

  if (!rows.length) {
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
        <AccountBalanceWallet
          sx={{
            fontSize: 64,
            color: "text.secondary",
            mb: 2,
            opacity: 0.5,
          }}
        />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          No payment history available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Payment records will appear here once transactions are processed
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {/* Enhanced Table */}
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
            <TableRow
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "white",
                  fontSize: "16px",
                  textAlign: "center",
                  py: 3,
                }}
              >
                Month
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "white",
                  fontSize: "16px",
                  textAlign: "center",
                  py: 3,
                }}
              >
                Date Paid
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "white",
                  fontSize: "16px",
                  textAlign: "center",
                  py: 3,
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "white",
                  fontSize: "16px",
                  textAlign: "center",
                  py: 3,
                }}
              >
                Amount
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                    transform: "translateY(-1px)",
                    transition: "all 0.2s ease",
                  },
                  background: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                  transition: "all 0.2s ease",
                }}
              >
                <TableCell
                  sx={{
                    textAlign: "center",
                    py: 2.5,
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    sx={{ fontSize: "15px" }}
                  >
                    {row.month
                      ? dayjs(row.month, "YYYY-MM").format("MMM YYYY")
                      : "N/A"}
                  </Typography>
                </TableCell>

                <TableCell
                  sx={{
                    textAlign: "center",
                    py: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <CalendarToday
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ fontSize: "15px" }}
                    >
                      {row.date}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell
                  sx={{
                    textAlign: "center",
                    py: 2.5,
                  }}
                >
                  <Chip
                    icon={row.paid ? <CheckCircle /> : <Cancel />}
                    label={row.paid ? "Paid" : "Unpaid"}
                    color={row.paid ? "success" : "error"}
                    size="medium"
                    variant="filled"
                    sx={{
                      fontWeight: 600,
                      fontSize: "14px",
                      px: 1,
                      minWidth: 100,
                    }}
                  />
                </TableCell>

                <TableCell
                  sx={{
                    textAlign: "center",
                    py: 2.5,
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    sx={{
                      fontSize: "15px",
                      color: row.paid ? "success.main" : "text.secondary",
                    }}
                  >
                    {currencyFormatter.format(row.amount)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
            <TableRow
              sx={{
                background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                borderTop: "2px solid #cbd5e1",
              }}
            >
              <TableCell sx={{ py: 2.5, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ color: "text.secondary" }}
                ></Typography>
              </TableCell>
              <TableCell sx={{ py: 2.5, textAlign: "center" }}>
                {/* Empty - matches Date column */}
              </TableCell>
              <TableCell sx={{ py: 2.5, textAlign: "center" }}>
                <Typography
                  variant="body1"
                  fontWeight={700}
                  sx={{
                    fontSize: "16px",
                    color: "text.primary",
                  }}
                >
                  Total Paid:
                </Typography>
              </TableCell>
              <TableCell sx={{ py: 2.5, textAlign: "center" }}>
                <Typography
                  variant="body1"
                  fontWeight={700}
                  sx={{
                    fontSize: "16px",
                    color: "success.main",
                  }}
                >
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
      paidOn: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
        PropTypes.shape({
          _seconds: PropTypes.number,
          _nanoseconds: PropTypes.number,
        }),
      ]),
      month: PropTypes.string,
    })
  ).isRequired,
};

export default PaymentHistoryTable;
