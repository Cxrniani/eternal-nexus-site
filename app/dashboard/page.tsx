"use client";

import { useAuth } from "@/components/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Estados para armazenar dados do usuário e tickets
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se a checagem de autenticação já foi concluída e o usuário não está autenticado,
    // redirecione para a tela de login.
    if (isAuthenticated === false) {
      router.push("/login");
      return;
    }
    
    // Se ainda não sabemos se o usuário está autenticado ou o usuário ainda não foi definido,
    // não faça nada (mantém o loading).
    if (!isAuthenticated || !user) return;

    // Quando o usuário estiver definido e autenticado, extraia os dados dele.
    if (user && user.UserAttributes) {
      const emailAttr = user.UserAttributes.find((attr: any) => attr.Name === "email");
      const nameAttr = user.UserAttributes.find((attr: any) => attr.Name === "name");
      setEmail(emailAttr?.Value || null);
      setName(nameAttr?.Value || null);

      // Supondo que o ID do usuário esteja no atributo "sub"
      const userIdAttr = user.UserAttributes.find((attr: any) => attr.Name === "sub");
      if (userIdAttr) {
        const userId = userIdAttr.Value;

        const fetchTickets = async () => {
          try {
            // Implementa um timeout para evitar que o fetch fique pendente indefinidamente
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`http://127.0.0.1:3000/user_tickets/${userId}`, {
              signal: controller.signal,
            });
            clearTimeout(timeout);

            if (!response.ok) {
              throw new Error("Erro na resposta da API");
            }

            const data = await response.json();
            setTickets(data);
          } catch (error) {
            console.error("Erro ao buscar tickets:", error);
          } finally {
            setLoading(false);
          }
        };

        fetchTickets();
      } else {
        console.error("ID do usuário não encontrado.");
        setLoading(false);
      }
    }
  }, [isAuthenticated, user, router]);

  // Enquanto a autenticação não estiver concluída, o usuário não estiver disponível
  // ou os dados ainda estiverem sendo buscados, exibe uma tela de carregamento.
  if (!isAuthenticated || !user || loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  // Se chegou até aqui, a autenticação foi concluída, o usuário está definido e os dados foram carregados
  return (
    <div className="min-h-screen pb-5 bg-zinc-900 text-white">
      <div className="flex flex-col max-container">
        <h1 className="text-5xl md:text-6xl p-3 md:px-0 font-extrabold text-center font-logoSuave border-zinc-500 rounded my-5 border py-10">
          Painel de Ingressos
        </h1>
        <h1 className="text-3xl md:text-4xl p-3 md:px-0 font-bold font-logoSuave text-center">
          Bem-vindo, {name || "Usuário"}!
        </h1>
        <div className="mt-6">
          <h2 className="text-2xl md:text-3xl text-center py-5 font-logoSuave font-bold">
            Seus Ingressos
          </h2>
          {tickets.length > 0 ? (
            <ul className="flex flex-col px-3 md:px-0 justify-center space-y-4">
              {tickets.map((ticket) => (
                <li
                  key={ticket.code}
                  className="pt-5 border-2 bg-zinc-800 md:w-1/3 flex flex-col text-center items-center mx-auto border-gray-700 rounded-lg"
                >
                  <p className="text-3xl px-20 text-center font-bold font-logoSuave pb-1">
                    ETERNAL NEXUS
                  </p>
                  <p className="text-xl px-20 text-center text-gray-400 font-semibold pb-1">
                    16/03 até 17/03
                  </p>
                  <div className="relative w-full rounded-3xl mb-2 h-[30vh] md:h-60">
                    <Image
                      src="/assets/background.png"
                      layout="fill"
                      objectFit="cover"
                      alt="Cover Ingresso Eternal Nexus"
                      className=" mx-auto"
                    />
                  </div>
                  <p className="text-gray-200 text-xl pt-5 font-semibold pb-5">Valor: {Number(ticket.price).toFixed(2)}
                    <br/>Lote: {ticket.lot}
                  </p>
                  <p className="text-gray-200 text-2xl pt-5 font-semibold pb-5">
                    Código do Ingresso:
                    <br />
                    <span className="text-4xl text-red-500">{ticket.code}</span>
                  </p>
                  <p className="text-md text-gray-400">
                    Nome: {ticket.name}
                    <br />
                    CPF: {ticket.cpf}
                  </p>
                  <div className="pb-2">
                    <div className="p-2 bg-white rounded-lg inline-block">
                      <QRCodeSVG
                        value={ticket.code}
                        size={128}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="Q"
                      />
                    </div>
                  </div>
                  <div className="relative w-full bg-preto-opaco py-2 rounded-b-xl">
                    <Image
                      src="abstract.svg"
                      height={1500}
                      width={120}
                      alt="Cover Ingresso Eternal Nexus"
                      className="mx-auto"
                    />
                    <p className="text-xl mx-20 font-thin">
                      Powered by: <span className="font-extrabold">Synopsy®</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum ticket encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
