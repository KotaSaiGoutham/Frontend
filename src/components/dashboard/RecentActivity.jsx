import React from "react";
import { FaHistory, FaCheckCircle, FaUserGraduate } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

const RecentActivity = ({ activities }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
      className="dashboard-card"
      style={{
        gridColumn: "2 / 3",
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
        <FaHistory style={{ fontSize: "2rem", marginRight: "1rem", color: "#e67e22" }} />
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700, margin: 0 }}>Recent Activity</h2>
      </div>
      <div style={{ flexGrow: 1, overflowY: "auto", maxHeight: "900px" }}>
        {activities?.length > 0 ? (
          activities.slice(0, 7).map((activity, index) => (
            <motion.div
              key={activity.id || index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                padding: "1.2rem 1rem",
                borderBottom: "1px solid #e9ecef",
                transition: "background-color 0.2s ease",
              }}
              whileHover={{ backgroundColor: "#fafafa" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
            >
              <span
                style={{
                  fontSize: "1.8rem",
                  marginRight: "1.5rem",
                  color: activity.type === "class_completed" ? "#3498db" : "#27ae60",
                }}
              >
                {activity.type === "class_completed" ? <FaUserGraduate /> : <FaCheckCircle />}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 500, color: "#34495e" }}>
                  {activity.message}
                </p>
                <span style={{ fontSize: "0.85rem", color: "#95a5a6", marginTop: "0.2rem" }}>
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#7f8c8d", fontStyle: "italic", padding: "2rem" }}>
            No recent activity.
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default RecentActivity;