import HeroSection from "../components/HomeComponents/HeroSection";
import { FaGlobe, FaHandshake, FaRegLightbulb } from "react-icons/fa";
import team from "../assets/img1About(team).png";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />
      {/*About us */}
      <section className="bg-primary text-white py-16 px-6 md:px-12">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          {/* Left Column - Text and Icons */}
          <div className="w-full md:w-1/2 md:pr-8 mb-8 md:mb-0">
            <h2 className="text-4xl font-bold mb-8">¿Por qué Box safe?</h2>

            <div className="flex items-start mb-6 gap-4">
              <FaGlobe className="text-secondary text-9xl mr-4" />
              <p className="text-lg">
                Nuestro equipo tiene un conocimiento detallado del mercado
                inmobiliario local. Entendemos las tendencias, los precios y las
                mejores ubicaciones, lo que nos permite asesorarte con precisión
                y ayudarte a encontrar propiedades en áreas estratégicas que
                aumenten su valor con el tiempo.
              </p>
            </div>

            <div className="flex items-start mb-6 gap-4">
              <FaHandshake className="text-secondary text-9xl mr-4" />
              <p className="text-lg">
                En Box Safe, creemos que la base de toda relación exitosa es la
                confianza. Por eso, trabajamos con total transparencia en cada
                etapa del proceso. Nos comprometemos a mantenerte informado y
                ofrecerte un servicio claro, sin sorpresas ni costos ocultos.
              </p>
            </div>

            <div className="flex items-start mb-6 gap-4">
              <FaRegLightbulb className="text-secondary text-9xl mr-4" />
              <p className="text-lg">
                Nos esforzamos por adaptar nuestros servicios a las necesidades
                individuales de cada cliente, utilizando tecnologías avanzadas
                para simplificar el proceso de compra, venta o alquiler de
                propiedades. Desde herramientas de búsqueda personalizadas hasta
                recorridos virtuales, hacemos que tu experiencia sea más rápida,
                segura y conveniente.
              </p>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="w-full md:w-1/2">
            <img
              src={team}
              alt="Equipo de SafeBox"
              className="w-full h-96 rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>
    </>
  );
}
