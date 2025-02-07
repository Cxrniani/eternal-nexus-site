"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Verify = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
<<<<<<< Updated upstream
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");

    if (emailParam) {
      setEmail(emailParam);
      setIsEmailEditable(false); // Bloqueia edição se veio por parâmetro
    } else {
      setIsEmailEditable(true); // Permite edição se não veio por parâmetro
    }
  }, []);
=======
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
>>>>>>> Stashed changes

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !code) {
      setError("E-mail e código são obrigatórios");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao verificar e-mail");
      }

<<<<<<< Updated upstream
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000); // Redireciona para login após 2 segundos
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro na verificação");
=======
      router.push("/login");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao verificar e-mail. Tente novamente."
      );
>>>>>>> Stashed changes
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
<<<<<<< Updated upstream
    if (!email) {
      setError("Digite um e-mail para reenviar o código");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      // Primeiro, verifica o status do usuário antes de reenviar o código
      const checkResponse = await fetch("http://127.0.0.1:3000/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const checkData = await checkResponse.json();

      if (!checkResponse.ok) {
        throw new Error(checkData.error || "Erro ao verificar usuário");
      }

      const { user_status } = checkData.user;

      if (user_status === "CONFIRMED") {
        setMessage("Usuário já confirmado. Faça login."); // Define a mensagem correta
        setSuccess(true); // Mantém como booleano
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }

      // Se o usuário não está confirmado, pode reenviar o código
      const response = await fetch("http://127.0.0.1:3000/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
=======
    setResendLoading(true);
    setError(null);
    setResendSuccess(false);

    try {
      const response = await fetch("http://localhost:3000/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
>>>>>>> Stashed changes
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao reenviar código de confirmação");
      }

      setResendSuccess(true);
    } catch (err) {
<<<<<<< Updated upstream
      setError(err instanceof Error ? err.message : "Erro no reenvio");
    } finally {
      setLoading(false);
=======
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao reenviar código de confirmação. Tente novamente."
      );
    } finally {
      setResendLoading(false);
>>>>>>> Stashed changes
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-96 bg-gray-800 shadow-md rounded-lg p-6">
<<<<<<< Updated upstream
        <h1 className="text-2xl font-bold mb-4">Verificar Email</h1>

        {/* Campo de e-mail editável quando não veio por parâmetro */}
        {isEmailEditable && (
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 mb-4 bg-gray-700 rounded"
          />
        )}

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && (
          <p className="text-green-500 mb-2">Código verificado com sucesso!</p>
        )}

=======
        <h2 className="text-xl font-bold mb-4">Verificar E-mail</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {resendSuccess && (
          <p className="text-green-500 mb-2">
            Código de confirmação reenviado com sucesso!
          </p>
        )}

>>>>>>> Stashed changes
        <form onSubmit={handleVerify}>
          <input
            type="text"
            name="code"
            placeholder="Código de confirmação"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full p-2 mb-2 bg-gray-700 rounded"
          />

          <button
            type="submit"
            disabled={loading}
<<<<<<< Updated upstream
            className="w-full bg-blue-500 text-white rounded p-2 disabled:opacity-50"
=======
            className="w-full bg-green-500 text-white rounded p-2 mt-4 disabled:opacity-50"
>>>>>>> Stashed changes
          >
            {loading ? "Verificando..." : "Verificar"}
          </button>
        </form>

<<<<<<< Updated upstream
        <div className="mt-4 text-center">
          <button
            onClick={handleResendCode}
            className="text-blue-400 hover:underline"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Reenviar código de verificação"}
          </button>
        </div>
=======
        <button
          onClick={handleResendCode}
          disabled={resendLoading}
          className="w-full bg-blue-500 text-white rounded p-2 mt-4 disabled:opacity-50"
        >
          {resendLoading ? "Reenviando..." : "Reenviar Código"}
        </button>
>>>>>>> Stashed changes
      </div>
    </div>
  );
};

export default Verify;
