"use client";

import React, { useEffect, useState } from "react";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { useSearchParams, useRouter } from "next/navigation";

const mpPublicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;

const PaymentPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [mp, setMp] = useState<any>(null);
    const ticketLot = searchParams.get("lot");
    const quantity = Number(searchParams.get("quantity"));
    const paymentMethod = searchParams.get("method");
    const totalAmount = 37.80 * quantity; // Valor total calculado

    // Verifica se os parâmetros necessários estão presentes
    useEffect(() => {
        if (!ticketLot || !quantity || !paymentMethod) {
            alert("Por favor, selecione o lote, a quantidade e a forma de pagamento.");
            router.push("/selection"); // Redireciona para a página de seleção
        }
    }, [ticketLot, quantity, paymentMethod, router]);

    useEffect(() => {
        if (paymentMethod === "card") {
            const initializeMercadoPagoSDK = async () => {
                try {
                    await loadMercadoPago();
                    const mercadoPago = new window.MercadoPago(mpPublicKey);
                    setMp(mercadoPago);

                    const cardForm = mercadoPago.cardForm({
                        amount: totalAmount.toString(), // Valor do pagamento
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
                                if (error) return (console.error("Erro ao montar formulário:", error), alert("Erro ao montar formulário. Tente novamente."));
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

                                // Validação dos campos obrigatórios
                                if (!token || !paymentMethodId || !issuerId || !installments || !identificationNumber || !identificationType || !cardholderEmail) {
                                    alert("Por favor, preencha todos os campos corretamente.");
                                    return;
                                }

                                // Dados para enviar ao back-end
                                const paymentData = {
                                    token,
                                    paymentMethodId,
                                    issuerId,
                                    installments: Number(installments),
                                    identificationNumber,
                                    identificationType,
                                    cardholderEmail,
                                    transaction_amount: totalAmount, // Valor total
                                    ticketLot, // Lote do ingresso
                                    quantity, // Quantidade de ingressos
                                };

                                // Envia a requisição para o back-end
                                fetch("http://127.0.0.1:5000/process_payment", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(paymentData),
                                })
                                    .then((response) => response.json())
                                    .then((result) => {
                                        if (result.success) {
                                            // Tratamento dos status de sucesso
                                            if (result.status === "approved") {
                                                alert("Pagamento aprovado! Redirecionando para a página de confirmação...");
                                                window.location.href = "/payment/pagamento-aprovado"; // Redireciona para a página de pagamento aprovado
                                            } else if (result.status === "in_process" || result.status === "pending") {
                                                alert("Seu pagamento está em processamento. Você receberá uma confirmação por e-mail.");
                                                window.location.href = "/payment/pagamento-em-analise"; // Redireciona para a página de pagamento em análise
                                            }
                                        } else {
                                            // Tratamento de erros
                                            if (result.status === "rejected") {
                                                alert("Pagamento rejeitado. Por favor, tente novamente com outro método de pagamento.");
                                            } else {
                                                alert(`Erro no pagamento: ${result.error}`);
                                            }
                                        }
                                    })
                                    .catch((error) => {
                                        console.error("Erro na requisição:", error);
                                        alert("Ocorreu um erro ao processar o pagamento. Tente novamente.");
                                    });
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
        }
    }, [paymentMethod, totalAmount, ticketLot, quantity]);

    return (
        <div className="w-full h-auto bg-slate-950">
            <div className="max-container py-5 flex-row">
                <div className="flex w-full">
                    <div className="flex flex-col justify-center w-full">
                        <h1 className="py-5 text-2xl font-extrabold text-center text-white">
                            Pagamento
                        </h1>

                        {/* Formulário de cartão */}
                        {paymentMethod === "card" && (
                            <div>
                                <form
                                    id="form-checkout"
                                    className="flex flex-col space-y-4 px-4 md:px-[25%] mt-4"
                                >
                                    {/* Campos do formulário */}
                                    <div
                                        id="form-checkout__cardNumber"
                                        className="text-black w-full h-12 border bg-white border-gray-500 rounded-sm p-2"
                                    ></div>
                                    <div className="flex justify-start gap-5">
                                        <div
                                            id="form-checkout__expirationDate"
                                            className="w-[100px] text-black h-12 border bg-white border-gray-500 rounded-sm p-2"
                                        ></div>
                                        <div
                                            id="form-checkout__securityCode"
                                            className="w-[100px] h-12 border bg-white text-black border-gray-500 rounded-sm p-2"
                                        ></div>
                                    </div>
                                    <input
                                        type="text"
                                        id="form-checkout__cardholderName"
                                        className="w-full p-2 border text-black border-gray-500 rounded-sm"
                                        placeholder="Nome do Titular"
                                    />
                                    <select
                                        id="form-checkout__issuer"
                                        className="w-full p-2 border border-gray-500 rounded-sm text-black"
                                    ></select>
                                    <select
                                        id="form-checkout__installments"
                                        className="w-full p-2 border border-gray-500 rounded-sm text-black"
                                    ></select>
                                    <select
                                        id="form-checkout__identificationType"
                                        className="w-full p-2 border border-gray-500 rounded-sm text-black"
                                    ></select>
                                    <input
                                        type="text"
                                        id="form-checkout__identificationNumber"
                                        className="w-full p-2 border border-gray-500 text-black rounded-sm"
                                        placeholder="Número de Identificação"
                                    />
                                    <input
                                        type="email"
                                        id="form-checkout__cardholderEmail"
                                        className="w-full p-2 border text-black border-gray-500 rounded-sm"
                                        placeholder="Email"
                                    />

                                    <div className="py-5">
                                        <button
                                            type="submit"
                                            id="form-checkout__submit"
                                            className="bg-blue-500 text-white p-2 rounded w-full"
                                        >
                                            Finalizar Compra
                                        </button>
                                    </div>
                                    <progress
                                        value="0"
                                        className="progress-bar w-full h-2 opacity-0"
                                    >
                                        Carregando...
                                    </progress>
                                </form>
                            </div>
                        )}

                        {/* Formulário de PIX */}
                        {paymentMethod === "pix" && (
                            <div>
                                <form
                                    id="form-pix"
                                    className="flex flex-col space-y-4 px-4 md:px-[25%] mt-4"
                                >
                                    {/* Campos do formulário de PIX */}
                                    <input
                                        type="text"
                                        id="pix-name"
                                        className="w-full p-2 border text-black border-gray-500 rounded-sm"
                                        placeholder="Nome Completo"
                                    />
                                    <input
                                        type="email"
                                        id="pix-email"
                                        className="w-full p-2 border text-black border-gray-500 rounded-sm"
                                        placeholder="E-mail"
                                    />
                                    <input
                                        type="text"
                                        id="pix-cpf"
                                        className="w-full p-2 border text-black border-gray-500 rounded-sm"
                                        placeholder="CPF"
                                    />

                                    <div className="py-5">
                                        <button
                                            type="submit"
                                            className="bg-blue-500 text-white p-2 rounded w-full"
                                        >
                                            Gerar QR Code PIX
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;