import React from "react";

const MetricCard = ({
  label,
  value,
  gradient,
  textColor = "#1f2937",
  icon = null,
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
    overflow: "hidden",
    backdropFilter: "blur(4px)",
  };

  const labelStyle = {
    fontSize: "15px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "6px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const valueStyle = {
    fontSize: "30px",
    fontWeight: "bold",
    color: textColor,
    marginBottom: percentage !== null ? "4px" : "0",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  };

  const getPercentageColor = (p) => (p > 0 ? "#065f46" : "#b91c1c"); // darker green
  const getPercentageBg = (p) =>
    p > 0 ? "rgba(187, 247, 208, 0.6)" : "rgba(254, 202, 202, 0.6)";

  const percentageStyle =
    percentage !== null
      ? {
          fontSize: "13px",
          fontWeight: "600",
          color: getPercentageColor(percentage),
          background: getPercentageBg(percentage),
          padding: "3px 8px",
          borderRadius: "10px",
          display: "inline-block",
        }
      : value
      ? {
          fontSize: "13px",
          fontWeight: "500",
          color: "#4b5563", // neutral gray
          background: "rgba(243, 244, 246, 0.8)", // light gray bg
          padding: "3px 8px",
          borderRadius: "10px",
          display: "inline-block",
        }
      : { display: "none" }; // hide if no value

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={labelStyle}>{label}</p>
      <span style={percentageStyle}>
  {percentage !== null && (
    percentage > 0
      ? `with previous month +${percentage.toFixed(0)}%`
      : `with previous month ${percentage.toFixed(0)}%`
  )}
</span>

      </div>
      <p style={valueStyle}>₹{value.toLocaleString("en-IN")}</p>
    </div>
  );
};

export default MetricCard;
