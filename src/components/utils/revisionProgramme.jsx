import React, { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaTransgender,
  FaPhone,
  FaEnvelope,
  FaUserPlus,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaClock,
  FaSchool,
  FaBook,
  FaChalkboardTeacher,
  FaUniversity,
  FaSearch,
  FaQuestionCircle,
  FaPlus,
} from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {
  MuiButton,
  MuiInput,
  MuiSelect,
} from "../customcomponents/MuiCustomFormFields";
import "../AddStudent.css";
import { useDispatch, useSelector } from "react-redux";
import { genderOptions } from "../../mockdata/Options";
import { addrevisionProgrammestudent } from "../../redux/actions";

const classOptions = [
  { value: "8th", label: "8th" },
  { value: "9th", label: "9th" },
  { value: "10th", label: "10th" },
  { value: "11th", label: "11th" },
  { value: "12th", label: "12th" },
];

const boardOptions = [
  { value: "CBSE", label: "CBSE" },
  { value: "ICSE", label: "ICSE" },
  { value: "State", label: "State" },
  { value: "Other", label: "Other" },
];

const subjectOptions = [
  { value: "ONLYCHEM", label: "ONLY CHEM" },
  { value: "ONLY PHYSICS", label: "ONLY PHYSICS" },
  { value: "ONLY MATHS", label: "ONLY MATHS" },
  { value: "PHY + CHEM", label: "PHY + CHEM" },
  { value: "PHY +CHEM+MATHS", label: "PHY + CHEM + MATHS" },
  { value: "MATHS + PHY", label: "MATHS + PHY" },
];

const courseOptions = [
  { value: "IIT-JEE", label: "IIT-JEE" },
  { value: "NEET", label: "NEET" },
];

const batchOptions = [
  { value: "Morning", label: "Morning" },
  { value: "Evening", label: "Evening" },
];

const sourceOptions = [
  { value: "Friends", label: "Friends" },
  { value: "Social Media", label: "Social Media" },
  { value: "Website", label: "Website" },
  { value: "Other", label: "Other" },
];

const initialData = {
  fullName: "",
  gender: "",
  studentContactNumber: "",
  emailAddress: "",
  parentContactNumber: "",
  city: "",
  state: "",
  currentClass: "",
  schoolCollegeName: "",
  board: "",
  subjects: "",
  courseAppliedFor: "",
  batchPreference: "",
  howDidYouHearAboutUs: "",
  specialRequirements: "",
};

const RevisionProgramme = () => {
  const dispatch = useDispatch();
    const navigate = useNavigate();

  const { addingStudent, error } = useSelector((state) => state.studentprogram);

  const [formData, setFormData] = useState(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!addingStudent) {
      if (!error && Object.values(formData).some((value) => value !== "")) {
        // Form was successfully submitted
        setDialogOpen(true);
      }
    }
  }, [addingStudent, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormData(initialData);
            navigate('/'); // Redirect to login page

  };

