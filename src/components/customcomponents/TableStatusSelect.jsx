import React, { useEffect, useState } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
  Box,
  Fade,
  IconButton, Tooltip, Divider
} from '@mui/material';
import {
  HourglassEmpty as PendingIcon,
  CheckCircle as SuccessIcon,
  Cancel as FailedIcon,
  Schedule as RescheduledIcon,
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

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


const TableStatusSelect = ({ value, onChange,options }) => {
  const statusOptions = Object.keys(options);
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
          const config = options[selectedVal];
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
          const config = options[status];
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


export const EditButton = ({ onClick, size = 'medium' }) => (
  <Tooltip title="Edit" arrow placement="top" TransitionComponent={Fade} TransitionProps={{ timeout: 300 }}>
    <IconButton
      size={size}
      sx={{
        p: 1.25,
        color: "primary.main",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        borderRadius: "10px",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(33,150,243,0.15), rgba(33,150,243,0.3))",
          opacity: 0,
          transition: "all 0.3s ease",
        },
        "&:hover::before": { 
          opacity: 1,
        },
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(33, 150, 243, 0.2)",
        },
        "& svg": {
          transition: "all 0.3s ease",
        },
        "&:hover svg": {
          transform: "scale(1.15)",
        },
      }}
      onClick={onClick}
    >
      <FaEdit style={{ fontSize: '1rem' }} />
    </IconButton>
  </Tooltip>
);

export const DeleteButton = ({ onClick, size = 'medium' }) => (
  <Tooltip title="Delete" arrow placement="top" TransitionComponent={Fade} TransitionProps={{ timeout: 300 }}>
    <IconButton
      size={size}
      sx={{
        p: 1.25,
        color: "error.main",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        borderRadius: "10px",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(244,67,54,0.15), rgba(244,67,54,0.3))",
          opacity: 0,
          transition: "all 0.3s ease",
        },
        "&:hover::before": { 
          opacity: 1,
        },
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
        },
        "& svg": {
          transition: "all 0.3s ease",
        },
        "&:hover svg": {
          transform: "scale(1.15)",
        },
      }}
      onClick={onClick}
    >
      <FaTrashAlt style={{ fontSize: '1rem' }} />
    </IconButton>
  </Tooltip>
);

export const ActionButtons = ({ onEdit, onDelete, size = 'medium' }) => (
  <>
    <EditButton onClick={onEdit} size={size} />
    <Divider 
      orientation="vertical" 
      flexItem 
      sx={{ 
        my: 0.5, 
        height: 24,
        borderColor: 'rgba(0, 0, 0, 0.08)',
        alignSelf: 'center'
      }} 
    />
    <DeleteButton onClick={onDelete} size={size} />
  </>
);