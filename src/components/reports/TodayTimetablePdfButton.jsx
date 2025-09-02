import React, { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { format, parse, isWithinInterval, startOfDay, endOfDay,addDays } from "date-fns";
import PdfReportButton from "../customcomponents/PdfReportButton";
import { fetchUpcomingClasses,fetchAutoTimetablesForToday } from "../../redux/actions";

const TodayTimetablePdfButton = () => {
  const dispatch = useDispatch();

  const { timetables: manualTimetables } = useSelector((state) => state.classes);
  const { timetables: autoTimetables } = useSelector((state) => state.autoTimetables);
  const { canAccessAll } = useSelector((state) => state.auth);
  const { students } = useSelector((state) => state.students);

  useEffect(() => {
    dispatch(fetchUpcomingClasses({date :new Date().toLocaleDateString("en-GB")}));
    dispatch(fetchAutoTimetablesForToday());
  }, [dispatch]);

const calculateDuration = (timeString) => {
  const [start, end] = timeString.split(" to ");
  if (!start || !end) {
    return "N/A";
  }

  let startTime = parse(start, "hh:mm a", new Date());
  let endTime = parse(end, "hh:mm a", new Date());
  if (endTime.getTime() < startTime.getTime()) {
    endTime = addDays(endTime, 1);
  }

  // Calculate duration in milliseconds and convert to hours
  const durationInMs = endTime.getTime() - startTime.getTime();
  const durationInHours = (durationInMs / 1000 / 60 / 60).toFixed(1);

  return durationInHours;
};

  // Memoize the data processing to prevent unnecessary re-calculations on re-render
  const formattedData = useMemo(() => {
    // Combine and deduplicate timetables
    const combinedTimetables = [...manualTimetables, ...autoTimetables];
    const uniqueTimetables = new Map();
    combinedTimetables.forEach(item => {
      const key = `${item.Student}-${item.Time}-${item.Day}`;
      uniqueTimetables.set(key, item);
    });
    
    // Filter for today's date
    const today = new Date();
    const todayTimetables = Array.from(uniqueTimetables.values()).filter(item => {
      const itemDate = parse(item.Day, "dd/MM/yyyy", today);
      return isWithinInterval(itemDate, { start: startOfDay(today), end: endOfDay(today) });
    });

    // Map student fees for the report
    const studentSubjectDataMap = new Map();
    if (students && students.length > 0) {
      students.forEach((student) => {
        if (student.Name && student.Subject) {
          const key = `${student.Name.toLowerCase()}_${student.Subject.toLowerCase()}`;
          studentSubjectDataMap.set(key, student);
        }
      });
    }
console.log("todayTimetables",todayTimetables)
    // Format and sort the timetable data
    const filteredAndFormatted = todayTimetables.map(item => {
      const studentNameLower = item.Student?.toLowerCase();
      const subjectLower = item.Subject?.toLowerCase();
      const lookupKey = `${studentNameLower}_${subjectLower}`;
      const matchedStudent = studentSubjectDataMap.get(lookupKey);

      let monthlyFeePerClass = "N/A";
      if (matchedStudent && matchedStudent.monthlyFee > 0) {
        monthlyFeePerClass = (matchedStudent.monthlyFee / 12).toFixed(2);
      }

      return {
        ...item,
        monthlyFeePerClass: monthlyFeePerClass,
      };
    }).sort((a, b) => {
      // Sort by time
      const timeA = parse(a.Time?.split(" to ")[0], "hh:mm a", new Date());
      const timeB = parse(b.Time?.split(" to ")[0], "hh:mm a", new Date());
      return timeA.getTime() - timeB.getTime();
    });

    // Prepare table headers
    const headers = ["Student", "Lesson", "Time", "Duration", "Fee / Class"];
    if (canAccessAll) {
      headers.splice(2, 0, "Faculty", "Subject");
    }

    // Prepare table rows and check for missing data
    const rows = filteredAndFormatted.map(item => {
      const row = [item.Student, item.Topic, item.Time, calculateDuration(item.Time), item.monthlyFeePerClass !== "N/A" ? String(item.monthlyFeePerClass) : "N/A"];
      if (canAccessAll) {
        row.splice(2, 0, item.Faculty, item.Subject);
      }
      return row;
    });

    const hasMissingTopics = filteredAndFormatted.some(item => !item.Topic);

    // Set the title and filename for the PDF
    const title = `Today's Timetable - ${format(today, 'dd MMM yyyy')}`;
    const filename = `Timetable_Report_${format(today, 'yyyy-MM-dd')}.pdf`;
    
    return {
      headers,
      rows,
      hasMissingTopics,
      title,
      filename
    };
  }, [manualTimetables, autoTimetables, students, canAccessAll]);

  return (
    <PdfReportButton
      title={formattedData.title}
      headers={formattedData.headers}
      rows={formattedData.rows}
      buttonLabel="Download Today's Timetable"
      filename={formattedData.filename}
    />
  );
};

export default TodayTimetablePdfButton;
