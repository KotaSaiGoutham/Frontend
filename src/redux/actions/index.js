import {
  UPLOAD_IMPORTANT_FILE_REQUEST,
  UPLOAD_IMPORTANT_FILE_SUCCESS,
  UPLOAD_IMPORTANT_FILE_FAILURE,
  FETCH_IMPORTANT_FILES_REQUEST,
  FETCH_IMPORTANT_FILES_SUCCESS,
  FETCH_IMPORTANT_FILES_FAILURE,
  DELETE_IMPORTANT_FILE_REQUEST,
  DELETE_IMPORTANT_FILE_SUCCESS,
  DELETE_IMPORTANT_FILE_FAILURE,
    UPLOAD_ICON_REQUEST,
  UPLOAD_ICON_SUCCESS,
  UPLOAD_ICON_FAILURE,
  UPDATE_PROFILE_FAILURE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_REQUEST,
 UPDATE_PROFILE_PIC_REQUEST,
  UPDATE_PROFILE_PIC_SUCCESS,
  UPDATE_PROFILE_PIC_FAILURE,
  GET_PROFILE_ICON_REQUEST,
  GET_PROFILE_ICON_SUCCESS,
  GET_PROFILE_ICON_FAILURE,
  EVALUATE_PAPER_SUCCESS,
  EVALUATE_PAPER_FAILURE,
  EVALUATE_PAPER_REQUEST,
  UPLOAD_RESULT_REQUEST,
  UPLOAD_RESULT_SUCCESS,
  UPLOAD_RESULT_FAILURE,
  RESET_EMPLOYEE_LOADING_STATE,
  SET_CURRENT_EMPLOYEE,
  FETCH_EMPLOYEE_FAILURE,
  FETCH_EMPLOYEE_REQUEST,
  FETCH_EMPLOYEE_SUCCESS,
  FETCH_EMPLOYEE_PAYMENTS_FAILURE,
  FETCH_EMPLOYEE_PAYMENTS_REQUEST,
  FETCH_EMPLOYEE_PAYMENTS_SUCCESS,
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILURE,
  MARK_NOTIFICATION_READ_SUCCESS,
  MARK_NOTIFICATION_READ_FAILURE,
  MARK_NOTIFICATION_READ_REQUEST,
  FETCH_STUDENT_SYLLABUS_FAILURE,
  FETCH_STUDENT_SYLLABUS_SUCCESS,
  FETCH_STUDENT_SYLLABUS_REQUEST,
  ADD_STUDENT_SYLLABUS_FAILURE,
  ADD_STUDENT_SYLLABUS_SUCCESS,
  ADD_STUDENT_SYLLABUS_REQUEST,
  UPLOAD_STUDENT_DATA_REQUEST,
  UPLOAD_STUDENT_DATA_SUCCESS,
  UPLOAD_STUDENT_DATA_FAILURE,
  FETCH_UPLOAD_HISTORY_REQUEST,
  FETCH_UPLOAD_HISTORY_SUCCESS,
  FETCH_UPLOAD_HISTORY_FAILURE,
  DELETE_UPLOAD_REQUEST,
  DELETE_UPLOAD_SUCCESS,
  DELETE_UPLOAD_FAILURE,
  CREATE_LEAD_REQUEST,
  CREATE_LEAD_SUCCESS,
  CREATE_LEAD_FAILURE,
  FETCH_LEADS_REQUEST,
  FETCH_LEADS_SUCCESS,
  FETCH_LEADS_FAILURE,
  UPDATE_LEAD_STATUS_REQUEST,
  UPDATE_LEAD_STATUS_SUCCESS,
  UPDATE_LEAD_STATUS_FAILURE,
  FETCH_MONTHLY_STUDENT_DETAILS_FAILURE,
  FETCH_MONTHLY_STUDENT_DETAILS_SUCCESS,
  FETCH_MONTHLY_STUDENT_DETAILS_REQUEST,
  CLEAR_MONTHLY_STUDENT_DETAILS,
  UPDATE_ACADEMY_EARNING_REQUEST,
  UPDATE_ACADEMY_EARNING_SUCCESS,
  UPDATE_ACADEMY_EARNING_FAILURE,
  DELETE_ACADEMY_EARNING_SUCCESS,
  DELETE_ACADEMY_EARNING_FAILURE,
  DELETE_ACADEMY_EARNING_REQUEST,
  FETCH_EXAM_CONSOLIDATION_SUCCESS,
  FETCH_EXAM_CONSOLIDATION_FAILURE,
  FETCH_EXAM_CONSOLIDATION_REQUEST,
  FETCH_TUTOR_IDEAS_REQUEST,
  FETCH_TUTOR_IDEAS_SUCCESS,
  FETCH_TUTOR_IDEAS_FAILURE,
  ADD_TUTOR_IDEA_REQUEST,
  ADD_TUTOR_IDEA_SUCCESS,
  ADD_TUTOR_IDEA_FAILURE,
  UPDATE_TUTOR_IDEA_SUCCESS,
  UPDATE_TUTOR_IDEA_FAILURE,
  UPDATE_TUTOR_IDEA_REQUEST,
  SET_STUDENTS_NEED_REFRESH,
  UPLOAD_STUDY_MATERIAL_REQUEST,
  UPLOAD_STUDY_MATERIAL_SUCCESS,
  UPLOAD_STUDY_MATERIAL_FAILURE,
  UPLOAD_QUESTION_PAPER_REQUEST,
  UPLOAD_QUESTION_PAPER_SUCCESS,
  UPLOAD_QUESTION_PAPER_FAILURE,
  FETCH_STUDY_MATERIALS_REQUEST,
  FETCH_STUDY_MATERIALS_SUCCESS,
  FETCH_STUDY_MATERIALS_FAILURE,
  FETCH_QUESTION_PAPERS_REQUEST,
  FETCH_QUESTION_PAPERS_SUCCESS,
  FETCH_QUESTION_PAPERS_FAILURE,
  FETCH_ACADEMY_FINANCE_SUCCESS,
  FETCH_ACADEMY_FINANCE_FAILURE,
  FETCH_ACADEMY_FINANCE_REQUEST,
  ADD_ACADEMY_EARNING_FAILURE,
  ADD_ACADEMY_EARNING_SUCCESS,
  ADD_ACADEMY_EARNING_REQUEST,
  FETCH_YEAR_STATISTICS_REQUEST,
  FETCH_YEAR_STATISTICS_SUCCESS,
  FETCH_YEAR_STATISTICS_FAILURE,
  CLEAR_SEARCH_RESULTS,
  SET_CURRENT_STUDENT,
  CLEAR_CURRENT_STUDENT,
  API_REQUEST,
  DELETE_LECTURE_MATERIAL_SUCCESS,
  DELETE_LECTURE_MATERIAL_FAILURE,
  DELETE_LECTURE_MATERIAL_REQUEST,
  REVISION_PROGRAM_REGISTER_REQUEST,
  REVISION_PROGRAM_REGISTER_SUCCESS,
  REVISION_PROGRAM_REGISTER_FAILURE,
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
  ADD_DEMO_CLASS_REQUEST,
  ADD_DEMO_CLASS_SUCCESS,
  ADD_DEMO_CLASS_FAILURE,
  FETCH_DEMO_CLASSES_REQUEST,
  FETCH_DEMO_CLASSES_SUCCESS,
  FETCH_DEMO_CLASSES_FAILURE,
  UPDATE_DEMO_CLASS_STATUS_REQUEST,
  UPDATE_DEMO_CLASS_STATUS_SUCCESS,
  UPDATE_DEMO_CLASS_STATUS_FAILURE,
  GENERATE_AND_SAVE_TIMETABLES_FAIL,
  GENERATE_AND_SAVE_TIMETABLES_SUCCESS,
  GENERATE_AND_SAVE_TIMETABLES_REQUEST,
  // NEW AUTOTIMETABLE ACTION TYPES
  FETCH_AUTOTIMETABLES_REQUEST,
  FETCH_AUTOTIMETABLES_SUCCESS,
  FETCH_AUTOTIMETABLES_FAILURE,
  SAVE_AUTOTIMETABLES_REQUEST,
  SAVE_AUTOTIMETABLES_SUCCESS,
  SAVE_AUTOTIMETABLES_FAILURE,
  UPDATE_AUTOTIMETABLE_REQUEST,
  UPDATE_AUTOTIMETABLE_SUCCESS,
  UPDATE_AUTOTIMETABLE_FAILURE,
  DELETE_AUTOTIMETABLE_REQUEST,
  DELETE_AUTOTIMETABLE_SUCCESS,
  DELETE_AUTOTIMETABLE_FAILURE,
  SAVE_AUTOGENERATED_TIMETABLES_REQUEST,
  SAVE_AUTOGENERATED_TIMETABLES_SUCCESS,
  SAVE_AUTOGENERATED_TIMETABLES_FAILURE,
  UPDATE_AUTO_TIMETABLE_TOPIC_REQUEST,
  UPDATE_AUTO_TIMETABLE_TOPIC_SUCCESS,
  UPDATE_AUTO_TIMETABLE_TOPIC_FAILURE,
  UPDATE_STUDENT_FIELD_REQUEST,
  UPDATE_STUDENT_FIELD_SUCCESS,
  UPDATE_STUDENT_FIELD_FAILURE,
  UPDATE_STUDENT_REQUEST,
  UPDATE_STUDENT_SUCCESS,
  UPDATE_STUDENT_FAILURE,
  DELETE_STUDENT_REQUEST,
  DELETE_STUDENT_SUCCESS,
  DELETE_STUDENT_FAILURE,
  DELETE_DEMO_CLASS_REQUEST,
  DELETE_DEMO_CLASS_SUCCESS,
  DELETE_DEMO_CLASS_FAILURE,
  UPDATE_DEMO_CLASS_REQUEST,
  UPDATE_DEMO_CLASS_SUCCESS,
  UPDATE_DEMO_CLASS_FAILURE,
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
  CLEAR_AUTH_ERROR,
  RESET_LOADING_STATE,
  FETCH_STUDENT_EXAMS_REQUEST,
  FETCH_STUDENT_EXAMS_SUCCESS,
  FETCH_STUDENT_EXAMS_FAILURE,
  ADD_STUDENT_EXAM_REQUEST,
  ADD_STUDENT_EXAM_SUCCESS,
  ADD_STUDENT_EXAM_FAILURE,
  UPDATE_STUDENT_EXAM_REQUEST,
  UPDATE_STUDENT_EXAM_SUCCESS,
  UPDATE_STUDENT_EXAM_FAILURE,
  DELETE_STUDENT_EXAM_REQUEST,
  DELETE_STUDENT_EXAM_SUCCESS,
  DELETE_STUDENT_EXAM_FAILURE,
  SAVE_OR_FETCH_AUTOTIMETABLES_REQUEST,
  SAVE_OR_FETCH_AUTOTIMETABLES_SUCCESS,
  SAVE_OR_FETCH_AUTOTIMETABLES_FAILURE,
  FETCH_CLASS_UPDATES_START,
  FETCH_CLASS_UPDATES_SUCCESS,
  FETCH_CLASS_UPDATES_FAILURE,
  FETCH_MONTHLY_PAYMENTS_SUCCESS,
  FETCH_ALL_MONTHLY_PAYMENTS_REQUEST,
  FETCH_ALL_MONTHLY_PAYMENTS_SUCCESS,
  FETCH_ALL_MONTHLY_PAYMENTS_FAILURE,
  UPDATE_SYLLABUS_REQUEST,
  UPDATE_SYLLABUS_SUCCESS,
  UPDATE_SYLLABUS_FAILURE,
  UPDATE_EMPLOYEE_REQUEST,
  UPDATE_EMPLOYEE_SUCCESS,
  UPDATE_EMPLOYEE_FAILURE,
  DELETE_REVISION_STUDENT_REQUEST,
  DELETE_REVISION_STUDENT_SUCCESS,
  DELETE_REVISION_STUDENT_FAILURE,
  FETCH_REVISION_STUDENTS_FAILURE,
  FETCH_REVISION_STUDENTS_REQUEST,
  FETCH_REVISION_STUDENTS_SUCCESS,
  UPDATE_PAYMENT_STATUS_REQUEST,
  UPDATE_PAYMENT_STATUS_SUCCESS,
  UPDATE_PAYMENT_STATUS_FAILURE,
  UPDATE_STUDENT_STATUS_REQUEST,
  UPDATE_STUDENT_STATUS_SUCCESS,
  UPDATE_STUDENT_STATUS_FAILURE,
  FETCH_LECTURE_MATERIALS_REQUEST,
  FETCH_LECTURE_MATERIALS_SUCCESS,
  FETCH_LECTURE_MATERIALS_FAILURE,
  UPLOAD_LECTURE_MATERIAL_REQUEST,
  UPLOAD_LECTURE_MATERIAL_SUCCESS,
  UPLOAD_LECTURE_MATERIAL_FAILURE,
  FETCH_REVISION_CLASSES_REQUEST,
  FETCH_STUDENT_CLASSES_SUCCESS,
  FETCH_STUDENT_CLASSES_FAILURE,
  FETCH_STUDENT_CLASSES_REQUEST,
  FETCH_REVISION_CLASSES_SUCCESS,
  UPDATE_CLASS_ATTENDANCE_REQUEST,
  UPDATE_CLASS_ATTENDANCE_SUCCESS,
  UPDATE_CLASS_ATTENDANCE_FAILURE,
  FETCH_REVISION_EXAMS_REQUEST,
  FETCH_REVISION_EXAMS_SUCCESS,
  FETCH_REVISION_CLASSES_FAILURE,
  UPDATE_REVISION_FEE_FAILURE,
  UPDATE_REVISION_FEE_SUCCESS,
  UPDATE_REVISION_FEE_REQUEST,
  FETCH_CLASS_SCHEDULE_REQUEST,
  FETCH_CLASS_SCHEDULE_SUCCESS,
  FETCH_CLASS_SCHEDULE_FAILURE,
  UPDATE_CLASS_SCHEDULE_REQUEST,
  UPDATE_CLASS_SCHEDULE_SUCCESS,
  UPDATE_CLASS_SCHEDULE_FAILURE,
  SEARCH_STUDENT_CLASSES_SUCCESS,
  SEARCH_STUDENT_CLASSES_FAILURE,
  SEARCH_STUDENT_CLASSES_REQUEST,
  FETCH_ATTENDANCE_SUMMARY_SUCCESS,
  FETCH_ATTENDANCE_SUMMARY_REQUEST,
  FETCH_ATTENDANCE_SUMMARY_FAILURE,
  UPDATE_DEMO_STATUS_SUCCESS,
  FETCH_DEMO_BOOKINGS_FAILURE,
  UPDATE_DEMO_STATUS_FAILURE,
  BOOK_DEMO_REQUEST,
  FETCH_DEMO_BOOKINGS_REQUEST,
  FETCH_DEMO_BOOKINGS_SUCCESS,
  UPDATE_DEMO_STATUS_REQUEST,
  BOOK_DEMO_SUCCESS,
  BOOK_DEMO_FAILURE,
  FETCH_STUDENT_PPTS_REQUEST,
  FETCH_STUDENT_PPTS_SUCCESS,
  FETCH_STUDENT_PPTS_FAILURE,
  FETCH_STUDENT_WORKSHEETS_REQUEST,
  FETCH_STUDENT_WORKSHEETS_SUCCESS,
  FETCH_STUDENT_WORKSHEETS_FAILURE,
  FETCH_MONTHLY_PAYMENT_DETAILS_REQUEST,
  FETCH_MONTHLY_PAYMENT_DETAILS_SUCCESS,
  FETCH_MONTHLY_PAYMENT_DETAILS_FAILURE,
  CLEAR_MONTHLY_PAYMENT_DETAILS,
} from "../types";
import dayjs from "dayjs"; // ← added
import { toJsDate } from "../../mockdata/function";
// --- 2. Import Utility Functions ---
// Removed generateMockTimetableData from here as it's no longer used for fallback by actions
import { sortAndFilterTimetableData } from "../../mockdata/function";
// Removed mockStudentsData/mockEmployeesData imports here as they are not for action fallbacks
import {
  generateMockTestScores,
  generateMockStudentDemographics,
  generateMockPaymentStatus,
} from "../../mockdata/mockdata";
import { constructNow } from "date-fns";

