import React, { useContext, useEffect, useState } from "react";
import assets from "../assets";
import { GrFormNextLink } from "react-icons/gr";
import { BiBed } from "react-icons/bi";
import { BsPerson } from "react-icons/bs";
import { SlSizeFullscreen } from "react-icons/sl";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router";
import { RoomContext } from "../context/RoomContext";

const roomImages = [assets.ROOM4, assets.ROOM2, assets.ROOM3, assets.ROOM1];

const CardFindRoom = ({jenisKamarBySeason, imgIndex, ketersediaanKamar}) => {
  const { addToBookingList, removeFromBookingList, tglCheckin, tglCheckOut, clearBookingList } = useContext(RoomContext)
  const [quantity, setQuantity] = useState(0);
  const navigate = useNavigate()

  const tipe_bed_array = jenisKamarBySeason.tipe_bed?.split("\r\n").join(', ');
  const rincian_kamar_array = jenisKamarBySeason.rincian_kamar?.split("\r\n");
  const imageUrl = roomImages[imgIndex];

  const formatCurrency = (number) => {
    return `Rp ${new Intl.NumberFormat("id-ID").format(number)}`;
  };

  useEffect(() => {
    setQuantity(0);
    clearBookingList();
  }, [tglCheckin, tglCheckOut]);

  console.log('CEK HARGA SEASON', jenisKamarBySeason.tarifBySeason)

  const addToBookingListAndResetQuantity = () => {
    if (quantity > 0) {
      addToBookingList({
        id: jenisKamarBySeason.id,
        jenis_kamar: jenisKamarBySeason.jenis_kamar,
        quantity,
        imgIndex: imgIndex,
        hargaPerMalam: jenisKamarBySeason.tarifBySeason,
      });
    } else {
      removeFromBookingList(jenisKamarBySeason.id); 
    }
  };
  const navigateToRoomDetails = (
    roomId,
    roomImage,
    jenis_kamar,
    ukuran_kamar,
    kapasitas,
    tarif_normal,
    rincian_kamar,
    tipe_bed,
    deskripsi_kamar
  ) => {
    navigate(`/room/${roomId}`, {
      state: {
        roomImage,
        jenis_kamar,
        ukuran_kamar,
        kapasitas,
        tarif_normal,
        rincian_kamar,
        tipe_bed,
        deskripsi_kamar,
      },
    });
  };

  return (
    <div className="bg-white shadow-md rounded-md flex mx-auto mb-8">
      <img src={imageUrl} width={400} className="rounded-l-md" />
      <div className="py-4 px-6 w-full">
        <button className="font-medium text-[#1E2131] flex items-center ml-auto" onClick={() => navigateToRoomDetails(
            jenisKamarBySeason.id,
            roomImages[imgIndex],
            jenisKamarBySeason.jenis_kamar,
            jenisKamarBySeason.ukuran_kamar,
            jenisKamarBySeason.kapasitas,
            jenisKamarBySeason.tarif_normal,
            jenisKamarBySeason.rincian_kamar,
            jenisKamarBySeason.tipe_bed,
            jenisKamarBySeason.deskripsi_kamar
          )}>
          See Details
          <GrFormNextLink className="text-lg ml-1" />
        </button>
        <h2 className="text-2xl font-semibold font-tertiary tracking-[1px] -mt-2 ">
          {jenisKamarBySeason.jenis_kamar}
        </h2>
        <div className="mt-2 flex">
          <p className="text-gray-600 flex text-sm items-center mr-6">
            <BiBed className="text-lg mr-1" />
            {tipe_bed_array}
          </p>
          <p className="text-gray-600 text-sm flex items-center mr-6">
            <BsPerson className="text-lg mr-1" />{jenisKamarBySeason.kapasitas} Person
          </p>
          <p className="text-gray-600 text-sm flex items-center">
            <SlSizeFullscreen className="text-sm mr-1" />
            {jenisKamarBySeason.ukuran_kamar} m<sup>2</sup>
          </p>
          <p className="text-[#FF3B3B] flex text-sm font-medium ml-auto">
          {ketersediaanKamar} room(s) available
          </p>
        </div>
        <div className="border-t-2 border-gray-100 my-2"></div>
        <div className="flex flex-wrap">
          {rincian_kamar_array?.slice(0,6).map((roomDetail, index) => (
            <div
              className="flex items-center gap-x-3 mb-2 text-[14px]"
              key={index}
              style={{ flexBasis: "33%" }}
            >
              <FaCheck className="text-accent" />
              {roomDetail}
            </div>
          ))}
        </div>
        <div className="mt-4">
          {jenisKamarBySeason.tarif_normal != jenisKamarBySeason.tarifBySeason ? (
            <p className="text-[#A7A2B3] font-normal text-[14px] text-right -mt-3 line-through">
              {formatCurrency(jenisKamarBySeason.tarif_normal)}
            </p>
          ) : ""}
          <div className="flex justify-between">
            <div className="w-[350px] flex items-center mt-2">
              <img src={assets.INFOICON} className="w-4 h-4 mr-2" />
              <p className="text-[12px] text-[#587889] font-medium">
                Refundable if cancellation is made a maximum of 1 week before
                check-in
              </p>
            </div>
            <p className="text-accent font-semibold text-2xl text-right font-tertiary tracking-[1px]">
              {formatCurrency(jenisKamarBySeason.tarifBySeason)}
            </p>
          </div>
          <p className="text-[#A7A2B3] font-normal text-[14px] text-right -mt-3">
            / room / night(s)
          </p>
          <div className="flex justify-end mt-3">
            <div className="flex items-center mr-6">
              <button
                className="px-3 py-1 border-1 hover:bg-gray-100  hover:text-gray-700 rounded-l-sm focus:outline-none"
                onClick={() => setQuantity(quantity > 0 ? quantity - 1 : 0)}
                disabled={quantity === 0}
              >
                -
              </button>
              <input
                className="w-16 text-center text-gray-700 h-[33px] border-1 focus:outline-none"
                type="text"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              />
              <button
                className="px-3 py-1 border-1 hover:bg-gray-100  hover:text-gray-700 rounded-r-sm focus:outline-none"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            <button className="bg-accent text-white w-[120px] p-1 font-semibold text-[16px] h-9 rounded-md" onClick={addToBookingListAndResetQuantity}>
              Add to List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardFindRoom;
