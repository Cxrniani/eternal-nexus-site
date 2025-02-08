"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

const UpdateProfile = () => {
  // Estados para armazenar os valores atuais dos campos
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const { user, accessToken, isLoading, refreshUser } = useAuth(); // Adicione refreshUser
  const router = useRouter();

  // Busca os valores iniciais do usuário
  useEffect(() => {
    if (user && user.UserAttributes) {
      const emailAttr = user.UserAttributes.find((attr: any) => attr.Name === "email");
      const nameAttr = user.UserAttributes.find((attr: any) => attr.Name === "name");
      const birthdateAttr = user.UserAttributes.find((attr: any) => attr.Name === "birthdate");
      const genderAttr = user.UserAttributes.find((attr: any) => attr.Name === "gender");
      const phoneAttr = user.UserAttributes.find((attr: any) => attr.Name === "phone_number");

      setEmail(emailAttr?.Value || "");
      setName(nameAttr?.Value || "");
      setBirthdate(birthdateAttr?.Value || "");
      setGender(genderAttr?.Value || "");
      setPhoneNumber(phoneAttr?.Value || "");
    }
  }, [user]);

  // Redireciona para a página de login se o usuário não estiver autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Objeto com todos os campos, enviando os valores atuais (alterados ou não)
    const userData = {
      name: name, // Sempre envia o valor atual, mesmo se não foi alterado
      birthdate: birthdate, // Sempre envia o valor atual, mesmo se não foi alterado
      gender: gender, // Sempre envia o valor atual, mesmo se não foi alterado
      phone_number: phoneNumber, // Sempre envia o valor atual, mesmo se não foi alterado
    };

    try {
      const response = await fetch("http://127.0.0.1:3000/update_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(userData), // Envia todos os campos, alterados ou não
      });

      if (response.ok) {
        alert("Dados atualizados com sucesso!");

        // Atualiza os estados locais com os novos valores
        setName(userData.name);
        setBirthdate(userData.birthdate);
        setGender(userData.gender);
        setPhoneNumber(userData.phone_number);

        // Recarrega os dados do usuário (opcional)
        await refreshUser(); // Atualiza os dados do usuário no contexto de autenticação

        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        alert(`Erro ao atualizar dados: ${errorData.error}`);
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="w-full min-h-96 flex flex-col items-center bg-zinc-900 p-5">
      <h1 className="text-5xl font-extrabold mx-auto text-center p-10">Atualizar Perfil</h1>
      <form className="w-full md:w-1/2 flex flex-col gap-y-5 mx-auto" onSubmit={handleSubmit}>
        <div className="flex flex-row">
          <label className="md:text-2xl font-bold">Email:</label>
          <input
            className="md:text-lg px-2 py-1 md:p-2 w-full ml-2 md:ml-[7.5rem] rounded bg-gray-300"
            type="text"
            value={email || ""}
            readOnly
          />
        </div>
        <div className="flex flex-row">
          <label className="md:text-2xl font-bold">Nome e Sobrenome:</label>
          <input
            className="md:text-lg p-2 w-full ml-2 md:ml-[0.25rem] rounded"
            type="text"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-row">
          <label className="md:text-2xl font-bold">Data de Nascimento:</label>
          <input
            className="md:text-lg p-2 w-full rounded"
            type="date"
            value={birthdate || ""}
            onChange={(e) => setBirthdate(e.target.value)}
          />
        </div>
        <div>
          <label className="md:text-2xl mr-2 md:mr-24 font-bold">Gênero:</label>
          <select
            value={gender || ""}
            onChange={(e) => setGender(e.target.value)}
            className="p-2 rounded md:text-lg"
          >
            <option value="">Selecione</option>
            <option value="male">Masculino</option>
            <option value="female">Feminino</option>
            <option value="other">Outro</option>
          </select>
        </div>
        <div className="flex flex-row font-bold">
          <label className="md:text-2xl">Celular:</label>
          <input
            className="md:text-lg py-1 px-2 md:p-2 rounded w-full ml-2 md:ml-24"
            type="tel"
            value={phoneNumber || ""}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <button type="submit" className="text-2xl p-3 mt-5 w-full bg-zinc-700 rounded">
          Atualizar
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;