// --- 3. Generic API Request Action (Unchanged) ---
export const apiRequest = ({
  url,
  method = "GET",
  data = null,
  params = null, // ADD THIS LINE
  onSuccess,
  onFailure,
  onStart,
  authRequired = true,
  timeout = 120000,
}) => {
  let deferred = {};
  const promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return {
    type: API_REQUEST,
    payload: {
      url,
      method,
      data,
      params, // ADD THIS LINE
      onSuccess,
      onFailure,
      onStart,
      authRequired,
    },
    meta: { deferred },
    promise,
    timeout,
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
export const clearMonthlyPaymentDetails = () => ({
  type: CLEAR_MONTHLY_PAYMENT_DETAILS,
});
// src/redux/actions/studentActions.js
export const updateStudentField = (studentId, fieldName, newValue) => {
  const updateData = { [fieldName]: newValue };

  return apiRequest({
    url: `/api/data/students/${studentId}`,
    method: "PATCH",
    data: updateData,
    onStart: () => ({
      type: UPDATE_STUDENT_FIELD_REQUEST,
      payload: { studentId, fieldName, newValue },
    }),
    onSuccess: (data, dispatch) => {
      dispatch({
        type: UPDATE_STUDENT_FIELD_SUCCESS,
        payload: {
          studentId,
          fieldName,
          newValue,
          message: data.message || `${fieldName} updated.`,
        },
      });
      // Only set needsRefresh for fields that affect sorting/filtering
      const refreshFields = ['isActive', 'Payment Status', 'classesCompleted', 'revisionClassesCompleted'];
      if (refreshFields.includes(fieldName)) {
        dispatch({ type: SET_STUDENTS_NEED_REFRESH });
      }
    },
    onFailure: (error, dispatch) => {
      console.error(`Error updating ${fieldName} for student ${studentId}:`, error);
      const errorMessage = error?.error || error?.message || `Failed to update ${fieldName}.`;
      dispatch({
        type: UPDATE_STUDENT_FIELD_FAILURE,
        payload: { studentId, fieldName, error: errorMessage },
      });
    },
    authRequired: true,
  });
};


export const handlePaymentStatusToggle = (studentId, currentStatus, studentName) => {
  const newStatus = currentStatus === "Paid" ? "Unpaid" : "Paid";

  return updateStudentField(studentId, "Payment Status", newStatus);
};

// Active status toggle - updates locally
export const toggleStudentActiveStatus = (studentId, currentIsActive) => {
  const newIsActive = !currentIsActive;
  return updateStudentField(studentId, "isActive", newIsActive);
};
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
export const clearAuthError = () => ({
  type: CLEAR_AUTH_ERROR,
});
export const resetLoadingState = () => ({
  type: RESET_LOADING_STATE,
});
export const resetEmployeeLoadingState = () => ({
  type: RESET_EMPLOYEE_LOADING_STATE,
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
        let userRoleToStore = data.role || "unknown"; // Get role from response
        let userNameToStore = null;
        let isPhysics = false; // Default to false
        let isChemistry = false; // Default to false
        let AllowAll = false; // Default to false
        const userDetailsFromResponse = data.data; // Assuming user details are under 'data'

        if (userRoleToStore === "student") {
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
        } else if (userRoleToStore === "faculty") {
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
              ...userDetailsFromResponse,
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

export const fetchUpcomingClasses = (payload) =>
  apiRequest({
    url: `/api/data/timetable?date=${payload?.date}`,
    method: "GET",
    onStart: FETCH_CLASSES_REQUEST,
    onSuccess: (data, dispatch) => {
      const finalTimetable = sortAndFilterTimetableData(data || []);

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
        dispatch(setAuthError("Session expired please login again"));
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
    },
    onFailure: (error, dispatch) => {
      console.error("Error fetching students from API:", error);
      const errorMessage =
        error.error || error.message || "Failed to fetch students";
      if (error.status === 401 || error.status === 403) {
        dispatch(setAuthError("Session expired please login again"));
      }
      dispatch({
        type: FETCH_STUDENTS_FAILURE,
        payload: { error: errorMessage },
      });
    },
    authRequired: true,
  });
export const fetchClassSchedule = () =>
  apiRequest({
    url: "/api/data/students-class-details", // New optimized endpoint
    method: "GET",
    onStart: FETCH_CLASS_SCHEDULE_REQUEST,
    onSuccess: (data, dispatch) => {
      const scheduleData = data || [];
      dispatch({
        type: FETCH_CLASS_SCHEDULE_SUCCESS,
        payload: scheduleData,
      });
    },
    onFailure: (error, dispatch) => {
      console.error("Error fetching class schedule from API:", error);
      const errorMessage =
        error.error || error.message || "Failed to fetch class schedule";

      if (error.status === 401 || error.status === 403) {
        dispatch(setAuthError("Session expired please login again"));
      }

      dispatch({
        type: FETCH_CLASS_SCHEDULE_FAILURE,
        payload: errorMessage, // Store as string directly
      });
    },
    authRequired: true,
  });
export const updateClassSchedule = (studentId, updateData) =>
  apiRequest({
    url: `/api/data/students/${studentId}/schedule`,
    method: "PUT",
    data: updateData,
    onStart: UPDATE_CLASS_SCHEDULE_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: UPDATE_CLASS_SCHEDULE_SUCCESS,
        payload: {
          studentId,
          updatedSchedules: data.classDateandTime,
        },
      });
    },
    onFailure: (error, dispatch) => {
      console.error("Error updating class schedule:", error);
      const errorMessage =
        error.error || error.message || "Failed to update schedule";

      dispatch({
        type: UPDATE_CLASS_SCHEDULE_FAILURE,
        payload: errorMessage,
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
        dispatch(setAuthError("Session expired please login again"));
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
      dispatch({ type: SET_STUDENTS_NEED_REFRESH });
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
export const updateStudent = (studentId, studentData) =>
  apiRequest({
    url: `/api/data/updateStudent/${studentId}`, // Note the studentId in the URL
    method: "PUT", // Or "PATCH", depending on your API
    data: studentData,
    onStart: UPDATE_STUDENT_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: UPDATE_STUDENT_SUCCESS,
        payload: data,
      });
      // You can either refetch all students or update the student list locally.
      // Refetching is simpler but less performant for large lists.
      dispatch({ type: SET_STUDENTS_NEED_REFRESH });
    },
    onFailure: (error, dispatch) => {
      console.error("Error updating student:", error);
      const errorMessage =
        error.error || error.message || "Failed to update student";
      if (error.status === 401 || error.status === 403) {
        dispatch(
          setAuthError(
            "Authentication failed or session expired. Please log in again."
          )
        );
      }
      dispatch({
        type: UPDATE_STUDENT_FAILURE,
        payload: { error: errorMessage },
      });
    },
    authRequired: true,
  });
// src/redux/actions/studentActions.js
export const fetchStudentsIfNeeded = () => (dispatch, getState) => {
  const { needsRefresh, students, loading } = getState().students;

  // Only fetch if we need refresh AND we're not already loading
  if (needsRefresh && !loading) {
    dispatch(fetchStudents());
  }
  // If no students at all, fetch them
  else if (students.length === 0 && !loading) {
    dispatch(fetchStudents());
  }
};
export const deleteStudent = (studentId) => {
  return apiRequest({
    url: `/api/data/deleteStudent/${studentId}`,
    method: "DELETE",
    onStart: () => ({
      type: DELETE_STUDENT_REQUEST,
      payload: studentId,
    }),
    onSuccess: (data, dispatch) => {
      dispatch({
        type: DELETE_STUDENT_SUCCESS,
        payload: studentId,
      });
      // No need to set needsRefresh since we remove the student locally
    },
    onFailure: (error, dispatch) => {
      console.error("Error deleting student:", error);
      const errorMessage = error?.error || error?.message || "Failed to delete student.";
      dispatch({
        type: DELETE_STUDENT_FAILURE,
        payload: { error: errorMessage },
      });
    },
    authRequired: true,
  });
};
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
        dispatch(setAuthError("Session expired please login again"));
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

// In your redux/actions.js

export const fetchEmployees = () =>
  apiRequest({
    url: "/api/data/employees", // Make sure this is correct
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

      // Extract error message properly
      let errorMessage = "Failed to fetch employees";
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.error) {
        errorMessage = error.error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "object") {
        errorMessage = JSON.stringify(error);
      }

      if (error?.status === 401 || error?.status === 403) {
        dispatch(setAuthError("Session expired please login again"));
      }
      dispatch({
        type: FETCH_EMPLOYEES_FAILURE,
        payload: { error: errorMessage }, // Ensure this is a string
      });
    },
    authRequired: true,
  });

export const updateEmployeeData = (employeeId, updatedData) =>
  apiRequest({
    url: `/api/data/employees/${employeeId}`,
    method: "PATCH",
    data: updatedData,
    onStart: UPDATE_EMPLOYEE_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: UPDATE_EMPLOYEE_SUCCESS,
        payload: data,
      });
    },
    onFailure: (error, dispatch) => {
      console.error(`Error updating employee ${employeeId}:`, error);

      // Extract error message properly
      let errorMessage = "Failed to update employee";
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.error) {
        errorMessage = error.error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "object") {
        errorMessage = JSON.stringify(error);
      }

      dispatch({
        type: UPDATE_EMPLOYEE_FAILURE,
        payload: {
          employeeId,
          error: errorMessage, // Ensure this is a string
        },
      });
    },
  });

