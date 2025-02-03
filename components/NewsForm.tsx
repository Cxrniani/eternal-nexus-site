import React, { useState } from "react";

interface NewsFormProps {
  onAddNews: (newsItem: {
    image: string;
    title: string;
    subtitle: string;
    date: string;
  }) => void;
}

const NewsForm: React.FC<NewsFormProps> = ({ onAddNews }) => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNews({ image, title, subtitle, date });
    setImage("");
    setTitle("");
    setSubtitle("");
    setDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="text"
        placeholder="URL da Imagem"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Subtítulo"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      />
      <input
        type="date"
        placeholder="Data"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Adicionar Notícia
      </button>
    </form>
  );
};

export default NewsForm;
