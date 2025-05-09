"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/components/AuthContext";

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
    const {isAuthenticated, isLoading} = useAuth();

    useEffect(() => {
        if (isLoading) return; // Se ainda está carregando, não faz nada
    
        if (!isAuthenticated) {
            router.push("/login");
        } else {
            fetchLotes();
        }
        
    }, [isAuthenticated, isLoading, router]);
    
    if (isLoading) {
        return <div className="text-white text-center">Carregando...</div>;
    }

    // Busca os lotes da API
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
            if (data.length > 0) {
                setTicketLot(data[0].id.toString()); // Seleciona o primeiro lote por padrão
            }
        } catch (error) {
            console.error("Erro ao buscar lotes:", error);
        }
    };

    const loteSelecionado = lotes.find((lote) => lote.id.toString() === ticketLot);
    const tax = loteSelecionado ? loteSelecionado.valor * 0.08 : 0;
    const totalAmount = loteSelecionado ? (Number(loteSelecionado.valor) + Number(tax) ) * quantity : 0;

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

    // Se ainda estiver carregando ou não autenticado, não renderiza nada
    if (isLoading) {
        return null; // Ou um spinner de carregamento
    }

    return (
        <div className="w-full pb-10 h-auto bg-zinc-900">
            <div className="max-container flex-row">
                <div className="flex w-full">
                    <div className="flex flex-col justify-center w-full">
                        <h1 className="pt-5 mx-auto mt-2 text-5xl font-extrabold text-center text-white">
                            Checkout
                        </h1>
                        <div className="w-full flex justify-center">
                            <div className="w-full flex flex-col items-center">
                                <div className="mt-[-350px] md:mt-[-25px] relative w-[98%] md:w-full h-[70vh] mb-5 overflow-hidden">
                                    <Image
                                        src="/assets/background.png"
                                        layout="fill"
                                        objectPosition="bottom"
                                        alt="Cover Ingresso Eternal Nexus"
                                        className="object-contain md:object-cover md:translate-y-[10%]" // Ajuste a porcentagem conforme necessário
                                    />
                                </div>
                                <h1 className="text-white text-4xl font-extrabold text-center mx-auto py-5">Selecione Seu Ingresso:</h1>

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
                                                {lote.nome} - R$ {Number(lote.valor).toFixed(2)}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-zinc-400">+ R$ {tax.toFixed(2)} de Taxa de Serviço</p>
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