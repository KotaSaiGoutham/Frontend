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
} from "@mui/material";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const PaymentHistoryTable = ({ payments = [] }) => {
  /* Build rows + calculate total paid from actual 'amount' */
  const { rows, totalPaid } = useMemo(() => {
    let total = 0;

    const rows = payments
      .map((p) => {
        // --- FIX 1: Use 'paidOn' as the date field ---
        const jsDate = p.paidOn; 
        if (!jsDate) return null; // skip malformed

        // All records you provided have an 'amount', so we treat them as Paid for this table.
        // If you need a proper status, your API should return a 'status' or 'isPaid' flag.
        // Based on your data structure, we assume a record existing here means a payment was made.
        const paid = p.amount > 0;
        
        // --- FIX 2: Calculate total Paid from actual 'amount' field ---
        const amount = p.amount || 0;
        if (paid) total += amount;

        return {
          id: p.id,
          // Format the 'paidOn' date
          date: dayjs(jsDate).format("DD MMM YYYY"),
          // Include the actual month for clarity (optional, but helpful)
          month: p.month,
          paid,
          amount: amount,
        };
      })
      .filter(Boolean);
      
    // NOTE: We don't re-sort here. The component now assumes the 'payments' array
    // is already sorted by the API in DESCENDING order (newest first).
    // If you need to re-sort to oldest-first, change the sort logic to:
    // .sort((a, b) => new Date(a.date) - new Date(b.date)); 
    // but DESCENDING is usually better for history.

    return { rows, totalPaid: total };
  }, [payments]);

  // Use a number formatter for better currency display
  const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (!rows.length) {
    return (
      <Box sx={{ p: 2, textAlign: "center", color: "#757575" }}>
        No payment history available.
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{
        borderRadius: 2,
        boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
        mt: 2,
      }}
    >
      <Table aria-label="payment history table">
        {/* ───────── header ───────── */}
        <TableHead
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            backgroundColor: "#e3f2fd",
          }}
        >
          <TableRow
            sx={{
              borderBottom: "2px solid #1976d2",
              backgroundColor: "#f5faff",
            }}
          >
            <TableCell sx={{ fontWeight: "bold", color: "#1a237e", fontSize: "1.05rem", padding: "12px 8px" }}>
              Month
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#1a237e", fontSize: "1.05rem", padding: "12px 8px" }}>
              Date Paid
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#1a237e", fontSize: "1.05rem", padding: "12px 8px" }}>
              Status
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold", color: "#1a237e", fontSize: "1.05rem", padding: "12px 8px" }}>
              Amount
            </TableCell>
          </TableRow>
        </TableHead>

        {/* ───────── body ───────── */}
        <TableBody>
          {rows.map((r, idx) => (
            <TableRow
              key={r.id}
              sx={{
                backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#fbfbfb",
                transition: "background-color 0.2s ease-in-out",
                "&:hover": { backgroundColor: "#e1f5fe" },
              }}
            >
              {/* Added Month Column */}
              <TableCell sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
                {dayjs(r.month, 'YYYY-MM').format('MMM YYYY')}
              </TableCell>

              <TableCell sx={{ fontSize: "0.95rem" }}>{r.date}</TableCell>

              <TableCell
                sx={{
                  fontSize: "0.95rem",
                  color: r.paid ? "success.main" : "error.main",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <FaCheckCircle style={{ fontSize: 16, color: '#4CAF50' }} />
                Paid
              </TableCell>

              <TableCell
                align="right"
                sx={{ fontSize: "0.95rem", fontWeight: 500 }}
              >
                {currencyFormatter.format(r.amount)}
              </TableCell>
            </TableRow>
          ))}

          {/* ───────── total row ───────── */}
          <TableRow>
            <TableCell
              colSpan={3} // Span is now 3 because we added a 'Month' column
              sx={{
                fontWeight: "bold",
                backgroundColor: "#e3f2fd",
                color: "#1a237e",
              }}
            >
              Total Paid
            </TableCell>
            <TableCell
              align="right"
              sx={{
                fontWeight: "bold",
                backgroundColor: "#e3f2fd",
                color: "#1a237e",
                fontSize: "1.05rem"
              }}
            >
              {currencyFormatter.format(totalPaid)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

PaymentHistoryTable.propTypes = {
  payments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      paidOn: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      month: PropTypes.string,
      // Add other relevant prop types if necessary
  })).isRequired,
  // Removed monthlyFee prop as it's not used to calculate total or amount
};

export default PaymentHistoryTable;