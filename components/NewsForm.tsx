import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const NewsForm = ({ onAddNews }: { onAddNews: (newsItem: any) => void }) => {
  const quillRef = useRef<any>(null);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState(""); // Campo para o conteúdo
  const [date, setDate] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { Quill } = require("react-quill-new");
      const BlotFormatter = require("quill-blot-formatter");
      Quill.register("modules/blotFormatter", BlotFormatter);
    }
  }, []);

  // Função para capturar conteúdo do Quill
  const handleContentChange = (value: string) => {
    setContent(value);
  };

  // Função para lidar com o upload de imagens no Quill
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;
      setImage(base64Image); // Salva a imagem Base64, se necessário
      // Adiciona a imagem ao conteúdo do Quill (como Base64)
      const range = quillRef.current.getEditor().getSelection();
      const base64Url = `data:image/jpeg;base64,${base64Image}`;
      quillRef.current.getEditor().insertEmbed(range.index, "image", base64Url);
    };
    reader.readAsDataURL(file); // Converte a imagem para Base64
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newsItem = { image, title, subtitle, content, date };
    onAddNews(newsItem);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Imagem</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Subtítulo</label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Conteúdo</label>
        {/* Quill Editor */}
        <ReactQuill
          value={content}
          onChange={handleContentChange}
          modules={{
            toolbar: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["bold", "italic", "underline"],
              [{ align: [] }],
              ["link", "image"], // Adicionando suporte para link e imagem
              ["clean"],
            ],
            blotFormatter: {},
          }}
          className="w-full p-2 border border-gray-300 rounded"
          theme="snow"
          formats={[
            "image",
            "bold",
            "italic",
            "underline",
            "list",
            "bullet",
            "header",
            "link",
          ]}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Data</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Adicionar Notícia
      </button>
    </form>
  );
};

export default NewsForm;
