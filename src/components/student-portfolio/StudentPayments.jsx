import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import PaymentHistoryTable from "../PaymentHistoryTable";
import { fetchPaymentHistory } from "../../redux/actions";
const StudentPayments = () => {
  const dispatch = useDispatch();

  const payments = useSelector((state) => state.payments.data);
  const currentStudent = useSelector((state) => state.auth?.currentStudent);
  useEffect(() => {
    if (currentStudent?.id) {
      dispatch(fetchPaymentHistory(currentStudent?.id));
    }
  }, [currentStudent?.id, dispatch]);
console.log("payments",payments)
  return (
    <div className="student-portfolio-tab premium light-theme">
      <div className="tab-content premium">
        <PaymentHistoryTable
          payments={payments}
          monthlyFee={currentStudent?.monthlyFee || 0}
        />
      </div>
    </div>
  );
};

export default StudentPayments;
