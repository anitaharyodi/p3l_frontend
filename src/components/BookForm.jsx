import React, { useContext, useState } from "react";
import CheckIn from "./CheckIn";
import CheckOut from "./CheckOut";
import AdultsDropdown from "./AdultsDropdown";
import KidsDropdown from "./KidsDropdown";
import { RoomContext } from "../context/RoomContext";
import { useNavigate } from "react-router";

const BookForm = () => {
  const { handleClick, tglCheckin, tglCheckOut } = useContext(RoomContext);
  const navigate = useNavigate();

  console.log(tglCheckin);
  const isFormEmpty = !tglCheckin || !tglCheckOut;

  return (
    <form className="h-[300px] w-full lg:h-[70px]">
      <div className="flex flex-col w-full h-full lg:flex-row">
        <div className="flex-1 border-r">
          <CheckIn />
        </div>
        <div className="flex-1 border-r">
          <CheckOut/>
        </div>
        <div className="flex-1 border-r">
          <AdultsDropdown />
        </div>
        <div className="flex-1 border-r">
          <KidsDropdown />
        </div>
        <button
          onClick={(e) => {
            handleClick(e);
            navigate('/searchRoom');
          }}
          type="submit"
          className="btn btn-primary"
          disabled={isFormEmpty}
        >
          Search Room
        </button>
      </div>
    </form>
  );
};

export default BookForm;
