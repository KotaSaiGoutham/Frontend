import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { motion } from "framer-motion";

const steps = [
  { label: "Contacted", icon: "📞" },
  { label: "Scheduled", icon: "🗓️" },
  { label: "Completed", icon: "✅" },
  { label: "Joined", icon: "🎯" },
];

const statusOrder = {
  Contacted: 0,
  "Demo scheduled": 1,
  Scheduled: 1,
  "Demo completed": 2,
  Completed: 2,
  Success: 3, // to support old status key
  Joined: 3,
};

const DemoProgressTracker = ({ currentStatus }) => {
  // Normalize status to handle all formats
  const normalizedStatus = (() => {
    const status = currentStatus?.trim();
    if (!status) return "Contacted";
    if (status === "Success") return "Joined";
    if (status === "Demo scheduled") return "Scheduled";
    if (status === "Demo completed") return "Completed";
    return status;
  })();

  const currentStep = statusOrder[normalizedStatus] ?? 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        p: 2.5,
        borderRadius: 3,
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
        border: "1px solid #e3f2fd",
        width: "100%",
        maxWidth: 600,
        mx: "auto",
      }}
    >
      {/* Header */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: "#1e1e2f",
          mb: 0.5,
        }}
      >
        Demo class
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "#666",
          mb: 2.5,
          fontSize: "0.9rem",
        }}
      >
        Lead from reference / other source
      </Typography>

      {/* Progress bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: 520,
          position: "relative",
          mb: 1.5,
        }}
      >
        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          const isCompleted = index < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.label}>
              {/* Step circle */}
              <Tooltip title={step.label} arrow>
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: isActive
                        ? "linear-gradient(135deg, #1976d2, #673ab7)"
                        : "#e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.4rem",
                      color: isActive ? "#fff" : "#555",
                      boxShadow: isActive
                        ? "0 0 10px rgba(25,118,210,0.3)"
                        : "none",
                      transition: "all 0.3s ease",
                      cursor: "default",
                      position: "relative",
                      top: "2px",
                    }}
                  >
                    {step.icon}
                  </Box>
                </motion.div>
              </Tooltip>

              {/* Connector line */}
              {!isLast && (
                <Box
                  sx={{
                    flexGrow: 1,
                    height: 4,
                    mx: 1.2,
                    borderRadius: 2,
                    alignSelf: "center",
                    background: isCompleted
                      ? "linear-gradient(90deg, #1976d2, #7b1fa2)"
                      : "#d0d0d0",
                    transition: "all 0.4s ease",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>

      {/* Step labels */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
          maxWidth: 520,
          mt: 0.5,
        }}
      >
        {steps.map((step, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{
              fontWeight: index === currentStep ? 700 : 500,
              color:
                index === currentStep
                  ? "#111"
                  : index < currentStep
                  ? "#555"
                  : "#999",
              fontSize: "0.85rem",
              textAlign: "center",
              width: "25%",
              lineHeight: 1.4,
              mt: 0.5,
            }}
          >
            {step.label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default DemoProgressTracker;
