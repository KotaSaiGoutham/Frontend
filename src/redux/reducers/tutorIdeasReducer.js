// src/redux/reducers/tutorIdeasReducer.js
import {
  FETCH_TUTOR_IDEAS_REQUEST,
  FETCH_TUTOR_IDEAS_SUCCESS,
  FETCH_TUTOR_IDEAS_FAILURE,
  ADD_TUTOR_IDEA_REQUEST,
  ADD_TUTOR_IDEA_SUCCESS,
  ADD_TUTOR_IDEA_FAILURE,
  UPDATE_TUTOR_IDEA_SUCCESS,
} from "../types"

const initialState = {
  ideas: [],
  loading: false,
  error: null,
  adding: false,
};

const tutorIdeasReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TUTOR_IDEAS_REQUEST:
      return { ...state, loading: true, error: null };
    
    case FETCH_TUTOR_IDEAS_SUCCESS:
      return { ...state, loading: false, ideas: action.payload };
    
    case FETCH_TUTOR_IDEAS_FAILURE:
      return { ...state, loading: false, error: action.payload.error };
    
    case ADD_TUTOR_IDEA_REQUEST:
      return { ...state, adding: true };
    
    case ADD_TUTOR_IDEA_SUCCESS:
      return { ...state, adding: false, ideas: [action.payload, ...state.ideas] };
    
    case UPDATE_TUTOR_IDEA_SUCCESS:
      return {
        ...state,
        ideas: state.ideas.map(idea =>
          idea.id === action.payload.id ? action.payload : idea
        ),
      };
    
    case ADD_TUTOR_IDEA_FAILURE:
      return { ...state, adding: false };
    
    default:
      return state;
  }
};

export default tutorIdeasReducer;