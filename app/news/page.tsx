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
        if (!response.ok) throw new Error("Erro ao buscar notícias");
        const data = await response.json();
        setNewsItems(data);
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-300">
          Últimas Notícias
        </h1>

        <ul className="space-y-8">
          {newsItems.map((newsItem, index) => (
            <li
              key={index}
              className="group relative bg-gray-800 rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 ease-out hover:bg-gray-700/70 overflow-hidden"
            >
              <Link
                href={`/news/${newsItem.id}`}
                className="flex flex-col md:flex-row h-full"
              >
                {/* Imagem com overlay hover */}
                <div className="md:w-96 flex-shrink-0 relative overflow-hidden">
                  <img
                    src={newsItem.image}
                    alt={newsItem.title}
                    className="w-full h-64 md:h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                </div>

                {/* Conteúdo */}
                <div className="flex-1 p-6 md:p-8">
                  <div className="flex items-center mb-3">
                    <span className="text-sm italic text-gray-400">
                      {formatDate(newsItem.date)}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-100 mb-4">
                    {newsItem.title}
                  </h2>

                  <div
                    className="text-gray-300 leading-relaxed line-clamp-3 mb-6"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(newsItem.subtitle),
                    }}
                  />

                  <div className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                    <span className="font-semibold">Leia mais</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NewsList;
