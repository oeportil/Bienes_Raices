import Slider from "react-slick";
import partner1 from "../../assets/birria.png";
import partner2 from "../../assets/miche.png";
import partner3 from "../../assets/jocotal.png";
import partner4 from "../../assets/ojeando.png";
import partner5 from "../../assets/logo6.png";
import partner6 from "../../assets/pasitos.png";
import partner7 from "../../assets/fitoMolina.png";
export default function PartnersCarousel() {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2500,
    autoplaySpeed: 2500,
    cssEase: "linear",
  };

  return (
    <section className="max-w-full mx-auto overflow-hidden py-4">
      <Slider {...settings}>
        <div className="p-4">
          <img src={partner1} alt="Primer partner" />
        </div>
        <div className="p-4">
          <img src={partner2} alt="Segundo partner" />
        </div>
        <div className="p-4">
          <img src={partner3} alt="Tercer partner" />
        </div>
        <div className="p-4">
          <img src={partner4} alt="Cuarto partner" />
        </div>
        <div className="p-4">
          <img src={partner5} alt="Quinto partner" />
        </div>
        <div className="p-4">
          <img src={partner6} alt="Sexto partner" />
        </div>
        <div className="p-4">
          <img src={partner7} alt="Septimo partner" />
        </div>
      </Slider>
    </section>
  );
}
