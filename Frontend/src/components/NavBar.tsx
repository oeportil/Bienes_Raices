import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NavBar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation(); // Hook para obtener la ruta actual

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const linkClass = (path: string) =>
    location.pathname === path
      ? "bg-secondary text-white"
      : "hover:text-accent";

  return (
    <nav className="bg-primary text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Image on the left */}
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10 w-10 mr-2" />
          <span className="font-bold text-xl">Box safe</span>
        </Link>

        {/* Links for larger screens */}
        <div className="hidden md:flex space-x-6">
          {isLoggedIn ? (
            <>
              <Link
                to="/properties"
                className={`${linkClass("/properties")} px-3 py-2 rounded`}
              >
                Propiedades
              </Link>
              <Link
                to="/profile"
                className={`${linkClass("/profile")} px-3 py-2 rounded`}
              >
                Perfil
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className={`${linkClass("/")} px-3 py-2 rounded`}>
                inicio
              </Link>
              <Link
                to="/properties"
                className={`${linkClass("/properties")} px-3 py-2 rounded`}
              >
                Propiedades
              </Link>
              <Link
                to="/login"
                className={`${linkClass("/login")} px-3 py-2 rounded`}
              >
                Inicio de sesión
              </Link>
              <Link
                to="/register"
                className={`${linkClass("/register")} px-3 py-2 rounded`}
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
          )} block text-center py-2 text-neutral hover:bg-secondary`}
        >
          Inicio
        </Link>
        <Link
          to="/properties"
          className={`${linkClass(
            "/properties"
          )} block text-center py-2 text-neutral hover:bg-secondary`}
        >
          Propiedades
        </Link>
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className={`${linkClass(
                "/login"
              )} block text-center py-2 text-neutral hover:bg-secondary`}
            >
              Inicio de sesión
            </Link>
            <Link
              to="/register"
              className={`${linkClass(
                "/register"
              )} block text-center py-2 text-neutral hover:bg-secondary`}
            >
              Registrarse
            </Link>
          </>
        ) : (
          <Link
            to="/profile"
            className={`${linkClass(
              "/profile"
            )} block text-center py-2 text-neutral hover:bg-secondary`}
          >
            Perfil
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
