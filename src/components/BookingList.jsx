import React, { useContext, useEffect, useState } from "react";
import { MdLibraryBooks } from "react-icons/md";
import assets from "../assets";
import { useNavigate } from "react-router";
import { RoomContext } from "../context/RoomContext";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

const roomImages = [assets.ROOM4, assets.ROOM2, assets.ROOM3, assets.ROOM1];

const BookingList = () => {
  const { bookingList, tglCheckin, tglCheckOut, total, adults, kids } =
    useContext(RoomContext);
  const authToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const checkInDate = new Date(tglCheckin);
  const checkOutDate = new Date(tglCheckOut);
  console.log("LIAT", checkOutDate);
  const timeDifference = checkOutDate - checkInDate;

  const [numberOfNights, setNumberOfNights] = useState(0);

  useEffect(() => {
    const nights = timeDifference / (1000 * 60 * 60 * 24);
    const roundedNights = Math.round(nights);
    setNumberOfNights(roundedNights);
  }, [tglCheckin, tglCheckOut]);

  console.log("MALAM", JSON.stringify(bookingList, null, 2));

  const formatCurrency = (number) => {
    return `Rp ${new Intl.NumberFormat("id-ID").format(number)}`;
  };

  const totalPrice = bookingList.reduce((total, booking) => {
    return total + booking.quantity * numberOfNights * booking.hargaPerMalam;
  }, 0);

  const formattedTotalPrice = formatCurrency(totalPrice);
  const transformedBookingList = bookingList.map((booking) => ({
    id_jenis_kamar: booking.id,
    jumlah: booking.quantity,
    hargaPerMalam: booking.hargaPerMalam,
  }));
  

  console.log(JSON.stringify(transformedBookingList, null, 2));

  const formattedDateCheckin = moment(tglCheckin).format("YYYY-MM-DD");
  const formattedDateCheckout = moment(tglCheckOut).format("YYYY-MM-DD");

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onOpenChange: onModalOpenChange,
    onClose: closeModal,
  } = useDisclosure();

  const handleBooking = () => {
    const body = {
      tgl_checkin: formattedDateCheckin,
      tgl_checkout: formattedDateCheckout,
      jumlah_dewasa: parseInt(adults),
      jumlah_anak: parseInt(kids),
      total_harga: totalPrice,
      jenis_kamar: transformedBookingList,
    };

    // console.log(JSON.stringify(transformedBookingList,null, 2))

    const apiURL = "https://ah-project.my.id/api/reservasi";
    axios
      .post(apiURL, body, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        console.log("Booking data successfully:", response.data);
        const reservationId = response.data.data.reservasi.id;
        navigate(`/book/${reservationId}`, { state: { bookingList } });
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        onModalOpenChange(false);
        if (error.response.data.message == "You are not logged in yet!") {
          navigate("/login");
        }
      });
  };

  return (
    <div className="bg-white min-h-[450px] shadow-md rounded-md flex flex-col justify-between">
      <div className="bg-[#1E2131] h-[70px] rounded-t-md">
        <p className="text-white p-4 text-[25px] font-semibold font-tertiary tracking-[1px] flex items-center">
          <MdLibraryBooks className="text-md mr-2" />
          Booking List
        </p>
      </div>
      {bookingList.length == 0 && (
        <><div className="flex justify-center items-center">
          <img src={assets.EMPTYDATA} width={150}/>
        </div><p className="-mt-10 text-center font-semibold text-gray-500">Please choose your room first</p></>
      )}
      <div className={`${bookingList.length == 1 ? "-mt-[130px]" : ""}`}>
        {bookingList.map((booking, index) => (
          <div key={booking.jenis_kamar}>
            <div className="pt-6 px-6 flex items-center">
              <img
                src={roomImages[booking.imgIndex]}
                width={100}
                height={100}
                className="rounded-md"
                alt="Room"
              />
              <div className="ml-4">
                <p className="font-bold font-tertiary tracking-[1px]">
                  ({booking.quantity}x) {booking.jenis_kamar}
                </p>
                <p className="text-gray-600 text-[12px]">
                  {numberOfNights} nights
                </p>
              </div>
              <div className="ml-auto">
                <p className="font-tertiary tracking-[1px] font-semibold text-[17px] text-[#526166]">
                  {formatCurrency(
                    booking.quantity * numberOfNights * booking.hargaPerMalam
                  )}
                </p>
              </div>
            </div>
            <div className="border-t-2 mt-4 border-gray-100 mx-6"></div>
          </div>
        ))}
      </div>
      <div className="h-auto mt-4 mx-6 mb-4">
        {totalPrice !== 0 && (
          <div className="border-1 p-3 mb-4 rounded-md">
            <div className="flex justify-between">
              <p className="font-tertiary tracking-[1px] text-[20px] font-semibold">
                Total Price :{" "}
              </p>
              <p className="font-tertiary tracking-[1px] font-semibold text-[20px] text-accent">
                {formattedTotalPrice}
              </p>
            </div>
          </div>
        )}
        <button
          className={`bg-[#1E2131] text-white w-full p-2 font-semibold text-[16px] h-10 rounded-md ${
            !totalPrice ? "bg-gray-200 cursor-not-allowed" : ""
          }`}
          onClick={() => openModal()}
          disabled={!totalPrice}
        >
          Book Now
        </button>
      </div>
      <Modal isOpen={isModalOpen} onOpenChange={onModalOpenChange}>
        <ModalContent>
          <ModalHeader>
            <div className="flex flex-col items-center w-full">
              <p className="text-center mt-1 uppercase text-[#1E2131] font-bold tracking-[1px]">
                Confirmation
              </p>
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="font-semibold">Are you sure you want to book?</p>
            <p className="font-medium">
              Please ensure the above details are correct before proceeding to
              the booking page. After proceeding to the booking page, we will
              lock your booking data.
            </p>
          </ModalBody>
          <ModalFooter>
            <button
              className="w-[200px] h-[40px] rounded-md text-black"
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </button>
            <button
              className="bg-[#1E2131] text-white w-[200px] h-[40px] rounded-md"
              onClick={() => handleBooking()}
            >
              I'm sure
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default BookingList;
