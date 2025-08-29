// src/redux/reducers/classReducer.js
import {
  FETCH_CLASSES_REQUEST,
  FETCH_CLASSES_SUCCESS,
  FETCH_CLASSES_FAILURE,
  ADD_TIMETABLE_REQUEST,
  ADD_TIMETABLE_SUCCESS,
  ADD_TIMETABLE_FAILURE,
  // 👇 NEW: Import the action types
  FETCH_CLASS_UPDATES_START,
  FETCH_CLASS_UPDATES_SUCCESS,
  FETCH_CLASS_UPDATES_FAILURE,
} from '../types';

const initialState = {
  timetables: [],
  loading: false,
  error: null,
  addingTimetable: false,
  addTimetableSuccess: null,
  addTimetableError: null,
  // 👇 NEW: State for class updates log
  classUpdates: [],
  classUpdatesLoading: false,
  classUpdatesError: null,
};

const classReducer = (state = initialState, action) => {
  switch (action.type) {
    // --- Cases for fetching ALL classes/timetables ---
    case FETCH_CLASSES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_CLASSES_SUCCESS:
      return {
        ...state,
        loading: false,
        timetables: action.payload,
        error: null,
      };
    case FETCH_CLASSES_FAILURE:
      return {
        ...state,
        loading: false,
        timetables: [],
        error: action.payload.error,
      };

    // --- Cases for adding a timetable entry (unchanged) ---
    case ADD_TIMETABLE_REQUEST:
      return {
        ...state,
        addingTimetable: true,
        addTimetableSuccess: null,
        addTimetableError: null,
      };
    case ADD_TIMETABLE_SUCCESS:
      return {
        ...state,
        addingTimetable: false,
        addTimetableSuccess: action.payload,
        addTimetableError: null,
      };
    case ADD_TIMETABLE_FAILURE:
      return {
        ...state,
        addingTimetable: false,
        addTimetableSuccess: null,
        addTimetableError: action.payload.error,
      };

    // 👇 NEW: Cases for fetching class updates log
    case FETCH_CLASS_UPDATES_START:
      return {
        ...state,
        classUpdatesLoading: true,
        classUpdatesError: null,
      };
    case FETCH_CLASS_UPDATES_SUCCESS:
      return {
        ...state,
        classUpdatesLoading: false,
        classUpdates: action.payload,
        classUpdatesError: null,
      };
    case FETCH_CLASS_UPDATES_FAILURE:
      return {
        ...state,
        classUpdatesLoading: false,
        classUpdates: [],
        classUpdatesError: action.payload.error,
      };

    default:
      return state;
  }
};

export default classReducer;