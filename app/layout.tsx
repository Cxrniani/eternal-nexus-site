import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthContext"; // Importa o AuthProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eternal Nexus",
  description: "A Eterna Magia do Psytrance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-top bg-contain bg-no-repeat bg-preto-opaco">
        <AuthProvider>
          {/* Agora todo o app tem acesso ao usuário autenticado */}
          <Navbar />
          <main className="relative overflow-hidden text-white">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
