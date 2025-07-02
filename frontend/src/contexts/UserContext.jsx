import React, { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState({
    nome: "Usuário Exemplo",
    email: "usuario@example.com",
    telefone: "(11) 99999-9999",
    endereco: "Rua Exemplo, 123 - Cidade, Estado",
  });

  function atualizarUsuario(novosDados) {
    setUsuario((prev) => ({ ...prev, ...novosDados }));
  }

  return (
    <UserContext.Provider value={{ usuario, atualizarUsuario }}>
      {children}
    </UserContext.Provider>
  );
}
