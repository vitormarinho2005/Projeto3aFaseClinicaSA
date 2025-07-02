import Navbar from "./Navbar";

export default function Perfil({ titulo, descricao, children }) {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 mt-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">{titulo}</h2>
        <p className="text-lg text-gray-600 mb-6">{descricao}</p>
        {children}
      </main>
    </>
  );
}
