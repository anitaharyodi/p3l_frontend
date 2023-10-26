import React, { createContext, useEffect, useState } from "react";
import { roomData } from "../data";
import Room from "../components/Room";
export const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState(roomData);
  const [total, setTotal] = useState(0);
  const [adults, setAdults] = useState("1 Adults");
  const [kids, setKids] = useState("0 Kids");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoginPegawai, setIsLoginPegawai] = useState(false);

  useEffect(() => {
    setTotal(Number(adults[0]) + Number(kids[0]));
  });

  const handleClick = (e) => {
    e.preventDefault();
    console.log(total);
  };

  return (
    <RoomContext.Provider
      value={{
        rooms,
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
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
