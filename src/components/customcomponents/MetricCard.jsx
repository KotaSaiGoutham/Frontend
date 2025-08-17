import React from "react";

const MetricCard = ({
  label,
  value,
  gradient,
  textColor = "#1f2937",
  percentage = null,
}) => {
  const cardStyle = {
    background: gradient,
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "160px",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    cursor: "pointer",
    position: "relative",
  };

  const labelStyle = {
    fontSize: "15px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "6px",
  };

  const valueWrapper = {
    display: "flex",
    alignItems: "flex-start",
    gap: "4px",
  };

  const rupeeStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#374151",
    opacity: 0.9,
    transform: "translateY(4px)", // lifts above baseline
    background: "linear-gradient(45deg,#2563eb,#1e3a8a)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const valueStyle = {
    fontSize: "34px",
    fontWeight: "bold",
    color: textColor,
    lineHeight: 1.1,
  };

  const getPercentageColor = (p) => (p > 0 ? "#059669" : "#dc2626");
  const getPercentageBg = (p) =>
    p > 0 ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)";

  const percentageStyle =
    percentage !== null
      ? {
          fontSize: "13px",
          fontWeight: "600",
          color: getPercentageColor(percentage),
          background: getPercentageBg(percentage),
          padding: "4px 10px",
          borderRadius: "10px",
          alignSelf: "flex-end", // bottom-right alignment
          marginTop: "8px",
        }
      : { display: "none" };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = "translateY(-5px) scale(1.02)";
    e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0) scale(1)";
    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <p style={labelStyle}>{label}</p>

      <div style={valueWrapper}>
        <span style={rupeeStyle}>₹</span>
        <span style={valueStyle}>
          {value.toLocaleString("en-IN")}
        </span>
      </div>

      {percentage !== null && (
        <span style={percentageStyle}>
          {percentage > 0
            ? `+${percentage.toFixed(0)}% vs last month`
            : `${percentage.toFixed(0)}% vs last month`}
        </span>
      )}
    </div>
  );
};

export default MetricCard;
