import { FaEdit, FaTrashAlt, FaCalendarPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import { differenceInDays, isBefore } from "date-fns";
import { Link } from "react-router-dom";

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

export default function MyAuctionCard(data: any) {
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
  
  console.log(data)
  return (
    <div className="text-primary w-5/6 mx-auto  border bg-white border-gray-300 rounded-lg shadow-xl p-3">
      <img  src={`${import.meta.env.VITE_BACKEND_URL}/realstates/img/${
            data.realState.images[0].id
          }`} alt="Imagen" />
      <h2 className="text-2xl">{data.realState.name}</h2>
      <div className="text-slate-400">
        <h3 className="text-sm ">
          {data.realState.description.substring(0, 250)}
        </h3>
        <p>Precio inicial: ${data.startingPrice}</p>
        <p>
          Fecha de inicio:{" "}
          {new Date(data.startDate).toLocaleDateString()}
        </p>
        <p>
          Fecha de fin: {new Date(data.endDate).toLocaleDateString()}
        </p>
      </div>
      <div className="flex justify-end mx-3 gap-5 text-white">
        {auctionStarted && (
          <Link to={`${data.id}`} className="flex gap-4 bg-blue-500 hover:bg-blue-600 rounded p-2 m-2">
            Subasta Activa <FaCalendarPlus />
          </Link>
        )}
      </div>
    </div>
  );
}
