import React, { useContext } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  User,
  AvatarIcon,
} from "@nextui-org/react";
import { BiLogOut } from "react-icons/bi";
import { MdLibraryBooks } from "react-icons/md";
import { RoomContext } from "../context/RoomContext";
import axios from "axios";
import { useNavigate } from "react-router";

const AvatarLogin = () => {
    const navigate = useNavigate()
    const {setIsLogin} = useContext(RoomContext)
    const email = localStorage.getItem("email");

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }

      const apiURL = 'http://localhost:8000/api/logout';

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(apiURL, null, { headers });

      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        setIsLogin(false)
        navigate('/')
      }
    } catch (error) {
      console.error("Logout Error", error);
    }
  }

  return (
    <Dropdown placement="bottom" className="py-1 px-1">
      <DropdownTrigger>
        <Avatar
          icon={<AvatarIcon />}
          as="button"
          classNames={{
            base: "bg-gradient-to-br from-[#D0C379] to-[#FFFFFF]",
            icon: "text-black/80",
          }}
          size="sm"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2" onClick={()=>navigate('/profile')}>
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{email}</p>
        </DropdownItem>
        <DropdownItem
          key="system"
          className="py-2"
          startContent={<MdLibraryBooks />}
          onClick={() => navigate('/myBooking')}
        >
          My Booking
        </DropdownItem>
        <DropdownItem
          key="logout"
          className="py-2"
          color="danger"
          startContent={<BiLogOut />}
          onClick={handleLogout}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default AvatarLogin;
