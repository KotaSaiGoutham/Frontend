// src/redux/actions/index.js

// --- 1. Import all necessary Redux Action Types ---
import {
  API_REQUEST,
  FETCH_CLASSES_REQUEST,
  FETCH_CLASSES_SUCCESS,
  FETCH_CLASSES_FAILURE,
  FETCH_STUDENTS_REQUEST,
  FETCH_STUDENTS_SUCCESS,
  FETCH_STUDENTS_FAILURE,
  FETCH_SINGLE_STUDENT_REQUEST,
  FETCH_SINGLE_STUDENT_SUCCESS,
  FETCH_SINGLE_STUDENT_FAILURE,
  ADD_STUDENT_REQUEST, // NEW
  ADD_STUDENT_SUCCESS, // NEW
  ADD_STUDENT_FAILURE, // NEW
  ADD_WEEKLY_MARKS_REQUEST, // NEW
  ADD_WEEKLY_MARKS_SUCCESS, // NEW
  ADD_WEEKLY_MARKS_FAILURE, // NEW
  FETCH_EMPLOYEES_REQUEST,
  FETCH_EMPLOYEES_SUCCESS,
  FETCH_EMPLOYEES_FAILURE,
  ADD_EMPLOYEE_REQUEST, // NEW
  ADD_EMPLOYEE_SUCCESS, // NEW
  ADD_EMPLOYEE_FAILURE, // NEW
  UPDATE_DASHBOARD_CHART_DATA,
  SET_AUTH_ERROR,
  LOGOUT,
  ADD_TIMETABLE_REQUEST,
  ADD_TIMETABLE_SUCCESS,
  ADD_TIMETABLE_FAILURE,
  LOGIN_REQUEST, // NEW
  LOGIN_SUCCESS, // NEW
  LOGIN_FAILURE, // NEW
  SIGNUP_REQUEST, // <-- NEW
  SIGNUP_SUCCESS, // <-- NEW
  SIGNUP_FAILURE, // <-- NEW
  UPDATE_STUDENT_PAYMENT_REQUEST, // <-- NEW
  UPDATE_STUDENT_PAYMENT_SUCCESS, // <-- NEW
  UPDATE_STUDENT_PAYMENT_FAILURE, // <-- NEW
  FETCH_WEEKLY_MARKS_REQUEST, // <-- NEW
  FETCH_WEEKLY_MARKS_SUCCESS, // <-- NEW
  FETCH_WEEKLY_MARKS_FAILURE, // <-- NEW
  UPDATE_STUDENT_PAYMENT_STATUS_REQUEST,
  UPDATE_STUDENT_PAYMENT_STATUS_SUCCESS,
  UPDATE_STUDENT_PAYMENT_STATUS_FAILURE,
  UPDATE_STUDENT_CLASSES_REQUEST,
  UPDATE_STUDENT_CLASSES_SUCCESS,
  UPDATE_STUDENT_CLASSES_FAILURE,
  DELETE_TIMETABLE_REQUEST,
  DELETE_TIMETABLE_SUCCESS,
  DELETE_TIMETABLE_FAILURE,
  UPDATE_TIMETABLE_REQUEST,
  UPDATE_TIMETABLE_SUCCESS,
  UPDATE_TIMETABLE_FAILURE,
  ADD_STUDENT_CLEAR_STATUS,
  FETCH_PAYMENTS_REQUEST,
  FETCH_PAYMENTS_SUCCESS,
  FETCH_PAYMENTS_FAILURE,
} from "../types";
import dayjs from "dayjs";                 // ← added
import { toJsDate } from "../../mockdata/funcation";
// --- 2. Import Utility Functions ---
// Removed generateMockTimetableData from here as it's no longer used for fallback by actions
import { sortAndFilterTimetableData } from "../../mockdata/funcation";
// Removed mockStudentsData/mockEmployeesData imports here as they are not for action fallbacks
import {
  generateMockTestScores,
  generateMockStudentDemographics,
  generateMockPaymentStatus,
} from "../../mockdata/mockdata";

