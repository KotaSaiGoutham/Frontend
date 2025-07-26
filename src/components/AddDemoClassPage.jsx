import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fa";

import { format, startOfDay, isValid } from "date-fns";

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
import { addDemoClass } from "../redux/actions";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddDemoClassPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading: addLoading,
    error: addError,
    addSuccess,
  } = useSelector((state) => state.demoClasses);
  console.log("addSuccess",addSuccess)

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
    notes: "",
  });

  const initialFormState = { ...formData };

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
    };

    dispatch(addDemoClass(dataToSend));
  };

  useEffect(() => {
    if (addSuccess) {
      setSnackbarSeverity("success");
      setSnackbarMessage("Demo class added successfully!");
      setSnackbarOpen(true);
      setFormData(initialFormState);
      setTimeout(() => {
        navigate("/demo-classes");
      }, 1500);
    } else if (addError) {
      setSnackbarSeverity("error");
      setSnackbarMessage(`Failed to add demo class: ${addError}`);
      setSnackbarOpen(true);
    }
  }, [addSuccess, addError, navigate, dispatch]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const minDateForPicker = startOfDay(new Date());

  return (
    <div className="add-student-page-container dashboard-container">
      <div className="dashboard-card add-student-form-card">
        <h2>
          <FaPlusCircle /> Add New Demo Class
        </h2>
        <form onSubmit={handleSubmit} className="add-student-form">
          <div className="add-student-form-section-title">
            Student Personal Details
          </div>
          <div className="add-student-form-grid">
            <MuiInput label="Student Name" icon={FaUser} name="studentName" value={formData.studentName} onChange={handleChange} placeholder="Enter student's full name" required />
            <MuiInput label="Contact No." icon={FaPhone} name="contactNo" value={formData.contactNo} onChange={handleChange} placeholder="e.g., +919876543210" type="tel" required />
            <MuiSelect label="Gender" icon={FaVenusMars} name="gender" value={formData.gender} onChange={handleChange} options={genderOptions} required />
          </div>

          <div className="add-student-form-section-title">
            Academic & Course Details
          </div>
          <div className="add-student-form-grid">
            <MuiSelect label="Year" icon={FaBookOpen} name="year" value={formData.year} onChange={handleChange} options={yearOptions} required />
            <MuiSelect label="Course" icon={FaGraduationCap} name="course" value={formData.course} onChange={handleChange} options={streamOptions} required />
            <MuiInput label="College/School Name" icon={FaUniversity} name="collegeName" value={formData.collegeName} onChange={handleChange} placeholder="Enter college/school name" />
            <MuiSelect label="Source" icon={FaCompass} name="source" value={formData.source} onChange={handleChange} options={sourceOptions} required />
          </div>

          <div className="add-student-form-section-title">
            Demo Class Schedule & Status
          </div>
          <div className="add-student-form-grid">
            <MuiDatePicker label="Demo Date" icon={FaCalendarAlt} name="demoDate" value={formData.demoDate} onChange={handleDatePickerChange} minDate={minDateForPicker} required />
            <MuiTimePicker label="Demo Time" icon={FaClock} name="demoTime" value={formData.demoTime} onChange={handleTimePickerChange} required />
            <MuiSelect label="Status" icon={FaInfoCircle} name="status" value={formData.status} onChange={handleChange} options={statusOptions} required />
            <MuiInput label="Notes (Optional)" icon={FaInfoCircle} name="notes" value={formData.notes} onChange={handleChange} placeholder="Any additional notes about the demo class" multiline rows={3} sx={{ gridColumn: "1 / -1" }} />
          </div>

          <div className="add-student-button-group">
            <MuiButton type="submit" variant="contained" startIcon={addLoading ? <CircularProgress size={20} color="inherit" /> : <FaPlusCircle />} disabled={addLoading} className="add-student-primary-button">
              {addLoading ? "Adding Demo..." : "Add Demo Class"}
            </MuiButton>
            <MuiButton type="button" variant="outlined" onClick={() => navigate("/demo-classes")} startIcon={<FaTimesCircle />} className="add-student-secondary-button">
              Cancel
            </MuiButton>
          </div>
        </form>

        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
          <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }} elevation={6} variant="filled">
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </div>
    </div>
  );
};

export default AddDemoClassPage;
