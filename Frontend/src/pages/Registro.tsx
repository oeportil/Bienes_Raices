import axios from "axios";
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { RegisterResponse } from "../types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Registro: React.FC = () => {
  // UseNavigate para redirigir al login cuando se registre alguien
  const navigate = useNavigate();
  // State para los datos de registro
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  // States generales para el componente
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [errors, setErrors] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handler para los datos que se guardan en el state de datos de registro (el state se llama formData)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // La función que se encarga de la validación de campos vacíos
  const validateForm = () => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.repeatPassword
    ) {
      // Si hay errores, se setea el valor en el state para que se muestre la alerta y se interrumpe el flujo
      setErrors("Todos los campos son obligatorios.");
      return false;
    }
    if (formData.password !== formData.repeatPassword) {
      setErrors("Las contraseñas no coinciden.");
      return false;
    }
    // Si no hay errores, se setea el valor en el state para que no se muestre la alerta y se continúa con el flujo
    setErrors("");
    return true;
  };

  // Función que se encarga del registro
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true); // Deshabilita el botón mientras se procesa la solicitud
      const newUserData = {
        name: formData.username,
        email: formData.email,
        password: formData.password,
      };

      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/users/register`;
        const { data } = await axios.post<RegisterResponse>(url, newUserData);

        // Si el status es true, redirecciona al login
        if (data.status) {
          toast.success(data.message);
          navigate("/inicio-sesion");
        } else {
          toast.error(data.message); // Muestra el mensaje de error si el registro falla en el servidor
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          // Accede al mensaje de error del backend
          const backendMessage = error.response.data.message;
          toast.error(backendMessage); // Muestra el mensaje en un toast
        } else {
          // Si el error no es de Axios o no tiene respuesta, muestra un mensaje genérico
          toast.error(
            "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
          );
        }
        console.error(error);
      } finally {
        setIsSubmitting(false); // Habilita el botón después de la solicitud
      }
    }
  };

  return (
    <main className="bg-white text-primary p-8 rounded-lg shadow-lg w-4/5 my-10 md:w-1/2 mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Registro</h2>
      <div className="flex justify-center">
        <FaHome className="text-7xl" />
      </div>

      {errors && (
        <p className="text-white font-bold bg-red-500 rounded-lg p-3 text-center mb-4">
          {errors}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-lg mb-2">
            Nombre de Usuario
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-secondary"
            placeholder="Ingresa tu nombre de usuario"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-lg mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-secondary"
            placeholder="Ingresa tu email"
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="block text-lg mb-2">
            Contraseña
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-secondary"
            placeholder="Ingresa tu contraseña"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute bottom-5 right-3 text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="relative">
          <label htmlFor="repeatPassword" className="block text-lg mb-2">
            Confirmar Contraseña
          </label>
          <input
            type={showRepeatPassword ? "text" : "password"}
            id="repeatPassword"
            name="repeatPassword"
            value={formData.repeatPassword}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-secondary"
            placeholder="Confirma tu contraseña"
          />
          <button
            type="button"
            onClick={() => setShowRepeatPassword(!showRepeatPassword)}
            className="absolute bottom-5 right-3 text-gray-600"
          >
            {showRepeatPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-secondary text-white font-semibold py-3 rounded hover:bg-green-600 transition duration-300 disabled:bg-green-700"
        >
          {isSubmitting ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </main>
  );
};

export default Registro;
