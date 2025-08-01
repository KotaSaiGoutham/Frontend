import {
  format,
  parse,
  isValid,
  parseISO,
  startOfDay,
  addDays,
  isWithinInterval,
  isSameDay,
  isAfter, 
  isBefore,
} from "date-fns";
import React, { useState, useEffect, useRef } from 'react';
import { Typography, CircularProgress, Box } from '@mui/material';
import { keyframes } from '@mui/system'; // Import keyframes from MUI system
export const sortAndFilterTimetableData = (data) => {
    const now = new Date(); // Current date and time
    const todayFormatted = now.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY

    // Helper to parse time string into minutes from midnight
    const timeToMinutes = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period && period.toLowerCase() === 'pm' && hours !== 12) {
            hours += 12;
        } else if (period && period.toLowerCase() === 'am' && hours === 12) { // Midnight 12 AM
            hours = 0;
        }
        return hours * 60 + minutes;
    };

    // Filter out past events first
    const futureClasses = data.filter(item => {
        const [day, month, year] = item.Day.split('/').map(Number);
        const classDate = new Date(year, month - 1, day); // Month is 0-indexed

        const [startTimeStr] = item.Time.split(' to ');
        const classStartTimeMinutes = timeToMinutes(startTimeStr);

        // Create a Date object for the class start time on its respective day
        const classDateTime = new Date(year, month - 1, day, Math.floor(classStartTimeMinutes / 60), classStartTimeMinutes % 60);

        // If the class date is in the future, include it
        if (classDateTime.getTime() > now.getTime()) {
            return true;
        }
        return false;
    });

    // Then sort the remaining future classes
    return futureClasses.sort((a, b) => {
        // Parse dates for comparison
        const [dayA, monthA, yearA] = a.Day.split('/').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);

        const [dayB, monthB, yearB] = b.Day.split('/').map(Number);
        const dateB = new Date(yearB, monthB - 1, dayB);

        const timeA = timeToMinutes(a.Time.split(' to ')[0]);
        const timeB = timeToMinutes(b.Time.split(' to ')[0]);

        // Prioritize today's *remaining* classes (those after current time)
        const isTodayA = a.Day === todayFormatted;
        const isTodayB = b.Day === todayFormatted;

        if (isTodayA && !isTodayB) {
            return -1; // 'a' is today, 'b' is not, so 'a' comes first
        }
        if (!isTodayA && isTodayB) {
            return 1; // 'b' is today, 'a' is not, so 'b' comes first
        }

        // If both or neither are today, sort by date
        if (dateA.getTime() !== dateB.getTime()) {
            return dateA.getTime() - dateB.getTime();
        }

        // If dates are the same, sort by time
        return timeA - timeB;
    });
};
 export const formatFirebaseDate = (timestampObject) => {
    // Check if it's a valid timestamp object and has _seconds property
    if (!timestampObject || typeof timestampObject._seconds !== 'number') {
      return "N/A";
    }

    try {
      // Firestore Timestamp objects have a toDate() method to convert to a JavaScript Date object
      const date = new Date(timestampObject._seconds * 1000 + timestampObject._nanoseconds / 1000000);
      return format(date, "dd/MM/yyyy");
    } catch (error) {
      console.error("Error parsing Firestore Timestamp:", timestampObject, error);
      return "Invalid Date";
    }
  };

const ALL_PDF_COLUMNS = [
  // key: Matches the key in your `columnVisibility` state
  // label: The text that will appear in the PDF header
  // dataKey: The actual property name in your `student` data object
  // format: (optional) A function to transform the raw student data into the desired string for PDF
  // controllable: (optional, default true) If false, this column is always included and not toggleable by checkboxes.
  { key: "sNo", label: "S.No.", dataKey: null, format: (student, index) => index + 1, controllable: false },
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
    format: (student) => (
      (typeof student["Monthly Fee"] === "number"
        ? student["Monthly Fee"]
        : parseFloat(student["Monthly Fee"]) || 0
      ).toLocaleString("en-IN") // Format as Indian currency
    ),

  },
  { key: "classesCompleted", label: "Classes Completed", dataKey: "classesCompleted" }, // Note: space in dataKey
  {
    key: "nextClass",
    label: "Next Class",
    dataKey: "nextClass",
    format: (student) =>
      student.nextClass && typeof student.nextClass === 'string' // Assuming it's an ISO string from your dummy data
        ? format(parseISO(student.nextClass), "MMM dd, hh:mm a")
        : "N/A",
  },
  {
    key: "admissionDate",
    label: "Admission Date",
    dataKey: "admissionDate",
    format: (student) =>
      student.admissionDate && typeof student.admissionDate._seconds === "number"
        ? format(fromUnixTime(student.admissionDate._seconds), "MMM dd, hh:mm a")
        : "N/A",
  },
  { key: "paymentStatus", label: "Payment Status", dataKey: "Payment Status" },
];

