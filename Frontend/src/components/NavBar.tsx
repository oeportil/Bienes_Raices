import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from '../assets/logo.png'

const NavBar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation(); // Hook para obtener la ruta actual

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const linkClass = (path: string) =>
    location.pathname === path
      ? "text-red-500"
      : "hover:text-accent";

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Image on the left */}
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="h-24 w-24 mr-2" />
        </Link>

        {/* Links for larger screens */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className={`${linkClass("/")} px-3 py-2 rounded hover:text-gray-600`}>
            inicio
          </Link>
          <Link
            to="/propiedades"
            className={`${linkClass("/propiedades")} px-3 py-2 rounded hover:text-gray-600`}
          >
            Propiedades
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                to="/perfil"
                className={`${linkClass("/perfil")} px-3 py-2 rounded`}
              >
                Perfil
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/inicio-sesion"
                className={`${linkClass(
                  "/inicio-sesion"
                )} px-3 py-2 text-white rounded hover:text-gray-600`}
              >
                Inicio de sesión
              </Link>
              <Link
                to="/registro"
                className={`${linkClass(
                  "/registro"
                )} px-3 py-2  text-white rounded hover:text-gray-600`}
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="mobile-menu-button focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16m-7 6h7"
                }
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
        <Link
          to="/"
          className={`${linkClass(
            "/"
          )} block text-center py-2 text-neutral`}
        >
          Inicio
        </Link>
        <Link
          to="/propiedades"
          className={`${linkClass(
            "/propiedades"
          )} block text-center py-2 text-neutral`}
        >
          Propiedades
        </Link>
        {!isLoggedIn ? (
          <>
            <Link
              to="/inicio-sesion"
              className={`${linkClass(
                "/inicio-sesion"
              )} block text-center py-2 bg-white text-primary`}
            >
              Inicio de sesión
            </Link>
            <Link
              to="/registro"
              className={`${linkClass(
                "/registro"
              )} block text-center py-2 bg-white text-primary hover:bg-`}
            >
              Registrarse
            </Link>
          </>
        ) : (
          <Link
            to="/perfil"
            className={`${linkClass(
              "/perfil"
            )} block text-center py-2 text-neutral`}
          >
            Perfil
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
