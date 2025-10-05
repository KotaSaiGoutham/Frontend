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
};

const classScheduleReducer = (state = initialState, action) => {
  switch (action.type) {
    // --- FETCH CLASSES ---
    case FETCH_REVISION_CLASSES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_REVISION_CLASSES_SUCCESS:
      return {
        ...state,
        loading: false,
        classes: action.payload, // Replace classes with the fetched array
        error: null,
      };
    case FETCH_REVISION_CLASSES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    // --- UPDATE ATTENDANCE ---
    case UPDATE_CLASS_ATTENDANCE_REQUEST:
      // Optional: Handle a temporary loading state for the specific class if needed
      return state; 
    case UPDATE_CLASS_ATTENDANCE_SUCCESS:
      // Replace the old version of the updated class in the array
      const updatedClass = action.payload;
      return {
        ...state,
        // Map through the existing classes and replace the one that matches the ID
        classes: state.classes.map((cls) =>
          cls.id === updatedClass.id ? updatedClass : cls
        ),
        // We do not set loading to false here, as it was never set to true, 
        // to avoid flashing the UI. The component handles its own saving state.
        error: null, 
      };
    case UPDATE_CLASS_ATTENDANCE_FAILURE:
      // Log error, but UI handles the error message via the component state (`saveMessage`)
      return state;

    default:
      return state;
  }
};

export default classScheduleReducer;