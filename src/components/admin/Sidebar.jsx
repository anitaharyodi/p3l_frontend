import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import assets from "../../assets";
import { BiSolidDashboard, BiSolidLogOut } from "react-icons/bi";
import { MdMeetingRoom, MdNightsStay } from "react-icons/md";
import { BsFillTicketPerforatedFill, BsFillPersonFill, BsGraphUp } from "react-icons/bs";
import { FaHandHoldingUsd } from "react-icons/fa";
import { FaMoneyBills } from "react-icons/fa6";
import {PiBookOpenTextFill} from "react-icons/pi"
import { RoomContext } from "../../context/RoomContext";
import axios from "axios";

export default function Sidebar() {
  const [showSidebar, setShowSidebar] = useState("-left-64");
  const { setIsLoginPegawai } = useContext(RoomContext);
  const navigate = useNavigate();
  const getRole = localStorage.getItem("role");

  const handleLogout = async () => {
    try {
      const tokenPegawai = localStorage.getItem("tokenPegawai");

      if (!tokenPegawai) {
        console.error("Token not found in localStorage");
        return;
      }

      const apiURL = "http://localhost:8000/api/logout";

      const headers = {
        Authorization: `Bearer ${tokenPegawai}`,
      };

      const response = await axios.post(apiURL, null, { headers });

      if (response.status === 200) {
        localStorage.removeItem("tokenPegawai");
        localStorage.removeItem("emailPegawai");
        localStorage.removeItem("role");
        setIsLoginPegawai(false);
        navigate("/admin");
      }
    } catch (error) {
      console.error("Logout Error", error);
    }
  };

  return (
    <>
      <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div
        className={`h-screen fixed top-0 md:left-0 ${showSidebar} overflow-y-auto flex-row flex-nowrap overflow-hidden shadow-xl bg-[#1E2131] w-64 z-10 py-4 px-6 transition-all duration-300`}
      >
        <div className="flex-col min-h-full px-0 relative">
          <img src={assets.LOGO_BAWAH} />
          <p className="text-[19px] font-primary text-center mt-2 font-bold text-accent">
            Employee Management
          </p>
          <div className="flex flex-col">
            <hr className="my-4 min-w-full" />

            <ul className="flex-col min-w-full flex list-none">
                {getRole === "Admin" && (
                  <li className="rounded-lg mb-2">
                    <Link
                      to="/home/room"
                      className="flex items-center gap-4 text-md text-white px-4 rounded-lg py-2 hover:bg-accent"
                    >
                      <MdMeetingRoom className="text-xl" />
                      Room
                    </Link>
                  </li>
                )}
                {getRole === "Sales Marketing" && (
                  <>
                    <li className="rounded-lg mb-2">
                      <Link
                         to="/home/season"
                        className="flex items-center gap-4 text-md text-white px-4 rounded-lg py-2 hover:bg-accent"
                      >
                        <BsFillTicketPerforatedFill className="text-xl" />
                        Season
                      </Link>
                    </li>
                    <li className="rounded-lg mb-2">
                      <Link
                        to="/home/fasilitas"
                        className="flex items-center gap-4 text-md text-white px-4 rounded-lg py-2 hover:bg-accent"
                      >
                        <FaHandHoldingUsd className="text-xl" />
                        Paid Facilities
                      </Link>
                    </li>
                    <li className="rounded-lg mb-2">
                      <Link
                         to="/home/tarif"
                        className="flex items-center gap-4 text-md text-white px-4 rounded-lg py-2 hover:bg-accent"
                      >
                        <FaMoneyBills className="text-xl" />
                        Tarif
                      </Link>
                    </li>
                    <li className="rounded-lg mb-2">
                      <Link
                         to="/home/customer"
                        className="flex items-center gap-4 text-md text-white px-4 rounded-lg py-2 hover:bg-accent"
                      >
                        <BsFillPersonFill className="text-xl" />
                        Customers
                      </Link>
                    </li>
                  </>
                )}
                {getRole === "Front Office" && (
                  <li className="rounded-lg mb-2">
                    <Link
                      to="/home/customerStay"
                      className="flex items-center gap-4 text-md text-white px-4 rounded-lg py-2 hover:bg-accent"
                    >
                      <MdNightsStay className="text-xl" />
                      Customer Stays
                    </Link>
                  </li>
                )}

                {getRole === "Owner" || getRole === "General Manager" ? (
                  <Link
                    // to="/"
                    className="flex items-center gap-4 text-md text-white px-4 rounded-lg py-2 hover:bg-accent"
                  >
                    <BsGraphUp className="text-xl" />
                    Report
                  </Link>
                ) : null}
            </ul>

            <button
              className="flex items-center min-w-full absolute bottom-0 rounded-lg p-3 text-white hover:bg-red-500"
              onClick={handleLogout}
            >
              <BiSolidLogOut className="text-xl mr-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
