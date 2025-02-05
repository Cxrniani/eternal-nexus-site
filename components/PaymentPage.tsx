"use client";

import React, { useEffect, useState } from "react";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

const mpPublicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, accessToken } = useAuth(); // Adicionar accessToken aqui
  const [mp, setMp] = useState<any>(null);
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const ticketLot = searchParams.get("lot");
  const quantity = Number(searchParams.get("quantity"));
  const paymentMethod = searchParams.get("method");
  const nomeLote = searchParams.get("nome");
  const valorLote = Number(searchParams.get("valor"));


  const userID = user?.UserAttributes[3]?.Value;
  const userNome = user?.UserAttributes[2]?.Value;

  console.log("lote: ", nomeLote);
  console.log("valor: ", valorLote - (valorLote * 0.080));
  console.log("usuario: ", userID);
  console.log("id usuario: ", userNome);

  const totalAmount = (valorLote + (valorLote * 0.08)) * quantity; // Valor total calculado
  console.log("total: ", totalAmount);

  // Função para copiar o código PIX
  const copyPixCode = () => {
    if (pixCode) {
      navigator.clipboard
        .writeText(pixCode)
        .then(() => alert("Código PIX copiado para a área de transferência!"))
        .catch(() => alert("Erro ao copiar o código PIX. Tente novamente."));
    }
  };

  // Função para formatar o tempo restante
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Efeito para o timer
  useEffect(() => {
    if (timeLeft > 0 && qrCodeImage) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsExpired(true);
      setQrCodeImage(null);
      setPixCode(null);
    }
  }, [timeLeft, qrCodeImage]);

  // Verifica se os parâmetros necessários estão presentes
  useEffect(() => {
    if (!ticketLot || !quantity || !paymentMethod || !nomeLote || !valorLote) {
      alert(
        "Por favor, selecione o lote, a quantidade e a forma de pagamento."
      );
      router.push("/selection");
    }
  }, [ticketLot, quantity, paymentMethod, nomeLote, valorLote, router]);

  // Função para buscar dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!accessToken) {
          throw new Error("Token não encontrado");
        }

        console.log("Token encontrado:", accessToken);

        const response = await fetch("http://127.0.0.1:3000/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao obter informações do usuário");
        }

        const data = await response.json();
        console.log("Dados do usuário recebidos:", data);

        const userAttributes = data.data.UserAttributes;
        const emailAttr = userAttributes.find(
          (attr: any) => attr.Name === "email"
        );
        const nameAttr = userAttributes.find(
          (attr: any) => attr.Name === "name"
        );

        if (emailAttr) {
          setEmail(emailAttr.Value);
          console.log("Email definido:", emailAttr.Value);
        }
        if (nameAttr) {
          setName(nameAttr.Value);
          console.log("Nome definido:", nameAttr.Value);
        }
      } catch (error) {
        console.error(error);
        // Redirecionar para a página de login se houver um erro
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router, accessToken]);

  // Lógica para inicializar o SDK do Mercado Pago (pagamento com cartão)
  useEffect(() => {
    if (paymentMethod === "card" && !loading) {
      const initializeMercadoPagoSDK = async () => {
        try {
          await loadMercadoPago();
          const mercadoPago = new window.MercadoPago(mpPublicKey);
          setMp(mercadoPago);

          const cardForm = mercadoPago.cardForm({
            amount: totalAmount.toString(),
            iframe: true,
            form: {
              id: "form-checkout",
              cardholderName: {
                id: "form-checkout__cardholderName",
                placeholder: "Titular do cartão",
                value: name, // Preencher com o nome do usuário
              },
              cardholderEmail: {
                id: "form-checkout__cardholderEmail",
                placeholder: "E-mail",
                value: email, // Preencher com o e-mail do usuário
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
                if (error)
                  return console.error("Erro ao montar formulário:", error);
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

                if (
                  !token ||
                  !paymentMethodId ||
                  !issuerId ||
                  !installments ||
                  !identificationNumber ||
                  !identificationType ||
                  !cardholderEmail
                ) {
                  alert("Por favor, preencha todos os campos corretamente.");
                  return;
                }

                const paymentData = {
                  token,
                  paymentMethodId,
                  issuerId,
                  installments: Number(installments),
                  identificationNumber,
                  identificationType,
                  cardholderEmail,
                  transaction_amount: totalAmount,
                  ticketLot,
                  quantity,
                  user_id: userID, // Certifique-se de que o user_id está sendo passado
                  name: userNome,
                  lot: nomeLote,
                  price: parseFloat(valorLote.toFixed(2)),
                  event_id: "etternal-nexus",
                  application_fee: parseFloat(((totalAmount - (totalAmount * 0.0498)) * 0.0255).toFixed(2)),
                };



                fetch("http://127.0.0.1:3000/process_payment", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`, // Usar o token do AuthContext
                  },
                  body: JSON.stringify(paymentData),
                })
                  .then((response) => response.json())
                  .then((result) => {
                    if (result.success) {
                      if (result.status === "approved") {
                        alert(
                          "Pagamento aprovado! Redirecionando para a página de confirmação..."
                        );
                        window.location.href = "pagamento-aprovado";
                      } else if (
                        result.status === "in_process" ||
                        result.status === "pending"
                      ) {
                        alert(
                          "Seu pagamento está em processamento. Você receberá uma confirmação por e-mail."
                        );
                        window.location.href = "/pagamento-pendente";
                      }
                    } else {
                      if (result.status === "rejected") {
                        alert(
                          "Pagamento rejeitado. Por favor, tente novamente com outro método de pagamento."
                        );
                      } else {
                        alert(`Erro no pagamento: ${result.error}`);
                      }
                    }
                  })
                  .catch((error) => {
                    console.error("Erro na requisição:", error);
                    alert(
                      "Ocorreu um erro ao processar o pagamento. Tente novamente."
                    );
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
  }, [
    paymentMethod,
    totalAmount,
    ticketLot,
    quantity,
    user,
    loading,
    name,
    email,
    accessToken,
  ]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  console.log("Renderizando PaymentPage com email:", email);
  console.log("Renderizando PaymentPage com nome:", name);

  return (
    <div className="w-full h-auto bg-slate-950">
      <div className="max-container py-5 flex-row">
        <div className="flex w-full">
          <div className="flex flex-col justify-center w-full">
            <h1 className="py-5 text-2xl font-extrabold text-center text-white">
              Checkout - {quantity}x Ingresso {nomeLote} <br />
              Total: R$ {totalAmount.toFixed(2)}
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
                    value={name} // Preencher com o nome do usuário
                    onChange={(e) => setName(e.target.value)}
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
                    value={email} // Preencher com o e-mail do usuário
                    onChange={(e) => setEmail(e.target.value)}
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
                      cardholderEmail: (
                        document.getElementById("pix-email") as HTMLInputElement
                      ).value,
                      identificationNumber: (
                        document.getElementById("pix-cpf") as HTMLInputElement
                      ).value,
                      identificationType: "CPF",
                      transaction_amount: totalAmount,
                      firstName: (
                        document.getElementById("pix-name") as HTMLInputElement
                      ).value.split(" ")[0],
                      lastName: (
                        document.getElementById("pix-name") as HTMLInputElement
                      ).value
                        .split(" ")
                        .slice(1)
                        .join(" "),
                      user_id: userID,// Certifique-se de que o user_id está sendo passado
                      name: userNome,
                      lot: nomeLote,
                      price: parseFloat(valorLote.toFixed(2)),
                      event_id: "etternal-nexus",
                      application_fee: parseFloat(((totalAmount - (totalAmount * 0.0498)) * 0.0255).toFixed(2)), // Usando o ID do usuário logado
                    };

                    try {
                      const response = await fetch(
                        "http://127.0.0.1:5000/process_payment_pix",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(pixData),
                        }
                      );

                      const result = await response.json();

                      if (result.success) {
                        if (result.status === "pending") {
                          alert(
                            "Pagamento PIX gerado com sucesso! Escaneie o QR Code ou copie o código PIX para concluir o pagamento."
                          );

                          setQrCodeImage(
                            `data:image/png;base64,${result.pix_qr_code_base64}`
                          );
                          setPixCode(result.pix_copia_cola);
                          setTimeLeft(300);
                          setIsExpired(false);
                        }
                      } else {
                        alert(`Erro no pagamento PIX: ${result.error}`);
                      }
                    } catch (error) {
                      console.error("Erro na requisição:", error);
                      alert(
                        "Ocorreu um erro ao processar o pagamento PIX. Tente novamente."
                      );
                    }
                  }}
                >
                  <input
                    type="text"
                    id="pix-name"
                    className="w-full p-2 border text-black border-gray-500 rounded-sm"
                    placeholder="Nome Completo"
                    value={name} // Preencher com o nome do usuário
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="email"
                    id="pix-email"
                    className="w-full p-2 border text-black border-gray-500 rounded-sm"
                    placeholder="E-mail"
                    value={email} // Preencher com o e-mail do usuário
                    onChange={(e) => setEmail(e.target.value)}
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
                    <div
                      id="pix-qr-code-container"
                      className="flex justify-center flex-col items-center"
                    >
                      <p className="text-white mb-2">
                        Tempo restante: {formatTime(timeLeft)}
                      </p>
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
                      <p>
                        O tempo para realizar o pagamento PIX expirou. Por
                        favor, gere um novo QR Code.
                      </p>
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
