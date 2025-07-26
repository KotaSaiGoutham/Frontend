import React, { useEffect, useState } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
  Box,
  Fade,
} from '@mui/material';
import {
  HourglassEmpty as PendingIcon,
  CheckCircle as SuccessIcon,
  Cancel as FailedIcon,
  Schedule as RescheduledIcon,
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';

// Icon bounce animation
const bounce = keyframes`
  0% { transform: scale(1); }
  40% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

// Background glow on status change
const glow = keyframes`
  0% { box-shadow: 0 0 0px rgba(0,0,0,0); }
  50% { box-shadow: 0 0 10px rgba(0,0,0,0.15); }
  100% { box-shadow: 0 0 0px rgba(0,0,0,0); }
`;

const statusConfig = {
  Pending: {
    label: "Pending",
    icon: <PendingIcon fontSize="small" />,
    backgroundColor: "#fff3cd",
    color: "#664d03",
  },
  Success: {
    label: "Success",
    icon: <SuccessIcon fontSize="small" />,
    backgroundColor: "#d1e7dd",
    color: "#0f5132",
  },
  Failed: {
    label: "Failed",
    icon: <FailedIcon fontSize="small" />,
    backgroundColor: "#f8d7da",
    color: "#842029",
  },
  Rescheduled: {
    label: "Rescheduled",
    icon: <RescheduledIcon fontSize="small" />,
    backgroundColor: "#cfe2ff",
    color: "#052c65",
  },
};

const TableStatusSelect = ({ value, onChange }) => {
  const statusOptions = Object.keys(statusConfig);
  const [selected, setSelected] = useState(value || '');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setSelected(value);
    if (value) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 600); // reset animation
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <Select
        value={selected}
        onChange={onChange}
        displayEmpty
        input={<OutlinedInput notched={false} />}
        renderValue={(selectedVal) => {
          const config = statusConfig[selectedVal];
          if (!config) return <Box>Select Status</Box>;

          return (
            <Fade in={!!selectedVal}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: config.backgroundColor,
                  color: config.color,
                  px: 1.5,
                  py: 0.6,
                  borderRadius: 1.5,
                  fontWeight: 600,
                  justifyContent: "center",
                  minWidth: "110px",
                  textAlign: "center",
                  transition: "all 0.4s ease",
                  animation: animate ? `${glow} 0.6s ease` : "none",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    animation: animate ? `${bounce} 0.4s ease` : "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {config.icon}
                </Box>
                {config.label}
              </Box>
            </Fade>
          );
        }}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
          '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
          '& .MuiSelect-icon': {
            color: '#1976d2',
            right: 8,
          },
        }}
      >
        {statusOptions.map((status) => {
          const config = statusConfig[status];
          return (
            <MenuItem
              key={status}
              value={status}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: config.backgroundColor,
                color: config.color,
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: config.backgroundColor,
                  opacity: 0.9,
                },
              }}
            >
              {config.icon}
              {config.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default TableStatusSelect;
