import { FaEdit, FaTrashAlt } from "react-icons/fa";

export default function EstateProfileCard() {
  return (
    <div className="text-primary w-5/6 border bg-white border-gray-300 rounded-lg shadow-xl p-3">
      <img src="" alt="Imagen" />
      <h2 className="text-2xl">Titulo</h2>
      <p className="text-lg">descripcion</p>
      <div className="flex justify-end mx-3 gap-5 text-white">
        <button className="flex gap-4 bg-accent hover:bg-yellow-500 rounded p-2 m-2">
          Editar <FaEdit />
        </button>
        <button className="flex gap-4 bg-red-500 hover:bg-red-600 rounded p-2 m-2">
          Eliminar <FaTrashAlt />
        </button>
      </div>
    </div>
  );
}
