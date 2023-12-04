import React, { useContext, useState, useEffect } from 'react';
import { RoomContext } from '../context/RoomContext';
import Room from './Room';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { SpinnerDotted } from 'spinners-react'
import axios from 'axios';

const Rooms = () => {
  const { loading } = useContext(RoomContext);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [arrowSize, setArrowSize] = useState('text-2xl')
  const [arrowLeft, setArrowLeft] = useState('-left-5')
  const [arrowRight, setArrowRight] = useState('-right-10')
  const [jenisKamarData, setJenisKamarData] = useState([])

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
      setSlidesToShow(1)
      setArrowSize('text-2xl')
      setArrowLeft('-left-1')
      setArrowRight('-right-7')
    } else {
      setSlidesToShow(3);
      setArrowSize('text-2xl')
      setArrowLeft('-left-5')
      setArrowRight('-right-10')
    }
  };

  useEffect(() => {
    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => {
      window.removeEventListener('resize', updateSlidesToShow);
    };
  }, []);

  useEffect(() => {
    const apiURL = "https://ah-project.my.id/api/jenisKamar";

    axios
      .get(apiURL)
      .then((response) => {
        console.log(JSON.stringify(response.data.mess, null, 2))
        setJenisKamarData(response.data.mess)
      })
      .catch((error) => {
        console.error("Error fetching jenis kamar data: ", error);
      });
  }, [])

  return (
    <section>
      {loading && (
        <div className='h-screen fixed bottom-0 top-0 bg-black/90 w-full z-50 flex justify-center'>
          <SpinnerDotted color='white'/>
        </div>
      )}
      <div className='container mx-auto lg:px-0'>
        <Slider {...settings} className='lg:hidden'>
          {jenisKamarData.map((room, index) => (
            <div key={room.id} className='pb-4 px-2'>
              <Room room={room} imageIndex={index} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

export default Rooms;
