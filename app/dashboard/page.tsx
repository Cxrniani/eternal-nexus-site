"use client";

import { useAuth } from "@/components/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login"); // Redireciona para o login se o usuário não estiver autenticado
      return;
    }

    if (user) {
      // Extrai os atributos do usuário diretamente do objeto `user`
      const emailAttr = user.UserAttributes?.find((attr: any) => attr.Name === "email");
      const nameAttr = user.UserAttributes?.find((attr: any) => attr.Name === "name");
      setEmail(emailAttr?.Value || null);
      setName(nameAttr?.Value || null);
    }
  }, [user, isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Não renderiza nada se o usuário não estiver autenticado
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <div className="w-64 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="mb-2">Nome: {name || "Carregando..."}</p>
        <p className="mb-4">Email: {email || "Carregando..."}</p>
        <button
          className="w-full bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => logout()}
        >
          Sair
        </button>
      </div>
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Bem-vindo, {name || "Usuário"}!</h1>
        <p>Conteúdo do dashboard aqui.</p>
      </div>
    </div>
  );
};

export default DashboardPage;