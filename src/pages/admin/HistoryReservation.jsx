import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { MdLibraryBooks } from "react-icons/md";
import { useLocation } from "react-router";

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

  const [currentHistoryrId, setCurrentHistoryId] = useState(null);
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

  const columnsKamar = [
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

  // Fetch Data history
  const fetchHistoryData = () => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const apiURL = `http://localhost:8000/api/customer/${id}`;

    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        setHistoryData(response.data.data);
        const bookRoomData = [];
        const facilityBookData = [];
        response.data.data.reservations.forEach((reservation) => {
          bookRoomData.push(reservation.reservasi_kamars);
          facilityBookData.push(reservation.transaksi_fasilitas);
        });

        setBookRoom(bookRoomData);
        setFacilityBook(facilityBookData);

        const flattenedBookRoom = [].concat(...bookRoomData);
      const flattenedFacilityBook = [].concat(...facilityBookData);
      setBookRoom(flattenedBookRoom);
      setFacilityBook(flattenedFacilityBook);
      })
      .catch((error) => {
        console.error("Error fetching history data: ", error);
      });
  };
  useEffect(() => {
    fetchHistoryData();
    // console.log(JSON.stringify(facilityBook,null,2))
  }, [authToken]);
  //Search
  const filteredHistoryData = historyData.reservations?.filter((item) => {
    const status = item.status.toLowerCase();
    const idBooking = item.id_booking.toLowerCase();
    const searchLower = search.toLowerCase();

    return (
      status.includes(searchLower) ||
      idBooking.includes(searchLower)
    );
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
              <TableCell className="text-medium">{formatDate(item.tgl_reservasi)}</TableCell>
              <TableCell className="text-medium">
                {formatDate(item.tgl_checkin)}
              </TableCell>
              <TableCell className="text-medium">{formatDate(item.tgl_checkout)}</TableCell>
              <TableCell className="text-medium">
              <Chip
              color={
                item.status === "Lunas"
                  ? "success"
                  : item.status === "Menunggu Pembayaran"
                  ? "warning"
                  : item.status === "Check-In"
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
                          onClick={openCreateModal}>
                          See Details
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
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
            <ModalHeader className="flex flex-col gap-1">
              Detail Reservation
            </ModalHeader>
            {items?.map((item, i) => (
            <ModalBody key={item.id}>
              <><div className="flex justify-between">
                    <h2 className="h2 text-[20px] font-bold">Booking ID #{item.id_booking}</h2>
                    <Chip
                        color={item.status === "Lunas"
                            ? "success"
                            : item.status === "Menunggu Pembayaran"
                                ? "warning"
                                : item.status === "Check-In"
                                    ? "primary"
                                    : "danger"}
                        className="text-white"
                    >
                        {item.status}
                    </Chip>
                </div><div className="border-t-2 border-gray-300 -mt-4"></div><div className="flex justify-between">
                        <div>
                            <p className="font-semibold">Name</p>
                        </div>
                        <div>
                            <p className="">{historyData.nama}</p>
                        </div>
                    </div><div className="flex justify-between">
                        <div>
                            <p className="font-semibold">Email</p>
                        </div>
                        <div>
                            <p className="">{historyData.email}</p>
                        </div>
                    </div><div className="flex justify-between">
                        <div>
                            <p className="font-semibold">Phone Number</p>
                        </div>
                        <div>
                            <p className="">{historyData.no_telepon}</p>
                        </div>
                    </div><div className="mt-4">
                        <h2 className="h2 text-[20px] font-semibold">Reservation</h2>
                    </div><div className="border-t-2 border-gray-300 -mt-4" /><div className="flex justify-between">
                        <div>
                            <p className="font-semibold">Check-In</p>
                        </div>
                        <div>
                            <p className="">{formatDate(item.tgl_checkin)}</p>
                        </div>
                    </div><div className="flex justify-between">
                        <div>
                            <p className="font-semibold">Check-Out</p>
                        </div>
                        <div>
                            <p className="">{formatDate(item.tgl_checkout)}</p>
                        </div>
                    </div><div className="flex justify-between">
                        <div>
                            <p className="font-semibold">Adults</p>
                        </div>
                        <div>
                            <p className="">{item.jumlah_dewasa}</p>
                        </div>
                    </div><div className="flex justify-between">
                        <div>
                            <p className="font-semibold">Kids</p>
                        </div>
                        <div>
                            <p className="">{item.jumlah_anak}</p>
                        </div>
                    </div><div className="flex justify-between">
                        <div>
                            <p className="font-semibold">Down Payment</p>
                        </div>
                        <div>
                            <p className="">{formatCurrency(item.uang_jaminan)}</p>
                        </div>
                    </div><div className="flex justify-between">
                        <div>
                            <p className="font-semibold">Payment Date</p>
                        </div>
                        <div>
                            <p className="">{formatDate(item.tgl_pembayaran)}</p>
                        </div>
                    </div></>
               
              {bookRoom.length !== 0 ? (
              <><div className="mt-4">
                  <h2 className="h2 text-[20px] font-semibold">Room</h2>
                </div><div className="border-t-2 border-gray-300 -mt-4" /><Table>
                    <TableHeader columns={columnsKamar}>
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
            ))}
            <ModalFooter>
            </ModalFooter>
          </ModalContent>
        </Modal>
    </section>
  );
};

export default HistoryReservation;
