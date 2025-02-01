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
                    <h2 className="text-2xl text-center py-5 font-bold">Seus Tickets</h2>
                    {tickets.length > 0 ? (
                        <ul className="flex flex-col px-3 md:px-0 justify-center space-y-4">
                            {tickets.map((ticket) => (
                                <li key={ticket.code} className="pt-5 border md:w-1/3 flex flex-col text-center items-center mx-auto border-gray-700 rounded-lg">
                                    <p className="text-2xl px-20 text-center font-bold pb-1">ETERNAL NEXUS</p>
                                    <p className="text-xl px-20 text-center text-gray-400 font-semibold pb-1">16/03 até 17/03</p>
                                    <div className="relative w-full rounded-3xl mb-2 h-[30vh] md:h-60">
                                        <Image
                                            src="https://placehold.co/1080x540.png"
                                            layout="fill"
                                            objectFit="contain"
                                            alt="Cover Ingresso Eternal Nexus"
                                            className="rounded-xl px-2 mx-auto"
                                        />
                                    </div>
                                    <p className="text-gray-200 text-2xl pt-5 font-semibold pb-5">Código do Ingresso:<br/><span className="text-4xl text-red-500">{ticket.code}</span></p>
                                    <p className="text-md text-gray-400">Nome: {ticket.name}
                                    <br/>CPF: {ticket.cpf}</p>
                                    <div className="pb-2">
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
                                    <div className="relative w-full bg-preto-opaco py-2 rounded-b-xl">
                                        <Image
                                            src="abstract.svg"
                                            height={1500}
                                            width={120}
                                            alt="Cover Ingresso Eternal Nexus"
                                            className=" mx-auto"
                                        />
                                        <p className="text-xl mx-20 font-thin">Powered by: <span className="font-extrabold">Synopsy®</span></p>
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