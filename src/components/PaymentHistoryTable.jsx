// PaymentHistoryTable.jsx  (drop this in src/components or similar)
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


const PaymentHistoryTable = ({ payments = [], monthlyFee = 0 }) => {
  /* Build rows + running total in one go */
  const { rows, totalPaid } = useMemo(() => {
    let total = 0;

    const rows = payments
      .map((p) => {
        const paid = p.status ? p.status === "Paid" : p.Paid === 1;
        const jsDate = (p.date || p.rawDate);
        if (!jsDate) return null; // skip malformed

        if (paid) total += monthlyFee;

        return {
          id: p.id || `${jsDate.getTime()}_${paid}`,
          date: dayjs(jsDate).format("DD MMM YYYY"),
          paid,
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return { rows, totalPaid: total };
  }, [payments, monthlyFee]);

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
            <TableCell
              sx={{
                fontWeight: "bold",
                color: "#1a237e",
                fontSize: "1.05rem",
                padding: "12px 8px",
              }}
            >
              Date
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                color: "#1a237e",
                fontSize: "1.05rem",
                padding: "12px 8px",
              }}
            >
              Status
            </TableCell>
            <TableCell
              align="right"
              sx={{
                fontWeight: "bold",
                color: "#1a237e",
                fontSize: "1.05rem",
                padding: "12px 8px",
              }}
            >
              Amount&nbsp;(₹)
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
                {r.paid ? (
                  <FaCheckCircle style={{ fontSize: 16 }} />
                ) : (
                  <FaTimesCircle style={{ fontSize: 16 }} />
                )}
                {r.paid ? "Paid" : "Unpaid"}
              </TableCell>

              <TableCell
                align="right"
                sx={{ fontSize: "0.95rem", fontWeight: r.paid ? 500 : 400 }}
              >
                {r.paid ? monthlyFee.toLocaleString() : "—"}
              </TableCell>
            </TableRow>
          ))}

          {/* ───────── total row ───────── */}
          <TableRow>
            <TableCell
              colSpan={2}
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
              }}
            >
              {totalPaid.toLocaleString()}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

PaymentHistoryTable.propTypes = {
  payments: PropTypes.arrayOf(PropTypes.object).isRequired,
  monthlyFee: PropTypes.number.isRequired,
};

export default PaymentHistoryTable;
