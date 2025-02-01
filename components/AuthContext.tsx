"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Função para restaurar a sessão ao carregar a página
  const restoreSession = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.data);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Restaura a sessão ao carregar a página
  useEffect(() => {
    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.data.AuthenticationResult.AccessToken);
        setUser({
          ...data.data,  // Inclui o user_id na resposta
          id: data.data.user_id,  // Armazena o user_id
        });
        setIsAuthenticated(true);
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
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        await fetch("http://127.0.0.1:5000/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      localStorage.removeItem("access_token");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};