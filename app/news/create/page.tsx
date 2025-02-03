"use client";
import React from "react";
import NewsForm from "@/components/NewsForm";

const CreateNewsPage = () => {
  const handleAddNews = async (newsItem: {
    image: string;
    title: string;
    subtitle: string;
    date: string;
    content: string;
  }) => {
    try {
      const response = await fetch("http://127.0.0.1:3000/news/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newsItem),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar notícia");
      }

      const data = await response.json();
      console.log("Notícia adicionada com sucesso:", data);
    } catch (error) {
      console.error("Erro ao adicionar notícia:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Cadastrar Notícia</h1>
      <NewsForm onAddNews={handleAddNews} />
    </div>
  );
};

export default CreateNewsPage;
