<<<<<<< Updated upstream
"use client";

import React from "react";
import { useAuth } from "@/components/AuthContext";

function App() {
  const { user, isAuthenticated, login, logout } = useAuth();

  const signOutRedirect = () => {
    const clientId = "m16alice2k5am2nnh8rta5j1n";
    const logoutUri = "<logout uri>";
    const cognitoDomain =
      "https://us-east-1eovyj6gea.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  if (!isAuthenticated) {
    return (
      <div>
        <button onClick={() => login("email@example.com", "password")}>
          Sign in
        </button>
=======
import React from "react";
import { useAuth } from "./components/AuthContext"; // Corrigido para seu contexto real
import { AuthProvider } from "./components/AuthContext";

function App() {
  const auth = useAuth(); // Agora usa seu contexto corretamente

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.isAuthenticated) {
    console.log("Auth state:", auth);
    console.log("User object:", auth.user);
    console.log("Access Token:", auth.accessToken);

    return (
      <div>
        <pre> Hello: {auth.user?.email} </pre>
        <pre> Access Token: {auth.accessToken} </pre>
        <button onClick={() => auth.logout()}>Sign out</button>
>>>>>>> Stashed changes
      </div>
    );
  }

  return (
    <div>
<<<<<<< Updated upstream
      <pre> Hello: {user?.email} </pre>
      <pre> ID Token: {user?.id_token} </pre>
      <pre> Access Token: {user?.access_token} </pre>
      <pre> Refresh Token: {user?.refresh_token} </pre>

      <button onClick={() => logout()}>Sign out</button>
      <button onClick={() => signOutRedirect()}>Sign out (Cognito)</button>
=======
      <button onClick={() => auth.login("email", "password")}>Sign in</button>
>>>>>>> Stashed changes
    </div>
  );
}

function RootApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default RootApp;
