import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTable, FaChartArea, FaPlus, FaChartLine } from "react-icons/fa";
import DetailCard from "./components/DetailCard";
import ResultsTable from "../ResultsTable";
import WeeklyMarksTrendGraph from "../WeeklyMarksBarChart";
import AddWeeklyMarksModal from "../AddWeeklyMarksForm";
import { MuiButton } from "../customcomponents/MuiCustomFormFields";
import { fetchStudentExamsByStudent } from "../../redux/actions";
import { BarChart } from '@mui/x-charts/BarChart';

const StudentResults = () => {
  const { studentId } = useParams();
  const dispatch = useDispatch();
  const [showAddMarksModal, setShowAddMarksModal] = useState(false);
  const currentStudent = useSelector((state) => state.auth?.currentStudent);
  
  console.log("currentStudent", currentStudent);

  useEffect(() => {
    if (currentStudent?.id) {
      dispatch(fetchStudentExamsByStudent(currentStudent?.id));
    }
  }, [currentStudent?.id, dispatch]);

  const { studentExams, loading: studentExamsLoading } = useSelector(
    (state) => state.studentExams
  );

  // Filter tests that have testType defined
  const typedTests = studentExams?.filter(exam => 
    exam.testType && exam.testType.length > 0
  ) || [];

  // Get current student's subject
  const currentSubject = currentStudent?.Subject || 'Physics';
  
  // Sort by exam date
  const sortedTests = [...typedTests].sort((a, b) => new Date(a.examDate) - new Date(b.examDate));

  // Prepare chart data based on current subject
  const chartData = sortedTests.map(exam => {
    // Get marks for current subject
    let subjectMarks = 0;
    let maxMarks = 100;
    
    switch(currentSubject.toLowerCase()) {
      case 'physics':
        subjectMarks = exam.physics || 0;
        maxMarks = exam.maxPhysics || 100;
        break;
      case 'chemistry':
        subjectMarks = exam.chemistry || 0;
        maxMarks = exam.maxChemistry || 100;
        break;
      case 'maths':
        subjectMarks = exam.maths || 0;
        maxMarks = exam.maxMaths || 100;
        break;
      default:
        subjectMarks = exam.physics || 0;
        maxMarks = exam.maxPhysics || 100;
    }
    
    const percentage = subjectMarks > 0 ? Math.round((subjectMarks / maxMarks) * 100) : 0;
    
    // Get test type label
    const testTypeLabel = exam.testType?.[0] || 'Test';
    const formattedTestType = testTypeLabel
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();

    // Format date properly for display
    const examDate = exam.examDate ? new Date(exam.examDate) : new Date();
    const formattedDate = `${examDate.getDate().toString().padStart(2, '0')}/${(examDate.getMonth() + 1).toString().padStart(2, '0')}/${examDate.getFullYear()}`;
    
    return {
      examName: exam.examName || `${formattedTestType}`,
      subjectMarks,
      percentage,
      date: formattedDate,
      fullDate: exam.examDate,
      testType: formattedTestType,
      subject: currentSubject,
      maxMarks: maxMarks
    };
  });

  const marksData = chartData.map(item => item.subjectMarks);
  const dates = chartData.map(item => item.date);
  
  console.log("chartData", chartData);
  const execellentSeries = chartData.map(item => item.percentage >= 90 ? item.subjectMarks : null);

const goodSeries = chartData.map(item => item.percentage >= 65 ? item.subjectMarks : null);
const averageSeries = chartData.map(item => item.percentage >= 50 && item.percentage < 65 ? item.subjectMarks : null);
const poorSeries = chartData.map(item => item.percentage < 50 ? item.subjectMarks : null);
  // For individual bar colors, you need to use a different approach
  // One option is to use multiple series or customize the chart

  return (
    <div className="student-portfolio-tab premium light-theme">
      <div className="tab-content premium">
        <div className="results-container">
          <ResultsTable 
            studentExams={studentExams}    
            studentData={currentStudent}
          />
          
          <DetailCard title="Performance Trends" icon={FaChartArea} delay={400}>
            <div className="chart-container premium">
              {studentExamsLoading ? (
                <div className="loading-state premium">
                  <div className="loading-spinner"></div>
                  <span>Loading performance data...</span>
                </div>
              ) : sortedTests.length > 0 ? (
                <div className="test-marks-chart">
                  <BarChart
                    width={600}
                    height={400}
                  series={[
                      { data: execellentSeries, label: 'Excellent Performance', id: 'excellent', color: 'green' },

  { data: goodSeries, label: 'Good Performance', id: 'good', color: '#4caf50' },
  { data: averageSeries, label: 'Average Performance', id: 'average', color: '#ff9800' },
  { data: poorSeries, label: 'Needs Improvement', id: 'poor', color: '#f44336' }
]}
                    xAxis={[
                      { 
                        data: dates,
                        scaleType: 'band',
                        label: 'Exam Date',
                      }
                    ]}
                    yAxis={[
                      { 
                        label: 'Marks',
                        min: 0,
                        max: 100
                      }
                    ]}
                    slotProps={{
                      bar: {
                        // This is where you can customize individual bars
                        onClick: (event, data) => {
                          console.log('Bar clicked:', data);
                        },
                      },
                      xAxis: {
                        tickLabelStyle: {
                          fontSize: 12,
                        },
                      },
                    }}
                    margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
                    colors={['#4caf50']} // Single color for all bars
                  />
                
                </div>
              ) : studentExams?.length > 0 ? (
                <div className="empty-state premium">
                  <FaChartLine />
                  <h3>No Test Data Available</h3>
                  <p>No tests with defined test types found in the data</p>
                  <MuiButton
                    variant="contained"
                    startIcon={<FaPlus />}
                    onClick={() => setShowAddMarksModal(true)}
                    className="premium"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      fontWeight: '600',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    Add Test Marks
                  </MuiButton>
                </div>
              ) : (
                <div className="empty-state premium">
                  <FaChartLine />
                  <h3>No Performance Data</h3>
                </div>
              )}
            </div>
          </DetailCard>
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