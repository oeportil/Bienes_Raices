import { useEffect, useState } from "react";
import { RealState } from "../types";
import { toast } from "react-toastify";
import axios from "axios";
import CarouselOfEstates from "../components/EstatesComponents/CarouselOfEstates";
import EstateCard from "../components/EstatesComponents/EstateCard";

export default function States() {
  const [estates, setEstates] = useState<RealState[]>([]);
  const [filteredEstates, setFilteredEstates] = useState<RealState[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // Estados para los filtros de amenidades
  const [numBathrooms, setNumBathrooms] = useState<number | null>(null);
  const [numGardens, setNumGardens] = useState<number | null>(null);
  const [numParkings, setNumParkings] = useState<number | null>(null);
  const [numRooms, setNumRooms] = useState<number | null>(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const estatesPerPage = 9;

  useEffect(() => {
    const getStates = async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/realstates`;
        const { data } = await axios.get<RealState[]>(url);
        setEstates(data);
        setFilteredEstates(
          data.filter(
            (item) => item.status === "VENTAS" || item.status === "ALQUILER"
          )
        );
      } catch (error) {
        toast.error("Error al obtener las propiedades");
        console.error(error);
      }
    };
    getStates();
  }, []);

  useEffect(() => {
    const filteredData = estates.filter(
      (item) =>
        (item.status === "VENTAS" || item.status === "ALQUILER") &&
        (filterStatus === "ALL" || item.status === filterStatus) &&
        (numBathrooms === null || item.amenitie.wc === numBathrooms) &&
        (numGardens === null || item.amenitie.gardens === numGardens) &&
        (numParkings === null || item.amenitie.parking === numParkings) &&
        (numRooms === null || item.amenitie.rooms === numRooms)
    );
    setFilteredEstates(filteredData);
    setCurrentPage(1); // Reinicia a la primera página cada vez que se cambia el filtro
  }, [filterStatus, estates, numBathrooms, numGardens, numParkings, numRooms]);

  // Calcular propiedades para la página actual
  const indexOfLastEstate = currentPage * estatesPerPage;
  const indexOfFirstEstate = indexOfLastEstate - estatesPerPage;
  const currentEstates = filteredEstates.slice(
    indexOfFirstEstate,
    indexOfLastEstate
  );

  // Cambiar de página
  const totalPages = Math.ceil(filteredEstates.length / estatesPerPage);
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <main className="text-primary">
      <h1 className="text-4xl md:text-5xl font-bold px-5 my-4">
        Propiedades en venta o alquiler
      </h1>
      <p className="text-lg p-5">
        Descubre una amplia selección de propiedades que se adaptan a tus
        necesidades y preferencias. Explora detalles esenciales como la
        ubicación, el precio y las características de cada propiedad para
        ayudarte a tomar decisiones informadas. Cada Propiedad incluye una
        galería de fotos, una descripción detallada y datos relevantes como el
        tamaño, número de habitaciones entre otros. Con nuestras opciones de
        búsqueda y filtros avanzados, encontrar la propiedad ideal es más fácil
        que nunca. ¡Encuentra el espacio perfecto para tu próximo hogar o
        inversión!
      </p>

      {/* Este apartado muestra las ultimas 5 propiedades */}
      <section>
        <h2 className="text-4xl font-bold text-center">
          Publicadas recientemente
        </h2>
        {estates.length >= 5 ? (
          <CarouselOfEstates estates={estates.slice(-5)} />
        ) : (
          <div className="flex justify-evenly">
            {estates.map((estate) => (
              <EstateCard key={estate.id} data={estate} />
            ))}
          </div>
        )}
      </section>

      {/* Filtro de propiedades y amenidades */}
      <section className="my-8 p-4 bg-gray-100 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold mb-4 text-center bg-white rounded-sm p-2">
          Todas las propiedades
        </h2>
        <h2 className="text-2xl font-bold mb-4">Filtros de propiedades</h2>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Filtro de status */}
          <select
            className="bg-white border border-primary rounded-md shadow-lg p-2"
            name="estatus"
            id="estatus"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">Mostrar todas</option>
            <option value="VENTAS">Ventas</option>
            <option value="ALQUILER">Alquileres</option>
          </select>

          {/* Filtros de amenidades */}
          <input
            type="number"
            placeholder="Nº de Baños"
            className="bg-white border border-primary rounded-md shadow-lg p-2"
            value={numBathrooms ?? ""}
            onChange={(e) =>
              setNumBathrooms(e.target.value ? Number(e.target.value) : null)
            }
          />
          <input
            type="number"
            placeholder="Nº de Jardines"
            className="bg-white border border-primary rounded-md shadow-lg p-2"
            value={numGardens ?? ""}
            onChange={(e) =>
              setNumGardens(e.target.value ? Number(e.target.value) : null)
            }
          />
          <input
            type="number"
            placeholder="Nº de Parqueos"
            className="bg-white border border-primary rounded-md shadow-lg p-2"
            value={numParkings ?? ""}
            onChange={(e) =>
              setNumParkings(e.target.value ? Number(e.target.value) : null)
            }
          />
          <input
            type="number"
            placeholder="Nº de Habitaciones"
            className="bg-white border border-primary rounded-md shadow-lg p-2"
            value={numRooms ?? ""}
            onChange={(e) =>
              setNumRooms(e.target.value ? Number(e.target.value) : null)
            }
          />
        </div>
      </section>

      {/* Mapeo de propiedades con paginación */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {currentEstates.length > 0 ? (
          currentEstates.map((estate) => (
            <EstateCard key={estate.id} data={estate} />
          ))
        ) : (
          <p className="text-center text-primary text-2xl col-span-3 my-5">
            No hay propiedades con ese filtro :(
          </p>
        )}
      </section>

      {/* Controles de paginación */}
      <div className="flex justify-center items-center mt-5">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-2 bg-primary text-white rounded-md"
        >
          Anterior
        </button>
        <span className="text-lg">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-2 bg-primary text-white rounded-md"
        >
          Siguiente
        </button>
      </div>
    </main>
  );
}
