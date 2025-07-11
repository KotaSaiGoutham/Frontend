// src/redux/types.js

// API Middleware specific
export const API_REQUEST = 'API_REQUEST';

// Class Timetable
export const FETCH_CLASSES_REQUEST = 'FETCH_CLASSES_REQUEST';
export const FETCH_CLASSES_SUCCESS = 'FETCH_CLASSES_SUCCESS';
export const FETCH_CLASSES_FAILURE = 'FETCH_CLASSES_FAILURE';

// Students (overall list)
export const FETCH_STUDENTS_REQUEST = 'FETCH_STUDENTS_REQUEST';
export const FETCH_STUDENTS_SUCCESS = 'FETCH_STUDENTS_SUCCESS';
export const FETCH_STUDENTS_FAILURE = 'FETCH_STUDENTS_FAILURE';

// Single Student Data
export const FETCH_SINGLE_STUDENT_REQUEST = 'FETCH_SINGLE_STUDENT_REQUEST';
export const FETCH_SINGLE_STUDENT_SUCCESS = 'FETCH_SINGLE_STUDENT_SUCCESS';
export const FETCH_SINGLE_STUDENT_FAILURE = 'FETCH_SINGLE_STUDENT_FAILURE';

// --- NEW: Add Student ---
export const ADD_STUDENT_REQUEST = 'ADD_STUDENT_REQUEST';
export const ADD_STUDENT_SUCCESS = 'ADD_STUDENT_SUCCESS';
export const ADD_STUDENT_FAILURE = 'ADD_STUDENT_FAILURE';

// --- NEW: Add Weekly Marks for Student ---
export const ADD_WEEKLY_MARKS_REQUEST = 'ADD_WEEKLY_MARKS_REQUEST';
export const ADD_WEEKLY_MARKS_SUCCESS = 'ADD_WEEKLY_MARKS_SUCCESS';
export const ADD_WEEKLY_MARKS_FAILURE = 'ADD_WEEKLY_MARKS_FAILURE';

// Employees
export const FETCH_EMPLOYEES_REQUEST = 'FETCH_EMPLOYEES_REQUEST';
export const FETCH_EMPLOYEES_SUCCESS = 'FETCH_EMPLOYEES_SUCCESS';
export const FETCH_EMPLOYEES_FAILURE = 'FETCH_EMPLOYEES_FAILURE';

// --- NEW: Add Employee ---
export const ADD_EMPLOYEE_REQUEST = 'ADD_EMPLOYEE_REQUEST';
export const ADD_EMPLOYEE_SUCCESS = 'ADD_EMPLOYEE_SUCCESS';
export const ADD_EMPLOYEE_FAILURE = 'ADD_EMPLOYEE_FAILURE';


// Chart Data
export const UPDATE_DASHBOARD_CHART_DATA = 'UPDATE_DASHBOARD_CHART_DATA';

// Authentication/Global Error
export const SET_AUTH_ERROR = 'SET_AUTH_ERROR';
export const LOGOUT = 'LOGOUT';

// src/redux/types.js

// ... existing types ...

// --- NEW: Add Timetable Entry ---
export const ADD_TIMETABLE_REQUEST = 'ADD_TIMETABLE_REQUEST';
export const ADD_TIMETABLE_SUCCESS = 'ADD_TIMETABLE_SUCCESS';
export const ADD_TIMETABLE_FAILURE = 'ADD_TIMETABLE_FAILURE';

// ... other existing types ...
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const SET_USER_DATA = 'SET_USER_DATA';

export const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE';

// Student Payment Status Update
export const UPDATE_STUDENT_PAYMENT_REQUEST = 'UPDATE_STUDENT_PAYMENT_REQUEST';
export const UPDATE_STUDENT_PAYMENT_SUCCESS = 'UPDATE_STUDENT_PAYMENT_SUCCESS';
export const UPDATE_STUDENT_PAYMENT_FAILURE = 'UPDATE_STUDENT_PAYMENT_FAILURE';

export const FETCH_WEEKLY_MARKS_REQUEST = 'FETCH_WEEKLY_MARKS_REQUEST';
export const FETCH_WEEKLY_MARKS_SUCCESS = 'FETCH_WEEKLY_MARKS_SUCCESS';
export const FETCH_WEEKLY_MARKS_FAILURE = 'FETCH_WEEKLY_MARKS_FAILURE';

export const UPDATE_STUDENT_PAYMENT_STATUS_REQUEST = 'UPDATE_STUDENT_PAYMENT_STATUS_REQUEST';
export const UPDATE_STUDENT_PAYMENT_STATUS_SUCCESS = 'UPDATE_STUDENT_PAYMENT_STATUS_SUCCESS';
export const UPDATE_STUDENT_PAYMENT_STATUS_FAILURE = 'UPDATE_STUDENT_PAYMENT_STATUS_FAILURE';

export const UPDATE_STUDENT_CLASSES_REQUEST = 'UPDATE_STUDENT_CLASSES_REQUEST';
export const UPDATE_STUDENT_CLASSES_SUCCESS = 'UPDATE_STUDENT_CLASSES_SUCCESS';
export const UPDATE_STUDENT_CLASSES_FAILURE = 'UPDATE_STUDENT_CLASSES_FAILURE';

export const DELETE_TIMETABLE_REQUEST = 'DELETE_TIMETABLE_REQUEST'
export const DELETE_TIMETABLE_SUCCESS = 'DELETE_TIMETABLE_SUCCESS'
export const DELETE_TIMETABLE_FAILURE = 'DELETE_TIMETABLE_FAILURE'

export const UPDATE_TIMETABLE_REQUEST = 'UPDATE_TIMETABLE_REQUEST'
export const UPDATE_TIMETABLE_SUCCESS = 'UPDATE_TIMETABLE_SUCCESS'
export const UPDATE_TIMETABLE_FAILURE = 'UPDATE_TIMETABLE_FAILURE'

export const FETCH_PAYMENTS_REQUEST = 'FETCH_PAYMENTS_REQUEST'
export const FETCH_PAYMENTS_SUCCESS = 'FETCH_PAYMENTS_SUCCESS'
export const FETCH_PAYMENTS_FAILURE = 'FETCH_PAYMENTS_FAILURE'

export const ADD_STUDENT_CLEAR_STATUS = 'ADD_STUDENT_CLEAR_STATUS'