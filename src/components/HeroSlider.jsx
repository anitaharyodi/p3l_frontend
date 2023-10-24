import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import { EffectFade, Autoplay } from "swiper/modules";
import assets from "../assets";

const slides = [
  {
    title: "Serenity in Style",
    bg: assets.SLIDER1,
    btnText: "See our rooms",
  },
  {
    title: "Serenity in Style",
    bg: assets.SLIDER2,
    btnText: "See our rooms",
  },
  {
    title: "Serenity in Style",
    bg: assets.SLIDER3,
    btnText: "See our rooms",
  },
];

const HeroSlider = () => {
  const gotoRoom = () => {
    const targetY = 870; // Adjust this value to the desired Y position
    const startingY = window.scrollY;
    const distance = targetY - startingY;
    const duration = 1000; // Set the duration for the scroll animation (in milliseconds)

    const startTime = performance.now();

    const scroll = (currentTime) => {
      const elapsedTime = currentTime - startTime;

      window.scrollTo(
        0,
        easeInOutCubic(elapsedTime, startingY, distance, duration)
      );

      if (elapsedTime < duration) {
        requestAnimationFrame(scroll);
      }
    };

    const easeInOutCubic = (t, b, c, d) => {
      if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b;
      return (c / 2) * ((t -= 2) * t * t + 2) + b;
    };

    requestAnimationFrame(scroll);
  };
  return (
    <Swiper
      modules={[EffectFade, Autoplay]}
      effect={"fade"}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      className="heroSlider h-[600px] lg:h-[860px]"
    >
      {slides.map((slide, index) => {
        const { title, bg, btnText } = slide;

        return (
          <SwiperSlide className="h-full relative" key={index}>
            <div className="z-20 text-white text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="uppercase font-tertiary tracking-[6px] mb-5">
                Just Enjoy and relax
              </div>
              <h1 className="text-[32px] font-primary uppercase tracking-[2px] max-w-[920px] lg:text-[68px] leading-tight mb-6">
                {title}
              </h1>
              <button
                className="btn btn-lg btn-primary rounded-md mx-auto transition duration-300"
                onClick={gotoRoom}
              >
                {btnText}
              </button>
            </div>
            <div className="absolute top-0 w-full h-full">
              <img className="object-cover h-full w-full" src={bg} alt="" />
            </div>
            <div className="absolute w-full h-full bg-black/70"></div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default HeroSlider;
