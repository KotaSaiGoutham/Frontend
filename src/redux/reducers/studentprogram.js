// reducers/studentprogram.js
// Import the new action type
import {
  REVISION_PROGRAM_REGISTER_REQUEST,
  REVISION_PROGRAM_REGISTER_SUCCESS,
  REVISION_PROGRAM_REGISTER_FAILURE,
  FETCH_REVISION_STUDENTS_FAILURE,
  FETCH_REVISION_STUDENTS_REQUEST,
  FETCH_REVISION_STUDENTS_SUCCESS,
  DELETE_REVISION_STUDENT_SUCCESS,
  UPDATE_PAYMENT_STATUS_SUCCESS,
} from "../types";

const initialState = {
  addingStudent: false,
  students: [],
  error: null,
  loading: false,
  // Add this new state property
  addStudentSuccess: false,
};

const studentProgramReducer = (state = initialState, action) => {
  switch (action.type) {
    case REVISION_PROGRAM_REGISTER_REQUEST:
      return {
        ...state,
        addingStudent: true,
        error: null,
        // Reset success flag on a new request
        addStudentSuccess: false, 
      };
    case REVISION_PROGRAM_REGISTER_SUCCESS:
      return {
        ...state,
        addingStudent: false,
        error: null,
        // Set success flag to true on success
        addStudentSuccess: true,
      };
    case REVISION_PROGRAM_REGISTER_FAILURE:
      return {
        ...state,
        addingStudent: false,
        error: action.payload.error,
        // Reset success flag on failure
        addStudentSuccess: false,
      };
    // ... other cases
    case FETCH_REVISION_STUDENTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_REVISION_STUDENTS_SUCCESS:
      return {
        ...state,
        students: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_REVISION_STUDENTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case DELETE_REVISION_STUDENT_SUCCESS:
      return {
        ...state,
        students: state.students.filter(
          (student) => student.id !== action.payload
        ),
        error: null,
      };
       case UPDATE_PAYMENT_STATUS_SUCCESS:
      return {
        ...state,
        // Map over the students to find and update the one with the new payment status
        students: state.students.map(student => {
          if (student.id === action.payload.studentId) {
            // Find the specific installment to update
            const updatedPayments = student.payments.map(payment => {
              if (payment.installment === action.payload.installmentNumber) {
                return {
                  ...payment,
                  status: action.payload.newStatus,
                  paidDate: action.payload.newStatus === 'Paid' ? new Date().toISOString() : null
                };
              }
              return payment;
            });

            return {
              ...student,
              payments: updatedPayments
            };
          }
          return student;
        }),
        error: null,
      };

    default:
      return state;
  }
};

export default studentProgramReducer;