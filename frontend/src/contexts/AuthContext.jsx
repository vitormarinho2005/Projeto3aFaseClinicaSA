import { createContext, useState, useEffect } from "react";

<<<<<<< HEAD
export const AuthContext = createContext(null);  
=======
export const AuthContext = createContext(null);
>>>>>>> 309f41a (Quarto commit)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
<<<<<<< HEAD
    // Pode buscar dados do usuário no localStorage ou na API
=======
    // Recupera o usuário salvo no localStorage
>>>>>>> 309f41a (Quarto commit)
    const userData = localStorage.getItem("usuario");
    if (userData) setUsuario(JSON.parse(userData));
  }, []);

<<<<<<< HEAD
=======
  function login(token, usuario) {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    setUsuario(usuario);
  }

>>>>>>> 309f41a (Quarto commit)
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  return (
<<<<<<< HEAD
    <AuthContext.Provider value={{ usuario, logout }}>
=======
    <AuthContext.Provider value={{ usuario, login, logout }}>
>>>>>>> 309f41a (Quarto commit)
      {children}
    </AuthContext.Provider>
  );
}
