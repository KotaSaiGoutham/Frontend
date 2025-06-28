// AddWeeklyMarksForm.jsx
import React, { useState, useEffect } from "react";
import { FaTimesCircle, FaPlusCircle, FaTrashAlt } from "react-icons/fa";
// Ensure these are correctly importing standard HTML elements or correctly configured MUI components
import { MuiInput, MuiButton } from "./customcomponents/MuiCustomFormFields"; // Removed MuiDatePicker as it's not used here
import "./AddWeeklyMarksForm.css";
import { Stack } from "@mui/material"; // You still need to import Stack for layout
// Define the mark schemes outside the component to prevent re-creation on every render
import { addWeeklyMarks,fetchWeeklyMarks } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";

const MARK_SCHEMES = {
  JEE: {
    Maths: 100,
    Physics: 100,
    Chemistry: 100,
  },
  NEET: {
    Botany: 180,
    Zoology: 180,
    Physics: 180,
    Chemistry: 180,
  },
  FOUNDATION: {
    Maths: 15,
    Physics: 15,
    Chemistry: 15,
  },
  BITSAT: {
    Maths: 120,
    Physics: 90,
    Chemistry: 90,
    English: 30,
    "Logical Reasoning": 60,
  },
  CBSE: {
    Maths: 35,
    Physics: 35,
    Chemistry: 35,
  },
  // 'Others' will be handled by dynamic custom fields
};