// --- 3. Generic API Request Action (Unchanged) ---
export const apiRequest = ({
  url,
  method = "GET",
  data = null,
  onSuccess,
  onFailure,
  onStart,
  authRequired = true,
}) => {
  let deferred = {};
  const promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return {
    type: API_REQUEST,
    payload: { url, method, data, onSuccess, onFailure, onStart, authRequired },
    meta: { deferred },
    promise,
  };
};

// --- 4. Authentication Action Creators (Unchanged) ---
export const setAuthError = (message) => ({
  type: SET_AUTH_ERROR,
  payload: message,
});

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId"); // Ensure these are also removed
  localStorage.removeItem("userEmail"); // Ensure these are also removed
  return {
    type: LOGOUT,
  };
};
// In your Redux actions file

export const updateStudentPaymentStatus = (studentId, currentStatus) => {
  const newStatus = currentStatus === "Paid" ? "Unpaid" : "Paid"; // Toggle logic

  // Data to send to the backend - only Payment Status
  const updateData = { "Payment Status": newStatus };

  return apiRequest({
    url: `/api/data/students/${studentId}`, // Backend endpoint for updating a student
    method: "PATCH", // Use PATCH for partial update
    data: updateData, // The payload to send
    onStart: () => ({
      type: UPDATE_STUDENT_PAYMENT_REQUEST,
      payload: studentId, // Pass the studentId to track loading for this specific student
    }),
    onSuccess: (data, dispatch) => {
      dispatch({
        type: UPDATE_STUDENT_PAYMENT_SUCCESS,
        payload: {
          studentId,
          newStatus,
          message: data.message || "Payment status updated.",
          // Removed `paidDate` and `nextDueDate` from payload
        },
      });
      // OPTIONAL BUT RECOMMENDED: Re-fetch all students to ensure UI consistency
      dispatch(fetchStudents());
    },
    onFailure: (error, dispatch) => {
      console.error(
        `Error updating payment status for student ${studentId}:`,
        error
      );
      const errorMessage =
        (error && (error.error || error.message)) ||
        "Failed to update payment status.";
      dispatch({
        type: UPDATE_STUDENT_PAYMENT_FAILURE,
        payload: {
          studentId, // Pass studentId to clear loading state for this specific student
          error: errorMessage,
        },
      });
      // If error is 401/403, consider logging out
      if (error && (error.status === 401 || error.status === 403)) {
        dispatch(
          setAuthError("Session expired or unauthorized. Please log in again.")
        );
        dispatch(logoutUser());
      }
    },
    authRequired: true, // This API call requires authentication
  });
};
// --- NEW: Signup User Action Creator ---
export const signupUser = ({ name, email, mobile, password }) =>
  apiRequest({
    url: "/api/auth/signup", // Correct signup endpoint
    method: "POST",
    data: { name, email, mobile, password },
    onStart: SIGNUP_REQUEST,
    onSuccess: (data, dispatch) => {
      // Signup successful, dispatch success action
      dispatch({
        type: SIGNUP_SUCCESS,
        payload: data.message || "Signup successful! You can now log in.", // Backend message
      });
      // Optionally, you might dispatch SET_AUTH_ERROR(null) to clear any previous auth errors
      dispatch(setAuthError(null));
    },
    onFailure: (error, dispatch) => {
      console.error("Signup API error received by onFailure:", error);
      // Determine the best error message for the user
      const errorMessage =
        (error && (error.error || error.message)) ||
        "Signup failed. Please try again.";
      dispatch({
        type: SIGNUP_FAILURE,
        payload: errorMessage,
      });
    },
    authRequired: false, // Signup does not require authentication
  });

