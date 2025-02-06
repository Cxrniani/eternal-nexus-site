"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const NewsDetailPage = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState<any>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3000/news/${id}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar notícia");
        }
        const data = await response.json();
        setNewsItem(data);
      } catch (error) {
        console.error("Erro ao buscar notícia:", error);
      }
    };

    fetchNews();
  }, [id]);

  if (!newsItem) {
    return <div>Carregando...</div>;
  }
  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#F5EDE5] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">{newsItem.title}</h1>
      <img
        src={newsItem.image}
        alt={newsItem.title}
        className="w-full h-auto object-cover mb-4"
      />
      <div
        className="mt-4"
        dangerouslySetInnerHTML={{ __html: newsItem.content }} // Renderizando HTML
      />
    </div>
  );
};

export default NewsDetailPage;
