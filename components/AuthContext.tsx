"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Usando o hook de navegação do Next.js

interface AuthContextType {
  user: any;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter(); // Navegação

  // Função para restaurar a sessão ao carregar a página
  const restoreSession = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login"); // Redireciona para o login se o token não estiver presente
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:3000/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Enviar o token corretamente
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user); // Usar as informações retornadas do usuário
        setAccessToken(token);
        setIsAuthenticated(true);
      } else {
        const errorData = await response.json();
        console.error("Erro na API /user:", errorData);
        localStorage.removeItem("access_token"); // Remove token caso o usuário não seja autenticado
        setUser(null);
        setIsAuthenticated(false);
        router.push("/login"); // Redireciona para o login se a resposta for inválida
      }
    } catch (error) {
      console.error("Erro ao restaurar sessão:", error);
      localStorage.removeItem("access_token"); // Remove token em caso de erro
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login"); // Redireciona para o login se ocorrer erro
    }
  };

  // Restaura a sessão ao carregar a página
  useEffect(() => {
    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://127.0.0.1:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const accessToken = data?.data?.AuthenticationResult?.AccessToken;

        if (!accessToken) {
          throw new Error("Token não recebido da API.");
        }

        localStorage.setItem("access_token", accessToken);

        setUser({
          ...data.data,
          id: data.data.user_id,
        });

        setAccessToken(accessToken);
        setIsAuthenticated(true);

        return data.data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        await fetch("http://127.0.0.1:3000/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      localStorage.removeItem("access_token");
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
      router.push("/login"); // Redireciona para o login após logout
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
