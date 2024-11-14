import { useEffect, useState } from "react";
import { RealState } from "../types";
import { toast } from "react-toastify";
import axios from "axios";
import CarouselOfEstates from "../components/EstatesComponents/CarouselOfEstates";
import EstateCard from "../components/EstatesComponents/EstateCard"; // Asegúrate de importar EstateCard

export default function States() {
  const [estates, setEstates] = useState<RealState[]>([]);
  const [filteredEstates, setFilteredEstates] = useState<RealState[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL"); // Cambiado a "ALL" para la opción por defecto

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
    // Filtrar propiedades según el estatus seleccionado
    const filteredData = estates.filter(
      (item) =>
        (item.status === "VENTAS" || item.status === "ALQUILER") &&
        (filterStatus === "ALL" || item.status === filterStatus)
    );
    setFilteredEstates(filteredData);
  }, [filterStatus, estates]);

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
        <CarouselOfEstates estates={estates.slice(-5)} />
      </section>

      {/* Filtro de propiedades */}
      <section className="flex flex-col md:flex-row md:justify-evenly gap-5 my-5">
        <h2 className="text-4xl font-bold">Todas las propiedades</h2>
        <select
          className="bg-white border border-primary rounded-md shadow-lg"
          name="estatus"
          id="estatus"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">Mostrar todas</option>
          <option value="VENTAS">Ventas</option>
          <option value="ALQUILER">Alquileres</option>
        </select>
      </section>

      {/* Mapeo de propiedades */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEstates.map((estate) => (
          <EstateCard key={estate.id} data={estate} />
        ))}
      </section>
    </main>
  );
}
