// src/redux/reducers/studentReducer.js
import {
  UPDATE_STUDENT_FIELD_SUCCESS,
  DELETE_STUDENT_SUCCESS,
  SET_STUDENTS_NEED_REFRESH,
  FETCH_STUDENTS_REQUEST,
  FETCH_STUDENTS_SUCCESS,
  FETCH_STUDENTS_FAILURE,
  FETCH_SINGLE_STUDENT_REQUEST,
  FETCH_SINGLE_STUDENT_SUCCESS,
  FETCH_SINGLE_STUDENT_FAILURE,
  ADD_STUDENT_REQUEST,
  ADD_STUDENT_SUCCESS,
  ADD_STUDENT_FAILURE,
  ADD_STUDENT_CLEAR_STATUS,
  ADD_WEEKLY_MARKS_REQUEST,
  ADD_WEEKLY_MARKS_SUCCESS,
  ADD_WEEKLY_MARKS_FAILURE,
  UPDATE_STUDENT_PAYMENT_REQUEST,
  UPDATE_STUDENT_PAYMENT_SUCCESS,
  UPDATE_STUDENT_PAYMENT_FAILURE,
  FETCH_WEEKLY_MARKS_REQUEST,
  FETCH_WEEKLY_MARKS_SUCCESS,
  FETCH_WEEKLY_MARKS_FAILURE,
  UPDATE_STUDENT_CLASSES_SUCCESS,
  FETCH_PAYMENTS_REQUEST,
  FETCH_PAYMENTS_SUCCESS,
  FETCH_PAYMENTS_FAILURE,
  FETCH_DEMO_CLASSES_REQUEST,
  FETCH_DEMO_CLASSES_SUCCESS,
  FETCH_DEMO_CLASSES_FAILURE,
  ADD_DEMO_CLASS_REQUEST,
  ADD_DEMO_CLASS_SUCCESS,
  ADD_DEMO_CLASS_FAILURE,
  FETCH_CLASS_SCHEDULE_REQUEST,
  FETCH_CLASS_SCHEDULE_SUCCESS,
  FETCH_CLASS_SCHEDULE_FAILURE,
  UPDATE_CLASS_SCHEDULE_REQUEST,
  UPDATE_CLASS_SCHEDULE_SUCCESS,
  UPDATE_CLASS_SCHEDULE_FAILURE,
  // ADD THESE NEW TYPES
  FETCH_MONTHLY_STUDENT_DETAILS_REQUEST,
  FETCH_MONTHLY_STUDENT_DETAILS_SUCCESS,
  FETCH_MONTHLY_STUDENT_DETAILS_FAILURE,
  CLEAR_MONTHLY_STUDENT_DETAILS,
} from "../types";

const initialState = {
  students: [], // For the list of all students
  needsRefresh: false, // Add this flag

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
  payments: [],
  demoClasses: [], // Array to hold the fetched demo class objects
  loading: false,  // Boolean to indicate if data is being fetched
  error: null,     // Null or a string to hold any error messages
  classSchedule: {
    data: [], // Optimized schedule data
    loading: false,
    error: null, // Now stores string directly
    updating: false,
    updateError: null
  },
  
  // ADD THESE NEW STATES FOR MONTHLY STUDENT DETAILS
  monthlyStudentDetails: null, // Array of students for selected month
  selectedStudentMonth: null, // Currently selected month (e.g., "2025-11")
  studentDetailsLoading: false, // Loading state for student details
  studentDetailsError: null, // Error state for student details
  studentDetailsOpen: false, // Whether the dialog is open
};

