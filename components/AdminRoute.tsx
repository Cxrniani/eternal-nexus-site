"use client"

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Aguarda até que a autenticação seja processada

    if (!isAuthenticated) {
      router.replace("/login"); // Usa replace para evitar que o usuário volte para a página protegida
    } else if (!isAdmin) {
      router.replace("/403");
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  if (isLoading || !isAuthenticated || !isAdmin) {
    return <p>Carregando...</p>; // Exibe algo enquanto verifica a autenticação
  }

  return <>{children}</>;
};

export default AdminRoute;
