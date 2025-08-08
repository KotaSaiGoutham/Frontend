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
  UPDATE_EXPENDITURE_REQUEST,
  UPDATE_EXPENDITURE_SUCCESS,
  UPDATE_EXPENDITURE_FAILURE,
  FETCH_EXPENDITURES_STUDENT_PAYMENTS_SUM_SUCCESS 
} from '../types';

const initialState = {
  expenditures: [],
  totalExpenditure: 0,
  loading: false,
  error: null,
};

export const expenditureReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EXPENDITURES_REQUEST:
    case ADD_EXPENDITURE_REQUEST:
    case DELETE_EXPENDITURE_REQUEST:
    case UPDATE_EXPENDITURE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_EXPENDITURES_SUCCESS: {
      const expendituresArray = Array.isArray(action.payload)
        ? action.payload
        : [];
      const total = expendituresArray.reduce(
        (sum, exp) => sum + (exp.amount || 0),
        0
      );
      return {
        ...state,
        loading: false,
        expenditures: expendituresArray,
        totalExpenditure: total,
      };
    }

    case ADD_EXPENDITURE_SUCCESS: {
      const updatedExpenditures = [
        action.payload,
        ...state.expenditures,
      ];
      const total = updatedExpenditures.reduce(
        (sum, exp) => sum + (exp.amount || 0),
        0
      );
      return {
        ...state,
        loading: false,
        expenditures: updatedExpenditures,
        totalExpenditure: total,
      };
    }

    case DELETE_EXPENDITURE_SUCCESS: {
      const updatedExpenditures = state.expenditures.filter(
        (exp) => exp.id !== action.payload
      );
      const total = updatedExpenditures.reduce(
        (sum, exp) => sum + (exp.amount || 0),
        0
      );
      return {
        ...state,
        loading: false,
        expenditures: updatedExpenditures,
        totalExpenditure: total,
      };
    }

    case UPDATE_EXPENDITURE_SUCCESS: {
      const updatedExpenditures = state.expenditures.map((exp) =>
        exp.id === action.payload.id ? action.payload : exp
      );
      const total = updatedExpenditures.reduce(
        (sum, exp) => sum + (exp.amount || 0),
        0
      );
      return {
        ...state,
        loading: false,
        expenditures: updatedExpenditures,
        totalExpenditure: total,
      };
    }

    case FETCH_EXPENDITURES_FAILURE:
    case ADD_EXPENDITURE_FAILURE:
    case DELETE_EXPENDITURE_FAILURE:
    case UPDATE_EXPENDITURE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
      case FETCH_EXPENDITURES_STUDENT_PAYMENTS_SUM_SUCCESS:
      return { ...state, totalStudentPayments: action.payload };

    default:
      return state;
  }
};
