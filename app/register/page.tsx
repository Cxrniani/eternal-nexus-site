// /app/register/page.tsx para registro de usuarios
import Register from "@/components/Auth/Register";
import { Suspense } from "react";

export default function RegisterPage() {
  return <Suspense fallback={<div>Carregando...</div>}><Register /></Suspense>;
}