export const loginUser = ({ username, password }) =>
  apiRequest({
    url: "/api/auth/login",
    method: "POST",
    data: { username, password },
    onStart: LOGIN_REQUEST,
    onSuccess: (data, dispatch) => {
      if (data.token) {
        localStorage.setItem("token", data.token);

        // --- IMPORTANT: Adapt this part based on the ACTUAL backend response ---
        let userIdToStore = null;
        let userEmailToStore = null;
        let userRoleToStore = data.role || 'unknown'; // Get role from response
        let userNameToStore = null;
        let isPhysics = false; // Default to false
        let isChemistry = false; // Default to false
        let AllowAll = false; // Default to false
        const userDetailsFromResponse = data.data; // Assuming user details are under 'data'

        if (userRoleToStore === 'student') {
            userIdToStore = userDetailsFromResponse.ContactNumber; // Or _id if available
            userEmailToStore = userDetailsFromResponse.ContactNumber; // Or a dedicated email field
            userNameToStore = userDetailsFromResponse.Name;
            // isPhysics, isChemistry, AllowAll from student response?
            // They were null in the JWT from your sample student response.
            // You need to decide if these flags come directly from the top level (data.isPhysics)
            // or if they are properties within data.data, or determined by the 'role'
            // For now, I'll assume they might be at the top level (data.isPhysics) if present,
            // but if not, they'll remain false from defaults.
            isPhysics = data.isPhysics || false;
            isChemistry = data.isChemistry || false;
            AllowAll = data.AllowAll || false;
        } else if (userRoleToStore === 'faculty') {
            // Assuming a faculty response would have different keys, e.g.:
            userIdToStore = userDetailsFromResponse._id; // Example faculty ID
            userEmailToStore = userDetailsFromResponse.email;
            userNameToStore = userDetailsFromResponse.name;
            isPhysics = data.isPhysics || false; // Assuming these are still at top level or set based on faculty
            isChemistry = data.isChemistry || false;
            AllowAll = data.AllowAll || false;

            localStorage.setItem("userRole", userRoleToStore);
            localStorage.setItem("isPhysics", isPhysics);
            localStorage.setItem("isChemistry", isChemistry);
            localStorage.setItem("AllowAll", AllowAll);

        }

        localStorage.setItem("userId", userIdToStore);
        localStorage.setItem("userEmail", userEmailToStore);


        dispatch({
          type: LOGIN_SUCCESS,
          payload: {
            token: data.token,
            // The 'user' object in the payload should match what your reducer expects
            user: {
              id: userIdToStore,
              email: userEmailToStore,
              name: userNameToStore,
              role: userRoleToStore, // Include the role
              isPhysics: isPhysics,
              isChemistry: isChemistry,
              AllowAll: AllowAll,
              // Spread all other student/faculty data for the 'user' object in state
              ...userDetailsFromResponse
            },
          },
        });
      } else {
        const errorMessage =
          "Login successful, but no token received. Please try again.";
        dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
      }
    },
    onFailure: (error, dispatch) => {
      // ... (your existing onFailure logic is good for debugging)
      console.error("Login API error:", error);
      const errorMessage =
        error.message ||
        error.error ||
        "Login failed. Please check your credentials.";
      dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
    },
    authRequired: false,
  });

// --- 5. Class Timetable Action Creator (Updated - no mock fallback) ---
export const fetchUpcomingClasses = () =>
  apiRequest({
    url: "/api/data/timetable",
    method: "GET",
    onStart: FETCH_CLASSES_REQUEST,
    onSuccess: (data, dispatch) => {
      const finalTimetable = sortAndFilterTimetableData(data || []); // Ensure data is an array
      dispatch({
        type: FETCH_CLASSES_SUCCESS,
        payload: finalTimetable,
      });
    },
    onFailure: (error, dispatch) => {
      console.error("Error fetching timetable from API:", error);
      dispatch({
        type: FETCH_CLASSES_FAILURE,
        payload: {
          error: error.error || error.message || "Failed to fetch classes",
        },
      });
      if (error.status === 401 || error.status === 403) {
        dispatch(
          setAuthError("Session expired or unauthorized. Please log in again.")
        );
      }
    },
    authRequired: true,
  });