export const addEmployee = (employeeData) =>
  apiRequest({
    url: "/api/data/addEmployee",
    method: "POST",
    data: employeeData,
    onStart: ADD_EMPLOYEE_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: ADD_EMPLOYEE_SUCCESS,
        payload: data,
      });
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
      dispatch(
        fetchUpcomingClasses({ date: new Date().toLocaleDateString("en-GB") })
      );
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
export const updateTimetableEntry = (timetableData) =>
  apiRequest({
    url: "/api/data/updateTimetable",
    method: "POST",
    data: timetableData,
    onStart: ADD_TIMETABLE_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: ADD_TIMETABLE_SUCCESS,
        payload: data,
      });
      dispatch(
        fetchUpcomingClasses({ date: new Date().toLocaleDateString("en-GB") })
      );
    },
    onFailure: (error, dispatch) => {
      console.error("Error updating timetable entry:", error);
      const errorMessage =
        error.error || error.message || "Failed to update timetable entry.";
      if (error.status === 401 || error.status === 403) {
        dispatch(setAuthError("Authentication failed. Please log in again."));
      }
      dispatch({
        type: ADD_TIMETABLE_FAILURE,
        payload: { error: errorMessage },
      });
    },
    authRequired: true,
  });

export const updateClassesCompleted = (studentId, delta, faculty) => async (dispatch) => {
  const apiAction = apiRequest({
    url: `/api/data/students/${studentId}/classes`,
    method: "POST",
    data: { delta, faculty },
    authRequired: true,
  });

  dispatch(apiAction);
  const updated = await apiAction.promise;

  dispatch({
    type: UPDATE_STUDENT_CLASSES_SUCCESS,
    payload: updated,
  });

  // Set needsRefresh since classesCompleted affects sorting
  // dispatch({ type: SET_STUDENTS_NEED_REFRESH });

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
    url: `/api/data/students/${studentId}/payments`,
    method: "GET",

    onStart: FETCH_PAYMENTS_REQUEST,

    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_PAYMENTS_SUCCESS,
        payload: data?.payments,
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
        dispatch(setAuthError("Session expired please login again"));
      }
    },

    authRequired: true,
  });


export const addDemoClass = (demoClassData) =>
  apiRequest({
    url: "/api/data/addDemoClass",
    method: "POST",
    data: demoClassData,
    onStart: ADD_DEMO_CLASS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: ADD_DEMO_CLASS_SUCCESS,
        payload: data.demoClass,
      });
      dispatch(fetchDemoClasses());
      // On success, you're fine, the promise resolves.
    },
    onFailure: (error, dispatch) => {
      console.error("Error adding demo class:", error);
      const errorMessage =
        error.error || error.message || "Failed to add demo class";
      dispatch({
        type: ADD_DEMO_CLASS_FAILURE,
        payload: { error: errorMessage },
      });
      // The crucial part: re-throw the error to ensure the promise is rejected
      throw new Error(errorMessage);
    },
    authRequired: true,
  });

export const fetchDemoClasses = () =>
  apiRequest({
    url: "/api/data/democlasses",
    method: "GET",
    onStart: FETCH_DEMO_CLASSES_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_DEMO_CLASSES_SUCCESS,
        payload: data,
      });
    },
    onFailure: (error, dispatch) => {
      console.error("Error fetching demo classes:", error);
      dispatch({
        type: FETCH_DEMO_CLASSES_FAILURE,
        payload: { error: error.message || "Failed to fetch demo classes" },
      });
    },
  });
export const updateDemoClassStatus = (id, newStatus) =>
  apiRequest({
    url: `/api/data/updateDemoClass/${id}`, // Endpoint for updating a specific demo class
    method: "PUT", // Use PUT for updating an existing resource
    data: { status: newStatus }, // The data payload to send to the backend
    onStart: UPDATE_DEMO_CLASS_STATUS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: UPDATE_DEMO_CLASS_STATUS_SUCCESS,
        payload: data.demoClass, // Your backend sends { message: "...", demoClass: { ... } }
      });
      dispatch(fetchDemoClasses());
    },
    onFailure: (error, dispatch) => {
      console.error(`Error updating status for demo class ${id}:`, error);
      dispatch({
        type: UPDATE_DEMO_CLASS_STATUS_FAILURE,
        payload: {
          error: error.message || "Failed to update demo class status",
        },
      });
    },
  });
export const deleteDemoClass = (demoId) =>
  apiRequest({
    url: `/api/data/democlasses/${demoId}`,
    method: "DELETE",
    onStart: DELETE_DEMO_CLASS_REQUEST,
    onSuccess: (response, dispatch) => {
      dispatch({
        type: DELETE_DEMO_CLASS_SUCCESS,
        payload: demoId, // Pass the ID of the deleted demo to update the state
      });
    },
    onFailure: (error, dispatch) => {
      console.error(`Error deleting demo class ${demoId}:`, error);
      dispatch({
        type: DELETE_DEMO_CLASS_FAILURE,
        payload: { error: error.message || "Failed to delete demo class" },
      });
    },
  });
export const updateDemoClass = (demoData) =>
  apiRequest({
    url: `/api/data/democlasses/${demoData.id}`, // Endpoint for updating a specific demo class
    method: "PATCH", // Use PATCH for partial updates, PUT would be for full replacement
    data: demoData, // Send the entire updated data object
    authRequired: true,

    // ----- lifecycle handlers ---------------------------------------------
    onStart: UPDATE_DEMO_CLASS_REQUEST,

    onSuccess: (data, dispatch) => {
      // Assuming your backend returns the updated demoClass object directly
      dispatch({
        type: UPDATE_DEMO_CLASS_SUCCESS,
        payload: data, // The backend response should be the updated object
      });

      // Optionally, you might want to refetch the entire list to ensure consistency,
      // especially if your local state management for updates is complex.
      // dispatch(fetchDemoClasses());
    },

    onFailure: (error, dispatch) => {
      console.error(`Error updating demo class ${demoData.id}:`, error);
      dispatch({
        type: UPDATE_DEMO_CLASS_FAILURE,
        payload: {
          error:
            error?.error || error?.message || "Failed to update demo class",
        },
      });

      // Handle authentication errors if needed
      if (error?.status === 401 || error?.status === 403) {
        // You might have a specific action for this, e.g.,
        // dispatch(setAuthError("Session expired please login again"));
      }
    },
  });
