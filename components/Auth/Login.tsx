"use client";

import React, { useState } from "react";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { poolData } from "@/cognitoConfig"; // Certifique-se de que isso está correto
import { useRouter } from "next/navigation"; // Para redirecionamento no Next.js

const userPool = new CognitoUserPool(poolData); // Criando o pool de usuários com os dados de configuração

const Login = () => {
  const router = useRouter(); // Usando o router do Next.js para redirecionamento
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Autenticação com a SDK do AWS Cognito
    const userData = {
      Username: email, // Nome de usuário (pode ser o email dependendo da sua configuração)
      Pool: userPool, // A referência do seu pool de usuários
    };

    const authenticationData = {
      Username: email, // Nome de usuário
      Password: password, // Senha
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log("Login realizado com sucesso:", result);
        router.push("/dashboard"); // Redireciona após login bem-sucedido
      },
      onFailure: (err) => {
        console.error("Erro ao fazer login:", err);
        setError("Erro ao fazer login. Verifique suas credenciais.");
      },
    });

    setLoading(false); // Finaliza o carregamento
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-96 bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Entrar</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 mb-2 bg-gray-700 rounded"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 mb-4 bg-gray-700 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white rounded p-2"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
