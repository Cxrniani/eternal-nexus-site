"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const RedefinePassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 segundos

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleRedefinePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:3000/confirm-forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code, new_password: newPassword }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao redefinir senha");
      }

      setSuccess(true);
      router.push(`/login?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao redefinir senha. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError(null);
    setResendSuccess(false);

    try {
      const response = await fetch("http://localhost:3000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao reenviar código de confirmação");
      }

      setResendSuccess(true);
      setCanResend(false);
      setTimeLeft(30); // Reinicia o timer para 30 segundos
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao reenviar código de confirmação. Tente novamente."
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-96 bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Redefinir Senha</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && (
          <p className="text-green-500 mb-2">
            Senha redefinida com sucesso! Redirecionando para login...
          </p>
        )}
        {resendSuccess && (
          <p className="text-green-500 mb-2">
            Código de confirmação reenviado com sucesso!
          </p>
        )}

        <form onSubmit={handleRedefinePassword}>
          <input
            type="text"
            name="code"
            placeholder="Código de confirmação"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full p-2 mb-2 bg-gray-700 rounded"
          />
          <input
            type="password"
            name="new_password"
            placeholder="Nova Senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-2 mb-2 bg-gray-700 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white rounded p-2 mt-4 disabled:opacity-50"
          >
            {loading ? "Redefinindo..." : "Redefinir"}
          </button>
        </form>

        <button
          onClick={handleResendCode}
          disabled={resendLoading || !canResend}
          className="w-full bg-blue-500 text-white rounded p-2 mt-4 disabled:opacity-50"
        >
          {resendLoading ? "Reenviando..." : `Reenviar Código (${timeLeft}s)`}
        </button>
      </div>
    </div>
  );
};

export default RedefinePassword;
