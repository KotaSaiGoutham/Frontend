import React from "react";

const StatCard = ({
  icon: Icon,
  label,
  value,
  trend,
  color = "blue",
  delay = 0,
}) => (
  <div
    className={`stat-card premium stat-card-${color}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="stat-glow"></div>
    <div className="stat-icon">
      <Icon />
      <div className="stat-shine"></div>
    </div>
    <div className="stat-content">
      <h3>{value}</h3>
      <p>{label}</p>
      {trend && <span className="stat-trend">{trend}</span>}
    </div>
    <div className="stat-wave"></div>
  </div>
);

export default StatCard;