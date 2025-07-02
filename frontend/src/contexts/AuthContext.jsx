import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("usuario");

    // Verifica se savedToken existe, é string e diferente de "undefined" literal
    if (typeof savedToken === "string" && savedToken !== "undefined") {
      setToken(savedToken);
    }

    // Verifica se savedUser existe e é string antes do parse
    if (typeof savedUser === "string" && savedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && typeof parsedUser === "object") {
          setUsuario(parsedUser);
        } else {
          throw new Error("Usuário salvo inválido");
        }
      } catch (err) {
        console.error("Erro ao fazer parse do usuário salvo:", err);
        localStorage.removeItem("usuario");
      }
    }
  }, []);

  function login(token, usuario) {
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));
      setToken(token);
      setUsuario(usuario);
    } catch (error) {
      console.error("Erro ao salvar dados de login:", error);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken(null);
    setUsuario(null);
  }

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ token, usuario, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
