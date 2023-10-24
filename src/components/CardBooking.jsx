import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { CgEnter } from "react-icons/cg";
import { BiLogOut } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import axios from "axios";

const CardBooking = ({
  id,
  idBooking,
  status,
  tglCheckin,
  tglCheckout,
  tglPembayaran,
  totalHarga,
  nama,
  email,
  noTelepon,
  jmlDewasa,
  jmlAnak,
  uangJaminan
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const authToken = localStorage.getItem("token");
  const [bookRoom, setBookRoom] = useState([]);
  const [facilityBook, setFacilityBook] = useState([]);

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const formatCurrency = (number) => {
    return `Rp ${new Intl.NumberFormat("id-ID").format(number)}`;
  };

  const openModal = async () => {
    onOpen()

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    const apiURL = `http://localhost:8000/api/history/${id}`;
    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        console.log(bookRoom);
        setBookRoom(response.data.data.reservasi_kamars)
        setFacilityBook(response.data.data.transaksi_fasilitas)
      })
      .catch((error) => {
        console.error("Error fetching data from the API: " + error);
      });
  }
  
  const columns = [
    {
      key: "jenis_kamar",
      label: "ROOM TYPE",
    },
    {
      key: "kapasitas",
      label: "CAPACITY",
    },
    {
      key: "tarif_normal",
      label: "TONIGHT'S RATE",
    },
  ];
  
  const columnsFacilities = [
    {
      key: "nama_fasilitas",
      label: "NAME",
    },
    {
      key: "jumlah",
      label: "AMOUNT",
    },
    {
      key: "tgl_pemakaian",
      label: "DATE",
    },
    {
      key: "subtotal",
      label: "PRICE",
    },
  ];


  return (
    <div className="bg-gray-100 p-8 m-2 rounded-2xl">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold text-[#1E2131]">{idBooking}</h2>
        <Chip
          color={
            status === "Lunas"
              ? "success"
              : status === "Menunggu Pembayaran"
              ? "warning"
              : status === "Check-In"
              ? "primary"
              : "danger"
          }
          className="text-white"
        >
          {status}
        </Chip>
      </div>
      <div className="border-t-2 border-gray-300 my-4"></div>
      <div className="flex justify-between">
        <div className="text-center ml-[200px]">
          <div className="flex items-center">
            <CgEnter className="text-[#1E2131] text-xl mr-2" />
            <h2 className="text-xl font-semibold font-tertiary tracking-[2px] uppercase text-[#1E2131]">
              Check-In
            </h2>
          </div>

          <p className="font-medium text-[#1E2131]">{tglCheckin}</p>
        </div>
        <div className="border-t-2 border-gray-400 w-12 my-6"></div>
        <div className="text-center mr-[200px]">
          <div className="flex items-center">
            <BiLogOut className="text-[#1E2131] text-xl mr-2" />
            <h2 className="text-xl font-semibold font-tertiary tracking-[2px] uppercase text-[#1E2131]">
              Check-Out
            </h2>
          </div>
          <p className="font-medium text-[#1E2131]">{tglCheckout}</p>
        </div>
      </div>
      <div className="mt-6 text-right">
        <h2 className="font-medium text-[#1E2131]">
          Total Price :{" "}
          <span className="text-xl font-semibold font-tertiary tracking-[2px] uppercase ml-2">
            {totalHarga}
          </span>
        </h2>
      </div>
      {/* <div className="border-t-2 border-gray-300 mt-4"></div> */}
      <div className="flex justify-between mt-4">
        {tglPembayaran ? (
          <p className="text-gray-500 mt-3">Payment Date : {tglPembayaran}</p>
        ) : (
          <p className="text-gray-500 mt-3">Payment Date : -</p>
        )}
        <Button
          variant="solid"
          className="font-semibold bg-[#1E2131] text-white w-[150px] mt-3"
          onClick={openModal}
        >
          See Detail
          <BsArrowRight className="font-extrabold" />
        </Button>

        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          scrollBehavior="inside"
          size="2xl"
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              Detail Reservation
            </ModalHeader>
            <ModalBody>
              <div className="flex justify-between">
                <h2 className="h2 text-[20px] font-bold">Booking ID #{idBooking}</h2> 
                <Chip
                  color={
                    status === "Lunas"
                      ? "success"
                      : status === "Menunggu Pembayaran"
                      ? "warning"
                      : status === "Check-In"
                      ? "primary"
                      : "danger"
                  }
                  className="text-white"
                >
                  {status}
                </Chip>
              </div>
              <div className="border-t-2 border-gray-300 -mt-4"></div>
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">Name</p>
                </div>
                <div>
                  <p className="">{nama}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">Email</p>
                </div>
                <div>
                  <p className="">{email}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">Phone Number</p>
                </div>
                <div>
                  <p className="">{noTelepon}</p>
                </div>
              </div>
              <div className="mt-4">
                <h2 className="h2 text-[20px] font-semibold">Reservation</h2>
              </div>
              <div className="border-t-2 border-gray-300 -mt-4"/>
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">Check-In</p>
                </div>
                <div>
                  <p className="">{tglCheckin}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">Check-Out</p>
                </div>
                <div>
                  <p className="">{tglCheckout}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">Adults</p>
                </div>
                <div>
                  <p className="">{jmlDewasa}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">Kids</p>
                </div>
                <div>
                  <p className="">{jmlAnak}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">Down Payment</p>
                </div>
                <div>
                  <p className="">{uangJaminan}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">Payment Date</p>
                </div>
                <div>
                  <p className="">{tglPembayaran}</p>
                </div>
              </div>
              {bookRoom.length !== 0 ? (
              <><div className="mt-4">
                  <h2 className="h2 text-[20px] font-semibold">Room</h2>
                </div><div className="border-t-2 border-gray-300 -mt-4" /><Table>
                    <TableHeader columns={columns}>
                      {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody>
                      {bookRoom.map((item, i) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.jenis_kamars.jenis_kamar}</TableCell>
                          <TableCell>{item.jenis_kamars.kapasitas}</TableCell>
                          <TableCell>{formatCurrency(item.jenis_kamars.tarif_normal)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table></>
              ): ""}
              {facilityBook.length !== 0 ? (
              <><div className="mt-4">
                  <h2 className="h2 text-[20px] font-semibold">Paid Facilities</h2>
                </div><div className="border-t-2 border-gray-300 -mt-4" /><Table>
                    <TableHeader columns={columnsFacilities}>
                      {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody>
                      {facilityBook.map((item, i) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.fasilitas_tambahans.nama_fasilitas}</TableCell>
                          <TableCell>{item.jumlah}</TableCell>
                          <TableCell>{formatDate(item.tgl_pemakaian)}</TableCell>
                          <TableCell>{formatCurrency(item.subtotal)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table></>

              ): ""}
            </ModalBody>
            <ModalFooter>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default CardBooking;
