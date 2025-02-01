// components/FormularioLote.tsx
"use client";

import React, { useState, FormEvent, useEffect } from "react";

interface Lote {
    id?: number;
    nome: string;
    descricao?: string;
    valor: number;
    quantidade: number;
}

const FormularioLote = () => {
    const [nome, setNome] = useState<string>("");
    const [descricao, setDescricao] = useState<string>("");
    const [valor, setValor] = useState<number>(0);
    const [quantidade, setQuantidade] = useState<number>(0);
    const [lotes, setLotes] = useState<Lote[]>([]);
    const [editandoLote, setEditandoLote] = useState<Lote | null>(null); // Estado para controlar a edição

    // Função para buscar lotes da API
    const fetchLotes = async () => {
        try {
            const response = await fetch("http://127.0.0.1:3000/lotes", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Erro ao buscar lotes");
            }
            const data = await response.json();
            setLotes(data);
        } catch (error) {
            console.error("Erro ao buscar lotes:", error);
        }
    };

    // Busca os lotes ao carregar o componente
    useEffect(() => {
        fetchLotes();
    }, []);

    // Função para cadastrar ou editar um lote
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const lote: Lote = { nome, descricao, valor, quantidade };

        try {
            let response;
            if (editandoLote) {
                // Se estiver editando, faz uma requisição PUT
                response = await fetch(`http://127.0.0.1:3000/lotes/${editandoLote.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(lote),
                });
            } else {
                // Se não estiver editando, faz uma requisição POST
                response = await fetch("http://127.0.0.1:3000/lotes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(lote),
                });
            }

            if (!response.ok) {
                throw new Error(editandoLote ? "Erro ao editar lote" : "Erro ao cadastrar lote");
            }

            const data = await response.json();
            console.log(editandoLote ? "Lote editado com sucesso:" : "Lote cadastrado com sucesso:", data);

            // Atualiza a lista de lotes após o cadastro/edição
            fetchLotes();

            // Limpa o formulário
            setNome("");
            setDescricao("");
            setValor(0);
            setQuantidade(0);
            setEditandoLote(null); // Sai do modo de edição
        } catch (error) {
            console.error(editandoLote ? "Erro ao editar lote:" : "Erro ao cadastrar lote:", error);
        }
    };

    // Função para editar um lote
    const handleEditarLote = (lote: Lote) => {
        setEditandoLote(lote);
        setNome(lote.nome);
        setDescricao(lote.descricao || "");
        setValor(lote.valor);
        setQuantidade(lote.quantidade);
    };

    // Função para excluir um lote
    const handleExcluirLote = async (id: number) => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/lotes/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Erro ao excluir lote");
            }

            const data = await response.json();
            console.log("Lote excluído com sucesso:", data);

            // Atualiza a lista de lotes após a exclusão
            fetchLotes();
        } catch (error) {
            console.error("Erro ao excluir lote:", error);
        }
    };

    return (
        <div className="w-full p-20 flex flex-col gap-10 bg-slate-900">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                    <label className="text-white">Nome: </label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        className="p-2 border border-gray-500 rounded text-black w-full"
                    />
                </div>
                <div>
                    <label className="text-white">Descrição: </label>
                    <input
                        type="text"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="p-2 border border-gray-500 rounded text-black w-full"
                    />
                </div>
                <div>
                    <label className="text-white">Valor: </label>
                    <input
                        type="number"
                        value={valor || ""}
                        onChange={(e) => setValor(e.target.value ? parseFloat(e.target.value) : 0)}
                        required
                        className="p-2 border border-gray-500 rounded text-black w-full"
                    />
                </div>
                <div>
                    <label className="text-white">Quantidade: </label>
                    <input
                        type="number"
                        value={quantidade || ""}
                        onChange={(e) => setQuantidade(e.target.value ? parseInt(e.target.value) : 0)}
                        required
                        className="p-2 border border-gray-500 rounded text-black w-full"
                    />
                </div>
                <button className="w-full bg-blue-600 p-2 rounded text-white" type="submit">
                    {editandoLote ? "Editar Lote" : "Salvar"}
                </button>
            </form>

            {/* Tabela de Lotes */}
            <div className="mt-10">
                <h2 className="text-white text-2xl font-bold mb-4">Lotes Criados</h2>
                <table className="w-full text-white border-collapse border border-gray-500">
                    <thead>
                        <tr>
                            <th className="border border-gray-500 p-2">Nome</th>
                            <th className="border border-gray-500 p-2">Descrição</th>
                            <th className="border border-gray-500 p-2">Valor</th>
                            <th className="border border-gray-500 p-2">Quantidade</th>
                            <th className="border border-gray-500 p-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lotes.map((lote) => (
                            <tr key={lote.id}>
                                <td className="border border-gray-500 p-2">{lote.nome}</td>
                                <td className="border border-gray-500 p-2">{lote.descricao}</td>
                                <td className="border border-gray-500 p-2">R$ {lote.valor.toFixed(2)}</td>
                                <td className="border border-gray-500 p-2">{lote.quantidade}</td>
                                <td className="border border-gray-500 p-2">
                                    <button
                                        onClick={() => handleEditarLote(lote)}
                                        className="bg-yellow-500 text-white p-1 rounded mr-2"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleExcluirLote(lote.id!)}
                                        className="bg-red-500 text-white p-1 rounded"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FormularioLote;