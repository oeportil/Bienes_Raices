import useUserStore from "../../Store/UserStore";
import { FaPlusCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import AuctionModal from "../../components/AuctionModal";
import axios from "axios";
import { formatDistanceToNow, isAfter, isBefore, subDays } from "date-fns"; // Importar funciones de date-fns para manejar fechas

export default function MyAuctions() {
  const user = useUserStore((state: any) => state.user);
  const [auctions, setAuctions] = useState([]); // Estado para almacenar todas las subastas
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (!isModalOpen) {
      setIsEditMode(false);
    }
  };

  // Simula una carga de datos de subastas (puedes reemplazarlo con una llamada a la API)
  useEffect(() => {
    const fetchAuctions = async () => {
      const url = `${import.meta.env.VITE_BACKEND_URL}/auction/user/${user.id}`;
      const { data } = await axios.get(url);
      console.log(url);
      setAuctions(data);
    };
    fetchAuctions();
  }, []);

  // Filtra las subastas creadas por el usuario y añade las condiciones para editar o eliminar
  const userAuctions = auctions.filter(
    (auction) => auction.realState.user_id === user.id
  );
  const canEditAuction = (endDate: Date) =>
    isAfter(new Date(endDate), subDays(new Date(), 3));
  const canDeleteAuction = (endDate: Date) =>
    isBefore(new Date(endDate), new Date());

  // Filtra las subastas en las que el usuario ha pujado
  const userBiddedAuctions = auctions
    .filter((auction) => auction.bids.some((bid) => bid.user_id === user.id))
    .sort((a, b) => {
      // Ordena por subastas activas primero, luego las terminadas
      const now = new Date();
      const aEnded = isBefore(new Date(a.endDate), now);
      const bEnded = isBefore(new Date(b.endDate), now);
      return aEnded === bEnded ? 0 : aEnded ? 1 : -1;
    });

  return (
    <div>
      <h1 className="text-center text-4xl text-primary md:text-5xl font-bold my-4">
        Gestión de Subastas
      </h1>
      <button
        onClick={() => {
          setIsEditMode(false);
          setIsModalOpen(true);
        }}
        className="bg-secondary mb-5 text-white font-bold flex gap-3 text-center p-4 rounded-lg shadow-sm ml-10 hover:bg-green-500"
      >
        Nueva Subasta
        <FaPlusCircle className="text-white text-xl" />
      </button>

      {isModalOpen && (
        <AuctionModal closeModal={handleCloseModal} editmode={isEditMode} />
      )}

      <div className="my-8 mx-32">
        <h2 className="text-2xl font-bold text-black">Mis Subastas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userAuctions.map((auction) => (
            <div key={auction.id} className="p-4 border rounded-lg shadow">
              <h3 className="text-lg font-bold">{auction.realState.name}</h3>
              <p>Precio inicial: ${auction.startingPrice}</p>
              <p>
                Fecha de inicio:{" "}
                {new Date(auction.startDate).toLocaleDateString()}
              </p>
              <p>
                Fecha de fin: {new Date(auction.endDate).toLocaleDateString()}
              </p>
              {canEditAuction(auction.endDate) && (
                <button
                  onClick={() => {
                    setIsEditMode(true);
                    setIsModalOpen(true);
                  }}
                  className="bg-blue-500 text-white p-2 rounded mt-2"
                >
                  Editar
                </button>
              )}
              {canDeleteAuction(auction.endDate) && (
                <button className="bg-red-500 text-white p-2 rounded mt-2">
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="my-8 my-8 mx-32">
        <h2 className="text-2xl font-bold text-black">
          Subastas en las que has pujado
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userBiddedAuctions.map((auction) => (
            <div key={auction.id} className="p-4 border rounded-lg shadow">
              <h3 className="text-lg font-bold">{auction.realState.name}</h3>
              <p>Precio inicial: ${auction.startingPrice}</p>
              <p>
                Fecha de inicio:{" "}
                {new Date(auction.startDate).toLocaleDateString()}
              </p>
              <p>
                Fecha de fin: {new Date(auction.endDate).toLocaleDateString()}
              </p>
              <p>
                Estado:{" "}
                {isAfter(new Date(auction.endDate), new Date())
                  ? "Activa"
                  : "Finalizada"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