// --- 6. Student List Action Creator (Updated - no mock fallback) ---
export const fetchStudents = () =>
  apiRequest({
    url: "/api/data/students",
    method: "GET",
    onStart: FETCH_STUDENTS_REQUEST,
    onSuccess: (data, dispatch) => {
      const studentsFromApi = data || [];
      dispatch({
        type: FETCH_STUDENTS_SUCCESS,
        payload: studentsFromApi,
      });

      // Charts are generated using the actual fetched student data.
      dispatch({
        type: UPDATE_DASHBOARD_CHART_DATA,
        payload: {
          testResults: generateMockTestScores(), // This one is always mock
          studentDemographics: generateMockStudentDemographics(studentsFromApi),
          paymentStatus: generateMockPaymentStatus(studentsFromApi),
        },
      });
    },
    onFailure: (error, dispatch) => {
      console.error("Error fetching students from API:", error);
      const errorMessage =
        error.error || error.message || "Failed to fetch students";
      if (error.status === 401 || error.status === 403) {
        dispatch(
          setAuthError("Session expired or unauthorized. Please log in again.")
        );
      }
      dispatch({
        type: FETCH_STUDENTS_FAILURE,
        payload: { error: errorMessage },
      });
    },
    authRequired: true,
  });

// --- Fetch Single Student by ID Action Creator (Unchanged) ---
export const fetchStudentById = (studentId) =>
  apiRequest({
    url: `/api/students/${studentId}`,
    method: "GET",
    onStart: FETCH_SINGLE_STUDENT_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_SINGLE_STUDENT_SUCCESS,
        payload: data,
      });
    },
    onFailure: (error, dispatch) => {
      console.error(`Error fetching student ${studentId} data:`, error);
      const errorMessage =
        error.error ||
        error.message ||
        `Failed to fetch student ${studentId} data`;
      if (error.status === 401 || error.status === 403) {
        dispatch(
          setAuthError("Session expired or unauthorized. Please log in again.")
        );
      }
      dispatch({
        type: FETCH_SINGLE_STUDENT_FAILURE,
        payload: { error: errorMessage },
      });
    },
    authRequired: true,
  });

// --- NEW: Add Student Action Creator ---
export const addStudent = (studentData) =>
  apiRequest({
    url: "/api/data/addStudent",
    method: "POST",
    data: studentData, // The student data to send in the request body
    onStart: ADD_STUDENT_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: ADD_STUDENT_SUCCESS,
        payload: data, // The response from the backend (e.g., confirmation message, new student ID)
      });
      // Optionally, you might refetch the entire student list to update UI
      dispatch(fetchStudents());
    },
    onFailure: (error, dispatch) => {
      console.error("Error adding student:", error);
      const errorMessage =
        error.error || error.message || "Failed to add student";
      if (error.status === 401 || error.status === 403) {
        dispatch(
          setAuthError(
            "Authentication failed or session expired. Please log in again."
          )
        );
      }
      dispatch({
        type: ADD_STUDENT_FAILURE,
        payload: { error: errorMessage },
      });
    },
    authRequired: true,
  });
export const fetchWeeklyMarks = (studentId) =>
  apiRequest({
    // IMPORTANT: Make sure this URL is correct and matches your backend API
    url: `/api/data/${studentId}/marks/weekly`, // Consistent URL with your previous component snippet
    method: "GET",
    onStart: FETCH_WEEKLY_MARKS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_WEEKLY_MARKS_SUCCESS,
        payload: data, // Assuming data is the array of weekly marks
      });
    },
    onFailure: (error, dispatch) => {
      console.error("Error fetching weekly marks:", error);
      const errorMessage =
        (error && (error.error || error.message)) ||
        "Failed to fetch weekly marks.";
      dispatch({
        type: FETCH_WEEKLY_MARKS_FAILURE,
        payload: errorMessage,
      });
      // Handle unauthorized/expired token through the middleware's global error handling
      // or explicitly here if needed.
      if (error && (error.status === 401 || error.status === 403)) {
        dispatch(
          setAuthError("Session expired or unauthorized. Please log in again.")
        );
        dispatch(logoutUser());
      }
    },
    authRequired: true, // This action requires authentication
  });
