// Verify.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Verifique se o useRouter está correto
import {
  CognitoUser,
  CognitoUserPool,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { poolData } from "@/cognitoConfig";

const userPool = new CognitoUserPool(poolData);

const Verify = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Obter o e-mail da URL (parâmetro)
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    user.confirmRegistration(code, true, (err, result) => {
      setLoading(false);
      if (err) {
        console.error("Erro ao verificar:", err);
        setError(err.message || "Erro ao verificar o código.");
        return;
      }
      console.log("Usuário confirmado com sucesso:", result);
      setSuccess(true);
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-96 bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Verificar Código</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && (
          <p className="text-green-500">Email confirmado com sucesso!</p>
        )}
        <form onSubmit={handleVerify}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 mb-2 bg-gray-700 rounded"
            readOnly // Tornando o campo de e-mail somente leitura
          />
          <input
            type="text"
            placeholder="Código de Verificação"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full p-2 mb-4 bg-gray-700 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white rounded p-2"
          >
            {loading ? "Verificando..." : "Verificar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;
