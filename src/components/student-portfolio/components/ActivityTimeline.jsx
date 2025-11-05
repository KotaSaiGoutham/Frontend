import React from "react";
import {
  FaChalkboardTeacher,
  FaMoneyBillAlt,
  FaClipboardList,
  FaAward
} from "react-icons/fa";

const ActivityTimeline = () => {
  const activities = [
    {
      type: "class",
      label: "Mathematics Class Completed",
      time: "2 hours ago",
      icon: FaChalkboardTeacher,
    },
    {
      type: "payment",
      label: "Monthly Fee Received",
      time: "1 day ago",
      icon: FaMoneyBillAlt,
    },
    {
      type: "exam",
      label: "Weekly Test - 85% Score",
      time: "2 days ago",
      icon: FaClipboardList,
    },
    {
      type: "achievement",
      label: "Top Performer of the Week",
      time: "3 days ago",
      icon: FaAward,
    },
  ];

  return (
    <div className="activity-timeline premium">
      {activities.map((activity, index) => (
        <div
          key={index}
          className="timeline-item premium"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="timeline-glow"></div>
          <div className={`timeline-dot premium ${activity.type}`}>
            <activity.icon />
            <div className="dot-shine"></div>
          </div>
          <div className="timeline-content">
            <p className="timeline-text">{activity.label}</p>
            <span className="timeline-time">{activity.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;