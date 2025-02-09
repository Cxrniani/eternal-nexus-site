"use client"; // Certifique-se de que a página é do lado do cliente

import { Suspense } from "react";
import ForgotPassword from "@/components/ForgotPassword";

const ForgotPasswordPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ForgotPassword />
    </Suspense>
  );
};

export default ForgotPasswordPage;