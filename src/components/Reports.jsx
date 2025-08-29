import React, { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { FaCalendarAlt, FaDownload } from "react-icons/fa";
import { MuiSelect, MuiButton } from "./customcomponents/MuiCustomFormFields";

import { reportTypeOptions, exportTypeOptions } from "../mockdata/Options";

const Reports = () => {
  const [reportType, setReportType] = useState("");
  const [exportType, setExportType] = useState("");

  const handleReportChange = (e) => {
    setReportType(e.target.value);
  };

  const handleExportChange = (e) => {
    setExportType(e.target.value);
  };

  const handleDownload = () => {
    if (!reportType || !exportType) {
      alert("Please select both report type and export type.");
      return;
    }
    console.log(`Downloading ${reportType} as ${exportType.toUpperCase()}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f8fc",
        p: "30px", // Added padding 30px
      }}
    >
      {/* Header */}
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ mb: 2, color: "#333" }}
      >
        Reports
      </Typography>

      {/* Top filter bar */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 2,
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // column on mobile, row on larger screens
          gap: 2,
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "flex-start",
          backgroundColor: "white",
        }}
      >
        {/* Select Report Type */}
        <MuiSelect
          label="Select Report"
          name="reportType"
          value={reportType}
          onChange={handleReportChange}
          options={reportTypeOptions}
          icon={FaCalendarAlt}
          sx={{ minWidth: 220, flex: 1 }}
        />

        {/* Select Export Type */}
        <MuiSelect
          label="Export As"
          name="exportType"
          value={exportType}
          onChange={handleExportChange}
          options={exportTypeOptions}
          icon={FaCalendarAlt}
          sx={{ minWidth: 180, flex: 1 }}
        />

        {/* Download Button */}
        <MuiButton
          variant="contained"
          color="primary"
          startIcon={<FaDownload />}
          onClick={handleDownload}
          sx={{ px: 3, py: 1.5, flexShrink: 0 }}
        >
          Download
        </MuiButton>
      </Paper>

      {/* Future tables will go here */}
      <Box>
        {/* <YourTableComponent /> */}
      </Box>
    </Box>
  );
};

export default Reports;
