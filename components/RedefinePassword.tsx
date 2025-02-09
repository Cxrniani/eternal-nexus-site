"use client";


import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const RedefinePassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // This hook now runs only on the client after hydration.
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Retrieve the email from the query parameter.
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, new_password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Senha redefinida com sucesso. Você pode fazer login agora.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.error || "Erro ao redefinir senha.");
      }
    } catch (err) {
      setError("Erro ao redefinir senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-96 bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Redefinir Senha</h2>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 mb-2 bg-gray-700 rounded"
          />
          <input
            type="text"
            placeholder="Código de Verificação"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full p-2 mb-2 bg-gray-700 rounded"
          />
          <input
            type="password"
            placeholder="Nova Senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-2 mb-4 bg-gray-700 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white rounded p-2"
          >
            {loading ? "Redefinindo..." : "Redefinir Senha"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RedefinePassword;
