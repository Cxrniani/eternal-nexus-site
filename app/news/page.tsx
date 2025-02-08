"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import DOMPurify from "dompurify";

const NewsList = () => {
  const [newsItems, setNewsItems] = useState<any[]>([]);
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
        const response = await fetch("http://127.0.0.1:3000/news");
        if (!response.ok) {
          throw new Error("Erro ao buscar notícias");
        }
        const data = await response.json();
        setNewsItems(data);
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#F5EDE5] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Notícias</h1>
      <ul className="space-y-8">
        {newsItems.map((newsItem, index) => (
          <li
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-row items-center w-full h-[300px]"
          >
            <Link
              href={`/news/${newsItem.id}`}
              className="flex flex-row items-center w-full h-full"
            >
              {/* Imagem fixa 300x300 sem padding */}
              <div className="w-[300px] h-[300px]">
                <img
                  src={newsItem.image}
                  alt={newsItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Conteúdo da notícia (com padding interno) */}
              <div className="flex-1 flex flex-col justify-center p-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {newsItem.title}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {formatDate(newsItem.date)}
                </p>
                <p
                  className="text-gray-700 mt-3 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(newsItem.subtitle),
                  }}
                />
                <span className="text-blue-600 font-semibold mt-3 hover:underline">
                  Ler mais...
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsList;
