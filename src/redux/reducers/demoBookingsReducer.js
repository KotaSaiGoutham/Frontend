// reducers/demoBookingsReducer.js
import {
  BOOK_DEMO_REQUEST,
  BOOK_DEMO_SUCCESS,
  BOOK_DEMO_FAILURE,
  FETCH_DEMO_BOOKINGS_REQUEST,
  FETCH_DEMO_BOOKINGS_SUCCESS,
  FETCH_DEMO_BOOKINGS_FAILURE,
  UPDATE_DEMO_STATUS_REQUEST,
  UPDATE_DEMO_STATUS_SUCCESS,
  UPDATE_DEMO_STATUS_FAILURE
} from "../types";

const initialState = {
  demoBookings: [],
  loading: false,
  error: null,
  bookSuccess: false,
  updateSuccess: false,
};

const demoBookingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case BOOK_DEMO_REQUEST:
    case FETCH_DEMO_BOOKINGS_REQUEST:
    case UPDATE_DEMO_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        bookSuccess: false,
        updateSuccess: false,
      };

    case BOOK_DEMO_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        bookSuccess: true,
      };

    case FETCH_DEMO_BOOKINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        demoBookings: action.payload,
        error: null,
      };

    case UPDATE_DEMO_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        updateSuccess: true,
        // Optionally update the local state if needed
        demoBookings: state.demoBookings.map(booking =>
          booking.id === action.payload.demoId 
            ? { 
                ...booking, 
                status: action.payload.status,
                contactReason: action.payload.contactReason 
              }
            : booking
        ),
      };

    case BOOK_DEMO_FAILURE:
    case FETCH_DEMO_BOOKINGS_FAILURE:
    case UPDATE_DEMO_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload?.error || action.payload,
        bookSuccess: false,
        updateSuccess: false,
      };

    default:
      return state;
  }
};

export default demoBookingsReducer;