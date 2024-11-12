import React, { useState } from "react";
import axios from "axios";

const RealStateModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [realState, setRealState] = useState(initialData.realstate || {});
  const [amenitie, setAmenitie] = useState(initialData.amenitie || {});
  const [images, setImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRealState((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenitieChange = (e) => {
    const { name, value } = e.target;
    setAmenitie((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("realstate", JSON.stringify(realState));
    formData.append("amenitie", JSON.stringify(amenitie));
    Array.from(images).forEach((image) => formData.append("images", image));

    try {
      if (realState.id) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/realstates/${realState.id}`,
          formData
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/realstates`,
          formData
        );
      }
      onSave();
    } catch (error) {
      console.error("Error al guardar la propiedad:", error);
    }
  };

  return (
    isOpen && (
      <div className="modal">
        <form onSubmit={handleSubmit}>
          <h2>{realState.id ? "Editar Propiedad" : "Nueva Propiedad"}</h2>

          <input
            type="text"
            name="name"
            value={realState.name || ""}
            placeholder="Nombre de la Propiedad"
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="description"
            value={realState.description || ""}
            placeholder="Descripción"
            onChange={handleInputChange}
          />
          {/* Campos de Amenitie */}
          <input
            type="number"
            name="wc"
            value={amenitie.wc || ""}
            placeholder="Baños"
            onChange={handleAmenitieChange}
          />
          <input
            type="number"
            name="rooms"
            value={amenitie.rooms || ""}
            placeholder="Habitaciones"
            onChange={handleAmenitieChange}
          />
          <input type="file" multiple onChange={handleImageChange} />
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    )
  );
};

export default RealStateModal;
