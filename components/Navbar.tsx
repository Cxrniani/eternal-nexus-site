"use client";

import { NAV_LINKS } from "@/constants";
import Link from "next/link";
import Button from "./Button";
import Image from "next/image";
import { useAuth } from "@/components/AuthContext";
import { useState } from "react";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado para controlar o menu mobile

  return (
    <div className="w-full bg-preto-opaco bg-opacity-100">
      <nav className="flexBetween max-container padding-container relative z-30 py-5">
        <Link
          href="/"
          className="font-logoSuave text-white font-bold text-4xl leading-none hover:font-extrabold hover:text-black ease-in-out"
        >
          Nexus
        </Link>

        {/* Links para desktop */}
        <ul className="hidden h-full gap-20 mx-auto pl-28 lg:flex flex-row justify-between items-center">
          {NAV_LINKS.map((link) => (
            <Link
              href={link.href}
              key={link.key}
              className="font-logoSuave text-white text-bold justify-between cursor-pointer  
              transition-all text-lg hover:text-xl hover:text-extrabold ease-in-out"
            >
              {link.label}
            </Link>
          ))}
        </ul>

        {/* Botão de login/dropdown para desktop */}
        <div className="lg:flexCenter hidden">
          {isAuthenticated ? (
            // Exibe o nome do usuário com dropdown
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-white text-md font-bold hover:text-gray-300 transition-all"
              >
                Bem-vindo, {user?.UserAttributes?.find((attr: any) => attr.Name === "name")?.Value || "Usuário"}
                <Image
                  src="/right-arrow.svg"
                  alt="dropdown"
                  width={16}
                  height={16}
                  className={`transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-zinc-700 rounded-lg shadow-lg">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 rounded-t-xl text-zinc-300 hover:bg-zinc-500"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Meus Ingressos
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 rounded-b-xl text-zinc-300 hover:bg-zinc-500"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Botão Entrar como link
            <Link href="/check-email">
              <Button
                type="button"
                title="Entrar"
                icon="/user.svg"
                variant="btn_dark_gray"
              />
            </Link>
          )}
        </div>

        {/* Ícone do menu para mobile */}
        <Image
          src="/menu.svg"
          alt="menu"
          width={24}
          height={24}
          className="inline-block cursor-pointer lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // Abre/fecha o menu mobile
        />

        {/* Menu lateral para mobile */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 lg:hidden">
            <div className="fixed top-0 right-0 h-full w-64 bg-slate-800 shadow-lg">
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)} // Fecha o menu mobile
                  className="text-preto-opaco hover:text-gray-600"
                >
                  <Image
                    src="/close.svg" // Ícone de fechar
                    alt="close"
                    width={24}
                    height={24}
                  />
                </button>
              </div>

              {/* Links do menu mobile */}
              <ul className="flex flex-col px-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    href={link.href}
                    key={link.key}
                    className="text-slate-300 border-t-2 py-3 border-slate-500 hover:bg-slate-500 hover:rounded hover:bg-opacity-15 px-4"
                    onClick={() => setIsMobileMenuOpen(false)} // Fecha o menu ao clicar em um link
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Botão de login/dropdown para mobile */}
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-slate-300 border-t-2 py-3 border-slate-500 hover:bg-slate-500 hover:rounded hover:bg-opacity-15 px-4 "
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-slate-300 py-3 border-slate-500 border-t-2 border-b-2 px-4 hover:bg-slate-500 hover:rounded hover:bg-opacity-15 text-left"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <Link
                    href="/check-email"
                    className="text-slate-300 py-2 hover:bg-gray-100 px-4 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                )}
              </ul>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;