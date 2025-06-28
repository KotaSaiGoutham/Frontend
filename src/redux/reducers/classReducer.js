// src/redux/reducers/classReducer.js
import {
  FETCH_CLASSES_REQUEST,
  FETCH_CLASSES_SUCCESS,
  FETCH_CLASSES_FAILURE,
  ADD_TIMETABLE_REQUEST,  // NEW
  ADD_TIMETABLE_SUCCESS,  // NEW
  ADD_TIMETABLE_FAILURE,  // NEW
} from '../types';

const initialState = {
  timetables: [], // Assuming this holds your fetched timetable entries
  loading: false,
  error: null,
  addingTimetable: false,   // NEW: Loading state for adding a timetable entry
  addTimetableSuccess: null, // NEW: Success message/data after adding entry
  addTimetableError: null,  // NEW: Error for adding entry
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

    // --- NEW: Cases for adding a timetable entry ---
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
        addTimetableSuccess: action.payload, // Store success response
        addTimetableError: null,
        // Optionally, if the API returns the full new entry, you could add it to timetables array
        // timetables: [...state.timetables, action.payload]
      };
    case ADD_TIMETABLE_FAILURE:
      return {
        ...state,
        addingTimetable: false,
        addTimetableSuccess: null,
        addTimetableError: action.payload.error,
      };

    default:
      return state;
  }
};

export default classReducer;