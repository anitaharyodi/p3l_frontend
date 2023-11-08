import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import assets from "../assets";
import ScrollToTop from "../components/ScrollToTop";
import BookForm from "../components/BookForm";
import { Card, CardBody, Image } from "@nextui-org/react";
import { GrFormNextLink } from "react-icons/gr";
import { BiBed } from "react-icons/bi";
import { BsPerson } from "react-icons/bs";
import { SlSizeFullscreen } from "react-icons/sl";
import { FaCheck } from "react-icons/fa";
import CardFindRoom from "../components/CardFindRoom";
import { MdLibraryBooks } from "react-icons/md";
import BookingList from "../components/BookingList";
import { RoomContext } from "../context/RoomContext";
import axios from "axios";
import moment from "moment";
import CheckIn from "../components/CheckIn";
import CheckOut from "../components/CheckOut";
import AdultsDropdown from "../components/AdultsDropdown";
import KidsDropdown from "../components/KidsDropdown";

const SearchBookRoom = () => {
  const { handleClick, tglCheckin, tglCheckOut} = useContext(RoomContext)
  const [jenisKamarBySeason, setJenisKamarBySeason] = useState([])
  const [ketersediaanKamar, setKetersediaanKamar] = useState([])

  const formattedDateCheckin = moment(tglCheckin).format(
    "YYYY-MM-DD"
  );
  const formattedDateCheckout = moment(tglCheckOut).format(
    "YYYY-MM-DD"
  );

  const isFormEmpty = !tglCheckin || !tglCheckOut;

  useEffect(() => {
    const apiURL = `http://localhost:8000/api/tarifBySeason?tgl_checkin=${formattedDateCheckin}&tgl_checkout=${formattedDateCheckout}`;
    axios
      .get(apiURL)
      .then((response) => {
        // console.log(response)
        setJenisKamarBySeason(response.data.data);
        console.log('MASUK SEARCH', JSON.stringify(response.data.data, null, 2))
      })
      .catch((error) => {
        console.error("Error fetching data from the API: " + error);
      });
  }, [tglCheckin, tglCheckOut]);

  useEffect(() => {
    const apiURL = `http://localhost:8000/api/ketersediaanKamar?tgl_checkin=${formattedDateCheckin}&tgl_checkout=${formattedDateCheckout}`;
    axios
      .get(apiURL)
      .then((response) => {
        // console.log(response)
        setKetersediaanKamar(response.data.data);
        console.log('MASUK SEARCH', JSON.stringify(response.data.data, null, 2))
      })
      .catch((error) => {
        console.error("Error fetching data from the API: " + error);
      });
  }, [tglCheckin, tglCheckOut]);

  return (
    <section>
      <ScrollToTop />
      <div className="relative h-[430px]">
        <img
          className="bg-room object-cover w-full h-full"
          src={assets.ROOM7}
          alt=""
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/50">
          <h1 className="text-6xl mt-12 text-white z-20 font-primary text-center">
            Find Rooms
          </h1>
        </div>
      </div>
      <div className="container mx-auto max-w-full">
          <div className="mt-[100px] p-4 lg:shadow-xl lg:absolute lg:left-60 lg:right-60 lg:p-0 lg:z-30 lg:top-60">
          <form className="h-[300px] w-full lg:h-[60px]">
      <div className="flex flex-col w-full h-full lg:flex-row">
        <div className="flex-1 border-r">
          <CheckIn />
        </div>
        <div className="flex-1 border-r">
          <CheckOut/>
        </div>
        <div className="flex-1 border-r">
          <AdultsDropdown />
        </div>
        <div className="flex-1 border-r">
          <KidsDropdown />
        </div>
      </div>
    </form>
        </div>
      <div className="flex flex-col lg:flex-row h-full mt-8">
          <div className="w-full h-full lg:w-[70%] px-6">
        <div className="mb-6">
          {jenisKamarBySeason.map((item, index) => (
            <CardFindRoom key={item.id} jenisKamarBySeason={item} imgIndex={index} ketersediaanKamar={ketersediaanKamar?.find(kk => kk.id_jenis_kamar == item.id)?.totalKamar}/>

          ))}
        </div>
          </div>
          <div className="w-full h-full lg:w-[30%] mr-6 mb-8 sticky top-20">
            <BookingList />
          </div>

        </div>
      </div>
    </section>
  );
};

export default SearchBookRoom;
