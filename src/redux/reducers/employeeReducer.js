// src/redux/reducers/employeeReducer.js
import {
  FETCH_EMPLOYEES_REQUEST,
  FETCH_EMPLOYEES_SUCCESS,
  FETCH_EMPLOYEES_FAILURE,
  ADD_EMPLOYEE_REQUEST,
  ADD_EMPLOYEE_SUCCESS,
  ADD_EMPLOYEE_FAILURE,
  UPDATE_EMPLOYEE_REQUEST,
  UPDATE_EMPLOYEE_SUCCESS,
  UPDATE_EMPLOYEE_FAILURE,
  RESET_EMPlOYEE_LOADING_STATE
} from "../types";

const initialState = {
  employees: [],
  loading: false,
  error: null,
  addingEmployee: false,
  addEmployeeSuccess: null,
  addEmployeeError: null,
  // Note: No specific 'updatingEmployee' state is needed if using local state 
  // or relying on a direct check within the component using `employees` data.
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
        // Assuming the employee list should be updated immediately with the new employee:
        // Note: Your current action already calls fetchEmployees on success, 
        // but adding the new employee directly is good practice for a fast UI update.
        // This line is speculative based on how your ADD_EMPLOYEE_SUCCESS payload is structured:
        // employees: [...state.employees, action.payload.employee], 
      };
    case ADD_EMPLOYEE_FAILURE:
      return {
        ...state,
        addingEmployee: false,
        addEmployeeSuccess: null,
        addEmployeeError: action.payload.error,
      };

    // --- Cases for updating an employee (e.g., payment status) ---
    case UPDATE_EMPLOYEE_REQUEST:
      return state; // No global state change needed

    case UPDATE_EMPLOYEE_SUCCESS:
      const updatedEmployee = action.payload;
      return {
        ...state,
        employees: state.employees.map((employee) =>
          employee.id === updatedEmployee.id ? updatedEmployee : employee
        ),
        error: null,
      };

    case UPDATE_EMPLOYEE_FAILURE:
      return {
        ...state,
        error: action.payload.error,
      };
case RESET_EMPlOYEE_LOADING_STATE: // <--- ADD THIS CASE
      return {
        ...state,
        loading: false,          // Reset global loading
        addingEmployee: false,   // ✅ Reset the flag causing the issue
        addEmployeeSuccess: null,
        addEmployeeError: null,
        error: null,
      };
    default:
      return state;
  }
};

export default employeeReducer;