const AddWeeklyMarksModal = ({
  studentId,
  onClose,
  onMarksAdded,
  programType,
}) => {
  const dispatch = useDispatch();
  const { addingMarks, addMarksError, addMarksSuccess } = useSelector(
    (state) => state.students
  ); // Assuming state.studentPortfolio

  const [marksInput, setMarksInput] = useState({});
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Initialize marksInput and customFields based on programType
  useEffect(() => {
    setMarksInput({}); // Reset for new program type
    setCustomFields([]); // Reset custom fields

    const scheme = MARK_SCHEMES[programType];
    if (scheme) {
      const initialMarks = {};
      for (const subject in scheme) {
        // Ensure keys are lowercase and spaces removed for consistency
        initialMarks[subject.toLowerCase().replace(/\s/g, "")] = "";
      }
      setMarksInput(initialMarks);
    } else if (programType === "Others") {
      setCustomFields([
        { id: Date.now(), subjectName: "", mark: "", maxMark: "" },
      ]);
    }
  }, [programType]);

  const handleMarkChange = (subject, value) => {
    // Ensure value is a string to allow empty input (e.g., "" to clear field)
    setMarksInput((prev) => ({ ...prev, [subject]: value }));
  };

  const handleCustomFieldChange = (id, fieldName, value) => {
    setCustomFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, [fieldName]: value } : field
      )
    );
  };

  const addCustomField = () => {
    setCustomFields((prev) => [
      ...prev,
      { id: Date.now(), subjectName: "", mark: "", maxMark: "" },
    ]);
  };

  const removeCustomField = (id) => {
    setCustomFields((prev) => prev.filter((field) => field.id !== id));
  };

  const handleSubmit = async () => {
    console.log("handleSubmit triggered!");

    setLoading(true);
    setError(null); // Clear any previous errors at the start of submission attempt
    setSuccess(false);

    const authToken = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!authToken) {
      setError("Authentication token missing. Please log in.");
      setLoading(false);
      return;
    }

    const newMark = {
      Date: new Date().toLocaleDateString("en-GB"), // Using dd/mm/yyyy format
      userId: userId,
    };

    const currentScheme = MARK_SCHEMES[programType];

    let hasValidationError = false; // Flag to track if any validation fails

    // --- VALIDATION LOGIC START ---
    if (currentScheme) {
      // Validate predefined subjects
      for (const subject in currentScheme) {
        const lowerCaseSubject = subject.toLowerCase().replace(/\s/g, "");
        const enteredMarkString = marksInput[lowerCaseSubject];
        const maxMark = currentScheme[subject];

        if (enteredMarkString === "") {
          setError(
            `**ERROR:** Please enter marks for ${formatSubjectName(subject)}.`
          );
          hasValidationError = true;
          break; // Exit loop on first error
        }

        const markValue = parseFloat(enteredMarkString);

        if (isNaN(markValue)) {
          setError(
            `**ERROR:** Invalid marks entered for ${formatSubjectName(
              subject
            )}. Please enter a number.`
          );
          hasValidationError = true;
          break;
        }
        if (markValue < 0) {
          setError(
            `**ERROR:** Marks for ${formatSubjectName(
              subject
            )} cannot be negative.`
          );
          hasValidationError = true;
          break;
        }
        if (markValue > maxMark) {
          setError(
            `**ERROR:** ${formatSubjectName(
              subject
            )} marks (${markValue}) cannot exceed Max Marks of ${maxMark}. Please correct this.`
          );
          hasValidationError = true;
          break;
        }

        newMark[lowerCaseSubject] = markValue;
        // Also ensure max marks are included in the payload
        newMark[`max${subject.replace(/\s/g, "")}`] = maxMark;
      }
    } else if (programType === "Others") {
      // Validate custom subjects
      if (customFields.length === 0) {
        setError("**ERROR:** Please add at least one custom subject.");
        hasValidationError = true;
      } else {
        for (const field of customFields) {
          if (!field.subjectName.trim()) {
            setError("**ERROR:** Custom subject name cannot be empty.");
            hasValidationError = true;
            break;
          }

          const enteredMarkString = field.mark;
          const enteredMaxMarkString = field.maxMark;

          if (enteredMarkString === "" || enteredMaxMarkString === "") {
            setError(
              `**ERROR:** Please enter both marks obtained and max marks for '${
                field.subjectName || "a custom subject"
              }'`
            );
            hasValidationError = true;
            break;
          }

          const markValue = parseFloat(enteredMarkString);
          const maxMarkValue = parseFloat(enteredMaxMarkString);

          if (isNaN(markValue) || isNaN(maxMarkValue)) {
            setError(
              `**ERROR:** Invalid numbers entered for marks or max marks for '${
                field.subjectName || "a custom subject"
              }'`
            );
            hasValidationError = true;
            break;
          }
          if (markValue < 0 || maxMarkValue < 0) {
            setError(
              `**ERROR:** Marks or max marks for '${
                field.subjectName || "a custom subject"
              }' cannot be negative.`
            );
            hasValidationError = true;
            break;
          }
          if (maxMarkValue === 0) {
            setError(
              `**ERROR:** Max Marks for '${
                field.subjectName || "a custom subject"
              }' cannot be zero.`
            );
            hasValidationError = true;
            break;
          }
          if (markValue > maxMarkValue) {
            setError(
              `**ERROR:** Marks obtained (${markValue}) for '${
                field.subjectName || "a custom subject"
              }' cannot exceed Max Marks (${maxMarkValue}). Please correct this.`
            );
            hasValidationError = true;
            break;
          }

          const subjectKey = field.subjectName.toLowerCase().replace(/\s/g, "");
          newMark[subjectKey] = markValue;
          newMark[`max${subjectKey}`] = maxMarkValue;
        }
      }
    } else {
      setError("**ERROR:** Invalid program type selected. Cannot add marks.");
      hasValidationError = true;
    }

    // If any validation failed, stop the submission process
    if (hasValidationError) {
      setLoading(false);
      return;
    }
    // --- VALIDATION LOGIC END ---

    try {
      // Dispatch the Redux action
      await dispatch(addWeeklyMarks(studentId, newMark)).promise; // Access the promise from apiRequest meta
       await  dispatch(fetchWeeklyMarks(studentId)); // Fetch weekly marks
      
 setSuccess(true);

      // Reset form fields

      setMarksInput({});

      // Reset custom fields, which will trigger useEffect to re-initialize based on programType

      setCustomFields([]); 



      if (onMarksAdded) {

        onMarksAdded();

      }

      setTimeout(() => {

        onClose();

      }, 1500);
      // Redux state (addMarksSuccess) will now manage the success state and trigger useEffect.
      // No need to set local success state here directly.
      // Form fields are reset in useEffect upon addMarksSuccess.
    } catch (err) {
      // This catch block will primarily catch errors related to the dispatch itself
      // or if the promise from apiRequest was rejected before the onFailure callback was triggered.
      // Actual API errors are handled by addMarksError in Redux state via onFailure.
      console.error("Error during Redux dispatch or promise rejection:", err);
      // The addMarksError from Redux will be picked up by the useEffect
    } finally {
      setLoading(false);
    }
  };

  const formatSubjectName = (subject) => {
    return subject
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const renderMarkInputs = () => {
    const scheme = MARK_SCHEMES[programType];

    if (scheme) {
      return (
        <Stack spacing={2}>
          {" "}
          {/* 'spacing' adds consistent vertical space between each input */}
          {Object.entries(scheme).map(([subject, maxMark]) => {
            const inputName = subject.toLowerCase().replace(/\s/g, "");
            const displayLabel = formatSubjectName(subject);
            return (
              <MuiInput // Using your MuiInput component as requested
                key={inputName}
                label={`${displayLabel} Marks (out of ${maxMark})`}
                name={inputName}
                type="number"
                value={marksInput[inputName] || ""}
                onChange={(e) => handleMarkChange(inputName, e.target.value)}
                // HTML5 min/max for basic client-side visual hint/behavior
                inputProps={{ min: "0", max: String(maxMark) }}
                fullWidth
              />
            );
          })}
        </Stack>
      );
    } else if (programType === "Others") {
      return (
        <Stack spacing={2}>
          {" "}
          {/* Use Stack here for consistent spacing and layout */}
          {customFields.map((field, index) => (
            <div
              key={field.id}
              className="custom-mark-field-group"
              style={{
                display: "flex",
                flexDirection: "column", // Changed to column for small screens, ensuring fields stack
                gap: "16px", // gap for spacing between inputs within the group
                padding: "16px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <MuiInput
                label={`Subject Name ${index + 1}`}
                name={`subjectName-${field.id}`}
                value={field.subjectName}
                onChange={(e) =>
                  handleCustomFieldChange(
                    field.id,
                    "subjectName",
                    e.target.value
                  )
                }
                fullWidth // Ensure custom subject name also takes full width
              />
              <MuiInput
                label="Marks Obtained"
                name={`mark-${field.id}`}
                type="number"
                value={field.mark}
                onChange={(e) =>
                  handleCustomFieldChange(field.id, "mark", e.target.value)
                }
                inputProps={{ min: "0" }}
                fullWidth // Ensure marks obtained also takes full width
              />
              <MuiInput
                label="Max Marks"
                name={`maxMark-${field.id}`}
                type="number"
                value={field.maxMark}
                onChange={(e) =>
                  handleCustomFieldChange(field.id, "maxMark", e.target.value)
                }
                inputProps={{ min: "0" }}
                fullWidth // Ensure max marks also takes full width
              />
              {customFields.length > 1 && (
                <MuiButton
                  variant="outlined"
                  color="secondary"
                  onClick={() => removeCustomField(field.id)}
                  sx={{ mt: 1 }}
                  fullWidth // Make button full width for better mobile UX
                >
                  <FaTrashAlt /> Remove
                </MuiButton>
              )}
            </div>
          ))}
          <MuiButton
            variant="outlined"
            onClick={addCustomField}
            startIcon={<FaPlusCircle />}
            sx={{ mt: 2 }}
          >
            Add Custom Subject
          </MuiButton>
        </Stack>
      );
    }
    return <p>Select a program type to add marks.</p>;
  };

  return (
    <div className="add-marks-modal-overlay">
      <div className="add-marks-modal-content">
        <MuiButton
          onClick={onClose}
          variant="text"
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            minWidth: "unset",
            padding: "8px",
            color: "var(--color-text-light)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <FaTimesCircle size={24} />
        </MuiButton>
        <h3>
          Add Weekly Marks for Student ({programType || "Unknown Program"}) (on{" "}
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {new Date().toLocaleDateString("en-GB")}
          </span>
          )
        </h3>
        <div className="add-student-form-grid-weekly">{renderMarkInputs()}</div>
        {error && <p className="error-message">{error}</p>}
        {success && (
          <p className="success-message">Marks added successfully!</p>
        )}
        <MuiButton
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          {loading ? (
            "Adding..."
          ) : (
            <>
              <FaPlusCircle style={{ marginRight: "8px" }} /> Add Marks
            </>
          )}
        </MuiButton>
      </div>
    </div>
  );
};

export default AddWeeklyMarksModal;
