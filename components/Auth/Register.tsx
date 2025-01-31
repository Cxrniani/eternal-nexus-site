// /components/Auth/Register.tsx
"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Estados para as validações da senha
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  const validatePassword = (password: string) => {
    setHasUpperCase(/[A-Z]/.test(password));
    setHasLowerCase(/[a-z]/.test(password));
    setHasNumber(/\d/.test(password));
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(password));
  };

  const validateForm = () => {
    if (!email || !password || !name) {
      setError("Todos os campos são obrigatórios.");
      return false;
    }
    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      setPasswordError(
        "A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, um número e um caractere especial."
      );
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Passo 1: Verificar e-mail
      const checkResponse = await fetch("http://localhost:5000/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const checkData = await checkResponse.json();

      if (checkData.exists) {
        setError("Este e-mail já está registrado.");
        return;
      }

      // Passo 2: Registrar via API Flask
      const registerResponse = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.error || "Erro ao registrar");
      }

      setSuccess(true);
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError("Erro ao registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
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
              validatePassword(e.target.value);
            }}
            required
            className="w-full p-2 mb-2 bg-gray-700 rounded"
          />

          {/* Pop-up de requisitos de senha */}
          <div className="mt-2 text-sm">
            <ul>
              <li className={hasUpperCase ? "text-green-500" : "text-gray-500"}>
                Deve conter uma letra maiúscula
              </li>
              <li className={hasLowerCase ? "text-green-500" : "text-gray-500"}>
                Deve conter uma letra minúscula
              </li>
              <li className={hasNumber ? "text-green-500" : "text-gray-500"}>
                Deve conter um número
              </li>
              <li
                className={hasSpecialChar ? "text-green-500" : "text-gray-500"}
              >
                Deve conter um caractere especial
              </li>
            </ul>
          </div>

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
