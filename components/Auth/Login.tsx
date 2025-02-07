"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const handleForgotPassword = () => {
    // Redirecione para a página de esqueci minha senha com o e-mail como parâmetro de consulta
    router.push(`/forgot-password?email=${encodeURIComponent(email)}`);
  };

  // Redireciona para o dashboard se o usuário já estiver autenticado
  useEffect(() => {
    if (isLoading) return; // Se ainda está carregando, não faz nada

    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      setLoading(false); // Somente libera a renderização após autenticação confirmada
    }
  }, [isAuthenticated, isLoading, router]);

  // Preenche o e-mail automaticamente se vier como parâmetro na URL
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:3000/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.exists) {
        await login(email, password);
        window.location.reload();
      } else {
        setError("E-mail não encontrado. Redirecionando para o registro...");
        router.push(`/register?email=${encodeURIComponent(email)}`);
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
            disabled={isLoading}
            className="w-full bg-blue-500 text-white rounded p-2"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <a
            href="#"
            onClick={handleForgotPassword}
            className="text-blue-500 hover:underline"
          >
            Esqueci minha senha
          </a>
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
