import { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
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
  actFunction?: () => void;
  refm?: React.RefObject<HTMLDialogElement>;
  formState?: any;
  edit?: boolean;
};

const RealStateFormModal = ({
  closeModal,
  actFunction,
  refm,
  formState,
  edit,
}: RealStateModalProps) => {
  const user = useUserStore((state: any) => state.user);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    direction: "",
    phone: "",
    email: "",
    price: "",
    status: "",
    wc: "0",
    dimension: "0",
    parking: "0",
    rooms: "0",
    gardens: "0",
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const defaultRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (edit) {
      async function fetchImagePreviews() {
        if (!formState?.images || formState.images.length === 0) {
          setPreviews([]);
          return;
        }

        try {
          // Genera las promesas de cada llamada a la API usando los IDs de las imágenes
          const previewPromises = formState.images.map(async (image: any) => {
            const response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/realstates/img/${image.id}`,
              { responseType: "blob" }
            );
            return URL.createObjectURL(response.data); // Asegúrate de que la respuesta contenga el URL de la imagen
          });

          // Espera a que todas las promesas se resuelvan y luego establece el estado con los resultados
          const previewUrls = await Promise.all(previewPromises);
          setPreviews(previewUrls);
        } catch (error) {
          console.error("Error al cargar las imágenes:", error);
          toast.error("Error al cargar las imágenes");
        }
      }
      setFormData({
        name: formState?.name || "",
        description: formState?.description || "",
        direction: formState?.direction || "",
        phone: formState?.phone || "",
        email: formState?.email || "",
        price: formState?.price || "",
        status: formState?.status || "",
        wc: formState?.amenitie.wc || "0",
        dimension: formState?.amenitie.dimension || "0",
        parking: formState?.amenitie.parking || "0",
        rooms: formState?.amenitie.rooms || "0",
        gardens: formState?.amenitie.gardens || "0",
      });
      // Inicializar previews con las URLs de imágenes existentes en el modo editar

      fetchImagePreviews();
    } else {
      // Limpiar el formulario y las imágenes al agregar una nueva propiedad
      setFormData({
        name: "",
        description: "",
        direction: "",
        phone: "",
        email: "",
        price: "",
        status: "",
        wc: "0",
        dimension: "0",
        parking: "0",
        rooms: "0",
        gardens: "0",
      });
      setImages([]);
      setPreviews([]);
    }
  }, [edit, formState]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? (value ? parseFloat(value) : "") : value,
    });
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

    // Validar que todos los campos estén completos
    if (Object.values(formData).some((field) => !field)) {
      toast.warn("Todos los campos deben estar completos.");
      return;
    }
    if (!edit && images.length === 0) {
      toast.warn("Debe subir al menos una imagen.");
      return;
    }

    try {
      if (edit) {
        // Editar datos de la propiedad
        const realstate = {
          user_id: user.id,
          name: formData.name,
          description: formData.description,
          direction: formData.direction,
          phone: formData.phone,
          email: formData.email,
          price: parseFloat(formData.price),
          status: formData.status,
        };

        const amenitie = {
          wc: parseInt(formData.wc),
          dimension: parseFloat(formData.dimension),
          parking: parseInt(formData.parking),
          rooms: parseInt(formData.rooms),
          gardens: parseInt(formData.gardens),
        };
        // Enviar datos al endpoint para editar la propiedad
        const urlEdit = `${import.meta.env.VITE_BACKEND_URL}/realstates/${
          formState.id
        }`;
        const responseEdit = await axios.patch(urlEdit, {
          amenitie,
          realstate,
        });
        toast.success(responseEdit.data.message);

        // Editar imágenes solo si hay nuevas
        if (images.length > 0) {
          const imgData = new FormData();
          images.forEach((image) => imgData.append("images", image));

          const urlImgEdit = `${
            import.meta.env.VITE_BACKEND_URL
          }/realstates/img/${formState.images.id}`;
          const responseImgEdit = await axios.patch(urlImgEdit, imgData);
          toast.success(responseImgEdit.data.message);
        }
      } else {
        // Crear nueva propiedad
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

        const urlCreate = `${import.meta.env.VITE_BACKEND_URL}/realstates`;
        const responseCreate = await axios.post<RealStateMessage>(
          urlCreate,
          dataToSend
        );
        toast.success(responseCreate.data.message);
      }

      // Ejecutar función adicional y cerrar modal
      actFunction?.();
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
  console.log(previews[0]);
  return (
    <dialog
      id="my_modal_1"
      open
      className="modal z-50"
      ref={refm ?? defaultRef}
    >
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
            {edit ? "Edita" : "Agrega"} los datos de tu propiedad
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
                value={formData[`${field}`]}
                required
              />
            ))}
            <select
              name="status"
              className="select select-bordered w-full bg-white"
              onChange={handleInputChange}
              value={formData.status}
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
              value={formData.description}
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
                    value={formData[name]}
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
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 rounded-full p-1"
                    >
                      <FaWindowClose className="text-white" />
                    </button>
                  </div>
                ))}
              </Slider>
            )}
          </div>

          <div className="modal-action">
            <button
              type="submit"
              className="bg-accent text-white font-bold p-2 rounded-sm hover:bg-yellow-500 w-full"
            >
              {edit ? "Actualizar propiedad" : "Agregar propiedad"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default RealStateFormModal;
