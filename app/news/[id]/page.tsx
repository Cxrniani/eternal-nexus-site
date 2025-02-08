"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DOMPurify from "dompurify";

const NewsDetailPage = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState<any>(null);
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };
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
      <img
        src={newsItem.image}
        alt={newsItem.title}
        className="w-full h-auto object-cover mb-4"
      />
      <p className="text-gray-500 text-sm mt-1">{formatDate(newsItem.date)}</p>
      <div
        className="mt-4 prose max-w-none"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(newsItem.content),
        }}
      />
    </div>
  );
};

export default NewsDetailPage;
