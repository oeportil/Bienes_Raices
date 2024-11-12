import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Slider from "react-slick";
import PropertyCard from "../../components/PropertyCard";
import RealStateModal from "../../components/RealStateModal";
import useUserStore from "../../Store/UserStore";

const RealStateCRUD = () => {
  const user = useUserStore((state: any) => state.user);
  const [realStates, setRealStates] = useState([]);
  const [selectedRealState, setSelectedRealState] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<RealState | null>(
    null
  );

  useEffect(() => {
    if (user) fetchProperties();
  }, [user]);

  const fetchProperties = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/realstates/list/${user?.id}`
      );
      const data = await response.json();
      setRealStates(data);
    } catch (error) {
      toast.error("Error al cargar propiedades");
    }
  };

  const handleAdd = () => {
    setSelectedRealState(null);
    setIsModalOpen(true);
  };

  const handleEdit = (realState) => {
    setSelectedRealState(realState);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar esta propiedad?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/realstates/${id}`
        );
        fetchProperties();
      } catch (error) {
        console.error("Error al eliminar la propiedad:", error);
      }
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchProperties();
  };

  return (
    <div className=" h-96">
      <h1>Gestión de Propiedades</h1>
      <button onClick={handleAdd}>Nueva Propiedad</button>
      <Slider {...{ slidesToShow: 3, infinite: false }}>
        {realStates.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </Slider>

      <RealStateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedRealState || {}}
      />
    </div>
  );
};

export default RealStateCRUD;