export const generateAndSaveTimetables = (timetablesToSave) =>
  apiRequest({
    url: "/api/data/saveGeneratedTimetables", // New Express route for saving
    method: "POST",
    data: { timetables: timetablesToSave }, // Send the array of timetables in a 'timetables' field
    onStart: GENERATE_AND_SAVE_TIMETABLES_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: GENERATE_AND_SAVE_TIMETABLES_SUCCESS,
        payload: data.savedTimetables, // Backend should return saved data
      });
      // Crucial: Re-fetch existing classes to include the newly saved ones
      dispatch(
        fetchUpcomingClasses({ date: new Date().toLocaleDateString("en-GB") })
      );
    },
    onFailure: (error, dispatch) => {
      console.error("Error saving generated timetables:", error);
      const errorMessage =
        error.error || error.message || "Failed to save generated timetables";
      dispatch({
        type: GENERATE_AND_SAVE_TIMETABLES_FAIL,
        payload: errorMessage,
      });
      // No alert here, let the component handle snackbar
      throw new Error(errorMessage); // Re-throw to allow component to catch and show message
    },
    authRequired: true, // Assuming your timetable saving is a protected action
  });

export const saveAutoGeneratedTimetables = (timetablesData) =>
  apiRequest({
    url: `/api/data/autoTimetables/saveBatch`, // New backend route
    method: "POST",
    data: timetablesData,
    onStart: SAVE_AUTOGENERATED_TIMETABLES_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: SAVE_AUTOGENERATED_TIMETABLES_SUCCESS,
        payload: data.message, // always string, safe for React
      });
      // After saving, re-fetch auto-timetables to update the UI with the newly saved ones
      dispatch(fetchAutoTimetablesForToday());
    },
    onFailure: (error, dispatch) => {
      console.error("Error saving auto-generated timetables:", error);

      // Ensure errorMessage is always a string
      const errorMessage =
        (typeof error === "string" && error) ||
        error?.error ||
        error?.message ||
        error?.response?.data?.message ||
        "Failed to save auto-generated timetables.";

      dispatch({
        type: SAVE_AUTOGENERATED_TIMETABLES_FAILURE,
        payload: { error: errorMessage },
      });
    },
    authRequired: true,
  });

export const saveOrFetchAutoTimetables = (dateStr, timetablesData) =>
  apiRequest({
    url: `/api/data/autoTimetables/saveOrFetch`, // New backend route
    method: "POST",
    data: { date: dateStr, timetables: timetablesData },
    onStart: SAVE_OR_FETCH_AUTOTIMETABLES_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: SAVE_OR_FETCH_AUTOTIMETABLES_SUCCESS,
        payload: data.timetables, // The backend will send back the timetables
      });
      // Optionally, show a success message if saving occurred
      if (data.message) {
        console.log(data.message);
      }
    },
    onFailure: (error, dispatch) => {
      console.error("Error with auto-generated timetables:", error);
      const errorMessage =
        error?.error || error?.message || "Failed to fetch or save timetables.";
      dispatch({
        type: SAVE_OR_FETCH_AUTOTIMETABLES_FAILURE,
        payload: { error: errorMessage },
      });
    },
    authRequired: true,
  });

/**
 * Fetches auto-generated timetables for the current user and today's date.
 * This is crucial for the daily check.
 */
export const fetchAutoTimetablesForToday = () =>
  apiRequest({
    url: `/api/data/autoTimetables/today`, // Backend will use current date and user ID
    method: "GET",
    onStart: FETCH_AUTOTIMETABLES_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_AUTOTIMETABLES_SUCCESS,
        payload: data, // Should be an array of auto-timetables for the day
      });
    },
    onFailure: (error, dispatch) => {
      console.error("Error fetching auto timetables:", error);
      const errorMessage =
        error.error || error.message || "Failed to fetch auto timetables.";
      // IMPORTANT: Check if the error is due to user not being logged in/auth issue
      // If you explicitly check for user.uid in frontend and backend, this error should be less frequent
      if (error.status === 401 || error.status === 403) {
        dispatch(
          setAuthError(
            "Authentication failed or session expired. Please log in again."
          )
        );
      }
      dispatch({
        type: FETCH_AUTOTIMETABLES_FAILURE,
        payload: { error: errorMessage },
      });
    },
    authRequired: true,
  });

/**
 * Updates an existing auto-generated timetable entry.
 * @param {Object} timetableData The updated timetable object. Must include 'id'.
 */
export const updateAutoTimetableEntry = (timetableData) =>
  apiRequest({
    url: `/api/data/autoTimetables/update`,
    method: "POST",
    data: timetableData,
    onStart: UPDATE_AUTOTIMETABLE_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({ type: UPDATE_AUTOTIMETABLE_SUCCESS, payload: data });
    },
    onFailure: (error, dispatch) => {
      console.error("Error updating auto-generated timetable entry:", error);
      const errorMessage =
        error.error ||
        error.message ||
        "Failed to update auto-generated timetable entry.";
      if (error.status === 401 || error.status === 403)
        dispatch(setAuthError("Authentication failed. Please log in again."));
      dispatch({
        type: UPDATE_AUTOTIMETABLE_FAILURE,
        payload: { error: errorMessage },
      });
    },
    authRequired: true,
  });

/**
 * Deletes an auto-generated timetable entry by its ID.
 * @param {string} timetableId The ID of the auto-timetable to delete.
 */
export const deleteAutoTimetable = (timetableId) =>
  apiRequest({
    url: `/api/data/autoTimetables/${timetableId}`, // New backend route
    method: "DELETE",
    onStart: DELETE_AUTOTIMETABLE_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: DELETE_AUTOTIMETABLE_SUCCESS,
        payload: timetableId,
      });
    },
    onFailure: (error, dispatch) => {
      console.error("Error deleting auto-generated timetable entry:", error);
      const errorMessage =
        error.error ||
        error.message ||
        "Failed to delete auto-generated timetable entry.";
      if (error.status === 401 || error.status === 403) {
        dispatch(
          setAuthError(
            "Authentication failed or session expired. Please log in again."
          )
        );
      }
      dispatch({
        type: DELETE_AUTOTIMETABLE_FAILURE,
        payload: { error: errorMessage },
      });
    },
    authRequired: true,
  });
// Update the fetchExpenditures action
export const fetchExpenditures = (year, month, compareType = null) =>
  apiRequest({
    url: `/api/expenditures?year=${year}&month=${month}${compareType ? `&compare=${compareType}` : ""
      }`,
    method: "GET",
    onStart: FETCH_EXPENDITURES_REQUEST,
    onSuccess: (data, dispatch) => {
      const expendituresArray = data.expenditures || [];
      const paymentsArray = data.payments || [];
      const manualExpenditures = data.manualExpenditures || [];
      const salaryExpenditures = data.salaryExpenditures || [];
      const lastThreeMonths = data.lastThreeMonths || [];

      // Combine all expenditures for display
      const allExpenditures = [...expendituresArray, ...salaryExpenditures];

      const totalStudentPayments = data.totalPayments || 0;
      const previousTotalStudentPayments = data.previousTotalPayments || 0;

      const totalExpenditure = data.totalExpenditure || 0;
      const previousTotalExpenditure = data.previousTotalExpenditure || 0;

      dispatch({
        type: FETCH_EXPENDITURES_SUCCESS,
        payload: {
          expenditures: expendituresArray,
          manualexpenditures: manualExpenditures,
          salaryexpenditures: salaryExpenditures,
          allexpenditures: allExpenditures,
          lastThreeMonths: lastThreeMonths, // Add this
          previousPayments: data.previousPayments || [],
          previousSalaryExpenditures: data.previousSalaryExpenditures || [],
          previousManualExpenditures: data.previousManualExpenditures || [],
        },
      });

      dispatch({
        type: FETCH_TOTAL_PAYMENTS_SUCCESS,
        payload: paymentsArray,
      });

      dispatch({
        type: FETCH_EXPENDITURES_STUDENT_PAYMENTS_SUM_SUCCESS,
        payload: {
          current: totalStudentPayments,
          previous: previousTotalStudentPayments,
        },
      });

      dispatch({
        type: FETCH_EXPENDITURES_SUM_SUCCESS,
        payload: {
          current: totalExpenditure,
          previous: previousTotalExpenditure,
        },
      });
    },
    onFailure: FETCH_EXPENDITURES_FAILURE,
  });

export const addExpenditure = (expenditureData, callback) =>
  apiRequest({
    url: "/api/expenditures",
    method: "POST",
    data: expenditureData,
    onStart: ADD_EXPENDITURE_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: ADD_EXPENDITURE_SUCCESS,
        payload: data,
      });
      if (callback) callback(); // Execute the callback on success
    },
    onFailure: (error, dispatch) => {
      console.error("Error adding expenditure:", error);
      dispatch({
        type: ADD_EXPENDITURE_FAILURE,
        payload: { error: error.message || "Failed to add expenditure" },
      });
      // Optionally, throw the error to be caught in the component
      throw new Error(error.message || "Failed to add expenditure");
    },
    authRequired: true,
  });

/**
 * Action to delete an expenditure.
 * @param {string} expenditureId - The ID of the expenditure to delete.
 */
export const deleteExpenditure = (expenditureId) =>
  apiRequest({
    url: `/api/expenditures/${expenditureId}`,
    method: "DELETE",
    onStart: DELETE_EXPENDITURE_REQUEST,
    onSuccess: (_, dispatch) => {
      dispatch({
        type: DELETE_EXPENDITURE_SUCCESS,
        payload: expenditureId, // Send the ID to the reducer to filter the state
      });
    },
    onFailure: (error, dispatch) => {
      console.error("Error deleting expenditure:", error);
      dispatch({
        type: DELETE_EXPENDITURE_FAILURE,
        payload: { error: error.message || "Failed to delete expenditure" },
      });
    },
    authRequired: true,
  });
export const updateExpenditure = (expenditureId, expenditureData) =>
  apiRequest({
    url: `/api/expenditures/${expenditureId}`,
    method: "PUT", // Use PUT for updates
    data: expenditureData,
    onStart: UPDATE_EXPENDITURE_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: UPDATE_EXPENDITURE_SUCCESS,
        payload: data, // The API should return the updated object
      });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: UPDATE_EXPENDITURE_FAILURE,
        payload: { error: error.message || "Failed to update expenditure" },
      });
      throw new Error(error.message || "Failed to update expenditure");
    },
  });
