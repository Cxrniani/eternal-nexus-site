"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DOMPurify from "dompurify";
import Link from "next/link";

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
        if (!response.ok) throw new Error("Erro ao buscar notícia");
        const data = await response.json();
        setNewsItem(data);
      } catch (error) {
        console.error("Erro ao buscar notícia:", error);
      }
    };
    fetchNews();
  }, [id]);

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-pulse text-2xl text-gray-400">
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Botão de Voltar */}
        <Link
          href="/news"
          className="mb-8 inline-flex items-center text-gray-400 hover:text-blue-400 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Voltar para Notícias
        </Link>

        {/* Cabeçalho */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4">
            {newsItem.title}
          </h1>
          <p className="text-gray-400 text-base sm:text-lg italic">
            {formatDate(newsItem.date)}
          </p>
        </div>

        {/* Imagem Destaque */}
        <div className="relative rounded-2xl overflow-hidden mb-12 group">
          <img
            src={newsItem.image}
            alt={newsItem.title}
            className="w-full h-48 sm:h-64 md:h-96 object-cover transform transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
        </div>

        {/* Conteúdo */}
        <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert">
          <div
            className="text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(newsItem.content),
            }}
          />
        </article>

        {/* Divisor Estilizado */}
        <div className="my-12 sm:my-16 border-t border-gray-700/50 relative">
          <div className="absolute left-1/2 -translate-x-1/2 -top-3.5 text-gray-500 bg-gray-900 px-4">
            ✦ ✦ ✦
          </div>
        </div>

        {/* Botão de Voltar no Final */}
        <Link
          href="/news"
          className="mt-8 flex items-center justify-center w-full sm:w-64 mx-auto px-6 py-3 border border-gray-700 rounded-lg text-gray-300 hover:border-blue-400 hover:text-blue-400 transition-all"
        >
          Ver Todas as Notícias
        </Link>
      </div>
    </div>
  );
};

export default NewsDetailPage;
