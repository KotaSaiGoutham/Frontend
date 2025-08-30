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
  FETCH_EXPENDITURES_STUDENT_PAYMENTS_SUM_SUCCESS,
  FETCH_EXPENDITURES_SUM_SUCCESS,
  FETCH_TOTAL_PAYMENTS_SUCCESS,
  // Import the new action type
  FETCH_MONTHLY_PAYMENTS_SUCCESS,
} from '../types';

const initialState = {
  expenditures: [],
  payments: [],
  // Add a new property to store the monthly payment totals
  monthlyPayments: {}, 
  totalExpenditure: { current: 0, previous: 0 },
  totalStudentPayments: { current: 0, previous: 0 },
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
      const expendituresArray = Array.isArray(action.payload) ? action.payload : [];
      return {
        ...state,
        loading: false,
        expenditures: expendituresArray,
      };
    }
    
    case FETCH_TOTAL_PAYMENTS_SUCCESS: {
      const paymentArray = Array.isArray(action.payload) ? action.payload : [];
      return {
        ...state,
        loading: false,
        payments: paymentArray,
      };
    }

    // Add a new case to handle the monthly payments data
    case FETCH_MONTHLY_PAYMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        monthlyPayments: action.payload, // Store the monthly totals in the new state property
      };

    case ADD_EXPENDITURE_SUCCESS: {
      const updatedExpenditures = [action.payload, ...state.expenditures];
      const currentTotal = updatedExpenditures.reduce((sum, exp) => sum + (exp.amount || 0), 0);
      return {
        ...state,
        loading: false,
        expenditures: updatedExpenditures,
        totalExpenditure: { ...state.totalExpenditure, current: currentTotal },
      };
    }

    // ... (DELETE and UPDATE cases follow)

    case FETCH_EXPENDITURES_STUDENT_PAYMENTS_SUM_SUCCESS:
      return { ...state, totalStudentPayments: action.payload };

    case FETCH_EXPENDITURES_SUM_SUCCESS:
      return { ...state, totalExpenditure: action.payload };

    case FETCH_EXPENDITURES_FAILURE:
    case ADD_EXPENDITURE_FAILURE:
    case DELETE_EXPENDITURE_FAILURE:
    case UPDATE_EXPENDITURE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};