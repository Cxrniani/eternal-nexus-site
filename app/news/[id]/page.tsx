"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const NewsDetail = () => {
  const { id } = useParams(); // Pegando o ID da URL
  const [newsItem, setNewsItem] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const fetchNewsItem = async () => {
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

      fetchNewsItem();
    }
  }, [id]);

  if (!newsItem) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h4 className="text-sm text-gray-500">{newsItem.date}</h4>
      <h1 className="text-3xl font-bold mb-2">{newsItem.title}</h1>
      <h3 className="text-xl font-semibold mb-4">{newsItem.subtitle}</h3>
      <img
        src={newsItem.image}
        alt={newsItem.title}
        className="w-full h-auto object-cover mb-4"
      />
    </div>
  );
};

export default NewsDetail;
