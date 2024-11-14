import RealStateModal from "../../components/RealStateModal";
import useUserStore from "../../Store/UserStore";
import { FaPlusCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import EstateCard from "../../components/EstatesComponents/EstateCard";
import axios from "axios";
import { toast } from "react-toastify";
import { RealState } from "../../types";

const RealStateCRUD = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrow: true
  };
  const user = useUserStore((state: any) => state.user);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [estates, setEstates] = useState<RealState[]>([]);
  const [formDataedi, setFormDataedi] = useState({
    name: "",
    description: "",
    direction: "",
    phone: "",
    email: "",
    price: "",
    status: "",
    wc: "",
    dimension: "",
    parking: "",
    rooms: "",
    gardens: "",
  });
  const [edit, setEdit] = useState<boolean>(false);

  const data = async() => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/realstates/list/${user.id}`
      const {data} = await axios.get(url);
      setEstates(data);
    } catch (error) {
      toast.error("Hubo un error al obtener las propiedades");
    }
  }
  useEffect(() => {
    data();
  }, [])
  
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
        onClick={() => {setIsModalOpen(true); setEdit(false);}}
        className="bg-secondary mb-5 text-white font-bold flex gap-3 text-center p-4 rounded-lg shadow-sm ml-10 hover:bg-green-500"
      >
        Nueva Propiedad
        <FaPlusCircle className="text-white text-xl" />
      </button>
      {/*Acá falta el carousel si es lo que buscan */}
      <Slider {...settings}>
        {estates.map(est => (
          <EstateCard key={est.id} data={est} actFunction={data} setFormDataedi={setFormDataedi} setEdit={setEdit} setIsModalOpen={setIsModalOpen}/>
        ))}
          {/* <EstateCard /> */}
      </Slider>
      {isModalOpen && <RealStateModal closeModal={handleCloseModal} actFunction={data} formState={formDataedi} edit={edit}/>}
    </main>
  );
};

export default RealStateCRUD;
