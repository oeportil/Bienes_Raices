import axios from "axios";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Registro: React.FC = () => {
  //state para los datos de registro
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  //states generales para el componente
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [errors, setErrors] = useState("");

  //hanlder para los datos que se guardan en el state de datos de registro ( el state se llama formData )
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //La funcion que se encarga de la validación de campos vacios
  const validateForm = () => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.repeatPassword
    ) {
      //Si hay errores se setea el valor en el state para que se muestre la alerta y se interrumpe el flujo
      setErrors("Todos los campos son obligatorios.");
      return false;
    }
    if (formData.password !== formData.repeatPassword) {
      setErrors("Las contraseñas no coinciden.");
      return false;
    }
    //Si no hay errores se setea el valor en el state para que no se muestre la alerta y se continúa con el flujo
    setErrors("");
    return true;
  };

  //Función que se encarga del registro
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      //aca saque el repeat password
      const newUserData = {
        name: formData.username,
        email: formData.email,
        password: formData.password,
      };
      //acá ya se envian
      try {
        const registUser = async () => {
          const url = `${import.meta.env.VITE_BACKEND_URL}/users/register`;
          const { data } = await axios.post(url, newUserData);
          console.log(data);
        };
        registUser();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <main className="bg-white text-primary p-8 rounded-lg shadow-lg w-4/5 my-10 md:w-1/2 mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Registro</h2>
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
          className="w-full bg-secondary text-white font-semibold py-3 rounded hover:bg-green-600 transition duration-300"
        >
          Registrarse
        </button>
      </form>
    </main>
  );
};

export default Registro;