// --- 2. Updated getPdfTableHeaders function ---
// This function now takes the `columnVisibility` state directly.
export const getPdfTableHeaders = (columnVisibility, showSubjectColumn) => {
  return ALL_PDF_COLUMNS
    .filter(col => {
      // Columns marked as not controllable are always included.
      // Other columns are included if their visibility is true in the UI state.
      // The 'subject' column also respects the global 'showSubjectColumn' flag.
      const isControllableAndVisible = (col.controllable === undefined || col.controllable) && columnVisibility[col.key];
      const isAlwaysIncluded = col.controllable === false;
      const isSubjectColumn = col.key === 'subject';
      
      return isAlwaysIncluded || (isControllableAndVisible && (!isSubjectColumn || showSubjectColumn));
    })
    .map(col => col.label); // Return only the labels for jsPDF-AutoTable headers
};

// --- 3. Updated getPdfTableRows function ---
// This function also takes the `columnVisibility` state.
export const getPdfTableRows = (students, columnVisibility, showSubjectColumn) => {
  // First, filter the columns that should be included in the PDF based on visibility
  const filteredColumnsForPdf = ALL_PDF_COLUMNS.filter(col => {
    const isControllableAndVisible = (col.controllable === undefined || col.controllable) && columnVisibility[col.key];
    const isAlwaysIncluded = col.controllable === false;
    const isSubjectColumn = col.key === 'subject';

    return isAlwaysIncluded || (isControllableAndVisible && (!isSubjectColumn || showSubjectColumn));
  });

  return students.map((student, index) => {
    // For each student, create an array of values in the correct order
    return filteredColumnsForPdf.map(col => {
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
    if (!updatingClasses && (student.classesCompleted || 0) > prevClassesCompleted.current) {
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
              : 'none',
            display: 'inline-block', // Important for transform to work correctly
            transformOrigin: 'center center', // Ensure scaling is from the center
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
    .filter((p) => p.status === "Paid")          // ← keep ONLY Paid events
    .map((p) => {
      const dateObj = toJsDate(p.date);
      if (!dateObj) return null;
      return {
        name: dayjs(dateObj).format("DD MMM YY"), // X‑axis
        Count: 1,                                 // each bar = 1 payment
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
  if (isValid(classStartTime) && isValid(classEndTime) && isBefore(classEndTime, classStartTime)) {
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
    if (item.dateTimeISO && typeof item.dateTimeISO === 'string') {
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
        if (typeof item.classDateTime === 'string') {
            const date = new Date(item.classDateTime);
            if (isValid(date)) return date;
        }
        // If it's the raw Firestore Timestamp object { _seconds, _nanoseconds }
        // This is a fallback to handle if your backend isn't converting it correctly.
        if (typeof item.classDateTime === 'object' && item.classDateTime._seconds !== undefined) {
            const date = new Date(item.classDateTime._seconds * 1000); // Convert seconds to milliseconds
            if (isValid(date)) return date;
        }
    }

    // 3. Fallback: Reconstruct from 'Day' and 'Time' strings (used for manual timetables)
    if (item.Day && item.Time) {
        const timeStartPart = item.Time.split(" to ")[0];
        // Ensure you have date-fns `parse` and `format` imported for this
        const combinedDateTimeStr = `${item.Day} ${timeStartPart}`;
        const parsedDate = parse(combinedDateTimeStr, "dd/MM/yyyy hh:mm a", new Date());
        if (isValid(parsedDate)) return parsedDate;
    }

    // If all else fails, return a default/invalid date or throw an error
    console.warn("Could not determine valid date for timetable item:", item);
    return new Date(0); // Return epoch date to allow .getTime() without error
};
export  const getTodayDateForFilename = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

    export const getGreetingInfo = () => {
      const hour = new Date().getHours();
      let text, className, imageUrl;
  
      if (hour >= 5 && hour < 12) {
        text = "Morning";
        className = "morning";
        // Bright, minimalist study space with good light
        imageUrl = "https://images.unsplash.com/photo-1549725838-8c1143c72b53?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
      } else if (hour >= 12 && hour < 18) {
        text = "Afternoon";
        className = "afternoon";
        // Empty, clean, naturally lit classroom
        imageUrl = "https://images.unsplash.com/photo-1498243691581-b145c3f54bfb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB4MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
      } else { // 18 (6 PM) onwards to 4 AM
        text = "Evening";
        className = "evening";
        // Modern office/study with ambient lighting, still bright, glowing screen
        imageUrl = "https://images.unsplash.com/photo-1454165205744-bdc3fd1d49db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
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