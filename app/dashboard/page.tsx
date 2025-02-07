"use client";

import { useAuth } from "@/components/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";

const DashboardPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se o usuário não está autenticado, redireciona para login e define o carregamento como verdadeiro.
    if (isAuthenticated === false) {
      router.push("/login");
      setLoading(true); // Garantir que o carregamento esteja ativado até o redirecionamento
      return;
    }

    // Se o usuário ou os dados não estão prontos, inicia o carregamento.
    if (!isAuthenticated || !user) {
      setLoading(true); // Coloca como 'carregando' até que o usuário esteja pronto
      return;
    }

    // Se o usuário está autenticado e os dados estão prontos, prossegue com a coleta de dados.
    const emailAttr = user.UserAttributes?.find(
      (attr: any) => attr.Name === "email"
    );
    const nameAttr = user.UserAttributes?.find(
      (attr: any) => attr.Name === "name"
    );
    setEmail(emailAttr?.Value || null);
    setName(nameAttr?.Value || null);

    const userIdAttr = user.UserAttributes?.find(
      (attr: any) => attr.Name === "sub"
    );

    if (!userIdAttr) {
      console.error("ID do usuário não encontrado.");
      setLoading(false); // Finaliza carregamento se não encontrar ID
      return;
    }

    const userId = userIdAttr.Value;

    // Função para buscar os ingressos do usuário
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:3000/user_tickets/${userId}`
        );
        if (!response.ok) {
          throw new Error("Erro na resposta da API");
        }
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Erro ao buscar tickets:", error);
      } finally {
        setLoading(false); // Define como false quando terminar a busca de ingressos
      }
    };

    // Inicia a busca de ingressos
    fetchTickets();
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
        Carregando...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-800 p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-center pb-5">Painel</h2>
          <nav>
            <ul className="space-y-4">
              <li>
                <button className="w-full text-left px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600 transition">
                  Meus Ingressos
                </button>
              </li>
              <li>
                <button className="w-full text-left px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600 transition">
                  Meu Perfil
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <button
          onClick={logout}
          className="w-full text-left px-4 py-2 rounded bg-red-600 hover:bg-red-500 transition"
        >
          Logout
        </button>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Bem-vindo, {name || "Usuário"}!</h1>
        <h2 className="text-2xl mt-6 font-semibold">Seus Ingressos</h2>

        {tickets.length > 0 ? (
          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <li
                key={ticket.code}
                className="p-5 bg-zinc-800 rounded-lg border border-gray-700"
              >
                <h3 className="text-xl font-semibold">Eternal Nexus</h3>
                <p className="text-gray-400">16/03 até 17/03</p>
                <Image
                  src="/assets/background.png"
                  width={300}
                  height={150}
                  alt="Ingresso"
                  className="mt-3 rounded"
                />
                <p className="mt-3 text-lg font-semibold">
                  Valor: R${Number(ticket.price).toFixed(2)}
                </p>
                <p className="text-gray-400">Lote: {ticket.lot}</p>
                <p className="mt-2 text-red-500 text-xl">
                  Código: {ticket.code}
                </p>
                <div className="mt-3 flex justify-center">
                  <QRCodeSVG value={ticket.code} size={100} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-400">Nenhum ingresso encontrado.</p>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
