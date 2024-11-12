import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import useUserStore from "../Store/UserStore";
import Logo from "../assets/logo.png";

const NavBar: React.FC = () => {
  const user = useUserStore((state) => state.user); // Solo el estado necesario
  const setUser = useUserStore((state) => state.setUser); // Solo la función

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    setUser(null); // Elimina el usuario del estado global
    navigate("/"); // Redirige al usuario a la página de inicio
  };

  const linkClass = (path: string) =>
    location.pathname === path
      ? "bg-secondary text-white"
      : "hover:text-accent";

  const buttonClass = (path: string) =>
    location.pathname === path
      ? "bg-secondary text-white"
      : "bg-white text-primary hover:bg-accent hover:text-white";

  return (
    <nav className="bg-primary text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="h-10 w-10 mr-2" />
          <span className="font-bold text-xl">Box Safe</span>
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link to="/" className={`${linkClass("/")} px-3 py-2 rounded`}>
            Inicio
          </Link>
          <Link
            to="/propiedades"
            className={`${linkClass("/propiedades")} px-3 py-2 rounded`}
          >
            Propiedades
          </Link>
          <Link
            to="/subastas"
            className={`${linkClass("/subastas")} px-3 py-2 rounded`}
          >
            Subastas
          </Link>
          {user ? (
            <>
              <details className="dropdown dropdown-end ">
                <summary
                  role="button"
                  className="btn m-1 bg-white text-secondary hover:bg-yellow-500 hover:text-white "
                >
                  Perfil
                </summary>
                <ul className="menu dropdown-content bg-white text-primary rounded-box z-[10] w-52 p-2 shadow">
                  <li>
                    <Link
                      to="/perfil"
                      className={`${linkClass("/perfil")} px-3 py-2 rounded`}
                    >
                      Mis datos
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/perfil/mis-propiedades"
                      className={`${linkClass(
                        "/perfil/mis-propiedades"
                      )} px-3 py-2 rounded`}
                    >
                      Mis propiedades
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/perfil/mis-subastas"
                      className={`${linkClass(
                        "/perfil/mis-subastas"
                      )} px-3 py-2 rounded`}
                    >
                      Mis Subastas
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="bg-white text-primary px-3 py-2 rounded hover:bg-red-500 hover:text-white transition duration-200"
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </details>
            </>
          ) : (
            <>
              <Link
                to="/inicio-sesion"
                className={`${buttonClass("/inicio-sesion")} px-3 py-2 rounded`}
              >
                Inicio de sesión
              </Link>
              <Link
                to="/registro"
                className={`${buttonClass("/registro")} px-3 py-2 rounded`}
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="mobile-menu-button focus:outline-none"
          >
            <FaBars className="text-white text-2xl" />
          </button>
        </div>
      </div>

      <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
        <Link
          to="/"
          className={`${linkClass(
            "/"
          )} block text-center py-2 text-neutral hover:bg-secondary`}
        >
          Inicio
        </Link>
        <Link
          to="/propiedades"
          className={`${linkClass(
            "/propiedades"
          )} block text-center py-2 text-neutral hover:bg-secondary`}
        >
          Propiedades
        </Link>
        <Link
          to="/subastas"
          className={`${linkClass(
            "/subastas"
          )} block text-center py-2 text-neutral hover:bg-secondary`}
        >
          Subastas
        </Link>
        {user ? (
          <div>
            <Link
              to="/perfil"
              className={`${linkClass(
                "/perfil"
              )} block text-center py-2 text-neutral hover:bg-secondary`}
            >
              Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="block text-center w-full text-red-500 hover:bg-red-500 hover:text-white py-2 rounded transition duration-200"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <>
            <Link
              to="/inicio-sesion"
              className={`${buttonClass(
                "/inicio-sesion"
              )} block text-center py-2 rounded`}
            >
              Inicio de sesión
            </Link>
            <Link
              to="/registro"
              className={`${buttonClass(
                "/registro"
              )} block text-center py-2 rounded`}
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
