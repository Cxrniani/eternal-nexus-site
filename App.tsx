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
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.login("email", "password")}>Sign in</button>
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
