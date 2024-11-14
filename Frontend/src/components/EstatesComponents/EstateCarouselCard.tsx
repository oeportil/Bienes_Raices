import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { RealState } from "../../types";
import { Link } from "react-router-dom";

type EstateCarouselCard = {
  data: RealState;
};
export default function EstateCarouselCard({ data }: EstateCarouselCard) {
  const ActualPath = location.pathname;

  const { name, description, images } = data;

  // Límite de caracteres para la descripción
  const DESCRIPTION_LIMIT = 120;

  // Descripción truncada con "Ver más" si es necesario
  const shortDescription =
    description.length > DESCRIPTION_LIMIT
      ? `${description.slice(0, DESCRIPTION_LIMIT)}... `
      : description;
  return (
    <div className="text-primary w-11/12 border flex flex-col-reverse md:flex-row bg-white border-gray-300 rounded-lg shadow-xl p-3">
      <div className="md:w-1/2	">
        <h2 className="text-2xl font-bold">{name}</h2>
        <p className="text-lg mb-2"> {shortDescription}</p>
        <Link
          to={`#`}
          className="bg-secondary hover:bg-green-500 p-2 text-white rounded-sm"
        >
          Ver más
        </Link>
        <hr />
        {ActualPath !== "/propiedades" && (
          <div className="flex justify-end mx-3 gap-5 text-white">
            <button className="flex gap-4 bg-accent hover:bg-yellow-500 rounded p-2 m-2">
              Editar <FaEdit />
            </button>
            <button className="flex gap-4 bg-red-500 hover:bg-red-600 rounded p-2 m-2">
              Eliminar <FaTrashAlt />
            </button>
          </div>
        )}
      </div>
      <div className="md:w-1/2">
        <img
          className="h-60 w-full"
          src={`${import.meta.env.VITE_BACKEND_URL}/realstates/img/${
            images[0].id
          }`}
          alt="Imagen"
        />
      </div>
    </div>
  );
}
