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
  const [bookingListGroup, setBookingListGroup] = useState([]);

  // For Group Reservation
  const [tglCheckinGroup, setTglCheckinGroup] = useState(new Date().toISOString().split('T')[0]);
  const todayGroup = new Date();
  const tomorrowGroup = new Date(today);
  tomorrowGroup.setDate(todayGroup.getDate() + 1);
  const tomorrowDate = tomorrowGroup.toISOString().split('T')[0];
  const [tglCheckOutGroup, setTglCheckOutGroup] = useState(tomorrowDate);
  const [adultsGroup, setAdultsGroup] = useState("1 Adults");
  const [kidsGroup, setKidsGroup] = useState("0 Kids");

  useEffect(() => {
    setTotal((Number(adults[0]) + Number(kids[0])) / 2);
  });

  const handleClick = (e) => {
    e.preventDefault();
    console.log(total);
  };

  const handleClickGroup = (e) => {
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

  //For reservation Group
  const addToBookingListGroup = (room) => {
    const index = bookingListGroup.findIndex((item) => item.jenis_kamar === room.jenis_kamar);

    if (index !== -1) {
      const updatedBookingList = [...bookingListGroup];
      updatedBookingList[index].quantity = room.quantity;
      setBookingListGroup(updatedBookingList);
    } else {
      setBookingListGroup([...bookingListGroup, room]);
    }
  };

  const removeFromBookingListGroup = (roomId) => {
    const updatedBookingList = bookingListGroup.filter((item) => item.id !== roomId);
    
    setBookingListGroup(updatedBookingList);
  };

  const clearBookingListGroup = () => {
    setBookingListGroup([]);
  };

  return (
    <RoomContext.Provider
      value={{
        rooms,
        setTglCheckin,
        setTglCheckinGroup,
        tglCheckin,
        tglCheckinGroup,
        setTglCheckOut,
        setTglCheckOutGroup,
        tglCheckOut,
        tglCheckOutGroup,
        adults,
        adultsGroup,
        setAdults,
        setAdultsGroup,
        kids,
        kidsGroup,
        setKids,
        setKidsGroup,
        handleClick,
        handleClickGroup,
        loading,
        setLoading,
        isLogin,
        setIsLogin,
        isLoginPegawai,
        setIsLoginPegawai,
        bookingList,
        bookingListGroup,
        addToBookingList,
        addToBookingListGroup,
        removeFromBookingList,
        removeFromBookingListGroup,
        clearBookingList,
        clearBookingListGroup
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
