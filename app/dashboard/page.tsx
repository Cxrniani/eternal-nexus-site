// app/dashboard/page.tsx
"use client";

import { useAuth } from "@/components/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {QRCodeSVG} from "qrcode.react"; // Importe o componente QRCode

const DashboardPage = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [tickets, setTickets] = useState<any[]>([]);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login"); // Redireciona para o login se o usuário não estiver autenticado
            return;
        }

        if (user) {
            // Extrai os atributos do usuário diretamente do objeto `user`
            const emailAttr = user.UserAttributes?.find((attr: any) => attr.Name === "email");
            const nameAttr = user.UserAttributes?.find((attr: any) => attr.Name === "name");
            setEmail(emailAttr?.Value || null);
            setName(nameAttr?.Value || null);

            // Buscar os tickets do usuário
            fetch(`http://127.0.0.1:3000/user_tickets/${user.UserAttributes[3].Value}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((data) => setTickets(data))
                .catch((error) => console.error("Erro ao buscar tickets:", error));
        }
    }, [user, isAuthenticated, router]);

    if (!isAuthenticated) {
        return null; // Não renderiza nada se o usuário não estiver autenticado
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