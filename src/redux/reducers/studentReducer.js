// src/redux/reducers/studentReducer.js
import {
  FETCH_STUDENTS_REQUEST,
  FETCH_STUDENTS_SUCCESS,
  FETCH_STUDENTS_FAILURE,
  FETCH_SINGLE_STUDENT_REQUEST,
  FETCH_SINGLE_STUDENT_SUCCESS,
  FETCH_SINGLE_STUDENT_FAILURE,
  ADD_STUDENT_REQUEST,
  ADD_STUDENT_SUCCESS,
  ADD_STUDENT_FAILURE,
  ADD_STUDENT_CLEAR_STATUS, // <--- ADD THIS IMPORT
  ADD_WEEKLY_MARKS_REQUEST,
  ADD_WEEKLY_MARKS_SUCCESS,
  ADD_WEEKLY_MARKS_FAILURE,
  UPDATE_STUDENT_PAYMENT_REQUEST,
  UPDATE_STUDENT_PAYMENT_SUCCESS,
  UPDATE_STUDENT_PAYMENT_FAILURE,
  FETCH_WEEKLY_MARKS_REQUEST,
  FETCH_WEEKLY_MARKS_SUCCESS,
  FETCH_WEEKLY_MARKS_FAILURE,
} from '../types';

const initialState = {
  students: [], // For the list of all students
  loading: false, // For the list of all students
  error: null, // For errors related to fetching all students

  selectedStudentData: null, // For data of a single selected student
  loadingSingleStudent: false, // Loading state for single student
  singleStudentError: null, // Error state for single student

  addingStudent: false, // NEW: Loading state for adding a student
  addStudentSuccess: null, // NEW: Success message/data after adding student
  addStudentError: null, // NEW: Error for adding a student

  addingMarks: false, // NEW: Loading state for adding marks
  addMarksSuccess: null, // NEW: Success message/data after adding marks
  addMarksError: null, // NEW: Error for adding marks
  weeklyMarks: [], // NEW: State to hold fetched weekly marks
  loadingWeeklyMarks: false, // NEW: Loading state for fetching weekly marks
  weeklyMarksError: null, // NEW: Error for fetching weekly marks

  // Ensure these are initialized if you use them for payment updates
  updatingStudent: null,
  updateError: null,
  updateSuccess: false,
};

const studentReducer = (state = initialState, action) => {
  switch (action.type) {
    // --- Cases for fetching ALL students ---
    case FETCH_STUDENTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_STUDENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        students: action.payload,
        error: null,
      };
    case FETCH_STUDENTS_FAILURE:
      return {
        ...state,
        loading: false,
        students: [],
        error: action.payload, // Assuming payload is the error message directly here
      };

    // --- Cases for fetching a SINGLE student ---
    case FETCH_SINGLE_STUDENT_REQUEST:
      return {
        ...state,
        loadingSingleStudent: true,
        singleStudentError: null,
        selectedStudentData: null,
      };
    case FETCH_SINGLE_STUDENT_SUCCESS:
      return {
        ...state,
        loadingSingleStudent: false,
        selectedStudentData: action.payload,
        singleStudentError: null,
      };
    case FETCH_SINGLE_STUDENT_FAILURE:
      return {
        ...state,
        loadingSingleStudent: false,
        selectedStudentData: null,
        singleStudentError: action.payload, // Assuming payload is the error message directly here
      };

    // --- NEW: Cases for adding a student ---
    case ADD_STUDENT_REQUEST:
      return {
        ...state,
        addingStudent: true,
        addStudentSuccess: null, // Clear previous success/error on new request
        addStudentError: null,
      };
    case ADD_STUDENT_SUCCESS:
      return {
        ...state,
        addingStudent: false,
        addStudentSuccess: action.payload, // Store success response
        addStudentError: null,
        // Optionally add the new student to the existing 'students' array
        // if action.payload is the full student object and you don't re-fetch all students
        // students: [...state.students, action.payload]
      };
    case ADD_STUDENT_FAILURE:
      return {
        ...state,
        addingStudent: false,
        addStudentSuccess: null,
        addStudentError: action.payload, // Assuming payload is the error message directly here
      };
    case ADD_STUDENT_CLEAR_STATUS: // <--- ADD THIS NEW CASE
      return {
        ...state,
        addStudentSuccess: null,
        addStudentError: null,
      };

    // --- NEW: Cases for adding weekly marks ---
    case ADD_WEEKLY_MARKS_REQUEST:
      return {
        ...state,
        addingMarks: true,
        addMarksSuccess: null,
        addMarksError: null,
      };
    case ADD_WEEKLY_MARKS_SUCCESS:
      return {
        ...state,
        addingMarks: false,
        addMarksSuccess: action.payload, // Store success response
        addMarksError: null,
        // If the single student data is updated by the API, you might update selectedStudentData here
        // E.g., if payload is the updated student object: selectedStudentData: action.payload
      };
    case ADD_WEEKLY_MARKS_FAILURE:
      return {
        ...state,
        addingMarks: false,
        addMarksSuccess: null,
        addMarksError: action.payload, // Assuming payload is the error message directly here
      };

    case UPDATE_STUDENT_PAYMENT_REQUEST: // <-- NEW: Handle request to update payment status
      return {
        ...state,
        updatingStudent: action.payload.studentId, // Store the ID of the student being updated
        updateError: null,
        updateSuccess: false,
      };
    case UPDATE_STUDENT_PAYMENT_SUCCESS: // <-- NEW: Handle successful payment status update
      return {
        ...state,
        updatingStudent: null,
        updateSuccess: true,
        updateError: null,
        // Assuming your 'students' array might need a direct update here if fetchStudents() isn't always called
        students: state.students.map(student =>
          student._id === action.payload.studentId // Use _id if that's your MongoDB ID field
            ? { ...student, "Payment Status": action.payload.newStatus } // Update payment status directly
            : student
        ),
        // If updating a single student's data that is currently selected:
        selectedStudentData: state.selectedStudentData && state.selectedStudentData._id === action.payload.studentId
          ? { ...state.selectedStudentData, "Payment Status": action.payload.newStatus }
          : state.selectedStudentData,
      };
    case UPDATE_STUDENT_PAYMENT_FAILURE: // <-- NEW: Handle failed payment status update
      return {
        ...state,
        updatingStudent: null,
        updateSuccess: false,
        updateError: action.payload, // Store the specific error message for the update
      };
    // --- NEW: Cases for fetching weekly marks ---
    case FETCH_WEEKLY_MARKS_REQUEST:
      return {
        ...state,
        loadingWeeklyMarks: true,
        weeklyMarksError: null,
        weeklyMarks: [], // Clear previous marks when fetching new ones
      };
    case FETCH_WEEKLY_MARKS_SUCCESS:
      return {
        ...state,
        loadingWeeklyMarks: false,
        weeklyMarks: action.payload, // Store the fetched marks array
        weeklyMarksError: null,
      };
    case FETCH_WEEKLY_MARKS_FAILURE:
      return {
        ...state,
        loadingWeeklyMarks: false,
        weeklyMarks: [],
        weeklyMarksError: action.payload, // Assuming payload is the error message directly here
      };

    default:
      return state;
  }
};

export default studentReducer;