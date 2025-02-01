"use client";

import { useAuth } from "@/components/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

const DashboardPage = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // ✅ Força um reload após 200ms se ainda estiver carregando
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (loading) {
                window.location.reload();
            }
        }, 200); // 200ms

        return () => clearTimeout(timeout); // Limpa o timeout ao desmontar o componente
    }, [loading]);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        if (user && user.UserAttributes) {
            const emailAttr = user.UserAttributes.find((attr: any) => attr.Name === "email");
            const nameAttr = user.UserAttributes.find((attr: any) => attr.Name === "name");
            setEmail(emailAttr?.Value || null);
            setName(nameAttr?.Value || null);

            if (user.UserAttributes.length > 3) {
                const userId = user.UserAttributes[3].Value;

                fetch(`http://127.0.0.1:3000/user_tickets/${userId}`)
                    .then((response) => response.json())
                    .then((data) => {
                        setTickets(data);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error("Erro ao buscar tickets:", error);
                        setLoading(false);
                    });
            } else {
                console.error("UserAttributes não definidos corretamente.");
                setLoading(false);
            }
        }
    }, [isAuthenticated, user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                Carregando...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="flex flex-col max-container ">
                <h1 className="text-5xl p-3 md:px-0 font-extrabold">Dashboard</h1>
                <h1 className="text-3xl p-3 md:px-0 font-bold">Bem-vindo, {name || "Usuário"}!</h1>
                <div className="mt-6">
                    <h2 className="text-2xl font-bold">Seus Tickets</h2>
                    {tickets.length > 0 ? (
                        <ul className="space-y-4">
                            {tickets.map((ticket) => (
                                <li key={ticket.code} className="p-4 border border-gray-700 rounded-lg">
                                    <p className="text-lg font-semibold">Nome: {ticket.name}</p>
                                    <p className="text-gray-400">CPF: {ticket.cpf}</p>
                                    <p className="text-gray-400">Código do Ticket: {ticket.code}</p>
                                    <div className="mt-4">
                                        <p className="text-gray-400">QR Code:</p>
                                        <div className="p-2 bg-white rounded-lg inline-block">
                                            <QRCodeSVG
                                                value={ticket.code} // O valor do QR Code é o código do ticket
                                                size={128} // Tamanho do QR Code
                                                bgColor="#ffffff" // Cor de fundo
                                                fgColor="#000000" // Cor do QR Code
                                                level="Q" // Nível de correção de erro (L, M, Q, H)
                                            />
                                        </div>
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