import Slider from "react-slick";
import EstateCarouselCard from "./EstateCarouselCard";
import { RealState } from "../../types";

type CarouselOfEstatesProps = {
  estates: RealState[];
};
export default function CarouselOfEstates({ estates }: CarouselOfEstatesProps) {
  const settings = {
    dots: true,
    infinite: false,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    speed: 4000,
    autoplaySpeed: 1000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 768, // Tablets
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <section className="max-w-full mx-auto overflow-hidden py-4">
      {estates ? (
        <Slider {...settings}>
          {estates.map((estate) => (
            <div key={estate.id}>
              <EstateCarouselCard data={estate} />
            </div>
          ))}
        </Slider>
      ) : (
        <div>
          <p className="text-primary text-2xl">
            No hay Propiedades por mostrar
          </p>
        </div>
      )}
    </section>
  );
}
