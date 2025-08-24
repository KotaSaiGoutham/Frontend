import React from "react";
import { FaMoneyBillWave, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const StudentPayments = ({ students }) => {
  const paidCount = students.filter((student) => student.isPaid).length;
  const pendingCount = students.filter((student) => !student.isPaid).length;

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
          marginBottom: "2rem",
          color: "#2c3e50",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <FaMoneyBillWave style={{ fontSize: "2rem", marginRight: "1rem", color: "#27ae60" }} />
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700, margin: 0 }}>Student Payments</h2>
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <MetricBadge icon={<FaCheckCircle />} label="Paid" count={paidCount} color="#27ae60" />
          <MetricBadge icon={<FaExclamationCircle />} label="Pending" count={pendingCount} color="#e74c3c" />
        </div>
      </div>
      <div style={{ flexGrow: 1, overflowY: "auto", maxHeight: "300px" }}>
        {students?.length > 0 ? (
          students.map((student, index) => (
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
              <span style={{ fontWeight: 500, color: "#34495e" }}>{student.Name}</span>
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
            No student payment data.
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