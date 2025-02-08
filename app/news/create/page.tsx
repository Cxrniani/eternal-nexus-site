"use client";
import React from "react";
import NewsForm from "@/components/NewsForm";

const CreateNewsPage = () => {
  const handleAddNews = async (newsData: any) => {
    // Apenas redireciona ou mostra mensagem
    console.log("Notícia criada com sucesso:", newsData);
    alert("Notícia publicada!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Cadastrar Notícia</h1>
      <NewsForm onAddNews={handleAddNews} />
    </div>
  );
};

export default CreateNewsPage;