export const fetchStudentExams = (examType = "") =>
  apiRequest({
    url: `/api/data/studentexams${examType ? `?examType=${examType}` : ""}`,
    method: "GET",
    onStart: FETCH_STUDENT_EXAMS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_STUDENT_EXAMS_SUCCESS,
        payload: data,
      });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: FETCH_STUDENT_EXAMS_FAILURE,
        payload: { error: error.message || "Failed to fetch student exams" },
      });
    },
  });

export const addStudentExam = (examData) =>
  apiRequest({
    url: "/api/data/addStudentExam",
    method: "POST",
    data: examData,
    onStart: ADD_STUDENT_EXAM_REQUEST,
    onSuccess: (data, dispatch) => {

      dispatch({
        type: ADD_STUDENT_EXAM_SUCCESS,
        payload: data.exam,
      });

      // CRITICAL: Update the revision classes state for both present and absent
      if (examData.classId && data.exam) {
        dispatch({
          type: "ADD_REVISION_CLASS_EXAM_SUCCESS",
          payload: {
            classId: examData.classId,
            examData:
              examData.status === "Absent"
                ? {
                  studentId: examData.studentId,
                  studentName: examData.studentName,
                  examRecordId: data.exam.id,
                  status: "Absent",
                  absentReason: examData.absentReason,
                  isAbsent: true,
                  physics: 0,
                  chemistry: 0,
                  maths: 0,
                  total: 0,
                }
                : {
                  studentId: examData.studentId,
                  studentName: examData.studentName,
                  examRecordId: data.exam.id,
                  physics: examData.physics || 0,
                  chemistry: examData.chemistry || 0,
                  maths: examData.maths || 0,
                  total: examData.total || 0,
                  subject: examData.Subject,
                  stream: examData.stream,
                  status: "Present",
                },
          },
        });
      }

      return data;
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: ADD_STUDENT_EXAM_FAILURE,
        payload: { error: error.message || "Failed to add student exam" },
      });
      throw error;
    },
  });

// Update updateStudentExam action
export const updateStudentExam = (examData) =>
  apiRequest({
    url: `/api/data/studentexams/${examData.id}`,
    method: "PATCH",
    data: examData,
    onStart: UPDATE_STUDENT_EXAM_REQUEST,
    onSuccess: (data, dispatch) => {

      dispatch({
        type: UPDATE_STUDENT_EXAM_SUCCESS,
        payload: data,
      });

      // Update revision classes state
      if (examData.classId) {
        dispatch({
          type: "UPDATE_REVISION_CLASS_EXAM_SUCCESS",
          payload: {
            classId: examData.classId,
            studentId: examData.studentId,
            examData:
              examData.status === "Absent"
                ? {
                  status: "Absent",
                  absentReason: examData.absentReason,
                  isAbsent: true,
                  physics: 0,
                  chemistry: 0,
                  maths: 0,
                  total: 0,
                }
                : {
                  physics: examData.physics,
                  chemistry: examData.chemistry,
                  maths: examData.maths,
                  total: examData.total,
                  subject: examData.Subject,
                  status: "Present",
                  isAbsent: false,
                },
          },
        });
      }

      return data;
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: UPDATE_STUDENT_EXAM_FAILURE,
        payload: { error: error.message || "Failed to update student exam" },
      });
      throw error;
    },
  });

// Delete Exam
export const deleteStudentExam = (examId) =>
  apiRequest({
    url: `/api/data/studentexams/${examId}`,
    method: "DELETE",
    onStart: DELETE_STUDENT_EXAM_REQUEST,
    onSuccess: (_, dispatch) => {
      dispatch({ type: DELETE_STUDENT_EXAM_SUCCESS, payload: examId });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: DELETE_STUDENT_EXAM_FAILURE,
        payload: { error: error.message || "Failed to delete student exam" },
      });
    },
  });

// This is the new, simplified action creator.
export const fetchClassUpdates = () =>
  apiRequest({
    url: "/api/data/classUpdates",
    method: "GET",
    onStart: FETCH_CLASS_UPDATES_START,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_CLASS_UPDATES_SUCCESS,
        payload: data || [],
      });
    },
    onFailure: (error, dispatch) => {
      console.error("Error fetching class updates:", error);
      const errorMessage =
        error.error || error.message || "Failed to fetch class updates";
      dispatch({
        type: FETCH_CLASS_UPDATES_FAILURE,
        payload: { error: errorMessage },
      });
    },
    authRequired: true,
  });
export const fetchMonthlyPayments = (year = new Date().getFullYear()) =>
  apiRequest({
    url: `/api/data/payments/monthly?year=${year}`,
    method: "GET",
    onStart: "FETCH_MONTHLY_PAYMENTS_REQUEST",
    onSuccess: (data, dispatch) => {
      const monthlyPayments = data.totals || {};
      dispatch({
        type: FETCH_MONTHLY_PAYMENTS_SUCCESS,
        payload: { monthlyPayments, year },
      });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: "FETCH_MONTHLY_PAYMENTS_FAILURE",
        payload: error,
      });
      console.error("Error fetching monthly payments:", error);
    },
    authRequired: true,
  });

export const fetchAllPayments = () =>
  apiRequest({
    url: "/api/data/payments/all",
    method: "GET",
    onStart: FETCH_ALL_MONTHLY_PAYMENTS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_ALL_MONTHLY_PAYMENTS_SUCCESS,

        payload: data, // Array of demo classes from Firestore
      });
    },
    onFailure: (error, dispatch) => {
      console.error("Error fetching monthly payments:", error);
      dispatch({
        type: FETCH_ALL_MONTHLY_PAYMENTS_FAILURE,
        payload: { error: error.message || "Failed to fetch monthly payments" },
      });
    },
  });

// Add a new action to update the weekly syllabus
export const updateWeeklySyllabus = (studentId, updatedLessons) =>
  apiRequest({
    url: `/api/data/syllabus/${studentId}`,
    method: "PATCH",
    data: { lessons: updatedLessons }, // Send the new array of lesson objects
    onStart: UPDATE_SYLLABUS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: UPDATE_SYLLABUS_SUCCESS,
        payload: {
          studentId,
          lessons: data.lessons,
        },
      });
      // Optionally, refetch the data to ensure UI consistency
      dispatch({ type: SET_STUDENTS_NEED_REFRESH });
    },
    onFailure: (error, dispatch) => {
      console.error(`Error updating syllabus for student ${studentId}:`, error);
      dispatch({
        type: UPDATE_SYLLABUS_FAILURE,
        payload: { error: error.message || "Failed to update syllabus" },
      });
    },
  });

export const fetchStudentExamsByStudent = (studentId) =>
  apiRequest({
    url: `/api/data/getstudentexamsbyid?studentId=${studentId}`,
    method: "GET",
    onStart: FETCH_STUDENT_EXAMS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({ type: FETCH_STUDENT_EXAMS_SUCCESS, payload: data });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: FETCH_STUDENT_EXAMS_FAILURE,
        payload: { error: error.message || "Failed to fetch student exams" },
      });
    },
    authRequired: true,
  });
// Updated the dispatched actions in the thunk
export const addrevisionProgrammestudent = (studentData) =>
  apiRequest({
    url: "/api/auth/revisionprogramRegistertion",
    method: "POST",
    data: studentData,
    onStart: REVISION_PROGRAM_REGISTER_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: REVISION_PROGRAM_REGISTER_SUCCESS,
        payload: data,
      });
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
        type: REVISION_PROGRAM_REGISTER_FAILURE,
        payload: { error: errorMessage },
      });
    },
    authRequired: false,
  });
export const fetchRevisionStudents = () =>
  apiRequest({
    url: "/api/data/revisionStudents",
    method: "GET",
    onStart: FETCH_REVISION_STUDENTS_REQUEST,
    onSuccess: (data, dispatch) => {
      const studentsFromApi = data || [];
      dispatch({
        type: FETCH_REVISION_STUDENTS_SUCCESS,
        payload: studentsFromApi,
      });
    },
    onFailure: (error, dispatch) => {
      console.error("❌ fetchRevisionStudents error:", error);
      const errorMessage =
        error.error || error.message || "Failed to fetch revision students";

      // If authentication is required later, handle expired session
      if (error.status === 401 || error.status === 403) {
        dispatch(setAuthError("Session expired, please login again"));
      }

      dispatch({
        type: FETCH_REVISION_STUDENTS_FAILURE,
        payload: { error: errorMessage },
      });
    },
    authRequired: false, // ✅ change to true if this route needs auth in future
  });

export const deleteRevisionStudent = (studentId) => (dispatch) =>
  apiRequest({
    url: `/api/data/revision/students/${studentId}`,
    method: "DELETE",
    onSuccess: () =>
      dispatch({ type: DELETE_REVISION_STUDENT_SUCCESS, payload: studentId }),
    onFailure: (error) =>
      dispatch({
        type: DELETE_REVISION_STUDENT_FAILURE,
        payload: { error: error.message || "Failed to delete student" },
      }),
    authRequired: true,
  });
export const updatePaymentStatus = (studentId, installmentNumber, newStatus) =>
  apiRequest({
    url: "/api/data/updatePaymentStatus",
    method: "PUT",
    data: { studentId, installmentNumber, newStatus },
    onStart: UPDATE_PAYMENT_STATUS_REQUEST,
    onSuccess: (data, dispatch) => {
      // Dispatch success and pass the updated student ID, installment, and new status
      dispatch({
        type: UPDATE_PAYMENT_STATUS_SUCCESS,
        payload: { studentId, installmentNumber, newStatus },
      });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: UPDATE_PAYMENT_STATUS_FAILURE,
        payload: { error: error.message },
      });
    },
    authRequired: false,
  });
// src/redux/actions/index.js (or similar)

export const updateStudentStatus = (studentId, newStatus) =>
  apiRequest({
    url: "/api/data/updateStudentStatus",
    method: "PUT",
    data: { studentId, newStatus },
    onStart: UPDATE_STUDENT_STATUS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: UPDATE_STUDENT_STATUS_SUCCESS,
        payload: { studentId, newStatus },
      });
      dispatch(fetchRevisionStudents());
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: UPDATE_STUDENT_STATUS_FAILURE,
        payload: { error: error.message },
      });
    },
    authRequired: false,
  });
