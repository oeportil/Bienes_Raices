import { FaBed, FaEdit, FaParking, FaTrashAlt, FaTree } from "react-icons/fa";
import { RealState } from "../../types";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import axios from "axios";


type EstateCardProps = {
  data: RealState;
  actFunction?: () => void
  setEdit?: (edit: boolean) => void;
  setFormDataedi?: ({}: any) => void;
  setIsModalOpen?: (open: boolean) => void;
};

export default function EstateCard({ data, actFunction, setEdit, setFormDataedi, setIsModalOpen }: EstateCardProps) {
  const ActualPath = location.pathname;
  const { name, description, images, amenitie, id } = data;


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
            <button onClick={() =>{setEdit!(true); setFormDataedi!(data); setIsModalOpen!(true);}} className="flex items-center gap-2 bg-accent hover:bg-yellow-500 text-white rounded p-2">
              Editar <FaEdit />
            </button>
            <button onClick={() => Eliminar(id)} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded p-2">
              Eliminar <FaTrashAlt />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  function Eliminar(id: number): void {
    Swal.fire({
      title: "Estas Seguro de Eliminar El Bien Raiz",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, eliminar"
    }).then(async(result) => {
      if (result.isConfirmed) {
        try {
          const url = `${import.meta.env.VITE_BACKEND_URL}/realstates/${id}`
          const url2 = `${import.meta.env.VITE_BACKEND_URL}/realstates/img/all/${id}`
          const datos = Promise.all([axios.delete(url), axios.delete(url2)])
          actFunction!();
          Swal.fire({
            title: "Eliminado",
            text: "Eliminacion Exitosa",
            icon: "success"
          });
        } catch (error) {
          toast.error("Hubo un error al eliminar la propiedad");
        }        
      }
    });
    
  }
}
