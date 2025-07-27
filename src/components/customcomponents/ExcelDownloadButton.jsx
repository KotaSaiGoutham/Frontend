import React, { useState } from "react";
import PropTypes from "prop-types";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { MuiButton } from "./MuiCustomFormFields";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

export default function ExcelDownloadButton({
  data,
  filename = "student_report.xlsx",
  buttonLabel = "Download Student Data (Excel)",
  buttonProps = {},
  reportDate = new Date(),
  excelReportTitle = "",
}) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleClick = async () => {
    if (!data || data.length === 0) {
      alert("No student data available to generate Excel.");
      return;
    }

    setIsGenerating(true);

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Student Data");

const HEADER_BG = "1976D2"; // blue from rgb(25, 118, 210)
      const HEADER_TEXT = "FFFFFF";
      const SUBHEADER_BG = "34495E";
      const TOTAL_BG = "ECF0F1";
      const TOTAL_TEXT = "2C3E50";

      const headers = [
        "S.No",
        "Student Name",
        "Student Contact",
        "Mother Contact",
        "Father Contact",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
        "Gender",
        "Source",
        "Year",
        "Course",
        "Name of the college",
        "Fee/ M",
        "Fee / Hr",
      ];

      const dayMap = {
        Monday: "Mon",
        Tuesday: "Tue",
        Wednesday: "Wed",
        Thursday: "Thu",
        Friday: "Fri",
        Saturday: "Sat",
        Sunday: "Sun",
      };
      const dayColumns = {
        Mon: "",
        Tue: "",
        Wed: "",
        Thu: "",
        Fri: "",
        Sat: "",
        Sun: "",
      };

      let totalMonthlyFee = 0;
      let totalFeePerHr = 0;

      // --- Row 1: Title ---
      worksheet.mergeCells(`A1:R1`);
      worksheet.getCell("A1").value = excelReportTitle;
      worksheet.getCell("A1").alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      worksheet.getCell("A1").font = {
        bold: true,
        size: 16,
        color: { argb: HEADER_TEXT },
      };
      worksheet.getCell("A1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: HEADER_BG },
      };

      // --- Row 4: Column Headers ---
      worksheet.addRow(headers);
      const headerRow = worksheet.getRow(4);
      headerRow.font = { bold: true, color: { argb: HEADER_TEXT } };
      headerRow.alignment = { horizontal: "center" };
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: HEADER_BG },
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      data.forEach((student, index) => {
        const studentClassTimes = { ...dayColumns };

        if (Array.isArray(student.classDateandTime)) {
          student.classDateandTime.forEach((timeString) => {
            const [day, time] = timeString.split("-");
            const shortDay = dayMap[day];
            if (shortDay) studentClassTimes[shortDay] = time;
          });
        }

        const monthlyFee = student.monthlyFee || 0;
        const feePerHr = monthlyFee ? (monthlyFee / 12).toFixed(2) : "";

        totalMonthlyFee += monthlyFee;
        totalFeePerHr += parseFloat(feePerHr) || 0;

        const row = [
          index + 1,
          student.Name || "",
          student.ContactNumber || "",
          student.MotherContactNumber || "",
          student.FatherContactNumber || "",
          studentClassTimes["Mon"],
          studentClassTimes["Tue"],
          studentClassTimes["Wed"],
          studentClassTimes["Thu"],
          studentClassTimes["Fri"],
          studentClassTimes["Sat"],
          studentClassTimes["Sun"],
          student.Gender || "",
          student.Source || "",
          student.Year || "",
          student.Stream || "",
          student.College || "",
          monthlyFee,
          feePerHr,
        ];

        const dataRow = worksheet.addRow(row);
        dataRow.alignment = { horizontal: "center" }; // 👈 Center align data cells
      });

      // --- Total Row ---
      const totalRow = Array(headers.length).fill("");
      totalRow[headers.length - 3] = "Total";
      totalRow[headers.length - 2] = totalMonthlyFee.toFixed(2);
      totalRow[headers.length - 1] = totalFeePerHr.toFixed(2);

      const row = worksheet.addRow(totalRow);

      // Apply style ONLY for the last 3 cells
      [headers.length - 3, headers.length - 2, headers.length - 1].forEach(
        (i) => {
          const cell = row.getCell(i + 1); // ExcelJS is 1-based
          cell.font = { bold: true, color: { argb: TOTAL_TEXT } };
          cell.alignment = { horizontal: "center" };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: TOTAL_BG },
          };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }
      );

      // --- Column widths ---
      headers.forEach((h, i) => {
        worksheet.getColumn(i + 1).width = h.length + 5;
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const dateStr = new Date(reportDate).toISOString().slice(0, 10);
      const finalFilename = filename.replace(".xlsx", `_${dateStr}.xlsx`);
      saveAs(new Blob([buffer]), finalFilename);
    } catch (error) {
      console.error("Error generating Excel:", error);
      alert("Failed to generate Excel: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <MuiButton
      onClick={handleClick}
      disabled={isGenerating}
      startIcon={<CloudDownloadIcon />}
      sx={{
        background: isGenerating
          ? "linear-gradient(45deg, #A8A8A8 30%, #C0C0C0 90%)"
          : "linear-gradient(45deg, #1976D2 30%, #2196F3 90%)",
        borderRadius: 8,
        border: 0,
        color: "white",
        height: 48,
        padding: "0 30px",
        boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
        fontWeight: "bold",
        textTransform: "uppercase",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px) scale(1.02)",
          boxShadow: "0 5px 10px 3px rgba(33, 203, 243, .5)",
          background: "linear-gradient(45deg, #2196F3 30%, #1976D2 90%)",
        },
        "&:active": {
          transform: "translateY(1px) scale(0.98)",
          boxShadow: "0 2px 3px 1px rgba(33, 203, 243, .2)",
        },
        display: "flex",
        alignItems: "center",
        gap: "8px",
        ...buttonProps.sx,
      }}
      {...buttonProps}
    >
      {isGenerating ? "Generating Excel…" : buttonLabel}
    </MuiButton>
  );
}

ExcelDownloadButton.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  filename: PropTypes.string,
  buttonLabel: PropTypes.string,
  buttonProps: PropTypes.object,
  reportDate: PropTypes.instanceOf(Date),
  excelReportTitle: PropTypes.string,
};