export const fetchRevisionClasses = (requestParams = {}) => {
  return apiRequest({
    url: `/api/data/revisionClasses`,
    method: "GET",
    params: {
      cursorDate: requestParams.cursorDate, 
      direction: requestParams.direction,
    },
    onStart: FETCH_REVISION_CLASSES_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_REVISION_CLASSES_SUCCESS,
        payload: {
          classes: data.classes || [],
          hasMore: data.hasMore !== undefined ? data.hasMore : false,
          hasPrevious:
            data.hasPrevious !== undefined ? data.hasPrevious : false,
          nextCursor: data.nextCursor || null,
          prevCursor: data.prevCursor || null,
          append: requestParams.direction === "next", // FIX: Use requestParams
          prepend: requestParams.direction === "prev", // FIX: Use requestParams
          replace: !requestParams.direction, // FIX: Use requestParams
        },
      });
    },
    onFailure: (error, dispatch) => {
      console.error("❌ Error fetching revision classes:", error);
      dispatch({
        type: FETCH_REVISION_CLASSES_FAILURE,
        payload: { error: error.message || "Failed to fetch revision classes" },
      });
    },
    authRequired: true,
  });
};
// export const fetchStudentClasses = () => {

//   return apiRequest({
//     url: `/api/data/studentRevisionClassesbyId`,
//     method: "GET",
//     onStart: FETCH_STUDENT_CLASSES_REQUEST,
//     onSuccess: (data, dispatch) => {
//       console.log("✅ Student Classes API Response:", data);
//       dispatch({
//         type: FETCH_STUDENT_CLASSES_SUCCESS,
//         payload: {
//           pastClasses: data.pastClasses || [],
//           futureClasses: data.futureClasses || [],
//           studentId: data.studentId || null,
//         },
//       });
//     },
//     onFailure: (error, dispatch) => {
//       console.error("❌ Error fetching student classes:", error);
//       dispatch({
//         type: FETCH_STUDENT_CLASSES_FAILURE,
//         payload: { error: error.message || "Failed to fetch student classes" },
//       });
//     },
//     authRequired: true,
//   });
// };

// Search classes by topic/lesson
export const searchStudentClasses = (requestParams = {}) => {

  return apiRequest({
    url: `/api/data/studentClassesSearch`,
    method: "GET",
    params: {
      studentId: requestParams.studentId,
      searchQuery: requestParams.searchQuery,
    },
    onStart: SEARCH_STUDENT_CLASSES_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: SEARCH_STUDENT_CLASSES_SUCCESS,
        payload: {
          searchResults: data.classes || [],
          searchQuery: data.searchQuery || "",
          totalResults: data.totalResults || 0,
          studentId: data.studentId || null,
        },
      });
    },
    onFailure: (error, dispatch) => {
      console.error("❌ Error searching student classes:", error);
      dispatch({
        type: SEARCH_STUDENT_CLASSES_FAILURE,
        payload: { error: error.message || "Failed to search student classes" },
      });
    },
    authRequired: true,
  });
};

// Clear search results
export const clearSearchResults = () => ({
  type: CLEAR_SEARCH_RESULTS,
});
export const updateStudentAttendance = (classId, studentId, status) =>
  apiRequest({
    url: `/api/data/revisionClasses/${classId}/attendance/${studentId}`,
    method: "PATCH",
    data: { status },
    onStart: UPDATE_CLASS_ATTENDANCE_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: UPDATE_CLASS_ATTENDANCE_SUCCESS,
        payload: data.updatedClass,
      });
    },
    onFailure: (error, dispatch) => {
      console.error(`Error updating attendance:`, error);
      const errorMessage =
        error.error || error.message || "Failed to update attendance";
      dispatch({
        type: UPDATE_CLASS_ATTENDANCE_FAILURE,
        payload: { error: errorMessage },
      });
      throw new Error(errorMessage);
    },
    authRequired: true,
  });

export const fetchRevisionExams = (requestParams = {}) => {

  return apiRequest({
    url: `/api/data/revisionExams`,
    method: "GET",
    params: {},
    onStart: FETCH_REVISION_EXAMS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_REVISION_EXAMS_SUCCESS,
        payload: {
          exams: data.exams || [],
        },
      });
    },
    onFailure: (error, dispatch) => {
      console.error("❌ Error fetching revision exams:", error);
      dispatch({
        type: FETCH_REVISION_EXAMS_FAILURE,
        payload: { error: error.message || "Failed to fetch revision exams" },
      });
    },
    authRequired: true,
  });
};

// Update revision fee installment
export const updateRevisionFee = (studentId, installmentData) =>
  apiRequest({
    url: `/api/data/revision-fee/${studentId}`,
    method: "PUT",
    data: installmentData,
    onStart: UPDATE_REVISION_FEE_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: UPDATE_REVISION_FEE_SUCCESS,
        payload: { studentId, data: data.data },
      });
      return data;
    },
    onFailure: (error, dispatch) => {
      console.error("Error updating revision fee:", error);
      dispatch({
        type: UPDATE_REVISION_FEE_FAILURE,
        payload: {
          error: error.error || error.message || "Failed to update fee",
        },
      });
    },
    authRequired: true,
  });

export const setCurrentStudent = (studentData) => ({
  type: SET_CURRENT_STUDENT,
  payload: studentData,
});

export const clearCurrentStudent = () => ({
  type: CLEAR_CURRENT_STUDENT,
});
export const fetchStudentClasses = () => {
  return apiRequest({
    url: `/api/data/studentRevisionClassesbyId`,
    method: "GET",
    onStart: FETCH_STUDENT_CLASSES_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_STUDENT_CLASSES_SUCCESS,
        payload: {
          pastClasses: data.pastClasses || [],
          futureClasses: data.futureClasses || [],
          studentId: data.studentId || null,
        },
      });
    },
    onFailure: (error, dispatch) => {
      console.error("❌ Error fetching student classes:", error);
      dispatch({
        type: FETCH_STUDENT_CLASSES_FAILURE,
        payload: { error: error.message || "Failed to fetch student classes" },
      });
    },
    authRequired: true,
  });
};

export const fetchYearStatistics = (requestParams = {}) => {
  return apiRequest({
    url: `/api/data/studentYearStats`,
    method: "GET",
    params: {
      studentId: requestParams.studentId,
    },
    onStart: FETCH_YEAR_STATISTICS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_YEAR_STATISTICS_SUCCESS,
        payload: {
          firstYear: {
            total: data.firstYear?.total || 0,
            completed: data.firstYear?.completed || 0,
            pending: data.firstYear?.pending || 0,
            completedLessons: data.firstYear?.completedLessons || [],
            pendingLessons: data.firstYear?.pendingLessons || [],
          },
          secondYear: {
            total: data.secondYear?.total || 0,
            completed: data.secondYear?.completed || 0,
            pending: data.secondYear?.pending || 0,
            completedLessons: data.secondYear?.completedLessons || [],
            pendingLessons: data.secondYear?.pendingLessons || [],
          },
          dateRange: data.dateRange || {},
          studentId: data.studentId || null,
        },
      });
    },
    onFailure: (error, dispatch) => {
      console.error("❌ Error fetching year statistics:", error);
      dispatch({
        type: FETCH_YEAR_STATISTICS_FAILURE,
        payload: { error: error.message || "Failed to fetch year statistics" },
      });
    },
    authRequired: true,
  });
};
export const fetchAttendanceSummary = (studentId, sessions = "all") => {
  return apiRequest({
    url: `/api/data/attendance-summary`,
    method: "GET",
    params: {
      studentId,
      sessions,
    },
    onStart: FETCH_ATTENDANCE_SUMMARY_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_ATTENDANCE_SUMMARY_SUCCESS,
        payload: data,
      });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: FETCH_ATTENDANCE_SUMMARY_FAILURE,
        payload: {
          error: error.message || "Failed to fetch attendance summary",
        },
      });
    },
    authRequired: true,
  });
};
// actions/demoActions.js
export const bookDemo = (demoData) =>
  apiRequest({
    url: "/api/data/book-demo",
    method: "POST",
    data: demoData,
    onStart: BOOK_DEMO_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: BOOK_DEMO_SUCCESS,
        payload: data,
      });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: BOOK_DEMO_FAILURE,
        payload: { error: error.message || "Failed to book demo" },
      });
    },
    authRequired: false,
  });

export const fetchDemoBookings = (status = "all") =>
  apiRequest({
    url: `/api/data/demo-bookings?status=${status}`,
    method: "GET",
    onStart: FETCH_DEMO_BOOKINGS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_DEMO_BOOKINGS_SUCCESS,
        payload: data,
      });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: FETCH_DEMO_BOOKINGS_FAILURE,
        payload: { error: error.message || "Failed to fetch demo bookings" },
      });
    },
    authRequired: true,
  });

export const updateDemoStatus = (demoId, status, contactReason = "") =>
  apiRequest({
    url: `/api/data/demo-bookings/${demoId}`,
    method: "PUT",
    data: { status, contactReason },
    onStart: UPDATE_DEMO_STATUS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: UPDATE_DEMO_STATUS_SUCCESS,
        payload: { demoId, status, contactReason },
      });
      // Refresh the list
      dispatch(fetchDemoBookings());
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: UPDATE_DEMO_STATUS_FAILURE,
        payload: { error: error.message || "Failed to update demo status" },
      });
    },
    authRequired: true,
  });
// Add these to your existing actions file

// Fetch Student PPTs
export const fetchStudentPPTs = (studentId) =>
  apiRequest({
    url: `/api/materials/student-ppts/${studentId}`,
    method: "GET",
    onStart: FETCH_STUDENT_PPTS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({ type: FETCH_STUDENT_PPTS_SUCCESS, payload: data });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: FETCH_STUDENT_PPTS_FAILURE,
        payload: { error: error.message || "Failed to fetch PPTs" },
      });
    },
    authRequired: true,
  });

// Fetch Student Worksheets
export const fetchStudentWorksheets = (studentId) =>
  apiRequest({
    url: `/api/materials/student-worksheets/${studentId}`,
    method: "GET",
    onStart: FETCH_STUDENT_WORKSHEETS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({ type: FETCH_STUDENT_WORKSHEETS_SUCCESS, payload: data });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: FETCH_STUDENT_WORKSHEETS_FAILURE,
        payload: { error: error.message || "Failed to fetch worksheets" },
      });
    },
    authRequired: true,
  });

export const fetchAcademyFinance = (year, month, compareType = null) =>
  apiRequest({
    url: `/api/expenditures/academy-finance?year=${year}&month=${month}${compareType ? `&compare=${compareType}` : ""
      }`,
    method: "GET",
    onStart: FETCH_ACADEMY_FINANCE_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_ACADEMY_FINANCE_SUCCESS,
        payload: data,
      });
    },
    onFailure: (error, dispatch) => {
      console.error("Error fetching academy finance:", error);
      dispatch({
        type: FETCH_ACADEMY_FINANCE_FAILURE,
        payload: {
          error: error.message || "Failed to fetch academy finance data",
        },
      });
    },
    authRequired: true,
  });

