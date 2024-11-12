import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  FaWindowClose,
  FaBath,
  FaRulerCombined,
  FaParking,
  FaBed,
  FaTree,
} from "react-icons/fa";
import Slider from "react-slick";

type RealStateModalprops = {
  closeModal: () => void;
};

const RealStateFormModal = ({ closeModal }: RealStateModalprops) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    direction: "",
    phone: "",
    email: "",
    rlst_url: "",
    price: "",
    status: "",
    amenitieId: "",
    user_id: "",
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
      alert("Debe tener un máximo de 5 imágenes.");
      return;
    }
    setImages((prevImages) => [...prevImages, ...files]);
    setPreviews((prevPreviews) => [
      ...prevPreviews,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validación de campos obligatorios
    for (const key in formData) {
      if (!formData[key as keyof typeof formData]) {
        alert("Todos los campos deben estar completos.");
        return;
      }
    }
    if (images.length === 0) {
      alert("Debe subir al menos una imagen.");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    images.forEach((file) => data.append("images", file));

    console.log("Datos del formulario enviados.");
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
            <input
              type="text"
              name="name"
              placeholder="Nombre de la propiedad"
              className="input input-bordered w-full bg-white"
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="direction"
              placeholder="Dirección"
              className="input input-bordered w-full bg-white"
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Teléfono"
              className="input input-bordered w-full bg-white"
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered w-full bg-white"
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Precio"
              className="input input-bordered w-full bg-white"
              step="0.01"
              onChange={handleInputChange}
              required
            />
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
            <input
              type="number"
              name="amenitieId"
              placeholder="ID de Amenitie"
              className="input input-bordered w-full bg-white"
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="user_id"
              placeholder="ID del Usuario"
              className="input input-bordered w-full bg-white"
              onChange={handleInputChange}
              required
            />
            <textarea
              name="description"
              placeholder="Descripción"
              className="textarea textarea-bordered w-full bg-white"
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <div className="mt-4">
            <label className="label font-semibold">Amenidades</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <FaBath className="text-lg" />
                <input
                  type="number"
                  name="wc"
                  placeholder="Número de baños"
                  className="input input-bordered w-full bg-white"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <FaRulerCombined className="text-lg" />
                <input
                  type="number"
                  name="dimension"
                  placeholder="Dimensión (m²)"
                  className="input input-bordered w-full bg-white"
                  step="0.01"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <FaParking className="text-lg" />
                <input
                  type="number"
                  name="parking"
                  placeholder="Número de parqueos"
                  className="input input-bordered w-full bg-white"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <FaBed className="text-lg" />
                <input
                  type="number"
                  name="rooms"
                  placeholder="Número de habitaciones"
                  className="input input-bordered w-full bg-white"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <FaTree className="text-lg" />
                <input
                  type="number"
                  name="gardens"
                  placeholder="Número de jardines"
                  className="input input-bordered w-full bg-white"
                  onChange={handleInputChange}
                  required
                />
              </div>
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
                      className="w-full h-auto"
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

          <button type="submit" className="btn btn-primary w-full mt-6">
            Enviar
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default RealStateFormModal;
