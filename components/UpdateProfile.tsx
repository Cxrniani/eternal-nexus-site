"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

const UpdateProfile = () => {
  const { user, accessToken, isLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    address: "",
    gender: "",
    phone_number: "",
  });

  const [isFetchingUserData, setIsFetchingUserData] = useState(true); // Novo estado para controlar o carregamento dos dados do usuário

  // Função para buscar os dados do usuário
  const fetchUserData = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch("http://127.0.0.1:3000/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data.data; // Dados do usuário retornados pela API
        setFormData({
          address: userData.address || "",
          gender: userData.gender || "",
          phone_number: userData.phone_number || "",
        });
      } else {
        throw new Error("Erro ao buscar dados do usuário");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    } finally {
      setIsFetchingUserData(false); // Finaliza o carregamento
    }
  };

  // Busca os dados do usuário assim que o componente for montado
  useEffect(() => {
    if (!isLoading && accessToken) {
      fetchUserData();
    }
  }, [isLoading, accessToken]);

  // Redireciona para a página de login se o usuário não estiver autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:3000/update_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Dados atualizados com sucesso!");
        router.push("/dashboard"); // Redireciona para a página de perfil após a atualização
      } else {
        const errorData = await response.json();
        alert(`Erro ao atualizar dados: ${errorData.error}`);
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  };

  if (isLoading || isFetchingUserData) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="w-full min-h-96 flex flex-col items-center bg-zinc-900 p-5">
      <h1 className="text-5xl font-extrabold mx-auto p-20">Atualizar Perfil</h1>
      <form className="w-1/2 flex flex-col gap-y-5 mx-auto" onSubmit={handleSubmit}>
        <div className="flex flex-row">
          <label className="text-2xl font-bold">Endereço:</label>
          <input
            className="text-lg p-2 w-full ml-10 rounded"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="text-2xl mr-16 font-bold">Gênero:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="p-2 rounded text-xl"
          >
            <option value="">Selecione</option>
            <option value="male">Masculino</option>
            <option value="female">Feminino</option>
            <option value="other">Outro</option>
          </select>
        </div>
        <div className="flex flex-row font-bold">
          <label className="text-2xl">Telefone:</label>
          <input
            className="text-lg p-2 rounded w-full ml-12"
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="text-2xl p-3 w-full bg-zinc-700 rounded">
          Atualizar
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;