// Add Academy Earning Action
export const addAcademyEarning = (earningData, callback) =>
  apiRequest({
    url: "/api/expenditures/add-academy-finance",
    method: "POST",
    data: earningData,
    onStart: ADD_ACADEMY_EARNING_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: ADD_ACADEMY_EARNING_SUCCESS,
        payload: data,
      });
      if (callback) callback();
    },
    onFailure: (error, dispatch) => {
      console.error("Error adding academy earning:", error);
      dispatch({
        type: ADD_ACADEMY_EARNING_FAILURE,
        payload: { error: error.message || "Failed to add academy earning" },
      });
      throw new Error(error.message || "Failed to add academy earning");
    },
    authRequired: true,
  });
// Delete Academy Earning Action
export const deleteAcademyEarning = (earningId, callback) =>
  apiRequest({
    url: `/api/expenditures/delete-academy-earning/${earningId}`,
    method: "DELETE",
    onStart: DELETE_ACADEMY_EARNING_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: DELETE_ACADEMY_EARNING_SUCCESS,
        payload: earningId,
      });
      if (callback) callback();
    },
    onFailure: (error, dispatch) => {
      console.error("Error deleting academy earning:", error);
      dispatch({
        type: DELETE_ACADEMY_EARNING_FAILURE,
        payload: { error: error.message || "Failed to delete academy earning" },
      });
      throw new Error(error.message || "Failed to delete academy earning");
    },
    authRequired: true,
  });

export const uploadStudyMaterial = (studentId, formData) =>
  apiRequest({
    url: `/api/materials/upload-study-material/${studentId}`,
    method: "POST",
    data: formData,
    onStart: UPLOAD_STUDY_MATERIAL_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({ type: UPLOAD_STUDY_MATERIAL_SUCCESS, payload: data });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: UPLOAD_STUDY_MATERIAL_FAILURE,
        payload: { error: error.message || "Failed to upload study material" },
      });
    },
    authRequired: true,
  });

// Upload Question Paper
export const uploadQuestionPaper = (studentId, formData) =>
  apiRequest({
    url: `/api/materials/upload-question-paper/${studentId}`,
    method: "POST",
    data: formData,
    onStart: UPLOAD_QUESTION_PAPER_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({ type: UPLOAD_QUESTION_PAPER_SUCCESS, payload: data });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: UPLOAD_QUESTION_PAPER_FAILURE,
        payload: { error: error.message || "Failed to upload question paper" },
      });
    },
    authRequired: false,
  });

// Fetch Study Materials
export const fetchStudyMaterials = (studentId) =>
  apiRequest({
    url: `/api/materials/study-materials/${studentId}`,
    method: "GET",
    onStart: FETCH_STUDY_MATERIALS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({ type: FETCH_STUDY_MATERIALS_SUCCESS, payload: data });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: FETCH_STUDY_MATERIALS_FAILURE,
        payload: { error: error.message || "Failed to fetch study materials" },
      });
    },
    authRequired: true,
  });

// Fetch Question Papers
export const fetchQuestionPapers = (studentId) =>
  apiRequest({
    url: `/api/materials/question-papers/${studentId}`,
    method: "GET",
    onStart: FETCH_QUESTION_PAPERS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({ type: FETCH_QUESTION_PAPERS_SUCCESS, payload: data });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: FETCH_QUESTION_PAPERS_FAILURE,
        payload: { error: error.message || "Failed to fetch question papers" },
      });
    },
    authRequired: true,
  });
export const fetchMonthlyPaymentDetails = (monthYear) =>
  apiRequest({
    url: `/api/data/payments/monthly/${monthYear}`,
    method: "GET",
    onStart: FETCH_MONTHLY_PAYMENT_DETAILS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_MONTHLY_PAYMENT_DETAILS_SUCCESS,
        payload: data,
      });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: FETCH_MONTHLY_PAYMENT_DETAILS_FAILURE,
        payload: error,
      });
      console.error("Error fetching monthly payment details:", error);
    },
    authRequired: true,
  });
export const fetchMonthlyStudentDetails = (monthYear) =>
  apiRequest({
    url: `/api/data/students/monthly/${monthYear}`,
    method: "GET",
    onStart: FETCH_MONTHLY_STUDENT_DETAILS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_MONTHLY_STUDENT_DETAILS_SUCCESS,
        payload: data,
      });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: FETCH_MONTHLY_STUDENT_DETAILS_FAILURE,
        payload: error,
      });
      console.error("Error fetching monthly student details:", error);
    },
    authRequired: true,
  });


export const clearMonthlyStudentDetails = () => ({
  type: CLEAR_MONTHLY_STUDENT_DETAILS
});
export const fetchTutorIdeas = () => {
  return apiRequest({
    url: `/api/ideas`,
    method: "GET",
    onStart: FETCH_TUTOR_IDEAS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_TUTOR_IDEAS_SUCCESS,
        payload: data.ideas || [],
      });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: FETCH_TUTOR_IDEAS_FAILURE,
        payload: { error: error.message || "Failed to fetch ideas" },
      });
    },
    authRequired: true,
  });
};

export const addTutorIdea = (ideaData) => {
  return apiRequest({
    url: `/api/ideas`,
    method: "POST",
    data: ideaData,
    onStart: ADD_TUTOR_IDEA_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: ADD_TUTOR_IDEA_SUCCESS,
        payload: data.idea,
      });
      dispatch(showNotification("Idea added successfully!", "success"));
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: ADD_TUTOR_IDEA_FAILURE,
        payload: { error: error.message || "Failed to add idea" },
      });
    },
    authRequired: true,
  });
};

export const updateTutorIdea = (ideaId, updates) => {
  return apiRequest({
    url: `/api/ideas/${ideaId}`,
    method: "PUT",
    data: updates,
    onStart: UPDATE_TUTOR_IDEA_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: UPDATE_TUTOR_IDEA_SUCCESS,
        payload: data.idea,
      });
      dispatch(showNotification("Idea updated successfully!", "success"));
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: UPDATE_TUTOR_IDEA_FAILURE,
        payload: { error: error.message || "Failed to update idea" },
      });
    },
    authRequired: true,
  });
};

export const fetchRevisionExamConsolidation = () => {

  return apiRequest({
    url: `/api/data/revisionExamConsolidation`,
    method: "GET",
    onStart: FETCH_EXAM_CONSOLIDATION_REQUEST, // Define this constant
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_EXAM_CONSOLIDATION_SUCCESS,
        payload: {
          exams: data.exams || [],
          summary: data.summary || {},
          totalExams: data.totalExams || 0,
          success: data.success || false,
        },
      });
    },
    onFailure: (error, dispatch) => {
      console.error("❌ Error fetching exam consolidation:", error);
      dispatch({
        type: FETCH_EXAM_CONSOLIDATION_FAILURE,
        payload: { error: error.message || "Failed to fetch exam consolidation data" },
      });
    },
    authRequired: true,
  });
};

// Add this action for updating academy earnings specifically
export const updateAcademyEarning = (earningId, earningData, callback) =>
  apiRequest({
    url: `/api/expenditures/update-academy-earning/${earningId}`,
    method: "PUT",
    data: earningData,
    onStart: UPDATE_ACADEMY_EARNING_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: UPDATE_ACADEMY_EARNING_SUCCESS,
        payload: data,
      });
      if (callback) callback();
    },
    onFailure: (error, dispatch) => {
      console.error("Error updating academy earning:", error);
      dispatch({
        type: UPDATE_ACADEMY_EARNING_FAILURE,
        payload: { error: error.message || "Failed to update academy earning" },
      });
      throw new Error(error.message || "Failed to update academy earning");
    },
    authRequired: true,
  });

// admissionActions.js
export const uploadStudentData = (formData) =>
  apiRequest({
    url: "/api/admission/upload-student-data",
    method: "POST",
    data: formData,
    onStart: UPLOAD_STUDENT_DATA_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({ type: UPLOAD_STUDENT_DATA_SUCCESS, payload: data });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: UPLOAD_STUDENT_DATA_FAILURE,
        payload: { error: error.message || "Failed to upload student data" },
      });
    },
    authRequired: true,
  });

export const fetchUploadHistory = () =>
  apiRequest({
    url: "/api/admission/upload-history",
    method: "GET",
    onStart: FETCH_UPLOAD_HISTORY_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({ type: FETCH_UPLOAD_HISTORY_SUCCESS, payload: data });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: FETCH_UPLOAD_HISTORY_FAILURE,
        payload: { error: error.message || "Failed to fetch upload history" },
      });
    },
    authRequired: true,
  });

export const deleteUploadedFile = (fileId) =>
  apiRequest({
    url: `/api/admission/delete-upload/${fileId}`,
    method: "DELETE",
    onStart: DELETE_UPLOAD_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({ type: DELETE_UPLOAD_SUCCESS, payload: fileId });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: DELETE_UPLOAD_FAILURE,
        payload: { error: error.message || "Failed to delete upload" },
      });
    },
    authRequired: true,
  });

// leadActions.js
export const createLead = (leadData) =>
  apiRequest({
    url: "/api/admission/leads/create",
    method: "POST",
    data: leadData,
    onStart: CREATE_LEAD_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({ type: CREATE_LEAD_SUCCESS, payload: data });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: CREATE_LEAD_FAILURE,
        payload: { error: error.message || "Failed to create lead" },
      });
    },
    authRequired: true,
  });

export const fetchLeads = () =>
  apiRequest({
    url: "/api/admission/leads",
    method: "GET",
    onStart: FETCH_LEADS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({ type: FETCH_LEADS_SUCCESS, payload: data });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: FETCH_LEADS_FAILURE,
        payload: { error: error.message || "Failed to fetch leads" },
      });
    },
    authRequired: true,
  });

// Updated action to accept 'updates' object
export const updateLeadStatus = (leadId, updates) =>
  apiRequest({
    url: `/api/admission/leads/${leadId}/status`,
    method: "PUT",
    data: updates, // Pass the object directly (e.g., { status: 'new' } or { notes: 'abc' })
    onStart: "UPDATE_LEAD_STATUS_REQUEST", // You can keep existing types
    onSuccess: (data, dispatch) => {
      dispatch({ type: "UPDATE_LEAD_STATUS_SUCCESS", payload: data });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: "UPDATE_LEAD_STATUS_FAILURE",
        payload: { error: error.message || "Failed to update lead" },
      });
    },
    authRequired: true,
  });
export const addStudentSyllabus = (syllabusData) =>
  apiRequest({
    url: "/api/data/student/syllabus/add",
    method: "POST",
    data: syllabusData,
    onStart: ADD_STUDENT_SYLLABUS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: ADD_STUDENT_SYLLABUS_SUCCESS,
        payload: data, // Assuming backend returns the created object or success message
      });

      // Optional: If you have a list of syllabus updates in Redux, you might want to fetch it again
      // dispatch(fetchSyllabusUpdates()); 
    },
    onFailure: (error, dispatch) => {
      console.error("Error adding student syllabus:", error);
      const errorMessage =
        error.error || error.message || "Failed to add student syllabus";

      dispatch({
        type: ADD_STUDENT_SYLLABUS_FAILURE,
        payload: { error: errorMessage },
      });

      // Crucial: Re-throw error so component can catch it and show snackbar/stop loading
      throw new Error(errorMessage);
    },
    authRequired: true,
  });
