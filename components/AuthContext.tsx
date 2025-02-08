"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  "cognito:groups"?: string[];
}

interface AuthContextType {
  user: any;
  accessToken: string | null;
  groups: string[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>; // 🚀 Nova função refreshUser
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [groups, setGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar os dados do usuário
  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch("http://127.0.0.1:3000/user", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const userData = await response.json();
        return userData.data;
      } else {
        throw new Error("Falha ao buscar dados do usuário");
      }
    } catch (error) {
      throw error;
    }
  };

  // Função para restaurar a sessão
  const restoreSession = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("access_token");

    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setGroups([]);
      setIsLoading(false);
      return;
    }

    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      setGroups(decodedToken["cognito:groups"] || []);

      const userData = await fetchUserData(token);
      setUser(userData);
      setAccessToken(token);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para recarregar os dados do usuário
  const refreshUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setGroups([]);
      return;
    }

    setIsLoading(true);
    try {
      const userData = await fetchUserData(token);
      setUser(userData);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.data.AuthenticationResult.AccessToken;
        localStorage.setItem("access_token", token);

        const decodedToken: DecodedToken = jwtDecode(token);
        setGroups(decodedToken["cognito:groups"] || []);

        setUser({
          ...data.data,
          id: data.data.user_id,
        });
        setAccessToken(token);
        setIsAuthenticated(true);
      } else {
        throw new Error("Falha no login");
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      setGroups([]);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setAccessToken(null);
    setIsAuthenticated(false);
    setGroups([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        groups,
        login,
        logout,
        isAuthenticated,
        isAdmin: groups.includes("Admin"),
        isLoading,
        refreshUser, // 🚀 Adiciona refreshUser ao contexto
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};