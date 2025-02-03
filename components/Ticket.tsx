// components/Ingresso.tsx
"use client";

import React from "react";
import {QRCodeSVG} from 'qrcode.react';

interface IngressoProps {
    code: string;
    name: string;
    email: string;
    cpf: string;
}

const Ingresso: React.FC<IngressoProps> = ({ code, name, email, cpf }) => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-sm mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Ingresso</h2>
            <div className="mb-4">
                <p className="text-gray-700"><strong>Nome:</strong> {name}</p>
                <p className="text-gray-700"><strong>Email:</strong> {email}</p>
                <p className="text-gray-700"><strong>CPF:</strong> {cpf}</p>
            </div>
            <div className="flex justify-center">
                <QRCodeSVG value={code} size={200} />
            </div>
            <p className="mt-4 text-center text-gray-600">Código: {code}</p>
        </div>
    );
};

export default Ingresso;