"use client";

import React, { useState } from "react";
import {
  CognitoUserPool,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import { poolData } from "@/cognitoConfig";
import { useRouter } from "next/navigation"; // Correto para Next.js

const userPool = new CognitoUserPool(poolData);

const Register = () => {
  const router = useRouter(); // Padrão Next.js

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Register.tsx
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const attributeList = [
      new CognitoUserAttribute({ Name: "name", Value: name }),
    ];

    userPool.signUp(email, password, attributeList, [], (err, result) => {
      setLoading(false);
      if (err) {
        setError("Erro ao cadastrar. Verifique os dados.");
        return;
      }
      console.log("Usuário cadastrado:", result);
      setSuccess(true);

      // Redireciona para a página de verificação com o e-mail como parâmetro
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-96 bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Criar Conta</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && (
          <p className="text-green-500">
            Cadastro realizado! Confirme o email.
          </p>
        )}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 mb-2 bg-gray-700 rounded"
          />
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
            className="w-full bg-green-500 text-white rounded p-2"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
