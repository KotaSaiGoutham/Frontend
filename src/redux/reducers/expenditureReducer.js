import {
  DELETE_ACADEMY_EARNING_SUCCESS,
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
  FETCH_MONTHLY_PAYMENTS_SUCCESS,
  // ✅ New action types
  FETCH_ALL_MONTHLY_PAYMENTS_REQUEST,
  FETCH_ALL_MONTHLY_PAYMENTS_SUCCESS,
  FETCH_ALL_MONTHLY_PAYMENTS_FAILURE,
  FETCH_MONTHLY_PAYMENT_DETAILS_REQUEST,
  FETCH_MONTHLY_PAYMENT_DETAILS_SUCCESS,
  FETCH_MONTHLY_PAYMENT_DETAILS_FAILURE,
  CLEAR_MONTHLY_PAYMENT_DETAILS,
  // ✅ Academy Finance Action Types
  FETCH_ACADEMY_FINANCE_REQUEST,
  FETCH_ACADEMY_FINANCE_SUCCESS,
  FETCH_ACADEMY_FINANCE_FAILURE,
  ADD_ACADEMY_EARNING_REQUEST,
  ADD_ACADEMY_EARNING_SUCCESS,
  ADD_ACADEMY_EARNING_FAILURE,


} from '../types';

const initialState = {
  expenditures: [],
  payments: [],
  allPayments: [],
  monthlyPayments: {}, 
  monthlyPaymentDetails: null,
  selectedMonth: null,
  totalExpenditure: { current: 0, previous: 0 },
  totalStudentPayments: { current: 0, previous: 0 },
  loading: false,
  paymentDetailsLoading: false,
  error: null,
  
  // ✅ Academy Finance State
  academyFinance: {
    expenses: [], // Company expenses from employees
    earnings: [], // Academy earnings
    totalExpenses: 0,
    totalEarnings: 0,
    netBalance: 0,
    previousExpenses: [],
    previousEarnings: [],
    previousTotalExpenses: 0,
    previousTotalEarnings: 0,
    previousNetBalance: 0,
    loading: false,
    error: null,
  },
};

export const expenditureReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EXPENDITURES_REQUEST:
    case ADD_EXPENDITURE_REQUEST:
    case DELETE_EXPENDITURE_REQUEST:
    case UPDATE_EXPENDITURE_REQUEST:
    case FETCH_ALL_MONTHLY_PAYMENTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_MONTHLY_PAYMENT_DETAILS_REQUEST:
      return {
        ...state,
        paymentDetailsLoading: true,
        error: null,
      };

    // ✅ Academy Finance Loading States
    case FETCH_ACADEMY_FINANCE_REQUEST:
    case ADD_ACADEMY_EARNING_REQUEST:

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

    case FETCH_MONTHLY_PAYMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        monthlyPayments: action.payload,
      };

    case FETCH_ALL_MONTHLY_PAYMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        allPayments: action.payload,
      };

    case FETCH_MONTHLY_PAYMENT_DETAILS_SUCCESS:
      return {
        ...state,
        paymentDetailsLoading: false,
        monthlyPaymentDetails: action.payload.payments,
        selectedMonth: action.payload.month,
      };

    case CLEAR_MONTHLY_PAYMENT_DETAILS:
      return {
        ...state,
        monthlyPaymentDetails: null,
        selectedMonth: null,
        paymentDetailsLoading: false,
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

    // ✅ Academy Finance Success Cases
    case FETCH_ACADEMY_FINANCE_SUCCESS:
      return {
        ...state,
        academyFinance: {
          ...state.academyFinance,
          loading: false,
          expenses: action.payload.expenses || [],
          earnings: action.payload.earnings || [],
          totalExpenses: action.payload.totalExpenses || 0,
          totalEarnings: action.payload.totalEarnings || 0,
          netBalance: action.payload.netBalance || 0,
          previousExpenses: action.payload.previousExpenses || [],
          previousEarnings: action.payload.previousEarnings || [],
          previousTotalExpenses: action.payload.previousTotalExpenses || 0,
          previousTotalEarnings: action.payload.previousTotalEarnings || 0,
          previousNetBalance: action.payload.previousNetBalance || 0,
        },
      };

    case ADD_ACADEMY_EARNING_SUCCESS: {
      const updatedEarnings = [action.payload, ...state.academyFinance.earnings];
      const newTotalEarnings = state.academyFinance.totalEarnings + (action.payload.amount || 0);
      const newNetBalance = newTotalEarnings - state.academyFinance.totalExpenses;
      
      return {
        ...state,
        academyFinance: {
          ...state.academyFinance,
          loading: false,
          earnings: updatedEarnings,
          totalEarnings: newTotalEarnings,
          netBalance: newNetBalance,
        },
      };
    }





    case FETCH_EXPENDITURES_STUDENT_PAYMENTS_SUM_SUCCESS:
      return { ...state, totalStudentPayments: action.payload };

    case FETCH_EXPENDITURES_SUM_SUCCESS:
      return { ...state, totalExpenditure: action.payload };

    // Error Cases
    case FETCH_EXPENDITURES_FAILURE:
    case ADD_EXPENDITURE_FAILURE:
    case DELETE_EXPENDITURE_FAILURE:
    case UPDATE_EXPENDITURE_FAILURE:
    case FETCH_ALL_MONTHLY_PAYMENTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case FETCH_MONTHLY_PAYMENT_DETAILS_FAILURE:
      return {
        ...state,
        paymentDetailsLoading: false,
        error: action.payload.error,
      };

    // ✅ Academy Finance Error Cases
    case FETCH_ACADEMY_FINANCE_FAILURE:
    case ADD_ACADEMY_EARNING_FAILURE:

case DELETE_ACADEMY_EARNING_SUCCESS:
  return {
    ...state,
    loading: false,
    earnings: state.earnings.filter(earning => earning.id !== action.payload),
    totalEarnings: state.earnings.reduce((total, earning) => {
      if (earning.id !== action.payload) {
        return total + (earning.amount || 0);
      }
      return total;
    }, 0),
  };
    default:
      return state;
  }
};