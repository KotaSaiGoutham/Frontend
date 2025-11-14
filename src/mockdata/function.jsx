import {
  format,
  parse,
  isValid,
  parseISO,
  startOfDay,
  getDay,
  endOfDay,
  addDays,
  isWithinInterval,
  isSameDay,
  isAfter,
  isBefore,
  constructNow,
   setHours, setMinutes
} from "date-fns";
import React, { useState, useEffect, useRef } from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
import { keyframes } from "@mui/system"; // Import keyframes from MUI system
import { v4 as uuidv4 } from 'uuid';
export const sortAndFilterTimetableData = (data) => {
  // Helper to parse time string into minutes from midnight
  const timeToMinutes = (timeStr) => {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period && period.toLowerCase() === "pm" && hours !== 12) {
      hours += 12;
    } else if (period && period.toLowerCase() === "am" && hours === 12) {
      hours = 0;
    }
    return hours * 60 + minutes;
  };


  // Sort the remaining classes by time
  return data.sort((a, b) => {
    const timeA = timeToMinutes(a.Time.split(" to ")[0]);
    const timeB = timeToMinutes(b.Time.split(" to ")[0]);
    return timeA - timeB;
  });
};
export const formatFirebaseDate = (timestampObject) => {
  // Check if it's a valid timestamp object and has _seconds property
  if (!timestampObject || typeof timestampObject._seconds !== "number") {
    return "N/A";
  }

  try {
    // Firestore Timestamp objects have a toDate() method to convert to a JavaScript Date object
    const date = new Date(
      timestampObject._seconds * 1000 + timestampObject._nanoseconds / 1000000
    );
    return format(date, "dd/MM/yyyy");
  } catch (error) {
    console.error("Error parsing Firestore Timestamp:", timestampObject, error);
    return "Invalid Date";
  }
};
export const formatClassInfo = (classId) => {
  if (!classId) return '';
  
  const parts = classId.split('-');
  if (parts.length < 5) return classId;
  
  const [, year, month, day, dayTime] = parts;
  
  // Format: "Monday, Nov 04 - 10:00 AM"
  const date = new Date(`${year}-${month}-${day}`);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedDate = date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
  
  // Extract and format time (e.g., "1000am" -> "10:00 AM")
  const timeMatch = dayTime.match(/([0-9]{1,2})([0-9]{2})([ap]m)/i);
  if (timeMatch) {
    const [, hour, minute, period] = timeMatch;
    const formattedTime = `${hour}:${minute} ${period.toUpperCase()}`;
    return `${dayName}, ${formattedDate} - ${formattedTime}`;
  }
  
  return `${dayName}, ${formattedDate}`;
};

