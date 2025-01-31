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

  return (
    <div className="w-full bg-preto-opaco bg-opacity-100">
      <nav className="flexBetween max-container padding-container relative z-30 py-5">
        <Link
          href="/"
          className="font-logoSuave text-white font-bold text-4xl leading-none hover:font-extrabold hover:text-black ease-in-out"
        >
          Nexus
        </Link>
        <ul className="hidden h-full gap-12 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              href={link.href}
              key={link.key}
              className="font- text-white text-bold flexCenter cursor-pointer pb-1.5 transition-all text-lg hover:font-extrabold hover:text-extrabold ease-in-out"
            >
              {link.label}
            </Link>
          ))}
        </ul>
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
                  className={`
                    transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-gray-800 rounded-xl hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 rounded-xl text-gray-800 hover:bg-gray-100"
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

        <Image
          src="/menu.svg"
          alt="menu"
          width={24}
          height={24}
          className="inline-block cursor-pointer lg:hidden"
        />
      </nav>
    </div>
  );
};

export default Navbar;