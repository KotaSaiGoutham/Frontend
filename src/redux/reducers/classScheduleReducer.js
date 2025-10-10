import {
  FETCH_REVISION_CLASSES_REQUEST,
  FETCH_REVISION_CLASSES_SUCCESS,
  FETCH_REVISION_CLASSES_FAILURE,
  UPDATE_CLASS_ATTENDANCE_REQUEST,
  UPDATE_CLASS_ATTENDANCE_SUCCESS,
  UPDATE_CLASS_ATTENDANCE_FAILURE,
} from "../types";

const initialState = {
  classes: [],
  loading: false,
  error: null,
  hasMore: true,
   nextCursor: null,  // FIX: Added nextCursor
  prevCursor: null,  // FIX: Added prevCursor
  hasPrevious: false,
  loadingMore: false,
};

// Helper function to parse and compare dates (DD.MM.YY)
const parseDate = (dateStr) => {
  if (!dateStr) return 0;
  const [day, month, year] = dateStr.split('.');
  // Assumes current century (20xx)
  return new Date(`20${year}`, month - 1, day);
};

const classScheduleReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REVISION_CLASSES_REQUEST:
      return {
        ...state,
        loading: !action.payload?.isLoadingMore,
        loadingMore: action.payload?.isLoadingMore || false,
        error: null,
      };
    
    case FETCH_REVISION_CLASSES_SUCCESS:
      let updatedClasses;
      
      if (action.payload.append) {
        updatedClasses = [...state.classes, ...action.payload.classes];
      } else if (action.payload.prepend) {
        updatedClasses = [...action.payload.classes, ...state.classes];
      } else {
        updatedClasses = action.payload.classes;
      }
      
      // Remove duplicates
      const uniqueClasses = updatedClasses.reduce((acc, current) => {
        const exists = acc.find(item => item.id === current.id);
        return exists ? acc : [...acc, current];
      }, []);
      
      // Sort by date
      uniqueClasses.sort((a, b) => parseDate(a.date) - parseDate(b.date));

      return {
        ...state,
        loading: false,
        loadingMore: false,
        classes: uniqueClasses,
        hasMore: action.payload.hasMore !== undefined ? action.payload.hasMore : false,
        hasPrevious: action.payload.hasPrevious !== undefined ? action.payload.hasPrevious : false,
        nextCursor: action.payload.nextCursor || null,  // FIX: Store nextCursor
        prevCursor: action.payload.prevCursor || null,  // FIX: Store prevCursor
        error: null,
      };
    
    case FETCH_REVISION_CLASSES_FAILURE:
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: action.payload.error,
      };

    case UPDATE_CLASS_ATTENDANCE_SUCCESS:
      return {
        ...state,
        classes: state.classes.map((cls) =>
          cls.id === action.payload.id ? action.payload : cls
        ),
        error: null,
      };

    default:
      return state;
  }
};

export default classScheduleReducer;