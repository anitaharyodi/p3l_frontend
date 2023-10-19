import React, { useContext, useState, useEffect } from 'react';
import { RoomContext } from '../context/RoomContext';
import Room from './Room';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { SpinnerDotted } from 'spinners-react'

const Rooms = () => {
  const { rooms, loading } = useContext(RoomContext);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [arrowSize, setArrowSize] = useState('text-2xl'); // Default arrow size
  const [arrowLeft, setArrowLeft] = useState('-left-5'); // Default left arrow position
  const [arrowRight, setArrowRight] = useState('-right-10'); // Default right arrow position

  const NextArrow = ({ onClick }) => (
    <div className="custom-arrow next cursor-pointer" onClick={onClick}>
      <div className={`absolute top-1/2 transform -translate-x-1/2 ${arrowSize} ${arrowRight}`}>
        <FaChevronRight />
      </div>
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div className="custom-arrow prev cursor-pointer" onClick={onClick}>
      <div className={`absolute top-1/2 transform -translate-x-1/2 ${arrowSize} ${arrowLeft}`}>
        <FaChevronLeft />
      </div>
    </div>
  );

  const settings = {
    infinite: true,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const updateSlidesToShow = () => {
    if (window.innerWidth < 640) {
      setSlidesToShow(1);
      setArrowSize('text-2xl'); // Adjust arrow size for smaller screens
      setArrowLeft('-left-1'); // Adjust left arrow position for smaller screens
      setArrowRight('-right-7'); // Adjust right arrow position for smaller screens
    } else {
      setSlidesToShow(3);
      setArrowSize('text-2xl'); // Default arrow size for larger screens
      setArrowLeft('-left-5'); // Default left arrow position for larger screens
      setArrowRight('-right-10'); // Default right arrow position for larger screens
    }
  };

  useEffect(() => {
    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => {
      window.removeEventListener('resize', updateSlidesToShow);
    };
  }, []);

  return (
    <section className='py-24'>
      {loading && (
        <div className='h-screen fixed bottom-0 top-0 bg-black/90 w-full z-50 flex justify-center'>
          <SpinnerDotted color='white'/>
        </div>
      )}
      <div className='container mx-auto lg:px-0'>
        <div className='text-center'>
            <div className='font-tertiary uppercase text-[15px] tracking-[6px]'>5-STAR LUXURY MEETS SOPHISTICATED DESIGN</div>
            <h2 className='font-primary text-[45px] mb-4'>Room & Suites</h2>
        </div>
        <Slider {...settings} className='lg:hidden'>
          {rooms.map((room) => (
            <div key={room.id} className='p-2'>
              <Room room={room} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

export default Rooms;
