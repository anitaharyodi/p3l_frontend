// RoomProvider.js

import React, { createContext, useEffect, useState } from "react";
import { roomData } from "../data";
import Room from "../components/Room";

export const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState(roomData);
  const [total, setTotal] = useState(0);
  const [tglCheckin, setTglCheckin] = useState(new Date());
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const [tglCheckOut, setTglCheckOut] = useState(tomorrow);
  const [adults, setAdults] = useState("1 Adults");
  const [kids, setKids] = useState("0 Kids");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoginPegawai, setIsLoginPegawai] = useState(false);
  const [bookingList, setBookingList] = useState([]);

  useEffect(() => {
    setTotal((Number(adults[0]) + Number(kids[0])) / 2);
  });

  const handleClick = (e) => {
    e.preventDefault();
    console.log(total);
  };

  const addToBookingList = (room) => {
    const index = bookingList.findIndex((item) => item.jenis_kamar === room.jenis_kamar);

    if (index !== -1) {
      const updatedBookingList = [...bookingList];
      updatedBookingList[index].quantity = room.quantity;
      setBookingList(updatedBookingList);
    } else {
      setBookingList([...bookingList, room]);
    }
  };

  const removeFromBookingList = (roomId) => {
    const updatedBookingList = bookingList.filter((item) => item.id !== roomId);
    
    setBookingList(updatedBookingList);
  };

  const clearBookingList = () => {
    setBookingList([]);
  };

  return (
    <RoomContext.Provider
      value={{
        rooms,
        setTglCheckin,
        tglCheckin,
        setTglCheckOut,
        tglCheckOut,
        adults,
        setAdults,
        kids,
        setKids,
        handleClick,
        loading,
        setLoading,
        isLogin,
        setIsLogin,
        isLoginPegawai,
        setIsLoginPegawai,
        bookingList,
        addToBookingList,
        removeFromBookingList,
        clearBookingList
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
