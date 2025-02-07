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
  const [loading, setLoading] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false); // Estado para controlar a verificação do email

  // Redireciona para o dashboard se o usuário já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
<<<<<<< Updated upstream
    }
  }, [isAuthenticated, router]);
=======
    } else {
      setLoading(false); // Somente libera a renderização após autenticação confirmada
    }
  }, [isAuthenticated, isLoading, router]);
>>>>>>> Stashed changes

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.exists) {
        if (!data.confirmed) {
          // Se o e-mail não foi confirmado, redireciona para a verificação
          setError(
            "E-mail não confirmado. Redirecionando para a verificação..."
          );
          router.push(`/verify?email=${encodeURIComponent(email)}`);
        } else {
          // E-mail confirmado, redireciona para o login
          setEmailChecked(true); // Email confirmado
          router.push(`/login?email=${encodeURIComponent(email)}`);
        }
      } else {
        // E-mail não encontrado, redireciona para o registro
        setError("E-mail não encontrado. Redirecionando para o registro...");
        router.push(`/register?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      setError("Erro ao verificar o e-mail. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Função para login após o e-mail ser verificado
  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      window.location.reload();
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

        {/* Campo de email */}
        {!emailChecked ? (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 mb-2 bg-gray-700 rounded"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white rounded p-2"
            >
              {loading ? "Verificando..." : "Verificar E-mail"}
            </button>
          </form>
        ) : (
          // Se o e-mail for verificado, mostra o campo de senha
          <form onSubmit={handleSubmitPassword}>
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
        )}

        <div className="mt-4 text-center">
          <a
            href="#"
            onClick={() =>
              router.push(`/forgot-password?email=${encodeURIComponent(email)}`)
            }
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
