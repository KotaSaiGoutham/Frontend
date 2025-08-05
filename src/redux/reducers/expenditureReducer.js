import {
  FETCH_EXPENDITURES_REQUEST,
  FETCH_EXPENDITURES_SUCCESS,
  FETCH_EXPENDITURES_FAILURE,
  ADD_EXPENDITURE_REQUEST,
  ADD_EXPENDITURE_SUCCESS,
  ADD_EXPENDITURE_FAILURE,
  DELETE_EXPENDITURE_REQUEST,
  DELETE_EXPENDITURE_SUCCESS,
  DELETE_EXPENDITURE_FAILURE,
} from '../types'

const initialState = {
  expenditures: [],
  loading: false,
  error: null,
};

export const expenditureReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EXPENDITURES_REQUEST:
    case ADD_EXPENDITURE_REQUEST:
    case DELETE_EXPENDITURE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_EXPENDITURES_SUCCESS:
      return {
        ...state,
        loading: false,
        expenditures: action.payload,
      };
    
    case ADD_EXPENDITURE_SUCCESS:
        return {
            ...state,
            loading: false,
            // Add the new expenditure to the beginning of the list
            expenditures: [action.payload, ...state.expenditures],
        };

    case DELETE_EXPENDITURE_SUCCESS:
      return {
        ...state,
        loading: false,
        expenditures: state.expenditures.filter(
          (exp) => exp.id !== action.payload
        ),
      };

    case FETCH_EXPENDITURES_FAILURE:
    case ADD_EXPENDITURE_FAILURE:
    case DELETE_EXPENDITURE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};