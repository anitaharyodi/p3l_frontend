import React, { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../datepicker.css";
import { BsCalendar } from "react-icons/bs";
import { RoomContext } from "../context/RoomContext";

const CheckIn = () => {
  const { tglCheckin, setTglCheckin } = useContext(RoomContext);

  const today = new Date();
  if (!tglCheckin) {
    // Set the default value to the current date if tglCheckin is not defined
    setTglCheckin(today);
  }

  return (
    <div className="relative flex bg-white items-center justify-between h-full">
      <div className="absolute z-10 pr-8 right-0">
        <div>
          <BsCalendar className="text-accent text-base" />
        </div>
      </div>
      <div className="flex-1">
        <DatePicker
          className="w-full h-full cursor-pointer text-left"
          selected={tglCheckin}
          placeholderText="Check In"
          onChange={(date) => setTglCheckin(date)}
          popperPlacement="top-end"
          minDate={today}
        />
      </div>
    </div>
  );
};

export default CheckIn;
