"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

const Register = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    birthdate: "",
    gender: "",
    phone_number: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Estados para as validações da senha
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [hasMinLength, setHasMinLength] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, router]);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setFormData((prev) => ({ ...prev, email: emailParam }));
  }, [searchParams]);

  const validatePassword = (password: string) => {
    setHasUpperCase(/[A-Z]/.test(password));
    setHasLowerCase(/[a-z]/.test(password));
    setHasNumber(/\d/.test(password));
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(password));
    setHasMinLength(password.length >= 8);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/; // Formato E.164
    setPhoneError(
      phoneRegex.test(phone) ? null : "Formato inválido (ex: +5511999999999)"
    );
  };

  const validateForm = () => {
    const requiredFields = Object.entries(formData).filter(
      ([key]) => key !== "phone_number" // phone_number pode precisar de tratamento especial
    );

    if (requiredFields.some(([, value]) => !value)) {
      setError("Todos os campos obrigatórios devem ser preenchidos.");
      return false;
    }

    if (phoneError) {
      setError("Corrija os erros no formulário.");
      return false;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.birthdate)) {
      setError("Data de nascimento inválida (use o formato AAAA-MM-DD).");
      return false;
    }

    if (
      !hasUpperCase ||
      !hasLowerCase ||
      !hasNumber ||
      !hasSpecialChar ||
      !hasMinLength
    ) {
      setPasswordError(
        "A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial."
      );
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const registerResponse = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone_number: formData.phone_number.replace(/[^+\d]/g, ""), // Permite '+' e dígitos
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.error || "Erro ao registrar");
      }

      setSuccess(true);
      router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao registrar. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "password") validatePassword(value);
    if (name === "phone_number") validatePhone(value);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-96 bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Criar Conta</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && (
          <p className="text-green-500 mb-2">
            Cadastro realizado! Confirme o email.
          </p>
        )}

        <form onSubmit={handleRegister}>
          {/* Campos do formulário */}
          <input
            type="text"
            name="name"
            placeholder="Nome completo"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 mb-2 bg-gray-700 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 mb-2 bg-gray-700 rounded"
          />

          <input
            type="tel"
            name="phone_number"
            placeholder="Telefone (ex: +5511999999999)"
            value={formData.phone_number}
            onChange={handleChange}
            required
            className="w-full p-2 mb-2 bg-gray-700 rounded"
          />
          {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}

          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            required
            className="w-full p-2 mb-2 bg-gray-700 rounded"
            max={new Date().toISOString().split("T")[0]}
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full p-2 mb-2 bg-gray-700 rounded"
          >
            <option value="">Selecione o gênero</option>
            <option value="male">Masculino</option>
            <option value="female">Feminino</option>
            <option value="other">Outro</option>
          </select>

          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 mb-2 bg-gray-700 rounded"
          />

          {/* Validação da senha */}
          <div className="text-sm mb-4">
            <p className={hasMinLength ? "text-green-400" : "text-red-400"}>
              ✓ Pelo menos 8 caracteres
            </p>
            <p className={hasUpperCase ? "text-green-400" : "text-red-400"}>
              ✓ Letra maiúscula
            </p>
            <p className={hasLowerCase ? "text-green-400" : "text-red-400"}>
              ✓ Letra minúscula
            </p>
            <p className={hasNumber ? "text-green-400" : "text-red-400"}>
              ✓ Número
            </p>
            <p className={hasSpecialChar ? "text-green-400" : "text-red-400"}>
              ✓ Caractere especial
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white rounded p-2 mt-4 disabled:opacity-50"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p className="mt-4 text-center">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-green-400 hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
