import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import image from "../assets/loginImage.png";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación simple de que los campos no estén vacíos
    if (!formData.email || !formData.password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setError("");
    console.log("Formulario enviado:", formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex max-w-3xl w-full">
        {/* Left Image Section */}
        <div className="w-1/2 hidden md:block">
          <img
            src={image}
            alt="Hombre en computadora"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-primary">
            Iniciar Sesión
          </h2>

          {error && (
            <p className="text-white bg-red-500 font-bold p-3 rounded-lg text-center mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-lg mb-2 text-primary"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-secondary"
                placeholder="Ingresa tu correo"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-lg mb-2 text-primary"
              >
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
                className="absolute bottom-5 right-3 flex items-center text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-secondary text-white font-semibold py-3 rounded hover:bg-green-600 transition duration-300"
            >
              Iniciar Sesión
            </button>
          </form>
          <h3 className="my-5">
            ¿no tienes una cuenta?{" "}
            <Link className="text-secondary" to="/registro">
              Crea una
            </Link>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Login;
