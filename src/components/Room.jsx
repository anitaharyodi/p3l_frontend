import React from "react";
import { BsArrowsFullscreen, BsPeople } from "react-icons/bs";
import { Link } from "react-router-dom";
const Room = ({ room }) => {
  const { id, name, image, size, maxPerson, description, price } = room;
  return (
    <div className="bg-white shadow-lg min-h-[580px] group">
      <div className="overflow-hidden">
        <img
          className="group-hover:scale-110 transition-all duration-300 w-full"
          src={image}
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
                {size} m<sup>2</sup>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-x-2">
            <div className="text-accent">
              <BsPeople className="text-[15px]" />
            </div>
            <div className="flex gap-x-1">
              <div>MAX PEOPLE</div>
              <div>{maxPerson}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <Link to={`/room/${id}`}>
          <h3 className="h3">{name}</h3>
        </Link>
        <p className="max-w-[300px] mx-auto mb-3 lg:mb-6">
          {description.slice(0, 56)}
        </p>
        <div className="max-w-[300px] mx-auto mb-3 lg:mb-6">
          Tonight's rate :{" "}
          <span className="uppercase font-tertiary tracking-[1px] font-semibold text-base text-[20px] text-[#1E2131] inline-block p-1">
            IDR {price}
          </span>
        </div>
      </div>
      <Link
        to={`/room/${id}`}
        className="btn btn-secondary btn-sm max-w-[300px] mx-auto"
      >
        Book now
      </Link>
    </div>
  );
};

export default Room;
