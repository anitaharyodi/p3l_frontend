import React, { useEffect, useState } from "react";
import assets from "../assets";
import { Link } from "react-router-dom";

const Header = () => {
  const [header, setHeader] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      window.scrollY > 50 ? setHeader(true) : setHeader(false);
    });
  });

  return (
    <header
      className={`${
        header ? "bg-[#1E2131] py-3 shadow-lg" : "bg-transparent py-5"
      } fixed z-50 w-full transition-all duration-300`}
    >
      <div className="container mx-auto flex flex-col items-center gap-y-6 lg:flex-row lg:justify-between lg:gap-y-0">
        <a href="/">
          <img className="w-[250px]" src={assets.LOGO_SAMPING}/>
        </a>
        <nav className="text-white flex gap-x-4 font-tertiary tracking-[3px] text-[15px] items-center uppercase lg:gap-x-8">
          <a href="/" className="hover:text-[#D0C379] transition">Home</a>
          <a href="" className="hover:text-[#D0C379] transition">Rooms</a>
          <a href="" className="hover:text-[#D0C379] transition">Contact</a>
          <Link to="/login" className="btn btn-primary h-10 rounded-md mx-auto">Login</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
