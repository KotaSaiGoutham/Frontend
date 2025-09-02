import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUser,
  FaPhone,
  FaCompass,
  FaBookOpen,
  FaGraduationCap,
  FaUniversity,
  FaCalendarAlt,
  FaClock,
  FaInfoCircle,
  FaPlusCircle,
  FaTimesCircle,
  FaVenusMars,
  FaEdit,
} from "react-icons/fa";

import { format, startOfDay, isValid, parse, parseISO } from "date-fns";

import { Snackbar, Alert as MuiAlert, CircularProgress } from "@mui/material";

import {
  MuiInput,
  MuiSelect,
  MuiButton,
  MuiDatePicker,
  MuiTimePicker,
} from "./customcomponents/MuiCustomFormFields";

import {
  streamOptions,
  sourceOptions,
  yearOptions,
  genderOptions,
  statusOptions,
} from "../mockdata/Options";
import { addDemoClass, updateDemoClass } from "../redux/actions";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddDemoClassPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    loading: addLoading,
    error: addError,
    addSuccess,
    updateSuccess,
  } = useSelector((state) => state.demoClasses);
  const { user } = useSelector((state) => state.auth);

  // Get demoToEdit from the location state
  const demoToEdit = location.state?.demoToEdit;
  console.log("demoToEdit",demoToEdit)

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [formData, setFormData] = useState({
    studentName: "",
    contactNo: "",
    gender: "",
    source: "",
    year: "",
    course: "",
    collegeName: "",
    demoDate: "",
    demoTime: null,
    status: "Pending",
    remarks: "",
  });

  // Effect to pre-fill the form if a demo class is being edited
  useEffect(() => {
    if (demoToEdit) {
      setFormData({
        studentName: demoToEdit.studentName || "",
        contactNo: demoToEdit.contactNo || "",
        gender: demoToEdit.gender || "",
        source: demoToEdit.source || "",
        year: demoToEdit.year || "",
        course: demoToEdit.course || "",
        collegeName: demoToEdit.collegeName || "",
        // Dates need to be parsed from ISO string
        demoDate: demoToEdit.demoDate ? parseISO(demoToEdit.demoDate) : "",
        // Time needs to be parsed from string
        demoTime: demoToEdit.demoTime
          ? parse(demoToEdit.demoTime, "HH:mm", new Date())
          : null,
        status: demoToEdit.status || "Pending",
        remarks: demoToEdit.remarks || "",
      });
    }
  }, [demoToEdit]);

  useEffect(() => {
    if (addSuccess) {
      setSnackbarSeverity("success");
      setSnackbarMessage("Demo class added successfully!");
      setSnackbarOpen(true);
      setFormData({
        studentName: "",
        contactNo: "",
        gender: "",
        source: "",
        year: "",
        course: "",
        collegeName: "",
        demoDate: "",
        demoTime: null,
        status: "Pending",
        remarks: "",
      });
      setTimeout(() => navigate("/demo-classes"), 1500);
    } else if (updateSuccess) {
      setSnackbarSeverity("success");
      setSnackbarMessage("Demo class updated successfully!");
      setSnackbarOpen(true);
      setTimeout(() => navigate("/demo-classes"), 1500);
    } else if (addError) {
      setSnackbarSeverity("error");
      setSnackbarMessage(`Failed to add demo class: ${addError}`);
      setSnackbarOpen(true);
    }
  }, [addSuccess, updateSuccess, addError, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDatePickerChange = (eventLikeObject) => {
    const { name, value } = eventLikeObject.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTimePickerChange = (name, timeObject) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: timeObject,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnackbarOpen(false);
    setSnackbarMessage("");
    setSnackbarSeverity("success");

    // Form validation
    if (
      !formData.studentName ||
      !formData.contactNo ||
      !formData.gender ||
      !formData.source ||
      !formData.year ||
      !formData.course ||
      !formData.demoDate ||
      !formData.demoTime ||
      !isValid(formData.demoTime) ||
      !formData.status
    ) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarOpen(true);
      return;
    }

    const formattedDemoTime = formData.demoTime
      ? format(formData.demoTime, "HH:mm")
      : "";

    const dataToSend = {
      ...formData,
      demoTime: formattedDemoTime,
      Subject: user.isPhysics ? "Physics" : user.isChemistry ? "Chemistry" : "",
    };

    if (demoToEdit) {
      // Update existing demo class
      dispatch(updateDemoClass({ ...dataToSend, id: demoToEdit.id }));
    } else {
      // Add new demo class
      dispatch(addDemoClass(dataToSend));
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const minDateForPicker = startOfDay(new Date());
  const isUpdating = !!demoToEdit;

  return (
    <div className="add-student-page-container dashboard-container">
      <div className="dashboard-card add-student-form-card">
        <h2>
          {isUpdating ? <FaEdit /> : <FaPlusCircle />}
          {isUpdating ? "Update Demo Class" : "Add New Demo Class"}
        </h2>
        <form onSubmit={handleSubmit} className="add-student-form">
          <div className="add-student-form-section-title">
            Student Personal Details
          </div>
          <div className="add-student-form-grid">
            <MuiInput
              label="Student Name"
              icon={FaUser}
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="Enter student's full name"
              required
            />
            <MuiInput
              label="Contact No."
              icon={FaPhone}
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              placeholder="e.g., +919876543210"
              type="tel"
              required
            />
            <MuiSelect
              label="Gender"
              icon={FaVenusMars}
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={genderOptions}
              required
            />
          </div>

          <div className="add-student-form-section-title">
            Academic & Course Details
          </div>
          <div className="add-student-form-grid">
            <MuiSelect
              label="Year"
              icon={FaBookOpen}
              name="year"
              value={formData.year}
              onChange={handleChange}
              options={yearOptions}
              required
            />
            <MuiSelect
              label="Course"
              icon={FaGraduationCap}
              name="course"
              value={formData.course}
              onChange={handleChange}
              options={streamOptions}
              required
            />
            <MuiInput
              label="College/School Name"
              icon={FaUniversity}
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              placeholder="Enter college/school name"
            />
            <MuiSelect
              label="Source"
              icon={FaCompass}
              name="source"
              value={formData.source}
              onChange={handleChange}
              options={sourceOptions}
              required
            />
          </div>

          <div className="add-student-form-section-title">
            Demo Class Schedule & Status
          </div>
          <div className="add-student-form-grid">
            <MuiDatePicker
              label="Demo Date"
              icon={FaCalendarAlt}
              name="demoDate"
              value={formData.demoDate}
              onChange={handleDatePickerChange}
              minDate={minDateForPicker}
              required
            />
            <MuiTimePicker
              label="Demo Time"
              icon={FaClock}
              name="demoTime"
              value={formData.demoTime}
              onChange={handleTimePickerChange}
              required
            />
            <MuiSelect
              label="Status"
              icon={FaInfoCircle}
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
              required
            />
            <MuiInput
              label="Remarks (Optional)"
              icon={FaInfoCircle}
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Any additional Remarks about the demo class"
              multiline
              rows={3}
              sx={{ gridColumn: "1 / -1" }}
            />
          </div>

          <div className="add-student-button-group">
            <MuiButton
              type="submit"
              variant="contained"
              startIcon={
                addLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : isUpdating ? (
                  <FaEdit />
                ) : (
                  <FaPlusCircle />
                )
              }
              disabled={addLoading}
              className="add-student-primary-button"
            >
              {addLoading
                ? isUpdating
                  ? "Updating Demo..."
                  : "Adding Demo..."
                : isUpdating
                ? "Update Demo Class"
                : "Add Demo Class"}
            </MuiButton>
            <MuiButton
              type="button"
              variant="outlined"
              onClick={() => navigate("/demo-classes")}
              startIcon={<FaTimesCircle />}
              className="add-student-secondary-button"
            >
              Cancel
            </MuiButton>
          </div>
        </form>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MuiAlert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
            elevation={6}
            variant="filled"
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </div>
    </div>
  );
};

export default AddDemoClassPage;