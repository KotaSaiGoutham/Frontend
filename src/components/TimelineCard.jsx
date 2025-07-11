// TimelineCard.jsx
import React from 'react';
import {
  FaClock,          // For the card title
  FaMoneyBillAlt,   // For "Monthly Fee Paid"
  FaBookOpen,       // For "Classes Completed Updated"
  FaClipboardList,  // For "Marks Added"
  FaInfoCircle      // Default/Generic
} from 'react-icons/fa';
import './TimelineCard.css'; // Import the CSS file

export const TimelineCard = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <section className="portfolio-card timeline-card delay-0">
        <h2>
          <FaClock className="card-icon" /> Recent Activity
        </h2>
        <p className="no-activity">No recent activity to display.</p>
      </section>
    );
  }

  // Helper function to get the appropriate icon component based on event label
  // We're using the label directly for specific matching based on your screenshot
  const getEventIcon = (label) => {
    if (label.includes("Fee Paid")) {
      return FaMoneyBillAlt;
    }
    if (label.includes("Classes Completed")) {
      return FaBookOpen;
    }
    if (label.includes("Marks Added")) {
      return FaClipboardList;
    }
    // Add more conditions here if you have other specific labels
    return FaInfoCircle; // Default generic icon
  };

  // Helper function for dynamic indicator colors (you can adjust these)
  const getIndicatorColor = (label) => {
    if (label.includes("Fee Paid")) {
      return '#28a745'; // Green for financial success
    }
    if (label.includes("Classes Completed")) {
      return '#007bff'; // Blue for progress
    }
    if (label.includes("Marks Added")) {
      return '#ffc107'; // Yellow/Orange for assessment
    }
    return '#6c757d'; // Default grey
  };

  return (
 <section className="portfolio-card timeline-card delay-0">
  <h2>
    <FaClock className="card-icon" /> Recent Activity
  </h2>
  <ul className="timeline-list">
    {events.map((event, i) => {
      const EventIcon = getEventIcon(event.label);
      const subHeading =
        event.type === "Marks"
          ? "📊 Weekly Marks"
          : event.type === "Class"
          ? "📅 Upcoming Class"
          : event.type === "Payment"
          ? "💰 Payment"
          : "🔔 Activity";

      const showTimestamp = event.type !== "Activity";

      return (
        <li
          key={i}
          className="timeline-item"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <span
            className="timeline-indicator"
            style={{ backgroundColor: getIndicatorColor(event.label) }}
          >
            <EventIcon className="timeline-event-icon" />
          </span>
          <div className="timeline-content">
            <div className="timeline-subheading">{subHeading}</div>
            <div className="timeline-text">
              {event.label}
              {showTimestamp && (
                <span className="timestamp-inline"> ({event.timestamp})</span>
              )}
            </div>
          </div>
        </li>
      );
    })}
  </ul>
</section>

  );
};