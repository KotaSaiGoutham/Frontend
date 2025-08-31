import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { getPdfTableRows, getPdfTableHeaders } from "../utils/pdfUtils";
import PdfReportButton from "../customcomponents/PdfReportButton";
// Define the columns for the student report
const STUDENT_REPORT_COLUMNS = [
  { key: "sNo", label: "S. No.", dataKey: null, controllable: false, format: (student, index) => index + 1 },
  { key: "name", label: "Name", dataKey: "Name" },
  { key: "gender", label: "Gender", dataKey: "Gender" },
  { key: "year", label: "Year", dataKey: "Year" },
  { key: "stream", label: "Stream", dataKey: "Stream" },
  { key: "contact", label: "Contact No.", dataKey: null, format: (student) => student.ContactNumber || student.MotherContactNumber || student.FatherContactNumber || "N/A" },
  { key: "classesCompleted", label: "Classes Completed", dataKey: "classesCompleted" },
  { key: "paymentStatus", label: "Payment Status", dataKey: "Payment Status" },
  { key: "monthlyFee", label: "Monthly Fee", dataKey: "monthlyFee" }, // <--- 🌟 FINAL CHANGE: Move this to the end
];

const StudentReport = () => {
  const { students } = useSelector((state) => state.students);

  // Sort students by name
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => a.Name.localeCompare(b.Name));
  }, [students]);

  // Define column visibility for the PDF report
  const columnVisibility = useMemo(() => {
    return Object.fromEntries(STUDENT_REPORT_COLUMNS.map(col => [col.key, true]));
  }, []);

  const pdfHeaders = getPdfTableHeaders(STUDENT_REPORT_COLUMNS, columnVisibility, false);
  const pdfRows = getPdfTableRows(sortedStudents, STUDENT_REPORT_COLUMNS, columnVisibility, false);

  return (
    sortedStudents.length > 0 && (
      <PdfReportButton // <--- 🌟 FINAL CHANGE: Use the new button component
        title="Student Data Report"
        headers={pdfHeaders}
        rows={pdfRows}
        buttonLabel="Download Students Data (PDF)"
        filename="Student_Data.pdf"
        reportDate={new Date()}
      />
    )
  );
};

export default StudentReport;