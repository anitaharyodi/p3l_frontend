import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../datepicker.css';
import { BsCalendar } from 'react-icons/bs';

const CheckOut = () => {
  const [endDate, setEndDate] = useState(false);

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
          selected={endDate}
          placeholderText="Check Out"
          onChange={(date) => setEndDate(date)}
          popperPlacement="top-end"
        />
      </div>
    </div>
  );
};

export default CheckOut;
