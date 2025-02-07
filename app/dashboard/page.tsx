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
  const [birthdate, setBirthdate] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("tickets"); // Estado para controlar a visualização atual

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
      const emailAttr = user.UserAttributes.find(
        (attr: any) => attr.Name === "email"
      );
      const nameAttr = user.UserAttributes.find(
        (attr: any) => attr.Name === "name"
      );
      const birthdateAttr = user.UserAttributes.find(
        (attr: any) => attr.Name === "birthdate"
      );
      const genderAttr = user.UserAttributes.find(
        (attr: any) => attr.Name === "gender"
      );
      const phoneAttr = user.UserAttributes.find(
        (attr: any) => attr.Name === "phone_number"
      );
      const addressAttr = user.UserAttributes.find(
        (attr: any) => attr.Name === "address"
      );
      setEmail(emailAttr?.Value || null);
      setName(nameAttr?.Value || null);
      setBirthdate(birthdateAttr?.Value || null);
      setGender(genderAttr?.Value || null);
      setPhoneNumber(phoneAttr?.Value || null);
      setAddress(addressAttr?.Value || null);

      // Supondo que o ID do usuário esteja no atributo "sub"
      const userIdAttr = user.UserAttributes.find(
        (attr: any) => attr.Name === "sub"
      );
      if (userIdAttr) {
        const userId = userIdAttr.Value;

        const fetchTickets = async () => {
          try {
            // Implementa um timeout para evitar que o fetch fique pendente indefinidamente
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(
              `http://127.0.0.1:3000/user_tickets/${userId}`,
              {
                signal: controller.signal,
              }
            );
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

  // Função para alternar entre as visualizações
  const handleViewChange = (newView: string) => {
    setView(newView);
  };

  // Função para atualizar os dados do usuário
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.signInUserSession) {
      console.error("Usuário não autenticado ou sessão inválida.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:3000/update_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.signInUserSession.accessToken.jwtToken}`,
        },
        body: JSON.stringify({
          address,
          gender,
          phone_number: phoneNumber,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar perfil");
      }

      const data = await response.json();
      console.log("Perfil atualizado com sucesso:", data);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };
  // Se chegou até aqui, a autenticação foi concluída, o usuário está definido e os dados foram carregados
  const firstName = name?.split(" ")[0] || "Usuário";

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex">
      <div className="w-1/4 bg-zinc-800 p-5">
        <h2 className="text-2xl font-bold mb-4">Menu</h2>
        <ul>
          <li className="mb-2">
            <button
              onClick={() => handleViewChange("tickets")}
              className="w-full text-left"
            >
              Mostrar Ingressos
            </button>
          </li>
          <li className="mb-2">
            <button
              onClick={() => handleViewChange("profile")}
              className="w-full text-left"
            >
              Meu Perfil
            </button>
          </li>
        </ul>
      </div>
      <div className="w-3/4 p-5">
        {view === "tickets" && (
          <>
            <h1 className="text-3xl md:text-4xl p-3 md:px-0 font-bold font-logoSuave text-center">
              Bem-vindo, {firstName}!
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
                      <p className="text-gray-200 text-xl pt-5 font-semibold pb-5">
                        Valor: {Number(ticket.price).toFixed(2)}
                        <br />
                        Lote: {ticket.lot}
                      </p>
                      <p className="text-gray-200 text-2xl pt-5 font-semibold pb-5">
                        Código do Ingresso:
                        <br />
                        <span className="text-4xl text-red-500">
                          {ticket.code}
                        </span>
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
                          Powered by:{" "}
                          <span className="font-extrabold">Synopsy®</span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum ticket encontrado.</p>
              )}
            </div>
          </>
        )}
        {view === "profile" && (
          <>
            <h1 className="text-3xl md:text-4xl p-3 md:px-0 font-bold font-logoSuave text-center">
              Meu Perfil
            </h1>
            <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Nome
                </label>
                <input
                  type="text"
                  value={name || ""}
                  disabled
                  className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm opacity-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={email || ""}
                  disabled
                  className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm opacity-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Data de Nascimento
                </label>
                <input
                  type="text"
                  value={birthdate || ""}
                  disabled
                  className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm opacity-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Gênero
                </label>
                <input
                  type="text"
                  value={gender || ""}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Telefone
                </label>
                <input
                  type="text"
                  value={phoneNumber || ""}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Endereço
                </label>
                <input
                  type="text"
                  value={address || ""}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white rounded p-2 mt-4"
              >
                Atualizar Perfil
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
