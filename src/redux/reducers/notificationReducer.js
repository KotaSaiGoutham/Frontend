import {
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILURE,
  MARK_NOTIFICATION_READ_SUCCESS
} from "../types";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NOTIFICATIONS_REQUEST:
      return { ...state, loading: true, error: null };
      
    case FETCH_NOTIFICATIONS_SUCCESS:
      return { ...state, loading: false, items: action.payload };
      
    case FETCH_NOTIFICATIONS_FAILURE:
      return { ...state, loading: false, error: action.payload.error };

    case MARK_NOTIFICATION_READ_SUCCESS:
      // Remove the read item from the list locally
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      };

    default:
      return state;
  }
};

export default notificationReducer;