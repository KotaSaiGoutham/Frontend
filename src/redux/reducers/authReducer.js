// src/redux/reducers/authReducer.js

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  SET_AUTH_ERROR,
  SET_USER_DATA, // NEW
  SIGNUP_REQUEST, // <-- NEW
  SIGNUP_SUCCESS, // <-- NEW
  SIGNUP_FAILURE, // <-- NEW
CLEAR_AUTH_ERROR,
RESET_LOADING_STATE,
SET_CURRENT_STUDENT,
CLEAR_CURRENT_STUDENT
} from '../types';

// Helper function to determine the user's subject
const getUserSubject = (user) => {
  if (!user) return null;
  if (user.AllowAll) return "All";
  if (user.isPhysics) return "Physics";
  if (user.isChemistry) return "Chemistry";
  return null;
};

// Try to get user info from localStorage on initial load
const token = localStorage.getItem('token');
const userId = localStorage.getItem('id');
const userEmail = localStorage.getItem('userEmail');
const isPhysics = localStorage.getItem('isPhysics') === 'true';
const isChemistry = localStorage.getItem('isChemistry') === 'true';
const AllowAll = localStorage.getItem('AllowAll') === 'true';
const userRole = localStorage.getItem('userRole');

const initialState = {
  token: token || null,
  isAuthenticated: !!token, // True if token exists
  user: token ? { 
    id: userId, 
    email: userEmail,
    name: localStorage.getItem('userName'),
    role: userRole,
    isPhysics,
    isChemistry,
    AllowAll,
    subject: getUserSubject({ isPhysics, isChemistry, AllowAll }) // Determine subject on load
} : null,
  loading: false,
  error: null,
  needsLoginRedirect: false,
currentStudent:null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
        case CLEAR_AUTH_ERROR:
      return {
        ...state,
        error: null,
      };
        case RESET_LOADING_STATE:
      return {
        ...state,
        loading: false,
        error: null, // It's good practice to clear the error as well
      };
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        needsLoginRedirect: false,
      };
    case LOGIN_SUCCESS:
      // Add the determined subject to the user object in the state
      const userWithSubject = { 
        ...action.payload.user, 
        subject: getUserSubject(action.payload.user) 
      };
      
      // Store the subject in localStorage for persistence
      localStorage.setItem('subject', userWithSubject.subject);

      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        token: action.payload.token,
        user: userWithSubject,
        error: null,
        needsLoginRedirect: false,
      };
    case LOGIN_FAILURE:
      // Clear all user-related data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      localStorage.removeItem('isPhysics');
      localStorage.removeItem('isChemistry');
      localStorage.removeItem('AllowAll');
      localStorage.removeItem('subject');
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        token: null,
        user: null,
        error: action.payload,
        needsLoginRedirect: false,
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case SIGNUP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case LOGOUT:
      // Clear all user-related data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      localStorage.removeItem('isPhysics');
      localStorage.removeItem('isChemistry');
      localStorage.removeItem('AllowAll');
      localStorage.removeItem('subject');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        error: null,
        loading: false,
        needsLoginRedirect: true,
      };
  case SET_AUTH_ERROR:
  return {
    ...state,
    error: action.payload,
    loading: false,
  };
    case SET_USER_DATA:
      return {
        ...state,
        user: {
            ...action.payload,
            subject: getUserSubject(action.payload)
        },
        isAuthenticated: !!action.payload && !!state.token,
      };
  case SET_CURRENT_STUDENT:
    return {
      ...state,
      currentStudent: action.payload
    };
    case CLEAR_CURRENT_STUDENT:
      return {
        ...state,
        currentStudent: null
      };
    default:
      return state;
  }
};

export default authReducer;