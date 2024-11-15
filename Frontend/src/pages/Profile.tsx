import { useState, useEffect } from "react";
import axios from "axios";
import useUserStore from "../Store/UserStore";
import { toast } from "react-toastify";

export default function Profile() {
  const user = useUserStore((state: any) => state.user);
  const setUser = useUserStore((state: any) => state.setUser);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  const handleUpdateUser = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/users/${user.id}`,
        { name, email }
      );
      setUser(response.data.user);
      toast.success("Datos actualizados con éxito");
    } catch (error) {
      toast.error("Error al actualizar usuario");
      console.error("Error al actualizar usuario:", error);
      alert("Error al actualizar usuario");
    }
  };

  const handleChangePassword = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/users/${user.id}`,
        { password }
      );
      toast.success("Contraseña actualizada con éxito");
      setIsPasswordModalOpen(false);
    } catch (error) {
      toast.error("Error al actualizar contraseña");
      console.error("Error al cambiar contraseña:", error);
    }
  };

  return (
    <section className="bg-primary text-white py-8 px-4 md:px-6 lg:px-12 rounded-xl my-10 mx-auto max-w-full md:max-w-xl lg:max-w-3xl">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center md:text-left">
          Perfil de Usuario
        </h2>

        {/* Formulario de actualización */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

        <button
          onClick={handleUpdateUser}
          className="w-full bg-secondary hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Actualizar Datos
        </button>

        <button
          onClick={() => setIsPasswordModalOpen(true)}
          className="w-full mt-4 bg-accent hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          Cambiar Contraseña
        </button>

        {/* Modal de cambio de contraseña */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-primary text-white rounded-lg p-6 w-11/12 max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Cambiar Contraseña
              </h3>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nueva contraseña"
                className="w-full p-2 rounded bg-gray-700 text-white mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 rounded bg-red-700 hover:bg-red-900 text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleChangePassword}
                  className="px-4 py-2 rounded bg-secondary hover:bg-green-700 text-white"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
