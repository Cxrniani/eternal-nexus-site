"use client";

import React, { useEffect, useState } from "react";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { useSearchParams, useRouter } from "next/navigation";

const mpPublicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;

const PaymentPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [mp, setMp] = useState<any>(null);
    const [pixCode, setPixCode] = useState<string | null>(null); // Estado para armazenar o código PIX
    const [qrCodeImage, setQrCodeImage] = useState<string | null>(null); // Estado para armazenar o QR Code
    const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutos em segundos
    const [isExpired, setIsExpired] = useState<boolean>(false); // Estado para verificar se o tempo expirou
    const ticketLot = searchParams.get("lot");
    const quantity = Number(searchParams.get("quantity"));
    const paymentMethod = searchParams.get("method");
    const totalAmount = 37.80 * quantity; // Valor total calculado

    // Função para copiar o código PIX
    const copyPixCode = () => {
        if (pixCode) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(pixCode)
                    .then(() => {
                        alert("Código PIX copiado para a área de transferência!");
                    })
                    .catch((error) => {
                        console.error("Erro ao copiar o código PIX:", error);
                        alert("Erro ao copiar o código PIX. Tente novamente.");
                    });
            } else {
                // Fallback para navegadores que não suportam a API clipboard
                const textArea = document.createElement("textarea");
                textArea.value = pixCode;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand("copy");
                    alert("Código PIX copiado para a área de transferência!");
                } catch (error) {
                    console.error("Erro ao copiar o código PIX:", error);
                    alert("Erro ao copiar o código PIX. Tente novamente.");
                } finally {
                    document.body.removeChild(textArea);
                }
            }
        }
    };

    // Função para formatar o tempo restante em MM:SS
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    };

    // Efeito para o timer
    useEffect(() => {
        if (timeLeft > 0 && qrCodeImage) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);

            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setIsExpired(true); // Tempo expirado
            setQrCodeImage(null); // Remove o QR Code
            setPixCode(null); // Remove o código PIX
        }
    }, [timeLeft, qrCodeImage]);

    // Verifica se os parâmetros necessários estão presentes
    useEffect(() => {
        if (!ticketLot || !quantity || !paymentMethod) {
            alert("Por favor, selecione o lote, a quantidade e a forma de pagamento.");
            router.push("/selection"); // Redireciona para a página de seleção
        }
    }, [ticketLot, quantity, paymentMethod, router]);

    // Lógica para inicializar o SDK do Mercado Pago (pagamento com cartão)
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
                            Checkout - {quantity}x Ingresso {ticketLot}º Lote <br />Total: R$ {totalAmount.toFixed(2)}
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
                                    onSubmit={async (event) => {
                                        event.preventDefault();

                                        const pixData = {
                                            cardholderEmail: (document.getElementById("pix-email") as HTMLInputElement).value,
                                            identificationNumber: (document.getElementById("pix-cpf") as HTMLInputElement).value,
                                            identificationType: "CPF",
                                            transaction_amount: totalAmount,
                                            firstName: (document.getElementById("pix-name") as HTMLInputElement).value.split(" ")[0],
                                            lastName: (document.getElementById("pix-name") as HTMLInputElement).value.split(" ").slice(1).join(" "),
                                        };

                                        try {
                                            const response = await fetch("http://127.0.0.1:5000/process_payment_pix", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify(pixData),
                                            });

                                            const result = await response.json();

                                            if (result.success) {
                                                if (result.status === "pending") {
                                                    alert("Pagamento PIX gerado com sucesso! Escaneie o QR Code ou copie o código PIX para concluir o pagamento.");

                                                    // Exibir o QR Code na tela
                                                    setQrCodeImage(`data:image/png;base64,${result.pix_qr_code_base64}`);

                                                    // Exibir o código PIX copia e cola
                                                    setPixCode(result.pix_copia_cola);

                                                    // Iniciar o timer de 5 minutos
                                                    setTimeLeft(300);
                                                    setIsExpired(false);
                                                }
                                            } else {
                                                alert(`Erro no pagamento PIX: ${result.error}`);
                                            }
                                        } catch (error) {
                                            console.error("Erro na requisição:", error);
                                            alert("Ocorreu um erro ao processar o pagamento PIX. Tente novamente.");
                                        }
                                    }}
                                >
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

                                    {/* Container para o QR Code */}
                                    {qrCodeImage && !isExpired && (
                                        <div id="pix-qr-code-container" className="flex justify-center flex-col items-center">
                                            <p className="text-white mb-2">Tempo restante: {formatTime(timeLeft)}</p>
                                            <img
                                                src={qrCodeImage}
                                                alt="QR Code PIX"
                                                style={{ width: "200px", height: "200px" }}
                                            />
                                        </div>
                                    )}

                                    {/* Container para o código PIX copia e cola */}
                                    {pixCode && !isExpired && (
                                        <div id="pix-copia-cola-container" className="mt-4">
                                            <div className="mt-4">
                                                <p className="text-white">Código PIX (copia e cola):</p>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        id="pix-copia-cola"
                                                        value={pixCode}
                                                        readOnly
                                                        className="w-full p-2 border text-black border-gray-500 rounded-sm"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={copyPixCode}
                                                        className="bg-blue-500 text-white p-2 rounded"
                                                    >
                                                        Copiar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Mensagem de tempo expirado */}
                                    {isExpired && (
                                        <div className="mt-4 text-center text-red-500">
                                            <p>O tempo para realizar o pagamento PIX expirou. Por favor, gere um novo QR Code.</p>
                                        </div>
                                    )}
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