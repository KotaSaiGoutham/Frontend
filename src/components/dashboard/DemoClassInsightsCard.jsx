import React from 'react';
import { FaBookOpen, FaCheckCircle, FaClock, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DemoClassInsightsCard = ({ demoMetrics, filteredDemoClasses }) => {
  return (
    <motion.div
      className="dashboard-card demo-classes-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
      style={{
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
          alignItems: "center",
          marginBottom: "2rem",
          color: "#2c3e50",
        }}
      >
        <FaBookOpen style={{ fontSize: "2rem", marginRight: "1rem", color: "#3498db" }} />
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700, margin: 0 }}>Demo Class Insights</h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.5rem",
          marginBottom: "2.5rem",
        }}
      >
        <MetricItem icon={<FaCheckCircle style={{ color: "#2ecc71" }} />} label="Success" count={demoMetrics.successCount} />
        <MetricItem icon={<FaClock style={{ color: "#f39c12" }} />} label="Scheduled" count={demoMetrics.scheduledCount} />
        <MetricItem icon={<FaHourglassHalf style={{ color: "#95a5a6" }} />} label="Pending" count={demoMetrics.pendingCount} />
        <MetricItem icon={<FaTimesCircle style={{ color: "#e74c3c" }} />} label="Failure" count={demoMetrics.failureCount} />
      </div>

      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontSize: "1.4rem", fontWeight: 600, color: "#34495e", marginBottom: "1.5rem" }}>Recent Demos</h3>
        <div style={{ overflowY: "auto", flexGrow: 1 }}>
          {filteredDemoClasses?.length > 0 ? (
            filteredDemoClasses.slice(0, 5).map((demo, index) => (
              <motion.div
                key={demo.id || index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem 1.2rem",
                  marginBottom: "0.8rem",
                  borderRadius: "10px",
                  backgroundColor: "#f8f9fa",
                  borderLeft: `4px solid ${getStatusColor(demo.status)}`,
                  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  cursor: "pointer",
                }}
                whileHover={{ transform: "translateX(5px)", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
              >
                <p style={{ margin: 0, fontWeight: 500, color: "#34495e" }}>{demo.studentName}</p>
                <span
                  style={{
                    padding: "0.4rem 1rem",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#fff",
                    backgroundColor: getStatusColor(demo.status),
                  }}
                >
                  {demo.status}
                </span>
              </motion.div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#7f8c8d", fontStyle: "italic", paddingTop: "2rem" }}>No recent demos.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'success':
      return '#2ecc71';
    case 'scheduled':
      return '#f39c12';
    case 'pending':
      return '#95a5a6';
    case 'failure':
      return '#e74c3c';
    default:
      return '#bdc3c7';
  }
};

const MetricItem = ({ icon, label, count }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      padding: "1rem",
      backgroundColor: "#f4f6f9",
      borderRadius: "10px",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
    }}
  >
    <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>{icon}</div>
    <p style={{ margin: 0, fontSize: "1rem", color: "#555", fontWeight: 500 }}>{label}</p>
    <span style={{ fontSize: "1.8rem", fontWeight: 700, color: "#34495e" }}>{count}</span>
  </div>
);

export default DemoClassInsightsCard;