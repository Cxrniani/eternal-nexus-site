// /components/Auth/Login.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

const Login = () => {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth(); // Verifica se o usuário já está autenticado
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard"); // Redireciona para o dashboard se já estiver autenticado
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Verifique se o e-mail já está registrado usando fetch
      const response = await fetch("http://127.0.0.1:5000/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.exists) {
        // Caso o e-mail esteja registrado, tente fazer login
        await login(email, password);
        router.push("/dashboard");
      } else {
        // Caso contrário, redirecione para a página de registro
        setError("E-mail não encontrado. Redirecionando para o registro...");
        router.push("/register");
      }
    } catch (err) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
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
        <div className="mt-4 text-center">
          <Link
            href="/forgot-password"
            className="text-blue-500 hover:underline"
          >
            Esqueci minha senha
          </Link>
        </div>
        <p className="mt-4 text-center">
          Não possui uma conta?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Registrar-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
