import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  OutlinedInput,
  InputAdornment,
  Box,
  styled,
  FormControl,
  Select,
  Chip,
  FormHelperText,
  InputLabel,
  Checkbox,
  useTheme,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { format, isValid, parseISO } from "date-fns";
import { FaTrashAlt } from "react-icons/fa";
import CancelIcon from "@mui/icons-material/Cancel";

const COMMON_FIELD_SX = {
  // Styles for the root Mui TextField component (which MuiSelect, DatePicker, TimePicker use)
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    height: "56px", // Fixed height for consistency
    // Styles for the actual input element inside
    "& .MuiInputBase-input": {
      padding: "16.5px 14px", // Standard MUI input padding
      height: "auto", // Allows content to dictate internal height, while root has fixed height
      boxSizing: "border-box", // Include padding in element's total width/height
    },
    // Specific adjustments for Select component's input
    "& .MuiSelect-select": {
      paddingRight: "32px !important", // Ensure space for the dropdown arrow
    },
  },
  // Label positioning for a 56px high field
  "& .MuiInputLabel-root": {
    transform: "translate(14px, 18px) scale(1)", // Adjusted initial label position
    "&.MuiInputLabel-shrink": {
      transform: "translate(14px, -9px) scale(0.75)",
    },
  },
  "& .MuiFormHelperText-root": {
    marginTop: "3px",
  },
};

// MuiInput Component
export const MuiInput = ({
  label,
  icon: Icon,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
  error = false,
  helperText = "",
}) => (
  <TextField
    label={
      <>
        {Icon && <Icon style={{ marginRight: 8, verticalAlign: "middle" }} />}
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
      ...COMMON_FIELD_SX, // Apply common styles
    }}
  />
);

