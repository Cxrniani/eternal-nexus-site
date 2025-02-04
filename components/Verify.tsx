// /components/Verify.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Verify = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("http://127.0.0.1:3000/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao verificar o código");
      }

      setSuccess(true);
      router.push("/login");
    } catch (err) {
      setError("Erro ao verificar o código");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/resend-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao reenviar código");
      }

      setSuccess(true);
      setError(null);
    } catch (err) {
      setError("Erro ao reenviar código");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-96 bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Verificar Email: {email}</h1>
        {error && <p className="text-red-500">{error}</p>}
        {success && (
          <p className="text-green-500">
            {code
              ? "Verificação realizada com sucesso!"
              : "Código reenviado com sucesso!"}
          </p>
        )}
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Código de Verificação"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full p-2 mb-4 bg-gray-700 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white rounded p-2"
          >
            {loading ? "Verificando..." : "Verificar"}
          </button>
        </form>
        <button
          onClick={handleResendCode}
          className="w-full mt-4 bg-gray-500 text-white rounded p-2"
        >
          Reenviar Código
        </button>
      </div>
    </div>
  );
};

export default Verify;
