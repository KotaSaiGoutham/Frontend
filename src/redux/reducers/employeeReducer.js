// src/redux/reducers/employeeReducer.js
import {
  FETCH_EMPLOYEES_REQUEST,
  FETCH_EMPLOYEES_SUCCESS,
  FETCH_EMPLOYEES_FAILURE,
  ADD_EMPLOYEE_REQUEST,  // NEW
  ADD_EMPLOYEE_SUCCESS,  // NEW
  ADD_EMPLOYEE_FAILURE,  // NEW
} from '../types';

const initialState = {
  employees: [],
  loading: false,
  error: null,
  addingEmployee: false,   // NEW: Loading state for adding employee
  addEmployeeSuccess: null, // NEW: Success message/data after adding employee
  addEmployeeError: null,  // NEW: Error for adding employee
};

const employeeReducer = (state = initialState, action) => {
  switch (action.type) {
    // --- Cases for fetching ALL employees ---
    case FETCH_EMPLOYEES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_EMPLOYEES_SUCCESS:
      return {
        ...state,
        loading: false,
        employees: action.payload,
        error: null,
      };
    case FETCH_EMPLOYEES_FAILURE:
      return {
        ...state,
        loading: false,
        employees: [],
        error: action.payload.error,
      };

    // --- NEW: Cases for adding an employee ---
    case ADD_EMPLOYEE_REQUEST:
      return {
        ...state,
        addingEmployee: true,
        addEmployeeSuccess: null,
        addEmployeeError: null,
      };
    case ADD_EMPLOYEE_SUCCESS:
      return {
        ...state,
        addingEmployee: false,
        addEmployeeSuccess: action.payload, // Store success response
        addEmployeeError: null,
        // Optionally add the new employee to the existing 'employees' array if payload contains the full employee object
        // employees: [...state.employees, action.payload]
      };
    case ADD_EMPLOYEE_FAILURE:
      return {
        ...state,
        addingEmployee: false,
        addEmployeeSuccess: null,
        addEmployeeError: action.payload.error,
      };

    default:
      return state;
  }
};

export default employeeReducer;