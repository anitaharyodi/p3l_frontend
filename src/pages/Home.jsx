import React, { useEffect, useRef, useState } from "react";
import Rooms from "../components/Rooms";
import BookForm from "../components/BookForm";
import HeroSlider from "../components/HeroSlider";
import assets from "../assets";
import ReviewCard from "../components/ReviewCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, EffectFade } from "swiper/modules";

const Home = () => {
  const contentRef = useRef();
  const contentRefReview = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleReview, setIsVisibleReview] = useState(false);

  const reviewData = [
    {
      name: "John Smith",
      rating: "4.7",
      review:
        "A wonderful stay with great amenities. The staff was friendly, and the room was clean and comfortable. Will definitely return!",
    },
    {
      name: "Emily Davis",
      rating: "4.9",
      review:
        "This hotel exceeded my expectations. The service was exceptional, and the room had a beautiful view. Highly recommended for a luxurious experience.",
    },
    {
      name: "Michael Johnson",
      rating: "4.8",
      review:
        "I had an amazing time at this hotel. The food was delicious, and the staff made me feel welcome. I can't wait to come back!",
    },
    {
      name: "Sophia Lee",
      rating: "5.0",
      review:
        "An unforgettable experience! The room was stunning, the service was top-notch, and the location was perfect. I'll cherish these memories forever.",
    },
    {
      name: "Daniel Brown",
      rating: "4.6",
      review:
        "Great value for the price. The hotel offered everything I needed for a comfortable stay. I'm happy with my choice.",
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const emailLocal = localStorage.getItem("email");
    console.log("INI TOKEN", token);
    console.log("INI EMAIL", emailLocal);
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    });

    observer.observe(contentRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setIsVisibleReview(true);
      }
    });

    observer.observe(contentRefReview.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <HeroSlider />
      <div className="container mx-auto relative">
        <div className="bg-accent/20 mt-4 p-4 lg:shadow-xl lg:absolute lg:left-0 lg:right-0 lg:p-0 lg:z-30 lg:-top-12">
          <BookForm />
        </div>
      </div>
      <div className="text-center mt-24">
        <div className="font-tertiary uppercase text-[15px] tracking-[6px]">
          5-STAR LUXURY MEETS SOPHISTICATED DESIGN
        </div>
        <h2 className="font-primary text-[45px] mb-4">Room & Suites</h2>
      </div>
      <Rooms />
      <div
        ref={contentRef}
        className={`bg-accent text-left mt-16 py-10 px-4 sm:px-[180px] flex flex-col sm:flex-row items-center justify-between min-h-[500px] transition-all duration-1000 ease-in-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="flex flex-col text-center sm:text-left">
          <div className="font-tertiary uppercase text-[15px] tracking-[6px] text-white">
            Let's Introduce
          </div>
          <h2 className="font-primary text-[30px] sm:text-[45px] mb-4 text-white">
            ABOUT US
          </h2>
          <p className="text-white text-center sm:text-justify max-w-xl mb-5">
            Welcome to the epitome of luxury and opulence in the heart of
            Yogyakarta! Grand Atma Hotel is a prestigious 5-star establishment,
            perfectly situated at Jl. Babarsari No.43, Janti, Caturtunggal, Kec.
            Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta. From the moment
            you step through our doors, you'll be enveloped in an ambiance of
            sophistication and grandeur.
          </p>
        </div>
        <img
          src={assets.HOTELARC}
          className="w-full sm:w-[500px] rounded-lg"
          alt="Hotel Image"
        />
      </div>

      <div
        ref={contentRefReview}
        className={`text-left py-10 px-4 sm:px-[180px] flex flex-col sm:flex-row items-center justify-between min-h-[500px] transition-all duration-5000 ease-in-out ${
          isVisibleReview
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <Swiper
          modules={[Autoplay]}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="w-[400px] p-30 bg-transparent"
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
        >
          {reviewData.map((review, index) => (
            <SwiperSlide key={index}>
              <ReviewCard {...review} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="flex flex-col">
          <div className="font-tertiary uppercase text-[15px] tracking-[6px] ">
            Our Customer
          </div>
          <h2 className="font-primary text-[45px] mb-4 ">REVIEWS</h2>
          <p className=" text-justify max-w-xl">
            At Grand Atma Hotel, we take immense pride in our commitment to
            excellence. Our guests' satisfaction and comfort are our top
            priorities, and their feedback plays an invaluable role in shaping
            our commitment to providing the finest hospitality. We are delighted
            to share with you the candid and heartfelt experiences of our
            esteemed guests through their reviews.
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