const studentReducer = (state = initialState, action) => {
  switch (action.type) {
    // --- Cases for fetching ALL students ---
    case FETCH_CLASS_SCHEDULE_REQUEST:
      return {
        ...state,
        classSchedule: {
          ...state.classSchedule,
          loading: true,
          error: null,
        }
      };
    case FETCH_CLASS_SCHEDULE_SUCCESS:
      return {
        ...state,
        classSchedule: {
          ...state.classSchedule,
          loading: false,
          data: action.payload,
          error: null,
          needsRefresh: false, // Reset flag after successful fetch
        }
      };
    case SET_STUDENTS_NEED_REFRESH:
      return {
        ...state,
        needsRefresh: true
      };
    case FETCH_CLASS_SCHEDULE_FAILURE:
      return {
        ...state,
        classSchedule: {
          ...state.classSchedule,
          loading: false,
          data: [],
          error: action.payload, // This is now a string
        }
      };
    case UPDATE_CLASS_SCHEDULE_REQUEST:
      return {
        ...state,
        classSchedule: {
          ...state.classSchedule,
          updating: true,
          updateError: null,
        }
      };
    case UPDATE_CLASS_SCHEDULE_SUCCESS:
      return {
        ...state,
        classSchedule: {
          ...state.classSchedule,
          updating: false,
          updateError: null,
          // Optionally update the local data if needed
          data: state.classSchedule.data.map(student => 
            student.id === action.payload.studentId 
              ? { ...student, classDateandTime: action.payload.updatedSchedules }
              : student
          )
        }
      };
    case UPDATE_CLASS_SCHEDULE_FAILURE:
      return {
        ...state,
        classSchedule: {
          ...state.classSchedule,
          updating: false,
          updateError: action.payload,
        }
      };

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
        needsRefresh: false, // Reset after successful fetch
      };
    case FETCH_STUDENTS_FAILURE:
      return {
        ...state,
        loading: false,
        students: [],
        error: action.payload, // Assuming payload is the error message directly here
        needsRefresh: false,
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
    case ADD_STUDENT_CLEAR_STATUS:
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
    
    case UPDATE_STUDENT_CLASSES_SUCCESS: {
      const updated = action.payload; // { id, classesCompleted, … }
      if (!updated || !updated.id) return state;

      return {
        ...state,
        students: state.students.map((s) =>
          s.id === updated.id ? { ...s, ...updated } : s
        ),
      };
    }

    case FETCH_DEMO_CLASSES_REQUEST:
    case ADD_DEMO_CLASS_REQUEST: // Assuming you want loading state for adding too
      return {
        ...state,
        loading: true,
        error: null, // Clear any previous errors on new request
      };

    case FETCH_DEMO_CLASSES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        demoClasses: action.payload, // Update demoClasses with the fetched data
      };

    case ADD_DEMO_CLASS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        demoClasses: [...state.demoClasses, action.payload],
      };

    case FETCH_DEMO_CLASSES_FAILURE:
    case ADD_DEMO_CLASS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error, // Set the error message
      };
    
    case UPDATE_STUDENT_FIELD_SUCCESS: {
      const { studentId, fieldName, newValue } = action.payload;
      
      return {
        ...state,
        students: state.students.map(student =>
          student.id === studentId 
            ? { ...student, [fieldName]: newValue }
            : student
        ),
        // Also update selectedStudentData if it's the same student
        selectedStudentData: state.selectedStudentData && state.selectedStudentData.id === studentId
          ? { ...state.selectedStudentData, [fieldName]: newValue }
          : state.selectedStudentData
      };
    }

    // Handle classes completed updates
    case UPDATE_STUDENT_CLASSES_SUCCESS: {
      const updated = action.payload;
      if (!updated || !updated.id) return state;

      return {
        ...state,
        students: state.students.map(student =>
          student.id === updated.id ? { ...student, ...updated } : student
        ),
        selectedStudentData: state.selectedStudentData && state.selectedStudentData.id === updated.id
          ? { ...state.selectedStudentData, ...updated }
          : state.selectedStudentData
      };
    }

    // Handle payment status updates
    case UPDATE_STUDENT_PAYMENT_SUCCESS: {
      const { studentId, newStatus } = action.payload;
      
      return {
        ...state,
        updatingStudent: null,
        updateSuccess: true,
        updateError: null,
        students: state.students.map(student =>
          student.id === studentId 
            ? { ...student, "Payment Status": newStatus }
            : student
        ),
        selectedStudentData: state.selectedStudentData && state.selectedStudentData.id === studentId
          ? { ...state.selectedStudentData, "Payment Status": newStatus }
          : state.selectedStudentData
      };
    }

    // Handle student deletion
    case DELETE_STUDENT_SUCCESS: {
      const studentId = action.payload;
      
      return {
        ...state,
        students: state.students.filter(student => student.id !== studentId),
        selectedStudentData: state.selectedStudentData && state.selectedStudentData.id === studentId
          ? null
          : state.selectedStudentData
      };
    }

    // --- NEW: Cases for monthly student details ---
    case FETCH_MONTHLY_STUDENT_DETAILS_REQUEST:
      return {
        ...state,
        studentDetailsLoading: true,
        studentDetailsError: null,
        studentDetailsOpen: true, // Open the dialog when request starts
      };
    
    case FETCH_MONTHLY_STUDENT_DETAILS_SUCCESS:
      return {
        ...state,
        studentDetailsLoading: false,
        monthlyStudentDetails: action.payload.students, // Store the student details array
        selectedStudentMonth: action.payload.month, // Store the selected month
        studentDetailsError: null,
        studentDetailsOpen: true, // Keep dialog open
      };
    
    case FETCH_MONTHLY_STUDENT_DETAILS_FAILURE:
      return {
        ...state,
        studentDetailsLoading: false,
        monthlyStudentDetails: null,
        selectedStudentMonth: null,
        studentDetailsError: action.payload,
        studentDetailsOpen: false, // Close dialog on error
      };
    
    case CLEAR_MONTHLY_STUDENT_DETAILS:
      return {
        ...state,
        monthlyStudentDetails: null,
        selectedStudentMonth: null,
        studentDetailsOpen: false, // Close the dialog
      };

    default:
      return state;
  }
};

export default studentReducer;