import RealStateModal from "../../components/RealStateModal";
import useUserStore from "../../Store/UserStore";
import { FaPlusCircle } from "react-icons/fa";
import CarouselOfUserEstates from "../../components/EstatesComponents/CarouselOfUserEstates";
import { useState } from "react";

const RealStateCRUD = () => {
  const user = useUserStore((state: any) => state.user);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  //esto maneja el cierre de la modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <main>
      <h1 className="text-center text-4xl text-primary md:text-5xl font-bold my-4">
        Gestión de Propiedades
      </h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-secondary mb-5 text-white font-bold flex gap-3 text-center p-4 rounded-lg shadow-sm ml-10 hover:bg-green-500"
      >
        Nueva Propiedad
        <FaPlusCircle className="text-white text-xl" />
      </button>

      <CarouselOfUserEstates />
      {isModalOpen && <RealStateModal closeModal={handleCloseModal} />}
    </main>
  );
};

export default RealStateCRUD;
