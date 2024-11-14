import useUserStore from "../../Store/UserStore";
import { FaPlusCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import AuctionModal from "../../components/AuctionModal";
import axios from "axios";
import { isAfter,  subDays } from "date-fns"; // Importar funciones de date-fns para manejar fechas

export default function MyAuctions() {
  const user = useUserStore((state: any) => state.user);
  const [auctions, setAuctions] = useState<any[]>([]); // Estado para almacenar todas las subastas
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [userBiddedAuctions, setUserBiddedAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (!isModalOpen) {
      setIsEditMode(false);
    }
  };

  const handleEditAuction = async (auctionId: number) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/auction/${auctionId}`;
      const { data } = await axios.get(url);
      setSelectedAuction(data.auction.details); // Guardar los datos de la subasta seleccionada
      setIsEditMode(true);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error al obtener los datos de la subasta:", error);
    }
  };
  // Simula una carga de datos de subastas (puedes reemplazarlo con una llamada a la API)
  useEffect(() => {
    const fetchAuctions = async () => {
      const url = `${import.meta.env.VITE_BACKEND_URL}/auction/user/${user.id}`;
      const { data } = await axios.get(url);
      setAuctions(data);
    };
    const fecthBidded = async () => {
      const url2 = `${import.meta.env.VITE_BACKEND_URL}/auction/mypuja/${
        user.id
      }`;
      const { data } = await axios.get(url2);
      setUserBiddedAuctions(data);
    };
    fetchAuctions();
    fecthBidded();
  }, []);

  // Filtra las subastas creadas por el usuario y añade las condiciones para editar o eliminar
  const userAuctions = auctions.filter(
    (auction) => auction.realState.user_id === user.id
  );
  const canEditAuction = (endDate: Date) =>
    isAfter(new Date(endDate), subDays(new Date(), 3));
  // const canDeleteAuction = (endDate: Date) =>
  //   isBefore(new Date(endDate), new Date());

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
        <AuctionModal
          closeModal={handleCloseModal}
          editmode={isEditMode}
          auctionData={selectedAuction}
        />
      )}

      <div className="my-8 mx-32">
        <h2 className="text-2xl font-bold text-black">Mis Subastas</h2>
        <br />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {userAuctions.map((auction) => (
            <div
              key={auction.id}
              className="p-4 border rounded-lg shadow grid grid-cols-2"
            >
              <div>
                <h3 className="text-lg font-bold">{auction.realState.name}</h3>
                <h3 className="text-sm ">
                  {auction.realState.description.substring(0, 250)}
                </h3>
                <p>Precio inicial: ${auction.startingPrice}</p>
                <p>
                  Fecha de inicio:{" "}
                  {new Date(auction.startDate).toLocaleDateString()}
                </p>
                <p>
                  Fecha de fin: {new Date(auction.endDate).toLocaleDateString()}
                </p>
                {canEditAuction(auction.startDate) && (
                  <button
                    onClick={() => {
                      handleEditAuction(auction.id);
                    }}
                    className="bg-primary text-white p-2 rounded mt-2 me-2 px-4"
                  >
                    Editar
                  </button>
                )}
              </div>
              <div>
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/realstates/img/${
                    auction.realState.images[0].id
                  }`}
                  alt="Avatar Tailwind CSS Component"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="my-8 mx-32">
        <h2 className="text-2xl font-bold text-black">
          Subastas en las que has pujado
        </h2>
        <br />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userBiddedAuctions.map((auction: any) => (
            <div
              key={auction.id}
              className="p-4 border rounded-lg shadow grid grid-cols-2"
            >
              <div>
                <h3 className="text-lg font-bold">{auction.realState.name}</h3>
                <h3 className="text-sm ">
                  {auction.realState.description.substring(0, 250)}
                </h3>
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
              <div>
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/realstates/img/${
                    auction.realState.images[0].id
                  }`}
                  alt="Avatar Tailwind CSS Component"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
