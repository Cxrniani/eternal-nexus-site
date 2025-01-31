// /components/Footer.tsx
import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-preto-opaco text-white p-10">
      <div className="max-container flex flex-col md:flex-row items-start md:items-center justify-around">
        {/* Seção 1 */}
        <div className="flex-1">
          <h3 className="text-5xl font-bold ">
            Bem vindo a<br />
            Eternal Nexus
          </h3>
          <p className="text-gray-20 text-xl mb-10">Nunca apenas um evento.</p>
          <p></p>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <Image src="abstract.svg" alt="Logo" width={200} height={200} />
        </div>

        {/* Seção 2 */}
        <div className="flex-1 md:ml-10">
          <h3 className="text-lg md:pt-0 pt-10 font-bold mb-4">Contatos</h3>
          <ul>
            <li className="mb-2">Email: contato@eternalnexus.com</li>
            <li className="mb-2">Telefone: (67) 99999-9999</li>
            <li>Redes sociais:</li>
            <div className="flex flex-row gap-2 pt-2">
              <Image
                src="instagram.svg"
                alt="Instagram"
                width={40}
                height={40}
              />
              <Image src="whatsapp.svg" alt="WhatsApp" width={40} height={40} />
            </div>
          </ul>
        </div>
      </div>
      <div className="max-container">
        <p className="pt-10 text-sm">
          Feito com ❤️ by Synopsy®
          <br />
          Copyright © 2025 Eternal Nexus. Todos os direitos reservados.{" "}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
