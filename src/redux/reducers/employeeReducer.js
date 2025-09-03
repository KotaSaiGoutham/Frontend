// src/redux/reducers/employeeReducer.js
import {
  FETCH_EMPLOYEES_REQUEST,
  FETCH_EMPLOYEES_SUCCESS,
  FETCH_EMPLOYEES_FAILURE,
  ADD_EMPLOYEE_REQUEST,
  ADD_EMPLOYEE_SUCCESS,
  ADD_EMPLOYEE_FAILURE,
  UPDATE_EMPLOYEE_REQUEST, // NEW: Import update request type
  UPDATE_EMPLOYEE_SUCCESS, // NEW: Import update success type
  UPDATE_EMPLOYEE_FAILURE, // NEW: Import update failure type
} from "../types";

const initialState = {
  employees: [],
  loading: false,
  error: null,
  addingEmployee: false,
  addEmployeeSuccess: null,
  addEmployeeError: null,
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

    // --- Cases for adding an employee ---
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
        addEmployeeSuccess: action.payload,
        addEmployeeError: null,
      };
    case ADD_EMPLOYEE_FAILURE:
      return {
        ...state,
        addingEmployee: false,
        addEmployeeSuccess: null,
        addEmployeeError: action.payload.error,
      };

    // --- NEW: Cases for updating an employee ---
    case UPDATE_EMPLOYEE_REQUEST:
      // You can add a specific loading state per employee if needed
      return state;

    case UPDATE_EMPLOYEE_SUCCESS:
      // Find the employee in the array and replace it with the updated data
      const updatedEmployee = action.payload;
      return {
        ...state,
        employees: state.employees.map((employee) =>
          employee.id === updatedEmployee.id ? updatedEmployee : employee
        ),
        error: null,
      };

    case UPDATE_EMPLOYEE_FAILURE:
      // Display the error but don't change the data to avoid visual inconsistencies
      return {
        ...state,
        error: action.payload.error,
      };

    default:
      return state;
  }
};

export default employeeReducer;