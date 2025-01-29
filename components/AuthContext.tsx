// /components/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { poolData } from "@/cognitoConfig";

const userPool = new CognitoUserPool(poolData);

interface AuthContextType {
  user: CognitoUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean; // Novo campo para verificar autenticação
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para autenticação

  // Verifica a sessão do usuário ao carregar a página
  useEffect(() => {
    const cognitoUser = userPool.getCurrentUser();

    if (cognitoUser) {
      cognitoUser.getSession((err: any, session: any) => {
        if (!err && session.isValid()) {
          setUser(cognitoUser);
          setIsAuthenticated(true); // Usuário autenticado
        } else {
          setUser(null);
          setIsAuthenticated(false); // Sessão inválida
        }
      });
    } else {
      setUser(null);
      setIsAuthenticated(false); // Nenhum usuário logado
    }
  }, []);

  const login = async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });

      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          setUser(cognitoUser);
          setIsAuthenticated(true); // Atualiza o estado imediatamente
          resolve();
        },
        onFailure: (err) => {
          setUser(null);
          setIsAuthenticated(false);
          reject(err);
        },
      });
    });
  };

  const logout = () => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut(); // Encerra a sessão no Cognito
    }
    setUser(null);
    setIsAuthenticated(false); // Limpa o estado de autenticação
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
