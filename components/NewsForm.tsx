import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import DOMPurify from "dompurify";

const QuillEditor = dynamic(() => import("react-quill-new"), { ssr: false });

const NewsForm = ({ onAddNews }: { onAddNews: (newsItem: any) => void }) => {
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  // Extrai título e subtítulo do conteúdo HTML
  const parseContent = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const title = doc.querySelector("h1")?.textContent || "Sem título";
    const subtitle = doc.querySelector("h2")?.textContent || "Sem subtítulo";
    const cleanHTML = DOMPurify.sanitize(html);

    return { title, subtitle, content: cleanHTML };
  };

  // Manipulador de imagens no Quill
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          // Upload para S3
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("http://127.0.0.1:3000/api/upload", {
            method: "POST",
            body: formData,
          });

          const { url } = await response.json();

          // Insere a imagem no editor
          const quill = document.querySelector(".ql-editor") as any;
          const range = quill?.getSelection();
          quill?.insertEmbed(range?.index, "image", url);
        } catch (error) {
          console.error("Erro no upload da imagem:", error);
        }
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!coverImage) {
        throw new Error("Selecione uma imagem de capa");
      }

      const formData = new FormData();
      formData.append("coverImage", coverImage);
      formData.append("content", content);

      // Envia tudo em UMA ÚNICA requisição
      const response = await fetch("http://127.0.0.1:3000/news/create", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar notícia");
      }

      console.log("Notícia criada:", data);
      onAddNews(data); // Apenas notifica o componente pai
    } catch (error) {
      console.error("Erro completo:", error);
      alert((error as any).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">
          Imagem de Capa
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">
          Conteúdo da Notícia
        </label>
        <QuillEditor
          value={content}
          onChange={setContent}
          theme="snow"
          modules={{
            toolbar: {
              container: [
                [{ header: ["1", "2", false] }],
                ["bold", "italic", "underline"],
                ["blockquote", "code-block"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
              ],
              handlers: { image: imageHandler },
            },
          }}
          formats={[
            "header",
            "bold",
            "italic",
            "underline",
            "blockquote",
            "code-block",
            "list",
            "link",
            "image",
          ]}
          className="h-96 mb-8"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Publicar Notícia
      </button>
    </form>
  );
};

export default NewsForm;