export const fetchStudentSyllabus = (studentId) =>
  apiRequest({
    url: `/api/data/student/syllabus/${studentId}`,
    method: "GET",
    onStart: FETCH_STUDENT_SYLLABUS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_STUDENT_SYLLABUS_SUCCESS,
        payload: data,
      });
    },
    onFailure: (error, dispatch) => {
      console.error("Error fetching syllabus history:", error);
      dispatch({
        type: FETCH_STUDENT_SYLLABUS_FAILURE,
        payload: { error: error.message },
      });
    },
    authRequired: true,
  });

// Fetch Notifications Action
export const fetchNotifications = (userId) =>
  apiRequest({
    url: `/api/notifications/unmarked/${userId}`,
    method: "GET",
    onStart: FETCH_NOTIFICATIONS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_NOTIFICATIONS_SUCCESS,
        payload: data,
      });
    },
    onFailure: (error, dispatch) => {
      console.error("Error fetching notifications:", error);
      dispatch({
        type: FETCH_NOTIFICATIONS_FAILURE,
        payload: { error: error.message },
      });
    },
    authRequired: true,
  });

// Mark Read Action
export const markNotificationRead = (notificationId) =>
  apiRequest({
    url: `/api/notifications/mark-read/${notificationId}`,
    method: "PUT",
    onStart: MARK_NOTIFICATION_READ_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: MARK_NOTIFICATION_READ_SUCCESS,
        payload: { id: notificationId }, // Pass ID to reducer to update state locally
      });
    },
    onFailure: (error, dispatch) => {
      console.error("Error marking notification read:", error);
      dispatch({
        type: MARK_NOTIFICATION_READ_FAILURE,
        payload: { error: error.message },
      });
    },
    authRequired: true,
  });
// src/redux/actions.js
export const fetchEmployeePayments = (employeeId) =>
  apiRequest({
    url: `/api/data/employees/${employeeId}/payment-history`,
    method: "GET",
    onStart: FETCH_EMPLOYEE_PAYMENTS_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_EMPLOYEE_PAYMENTS_SUCCESS,
        payload: data?.payments || [],
      });
    },
    onFailure: (error, dispatch) => {
      console.error("Error fetching employee payments:", error);
      dispatch({
        type: FETCH_EMPLOYEE_PAYMENTS_FAILURE,
        payload: {
          error: error?.error || error.message || "Failed to fetch payments",
        },
      });
    },
    authRequired: false,
  });

export const fetchEmployeeById = (employeeId) =>
  apiRequest({
    url: `/api/data/employees/${employeeId}`,
    method: "GET",
    onStart: FETCH_EMPLOYEE_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: FETCH_EMPLOYEE_SUCCESS,
        payload: data?.employee,
      });
    },
    onFailure: (error, dispatch) => {
      console.error("Error fetching employee:", error);
      dispatch({
        type: FETCH_EMPLOYEE_FAILURE,
        payload: {
          error: error?.error || error.message || "Failed to fetch employee",
        },
      });
    },
    authRequired: false,
  });
  export const setCurrentEmployee = (employeeData) => ({
  type: SET_CURRENT_EMPLOYEE,
  payload: employeeData,
});

// 1. Student Upload Action
export const uploadStudentResult = (questionPaperId, formData) =>
  apiRequest({
    url: `/api/materials/upload-result/${questionPaperId}`,
    method: "POST",
    data: formData,
    onStart: UPLOAD_RESULT_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({ type: UPLOAD_RESULT_SUCCESS, payload: data });
      console.log("data",data)
      
      // --- CRITICAL FIX: Refresh the list immediately ---
      // The backend response (data) must contain 'studentId'
      if (data.studentId) {
        dispatch(fetchQuestionPapers(data.studentId));
      }
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: UPLOAD_RESULT_FAILURE,
        payload: { error: error.message || "Failed to upload result" },
      });
    },
    authRequired: true,
  });

// 2. Tutor Evaluation Action
export const evaluateStudentPaper = (questionPaperId, formData) =>
  apiRequest({
    url: `/api/materials/evaluate-paper/${questionPaperId}`,
    method: "POST",
    data: formData,
    onStart: EVALUATE_PAPER_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({ type: EVALUATE_PAPER_SUCCESS, payload: data });
      
      // --- CRITICAL FIX: Refresh the list immediately ---
      // Ensure backend returns 'studentId' or gets it from the request logic
      // If data.studentId is missing, the UI won't update!
      if (data.studentId || formData.get('studentId')) {
         const sId = data.studentId || formData.get('studentId');
         dispatch(fetchQuestionPapers(sId));
      }
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: EVALUATE_PAPER_FAILURE,
        payload: { error: error.message || "Failed to submit evaluation" },
      });
    },
    authRequired: true,
  });


export const updateProfilePicture = (formData) =>
  apiRequest({
    url: "/api/data/update-profile-picture", // Make sure this matches backend route
    method: "POST",
    data: formData,
    onStart: UPLOAD_ICON_REQUEST, // Changed to match profileReducer
    onSuccess: (data, dispatch) => {
      dispatch({
        type: UPLOAD_ICON_SUCCESS, // Changed to match profileReducer
        payload: data, // Expecting { photoUrl: "..." }
      });
    },
    onFailure: (error, dispatch) => {
      console.error("Error updating profile picture:", error);
      dispatch({
        type: UPLOAD_ICON_FAILURE, // Changed to match profileReducer
        payload: { error: error.message || "Failed to update profile picture" },
      });
    },
    authRequired: true,
  });

// 2. Update Profile Details (Email/Mobile) - Stays in Auth Reducer usually
export const updateUserProfile = ({ userId, email, mobile }) =>
  apiRequest({
    url: "/api/data/updateUserProfile", // Check route
    method: "PUT",
    data: { userId, email, mobile },
    onStart: UPDATE_PROFILE_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({
        type: UPDATE_PROFILE_SUCCESS,
        payload: { email, mobile },
      });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: UPDATE_PROFILE_FAILURE,
        payload: { error: error.message },
      });
    },
    authRequired: true,
  });

// 3. Get Profile Icon - Fixed to use GET_PROFILE_ICON types
export const getUserProfileIcon = (id) =>
  apiRequest({
    url: `/api/data/get-user-profile-icon/${id}`,
    method: "GET",
    onStart: GET_PROFILE_ICON_REQUEST, // Add this for loading state
    onSuccess: (data, dispatch) => {
      dispatch({
        type: GET_PROFILE_ICON_SUCCESS, // Correct type for profileReducer
        payload: data, 
      });
    },
    onFailure: (error, dispatch) => {
      console.error("Background fetch failed", error);
      dispatch({
        type: GET_PROFILE_ICON_FAILURE,
        payload: error.message
      });
    },
    authRequired: true,
  });

export const fetchStudentLectureMaterials = (studentId) =>
  apiRequest({
    url: `/api/materials/getstudentmaterials/${studentId}`,
    method: "GET",
    onStart: "FETCH_LECTURE_MATERIALS_REQUEST",
    onSuccess: (data, dispatch) => {
      dispatch({ type: "FETCH_LECTURE_MATERIALS_SUCCESS", payload: data });
    },
    onFailure: (error, dispatch) => {
      dispatch({ type: "FETCH_LECTURE_MATERIALS_FAILURE", payload: error });
    },
    authRequired: true,
  });

export const uploadLectureMaterial = (studentId, classId, fileType, formData) =>
  apiRequest({
    url: `/api/materials/upload/${studentId}/${classId}/${fileType}`,
    method: "POST",
    data: formData, // FormData contains file + studentName
    onStart: "UPLOAD_LECTURE_MATERIAL_REQUEST",
    onSuccess: (data, dispatch) => {
      dispatch({ type: "UPLOAD_LECTURE_MATERIAL_SUCCESS", payload: data });
      dispatch(fetchStudentLectureMaterials(studentId)); // Refresh UI
    },
    onFailure: (error, dispatch) => {
      dispatch({ type: "UPLOAD_LECTURE_MATERIAL_FAILURE", payload: error });
    },
    authRequired: true,
  });

export const deleteLectureMaterial = (fileId) =>
  apiRequest({
    url: `/api/materials/delete/${fileId}`,
    method: "DELETE",
    onStart: "DELETE_LECTURE_MATERIAL_REQUEST",
    onSuccess: (data, dispatch) => {
      dispatch({ type: "DELETE_LECTURE_MATERIAL_SUCCESS", payload: fileId });
      // Reducer should filter out this ID from state.materials
    },
    onFailure: (error, dispatch) => {
      dispatch({ type: "DELETE_LECTURE_MATERIAL_FAILURE", payload: error });
    },
    authRequired: true,
  });
  // Upload Important File
export const uploadImportantFile = (formData) =>
  apiRequest({
    url: "/api/materials/important-files/upload",
    method: "POST",
    data: formData,
    onStart: UPLOAD_IMPORTANT_FILE_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({ type: UPLOAD_IMPORTANT_FILE_SUCCESS, payload: data });
      dispatch(fetchImportantFiles()); // Automatically refresh the list
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: UPLOAD_IMPORTANT_FILE_FAILURE,
        payload: { error: error.message || "Failed to upload file" },
      });
    },
    authRequired: true,
  });

// Fetch All Important Files
export const fetchImportantFiles = () =>
  apiRequest({
    url: "/api/materials/important-files/all",
    method: "GET",
    onStart: FETCH_IMPORTANT_FILES_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({ type: FETCH_IMPORTANT_FILES_SUCCESS, payload: data });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: FETCH_IMPORTANT_FILES_FAILURE,
        payload: { error: error.message || "Failed to fetch important files" },
      });
    },
    authRequired: true,
  });

// Delete Important File
export const deleteImportantFile = (fileId) =>
  apiRequest({
    url: `/api/materials/important-files/${fileId}`,
    method: "DELETE",
    onStart: DELETE_IMPORTANT_FILE_REQUEST,
    onSuccess: (data, dispatch) => {
      dispatch({ type: DELETE_IMPORTANT_FILE_SUCCESS, payload: fileId });
    },
    onFailure: (error, dispatch) => {
      dispatch({
        type: DELETE_IMPORTANT_FILE_FAILURE,
        payload: { error: error.message || "Failed to delete file" },
      });
    },
    authRequired: true,
  });