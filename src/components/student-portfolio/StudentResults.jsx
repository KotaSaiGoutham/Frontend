import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaChartArea, FaPlus } from "react-icons/fa";
import DetailCard from "./components/DetailCard";
import ResultsTable from "../ResultsTable";
import AddWeeklyMarksModal from "../AddWeeklyMarksForm";
import { MuiButton } from "../customcomponents/MuiCustomFormFields";
import { fetchStudentExamsByStudent } from "../../redux/actions";

const StudentResults = () => {
  const { studentId } = useParams();
  const dispatch = useDispatch();
  const [showAddMarksModal, setShowAddMarksModal] = useState(false);
  const currentStudent = useSelector((state) => state.auth?.currentStudent);

  useEffect(() => {
    if (currentStudent?.id) {
      dispatch(fetchStudentExamsByStudent(currentStudent?.id));
    }
  }, [currentStudent?.id, dispatch]);

  const { studentExams, loading: studentExamsLoading } = useSelector(
    (state) => state.studentExams
  );

  // Filter tests that have testType defined
  const typedTests =
    studentExams?.filter((exam) => exam.testType && exam.testType.length > 0) ||
    [];

  // Get current student's subject
  const currentSubject = currentStudent?.Subject || "Physics";

  // Sort by exam date
  const sortedTests = [...studentExams].sort(
    (a, b) => new Date(a.examDate) - new Date(b.examDate)
  );

  // Prepare chart data based on current subject
  const chartData = sortedTests.map((exam) => {
    // Get marks for current subject
    let subjectMarks = 0;
    let maxMarks = 100;

    switch (currentSubject.toLowerCase()) {
      case "physics":
        subjectMarks = exam.physics || 0;
        maxMarks = exam.maxPhysics || 100;
        break;
      case "chemistry":
        subjectMarks = exam.chemistry || 0;
        maxMarks = exam.maxChemistry || 100;
        break;
      case "maths":
        subjectMarks = exam.maths || 0;
        maxMarks = exam.maxMaths || 100;
        break;
      default:
        subjectMarks = exam.physics || 0;
        maxMarks = exam.maxPhysics || 100;
    }

    const percentage =
      subjectMarks > 0 ? Math.round((subjectMarks / maxMarks) * 100) : 0;

    // Get test type label
    const testTypeLabel = exam.testType?.[0] || "Test";
    const formattedTestType = testTypeLabel
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();

    // Format date properly for display
    const examDate = exam.examDate ? new Date(exam.examDate) : new Date();
    const formattedDate = `${examDate.getDate().toString().padStart(2, "0")}/${(
      examDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${examDate.getFullYear()}`;

    return {
      examName: exam.examName || `${formattedTestType}`,
      subjectMarks,
      percentage,
      date: formattedDate,
      fullDate: exam.examDate,
      testType: formattedTestType,
      subject: currentSubject,
      maxMarks: maxMarks,
    };
  });

  return (
    <div className="student-portfolio-tab premium light-theme">
      <div className="tab-content premium">
        <div className="results-container">
          <ResultsTable
            studentExams={studentExams}
            studentData={currentStudent}
            chartData={chartData}
            loading={studentExamsLoading}
          />
        </div>
      </div> 

      {/* Add Marks Modal */}
      {showAddMarksModal && currentStudent && (
        <AddWeeklyMarksModal
          studentId={studentId}
          onClose={() => setShowAddMarksModal(false)}
          programType={currentStudent.Stream}
        />
      )}
    </div>
  );
};

export default StudentResults;