// --- NEW: Add Weekly Marks Action Creator ---
export const addWeeklyMarks = (studentId, newMark) =>
  apiRequest({
    url: `/api/data/students/${studentId}/marks/weekly`,
    method: "POST",
    data: newMark, // The marks data to send
    onStart: ADD_WEEKLY_MARKS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: ADD_WEEKLY_MARKS_SUCCESS,
        payload: data, // The response from the backend
      });
    },
    onFailure: (error, dispatch) => {
      console.error(`Error adding marks for student ${studentId}:`, error);
      const errorMessage =
        error.error ||
        error.message ||
        `Failed to add marks for student ${studentId}`;
      if (error.status === 401 || error.status === 403) {
        dispatch(
          setAuthError(
            "Authentication failed or session expired. Please log in again."
          )
        );
      }
      dispatch({
        type: ADD_WEEKLY_MARKS_FAILURE,
        payload: { error: errorMessage },
      });
    },
    authRequired: true,
  });

// --- 7. Employee Action Creator (Updated - no mock fallback) ---
export const fetchEmployees = () =>
  apiRequest({
    url: "/api/data/empolyees",
    method: "GET",
    onStart: FETCH_EMPLOYEES_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_EMPLOYEES_SUCCESS,
        payload: data || [],
      });
    },
    onFailure: (error, dispatch) => {
      console.error("Error fetching employees from API:", error);
      const errorMessage =
        error.error || error.message || "Failed to fetch employees";
      if (error.status === 401 || error.status === 403) {
        dispatch(
          setAuthError("Session expired or unauthorized. Please log in again.")
        );
      }
      dispatch({
        type: FETCH_EMPLOYEES_FAILURE,
        payload: { error: errorMessage },
      });
    },
    authRequired: true,
  });

// --- NEW: Add Employee Action Creator ---
export const addEmployee = (employeeData) =>
  apiRequest({
    url: "/api/data/addEmployee",
    method: "POST",
    data: employeeData, // The employee data to send in the request body
    onStart: ADD_EMPLOYEE_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: ADD_EMPLOYEE_SUCCESS,
        payload: data,
      });
      // Optionally, refetch the entire employee list to update UI
      dispatch(fetchEmployees());
    },
    onFailure: (error, dispatch) => {
      console.error("Error adding employee:", error);
      const errorMessage =
        error.error || error.message || "Failed to add employee";
      if (error.status === 401 || error.status === 403) {
        dispatch(
          setAuthError(
            "Authentication failed or session expired. Please log in again."
          )
        );
      }
      dispatch({
        type: ADD_EMPLOYEE_FAILURE,
        payload: { error: errorMessage },
      });
    },
    authRequired: true,
  });
export const addTimetableEntry = (timetableData) =>
  apiRequest({
    url: "/api/data/addTimetable",
    method: "POST",
    data: timetableData, // The payload you constructed in your component
    onStart: ADD_TIMETABLE_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: ADD_TIMETABLE_SUCCESS,
        payload: data, // The response from the backend
      });
      // Optionally, refetch the entire timetable list to update UI immediately
      dispatch(fetchUpcomingClasses());
    },
    onFailure: (error, dispatch) => {
      console.error("Error adding timetable entry:", error);
      const errorMessage =
        error.error || error.message || "Failed to add timetable entry.";
      if (error.status === 401 || error.status === 403) {
        dispatch(
          setAuthError(
            "Authentication failed or session expired. Please log in again."
          )
        );
      }
      dispatch({
        type: ADD_TIMETABLE_FAILURE,
        payload: { error: errorMessage },
      });
    },
    authRequired: true,
  });

// --------------------------------
// studentsThunks.js
// --------------------------------
export const updateClassesCompleted =
  (studentId, delta) => async (dispatch) => {
    // Build the FSA‑style action
    const apiAction = apiRequest({
      url: `/api/data/students/${studentId}/classes`,   // drop the extra /api/data if you proxy
      method: "POST",
      data: { delta },
      authRequired: true,
    });

    // ⬇️ THIS dispatch actually triggers the middleware
    dispatch(apiAction);

    // Wait for the middleware to resolve the deferred promise it
    // attached to meta.deferred
    const updated = await apiAction.promise;   // ✔ server data here

    dispatch({
      type: UPDATE_STUDENT_CLASSES_SUCCESS,
      payload: updated,
    });

    // optional refresh
    // dispatch(fetchStudents());

    return updated;
  };






