"use client";

import { useAuth } from "@/components/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      user.getUserAttributes((err, attributes) => {
        if (err) {
          console.error("Erro ao pegar atributos", err);
        } else {
          const emailAttr = attributes?.find((attr) => attr.Name === "email");
          setEmail(emailAttr?.Value || null);
        }
      });
    }
  }, [user]);

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Email: {email ? email : "Carregando..."}</p>
      <button
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        onClick={() => logout()}
      >
        Sair
      </button>
    </div>
  );
};

export default DashboardPage;
