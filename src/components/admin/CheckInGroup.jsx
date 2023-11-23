import React, { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../datepicker.css";
import { BsCalendar } from "react-icons/bs";
import { RoomContext } from "../../context/RoomContext";

const CheckInGroup = () => {
  const { tglCheckinGroup, setTglCheckinGroup } = useContext(RoomContext);

  if (!tglCheckinGroup) {
    setTglCheckinGroup(new Date().toISOString().split('T')[0]);
  }

  return (
    <div className="relative flex bg-white items-center justify-between h-full">
      <div className="flex-1 p-4">
        <input
          type="date"
          className="w-full h-full cursor-pointer text-left focus:outline-none"
          value={tglCheckinGroup}
          onChange={(date) => setTglCheckinGroup(date.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
    </div>
  );
};

export default CheckInGroup;
