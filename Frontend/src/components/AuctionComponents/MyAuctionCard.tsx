import { FaEdit, FaTrashAlt, FaCalendarPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import { differenceInDays, isBefore } from "date-fns";

interface MACard {
  user_id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startingPrice: number;
  img_id: number;
  id: number;
  bids: Array<any>;
}

export default function MyAuctionCard(data: MACard) {
  const [isEditable, setIsEditable] = useState(true);
  const [auctionStarted, setAuctionStarted] = useState(false);

  useEffect(() => {
    const now = new Date();
    const startDate = new Date(data.startDate);

    // Calcular la diferencia en días
    const daysDifference = differenceInDays(startDate, now);

    // Verificar si faltan más de 3 días y si la subasta ha comenzado
    setIsEditable(daysDifference > 3);
    setAuctionStarted(isBefore(startDate, now));
  }, [data.startDate]);

  return (
    <div className="text-primary w-5/6 border bg-white border-gray-300 rounded-lg shadow-xl p-3">
      <img src="" alt="Imagen" />
      <h2 className="text-2xl">{data.name}</h2>
      <p className="text-lg">{data.description}</p>
      <div className="flex justify-end mx-3 gap-5 text-white">
        {isEditable && (
          <>
            <button className="flex gap-4 bg-accent hover:bg-yellow-500 rounded p-2 m-2">
              Editar <FaEdit />
            </button>
            <button className="flex gap-4 bg-red-500 hover:bg-red-600 rounded p-2 m-2">
              Eliminar <FaTrashAlt />
            </button>
          </>
        )}
        {auctionStarted && (
          <button className="flex gap-4 bg-blue-500 hover:bg-blue-600 rounded p-2 m-2">
            Subasta Activa <FaCalendarPlus />
          </button>
        )}
      </div>
    </div>
  );
}
