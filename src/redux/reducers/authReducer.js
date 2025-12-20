// src/redux/reducers/authReducer.js

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  SET_AUTH_ERROR,
  SET_USER_DATA,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  CLEAR_AUTH_ERROR,
  RESET_LOADING_STATE,
  SET_CURRENT_STUDENT,
  CLEAR_CURRENT_STUDENT,
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  // Note: Profile PIC types removed from import
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE
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
  isAuthenticated: !!token,
  user: token ? {
    id: userId,
    email: userEmail,
    name: localStorage.getItem('userName'),
    role: userRole,
    isPhysics,
    isChemistry,
    AllowAll,
    subject: getUserSubject({ isPhysics, isChemistry, AllowAll })
  } : null,
  loading: false,
  error: null,
  needsLoginRedirect: false,
  currentStudent: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_AUTH_ERROR:
      return { ...state, error: null };
    case RESET_LOADING_STATE:
      return { ...state, loading: false, error: null };
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null, needsLoginRedirect: false };
    case LOGIN_SUCCESS:
      const userWithSubject = {
        ...action.payload.user,
        subject: getUserSubject(action.payload.user)
      };
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
    
    case USER_LOADING:
      return { ...state, loading: true };

    case USER_LOADED:
      const loadedUser = {
        ...action.payload,
        subject: getUserSubject(action.payload)
      };
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: loadedUser,
        error: null 
      };

    case AUTH_ERROR:
    case LOGIN_FAILURE: 
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

    // --- NEW: UPDATE PROFILE DETAILS (Email/Mobile) ---
    // Kept here because this affects the main 'user' object in auth
    case UPDATE_PROFILE_REQUEST:
      return { ...state, loading: true, error: null };

    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          ...action.payload, // Updates email/mobile
        },
        error: null,
      };

    case UPDATE_PROFILE_FAILURE:
      return { ...state, loading: false, error: action.payload.error };

    // --- EXISTING CASES ---
    case SIGNUP_REQUEST:
        return { ...state, loading: true, error: null };
    case SIGNUP_SUCCESS:
      return { ...state, loading: false, error: null };
    case SIGNUP_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case LOGOUT:
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
      return { ...state, error: action.payload, loading: false };
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
      return { ...state, currentStudent: action.payload };
    case CLEAR_CURRENT_STUDENT:
      return { ...state, currentStudent: null };
    default:
      return state;
  }
};

export default authReducer;