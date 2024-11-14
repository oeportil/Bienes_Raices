import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useUserStore from "../../Store/UserStore";

export default function Subasta() {
  const { id } = useParams();
  const [subasta, setSubasta] = useState<any>(null);
  const user = useUserStore((state: any) => state.user);

  const fetchData = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/auction/${id}`;
      const response = await axios.get(url);
      setSubasta(response.data.auction);
    } catch (error) {
      toast.error("Hubo un error al traer los datos de la subasta.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

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
      await axios.post(url, { auctionId: id, amount: cantidad, userId: user.id });
      toast.success("Has realizado una puja exitosa");
      window.location.reload();
    } catch (error) {
      toast.error("Hubo un error al realizar la puja");
    }
  };

  const { realState, details, bids } = subasta;
  console.log(subasta)
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <div className="flex flex-col items-start space-y-6">
        {/* Título de la propiedad */}
        <h2 className="text-3xl font-bold text-primary">{realState?.name}</h2>

        {/* Descripción de la propiedad */}
        <p className="text-lg text-gray-700">{realState?.description}</p>

        {/* Dirección y teléfono */}
        <div className="flex justify-between w-full">
          <span className="text-gray-500">{realState?.direction}</span>
          <span className="text-gray-500">{realState?.phone}</span>
        </div>

        {/* Detalles de la subasta */}
        <div className="bg-primary text-white p-4 rounded-lg w-full">
          <h3 className="text-xl font-semibold">Precio Inicial: ${details?.startingPrice}</h3>
          <p className="text-sm">Fecha de Inicio: {new Date(details?.startDate).toLocaleString()}</p>
          <p className="text-sm">Fecha de Fin: {new Date(details?.endDate).toLocaleString()}</p>
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
          <p className="text-sm text-gray-600">La subasta está actualmente {realState?.status}</p>
        </div>

        {/* Historial de pujas */}
        <div className="mt-6 w-full">
        <h3 className="text-2xl font-semibold text-primary mb-4">Historial de Pujas</h3>
        {details?.bids?.length > 0 ? (
          <div className="space-y-6">
            {details?.bids?.map((bid: any) => (
              <div
                key={bid.id}
                className=" w-full bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-primary">{bid.user?.name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(bid.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-medium text-secondary">Puja: ${bid.amount}</p>
                  <span
                    className={`px-4 py-1 rounded-full text-white text-sm  ${
                      bid.amount <= details.startingPrice
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {bid.amount <= details.startingPrice ? 'Puja válida' : 'Puja baja'}
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
          <p className="text-sm text-gray-600">Si tienes alguna pregunta sobre la subasta, no dudes en contactarnos.</p>
        </div>
      </div>
    </div>
  );
}
