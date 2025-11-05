import React from "react";

const DetailItem = ({
  icon: Icon,
  label,
  value,
  isHighlighted = false,
  delay = 0,
}) => (
  <div
    className={`detail-item premium ${isHighlighted ? "highlighted" : ""}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="item-glow"></div>
    <div className="detail-label">
      {Icon && (
        <div className="detail-icon-wrapper">
          <Icon className="detail-icon" />
        </div>
      )}
      <span>{label}</span>
    </div>
    <div className="detail-value">{value}</div>
    <div className="detail-shine"></div>
  </div>
);

export default DetailItem;