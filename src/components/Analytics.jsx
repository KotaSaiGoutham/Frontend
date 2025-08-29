import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Slide,
  Button as MuiButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Tooltip,
  IconButton,
  Menu, // Import Menu
  MenuItem, // Import MenuItem
  ListItemIcon, // Import ListItemIcon
  ListItemText, // Import ListItemText
  Dialog, // Import Dialog for confirmation
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  FaChalkboardTeacher,
  FaSearch,
  FaUserCircle,
  FaPhone,
  FaUniversity,
  FaCalendarCheck,
  FaSearchDollar,
  FaPlus,
  FaArrowRight,
  FaEdit,
  FaTrashAlt,
  FaEllipsisV, // Import the ellipsis icon
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { streamOptions, yearOptions, statusOptions } from "../mockdata/Options";

import {
  MuiInput,
  MuiDatePicker,
  MuiSelect,
} from "./customcomponents/MuiCustomFormFields";

import TableStatusSelect from "./customcomponents/TableStatusSelect";
import {
  fetchDemoClasses,
  updateDemoClassStatus,
  deleteDemoClass,
} from "../redux/actions";
import { ActionButtons } from "./customcomponents/TableStatusSelect";
import TableHeaders from "./students/TableHeaders";
import { demoTableColumns } from "../mockdata/Options";
const Analytics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f8fc",
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
    </Box>
  );
};

export default Analytics;