export const calculateQuartiles = (data) => {
  // Filter out any non-numeric or future values (like '-')
  const numericData = data.filter(val => typeof val === 'number');
  if (numericData.length === 0) {
    return { q1: 0, median: 0, q3: 0 };
  }
  
  // Sort the data in ascending order
  numericData.sort((a, b) => a - b);

  const median = numericData[Math.floor(numericData.length / 2)];
  
  const lowerHalf = numericData.slice(0, Math.floor(numericData.length / 2));
  const upperHalf = numericData.slice(Math.ceil(numericData.length / 2));

  const q1 = lowerHalf[Math.floor(lowerHalf.length / 2)];
  const q3 = upperHalf[Math.floor(upperHalf.length / 2)];

  return { q1, median, q3 };
};
const ALL_PDF_COLUMNS = [
  // key: Matches the key in your `columnVisibility` state
  // label: The text that will appear in the PDF header
  // dataKey: The actual property name in your `student` data object
  // format: (optional) A function to transform the raw student data into the desired string for PDF
  // controllable: (optional, default true) If false, this column is always included and not toggleable by checkboxes.
  {
    key: "sNo",
    label: "S.No.",
    dataKey: null,
    format: (student, index) => index + 1,
    controllable: false,
  },
  { key: "name", label: "Name", dataKey: "Name", controllable: false },
  { key: "gender", label: "Gender", dataKey: "Gender" },
  { key: "subject", label: "Subject", dataKey: "Subject" },
  { key: "contactNumber", label: "Student No", dataKey: "ContactNumber" },
  { key: "fatherContact", label: "F No", dataKey: "father_contact" },
  { key: "motherContact", label: "M No", dataKey: "mother_contact" },
  { key: "year", label: "Year", dataKey: "Year" },
  { key: "stream", label: "Stream", dataKey: "Stream" },
  { key: "college", label: "College", dataKey: "College" },
  { key: "group", label: "Group", dataKey: "Group " }, // Note: space in dataKey matches your data
  { key: "source", label: "Source", dataKey: "Source" },
  {
    key: "monthlyFee",
    label: "Monthly Fee",
    dataKey: "Monthly Fee", // Note: space in dataKey
    format: (student) =>
      (typeof student["Monthly Fee"] === "number"
        ? student["Monthly Fee"]
        : parseFloat(student["Monthly Fee"]) || 0
      ).toLocaleString("en-IN"), // Format as Indian currency
  },
  {
    key: "classesCompleted",
    label: "Classes Completed",
    dataKey: "classesCompleted",
  }, // Note: space in dataKey
  {
    key: "nextClass",
    label: "Next Class",
    dataKey: "nextClass",
    format: (student) =>
      student.nextClass && typeof student.nextClass === "string" // Assuming it's an ISO string from your dummy data
        ? format(parseISO(student.nextClass), "MMM dd, hh:mm a")
        : "N/A",
  },
  {
    key: "admissionDate",
    label: "Admission Date",
    dataKey: "admissionDate",
    format: (student) =>
      student.admissionDate &&
      typeof student.admissionDate._seconds === "number"
        ? format(
            fromUnixTime(student.admissionDate._seconds),
            "MMM dd, hh:mm a"
          )
        : "N/A",
  },
  { key: "paymentStatus", label: "Payment Status", dataKey: "Payment Status" },
];

export const getPdfTableHeaders = (columnVisibility) => {
  return ALL_PDF_COLUMNS.filter((col) => {
    const isControllableAndVisible =
      (col.controllable === undefined || col.controllable) &&
      columnVisibility[col.key];
    const isAlwaysIncluded = col.controllable === false;
    const isSubjectColumn = col.key === "subject";

    return (
      isAlwaysIncluded ||
      (isControllableAndVisible && (!isSubjectColumn))
    );
  }).map((col) => col.label); // Return only the labels for jsPDF-AutoTable headers
};

// --- 3. Updated getPdfTableRows function ---
// This function also takes the `columnVisibility` state.
export const getPdfTableRows = (
  students,
  columnVisibility
) => {
  // First, filter the columns that should be included in the PDF based on visibility
  const filteredColumnsForPdf = ALL_PDF_COLUMNS.filter((col) => {
    const isControllableAndVisible =
      (col.controllable === undefined || col.controllable) &&
      columnVisibility[col.key];
    const isAlwaysIncluded = col.controllable === false;
    const isSubjectColumn = col.key === "subject";

    return (
      isAlwaysIncluded ||
      (isControllableAndVisible && (!isSubjectColumn))
    );
  });

  return students.map((student, index) => {
    // For each student, create an array of values in the correct order
    return filteredColumnsForPdf.map((col) => {
      if (col.format) {
        // Use the custom format function if provided
        return col.format(student, index);
      } else if (col.dataKey) {
        // Use the dataKey to access the student property
        return student[col.dataKey] || "N/A";
      }
      // Fallback for cases where dataKey is null (like sNo, which is handled by format)
      return "N/A";
    });
  });
};

// Define keyframes for the "pop" animation
const popAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.15); } /* Pop out slightly */
  100% { transform: scale(1); }
