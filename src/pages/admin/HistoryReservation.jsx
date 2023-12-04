import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { GiReceiveMoney } from "react-icons/gi";
import { MdLibraryBooks } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { BiSolidDownload } from "react-icons/bi";

const HistoryReservation = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const authToken = localStorage.getItem("tokenPegawai");
  const getIdLogin = localStorage.getItem("idPegawai");
  const [historyData, setHistoryData] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;
  const [reservasi, setReservasi] = useState([]);
  const [bookRoom, setBookRoom] = useState([]);
  const [facilityBook, setFacilityBook] = useState([]);
  const navigate = useNavigate();

  const [currentHistoryId, setCurrentHistoryId] = useState(null);
  const [currentHistoryData, setCurrentHistoryData] = useState({
    reservations: {
      id: "",
      id_booking: "",
      tgl_reservasi: "",
      tgl_checkin: "",
      tgl_checkout: "",
      jumlah_dewasa: "",
      jumlah_anak: "",
      tgl_pembayaran: "",
      status: "",
      total_harga: "",
      uang_jaminan: "",
    },
    nama: "",
    email: "",
    nama_institusi: "",
    no_telepon: "",
  });

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const formatCurrency = (number) => {
    return `Rp ${new Intl.NumberFormat("id-ID").format(number)}`;
  };

  const {
    isOpen: createModalOpen,
    onOpen: openCreateModal,
    onOpenChange: onCreateModalOpenChange,
    onClose: closeCreateModal,
  } = useDisclosure();

  const {
    isOpen: CancelModalOpen,
    onOpen: openCancelModal,
    onOpenChange: onCancelModalOpenChange,
    onClose: closeCancelModal,
  } = useDisclosure();

  const openCreateModalWithId = (reservationId) => {
    setCurrentHistoryId(reservationId);
    console.log(reservationId);
    fetchHistoryById(reservationId);
    openCreateModal();
  };

  const openCancelModalWithId = (reservationId) => {
    setCurrentHistoryId(reservationId);
    console.log(reservationId);
    openCancelModal();
  };

  const columnsKamar = [
    {
      key: "jenis_kamar",
      label: "ROOM TYPE",
    },
    {
      key: "jumlah",
      label: "AMOUNT",
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

  // Fetch Data history
  const fetchHistoryData = () => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const apiURL = `https://ah-project.my.id/api/customer/${id}`;

    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        setHistoryData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching history data: ", error);
      });
  };

  const fetchHistoryById = (reservationId) => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    const apiURL = `https://ah-project.my.id/api/history/${reservationId}`;
    console.log(reservationId);
    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        console.log(bookRoom);
        setBookRoom(response.data.data.reservasi_kamars);
        setFacilityBook(response.data.data.transaksi_fasilitas);
      })
      .catch((error) => {
        console.error("Error fetching data from the API: " + error);
      });
  };

  useEffect(() => {
    fetchHistoryData();
  }, [authToken]);
  //Search
  const filteredHistoryData = historyData.reservations?.filter((item) => {
    const status = item.status.toLowerCase();
    const idBooking = item.id_booking.toLowerCase();
    const searchLower = search.toLowerCase();

    return status.includes(searchLower) || idBooking.includes(searchLower);
  });

  //Search Pagination
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredHistoryData?.slice(start, end);
  }, [page, filteredHistoryData, rowsPerPage]);

  const onClear = React.useCallback(() => {
    setSearch("");
    setPage(1);
  }, []);

  const columns = [
    {
      key: "id_booking",
      label: "ID BOOKING",
    },
    {
      key: "tgl_reservasi",
      label: "RESERVATION DATE",
    },
    {
      key: "tgl_checkin",
      label: "CHECK-IN",
    },
    {
      key: "tgl_checkout",
      label: "CHECK-OUT",
    },
    {
      key: "status",
      label: "STATUS",
    },
    {
      key: "actions",
      label: "ACTIONS",
    },
  ];

  const handlePembatalan = (idReservation) => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const apiURL = `https://ah-project.my.id/api/reservasi/pemesananBatal/${idReservation}`;

    axios
      .post(apiURL, null, axiosConfig)
      .then((response) => {
        console.log(JSON.stringify(response, null, 2));
        if (response.status == 200) {
          toast.success("The booking has been cancelled!", {
            position: "top-right",
            hideProgressBar: true,
            theme: "colored",
            autoClose: 1000,
          });
          onCancelModalOpenChange(false);
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getPDF = (idReservation, idBooking) => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      responseType: 'blob',
    };
    const apiURL = `https://ah-project.my.id/api/generate-pdf/${idReservation}`;
    
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

  return (
    <section>
      <div className="h2 text-accent p-2 rounded-lg font-semibold text-[30px] uppercase font-tertiary tracking-[2px] flex items-center">
        <MdLibraryBooks className="text-2xl mr-2" />
        History Reservation
      </div>

      <div className="mb-4 flex justify-between">
        <Input
          isClearable
          className="w-full sm:max-w-[30%] text-medium"
          placeholder="Search"
          onClear={() => onClear()}
          startContent={<CiSearch />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Table
        aria-label="Table History"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={
                (filteredHistoryData?.length || 0) <= rowsPerPage
                  ? 1
                  : Math.ceil((filteredHistoryData?.length || 0) / rowsPerPage)
              }
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} className="text-sm">
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {items?.map((item, i) => (
            <TableRow key={item.id}>
              <TableCell className="text-medium">{item.id_booking}</TableCell>
              <TableCell className="text-medium">
                {formatDate(item.tgl_reservasi)}
              </TableCell>
              <TableCell className="text-medium">
                {formatDate(item.tgl_checkin)}
              </TableCell>
              <TableCell className="text-medium">
                {formatDate(item.tgl_checkout)}
              </TableCell>
              <TableCell className="text-medium">
                <Chip
                  color={
                    item.status == "Paid"
                      ? "success"
                      : item.status == "Waiting for payment"
                      ? "warning"
                      : item.status == "Confirmed"
                      ? "secondary"
                      : item.status == "Check-In"
                      ? "primary"
                      : "danger"
                  }
                  className="text-white"
                >
                  {item.status}
                </Chip>
              </TableCell>
              <TableCell className="w-[50px]">
                <div className="relative flex items-center">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly size="sm" variant="light">
                        <BsThreeDotsVertical className="text-default-500" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        color="primary"
                        startContent={<MdLibraryBooks />}
                        onClick={() => openCreateModalWithId(item.id)}
                      >
                        See Details
                      </DropdownItem>

                      {item.status == "Waiting for payment" && (
                        <DropdownItem
                          color="warning"
                          startContent={<GiReceiveMoney />}
                          onClick={() =>
                            navigate(`/home/bookGroup/${item.id}#payment`)
                          }
                        >
                          Pay DP
                        </DropdownItem>
                      )}
                    </DropdownMenu>
                  </Dropdown>
                  {item.status == "Waiting for payment" ||
                  item.status == "Confirmed" ? (
                    <button onClick={() => openCancelModalWithId(item.id)}>
                      <IoCloseSharp className="text-danger-500 ml-3 text-lg " />
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        isOpen={createModalOpen}
        onOpenChange={onCreateModalOpenChange}
        scrollBehavior="inside"
        size="2xl"
      >
        <ModalContent>
        {items
            ?.filter((item) => item.id == currentHistoryId)
            .map((item, i) => (
        <ModalHeader key={item.id} className="flex justify-between">
              <p>Detail Reservation</p>
              {item.status == "Confirmed" || item.status == "Check In" ? (
              <div>
              <button className="text-[14px] bg-[#1E2131] text-white px-2 py-1 rounded-md mr-6 flex items-center" onClick={() => getPDF(item.id, item.id_booking)}>
                <BiSolidDownload className="mr-2"/>
                Reservation Receipt
                </button>
              </div>

              ): ""}
            </ModalHeader>
            ))}
          {items
            ?.filter((item) => item.id == currentHistoryId)
            .map((item, i) => (
              <ModalBody key={item.id}>
                <>
                  <div className="flex justify-between">
                    <h2 className="h2 text-[20px] font-bold">
                      Booking ID #{item.id_booking}
                    </h2>
                    <Chip
                      color={
                        item.status == "Paid"
                          ? "success"
                          : item.status == "Waiting for payment"
                          ? "warning"
                          : item.status == "Confirmed"
                          ? "secondary"
                          : item.status == "Check-In"
                          ? "primary"
                          : "danger"
                      }
                      className="text-white"
                    >
                      {item.status}
                    </Chip>
                  </div>
                  <div className="border-t-2 border-gray-300 -mt-4"></div>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">Name</p>
                    </div>
                    <div>
                      <p className="">{historyData.nama}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">Email</p>
                    </div>
                    <div>
                      <p className="">{historyData.email}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">Phone Number</p>
                    </div>
                    <div>
                      <p className="">{historyData.no_telepon}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h2 className="h2 text-[20px] font-semibold">
                      Reservation
                    </h2>
                  </div>
                  <div className="border-t-2 border-gray-300 -mt-4" />
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">Check-In</p>
                    </div>
                    <div>
                      <p className="">{formatDate(item.tgl_checkin)}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">Check-Out</p>
                    </div>
                    <div>
                      <p className="">{formatDate(item.tgl_checkout)}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">Adults</p>
                    </div>
                    <div>
                      <p className="">{item.jumlah_dewasa}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">Kids</p>
                    </div>
                    <div>
                      <p className="">{item.jumlah_anak}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">Total Price</p>
                    </div>
                    <div>
                        <p className="">{formatCurrency(item.total_harga)}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">Down Payment</p>
                    </div>
                    <div>
                      {item.status == "Waiting for payment" ? (
                        <p className="">-</p>
                      ) : (
                        <p className="">{formatCurrency(item.uang_jaminan)}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">Payment Date</p>
                    </div>
                    <div>
                      {item.tgl_pembayaran == null ? (
                        <p className="">-</p>
                      ) : (
                        <p className="">{formatDate(item.tgl_pembayaran)}</p>
                      )}
                    </div>
                  </div>
                </>

                {bookRoom.length !== 0 ? (
                  <>
                    <div className="mt-4">
                      <h2 className="h2 text-[20px] font-semibold">Room</h2>
                    </div>
                    <div className="border-t-2 border-gray-300 -mt-4" />
                    <Table>
                      <TableHeader columns={columnsKamar}>
                        {(column) => (
                          <TableColumn key={column.key}>
                            {column.label}
                          </TableColumn>
                        )}
                      </TableHeader>
                      <TableBody>
                        {(() => {
                          // Create an object to store counts for each jenis_kamar
                          const jenisKamarCounts = {};
                          bookRoom.forEach((item) => {
                            const jenisKamar = item.jenis_kamars.jenis_kamar;
                            jenisKamarCounts[jenisKamar] =
                              (jenisKamarCounts[jenisKamar] || 0) + 1;
                          });

                          // Map through unique jenis_kamar values
                          return Array.from(
                            new Set(
                              bookRoom.map(
                                (item) => item.jenis_kamars.jenis_kamar
                              )
                            )
                          ).map((jenisKamar, index) => {
                            const totalKamar = jenisKamarCounts[jenisKamar];
                            const filteredItems = bookRoom.filter(
                              (item) =>
                                item.jenis_kamars.jenis_kamar == jenisKamar
                            );
                            const hargaPerMalamTotal = filteredItems.reduce(
                              (total, item) =>
                                total + item.hargaPerMalam,
                              0
                            );

                            return (
                              <TableRow key={index}>
                                <TableCell>{jenisKamar}</TableCell>
                                <TableCell>{totalKamar}</TableCell>
                                <TableCell>
                                  {formatCurrency(hargaPerMalamTotal)}
                                </TableCell>
                              </TableRow>
                            );
                          });
                        })()}
                      </TableBody>
                    </Table>
                  </>
                ) : (
                  ""
                )}
                {facilityBook.length !== 0 ? (
                  <>
                    <div className="mt-4">
                      <h2 className="h2 text-[20px] font-semibold">
                        Paid Facilities
                      </h2>
                    </div>
                    <div className="border-t-2 border-gray-300 -mt-4" />
                    <Table>
                      <TableHeader columns={columnsFacilities}>
                        {(column) => (
                          <TableColumn key={column.key}>
                            {column.label}
                          </TableColumn>
                        )}
                      </TableHeader>
                      <TableBody>
                        {facilityBook.map((item, i) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              {item.fasilitas_tambahans.nama_fasilitas}
                            </TableCell>
                            <TableCell>{item.jumlah}</TableCell>
                            <TableCell>
                              {formatDate(item.tgl_pemakaian)}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(item.subtotal * item.jumlah)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                ) : (
                  ""
                )}
              </ModalBody>
            ))}
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Confirmation Cancel Booking */}
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
            <p className="font-semibold text-center">
              Are you sure want to cancel this booking?
            </p>
          </ModalBody>
          {items
            ?.filter((item) => item.id == currentHistoryId)
            .map((item, i) => (
              <ModalFooter key={item.id}>
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
                  onClick={() => handlePembatalan(item.id)}
                >
                  Yes
                </button>
              </ModalFooter>
            ))}
        </ModalContent>
      </Modal>
    </section>
  );
};

export default HistoryReservation;
