import React from "react";
import { useParams } from "react-router-dom";
import { FaFileAlt, FaDownload, FaCalendarAlt } from "react-icons/fa";
import DetailCard from "./components/DetailCard";
import { MuiButton } from "../customcomponents/MuiCustomFormFields";

const StudentPapers = () => {
  const { studentId } = useParams();

  const questionPapers = [
    {
      id: 1,
      title: "JEE Mains 2024 - Physics Paper",
      year: "2024",
      subject: "Physics",
      type: "Main Exam",
      difficulty: "Medium"
    },
    {
      id: 2,
      title: "JEE Advanced 2023 - Mathematics",
      year: "2023",
      subject: "Mathematics",
      type: "Advanced",
      difficulty: "Hard"
    },
    {
      id: 3,
      title: "Weekly Test - Chemistry",
      year: "2024",
      subject: "Chemistry",
      type: "Weekly",
      difficulty: "Easy"
    }
  ];

  return (
   <>
   </>
  );
};

export default StudentPapers;