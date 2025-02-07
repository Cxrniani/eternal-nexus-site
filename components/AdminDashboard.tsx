"use client"

import React, { useEffect, useState } from 'react';

const AdminDashboard: React.FC = () => {
    const [balance, setBalance] = useState<number>(0);
    const [withdrawals, setWithdrawals] = useState<any[]>([]);
    const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
    const [tickets, setTickets] = useState<any[]>([]);

    useEffect(() => {
        fetchBalance();
        fetchWithdrawals();
        fetchTickets().then((tickets) => setTickets(tickets));
    }, []);

    const fetchBalance = async () => {
        try {
            const response = await fetch('http://127.0.0.1:3000/admin/balance');
            if (!response.ok) {
                throw new Error('Erro ao buscar saldo');
            }
            const data = await response.json();
            setBalance(data.balance);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const fetchWithdrawals = async () => {
        try {
            const response = await fetch('http://127.0.0.1:3000/admin/withdrawals');
            if (!response.ok) {
                throw new Error('Erro ao buscar saques');
            }
            const data = await response.json();
            setWithdrawals(data.withdrawals);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const fetchTickets = async () => {
        try {
            const response = await fetch('http://127.0.0.1:3000/tickets/etternal-nexus');
            if (!response.ok) {
                throw new Error('Erro ao buscar tickets');
            }
            const data = await response.json();
            return data; // A resposta já é a lista de tickets
        } catch (error) {
            console.error('Erro:', error);
            return [];
        }
    };

    const handleWithdraw = async () => {
        if (withdrawAmount > balance) {
            alert('Saldo insuficiente');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:3000/admin/withdraw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: withdrawAmount }),
            });

            if (!response.ok) {
                throw new Error('Erro ao processar saque');
            }

            alert('Solicitação de saque enviada');
            fetchBalance();
            fetchWithdrawals();
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao processar saque');
        }
    };

    const handleMarkAsDone = async (index: number) => {
        try {
            const response = await fetch('http://127.0.0.1:3000/admin/mark_withdrawal_done', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ index }),
            });

            if (!response.ok) {
                throw new Error('Erro ao marcar saque como realizado');
            }

            alert('Saque marcado como realizado');
            fetchWithdrawals();
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao marcar saque como realizado');
        }
    };

    return (
        <div className='min-h-screen flex flex-col items-center bg-zinc-900 p-10'>
            <h1 className='text-5xl font-extrabold p-20'>Dashboard Administrativo</h1>
            <h2 className='text-3xl font-bold p-5'>Saldo: R$ {balance.toFixed(2)}</h2>
            <div>
                <input
                    type="number"
                    value={isNaN(withdrawAmount) ? "" : withdrawAmount}
                    onChange={(e) => {
                        const value = e.target.value;
                        setWithdrawAmount(value === "" ? 0 : parseFloat(value));
                    }}
                    className='rounded p-2 m-5 text-xl'
                />
                <button className='rounded bg-zinc-950 p-2 m-5' onClick={handleWithdraw}>Solicitar Saque</button>
            </div>
            <h3>Histórico de Saques</h3>
            <ul>
                {withdrawals.map((withdrawal, index) => (
                    <li key={index}>
                        Valor: R$ {Number(withdrawal.amount).toFixed(2)} - Status: {withdrawal.status}
                        {withdrawal.status === 'pending' && (
                            <button className="m-2 p-1 rounded bg-zinc-950" onClick={() => handleMarkAsDone(index)}>Marcar como Realizado</button>
                        )}
                    </li>
                ))}
            </ul>

            {/* Painel de Tickets Comprados */}
            <div className="w-full max-w-4xl mt-10">
                <h3 className="text-2xl font-bold mb-5">Tickets Comprados</h3>
                <table className="w-full bg-zinc-800 rounded-lg overflow-hidden">
                    <thead className="bg-zinc-700">
                        <tr>
                            <th className="p-3 text-left">Nome do Comprador</th>
                            <th className="p-3 text-left">Valor do Ticket</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket, index) => (
                            <tr key={index} className="border-b border-zinc-700">
                                <td className="p-3">{ticket.name}</td>
                                <td className="p-3">R$ {ticket.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;