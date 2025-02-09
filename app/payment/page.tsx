import PaymentPage from "@/components/PaymentPage";
import React, { Suspense } from 'react';

const PaymentPageWithSuspense = () => {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PaymentPage />
    </Suspense>
  );
};

export default PaymentPageWithSuspense;
