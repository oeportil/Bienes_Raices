import { Link } from "react-router-dom";

export default function Error404() {
  return (
    <div className="bg-primary text-white min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Oops! La página que buscas no existe.</p>
      <Link
        to="/"
        className="bg-white text-primary font-semibold px-6 py-3 rounded hover:bg-secondary"
      >
        Volver al Inicio
      </Link>
    </div>
  );
}
