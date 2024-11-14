import { FaBed, FaEdit, FaParking, FaTrashAlt, FaTree } from "react-icons/fa";
import { RealState } from "../../types";
import { Link } from "react-router-dom";

type EstateCardProps = {
  data: RealState;
};

export default function EstateCard({ data }: EstateCardProps) {
  const ActualPath = location.pathname;
  const { name, description, images, amenitie } = data;

  // Límite de caracteres para la descripción
  const DESCRIPTION_LIMIT = 120;

  // Descripción truncada con "Ver más" si es necesario
  const shortDescription =
    description.length > DESCRIPTION_LIMIT
      ? `${description.slice(0, DESCRIPTION_LIMIT)}...`
      : description;

  return (
    <div className="text-primary mx-10 mb-5 w-4/5 border bg-white border-gray-300 rounded-lg shadow-md p-4 flex flex-col items-center">
      {/* Imagen en la parte superior */}
      <div className="w-full">
        <img
          className="h-48 w-full object-cover rounded-t-lg"
          src={`${import.meta.env.VITE_BACKEND_URL}/realstates/img/${
            images[0].id
          }`}
          alt="Imagen de la propiedad"
        />
      </div>

      {/* Contenido textual */}
      <div className="w-full mt-4 flex flex-col items-start">
        <h2 className="text-xl font-bold mb-2">{name}</h2>
        <p className="text-md mb-4">{shortDescription}</p>
        <div className="flex flex-row gap-5">
          <p className="text-md flex gap-2 ">
            <FaBed className="text-lg" />
            {amenitie.rooms}
          </p>

          <p className="text-md flex gap-2">
            <FaParking className="text-lg" />
            {amenitie.parking}
          </p>
          <p className="text-md flex gap-2">
            <FaTree className="text-lg" />
            {amenitie.gardens}
          </p>
        </div>
        <Link
          to="#"
          className="bg-secondary hover:bg-green-500 p-2 text-white rounded-sm w-full text-center"
        >
          Ver más
        </Link>

        {/* Botones de edición y eliminación */}
        {ActualPath !== "/propiedades" && (
          <div className="flex justify-end w-full gap-4 mt-4">
            <button className="flex items-center gap-2 bg-accent hover:bg-yellow-500 text-white rounded p-2">
              Editar <FaEdit />
            </button>
            <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded p-2">
              Eliminar <FaTrashAlt />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
