import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BsArrowsFullscreen, BsPeople } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import assets from "../assets";

const roomImages = [assets.ROOM4, assets.ROOM2, assets.ROOM3, assets.ROOM1];

const Room = ({ room, imageIndex }) => {
  const navigate = useNavigate();
  const {
    id,
    jenis_kamar,
    ukuran_kamar,
    kapasitas,
    tarif_normal,
    rincian_kamar,
    tipe_bed,
    deskripsi_kamar,
  } = room;
  const imageUrl = roomImages[imageIndex];

  const formatCurrencyIDR = (amount) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

    return formatter.format(amount).replace("Rp", "IDR");
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
    <div className="bg-white shadow-lg  lg:min-h-[480px] group">
      <div className="overflow-hidden">
        <img
          className="group-hover:scale-110 transition-all duration-300 w-full"
          src={imageUrl}
          alt=""
        />
      </div>

      <div className="bg-white shadow-lg max-w-[300px] mx-auto h-[60px] -translate-y-1/2 flex justify-center items-center uppercase font-tertiary tracking-[1px] font-semibold text-base">
        <div className="flex justify-between w-[80%]">
          <div className="flex items-center gap-x-2">
            <div className="text-accent">
              <BsArrowsFullscreen className="text-[15px]" />
            </div>
            <div className="flex gap-x-1">
              <div>Size</div>
              <div>
                {ukuran_kamar} m<sup>2</sup>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-x-2">
            <div className="text-accent">
              <BsPeople className="text-[15px]" />
            </div>
            <div className="flex gap-x-1">
              <div>MAX PEOPLE</div>
              <div>{kapasitas}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <button onClick={() =>
          navigateToRoomDetails(
            id,
            roomImages[imageIndex],
            jenis_kamar,
            ukuran_kamar,
            kapasitas,
            tarif_normal,
            rincian_kamar,
            tipe_bed,
            deskripsi_kamar
          )
        }>
          <h3 className="h3">{jenis_kamar}</h3>
        </button>
        <div className="max-w-[300px] mx-auto mb-3 lg:mb-6 text-[16px]">
          Tonight's rate :{" "}
          <span className="uppercase font-tertiary tracking-[1px] font-semibold text-base text-[22px] text-[#1E2131] inline-block p-1">
            {formatCurrencyIDR(tarif_normal)}
          </span>
        </div>
      </div>
      <button
        onClick={() =>
          navigateToRoomDetails(
            id,
            roomImages[imageIndex],
            jenis_kamar,
            ukuran_kamar,
            kapasitas,
            tarif_normal,
            rincian_kamar,
            tipe_bed,
            deskripsi_kamar
          )
        }
        className="btn btn-secondary btn-sm max-w-[300px] lg:w-[300px] mx-auto"
      >
        Book now
      </button>
    </div>
  );
};

export default Room;
