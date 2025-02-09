"use client";

import { Suspense } from "react";
import Login from "@/components/Auth/Login";

const LoginPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Login />
    </Suspense>
  );
};

export default LoginPage;
