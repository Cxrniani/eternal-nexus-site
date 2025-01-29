// /components/ProtectedRoute.tsx
import React from "react";
import { useRouter } from "next/navigation"; // Next.js Router
import { useAuth } from "../components/AuthContext";

const ProtectedRoute = () => {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div>
      <h1>Conteúdo Protegido</h1>
    </div>
  );
};

export default ProtectedRoute;