const handleSubmit = (e) => {
  e.preventDefault();

  if (
    !formData.fullName ||
    !formData.gender ||
    !formData.studentContactNumber ||
    !formData.parentContactNumber ||
    !formData.currentClass ||
    !formData.board ||
    !formData.subjects ||
    !formData.courseAppliedFor ||
    !formData.batchPreference
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  // Define the two static payment installments
  const paymentPlan = [
    {
      installment: 1,
      dueDate: "2025-10-01T00:00:00.000Z", // October 1st, 2025
      amount: 35000, // 35000 / 2
      status: "Unpaid",
    },
    {
      installment: 2,
      dueDate: "2025-11-15T00:00:00.000Z", // November 15th, 2025
      amount: 35000, // 35000 / 2
      status: "Unpaid",
    },
  ];

  // Dispatch the action with the new formData, including the payments array
  dispatch(addrevisionProgrammestudent({
    ...formData,
    status:"Pending",
    payments: paymentPlan,
  }));
};

  return (
    <div className="dashboard-card add-student-form-card">
      <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        Student Details
      </h2>
      <form onSubmit={handleSubmit} className="add-student-form">
        {/* Personal Details Section */}
        <div className="add-student-form-section-title">Personal Details</div>
        <div className="add-student-form-grid">
          <MuiInput
            label="Full Name"
            icon={FaUserCircle}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <MuiSelect
            label="Gender"
            icon={FaTransgender}
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={genderOptions}
            required
          />
          <MuiInput
            label="Student Contact"
            icon={FaPhone}
            name="studentContactNumber"
            value={formData.studentContactNumber}
            onChange={handleChange}
            required
          />
          <MuiInput
            label="Email Address"
            icon={FaEnvelope}
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleChange}
            type="email"
          />
          <MuiInput
            label="Parent Contact"
            icon={FaPhone}
            name="parentContactNumber"
            value={formData.parentContactNumber}
            onChange={handleChange}
            required
          />
        </div>
        {/* Address Details Section */}
        <div className="add-student-form-section-title">Address Details</div>
        <div className="add-student-form-grid">
          <MuiInput
            label="City"
            icon={FaMapMarkerAlt}
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          <MuiInput
            label="State"
            icon={FaMapMarkerAlt}
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </div>
        {/* Academic Details Section */}
        <div className="add-student-form-section-title">Academic Details</div>
        <div className="add-student-form-grid">
          <MuiSelect
            label="Current Class"
            icon={FaSchool}
            name="currentClass"
            value={formData.currentClass}
            onChange={handleChange}
            options={classOptions}
            required
          />
          <MuiInput
            label="School/College Name"
            icon={FaUniversity}
            name="schoolCollegeName"
            value={formData.schoolCollegeName}
            onChange={handleChange}
          />
          <MuiSelect
            label="Board"
            icon={FaBook}
            name="board"
            value={formData.board}
            onChange={handleChange}
            options={boardOptions}
            required
          />
          <MuiSelect
            label="Subjects"
            icon={FaChalkboardTeacher}
            name="subjects"
            value={formData.subjects}
            onChange={handleChange}
            options={subjectOptions}
            required
          />
        </div>
        {/* Course & Batch Section */}
        <div className="add-student-form-section-title">Course Enrolled</div>
        <div className="add-student-form-grid">
          <MuiSelect
            label="Course Applied For"
            icon={FaGraduationCap}
            name="courseAppliedFor"
            value={formData.courseAppliedFor}
            onChange={handleChange}
            options={courseOptions}
            required
          />
          <MuiSelect
            label="Batch Preference"
            icon={FaClock}
            name="batchPreference"
            value={formData.batchPreference}
            onChange={handleChange}
            options={batchOptions}
            required
          />
        </div>
        {/* Additional Information Section */}
        <div className="add-student-form-section-title">
          Additional Information
        </div>
        <div className="add-student-form-grid">
          <MuiSelect
            label="How did you hear about us?"
            icon={FaSearch}
            name="howDidYouHearAboutUs"
            value={formData.howDidYouHearAboutUs}
            onChange={handleChange}
            options={sourceOptions}
          />
          <MuiInput
            label="Any special requirements"
            icon={FaQuestionCircle}
            name="specialRequirements"
            value={formData.specialRequirements}
            onChange={handleChange}
          />
        </div>
        <div className="add-student-button-group-center">
          <button
            type="submit"
            className="add-student-primary-button"
            disabled={addingStudent}
          >
            {" "}
            {addingStudent ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            animation:
              "dialogSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            borderRadius: "16px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            overflow: "hidden",
            maxWidth: "450px",
            width: "90%",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#4caf50",
            background: "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
            color: "white",
            fontWeight: "700",
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "1.25rem",
          }}
        >
          <div
            style={{
              animation: "iconPulse 1s ease-in-out infinite",
              display: "flex",
              alignItems: "center",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                fill="white"
              />
            </svg>
          </div>
          Registration Successful!
        </DialogTitle>
        <DialogContent sx={{ padding: "30px 24px 20px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "10px 0",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                position: "relative",
                animation:
                  "checkmarkScale 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  right: "0",
                  bottom: "0",
                  borderRadius: "50%",
                  border: "2px solid #4caf50",
                  opacity: "0.3",
                  animation: "circlePulse 2s ease-out infinite",
                }}
              ></div>
              <svg
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="#4caf50"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                }}
              >
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
              </svg>
            </div>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#2e7d32",
              }}
            >
              Welcome to the Program!
            </h3>
            <p
              style={{
                margin: "0 0 20px 0",
                fontSize: "16px",
                lineHeight: "1.6",
                color: "#555",
              }}
            >
              Thank you for joining our revision program. Our team will contact
              you shortly with further details.
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#f1f8e9",
                padding: "12px 16px",
                borderRadius: "8px",
                marginTop: "10px",
                width: "100%",
                animation: "fadeIn 0.5s ease-out 0.4s both",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#689f38"
                style={{ marginRight: "10px", flexShrink: 0 }}
              >
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 15L12.5 12.2V7Z" />
              </svg>
              <span style={{ fontSize: "14px", color: "#33691e" }}>
                You'll receive a confirmation call within 24 hours
              </span>
            </div>
          </div>
        </DialogContent>
        <DialogActions
          sx={{
            padding: "0 24px 24px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={handleDialogClose}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)",
                boxShadow: "0 6px 12px rgba(56, 142, 60, 0.3)",
              },
              borderRadius: "50px",
              padding: "10px 36px",
              textTransform: "none",
              fontWeight: "600",
              fontSize: "16px",
              boxShadow: "0 4px 8px rgba(56, 142, 60, 0.25)",
              transition: "all 0.3s ease",
              animation: "buttonSlideIn 0.5s ease-out 0.3s both",
              minWidth: "160px",
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RevisionProgramme;