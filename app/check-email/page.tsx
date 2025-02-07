"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CheckEmail = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao verificar e-mail");
      }

      console.log("Data received:", data);

      if (data.exists) {
        if (data.status === "Usuário já registrado") {
          console.log("Redirecionando para login");
          router.push(`/login?email=${encodeURIComponent(email)}`);
        } else if (data.status === "Usuário não confirmado") {
          console.log("Redirecionando para verificação");
          router.push(`/verify?email=${encodeURIComponent(email)}`);
        }
      } else {
        console.log("Redirecionando para registro");
        router.push(`/register?email=${encodeURIComponent(email)}`);
      }
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-96 bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Verificar E-mail</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleCheckEmail}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
      </div>
    </div>
  );
};

export default CheckEmail;
