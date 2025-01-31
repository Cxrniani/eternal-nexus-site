// app/selecao-ingressos/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Lote {
    id: number;
    nome: string;
    descricao?: string;
    valor: number;
    quantidade: number;
}

const SelectionPage = () => {
    const router = useRouter();
    const [lotes, setLotes] = useState<Lote[]>([]);
    const [ticketLot, setTicketLot] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [paymentMethod, setPaymentMethod] = useState<string>("");

    // Busca os lotes da API
    const fetchLotes = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/lotes", {
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
            if (data.length > 0) {
                setTicketLot(data[0].id.toString()); // Seleciona o primeiro lote por padrão
            }
        } catch (error) {
            console.error("Erro ao buscar lotes:", error);
        }
    };

    // Busca os lotes ao carregar a página
    useEffect(() => {
        fetchLotes();
    }, []);

    const loteSelecionado = lotes.find((lote) => lote.id.toString() === ticketLot);
    const totalAmount = loteSelecionado ? loteSelecionado.valor * quantity : 0;

    const handleProceedToPayment = () => {
        if (!paymentMethod) {
            alert("Por favor, selecione uma forma de pagamento.");
            return;
        }

        // Redireciona para a página de pagamento com os parâmetros necessários
        router.push(
            `/payment?lot=${ticketLot}&quantity=${quantity}&method=${paymentMethod}&nome=${loteSelecionado?.nome}&valor=${loteSelecionado?.valor}`
        );
    };

    return (
        <div className="w-full h-auto bg-slate-950">
            <div className="max-container flex-row">
                <div className="flex w-full">
                    <div className="flex flex-col justify-center w-full">
                        <h1 className="pt-5 mx-auto md:py-5 text-5xl font-extrabold text-center text-white">
                            Checkout
                        </h1>
                        <div className="w-full flex justify-center">
                            <div className="w-full flex flex-col items-center">
                                <div className="relative w-full h-[60vh]">
                                    <Image
                                        src="https://placehold.co/1080x540.png"
                                        layout="fill"
                                        objectFit="contain"
                                        alt="Cover Ingresso Eternal Nexus"
                                    />
                                </div>
                                <h1 className="text-white text-4xl font-extrabold py-5">Selecione Seu Ingresso:</h1>

                                {/* Seleção de Lote */}
                                <div className="flex flex-col items-center gap-2 mb-4">
                                    <label className="text-white">Selecione o Lote:</label>
                                    <select
                                        value={ticketLot}
                                        onChange={(e) => setTicketLot(e.target.value)}
                                        className="p-2 border border-gray-500 rounded-sm text-black"
                                    >
                                        {lotes.map((lote) => (
                                            <option key={lote.id} value={lote.id}>
                                                {lote.nome} - R$ {lote.valor.toFixed(2)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Seletor de Quantidade */}
                                <div className="flex flex-col items-center gap-2 mb-4">
                                    <label className="text-white">Quantidade:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="p-2 border border-gray-500 rounded-sm text-black"
                                    />
                                </div>

                                {/* Valor Total */}
                                <div className="text-white text-lg font-bold mb-4">
                                    Valor Total: R$ {totalAmount.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        {/* Menu de seleção de método de pagamento */}
                        <div className="flex flex-col items-center gap-4 border-2 border-slate-500 py-10 w-full md:w-1/2 mx-auto">
                            <label className="flex flex-row gap-2 text-white items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === "card"}
                                    onChange={() => setPaymentMethod("card")}
                                />
                                <Image
                                    src="/credit-card.svg"
                                    width={30}
                                    height={30}
                                    alt="Cartão de Crédito"
                                />
                                Cartão de Crédito
                            </label>
                            <label className="flex flex-row gap-2 text-white items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="pix"
                                    checked={paymentMethod === "pix"}
                                    onChange={() => setPaymentMethod("pix")}
                                />
                                <Image 
                                    src="/pix.svg"
                                    width={30}
                                    height={30}
                                    alt="PIX"
                                />
                                Pagar com PIX
                            </label>
                        </div>

                        {/* Botão para prosseguir ao pagamento */}
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={handleProceedToPayment}
                                className="bg-blue-500 text-white p-2 rounded w-1/2"
                            >
                                Prosseguir para Pagamento
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectionPage;