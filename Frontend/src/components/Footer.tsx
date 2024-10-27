import React from "react";
import { Link } from "react-router-dom";
import Logo from '../assets/logo.png'

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo and description */}
        <div className="flex flex-col items-center md:items-start">
          <img src={Logo} alt="Logo" className="h-24 w-24 mb-4" />
          <p className="text-center md:text-left">
            Jaffar es una plataforma confiable para encontrar propiedades de
            ensueño. Contáctanos para más información.
          </p>
        </div>

        {/* Quick links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-xl font-semibold mb-4">Enlaces Rápidos</h3>
          <ul>
            <li className="mb-2">
              <Link to="/" className="hover:text-gray-500">
                Inicio
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/properties" className="hover:text-gray-500">
                Propiedades
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/login" className="hover:text-gray-500">
                Inicio de Sesión
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/register" className="hover:text-gray-500">
                Registrarse
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact information */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-xl font-semibold mb-4">Contacto</h3>
          <p>
            <strong>Teléfono:</strong> +503 1234 5678
          </p>
          <p>
            <strong>Email:</strong> contacto@boxsafe.com
          </p>
          <p>
            <strong>Dirección:</strong> Calle Falsa 123, San Salvador, El
            Salvador
          </p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 border-t border-red-950 pt-4 text-center">
        <p>© 2024 Jaffar. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
