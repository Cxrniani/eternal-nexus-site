"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Verify = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
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

      router.push("/login");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao verificar e-mail. Tente novamente."
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
      const response = await fetch("http://localhost:3000/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao reenviar código de confirmação");
      }

      setResendSuccess(true);
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
        <h2 className="text-xl font-bold mb-4">Verificar E-mail</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {resendSuccess && (
          <p className="text-green-500 mb-2">
            Código de confirmação reenviado com sucesso!
          </p>
        )}

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
            className="w-full bg-green-500 text-white rounded p-2 mt-4 disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Verificar"}
          </button>
        </form>

        <button
          onClick={handleResendCode}
          disabled={resendLoading}
          className="w-full bg-blue-500 text-white rounded p-2 mt-4 disabled:opacity-50"
        >
          {resendLoading ? "Reenviando..." : "Reenviar Código"}
        </button>
      </div>
    </div>
  );
};

export default Verify;
