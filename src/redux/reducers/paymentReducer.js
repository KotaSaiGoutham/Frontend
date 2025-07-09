// reducers/paymentsReducer.js
import {
  FETCH_PAYMENTS_REQUEST,
  FETCH_PAYMENTS_SUCCESS,
  FETCH_PAYMENTS_FAILURE,
} from "../types";

const initialState = {
  data: [],        // ← ALWAYS an array
  loading: false,
  error: null,
};

export default function paymentsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PAYMENTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_PAYMENTS_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case FETCH_PAYMENTS_FAILURE:
      return { ...state, loading: false, error: action.payload.error, data: [] };
    default:
      return state;
  }
}
