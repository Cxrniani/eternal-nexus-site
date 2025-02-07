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
      </div>
    );
  }

  return (
    <div>
      <pre> Hello: {user?.email} </pre>
      <pre> ID Token: {user?.id_token} </pre>
      <pre> Access Token: {user?.access_token} </pre>
      <pre> Refresh Token: {user?.refresh_token} </pre>

      <button onClick={() => logout()}>Sign out</button>
      <button onClick={() => signOutRedirect()}>Sign out (Cognito)</button>
    </div>
  );
}

export default App;
