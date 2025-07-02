//pagina do perfil
import PerfilAdmin from "./PerfilAdmin";
import PerfilPaciente from "./PerfilPaciente";
import PerfilMedico from "./PerfilMedico";

export default function Perfil() {
  const usuarioJSON = localStorage.getItem("usuario");
  console.log("usuarioJSON:", usuarioJSON);
  const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;
  console.log("usuario objeto:", usuario);

  if (!usuario) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Acesso Negado</h2>
          <p className="text-gray-700">Você precisa estar logado para acessar o perfil.</p>
        </div>
      </div>
    );
  }

  console.log("Tipo do usuário:", usuario.papel);

  switch (usuario.papel) {
    case "admin":
      return <PerfilAdmin />;
    case "paciente":
      return <PerfilPaciente />;
    case "medico":
      return <PerfilMedico />;
    default:
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Erro</h2>
            <p className="text-gray-700">Tipo de usuário não reconhecido.</p>
          </div>
        </div>
      );
  }
}


