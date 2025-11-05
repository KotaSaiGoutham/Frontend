import React from "react";

const DetailCard = ({
  title,
  icon: Icon,
  children,
  className = "",
  delay = 0,
}) => (
  <div
    className={`detail-card premium ${className}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="card-glow"></div>
    <div className="detail-card-header">
      <div className="header-icon-wrapper">
        <Icon className="detail-card-icon" />
        <div className="icon-shine"></div>
      </div>
      <h3>{title}</h3>
      <div className="card-sparkles">
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
      </div>
    </div>
    <div className="detail-card-content">{children}</div>
  </div>
);

export default DetailCard;