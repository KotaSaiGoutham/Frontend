import React, { useState, useEffect, useMemo } from "react";
import { FaMoneyBillWave, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { format, subMonths } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllPayments } from "../../redux/actions";

const StudentPayments = ({ students }) => {
  const dispatch = useDispatch();
  
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(format(today, 'yyyy-MM'));

  useEffect(() => {
    dispatch(fetchAllPayments());
  }, [dispatch]);

  const monthsToDisplay = useMemo(() => {
    return [subMonths(today, 2), subMonths(today, 1), today];
  }, [today]);

  const { allPayments } = useSelector((state) => state.expenditures);
  
  const filteredStudents = useMemo(() => {
    if (!students || !allPayments || allPayments.length === 0) return [];

    const paymentsMap = new Map(
      allPayments
        .filter(payment => payment.month === selectedMonth)
        .map(payment => [payment.studentId, payment])
    );
    
    const processedStudents = students.map(student => {
      const paymentData = paymentsMap.get(student.id);

      const isPaid = !!paymentData;

      return {
        ...student,
        isPaid,
        paymentStatus: isPaid ? "Paid" : "Pending",
        paidDate: isPaid ? paymentData.paidOn : null,
      };
    });

    return processedStudents;
  }, [allPayments, students, selectedMonth]);

  const paidCount = filteredStudents.filter(student => student.isPaid).length;
  const pendingCount = filteredStudents.filter(student => !student.isPaid).length;

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          color: "#2c3e50",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center",marginBottom:15 }}>
          <FaMoneyBillWave style={{ fontSize: "2rem", marginRight: "1rem", color: "#27ae60" }} />
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700, margin: 0 }}>Student Payments</h2>
        </div>
        {/* ✅ The monthly navigation buttons are now inside this flex container */}
        <div className="month-navigation">
          {monthsToDisplay.map(monthDate => {
            const monthKey = format(monthDate, 'yyyy-MM');
            const isSelected = monthKey === selectedMonth;
            return (
              <button
                key={monthKey}
                onClick={() => setSelectedMonth(monthKey)}
                className={`month-button ${isSelected ? 'selected' : ''}`}
              >
                {format(monthDate, 'MMM')}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* The badges can stay below the main title/nav area */}
      <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <MetricBadge icon={<FaCheckCircle />} label="Paid" count={paidCount} color="#27ae60" />
        <MetricBadge icon={<FaExclamationCircle />} label="Pending" count={pendingCount} color="#e74c3c" />
      </div>

      <div style={{ flexGrow: 1, overflowY: "auto", maxHeight: "300px" }}>
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
                transition: "background-color 0.2s ease, transform 0.2s ease",
              }}
              whileHover={{ backgroundColor: "#fafafa", transform: "translateX(5px)" }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 500, color: "#34495e" }}>{student.Name}</span>
                {student.paidDate && (
                  <span style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>
                    Paid on: {format(new Date(student.paidDate._seconds * 1000), 'dd MMM yyyy')}
                  </span>
                )}
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
          <p style={{ textAlign: "center", color: "#7f8c8d", fontStyle: "italic", padding: "2rem" }}>
            No student payment data for this month.
          </p>
        )}
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
    <span style={{ marginRight: "8px", display: "flex", alignItems: "center", fontSize: "1rem" }}>
      {icon}
    </span>
    <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>{count}</span>
    <span style={{ marginLeft: "6px", fontWeight: 500 }}>{label}</span>
  </p>
);

export default StudentPayments;