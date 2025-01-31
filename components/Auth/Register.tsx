// /components/Auth/Register.tsx
"use client";

import React, { useState } from "react";
import {
  CognitoUserPool,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import { poolData } from "@/cognitoConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";

const userPool = new CognitoUserPool(poolData);

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    return regex.test(password);
  };

  const validateForm = () => {
    if (!email || !password || !name) {
      setError("Todos os campos são obrigatórios.");
      return false;
    }
    if (!validatePassword(password)) {
      setPasswordError(
        "A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, um número e um caractere especial."
      );
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    const attributeList = [
      new CognitoUserAttribute({ Name: "name", Value: name }),
    ];

    userPool.signUp(email, password, attributeList, [], (err, result) => {
      setLoading(false);
      if (err) {
        setError(err.message || "Erro ao cadastrar. Verifique os dados.");
        return;
      }
      setSuccess(true);
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
            onChange={(e) => {
              setPassword(e.target.value);
              if (!validatePassword(e.target.value)) {
                setPasswordError(
                  "A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, um número e um caractere especial."
                );
              } else {
                setPasswordError(null);
              }
            }}
            required
            className="w-full p-2 mb-2 bg-gray-700 rounded"
          />
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white rounded p-2 mt-4"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Já possui uma conta?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
