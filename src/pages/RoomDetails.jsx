import React, { useContext } from "react";
import { FaCheck } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import CheckIn from "../components/CheckIn";
import CheckOut from "../components/CheckOut";
import AdultsDropdown from "../components/AdultsDropdown";
import KidsDropdown from "../components/KidsDropdown";
import ScrollToTop from "../components/ScrollToTop";
import Rooms from "../components/Rooms";
import { BiSolidBed } from "react-icons/bi";

const RoomDetails = () => {
  const location = useLocation();
  const roomImage = location.state ? location.state.roomImage : null;
  const jenis_kamar = location.state ? location.state.jenis_kamar : null;
  const tarif_normal = location.state ? location.state.tarif_normal : null;
  const ukuran_kamar = location.state ? location.state.ukuran_kamar : null;
  const kapasitas = location.state ? location.state.kapasitas : null;
  const rincian_kamar = location.state ? location.state.rincian_kamar : null;
  const tipe_bed = location.state ? location.state.tipe_bed : null;
  const deskripsi_kamar = location.state
    ? location.state.deskripsi_kamar
    : null;
  const rincian_kamar_array = rincian_kamar?.split("\r\n");
  const deskripsi_kamar_array = deskripsi_kamar?.split("\r\n");
  const tipe_bed_array = tipe_bed?.split("\r\n").join(', ');
  const oddArray = [];
  const evenArray = [];

  deskripsi_kamar_array?.forEach((item, index) => {
    if (index % 2 === 0) {
      evenArray.push(item);
    } else {
      oddArray.push(item);
    }
  });
  console.log(JSON.stringify(tipe_bed_array, null, 2));
  console.log(JSON.stringify(evenArray, null, 2));

  const formatCurrencyIDR = (amount) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

    return formatter.format(amount).replace("Rp", "IDR");
  };

  return (
    <section>
      <ScrollToTop />
      <div className="relative h-[560px]">
        <img
          className="bg-room object-cover w-full h-full"
          src={roomImage}
          alt="Room Image"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/50">
          <h1 className="text-6xl text-white z-20 font-primary text-center">
            {jenis_kamar} Details
          </h1>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row h-full mt-24">
          <div className="w-full h-full lg:w-[60%] px-6">
            <h2 className="h2">{jenis_kamar}</h2>
            <p className="mb-8 text-justify pr-6">
              <span className="font-semibold">{jenis_kamar} Room</span> boasts a
              spacious {ukuran_kamar} square meters, providing ample space for
              you to relax and savor your special moments. The available bed
              type is {tipe_bed_array}, ensuring unmatched comfort for a restful
              sleep. After a long day, you can indulge in the luxury of the
              lavish bed.
            </p>
            <img className="mb-8" src={roomImage} alt="" />
            <ul className="list-disc px-6">
              <li className="mb-8 font-semibold">
                Room Size :{" "}
                <span className="font-normal">
                  {ukuran_kamar} m<sup>2</sup>
                </span>
              </li>
              <li className="mb-8 font-semibold -mt-5">
                Capacity :{" "}
                <span className="font-normal">{kapasitas} person</span>
              </li>
              <li className="mb-8 font-semibold -mt-5">
                Bed Type : <span className="font-normal">
                    {tipe_bed_array}

                  </span>
              </li>
            </ul>

            <div className="mt-12">
              <h3 className="h3 mb-3">Room Facilities</h3>
              <p className="mb-12 text-justify">
                Welcome to our exceptional room facilities, where your comfort
                and convenience take center stage. Our rooms are thoughtfully
                designed to provide you with a delightful stay, offering a wide
                range of amenities and services to cater to your needs. Whether
                you're here for business or leisure, you'll find everything you
                require to make your stay truly memorable. Explore the world of
                comfort and convenience as we present to you our room
                facilities, designed with your utmost satisfaction in mind.
              </p>
              <p className="mb-12">
              {deskripsi_kamar_array?.map((roomDesc, index) => (
                <ul className="list-disc px-5">
                  <li className="mb-8 -mt-5">
                    {roomDesc}
                  </li>

                </ul>
                ))}
              </p>
            </div>
          </div>
          <div className="w-full h-full lg:w-[40%]">
            <div className="py-8 px-6 bg-accent/20 mb-12">
              <div className="flex flex-col space-y-4 mb-4">
                <h3 className="h3">Your Reservation</h3>
                <div className="h-[60px]">
                  <CheckIn className="mr-10" />
                </div>
                <div className="h-[60px]">
                  <CheckOut />
                </div>
                <div className="h-[60px]">
                  <AdultsDropdown />
                </div>
                <div className="h-[60px]">
                  <KidsDropdown />
                </div>
              </div>
              <button className="btn btn-lg btn-primary w-full">
                book now for {formatCurrencyIDR(tarif_normal)}
              </button>
            </div>
            <div>
              <h3 className="h3">Room Details</h3>
              <ul className="flex flex-col gap-y-4">
                {rincian_kamar_array?.map((roomDetail, index) => (
                  <li className="flex items-center gap-x-4">
                    <FaCheck className="text-accent" />
                    {roomDetail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="px-6 mb-12">
          <h3 className="h3">Other Rooms</h3>
          <Rooms />
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
