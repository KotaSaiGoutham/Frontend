import {
  ADD_STUDENT_SYLLABUS_REQUEST,
  ADD_STUDENT_SYLLABUS_SUCCESS,
  ADD_STUDENT_SYLLABUS_FAILURE,
  FETCH_STUDENT_SYLLABUS_REQUEST,
  FETCH_STUDENT_SYLLABUS_SUCCESS,
  FETCH_STUDENT_SYLLABUS_FAILURE,
} from "../types"; 

const initialState = {
  loading: false,
  history: [], 
  error: null,
};

const studentSyllabusReducer = (state = initialState, action) => {
  switch (action.type) {
    // --- ADD SYLLABUS ---
    case ADD_STUDENT_SYLLABUS_REQUEST:
      return { ...state, loading: true, error: null };
    case ADD_STUDENT_SYLLABUS_SUCCESS:
      // Optionally append the new item immediately to history to save a fetch
      // or just set loading false and let the re-fetch handle it (safer)
      return { ...state, loading: false };
    case ADD_STUDENT_SYLLABUS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // --- FETCH HISTORY ---
    case FETCH_STUDENT_SYLLABUS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_STUDENT_SYLLABUS_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        history: action.payload // Update the history array with data from backend
      };
    case FETCH_STUDENT_SYLLABUS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default studentSyllabusReducer;