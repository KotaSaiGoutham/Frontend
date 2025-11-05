import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaFileUpload } from "react-icons/fa";
import DetailCard from "./components/DetailCard";
import LectureMaterialsTable from "../LectureMaterialsTable";

const StudentUpload = () => {
  
  // Get student data from Redux store
  const currentStudent = useSelector((state) => state.auth?.currentStudent);
console.log("currentStudent",currentStudent)
  return (
    <div className="student-portfolio-tab premium light-theme">
      <div className="tab-content premium">
        
        <div className="upload-files-container">
  

          {/* Lecture Materials Table - Main Upload Interface */}
          {currentStudent && currentStudent.id && currentStudent.admissionDate && (
            <section className="portfolio-card delay-4">
              <LectureMaterialsTable
                studentId={currentStudent.id}
                studentName={currentStudent.Name}
                studentClassSchedule={currentStudent.classDateandTime}
                admissionDate={currentStudent.admissionDate}
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentUpload;