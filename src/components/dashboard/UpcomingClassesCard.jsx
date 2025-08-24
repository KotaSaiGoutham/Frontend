import React from 'react';
import { FaCalendarCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

const UpcomingClassesCard = ({ timetables }) => {
  const filteredTimetables = timetables?.filter(item => item.Day && item.Time) || [];

  return (
    <motion.div
      className="dashboard-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
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
        <FaCalendarCheck style={{ fontSize: "2rem", marginRight: "1rem", color: "#f1c40f" }} />
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700, margin: 0 }}>Upcoming Classes</h2>
      </div>

      <div style={{ flexGrow: 1, overflowY: "auto" }}>
        {filteredTimetables.length > 0 ? (
          filteredTimetables.slice(0, 5).map((cls, index) => (
            <motion.div
              key={cls.id || index}
              className="upcoming-class-item"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "1.2rem",
                borderBottom: "1px solid #e9ecef",
                transition: "background-color 0.2s ease, transform 0.2s ease",
                cursor: "pointer",
              }}
              whileHover={{ backgroundColor: "#fafafa", transform: "translateX(5px)" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "70px",
                  height: "70px",
                  borderRadius: "12px",
                  backgroundColor: "#ecf0f1",
                  marginRight: "2rem",
                  flexShrink: 0,
                }}
              >
                <p style={{ margin: 0, fontWeight: 700, fontSize: "1.2rem", color: "#34495e" }}>
                  {cls.Day.substring(0, 3)}
                </p>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#7f8c8d" }}>
                  {cls.Time.split(" to ")[0]}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: "1.1rem", color: "#34495e" }}>
                  {cls.Student}
                </p>
                <p style={{ margin: 0, fontSize: "0.95rem", color: "#7f8c8d", marginTop: "0.3rem" }}>
                  <span style={{ fontWeight: 500, color: "#95a5a6" }}>{cls.Subject}</span> - {cls.Topic || "No Topic"}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#7f8c8d", fontStyle: "italic", paddingTop: "2rem" }}>
            No upcoming classes scheduled.
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default UpcomingClassesCard;