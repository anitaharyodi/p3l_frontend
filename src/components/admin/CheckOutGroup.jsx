import React, { useContext, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../datepicker.css';
import { BsCalendar } from 'react-icons/bs';
import { RoomContext } from "../../context/RoomContext";

const CheckOutGroup = () => {
  const { tglCheckOutGroup, setTglCheckOutGroup } = useContext(RoomContext);

  const today = new Date()
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split('T')[0];

  if (!tglCheckOutGroup) {
    setTglCheckOutGroup(tomorrowDate);
  }

  return (
    <div className="relative flex bg-white items-center justify-between h-full">
      <div className="flex-1 p-4">
        <input
          type='date'
          className="w-full h-full cursor-pointer text-left focus:outline-none"
          value={tglCheckOutGroup}
          onChange={(date) => setTglCheckOutGroup(date.target.value)}
          min={new Date()}
        />
      </div>
    </div>
  );
};

export default CheckOutGroup;
