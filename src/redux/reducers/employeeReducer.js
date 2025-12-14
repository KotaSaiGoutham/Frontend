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
  FETCH_EMPLOYEE_REQUEST,
  FETCH_EMPLOYEE_SUCCESS,
  FETCH_EMPLOYEE_FAILURE,
  SET_CURRENT_EMPLOYEE,
  FETCH_EMPLOYEE_PAYMENTS_REQUEST,
  FETCH_EMPLOYEE_PAYMENTS_SUCCESS,
  FETCH_EMPLOYEE_PAYMENTS_FAILURE,
  RESET_EMPLOYEE_LOADING_STATE, // Add this import
} from "../types";

const initialState = {
  employees: [],
  loading: false,
  error: null,
  addingEmployee: false,
  addEmployeeSuccess: null,
  addEmployeeError: null,
  
  // Single employee data
  currentEmployee: null,
  employeeLoading: false,
  employeeError: null,
  
  // Employee payments (from employeesalarydetails)
  employeePayments: [],
  paymentsLoading: false,
  paymentsError: null,
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

    // --- Cases for updating an employee ---
    case UPDATE_EMPLOYEE_REQUEST:
      return state;

    case UPDATE_EMPLOYEE_SUCCESS:
      const updatedEmployee = action.payload;
      return {
        ...state,
        employees: state.employees.map((employee) =>
          employee.id === updatedEmployee.id ? updatedEmployee : employee
        ),
        // Also update currentEmployee if it's the same employee
        currentEmployee: 
          state.currentEmployee?.id === updatedEmployee.id 
            ? updatedEmployee 
            : state.currentEmployee,
        error: null,
      };

    case UPDATE_EMPLOYEE_FAILURE:
      return {
        ...state,
        error: action.payload.error,
      };

    // --- Cases for fetching single employee ---
    case FETCH_EMPLOYEE_REQUEST:
      return {
        ...state,
        employeeLoading: true,
        employeeError: null,
      };
    case FETCH_EMPLOYEE_SUCCESS:
      return {
        ...state,
        employeeLoading: false,
        currentEmployee: action.payload,
        employeeError: null,
      };
    case FETCH_EMPLOYEE_FAILURE:
      return {
        ...state,
        employeeLoading: false,
        currentEmployee: null,
        employeeError: action.payload.error,
      };

    // --- Set current employee ---
    case SET_CURRENT_EMPLOYEE:
      return {
        ...state,
        currentEmployee: action.payload,
      };

    // --- Cases for fetching employee payments ---
    case FETCH_EMPLOYEE_PAYMENTS_REQUEST:
      return {
        ...state,
        paymentsLoading: true,
        paymentsError: null,
      };
    case FETCH_EMPLOYEE_PAYMENTS_SUCCESS:
      return {
        ...state,
        paymentsLoading: false,
        employeePayments: action.payload || [], // Ensure it's always an array
        paymentsError: null,
      };
    case FETCH_EMPLOYEE_PAYMENTS_FAILURE:
      return {
        ...state,
        paymentsLoading: false,
        employeePayments: [],
        paymentsError: action.payload.error,
      };

    // --- Reset loading state ---
    case RESET_EMPLOYEE_LOADING_STATE:
      return {
        ...state,
        loading: false,
        addingEmployee: false,
        addEmployeeSuccess: null,
        addEmployeeError: null,
        error: null,
        employeeLoading: false,
        paymentsLoading: false,
      };

    default:
      return state;
  }
};

export default employeeReducer;