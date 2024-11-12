import Slider from "react-slick";
import EstateProfileCard from "./EstateProfileCard";
export default function CarouselOfUserEstates() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    speed: 4000,
    autoplaySpeed: 1000,
    cssEase: "linear",
  };
  return (
    <section className="max-w-full mx-auto overflow-hidden py-4">
      <Slider {...settings}>
        <div>
          <EstateProfileCard />
        </div>
        <div>
          <EstateProfileCard />
        </div>
        <div>
          <EstateProfileCard />
        </div>
      </Slider>
    </section>
  );
}
