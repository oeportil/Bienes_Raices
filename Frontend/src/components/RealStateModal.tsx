import { useState, ChangeEvent, FormEvent } from "react";
import {
  FaWindowClose,
  FaBath,
  FaRulerCombined,
  FaParking,
  FaBed,
  FaTree,
} from "react-icons/fa";
import Slider from "react-slick";
import useUserStore from "../Store/UserStore";
import axios from "axios";
import { RealStateMessage } from "../types";
import { toast } from "react-toastify";

type RealStateModalProps = {
  closeModal: () => void;
};

const RealStateFormModal = ({ closeModal }: RealStateModalProps) => {
  const user = useUserStore((state: any) => state.user);
  const [formData, setFormData] = useState({
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
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast.warn("Solo se permite un máximo de 5 imágenes.");
      return;
    }
    setImages((prevImages) => [...prevImages, ...files]);
    setPreviews((prevPreviews) => [
      ...prevPreviews,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validación de campos obligatorios
    if (Object.values(formData).some((field) => !field)) {
      toast.warn("Todos los campos deben estar completos.");
      return;
    }
    if (images.length === 0) {
      toast.warn("Debe subir al menos una imagen.");
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append(
      "realstate",
      JSON.stringify({
        user_id: user.id,
        name: formData.name,
        description: formData.description,
        direction: formData.direction,
        phone: formData.phone,
        email: formData.email,
        price: parseFloat(formData.price),
        status: formData.status,
      })
    );

    dataToSend.append(
      "amenitie",
      JSON.stringify({
        wc: parseInt(formData.wc),
        dimension: parseFloat(formData.dimension),
        parking: parseInt(formData.parking),
        rooms: parseInt(formData.rooms),
        gardens: parseInt(formData.gardens),
      })
    );
    images.forEach((image) => dataToSend.append("images", image));

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/realstates`;
      const { data } = await axios.post<RealStateMessage>(url, dataToSend);
      toast.success(data.message);
      closeModal();
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.";
      toast.error(message);
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <dialog open className="modal">
      <div className="modal-box w-full max-w-6xl bg-gray-100 text-primary rounded-lg shadow-xl">
        <form onSubmit={handleSubmit}>
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={closeModal}
          >
            <FaWindowClose className="text-4xl text-red-500 hover:text-red-600" />
          </button>
          <h2 className="text-2xl font-bold mb-4">
            Agrega los datos de tu propiedad
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["name", "direction", "phone", "email", "price"].map((field) => (
              <input
                key={field}
                type={field === "price" ? "number" : "text"}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="input input-bordered w-full bg-white"
                onChange={handleInputChange}
                required
              />
            ))}
            <select
              name="status"
              className="select select-bordered w-full bg-white"
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione el estado</option>
              <option value="VENTAS">Venta</option>
              <option value="ALQUILER">Alquiler</option>
              <option value="SUBASTA">Subasta</option>
            </select>
            <textarea
              name="description"
              placeholder="Descripción"
              className="textarea textarea-bordered w-full max-h-20 min-h-14 bg-white"
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <div className="mt-4">
            <label className="label font-semibold">Amenidades</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "wc", icon: FaBath, placeholder: "Número de baños" },
                {
                  name: "dimension",
                  icon: FaRulerCombined,
                  placeholder: "Dimensión (m²)",
                },
                { name: "parking", icon: FaParking, placeholder: "Parqueos" },
                { name: "rooms", icon: FaBed, placeholder: "Habitaciones" },
                { name: "gardens", icon: FaTree, placeholder: "Jardines" },
              ].map(({ name, icon: Icon, placeholder }) => (
                <div key={name} className="flex items-center gap-2">
                  <Icon className="text-lg" />
                  <input
                    type="number"
                    name={name}
                    defaultValue={0}
                    min={0}
                    placeholder={placeholder}
                    className="input input-bordered w-full bg-white"
                    onChange={handleInputChange}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="label">Cargar imágenes (1-5)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="file-input w-full bg-white"
              onChange={handleFileChange}
              required
            />
            {previews.length > 0 && (
              <Slider {...settings} className="mt-4 w-2/3 md:w-1/2 mx-auto">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-auto h-96"
                    />
                    <button
                      type="button"
                      className="btn btn-circle btn-xs btn-error absolute top-2 right-2"
                      onClick={() => handleRemoveImage(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </Slider>
            )}
          </div>

          <button
            type="submit"
            className="p-2 rounded-sm font-bold bg-accent hover:bg-yellow-500 w-full mt-6"
          >
            Enviar
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default RealStateFormModal;
