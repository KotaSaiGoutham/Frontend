// src/components/MuiCustomFormFields.jsx

import React from 'react';
import { TextField, MenuItem,Button  } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format, isValid, parseISO } from 'date-fns';

const COMMON_FIELD_SX = {
  // Styles for the root Mui TextField component (which MuiSelect, DatePicker, TimePicker use)
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    height: '56px', // Fixed height for consistency
    // Styles for the actual input element inside
    '& .MuiInputBase-input': {
      padding: '16.5px 14px', // Standard MUI input padding
      height: 'auto', // Allows content to dictate internal height, while root has fixed height
      boxSizing: 'border-box', // Include padding in element's total width/height
    },
    // Specific adjustments for Select component's input
    '& .MuiSelect-select': {
      paddingRight: '32px !important', // Ensure space for the dropdown arrow
    },
  },
  // Label positioning for a 56px high field
  '& .MuiInputLabel-root': {
    transform: 'translate(14px, 18px) scale(1)', // Adjusted initial label position
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
    },
  },
  '& .MuiFormHelperText-root': {
    marginTop: '3px',
  }
};


// MuiInput Component
export const MuiInput = ({ label, icon: Icon, name, value, onChange, placeholder, required = false, type = "text", error = false, helperText = '' }) => (
  <TextField
    label={
      <>
        {Icon && <Icon style={{ marginRight: 8, verticalAlign: 'middle' }} />}
        {label}
      </>
    }
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    type={type}
    error={error}
    helperText={helperText}
    fullWidth
    variant="outlined"
    sx={{
      margin: "0",
      ...COMMON_FIELD_SX // Apply common styles
    }}
  />
);

// MuiSelect Component
export const MuiSelect = ({ label, icon: Icon, name, value, onChange, options, required = false, error = false, helperText = '', disabled = false }) => (
  <TextField
    select
    label={
      <>
        {Icon && <Icon style={{ marginRight: 8, verticalAlign: 'middle' }} />}
        {label}
      </>
    }
    name={name}
    value={value}
    onChange={onChange}
    required={required}
    error={error}
    helperText={helperText}
    fullWidth
    variant="outlined"
    disabled={disabled}
    sx={{
      margin: "0",
      ...COMMON_FIELD_SX // Apply common styles
    }}
  >
    {options.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>
);

// MuiDatePicker Component
export const MuiDatePicker = ({ label, icon: Icon, value, onChange, name, required = false, error = false, helperText = '', minDate, maxDate }) => {
  const dateValue = value && typeof value === 'string' && isValid(parseISO(value))
    ? parseISO(value)
    : (value instanceof Date && isValid(value) ? value : null);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={
          <>
            {Icon && <Icon style={{ marginRight: 8, verticalAlign: 'middle' }} />}
            {label}
          </>
        }
        value={dateValue}
        onChange={(newValue) => {
          onChange({
            target: {
              name: name,
              value: newValue ? format(newValue, 'yyyy-MM-dd') : '',
            },
          });
        }}
        format="dd/MM/yyyy"
        minDate={minDate}
        maxDate={maxDate}
        slotProps={{
          textField: {
            fullWidth: true,
            variant: "outlined",
            required: required,
            error: error,
            helperText: helperText,
            InputLabelProps: {
              shrink: true,
            },
            sx: {
              margin: '0',
              ...COMMON_FIELD_SX, // Apply common styles
              // Specific adjustment for DatePicker's adornment (icon)
              '& .MuiInputAdornment-root': {
                marginTop: '0px !important', // Prevents vertical misalignment
                height: 'auto',
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

// MuiTimePicker Component (Assuming this also uses COMMON_FIELD_SX)
export const MuiTimePicker = ({ label, icon: Icon, value, onChange, name, required = false, error = false, helperText = '', minTime, maxTime }) => {
  const timeValue = value instanceof Date && isValid(value) ? value : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        label={
          <>
            {Icon && <Icon style={{ marginRight: 8, verticalAlign: 'middle' }} />}
            {label}
          </>
        }
        value={timeValue}
        onChange={(newValue) => {
          onChange(name, newValue);
        }}
        format="hh:mm a"
        minTime={minTime}
        maxTime={maxTime}
        slotProps={{
          textField: {
            fullWidth: true,
            variant: "outlined",
            required: required,
            error: error,
            helperText: helperText,
            InputLabelProps: {
              shrink: true,
            },
            sx: {
              margin: '0',
              ...COMMON_FIELD_SX, // Apply common styles
              '& .MuiInputAdornment-root': {
                marginTop: '0px !important',
                height: 'auto',
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};
export const MuiButton = ({ children, onClick, variant = 'contained', startIcon, sx, disabled = false }) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      startIcon={startIcon}
      disabled={disabled}
      sx={{
        borderRadius: '8px', // Consistent border radius
        textTransform: 'none', // Prevent uppercase text by default
        fontWeight: 600,
        px: 3, // Horizontal padding
        py: 1.2, // Vertical padding
        minHeight: '48px', // Ensures a reasonable minimum height for buttons
        ...sx, // Allow custom styles to be passed in
      }}
    >
      {children}
    </Button>
  );
};