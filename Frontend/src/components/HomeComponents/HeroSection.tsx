import { Link } from "react-router-dom";
import Slider from "react-slick";
import img1 from "../../assets/img1Hero(vende).png";
import img2 from "../../assets/img2Hero(compra).png";
import img3 from "../../assets/img3Hero(subasta).webp";

export default function HeroSection() {
  //configuraciones del carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <header className=" text-primary flex flex-col-reverse gap-5 md:flex-row items-center py-10 px-6 md:px-12">
      {/* Carousel */}
      <div className="w-full md:w-1/2">
        <Slider {...settings}>
          <div>
            <img
              src={img1}
              alt="Comprar propiedades"
              className="w-full h-64 md:h-96 "
            />
          </div>
          <div>
            <img
              src={img2}
              alt="Vender propiedades"
              className="w-full h-64 md:h-96 "
            />
          </div>
          <div>
            <img
              src={img3}
              alt="Subastar propiedades"
              className="w-full h-64 md:h-96 "
            />
          </div>
        </Slider>
      </div>

      {/* Text Section */}
      <div className="w-full md:w-1/2 md:pl-10 mt-6 md:mt-0 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Encuentra la Propiedad de tus Sueños
        </h1>
        <p className="text-lg mb-6">
          Descubre propiedades increíbles en las mejores ubicaciones. Únete a
          nuestra plataforma y empieza tu búsqueda hoy.
        </p>
        <Link
          to={"/propiedades"}
          className="bg-secondary text-white font-semibold px-6 py-3 rounded hover:bg-green-600 transition duration-300"
        >
          Explorar Propiedades
        </Link>
      </div>
    </header>
  );
}
