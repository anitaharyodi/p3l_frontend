import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { CgEnter } from "react-icons/cg";
import { BiLogOut, BiSolidDownload } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

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
  const navigate = useNavigate()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: CancelModalOpen,
    onOpen: openCancelModal,
    onOpenChange: onCancelModalOpenChange,
    onClose: closeCancelModal,
  } = useDisclosure();
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
    const apiURL = `https://ah-project.my.id/api/history/${id}`;
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

  function countRoomsByJenisKamar(bookRoom) {
    const counts = {};
    for (const room of bookRoom) {
      const jenisKamarId = room.id_jenis_kamar;
      counts[jenisKamarId] = (counts[jenisKamarId] || 0) + 1;
    }
    return counts;
  }
 
  const roomCounts = countRoomsByJenisKamar(bookRoom);
  
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

  const handlePembatalan = () => {
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

      const apiURL = `https://ah-project.my.id/api/reservasi/pemesananBatal/${id}`;
      axios
        .post(apiURL, null, axiosConfig)
        .then((response) => {
          console.log(JSON.stringify(response, null, 2))
          if(response.status == 200) {
            toast.success('Your booking has been cancelled!', {
              position: 'top-right',
              hideProgressBar: true,
              theme: 'colored',
              autoClose: 1000,
            });
            onCancelModalOpenChange(false)
            onOpenChange(false)
            window.location.reload();
          }
        })
        .catch((error) => {
          console.error(error);
        });
  }

  const getPDF = () => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      responseType: 'blob',
    };
    const apiURL = `https://ah-project.my.id/api/generate-pdf/${id}`;
    
    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
  
        const a = document.createElement('a');
        a.href = url;
        a.download = `reservation_${idBooking}.pdf`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
  
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  const formattedTglCheckin = new Date(tglCheckin).toLocaleDateString();
  const currentDate = new Date().toLocaleDateString();


  return (
    <div className="bg-gray-100 p-6 m-2 rounded-2xl">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold text-[#1E2131]">{idBooking}</h2>
        <Chip
          color={
            status == "Paid"
              ? "success"
              : status == "Waiting for payment"
              ? "warning"
              : status == "Confirmed"
              ? "secondary"
              : status == "Check-In"
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
      <div className="mt-4 text-right">
        <h2 className="font-medium text-[#1E2131]">
          Total Price :{" "}
          <span className="text-xl font-semibold font-tertiary tracking-[2px] uppercase ml-2">
            {totalHarga}
          </span>
        </h2>
      </div>
      {/* <div className="border-t-2 border-gray-300 mt-4"></div> */}
      <div className="flex justify-between mt-2">
        {tglPembayaran == '1 January 1970' ? (
          <p className="text-gray-500 mt-3">Payment Date : -</p>
          ) : (
            <p className="text-gray-500 mt-3">Payment Date : {tglPembayaran}</p>
        )}
        <div>
          {status == 'Waiting for payment' && formattedTglCheckin >= currentDate  && (
            <Button
              variant="bordered"
              className="font-semibold border-1 border-[#1E2131] text-[#1E2131] w-[150px] mt-3 mr-4"
              onClick={() => navigate(`/book/${id}#payment`)}
            >
              Pay Now
            </Button>

          )}
          <Button
            variant="solid"
            className="font-semibold bg-[#1E2131] text-white w-[150px] mt-3"
            onClick={openModal}
          >
            See Detail
            <BsArrowRight className="font-extrabold" />
          </Button>

        </div>

        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          scrollBehavior="inside"
          size="2xl"
        >
          <ModalContent>
            <ModalHeader className="flex justify-between">
              <p>Detail Reservation</p>
              {status == "Confirmed" || status == "Check In" ? (
              <div>
              <button className="text-[14px] bg-[#1E2131] text-white px-2 py-1 rounded-md mr-6 flex items-center" onClick={() => getPDF()}>
                <BiSolidDownload className="mr-2"/>
                Reservation Receipt
                </button>
              </div>

              ): ""}
            </ModalHeader>
            <ModalBody>
              <div className="flex justify-between">
                <h2 className="h2 text-[20px] font-bold">Booking ID #{idBooking}</h2> 
                <Chip
                  color={
                    status == "Paid"
                      ? "success"
                      : status == "Waiting for payment"
                      ? "warning"
                      : status == "Confirmed"
                      ? "secondary"
                      : status == "Check-In"
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
                  {status == "Waiting for payment" ? (
                    <p className="">-</p>
                    ) : (
                    <p className="">{uangJaminan}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">Payment Date</p>
                </div>
                <div>
                {tglPembayaran == '1 January 1970' ? (
                    <p className="">-</p>
                    ) : (
                      <p className="">{tglPembayaran}</p>
                  )}
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
                          <TableCell>{roomCounts[item.id_jenis_kamar]}</TableCell>
                          <TableCell>{formatCurrency(item.hargaPerMalam)}</TableCell>
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
            <ModalFooter className="flex justify-center items-center">
              {status == "Waiting for payment" || status == "Confirmed" ? (
              <button className="text-danger-500 font-medium" onClick={() => openCancelModal()}>
                Cancelled this booking
              </button>

              ) : ""}
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={CancelModalOpen} onOpenChange={onCancelModalOpenChange}>
              <ModalContent>
                <ModalHeader>
                  <div className="flex flex-col items-center w-full">
                    <p className="text-center mt-1 uppercase text-[#1E2131] font-bold tracking-[1px]">
                      Confirmation
                    </p>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <p className="font-semibold text-center">Are you sure want to cancel this booking?</p>
                </ModalBody>
                <ModalFooter>
                  <button
                    className="w-[200px] h-[40px] rounded-md text-black"
                    onClick={() => {
                      closeCancelModal();
                    }}
                  >
                    No
                  </button>
                  <button
                    className="bg-[#1E2131] text-white w-[200px] h-[40px] rounded-md"
                    onClick={() => handlePembatalan()}
                  >
                    Yes
                  </button>
                </ModalFooter>
              </ModalContent>
            </Modal>
      </div>
    </div>
  );
};

export default CardBooking;
