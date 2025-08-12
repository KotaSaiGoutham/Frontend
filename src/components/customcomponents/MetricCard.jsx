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
    marginBottom: percentage ? "4px" : "0",
  };

  const percentageStyle = {
    fontSize: "13px",
    fontWeight: "500",
    color: percentage > 0 ? "#15803d" : "#b91c1c",
    background: percentage > 0 ? "rgba(187, 247, 208, 0.6)" : "rgba(254, 202, 202, 0.6)",
    padding: "3px 8px",
    borderRadius: "10px",
    display: "inline-block",
  };

  const iconWrapper = {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "rgba(255,255,255,0.5)",
    borderRadius: "50%",
    padding: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    color: textColor,
    backdropFilter: "blur(4px)",
  };

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
      {icon && <div style={iconWrapper}>{icon}</div>}
      <p style={labelStyle}>{label}</p>
      <p style={valueStyle}>₹{value.toLocaleString("en-IN")}</p>
      {percentage !== null && (
        <span style={percentageStyle}>
          {percentage > 0 ? `+${percentage}%` : `${percentage}%`}
        </span>
      )}
    </div>
  );
};

export default MetricCard;
