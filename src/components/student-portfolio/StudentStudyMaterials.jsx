import React from "react";
import { useParams } from "react-router-dom";
import { FaInfoCircle, FaSearchDollar, FaMoneyBillWave } from "react-icons/fa";
import DetailCard from "./components/DetailCard";
import DetailItem from "./components/DetailItem";

const StudentStudyMaterials = () => {
  const { studentId } = useParams();
  const [studentData, setStudentData] = React.useState(null);

  return (
  <>
  </>
  );
};

export default StudentStudyMaterials;