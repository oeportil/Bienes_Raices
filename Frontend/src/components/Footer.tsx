import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import useUserStore from "../Store/UserStore"; // Importa tu store de Zustand

const Footer: React.FC = () => {
  // Obtén el estado del usuario desde Zustand
  const user = useUserStore((state) => state.user); // Asumiendo que "user" guarda la info del usuario logueado

  return (
    <footer className="bg-primary text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo and description */}
        <div className="flex flex-col items-center md:items-start">
          <img src={Logo} alt="Logo" className="h-24 w-24 mb-4" />
          <p className="text-center md:text-left">
            Box Safe es una plataforma confiable para encontrar propiedades de
            ensueño. Contáctanos para más información.
          </p>
        </div>

        {/* Quick links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-xl font-semibold mb-4">Enlaces Rápidos</h3>
          <ul>
            <li className="mb-2">
              <Link to="/" className="hover:text-secondary">
                Inicio
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/propiedades" className="hover:text-secondary">
                Propiedades
              </Link>
            </li>
            {/* Condicionalmente muestra los enlaces dependiendo si el usuario está logueado */}
            {!user ? (
              <>
                <li className="mb-2">
                  <Link to="/inicio-sesion" className="hover:text-secondary">
                    Inicio de Sesión
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/registro" className="hover:text-secondary">
                    Registrarse
                  </Link>
                </li>
              </>
            ) : (
              <li className="mb-2">
                <Link to="/perfil" className="hover:text-secondary">
                  Perfil
                </Link>
              </li>
            )}
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
      <div className="mt-8 border-t border-secondary pt-4 text-center">
        <p>© 2024 Box Safe. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
