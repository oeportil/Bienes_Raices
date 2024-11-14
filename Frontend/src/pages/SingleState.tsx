import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { RealState } from "../types";

const SingleState = () => {
  const [state, setState] = useState<RealState>();
  const { id } = useParams();

  const data = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/realstates/${id}`;
      const { data } = await axios.get(url);
      setState(data);
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error al obtener la propiedad");
    }
  };

  useEffect(() => {
    data();
  }, [id]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Property Header */}
        <div className="relative">
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/realstates/img/${
              state?.images[0].id
            }`}
            alt={state?.name}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <div className="absolute bottom-4 px-5 text-white bg-primary bg-opacity-40 w-full">
            <h1 className="text-4xl font-bold">{state?.name}</h1>
            <p className="text-lg">{state?.description}</p>
          </div>
        </div>

        {/* Property Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-700">Detalles</h2>
              <ul className="mt-4 space-y-2">
                <li className="flex justify-between">
                  <span className="font-medium text-gray-500">Dirección:</span>
                  <span>{state?.direction}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-500">Teléfono:</span>
                  <span>{state?.phone}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-500">Email:</span>
                  <span>{state?.email}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-500">Precio:</span>
                  <span>${state?.price}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-500">Estado:</span>
                  <span>{state?.status}</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-700">
                Amenidades
              </h2>
              <ul className="mt-4 space-y-2">
                <li className="flex justify-between">
                  <span className="font-medium text-gray-500">Baños:</span>
                  <span>{state?.amenitie?.wc}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-500">
                    Dimensión (m²):
                  </span>
                  <span>{state?.amenitie?.dimension}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-500">Parqueos:</span>
                  <span>{state?.amenitie?.parking}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-500">
                    Habitaciones:
                  </span>
                  <span>{state?.amenitie?.rooms}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-gray-500">Jardines:</span>
                  <span>{state?.amenitie?.gardens}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Images Slider */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Galería
            </h2>
            <div className="flex gap-4 overflow-x-auto">
              {state?.images?.map((image: any, index: number) => (
                <img
                  key={index}
                  src={`${import.meta.env.VITE_BACKEND_URL}/realstates/img/${
                    image?.id
                  }`}
                  alt={`Image ${index + 1}`}
                  className="w-64 h-64 object-cover rounded-lg shadow-lg"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleState;
