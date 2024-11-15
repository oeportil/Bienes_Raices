import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useUserStore from "../../Store/UserStore";
import { addHours } from "date-fns";

export default function Subasta() {
  const { id } = useParams();
  const [subasta, setSubasta] = useState<any>(null);
  const user = useUserStore((state: any) => state.user);
  const [timeLeft, setTimeLeft] = useState("");
  const [pujas, setPujas] = useState<any>(null);
  const fetchData = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/auction/${id}`;
      const response = await axios.get(url);
      setSubasta(response.data.auction);
    } catch (error) {
      toast.error("Hubo un error al traer los datos de la subasta.");
    }
  };
  const fetchTopBids = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auction/puja/${id}`
      );
      if (response.data.topBids.length == 0) {
        setPujas(null);
      } else {
        setPujas(response.data.topBids);
      }
      // Actualiza el estado con los datos de las pujas
    } catch (error) {
      console.error("Error al obtener las pujas:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (subasta?.details?.endDate) {
      const interval = setInterval(() => {
        const endDate = new Date(addHours(subasta.details.endDate, 6));
        const now = new Date();
        const difference = endDate.getTime() - now.getTime();

        if (difference <= 0) {
          setTimeLeft("La subasta ha terminado");
          clearInterval(interval);
        } else {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / (1000 * 60)) % 60);
          const seconds = Math.floor((difference / 1000) % 60);
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s restantes`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [subasta]);

  useEffect(() => {
    // Llama a fetchTopBids al cargar el componente
    fetchTopBids();

    // Intervalo que actualiza los datos de pujas cada 2 segundos si la página está activa
    let interval: any;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchTopBids(); // Actualiza de inmediato cuando la página vuelve a ser visible
        interval = setInterval(fetchTopBids, 2000); // Inicia el intervalo
      } else {
        clearInterval(interval); // Detiene el intervalo si la página no está visible
      }
    };

    // Listener para el evento de visibilidad de la página
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Inicia el intervalo al cargar el componente si la página está activa
    if (document.visibilityState === "visible") {
      interval = setInterval(fetchTopBids, 2000);
    }

    // Limpia el intervalo y el evento cuando el componente se desmonta
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (!subasta) {
    return <div className="text-center">Cargando...</div>;
  }

  const hacerPuja = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const cantidad = parseInt(fd.get("amount")!.toString());

    if (cantidad < subasta?.details.startingPrice) {
      toast.error("La puja debe ser mayor al precio inicial.");
      return;
    }

    if (!!pujas) {
      if (cantidad < pujas[0].amount) {
        toast.error("La puja debe ser mayor a la última puja.");
        return;
      }
    }

    if (timeLeft === "La subasta ha terminado") {
      toast.error("La subasta ha terminado. No puedes hacer una puja.");
      return;
    }

    const respuesta = await Swal.fire({
      title: "¿Deseas hacer una puja?",
      text: "¡No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
    });

    if (!respuesta.isConfirmed) return;

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/auction/puja`;
      await axios.post(url, {
        auctionId: id,
        amount: cantidad,
        userId: user.id,
      });
      toast.success("Has realizado una puja exitosa");
      window.location.reload();
    } catch (error) {
      toast.error("Hubo un error al realizar la puja");
    }
  };

  const { realState, details, bids } = subasta;
  console.log(subasta);
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <div className="flex flex-col items-start space-y-6">
        {/* Título de la propiedad */}
        <div className="w-full max-w-6xl bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Property Header */}
          <div className="relative">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/realstates/img/${
                realState?.images[0].id
              }`}
              alt={realState?.name}
              className="w-full h-64 object-cover rounded-t-lg"
            />
            <div className="absolute bottom-4 px-5 text-white bg-primary bg-opacity-40 w-full">
              <h1 className="text-4xl font-bold">{realState?.name}</h1>
              <p className="text-lg">{realState?.description}</p>
            </div>
          </div>

          {/* Property Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-700">
                  Detalles
                </h2>
                <ul className="mt-4 space-y-2">
                  <li className="flex justify-between">
                    <span className="font-medium text-gray-500">
                      Dirección:
                    </span>
                    <span>{realState?.direction}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-gray-500">Teléfono:</span>
                    <span>{realState?.phone}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-gray-500">Email:</span>
                    <span>{realState?.email}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-gray-500">Precio:</span>
                    <span>${realState?.price}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-gray-500">Estado:</span>
                    <span>{realState?.status}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-700">
                  Amenidades
                </h2>
                <ul className="mt-4 space-y-2">
                  <li className="flex justify-between">
                    <span className="font-medium text-gray-500">Baños:</span>
                    <span>{realState?.amenitie?.wc}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-gray-500">
                      Dimensión (m²):
                    </span>
                    <span>{realState?.amenitie?.dimension}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-gray-500">Parqueos:</span>
                    <span>{realState?.amenitie?.parking}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-gray-500">
                      Habitaciones:
                    </span>
                    <span>{realState?.amenitie?.rooms}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-gray-500">Jardines:</span>
                    <span>{realState?.amenitie?.gardens}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Images Slider */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Galería
              </h2>
              <div className="flex gap-4 overflow-x-auto">
                {realState?.images?.map((image: any, index: number) => (
                  <img
                    key={index}
                    src={`${import.meta.env.VITE_BACKEND_URL}/realstates/img/${
                      image?.id
                    }`}
                    alt={`Image ${index + 1}`}
                    className="w-64 h-64 object-cover rounded-lg shadow-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-xl font-semibold">
            Fecha de Inicio:{" "}
            {new Date(addHours(details.startDate, 6)).toLocaleString()}
          </p>
          <p className="text-xl font-semibold">
            Fecha de Fin:{" "}
            {new Date(addHours(details.endDate, 6)).toLocaleString()}
          </p>
          <p className="text-xl font-semibold">Tiempo Restante: {timeLeft}</p>
          <p className="text-xl font-semibold">
            Precio inicial: ${details.startingPrice}
          </p>
        </div>
        {/* Formulario de puja */}
        <form onSubmit={hacerPuja} className="mt-6">
          <div>
            <label htmlFor="amount" className="block text-lg mb-2 text-primary">
              Cantidad a pujar:
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              placeholder="Ingresa la cantidad a pujar"
              className="w-full p-2 rounded bg-gray-700 text-white mb-4"
            />
          </div>
          <button
            type="submit"
            className="bg-white text-primary font-semibold px-6 py-3 rounded hover:bg-secondary"
          >
            Hacer Puja
          </button>
        </form>

        {/* Estado de la subasta */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Estado de la Subasta</h3>
          <p className="text-sm text-gray-600">
            La subasta está actualmente {realState?.status}
          </p>
        </div>

        {/* Historial de pujas */}
        <div className="mt-6 w-full">
          <h3 className="text-2xl font-semibold text-primary mb-4">
            Historial de Pujas
          </h3>
          {!!pujas ? (
            <div className="space-y-6">
              {pujas.map((bid: any) => (
                <div
                  key={bid.id}
                  className=" w-full bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-primary">
                      {bid.user?.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(bid.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-medium text-secondary">
                      Puja: ${bid.amount}
                    </p>
                    <span
                      className={`px-4 py-1 rounded-full text-white text-sm  ${
                        bid.amount <= details.startingPrice
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {bid.amount <= details.startingPrice
                        ? "Puja válida"
                        : "Puja baja"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No hay pujas aún.</p>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-6 space-y-4">
          <h4 className="text-lg font-semibold">Más Información</h4>
          <p className="text-sm text-gray-600">
            Si tienes alguna pregunta sobre la subasta, no dudes en
            contactarnos.
          </p>
        </div>
      </div>
    </div>
  );
}
