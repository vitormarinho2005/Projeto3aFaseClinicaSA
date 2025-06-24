import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("usuario");

    if (savedToken) {
      setToken(savedToken);
    }
    if (savedUser) {
      setUsuario(JSON.parse(savedUser));
    }
  }, []);

  function login(token, usuario) {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    setToken(token);
    setUsuario(usuario);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken(null);
    setUsuario(null);
  }

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, usuario, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
