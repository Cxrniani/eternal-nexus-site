"use client";

import { Suspense } from "react";
import Login from "@/components/Auth/Login";
import RedefinePassword from "@/components/RedefinePassword";

const RedefinePasswordPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RedefinePassword />
    </Suspense>
  );
};

export default RedefinePasswordPage;
