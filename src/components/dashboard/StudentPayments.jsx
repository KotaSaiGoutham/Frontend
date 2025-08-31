import React, { useState, useEffect, useMemo } from "react";
import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { format, subMonths } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllPayments } from "../../redux/actions";
import { Link } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

const StudentPayments = ({ students }) => {
  const dispatch = useDispatch();

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(format(today, "yyyy-MM"));

  useEffect(() => {
    dispatch(fetchAllPayments());
  }, [dispatch]);

  const monthsToDisplay = useMemo(() => {
    return [subMonths(today, 2), subMonths(today, 1), today];
  }, [today]);

  const { allPayments } = useSelector((state) => state.expenditures);

  const {
    filteredStudents,
    paidCount,
    pendingCount,
    totalPaidFee,
    totalPendingFee,
  } = useMemo(() => {
    if (!students || !allPayments) {
      return {
        filteredStudents: [],
        paidCount: 0,
        pendingCount: 0,
        totalPaidFee: 0,
        totalPendingFee: 0,
      };
    }

    const paymentsMap = new Map(
      allPayments
        .filter((payment) => payment.month === selectedMonth)
        .map((payment) => [payment.studentId, payment])
    );

    let paidStudents = [];
    let pendingStudents = [];
    let totalPaidFee = 0;
    let totalPendingFee = 0;

    students.forEach((student) => {
      const paymentData = paymentsMap.get(student.id);
      const isPaid = !!paymentData;

      const processedStudent = {
        ...student,
        isPaid,
        paymentStatus: isPaid ? "Paid" : "Pending",
        paidDate: isPaid ? paymentData.paidOn : null,
      };

      if (isPaid) {
        paidStudents.push(processedStudent);
        totalPaidFee += student.monthlyFee || student["Monthly Fee"] || 0;
      } else {
        pendingStudents.push(processedStudent);
        totalPendingFee += student.monthlyFee || student["Monthly Fee"] || 0;
      }
    });

    const allFilteredStudents = [...paidStudents, ...pendingStudents];

    return {
      filteredStudents: allFilteredStudents,
      paidCount: paidStudents.length,
      pendingCount: pendingStudents.length,
      totalPaidFee,
      totalPendingFee,
    };
  }, [allPayments, students, selectedMonth]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
      className="dashboard-card"
      style={{
        gridColumn: "1 / 2",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "2.5rem",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Reorganized the top section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "1rem",
          color: "#2c3e50",
        }}
      >
        <FaMoneyBillWave
          style={{ fontSize: "2rem", marginRight: "1rem", color: "#27ae60" }}
        />
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700, margin: 0 }}>
          Student Payments
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {/* Month navigation buttons */}
        <div className="month-navigation">
          {monthsToDisplay.map((monthDate) => {
            const monthKey = format(monthDate, "yyyy-MM");
            const isSelected = monthKey === selectedMonth;
            return (
              <button
                key={monthKey}
                onClick={() => setSelectedMonth(monthKey)}
                className={`month-button ${isSelected ? "selected" : ""}`}
              >
                {format(monthDate, "MMM")}
              </button>
            );
          })}
        </div>

        {/* The badges are now grouped together */}
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <MetricBadge
            icon={<FaCheckCircle />}
            label="Paid"
            count={paidCount}
            color="#27ae60"
          />
          <MetricBadge
            icon={<FaExclamationCircle />}
            label="Pending"
            count={pendingCount}
            color="#e74c3c"
          />
        </div>
      </div>
      <div style={{ flexGrow: 1, overflowY: "auto", maxHeight: "500px" }}>
        {filteredStudents?.length > 0 ? (
          filteredStudents.map((student, index) => (
            <motion.div
              key={student.id || index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 1.2rem",
                borderBottom: "1px solid #e9ecef",
                cursor: "pointer",
              }}
              whileHover={{
                backgroundColor: "#fafafa",
              }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
     <Tooltip title={`Click to view details for ${student.Name}`}>
                  <Link
                    to={`/student/${student.id}`}
                    state={{ studentData: student }}
                    style={{
                      fontWeight: 500,
                      color: "#34495e",
                      textDecoration: "none",
                      transition: "color 0.2s ease, text-decoration 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#2980b9";
                      e.currentTarget.style.textDecoration = "underline";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#34495e";
                      e.currentTarget.style.textDecoration = "none";
                    }}
                  >
                    {student.Name}
                  </Link>
                </Tooltip>
                {student.paidDate && (
                  <span style={{ fontSize: "0.8rem", color: "#7f8c8d" }}>
                    Paid on:{" "}
                    {format(
                      new Date(student.paidDate._seconds * 1000),
                      "dd MMM yyyy"
                    )}
                  </span>
                )}
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "#555",
                    marginTop: "0.25rem",
                  }}
                >
                  Fee: ₹
                  {(
                    student.monthlyFee ||
                    student["Monthly Fee"] ||
                    0
                  ).toLocaleString()}
                </span>
              </div>
              <strong
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  backgroundColor: student.isPaid ? "#eaf7ee" : "#fef4f4",
                  color: student.isPaid ? "#27ae60" : "#e74c3c",
                  border: `1px solid ${student.isPaid ? "#27ae60" : "#e74c3c"}`,
                }}
              >
                {student.paymentStatus}
              </strong>
            </motion.div>
          ))
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "#7f8c8d",
              fontStyle: "italic",
              padding: "2rem",
            }}
          >
            No student payment data for this month.
          </p>
        )}
      </div>

      <div
        style={{
          borderTop: "2px solid #ecf0f1",
          marginTop: "1.5rem",
          paddingTop: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{ fontWeight: 600, color: "#34495e", fontSize: "1.1rem" }}
          >
            Total Paid Fees:
          </span>
          <span
            style={{ fontWeight: 700, color: "#27ae60", fontSize: "1.2rem" }}
          >
            ₹{totalPaidFee.toLocaleString()}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{ fontWeight: 600, color: "#34495e", fontSize: "1.1rem" }}
          >
            Total Pending Fees:
          </span>
          <span
            style={{ fontWeight: 700, color: "#e74c3c", fontSize: "1.2rem" }}
          >
            ₹{totalPendingFee.toLocaleString()}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{ fontWeight: 600, color: "#34495e", fontSize: "1.1rem" }}
          >
            Total Monthly Fees:
          </span>
          <span
            style={{ fontWeight: 700, color: "#2c3e50", fontSize: "1.2rem" }}
          >
            ₹{(totalPaidFee + totalPendingFee).toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const MetricBadge = ({ icon, label, count, color }) => (
  <p
    style={{
      display: "flex",
      alignItems: "center",
      margin: 0,
      fontWeight: 600,
      color: color,
      padding: "8px 16px",
      borderRadius: "20px",
      backgroundColor: color === "#27ae60" ? "#eaf7ee" : "#fef4f4",
      border: `1px solid ${color}`,
      transition: "background-color 0.2s ease",
    }}
  >
    <span
      style={{
        marginRight: "8px",
        display: "flex",
        alignItems: "center",
        fontSize: "1rem",
      }}
    >
      {icon}
    </span>
    <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>{count}</span>
    <span style={{ marginLeft: "6px", fontWeight: 500 }}>{label}</span>
  </p>
);

export default StudentPayments;