export const deleteTimetable = (timetableId) =>
  apiRequest({
    url: `/api/data/timetables/${timetableId}`, // This must match your backend DELETE route
    method: "DELETE",
    onStart: DELETE_TIMETABLE_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: DELETE_TIMETABLE_SUCCESS,
        payload: timetableId, // Send the ID of the deleted item for potential UI updates
      });
      // Re-fetch to update the list immediately after successful deletion
      dispatch(fetchUpcomingClasses());
    },
    onFailure: (error, dispatch) => {
      console.error("Error deleting timetable entry:", error);
      const errorMessage =
        error.error || error.message || "Failed to delete timetable entry.";
      if (error.status === 401 || error.status === 403) {
        dispatch(
          setAuthError(
            "Authentication failed or session expired. Please log in again."
          )
        );
      }
      dispatch({
        type: DELETE_TIMETABLE_FAILURE,
        payload: { error: errorMessage },
      });
      // No need to throw error here, as the component will handle dispatching
      // the failure type and potentially showing a notification based on that.
    },
    authRequired: true, // Assuming deletion requires authentication
  });

export const updateTimetableEntry = (timetableData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_TIMETABLE_REQUEST });

    // The timetableData object should contain the 'id' of the entry to update,
    // along with the updated fields (Day, Faculty, Subject, Time, Topic, Student).
    // Make sure your backend expects the ID in the URL params or as part of the body.
    // For RESTful APIs, it's common to have the ID in the URL for PUT/PATCH.
    const { id, ...fieldsToUpdate } = timetableData;

    if (!id) {
      throw new Error("Timetable ID is missing for update operation.");
    }

    const response = await apiRequest({
      url: `/api/data/timetables/${id}`, // **Adjust this API endpoint to match your backend's PUT/PATCH route**
      method: "PUT", // Use PUT or PATCH for updates
      data: fieldsToUpdate, // Send the updated fields in the request body
    });

    dispatch({ type: UPDATE_TIMETABLE_SUCCESS, payload: response.data });
    // After a successful update, re-fetch your list of classes to show the latest data
    dispatch(fetchUpcomingClasses());

    return response.data; // Return updated data if needed by the component
  } catch (error) {
    console.error("Error updating timetable entry:", error);
    dispatch({ type: UPDATE_TIMETABLE_FAILURE, payload: error.message });
    throw error; // Re-throw to be caught by the component for UI feedback
  }
};
// New action creator to clear the add student status
export const clearAddStudentStatus = () => ({
  type: ADD_STUDENT_CLEAR_STATUS,
});

export const formatPaymentHistory = (payments = []) =>
  payments
    .map((p) => {
      const dateObj = toJsDate(p.date);
      if (!dateObj) {
        console.warn("Skipping payment without valid date:", p);
        return null;
      }

      return {
        name: dayjs(dateObj).format("DD MMM YY"), // X‑axis
        Paid: p.status === "Paid" ? 1 : 0,
        Unpaid: p.status === "Unpaid" ? 1 : 0,
        rawDate: dateObj, // keep if you need to sort later
      };
    })
    .filter(Boolean); // drop nulls

/**
 * Fetch the payment history for a single student (ascending order).
 * @param {string} studentId – Firestore document ID of the student
 */
export const fetchPaymentHistory = (studentId) =>
  apiRequest({
    url: `/api/data/students/${studentId}/payments?order=asc`,
    method: "GET",

    // ----- lifecycle handlers ---------------------------------------------
    onStart: FETCH_PAYMENTS_REQUEST,

    onSuccess: (data, dispatch) => {
      const formatted = formatPaymentHistory(data?.payments || []);
      dispatch({
        type: FETCH_PAYMENTS_SUCCESS,
        payload: formatted,
      });
    },

    onFailure: (error, dispatch) => {
      console.error("Error fetching payment history:", error);
      dispatch({
        type: FETCH_PAYMENTS_FAILURE,
        payload: {
          error: error?.error || error.message || "Failed to fetch payments",
        },
      });

      if (error?.status === 401 || error?.status === 403) {
        dispatch(
          setAuthError("Session expired or unauthorized. Please log in again.")
        );
      }
    },

    authRequired: true,
  });