`;

// Define keyframes for a quick color flash
const colorFlash = keyframes`
  0% { color: inherit; }
  25% { color: #4caf50; } /* A vibrant green for increase */
  100% { color: inherit; }
`;

export function ClassCounterDisplay({ student, updatingClasses }) {
  // Use a ref to store the previous classesCompleted value
  const prevClassesCompleted = useRef(student.classesCompleted || 0);
  // State to trigger the animation
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Check if classesCompleted has actually increased and is not currently updating
    if (
      !updatingClasses &&
      (student.classesCompleted || 0) > prevClassesCompleted.current
    ) {
      setAnimate(true);
      const timer = setTimeout(() => {
        setAnimate(false); // Reset animation state after it completes
      }, 500); // Duration of your animation
      return () => clearTimeout(timer);
    }
    // Update the ref for the next render
    prevClassesCompleted.current = student.classesCompleted || 0;
  }, [student.classesCompleted, updatingClasses]); // Depend on classesCompleted and updatingClasses

  return (
    <>
      {updatingClasses === student.id ? (
        <CircularProgress size={20} color="primary" />
      ) : (
        <Typography
          variant="body1"
          component="span"
          sx={{
            fontWeight: 600,
            // Apply animation only when 'animate' state is true
            animation: animate
              ? `${popAnimation} 0.3s ease-out, ${colorFlash} 0.5s ease-out`
              : "none",
            display: "inline-block", // Important for transform to work correctly
            transformOrigin: "center center", // Ensure scaling is from the center
          }}
        >
          {student.classesCompleted || 0}
        </Typography>
      )}
    </>
  );
}
// utils/convertFirestoreDate.js
export const toJsDate = (ts) => {
  if (!ts) return null;

  // Case 1: Firestore Timestamp instance (has .toDate())
  if (typeof ts.toDate === "function") return ts.toDate();

  // Case 2: JSON‑serialised Timestamp { _seconds, _nanoseconds }
  if (typeof ts._seconds === "number")
    return new Date(ts._seconds * 1000 + Math.round(ts._nanoseconds / 1e6));

  // Case 3: ISO string
  if (typeof ts === "string" || ts instanceof String) return new Date(ts);

  return null; // unsupported shape
};
export const buildChartData = (payments = []) =>
  payments
    .filter((p) => p.status === "Paid") // ← keep ONLY Paid events
    .map((p) => {
      const dateObj = toJsDate(p.date);
      if (!dateObj) return null;
      return {
        name: dayjs(dateObj).format("DD MMM YY"), // X‑axis
        Count: 1, // each bar = 1 payment
      };
    })
    .filter(Boolean);
export const isRecentPayment = (student) => {
  if (student["Payment Status"] !== "Paid" || !student.paidDate) return false;

  const now = new Date();
  const paid = new Date(student.paidDate._seconds * 1000); // Convert Firestore timestamp
  const diffInDays = (now - paid) / (1000 * 60 * 60 * 24);

  return diffInDays <= 3; // paid today or within last 3 days
};
// Capitalize helper
export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
// Helper function to determine the status of a timetable row
export const getTimetableRowStatus = (item, now) => {
  const classDate = parse(item.Day, "dd/MM/yyyy", new Date());
  const [startTimeStr, endTimeStr] = item.Time.split(" to ");

  const classStartTime = parse(startTimeStr, "hh:mm a", classDate);
  let classEndTime = parse(endTimeStr, "hh:mm a", classDate);

  // Adjust end time for overnight classes (e.g., 10 PM to 2 AM)
  if (
    isValid(classStartTime) &&
    isValid(classEndTime) &&
    isBefore(classEndTime, classStartTime)
  ) {
    classEndTime = addDays(classEndTime, 1);
  }

  // Check if it's the current day
  const isToday = isValid(classDate) && isSameDay(classDate, now);

  if (isToday) {
    if (isValid(classStartTime) && isValid(classEndTime)) {
      if (isWithinInterval(now, { start: classStartTime, end: classEndTime })) {
        return "running"; // Class is currently ongoing
      } else if (isBefore(classEndTime, now)) {
        return "pastToday"; // Class ended earlier today
      } else if (isAfter(classStartTime, now)) {
        return "futureToday"; // Class is later today
      }
    }
  } else if (isValid(classDate) && isBefore(classDate, startOfDay(now))) {
    return "pastDay"; // Class was on a previous day
  }

  return "future"; // Class is on a future day or unrecognized state
};
// Helper function to safely get a Date object from various formats in a timetable item
export const getDateFromTimetableItem = (item) => {
  // 1. Prioritize `dateTimeISO` as it's meant to be a direct ISO string
  if (item.dateTimeISO && typeof item.dateTimeISO === "string") {
    const date = new Date(item.dateTimeISO);
    if (isValid(date)) return date;
  }

  // 2. Check `classDateTime` field (can be ISO string, raw Timestamp object, or even a JS Date if pre-processed)
  if (item.classDateTime) {
    // If it's already a JavaScript Date object (unlikely directly from API, but possible)
    if (item.classDateTime instanceof Date) {
      if (isValid(item.classDateTime)) return item.classDateTime;
    }
    // If it's an ISO string (expected from backend after our suggested fix)
    if (typeof item.classDateTime === "string") {
      const date = new Date(item.classDateTime);
      if (isValid(date)) return date;
    }
    // If it's the raw Firestore Timestamp object { _seconds, _nanoseconds }
    // This is a fallback to handle if your backend isn't converting it correctly.
    if (
      typeof item.classDateTime === "object" &&
      item.classDateTime._seconds !== undefined
    ) {
      const date = new Date(item.classDateTime._seconds * 1000); // Convert seconds to milliseconds
      if (isValid(date)) return date;
    }
  }

  // 3. Fallback: Reconstruct from 'Day' and 'Time' strings (used for manual timetables)
  if (item.Day && item.Time) {
    const timeStartPart = item.Time.split(" to ")[0];
    // Ensure you have date-fns `parse` and `format` imported for this
    const combinedDateTimeStr = `${item.Day} ${timeStartPart}`;
    const parsedDate = parse(
      combinedDateTimeStr,
      "dd/MM/yyyy hh:mm a",
      new Date()
    );
    if (isValid(parsedDate)) return parsedDate;
  }

  // If all else fails, return a default/invalid date or throw an error
  console.warn("Could not determine valid date for timetable item:", item);
  return new Date(0); // Return epoch date to allow .getTime() without error
};
export const getTodayDateForFilename = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getGreetingInfo = () => {
  const hour = new Date().getHours();
  let text, className, imageUrl;

  if (hour >= 5 && hour < 12) {
    text = "Morning";
    className = "morning";
    // Bright, minimalist study space with good light
    imageUrl =
      "https://images.unsplash.com/photo-1549725838-8c1143c72b53?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  } else if (hour >= 12 && hour < 18) {
    text = "Afternoon";
    className = "afternoon";
    // Empty, clean, naturally lit classroom
    imageUrl =
      "https://images.unsplash.com/photo-1498243691581-b145c3f54bfb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB4MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  } else {
    // 18 (6 PM) onwards to 4 AM
    text = "Evening";
    className = "evening";
    // Modern office/study with ambient lighting, still bright, glowing screen
    imageUrl =
      "https://images.unsplash.com/photo-1454165205744-bdc3fd1d49db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  }
  return { text, className, imageUrl };
};
export const getQuickChartUrl = (chartType, data) => {
  let chartConfig = {};
  if (chartType === "line") {
    chartConfig = {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: data.label,
            data: data.data,
            borderColor: "rgb(74,144,226)",
            fill: false,
          },
        ],
      },
    };
  } else if (chartType === "pie" || chartType === "doughnut") {
    chartConfig = {
      type: chartType,
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.data,
            backgroundColor: data.backgroundColors,
          },
        ],
      },
      options: {
        plugins: {
          datalabels: {
            color: "#fff",
            formatter: (value, ctx) => {
              let sum = 0;
              let dataArr = ctx.chart.data.datasets[0].data;
              dataArr.map((data) => {
                sum += data;
              });
              let percentage = ((value * 100) / sum).toFixed(0) + "%";
              return percentage;
            },
          },
        },
      },
    };
  }
  return `https://quickchart.io/chart?c=${encodeURIComponent(
    JSON.stringify(chartConfig)
  )}&f=png&bkg=transparent`;
};

export const getRecentStudentActivity = (students, currentMonthPayments) => {
  if (!students) return [];

  const paidStudentIds = new Set(currentMonthPayments?.map((p) => p.studentId));

  const enhancedStudents = students
    .filter((student) => student.isActive)
    .map((student) => {
      const isPaid = paidStudentIds.has(student.id);
      return {
        ...student,
        isPaid,
        paymentStatus: isPaid ? "Paid" : "Pending",
        lastUpdatedClassesAt: student.lastUpdatedClassesAt
          ? new Date(
              student.lastUpdatedClassesAt._seconds * 1000
            ).toLocaleString()
          : null,
      };
    });

  const sortedStudents = enhancedStudents.sort((a, b) => {
    if (a.paymentStatus !== b.paymentStatus) {
      return a.paymentStatus === "Pending" ? -1 : 1;
    }
    const dateA = new Date(a.lastUpdatedClassesAt);
    const dateB = new Date(b.lastUpdatedClassesAt);
    return dateB - dateA;
  });

  return sortedStudents;
};

export const getCombinedRecentActivity = (students, payments) => {
  const activities = [];

  // Add a new activity for each student's latest class
  students.forEach((student) => {
    if (student.lastUpdatedClassesAt && student.isActive) {
      activities.push({
        type: "class_completed",
        id: student.id,
        timestamp: new Date(student.lastUpdatedClassesAt._seconds * 1000),
        message: `${student.Name} completed their class in ${student.Subject}.`,
      });
    }
  });

  // Add a new activity for each payment received
  payments.forEach((payment) => {
    activities.push({
      type: "payment_received",
      id: payment.id,
      timestamp: new Date(payment.paidOn),
      message: `${
        payment.studentName
      } paid their fee of ₹${payment.amount.toLocaleString()}.`,
    });
  });

  // Sort all activities by the most recent timestamp
  const sortedActivities = activities.sort((a, b) => b.timestamp - a.timestamp);

  return sortedActivities;
};

// Logic to get recent employee activity
export const getRecentEmployeeActivity = (employees) => {
  if (!employees) return [];

  // Sort employees by creation date or last paid date to show recent entries/updates
  return employees.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA; // Sort in descending order
  });
};

export const yearOptions = [2023, 2024, 2025, 2026, 2027, 2028];
export const monthOptions = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];
export const expenditureColors = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF1943",
];
export const getDemoClassMetrics = (demos) => {
  if (!demos)
    return {
      successCount: 0,
      scheduledCount: 0,
      pendingCount: 0,
      failureCount: 0,
      total: 0,
    };

  const successCount = demos.filter(
    (d) => d.status?.toLowerCase() === "success"
  ).length;
  const scheduledCount = demos.filter(
    (d) => d.status?.toLowerCase() === "scheduled"
  ).length;
  const pendingCount = demos.filter(
    (d) => d.status?.toLowerCase() === "pending"
  ).length;
  const failureCount = demos.filter(
    (d) => d.status?.toLowerCase() === "failure"
  ).length;

  const total = demos.length;
  return { successCount, scheduledCount, pendingCount, failureCount, total };
};
// Mock utility functions for demonstration
const dayNameToDayNum = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};
const convertSingleTimeToSlot = (time) => `${time} to ${time}`;

/**
 * Creates a unique, consistent key for a time slot to check for clashes.
 * This helper function centralizes the logic and prevents subtle formatting errors.
 * @param {Date} dateObj - The date object for the slot.
 * @param {string} timeStr - The time string for the slot (e.g., "10:00 AM").
 * @param {string} name - The name of the student or faculty.
 * @returns {string} A formatted key for the time slot.
 */
const getSlotKey = (dateObj, timeStr, name) => {
  const combinedDateTime = parse(
    `${format(dateObj, "yyyy-MM-dd")} ${timeStr}`,
    "yyyy-MM-dd hh:mm a",
    new Date()
  );
  if (!isValid(combinedDateTime)) {
    return null;
  }
  const formattedDateTime = format(combinedDateTime, "yyyy-MM-dd_hh:mm a");
  return `${formattedDateTime}_${name}`;
};



export function generateTimetables({ students, dateStr, user }) {
  if (!dateStr) return [];

  const parsedDate = parse(dateStr, "dd/MM/yyyy", new Date());
  const weekday = format(parsedDate, "EEEE"); // e.g. "Monday"
  const formattedDate = format(parsedDate, "dd/MM/yyyy");
  const now = new Date();

  const generated = [];

  students.forEach((student) => {
    if (!student.classDateandTime || !Array.isArray(student.classDateandTime)) return;

    // Find time slots for the selected weekday
    const matchingSlots = student.classDateandTime.filter((slot) =>
      slot.startsWith(weekday)
    );

    matchingSlots.forEach((slot) => {
      const timeSlot = slot.split("-")[1]?.trim(); // extract "04:00pm"
      if (!timeSlot) return;

      // Parse the time string to a Date object
      const timeParsed = parse(timeSlot, "hh:mma", new Date());
      
      // Calculate start and end times
      const startTimeISO = setMinutes(setHours(parsedDate, timeParsed.getHours()), timeParsed.getMinutes());
      const endTimeISO = new Date(startTimeISO.getTime() + 60 * 60 * 1000); // Add 1 hour

      // Calculate monthly fee per class
      let monthlyFeePerClass = "N/A";
      const monthlyFee = student.monthlyFee || parseFloat(student["Monthly Fee"]);
      if (typeof monthlyFee === "number" && monthlyFee > 0) {
          monthlyFeePerClass = (monthlyFee / 12).toFixed(2);
      }
      
      generated.push({
        Student: student.Name,
        Topic: "", // Default to empty string
        Day: formattedDate,
        Faculty: student.Faculty || "", // Using Faculty from student data, assuming it exists
        Subject: student.Subject || "",
        Time: `${format(startTimeISO, "hh:mm a")} to ${format(endTimeISO, "hh:mm a")}`,
        userId: user.id,
        generationDate: format(now, "yyyy-MM-dd"),
        generatedOnDemand: true,
        isAutoGenerated: true,
        createdAt: now.toISOString(),
        classDateTime: startTimeISO.toISOString(), // Use ISO string to store UTC date
        dateTimeISO: startTimeISO.toISOString(), // Assuming this is the same as classDateTime
        monthlyFeePerClass: monthlyFeePerClass
      });
    });
  });

  return generated;
}


// This function can be defined outside your component, or in a utility file.
// It converts a Firestore timestamp object to a formatted date string.
export const formatFirestoreDate = (timestamp) => {
  if (!timestamp || !timestamp._seconds) return 'N/A';
  const milliseconds = timestamp._seconds * 1000;
  const date = new Date(milliseconds);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// This function calculates the expected end date
export const calculateExpectedEndDate = (startDate, classDays, totalClasses) => {
  if (!startDate || totalClasses === 0 || !classDays || classDays.length === 0) {
    return 'N/A';
  }

  // Convert Firestore timestamp to a JavaScript Date object
  const startMillis = startDate._seconds * 1000;
  const currentDate = new Date(startMillis);

  // Map day names to a numerical value (0 = Sunday, 1 = Monday, etc.)
  const dayMap = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
    'Thursday': 4, 'Friday': 5, 'Saturday': 6,
  };
  const scheduledDays = classDays.map(dayTime => dayMap[dayTime.split('-')[0]]);

  let classesCount = 0;
  // Iterate day by day until we find the date of the last class
  while (classesCount < totalClasses) {
    const currentDayOfWeek = currentDate.getDay();

    // Check if the current day is a scheduled class day
    if (scheduledDays.includes(currentDayOfWeek)) {
      classesCount++;
    }

    // Move to the next day
    if (classesCount < totalClasses) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  // Format the final date
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = currentDate.getFullYear();
  return `${day}/${month}/${year}`;
};

 export const formatPhone = (num) => {
    if (!num) return "N/A";
    return (
      <a href={`tel:${num}`} className="phone-link">
        {num.replace(/(\d{5})(\d{5})/, "$1 $2")}
      </a>
    );
  };

  export const isoToDDMMYYYY = (isoDateString) => {
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};