import React, { useContext, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../datepicker.css';
import { BsCalendar } from 'react-icons/bs';
import { RoomContext } from '../context/RoomContext';

const CheckOut = () => {
  const { tglCheckOut, setTglCheckOut } = useContext(RoomContext);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (!tglCheckOut) {
    setTglCheckOut(tomorrow);
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
          selected={tglCheckOut}
          placeholderText="Check Out"
          onChange={(date) => setTglCheckOut(date)}
          popperPlacement="top-end"
          minDate={today}
        />
      </div>
    </div>
  );
};

export default CheckOut;
