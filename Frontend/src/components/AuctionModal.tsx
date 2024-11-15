import { useState, ChangeEvent, useEffect } from "react";
import { parseISO, set, isBefore, isAfter, addHours } from "date-fns";
import {
  toZonedTime as utcToZonedTime,
  fromZonedTime as zonedTimeToUtc,
} from "date-fns-tz";
import { FaWindowClose } from "react-icons/fa";
import useUserStore from "../Store/UserStore";
import axios from "axios";
import { toast } from "react-toastify";

type RealStateModalProps = {
  closeModal: () => void;
  editmode: boolean;
  auctionData: any;
};

const AuctionModal = ({
  closeModal,
  editmode,
  auctionData,
}: RealStateModalProps) => {
  const user = useUserStore((state: any) => state.user);
  const [formData, setFormData] = useState({
    startingPrice: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });
  const [realstates, setRealStates] = useState(Array<any>);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    async function GetRealStates() {
      const url = `${import.meta.env.VITE_BACKEND_URL}/auction/realstate/${
        user.id
      }`;
      const { data } = await axios.get(url);
      setRealStates(data);
    }
    if (!editmode) {
      GetRealStates();
    }
  }, []);

  useEffect(() => {
    if (editmode && auctionData) {
      setFormData({
        startingPrice: auctionData.startingPrice.toString(),
        startDate: auctionData.startDate.split("T")[0],
        startTime: auctionData.startDate.split("T")[1].substring(0, 5),
        endDate: auctionData.endDate.split("T")[0],
        endTime: auctionData.endDate.split("T")[1].substring(0, 5),
      });
    }
  }, [editmode, auctionData]);

  function handleEdit(auctionId: number) {
    const { startingPrice, startDate, startTime, endDate, endTime } = formData;

    // Validación de campos obligatorios
    if (Object.values(formData).some((field) => !field)) {
      toast.warn("Todos los campos deben estar completos.");
      return;
    }

    // Zona horaria de la subasta
    const timeZone = "America/El_Salvador";

    // Combina fecha y hora de inicio
    const startDateTime = utcToZonedTime(
      set(parseISO(startDate), {
        hours: parseInt(startTime.split(":")[0]) - 6,
        minutes: parseInt(startTime.split(":")[1]),
        seconds: 0,
      }),
      timeZone
    );

    // Combina fecha y hora de fin
    const endDateTime = utcToZonedTime(
      set(parseISO(endDate), {
        hours: parseInt(endTime.split(":")[0]) - 6,
        minutes: parseInt(endTime.split(":")[1]),
        seconds: 0,
      }),
      timeZone
    );

    // Validación de fechas
    const now = new Date();
    if (
      isBefore(startDateTime, addHours(now, -6)) ||
      isBefore(endDateTime, addHours(now, -6))
    ) {
      toast.error("Las fechas no pueden ser en el pasado.");
      return;
    }
    if (isAfter(startDateTime, endDateTime)) {
      toast.error(
        "La fecha y hora de inicio no pueden ser mayores que la de fin."
      );
      return;
    }

    axios
      .patch(`${import.meta.env.VITE_BACKEND_URL}/auction/${auctionId}`, {
        startingPrice: parseFloat(startingPrice),
        startDate: zonedTimeToUtc(startDateTime, timeZone).toISOString(),
        endDate: zonedTimeToUtc(endDateTime, timeZone).toISOString(),
      })
      .then((response) => {
        toast.success(
          response.data.message || "Fecha de la subasta actualizada con éxito"
        );
        closeModal();
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          error.response?.data?.message ||
            "Error al actualizar la fecha de la subasta"
        );
      });
  }

  function handleSubmit(realStateId: number) {
    const { startingPrice, startDate, startTime, endDate, endTime } = formData;

    // Validación de campos obligatorios
    if (Object.values(formData).some((field) => !field)) {
      toast.warn("Todos los campos deben estar completos.");
      return;
    }

    // Zona horaria de la subasta
    const timeZone = "America/El_Salvador";

    // Combina fecha y hora de inicio
    const startDateTime = utcToZonedTime(
      set(parseISO(startDate), {
        hours: parseInt(startTime.split(":")[0]) - 6,
        minutes: parseInt(startTime.split(":")[1]),
        seconds: 0,
      }),
      timeZone
    );

    // Combina fecha y hora de fin
    const endDateTime = utcToZonedTime(
      set(parseISO(endDate), {
        hours: parseInt(endTime.split(":")[0]) - 6,
        minutes: parseInt(endTime.split(":")[1]),
        seconds: 0,
      }),
      timeZone
    );

    // Validación de fechas
    const now = new Date();
    if (isBefore(startDateTime, now) || isBefore(endDateTime, now)) {
      toast.error("Las fechas no pueden ser en el pasado.");
      return;
    }
    if (isAfter(startDateTime, endDateTime)) {
      toast.error(
        "La fecha y hora de inicio no pueden ser mayores que la de fin."
      );
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/auction`, {
        realStateId,
        startingPrice: parseFloat(startingPrice),
        startDate: zonedTimeToUtc(startDateTime, timeZone).toISOString(),
        endDate: zonedTimeToUtc(endDateTime, timeZone).toISOString(),
      })
      .then((response) => {
        toast.success(response.data.message || "Subasta creada con éxito");
        closeModal();
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Error al crear la subasta"
        );
      });
  }

  return (
    <dialog open className="modal">
      <div className="modal-box w-full max-w-6xl bg-primary text-white rounded-lg shadow-xl">
        <form>
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
            <label className="block">
              Fecha de Inicio
              <input
                type="date"
                name="startDate"
                placeholder="Fecha de Inicio"
                className="input input-bordered w-full bg-primary"
                onChange={handleInputChange}
                value={formData.startDate || ""}
                required
              />
            </label>
            <label className="block">
              Hora de Inicio
              <input
                type="time"
                name="startTime"
                placeholder="Hora de Inicio"
                className="input input-bordered w-full bg-primary"
                onChange={handleInputChange}
                value={formData.startTime || ""}
                required
              />
            </label>
            <label className="block">
              Fecha de Fin
              <input
                type="date"
                name="endDate"
                placeholder="Fecha de Fin"
                className="input input-bordered w-full bg-primary"
                onChange={handleInputChange}
                value={formData.endDate || ""}
                required
              />
            </label>
            <label className="block">
              Hora de Fin
              <input
                type="time"
                name="endTime"
                placeholder="Hora de Fin"
                className="input input-bordered w-full bg-primary"
                onChange={handleInputChange}
                value={formData.endTime || ""}
                required
              />
            </label>
            <label className="block">
              Precio Inicial
              <input
                type="number"
                name="startingPrice"
                placeholder="Precio Inicial"
                className="input input-bordered w-full bg-primary"
                onChange={handleInputChange}
                value={formData.startingPrice || ""}
                required
              />
            </label>
          </div>
          {editmode ? (
            <button
              type="button"
              className="p-2 rounded-sm font-bold bg-accent hover:bg-yellow-500 w-full mt-6"
              onClick={() => handleEdit(auctionData.id)}
            >
              Editar
            </button>
          ) : realstates.length > 0 ? (
            realstates.map((realstate) => (
              <div className="overflow-x-auto overflow-y-auto h-96">
                <table className="table">
                  <thead>
                    <tr className=" text-white">
                      <th>Imagen</th>
                      <th>Nombre</th>
                      <th>Descripcion</th>
                      <th>Precio</th>
                      <th>Elegir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {realstates.map((state) => (
                      <tr key={state.id}>
                        <td>
                          <div className="avatar">
                            <div className="mask mask-squircle h-20 w-20">
                              <img
                                src={`${
                                  import.meta.env.VITE_BACKEND_URL
                                }/realstates/img/${state.images[0].id}`}
                                alt="Avatar Tailwind CSS Component"
                              />
                            </div>
                          </div>{" "}
                        </td>
                        <td>
                          <h1 className=" text-lg">
                            <strong>{state.name}</strong>
                          </h1>

                          <span className="badge bg-accent text-black badge-sm">
                            Phone: {state.phone}
                          </span>
                          <br />
                          <span className="badge  bg-secondary text-black badge-sm  overflow-x-hidden overflow-y-hidden">
                            {state.email}
                          </span>
                        </td>
                        <td>
                          <h1 className=" text-md">
                            <strong>
                              {state.description.substring(0, 250)}
                            </strong>
                          </h1>
                        </td>
                        <td>
                          <h1 className=" text-md">
                            <strong>${state.price}</strong>
                          </h1>
                        </td>
                        <td>
                          <button
                            className="p-2 rounded-sm font-bold bg-accent hover:bg-yellow-500 w-full my-6"
                            onClick={() => handleSubmit(state.id)}
                          >
                            Crear Subasta
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <p className="text-red-500">
              No tienes propiedades disponibles para subastar.
            </p>
          )}
        </form>
      </div>
    </dialog>
  );
};

export default AuctionModal;
