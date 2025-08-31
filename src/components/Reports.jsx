import React, { useState, useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { FaCalendarAlt } from "react-icons/fa";
import { MuiSelect } from "./customcomponents/MuiCustomFormFields";
import StudentReport from "./reports/StudentReport";
import TodayTimetablePdfButton from "./reports/TodayTimetablePdfButton"; // Import the new component
import { reportTypeOptions, exportTypeOptions } from "../mockdata/Options";
import WeeklyTimetableExcelButton from "./reports/WeeklyTimetableExcelButton";

const Reports = () => {
  const [reportType, setReportType] = useState("");

  const handleReportChange = (e) => {
    setReportType(e.target.value);
  };

  const renderReportComponent = () => {
    switch (reportType) {
      case "studentData":
        return <StudentReport />;
      case "todayTimetable":
        return <TodayTimetablePdfButton />;
          case "monthlyTimetable":
        return <WeeklyTimetableExcelButton />;
      default:
        
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f8fc",
        p: "30px",
      }}
    >
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: "#333" }}>
        Reports
      </Typography>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 2,
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "flex-start",
          backgroundColor: "white",
        }}
      >
        <MuiSelect
          label="Select Report"
          name="reportType"
          value={reportType}
          onChange={handleReportChange}
          options={reportTypeOptions}
          icon={FaCalendarAlt}
          sx={{ minWidth: 220, flex: 1 }}
        />
        {/* The export type selector and download button are now rendered by the specific report component */}
        {/*
        <MuiSelect
          label="Export As"
          name="exportType"
          value={exportType}
          onChange={handleExportChange}
          options={exportTypeOptions}
          icon={FaCalendarAlt}
          sx={{ minWidth: 180, flex: 1 }}
          disabled={reportType === "studentData"}
        />

        {reportType !== "studentData" && (
          <MuiButton
            variant="contained"
            color="primary"
            startIcon={<FaDownload />}
            sx={{ px: 3, py: 1.5, flexShrink: 0 }}
          >
            Download
          </MuiButton>
        )}
        */}
      </Paper>
      <Box>{renderReportComponent()}</Box>
    </Box>
  );
};

export default Reports;
