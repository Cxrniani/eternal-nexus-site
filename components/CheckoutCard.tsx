"use client";

import React, { useEffect, useState } from "react";
import { loadMercadoPago } from "@mercadopago/sdk-js";

const CheckoutCard = () => {
    const [mp, setMp] = useState<any>(null);

    useEffect(() => {
        const initializeMercadoPagoSDK = async () => {
            try {
                await loadMercadoPago();
                const mercadoPago = new window.MercadoPago('TEST-9bbc8e88-6a0d-48ed-b0a2-35b801ad1a56');
                setMp(mercadoPago);

                const cardForm = mercadoPago.cardForm({
                    amount: "37.80", // Valor do pagamento
                    iframe: true,
                    form: {
                        id: "form-checkout",
                        cardholderName: {
                            id: "form-checkout__cardholderName",
                            placeholder: "Titular do cartão",
                        },
                        cardholderEmail: {
                            id: "form-checkout__cardholderEmail",
                            placeholder: "E-mail",
                        },
                        cardNumber: {
                            id: "form-checkout__cardNumber",
                            placeholder: "Número do cartão",
                        },
                        securityCode: {
                            id: "form-checkout__securityCode",
                            placeholder: "CVV",
                        },
                        installments: {
                            id: "form-checkout__installments",
                            placeholder: "Parcelas",
                        },
                        issuer: {
                            id: "form-checkout__issuer",
                            placeholder: "Banco emissor",
                        },
                        expirationDate: {
                            id: "form-checkout__expirationDate",
                            placeholder: "MM/AA",
                        },
                        identificationType: {
                            id: "form-checkout__identificationType",
                            placeholder: "Tipo de documento",
                        },
                        identificationNumber: {
                            id: "form-checkout__identificationNumber",
                            placeholder: "Número do documento",
                        },
                    },
                    callbacks: {
                        onFormMounted: (error: Error | undefined) => {
                            if (error) return console.error("Erro ao montar formulário:", error);
                            console.log("Formulário montado com sucesso!");
                        },
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();

                            const {
                                token,
                                paymentMethodId,
                                issuerId,
                                installments,
                                identificationNumber,
                                identificationType,
                                cardholderEmail,
                            } = cardForm.getCardFormData();

                            if (!token || !paymentMethodId || !issuerId || !installments || !identificationNumber || !identificationType || !cardholderEmail) {
                                console.error("Um ou mais campos estão faltando ou inválidos.");
                                return;
                            }

                            fetch("http://127.0.0.1:5000/process_payment", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    token,
                                    paymentMethodId,
                                    issuerId,
                                    installments: Number(installments),
                                    identificationNumber,
                                    identificationType,
                                    cardholderEmail,
                                    transaction_amount: 37.80, // Exemplo: valor da transação
                                }),
                            })
                                .then((response) => response.json())
                                .then((result) => {
                                    if (result.success) {
                                        console.log("Pagamento realizado com sucesso!");
                                        console.log("Dados do pagamento:", result.payment);
                                    } else {
                                        console.error("Erro no pagamento:", result.error);
                                        console.log("Detalhes:", result.payment || {});
                                    }
                                })
                                .catch((error) => console.error("Erro na requisição:", error));
                        },
                        onFetching: (resource: string) => {
                            console.log("Recurso sendo buscado:", resource);
                            const progressBar = document.querySelector(".progress-bar");
                            progressBar?.setAttribute("value", "50");
                            return () => {
                                progressBar?.setAttribute("value", "0");
                            };
                        },
                    },
                });
            } catch (error) {
                console.error("Erro ao inicializar o SDK do Mercado Pago:", error);
            }
        };

        initializeMercadoPagoSDK();
    }, []);

    return (
        <div className="plus-container h-[80vh] bg-slate-950 my-10 rounded-xl">
            <div className="max-container py-5 flex-row">
                <div className="flex w-full">
                    <div className="w-1/2 p-4 flex flex-col">
                        <h1 className="py-5 text-2xl font-extrabold text-white">
                            Checkout Pagamento
                        </h1>
                        <form id="form-checkout"
                            className="flex flex-col max-w-[600px] space-y-4">
                            <div
                                id="form-checkout__cardNumber"
                                className="text-black h-8 border bg-white border-gray-500 rounded-sm p-2"
                            ></div>
                            <div
                                id="form-checkout__expirationDate"
                                className="text-black h-8 border bg-white border-gray-500 rounded-sm p-2"
                            ></div>
                            <div
                                id="form-checkout__securityCode"
                                className="container h-8 border bg-white text-black border-gray-500 rounded-sm p-2"
                            ></div>
                            <input
                                type="text"
                                id="form-checkout__cardholderName"
                                className="p-2 border text-black border-gray-500 rounded-sm"
                                placeholder="Nome do Titular"
                            />
                            <select id="form-checkout__issuer"
                                className="p-2 border border-gray-500 rounded-sm text-black"></select>
                            <select id="form-checkout__installments"
                                className="p-2 border border-gray-500 rounded-sm text-black"></select>
                            <select
                                id="form-checkout__identificationType"
                                className="p-2 border border-gray-500 rounded-sm text-black"
                            ></select>
                            <input
                                type="text"
                                id="form-checkout__identificationNumber"
                                className="p-2 border border-gray-500 text-black rounded-sm"
                                placeholder="Número de Identificação"
                            />
                            <input
                                type="email"
                                id="form-checkout__cardholderEmail"
                                className="p-2 border text-black border-gray-500 rounded-sm"
                                placeholder="Email"
                            />

                            <button
                                type="submit"
                                id="form-checkout__submit"
                                className="bg-blue-500 text-white p-2 rounded">
                                Pagar
                            </button>
                            <progress
                                value="0"
                                className="progress-bar w-full h-2">
                                Carregando...
                            </progress>
                        </form>
                    </div>
                    <div className="w-1/2 p-4"></div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutCard;