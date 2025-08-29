import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaBookOpen,
  FaCalendarDay,
  FaCalendarAlt,
  FaCalendarWeek,
  FaHourglassHalf,
  FaCheckCircle,
} from "react-icons/fa";
import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";

const ClassesOverview = ({ students }) => {
  const classData = useMemo(() => {
    const data = {
      today: { total: 0, completed: 0, pending: 0 },
      thisWeek: { total: 0, completed: 0, pending: 0 },
      thisMonth: { total: 0, completed: 0, pending: 0 },
      dailyBreakdown: {
        Sunday: { total: 0, completed: 0, pending: 0 },
        Monday: { total: 0, completed: 0, pending: 0 },
        Tuesday: { total: 0, completed: 0, pending: 0 },
        Wednesday: { total: 0, completed: 0, pending: 0 },
        Thursday: { total: 0, completed: 0, pending: 0 },
        Friday: { total: 0, completed: 0, pending: 0 },
        Saturday: { total: 0, completed: 0, pending: 0 },
      },
    };

    const dayMap = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay()
    );
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // First, count all classes for each day of the week
    students.forEach((student) => {
      if (!student.isActive || !Array.isArray(student.classDateandTime)) return;

      student.classDateandTime.forEach((schedule) => {
        const [dayNameRaw, timeStr] = schedule.split("-");
        const dayName = dayNameRaw.trim();
        const targetDayIndex = dayMap[dayName];
        if (targetDayIndex === undefined) return;

        // Count this class for the daily breakdown
        data.dailyBreakdown[dayName].total += 1;
      });
    });

    // Now calculate actual classes for the current month
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // For each student, calculate their classes for the current month
    students.forEach((student) => {
      if (!student.isActive || !Array.isArray(student.classDateandTime)) return;

      student.classDateandTime.forEach((schedule) => {
        const [dayNameRaw, timeStr] = schedule.split("-");
        const dayName = dayNameRaw.trim();
        const targetDayIndex = dayMap[dayName];
        if (targetDayIndex === undefined) return;

        const [time, ampm] = timeStr.trim().split(/(?=[AP]M)/i);
        let [hours, minutes] = time.split(":").map(Number);
        if (ampm.toLowerCase() === "pm" && hours < 12) hours += 12;
        if (ampm.toLowerCase() === "am" && hours === 12) hours = 0;

        // Find all occurrences of this class day in the current month
        for (let day = 1; day <= endOfMonth.getDate(); day++) {
          const classDate = new Date(currentYear, currentMonth, day);

          // Check if this date matches the class day of week
          if (classDate.getDay() === targetDayIndex) {
            // Create the actual class datetime
            const classStart = new Date(classDate);
            classStart.setHours(hours, minutes, 0, 0);

            const classEnd = new Date(classStart.getTime() + 60 * 60 * 1000);

            // Count for monthly total
            data.thisMonth.total += 1;

            // Check if this class is completed or pending
            if (now.getTime() > classEnd.getTime()) {
              data.thisMonth.completed += 1;
            } else {
              data.thisMonth.pending += 1;
            }

            // Check if this class is in the current week
            if (
              classStart >= startOfWeek &&
              classStart <
                new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
            ) {
              data.thisWeek.total += 1;

              if (now.getTime() > classEnd.getTime()) {
                data.thisWeek.completed += 1;
              } else {
                data.thisWeek.pending += 1;
              }

              // Update daily breakdown with actual completed/pending status
              if (now.getTime() > classEnd.getTime()) {
                data.dailyBreakdown[dayName].completed += 1;
              } else {
                data.dailyBreakdown[dayName].pending += 1;
              }
            }

            // Check if this class is today
            if (
              classDate.getDate() === now.getDate() &&
              classDate.getMonth() === now.getMonth() &&
              classDate.getFullYear() === now.getFullYear()
            ) {
              data.today.total += 1;

              if (now.getTime() > classEnd.getTime()) {
                data.today.completed += 1;
              } else {
                data.today.pending += 1;
              }
            }
          }
        }
      });
    });

    const dayStatus = {};
    const todayIndex = now.getDay();
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    daysOfWeek.forEach((day, index) => {
      if (index === todayIndex) {
        dayStatus[day] = "today";
      } else if (index < todayIndex) {
        dayStatus[day] = "past";
      } else {
        dayStatus[day] = "future";
      }
    });

    return {
      ...data,
      dayStatus: dayStatus,
    };
  }, [students]);

  const chartData = useMemo(
    () => ({
      series: [
        {
          data: Object.entries(classData.dailyBreakdown).map(
            ([day, counts]) => ({
              label: day.substring(0, 3),
              value: counts.total,
            })
          ),
        },
      ],
      xAxis: {
        data: Object.keys(classData.dailyBreakdown).map((day) =>
          day.substring(0, 3)
        ),
      },
    }),
    [classData]
  );

  // Rest of your component remains the same
  return (
    <div className="dashboard-card classes-count-card">
      <h2 className="main-title">
        <FaBookOpen className="card-icon" /> Classes Overview
      </h2>

      <div className="card-content-grid">
        <div className="left-column">
          <div className="daily-breakdown-graph">
            <h3 className="daily-breakdown-title">Weekly Trend</h3>
            <div className="graph-container">
              <BarChart
                xAxis={[{ scaleType: "band", data: chartData.xAxis.data }]}
                series={[
                  {
                    data: chartData.series[0].data.map((d) => d.value),
                    color: "var(--primary-blue)",
                  },
                ]}
                height={200}
                yAxis={[{ label: "Classes" }]}
              />
            </div>
          </div>
          <div className="summary-metrics-container">
            <div className="metric-box weekly">
              <FaCalendarWeek className="metric-icon" />
              <span className="metric-value">{classData.thisWeek.total}</span>
              <span className="metric-label">This Week</span>
              <div className="sub-metrics">
                <span className="completed">
                  Completed: {classData.thisWeek.completed}
                </span>
                <span className="pending">
                  Pending: {classData.thisWeek.pending}
                </span>
              </div>
            </div>
            <div className="metric-box monthly">
              <FaCalendarAlt className="metric-icon" />
              <span className="metric-value">{classData.thisMonth.total}</span>
              <span className="metric-label">This Month</span>
              <div className="sub-metrics">
                <span className="completed">
                  Completed: {classData.thisMonth.completed}
                </span>
                <span className="pending">
                  Pending: {classData.thisMonth.pending}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="daily-breakdown-list-container">
          <h3 className="daily-breakdown-title">Daily wise classes</h3>
          <div className="breakdown-list">
            {Object.entries(classData.dailyBreakdown).map(([day, counts]) => (
              <div
                key={day}
                className={`breakdown-item ${classData.dayStatus[day]}`}
              >
                <span className="item-label">{day}</span>
                <div className="item-counts">
                  <span className="item-count">{counts.total}</span>
                  <div className="sub-counts">
                    <span className="completed">C: {counts.completed}</span>
                    <span className="pending">P: {counts.pending}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassesOverview;
