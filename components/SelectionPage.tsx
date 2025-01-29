"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const TICKET_PRICE = 37.80; // Valor unitário do ingresso

const SelectionPage = () => {
    const router = useRouter();
    const [ticketLot, setTicketLot] = useState<string>("1"); // Estado para o lote do ingresso
    const [quantity, setQuantity] = useState<number>(1); // Estado para a quantidade de ingressos
    const [paymentMethod, setPaymentMethod] = useState<string>(""); // Estado para o método de pagamento selecionado
    const totalAmount = TICKET_PRICE * quantity; // Valor total calculado

    const handleProceedToPayment = () => {
        if (!paymentMethod) {
            alert("Por favor, selecione uma forma de pagamento.");
            return;
        }

        // Redireciona para a página de pagamento com os parâmetros necessários
        router.push(`/payment?lot=${ticketLot}&quantity=${quantity}&method=${paymentMethod}`);
    };

    return (
        <div className="w-full h-auto bg-slate-950">
            <div className="max-container py-5 flex-row">
                <div className="flex w-full">
                    <div className="flex flex-col justify-center w-full">
                        <h1 className="py-5 text-2xl font-extrabold text-center text-white">
                            Checkout Ingresso
                        </h1>
                        <div className="flex justify-center py-5">
                            <div className="flex flex-col items-center">
                                <div className="relative w-[100vh] h-80">
                                    <Image
                                        src="/assets/concert-dance-disco-dubstep-wallpaper-preview.jpg"
                                        layout="fill"
                                        objectFit="cover"
                                        alt="Ingresso Eternal Nexus"
                                    />
                                </div>
                                <h1 className="text-white text-2xl font-extrabold py-5">Ingresso Eternal Nexus</h1>

                                {/* Seleção de Lote */}
                                <div className="flex flex-col items-center gap-2 mb-4">
                                    <label className="text-white">Selecione o Lote:</label>
                                    <select
                                        value={ticketLot}
                                        onChange={(e) => setTicketLot(e.target.value)}
                                        className="p-2 border border-gray-500 rounded-sm text-black"
                                    >
                                        <option value="1">1º Lote</option>
                                        <option value="2">2º Lote</option>
                                        <option value="3">3º Lote</option>
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