// MuiSelect Component
export const MuiSelect = ({
  label,
  icon: Icon,
  name,
  value,
  onChange,
  options,
  required = false,
  error = false,
  helperText = "",
  disabled = false,
}) => (
  <TextField
    select
    label={
      <>
        {Icon && <Icon style={{ marginRight: 8, verticalAlign: "middle" }} />}
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
      ...COMMON_FIELD_SX, // Apply common styles
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
export const MuiDatePicker = ({
  label,
  icon: Icon,
  value,
  onChange,
  name,
  required = false,
  error = false,
  helperText = "",
  minDate,
  maxDate,
}) => {
  const dateValue =
    value && typeof value === "string" && isValid(parseISO(value))
      ? parseISO(value)
      : value instanceof Date && isValid(value)
      ? value
      : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={
          <>
            {Icon && (
              <Icon style={{ marginRight: 8, verticalAlign: "middle" }} />
            )}
            {label}
          </>
        }
        value={dateValue}
        onChange={(newValue) => {
          onChange(newValue ? format(newValue, "yyyy-MM-dd") : "");
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
              margin: "0",
              ...COMMON_FIELD_SX, // Apply common styles
              // Specific adjustment for DatePicker's adornment (icon)
              "& .MuiInputAdornment-root": {
                marginTop: "0px !important", // Prevents vertical misalignment
                height: "auto",
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

// MuiTimePicker Component (Assuming this also uses COMMON_FIELD_SX)
export const MuiTimePicker = ({
  label,
  icon: Icon,
  value,
  onChange,
  name,
  required = false,
  error = false,
  helperText = "",
  minTime,
  maxTime,
}) => {
  const timeValue = value instanceof Date && isValid(value) ? value : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        label={
          <>
            {Icon && (
              <Icon style={{ marginRight: 8, verticalAlign: "middle" }} />
            )}
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
              margin: "0",
              ...COMMON_FIELD_SX, // Apply common styles
              "& .MuiInputAdornment-root": {
                marginTop: "0px !important",
                height: "auto",
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};
export const MuiButton = ({
  children,
  onClick,
  variant = "contained",
  startIcon,
  sx,
  disabled = false,
  type,
}) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      startIcon={startIcon}
      disabled={disabled}
      type={type} // <--- AND PASS IT DOWN HERE
      sx={{
        borderRadius: "8px", // Consistent border radius
        textTransform: "none", // Prevent uppercase text by default
        fontWeight: 600,
        px: 3, // Horizontal padding
        py: 1.2, // Vertical padding
        minHeight: "48px", // Ensures a reasonable minimum height for buttons
        ...sx, // Allow custom styles to be passed in
      }}
    >
      {children}
    </Button>
  );
};
export const EnhancedMuiSelect = ({
  label,
  name,
  value,
  onChange,
  options, // Expected format: [{ value: '...', label: '...' }]
  icon: Icon, // Optional icon
  error,
  helperText,
  fullWidth = true,
  // New props for custom styling based on value
  getMenuItemSx, // Function: (optionValue) => sx_object
  getRenderValueSx, // Function: (selectedValue) => sx_object
  disableOutline = false, // To remove the border outline for table integration
  noPadding = false, // To remove default padding of the select input for table integration
  inputProps, // To pass additional props directly to the underlying OutlinedInput
  ...props // Allow other props to be passed to FormControl
}) => {
  const hasIcon = !!Icon;

  return (
    <FormControl
      fullWidth={fullWidth}
      margin="normal"
      error={!!error}
      {...props} // Apply any passed FormControl props
    >
      {label && (
        <InputLabel htmlFor={name} shrink variant="outlined">
          {label}
        </InputLabel>
      )}
      <Select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        displayEmpty
        input={
          <OutlinedInput
            id={`${name}-input`}
            startAdornment={
              hasIcon && (
                <InputAdornment position="start">
                  <Icon style={{ color: "#1976d2" }} />
                </InputAdornment>
              )
            }
            label={label}
            // `notched` only applies if `label` is present and using `OutlinedInput`
            notched={!!label}
            sx={{
              borderRadius: "8px",
              // Hide the outline if disableOutline is true
              "& .MuiOutlinedInput-notchedOutline": {
                ...(disableOutline && { border: "none" }),
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                ...(disableOutline && { border: "none" }),
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                ...(disableOutline && { border: "none" }),
              },
              // Adjust padding if noPadding is true, useful for table cells
              "& .MuiSelect-select": {
                ...(noPadding && {
                  paddingTop: "8px !important", // Adjust as needed
                  paddingBottom: "8px !important",
                  paddingLeft: hasIcon ? "0px !important" : "14px !important", // Adjust for icon presence
                  paddingRight: "32px !important", // Keep space for dropdown arrow
                  minHeight: "unset", // Override default min-height
                  lineHeight: "normal",
                  display: "flex",
                  alignItems: "center",
                }),
              },
              // Ensure the actual input element doesn't have extra padding
              "& .MuiInputBase-input": {
                ...(noPadding && {
                  paddingTop: "8px !important",
                  paddingBottom: "8px !important",
                }),
              },
              // Adjust icon position if padding is removed
              "& .MuiInputAdornment-root": {
                ...(noPadding && {
                  marginTop: "0px !important", // Align vertically
                  height: "auto",
                }),
              },
              // For table usage, remove margin for better fit if label is not needed
              ...(label ? {} : { margin: "0px" }),
              ...((disableOutline || noPadding) && {
                // Ensure no background color for the input field itself,
                // so the TableCell background can show through initially
                backgroundColor: "transparent",
              }),
            }}
            {...inputProps} // Pass any additional props to the OutlinedInput
          />
        }
        // Custom render value to apply background color to the selected item
        renderValue={(selected) => {
          const selectedOption = options.find(
            (option) => option.value === selected
          );
          const displayLabel = selectedOption ? selectedOption.label : "";
          const style = getRenderValueSx ? getRenderValueSx(selected) : {};

          // If no specific style, or empty value (like "All Statuses" for filter), just render the label
          if (Object.keys(style).length === 0 || !selected) {
            return <Box sx={{ display: "inline-block" }}>{displayLabel}</Box>;
          }

          // Otherwise, wrap in a Box to apply the styles
          return (
            <Box
              component="span"
              sx={{
                p: 0.5,
                borderRadius: 1,
                fontWeight: "bold",
                ...style, // Apply the styles from getRenderValueSx
                display: "inline-block", // Ensure padding works
                minWidth: "60px", // Ensure it doesn't collapse too much
                textAlign: "center",
                whiteSpace: "nowrap", // Prevent text wrap
              }}
            >
              {displayLabel}
            </Box>
          );
        }}
        // Styles for the dropdown arrow
        IconComponent={(props) => (
          <Box
            component="span"
            sx={{
              position: "absolute",
              right: 8, // Adjust position
              top: "50%",
              transform: "translateY(-50%)",
              color: "#1976d2", // Color for the dropdown arrow
              pointerEvents: "none", // Ensure it doesn't block clicks
              display: "flex", // For centering the icon itself if it's more complex
              alignItems: "center",
              justifyContent: "center",
            }}
            {...props}
          >
            {/* You can put a custom SVG icon here if you want */}
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              style={{ display: "block", fill: "currentColor" }}
            >
              <path d="M7 10l5 5 5-5z"></path>
            </svg>
          </Box>
        )}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={getMenuItemSx ? getMenuItemSx(option.value) : {}} // Apply custom styles to MenuItem
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export const MuiMultiSelectChip = ({
  label,
  name,
  value,
  onChange,
  options,
  MenuProps,
}) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const handleChange = (event) => {
    onChange(event);
  };

  return (
    <FormControl sx={{ m: 1, display: "inline-flex" }}>
      <InputLabel id={`select-label-${name}`}>{label}</InputLabel>
      <Select
        labelId={`select-label-${name}`}
        id={`select-${name}`}
        multiple
        value={value}
        onChange={handleChange}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        input={<OutlinedInput id="select-multiple-chip" label={label} />}
        renderValue={(selected) => (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              maxWidth: "100%",
            }}
          >
            {selected.map((selectedValue) => {
              const selectedOption = options.find(
                (option) => option.value === selectedValue
              );
              return (
                <Chip
                  key={selectedValue}
                  label={selectedOption ? selectedOption.label : ""}
                  color="primary"
                  onDelete={() => {
                    const newValues = value.filter((v) => v !== selectedValue);
                    onChange({
                      target: { name, value: newValues },
                    });
                  }}
                  deleteIcon={
                    <CancelIcon onMouseDown={(e) => e.stopPropagation()} />
                  }
                />
              );
            })}
          </Box>
        )}
        MenuProps={MenuProps}
        sx={{
          display: "inline-flex", // 👈 only as wide as content
          maxWidth: 750, // 👈 limit max size
          minWidth: 150, // 👈 small safety minimum
        }}
      >
        {options.map((option) => {
          const isSelected = value.includes(option.value);
          return (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                backgroundColor: isSelected
                  ? theme.palette.action.hover
                  : "inherit",
                "&:hover": {
                  backgroundColor: theme.palette.action.selected,
                },
              }}
            >
              <Checkbox checked={isSelected} />
              {option.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
