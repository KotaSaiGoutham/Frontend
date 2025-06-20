import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, parse, parseISO, isSameDay } from "date-fns"; // Changed from parseISO to parse
import {
  FaCalendarAlt,
  FaBookOpen,
  FaUser,
  FaClock,
  FaHome,
  FaPlusCircle,
  FaFilter,
} from "react-icons/fa"; // Added FaPlusCircle
import "./TimetablePage.css";

const TimetablePage = () => {
  const [timetable, setTimetable] = useState([]);
  // Stores ALL upcoming timetable entries after initial fetch
  const [allUpcomingClasses, setAllUpcomingClasses] = useState([]);
  // State for the date filter input, initialized to today's date (YYYY-MM-DD)
  const [filterDate, setFilterDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const currentDate = new Date();
  // --- EFFECT TO FETCH ALL UPCOMING TIMETABLE DATA ---
  useEffect(() => {
    const fetchAllTimetableData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const timetableResponse = await fetch(
          "http://localhost:5000/api/data/timetable",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!timetableResponse.ok) {
          const errorData = await timetableResponse.json();
          throw new Error(errorData.message || "Failed to fetch timetable.");
        }

        const rawTimetableData = await timetableResponse.json();

        const mappedTimetable = rawTimetableData.map((item) => {
          const timeValue = item.Time || "";
          const timePart = timeValue.split("to")[0]?.trim();

          let parsedDateTime;
          if (item.Day && timePart) {
            const combinedDateTimeString = `${item.Day} ${timePart}`;
            parsedDateTime = parse(
              combinedDateTimeString,
              "dd/MM/yyyy hh:mma",
              new Date()
            );
          } else if (item.Day) {
            parsedDateTime = parse(item.Day, "dd/MM/yyyy", new Date());
          } else {
            parsedDateTime = new Date(NaN);
          }

          return {
            id: item.id,
            subject: item.Subject,
            facultyName: item.Faculty,
            dateTimeObject: parsedDateTime,
            dayString: item.Day,
            timeString: item.Time,
            topic: item.Topic,
          };
        });

        // Filter out entries where date parsing failed (dateTimeObject is an Invalid Date)
        const validTimetableEntries = mappedTimetable.filter(
          (item) => item.dateTimeObject && !isNaN(item.dateTimeObject)
        );

        // Filter for ALL upcoming classes (today or future) to store them for later filtering
        const futureAndTodayClasses = validTimetableEntries
          .filter((item) => item.dateTimeObject >= new Date())
          .sort(
            (a, b) => a.dateTimeObject.getTime() - b.dateTimeObject.getTime()
          );

        setAllUpcomingClasses(futureAndTodayClasses); // Store all valid upcoming classes
        
      } catch (err) {
        console.error("Error fetching timetable data:", err);
        setError(err.message || "Failed to load timetable data.");
        if (
          err.message.includes("Token") ||
          err.message.includes("Denied") ||
          err.message.includes("authorized")
        ) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllTimetableData();
  }, [navigate]); // Only runs on component mount or if navigate changes

  // --- EFFECT TO FILTER TIMETABLE BASED ON SELECTED DATE ---
  useEffect(() => {
    if (allUpcomingClasses.length > 0 || !isLoading) {
      // Ensure data is loaded or there's no data
      const selectedDateObject = parse(filterDate, "yyyy-MM-dd", new Date());

      const filteredClasses = allUpcomingClasses
        .filter((classItem) =>
          isSameDay(classItem.dateTimeObject, selectedDateObject)
        )
        .sort(
          (a, b) => a.dateTimeObject.getTime() - b.dateTimeObject.getTime()
        );
      setTimetable(filteredClasses);
    }
  }, [filterDate, allUpcomingClasses, isLoading]); // Re-run when filterDate or allUpcomingClasses change

  const handleFilterDateChange = (e) => {
    setFilterDate(e.target.value);
  };

  const handleGoHome = () => {
    navigate("/dashboard");
  };

  const handleCreateTimetable = () => {
    navigate("/add-timetable"); // Redirect to the new page
  };

  if (isLoading) {
    return (
      <div className="timetable-loading-message">
        <div className="spinner"></div>
        Loading Timetable...
      </div>
    );
  }

  if (error) {
    return (
      <div className="timetable-error-message">
        <h3>Error: {error}</h3>
        <button
          onClick={() => window.location.reload()}
          className="timetable-retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="timetable-page-container">
      {/* Main Header Card - Added Create Timetable Button */}
   <div className="main-header-card">
    <div className="header-left">
        <h1 className="header-title">
            <FaCalendarAlt className="header-icon" /> Timetable
        </h1>
        <p className="header-subtitle">
            View schedule for{" "}
            <span className="current-date">
                {format(currentDate, "EEEE, MMMM dd, h:mm a")}
            </span>
        </p>
    </div>
    <div
        className="header-right"
        style={{
            display: "flex",
            // Change justifyContent to 'center' or 'flex-end' if you want it all on the right
            justifyContent: "center", // This will center the combined button and filter
            alignItems: "center",     // Vertically aligns them in the middle
            // Remove width: "100%" if you want the content to dictate the width
            // If you keep width: "100%", the content will be centered within that 100% width.
            // If you want it more like aligned with the left section's right edge,
            // you might need to adjust the parent .main-header-card's display properties.
            gap: "20px",              // Adds space between the two elements
            // Consider if this div should take full width or be content-sized when centered
            // For now, let's assume you want the content block centered.
            // If you want it on the right side of the main-header-card but centered within header-right:
            // If main-header-card is flex and header-right is flex-grow: 1, then
            // this `justifyContent: "center"` would center it within the remaining space.
            // If you specifically want it aligned to the right of `main-header-card`, use `justifyContent: "flex-end"`
            // on `main-header-card` or make `header-right` take up available space and align its content.
          }}
    >
        {/* "Create Timetable" button - REMAINS FIRST IN ORDER */}
        <button
            onClick={handleCreateTimetable}
            className="add-employee-button-timetable"
        >
            <FaPlusCircle /> Create Timetable
        </button>

        {/* Date Filter Input - REMAINS SECOND IN ORDER */}
        <div
            className="add-student-form-group"
            style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
            }}
        >
            <label htmlFor="dateFilter" style={{ whiteSpace: "nowrap" }}>
                <FaFilter className="filter-icon" /> Filter by Date:
            </label>
            <input
                type="date"
                id="dateFilter"
                value={filterDate}
                onChange={handleFilterDateChange}
                className="date-filter-input"
                min={format(new Date(), "yyyy-MM-dd")}
                style={{
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                }}
            />
        </div>
    </div>
</div>

      <div className="timetable-content-card">
        {timetable.length > 0 ? (
          <div className="timetable-grid">
            {timetable.map((classItem) => (
              <div key={classItem.id} className="timetable-item card-animation">
                <div className="timetable-item-header">
                  <FaBookOpen className="subject-icon" />
                  {/* Subject should be here as per "subject down" from Faculty */}
                  <h3>{classItem.subject}</h3>
                </div>
                <div className="timetable-details">
                  {/* Faculty Name (Now at the top of details) */}
                  <p>
                    <FaUser className="detail-icon" />
                    <span>Faculty:</span> {classItem.facultyName}
                  </p>
                  {/* Date */}
                  <p>
                    <FaCalendarAlt className="detail-icon" />
                    <span>Date:</span>{" "}
                    {format(classItem.dateTimeObject, "EEEE, MMM dd")}
                  </p>
                  {/* Time */}
                  <p>
                    <FaClock className="detail-icon" />
                    <span>Time:</span> {classItem.timeString}
                  </p>
                  {/* NEW: Topic */}
                  <p>
                    <FaBookOpen className="detail-icon" />
                    <span>Topic:</span> {classItem.topic}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-classes-message">
            No upcoming classes scheduled. Click "Create Timetable" to add some!
          </p>
        )}
      </div>
    </div>
  );
};

export default TimetablePage;
