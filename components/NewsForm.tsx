import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import DOMPurify from "dompurify";

const QuillEditor = dynamic(() => import("react-quill-new"), { ssr: false });

const NewsForm = ({ onAddNews }: { onAddNews: (newsItem: any) => void }) => {
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const parseContent = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const title = doc.querySelector("h1")?.textContent || "Sem título";
    const subtitle = doc.querySelector("h2")?.textContent || "Sem subtítulo";
    const cleanHTML = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "h1",
        "h2",
        "h3",
        "p",
        "strong",
        "em",
        "u",
        "img",
        "a",
        "ul",
        "ol",
        "li",
      ],
      ALLOWED_ATTR: ["href", "src", "alt", "style"],
    });

    return { title, subtitle, content: cleanHTML };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!coverImage) {
        throw new Error("Selecione uma imagem de capa");
      }

      const {
        title,
        subtitle,
        content: sanitizedContent,
      } = parseContent(content);

      const formData = new FormData();
      formData.append("coverImage", coverImage);
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("content", sanitizedContent);

      const response = await fetch("http://127.0.0.1:3000/news/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao criar notícia");
      }

      const data = await response.json();
      console.log("Notícia criada:", data);
      onAddNews(data);
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
          onChange={(content) => setContent(content)}
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
          preserveWhitespace
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
