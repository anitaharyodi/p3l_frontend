import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Chip,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Checkbox,
} from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { FaCheckDouble, FaDownload, FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { TbBrandSupernova } from "react-icons/tb";
import { GiDoubled } from "react-icons/gi";
import { TiFlowChildren } from "react-icons/ti";
import { MdMeetingRoom, MdNightsStay } from "react-icons/md";
import { toast } from "react-toastify";
import { IoEnter } from "react-icons/io5";
import { Link } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";

const CustomerStay = () => {
  const authToken = localStorage.getItem("tokenPegawai");
  const [reservationData, setReservationData] = useState([]);
  const [customerData, setCustomerData] = useState();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [fasilitasData, setFasilitasData] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [dates, setDates] = useState({});
  const [currentFacilityId, setCurrentFacilityId] = useState(null);
  const [historyData, setHistoryData] = useState({});
  const [bookRoom, setBookRoom] = useState([]);
  const [facilityBook, setFacilityBook] = useState([]);
  const [inputPayment, setInputPayment] = useState("");
  const [kembalian, setKembalian] = useState("");
  const rowsPerPage = 8;

  const {
    isOpen: facilityModalOpen,
    onOpen: openFacilityModal,
    onOpenChange: onFacilityModalOpenChange,
    onClose: closeFacilityModal,
  } = useDisclosure();

  const {
    isOpen: checkoutModalOpen,
    onOpen: openCheckoutModal,
    onOpenChange: onCheckoutModalOpenChange,
    onClose: closeCheckoutModal,
  } = useDisclosure();

  const {
    isOpen: inputPayModalOpen,
    onOpen: openInputPayModal,
    onOpenChange: onInputPayModalOpenChange,
    onClose: closeInputPayModal,
  } = useDisclosure();

  const {
    isOpen: paidModalOpen,
    onOpen: openPaidModal,
    onOpenChange: onPaidModalOpenChange,
    onClose: closePaidModal,
  } = useDisclosure();

  // Fetch Data Checkin
  const fetchCheckInData = () => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const apiURL = "https://ah-project.my.id/api/dataReservasi";

    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        setReservationData(response.data.mess.reverse());
      })
      .catch((error) => {
        console.error("Error fetching room data: ", error);
      });
  };

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const formatCurrency = (number) => {
    return `Rp ${new Intl.NumberFormat("id-ID").format(number)}`;
  };

  useEffect(() => {
    fetchCheckInData();
  }, [authToken]);

  //Search
  const filteredReservationData = reservationData?.filter((item) => {
    const idBooking = (item.id_booking || "").toLowerCase();
    const namaCustomer = ((item.customers || {}).nama || "").toLowerCase();
    const status = (item.status || "").toLowerCase();
    const searchLower = search.toLowerCase();

    return (
      idBooking.includes(searchLower) ||
      namaCustomer.includes(searchLower) ||
      status.includes(searchLower)
    );
  });

  //Search Pagination
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredReservationData.slice(start, end);
  }, [page, filteredReservationData, rowsPerPage]);

  const onClear = React.useCallback(() => {
    setSearch("");
    setPage(1);
  }, []);

  const columns = [
    {
      key: "id_booking",
      label: "BOOKING ID",
    },
    {
      key: "nama",
      label: "Customer Name",
    },
    {
      key: "tgl_checkin",
      label: "CHECK IN",
    },
    {
      key: "tgl_checkout",
      label: "CHECK OUT",
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

  const columnsKamar = [
    {
      key: "nights",
      label: "Nights",
    },
    {
      key: "jenis_kamar",
      label: "ROOM TYPE",
    },
    {
      key: "jumlah",
      label: "AMOUNT",
    },
    {
      key: "hargaPerMalam",
      label: "PRICE",
    },
    {
      key: "tarif_normal",
      label: "SUBTOTAL",
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
      key: "harga",
      label: "PRICE",
    },
    {
      key: "subtotal",
      label: "SUBTOTAL",
    },
  ];

  const isCheckInEnabled = (item) => {
    const currentDate = new Date();
    const checkinDate = new Date(item.tgl_checkin);

    currentDate.setHours(0, 0, 0, 0);
    checkinDate.setHours(0, 0, 0, 0);

    if (
      currentDate.getTime() == checkinDate.getTime() ||
      currentDate.getHours() >= 14
    ) {
      return true;
    }

    return false;
  };

  const isCheckOutEnabled = (item) => {
    const currentDate = new Date();
    const checkoutDate = new Date(item.tgl_checkout);

    currentDate.setHours(0, 0, 0, 0);
    checkoutDate.setHours(0, 0, 0, 0);

    if (
      currentDate.getTime() == checkoutDate.getTime() &&
      currentDate.getHours() <= 12
    ) {
      return true;
    }

    return false;
  };

  const isStay = (item) => {
    const currentDate = new Date();
    const checkinDate = new Date(item.tgl_checkin);
    const checkoutDate = new Date(item.tgl_checkout);

    currentDate.setHours(0, 0, 0, 0);
    checkinDate.setHours(0, 0, 0, 0);
    checkoutDate.setHours(0, 0, 0, 0);

    if (currentDate >= checkinDate && currentDate < checkoutDate) {
      if (currentDate.getHours() <= 12) {
        return true;
      }
    }

    return false;
  };

  useEffect(() => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const apiURL = "https://ah-project.my.id/api/fasilitas";

    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        setFasilitasData(response.data.mess);
      })
      .catch((error) => {
        console.error("Error fetching fasilitas data: ", error);
      });
  }, []);

  const handleCheckboxChangeGroup = (id) => {
    if (selectedFacilities.includes(id)) {
      setSelectedFacilities(
        selectedFacilities.filter((facilityId) => facilityId !== id)
      );
      const updatedQuantities = { ...quantities };
      delete updatedQuantities[id];
      setQuantities(updatedQuantities);
    } else {
      setSelectedFacilities([...selectedFacilities, id]);
      setQuantities({ ...quantities, [id]: 0 });
      setDates({ ...dates, [id]: null });
    }
  };

  const handleQuantityChange = (id, quantity) => {
    setQuantities({ ...quantities, [id]: quantity });
  };

  const handleDateChange = (id, dateValue) => {
    const selectedReservation = reservationData.find(
      (reservation) => reservation.id == currentFacilityId
    );

    const tglCheckinDate = new Date(selectedReservation.tgl_checkin);
    const tglCheckoutDate = new Date(selectedReservation.tgl_checkout);
    const selectedDate = new Date(dateValue);

    if (selectedDate >= tglCheckinDate && selectedDate <= tglCheckoutDate) {
      setDates({ ...dates, [id]: dateValue });
    } else {
      toast.error("Selected date is outside the range.", {
        position: "top-right",
        hideProgressBar: true,
        theme: "colored",
        autoClose: 1000,
      });
      setDates({ ...dates, [id]: null });
    }
  };

  const getPDF = (idReservation, noInvoice) => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      responseType: "blob",
    };
    const apiURL = `https://ah-project.my.id/api/invoice-pdf/${idReservation}`;

    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice_${noInvoice}.pdf`;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const openFacilityModalWithId = (reservationId) => {
    setCurrentFacilityId(reservationId);
    console.log(reservationId);
    openFacilityModal();
  };

  const openCheckoutModalWithId = (reservationId) => {
    setCurrentFacilityId(reservationId);
    console.log(reservationId);
    fetchHistoryById(reservationId);
    openCheckoutModal();
  };

  const handleAddFasilitas = () => {
    const requestData = [];

    selectedFacilities.forEach((facilityId) => {
      requestData.push({
        id_fasilitas: facilityId,
        jumlah: quantities[facilityId] || 0,
        tgl_pemakaian: dates[facilityId] || "",
        subtotal: fasilitasData[facilityId - 1].harga * quantities[facilityId],
      });
    });

    console.log(JSON.stringify(requestData, null, 2));

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const apiURL = `https://ah-project.my.id/api/transaksiFasilitas/${currentFacilityId}`;

    axios
      .post(apiURL, requestData, axiosConfig)
      .then((response) => {
        toast.success("Facility successfully add!", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        onFacilityModalOpenChange(true);
        setSelectedFacilities([]);
        setQuantities({});
        setDates({});
        setCurrentFacilityId(null);
      })
      .catch((error) => {
        console.error(error);
        setSelectedFacilities([]);
        setQuantities({});
        setDates({});
        setCurrentFacilityId(null);
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

  const handleCheckout = () => {
    const body = {
      input_bayar: inputPayment,
    };

    const apiURL = `https://ah-project.my.id/api/checkout/${currentFacilityId}`;

    axios
      .post(apiURL, body, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        if (response.data.status == "F") {
          toast.error(response.data.message, {
            position: "top-right",
            hideProgressBar: true,
            theme: "colored",
            autoClose: 1000,
          });
          setInputPayment("");
        } else {
          toast.success("Check-Out successfully", {
            position: "top-right",
            hideProgressBar: true,
            theme: "colored",
            autoClose: 1000,
          });
          onInputPayModalOpenChange(true);
          onCheckoutModalOpenChange(true);
          setInputPayment("");
          setKembalian(response.data.kembalian);
          openPaidModal();
        }
      })
      .catch((error) => {
        console.log("Error checkout: ", error.response.message.data);
      });
  };

  // const currentItem = items.find(item => item.id == currentFacilityId);

  // console.log("ISI ITEM", JSON.stringify(items, null, 2));
  return (
    <section>
      <div className="h2 text-accent p-2 rounded-lg font-semibold text-[30px] uppercase font-tertiary tracking-[2px] flex items-center">
        <MdNightsStay className="text-2xl mr-2" />
        Customer Stays
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
        aria-label="Table Rooms"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={
                filteredReservationData.length <= rowsPerPage
                  ? 1
                  : Math.ceil(filteredReservationData.length / rowsPerPage)
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
          {items.map((item, i) => (
            <TableRow key={item.id}>
              <TableCell className="text-medium">{item.id_booking}</TableCell>
              <TableCell className="text-medium">
                {item.customers.nama}
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
                      : item.status == "Confirmed"
                      ? "secondary"
                      : "primary"
                  }
                  className="text-white"
                >
                  {item.status}
                </Chip>
              </TableCell>
              <TableCell className="w-[50px]">
                <div className="flex">
                  {item.status == "Confirmed" ? (
                    !isCheckInEnabled(item) ? (
                      <Link
                        className="font-secondary text-gray-500 text-center bg-gray-300 font-medium rounded-md py-2 px-2 w-[100px] flex-none cursor-default"
                        disabled
                      >
                        Check-In
                      </Link>
                    ) : (
                      <Link
                        className="font-secondary text-white text-center bg-success-500 font-medium rounded-md py-2 px-2 w-[100px] flex-none"
                        to={`/home/checkin?item=${encodeURIComponent(
                          JSON.stringify(item)
                        )}`}
                        // to={`/home/checkin?id=${item.id}&tgl_checkin=${item.tgl_checkin}`}
                      >
                        Check-In
                      </Link>
                    )
                  ) : item.status == "Check-In" ? (
                    isStay(item) ? (
                      <Link
                        className="font-secondary text-white text-center bg-primary-500 font-medium rounded-md py-2 px-2 w-[100px] flex-none"
                        onClick={() => openFacilityModalWithId(item.id)}
                      >
                        Add Facility
                      </Link>
                    ) : !isCheckOutEnabled(item) ? (
                      <Link
                        className="font-secondary text-gray-500 text-center bg-gray-300 font-medium rounded-md py-2 px-2 w-[100px] flex-none cursor-default"
                        disabled
                      >
                        Check-Out
                      </Link>
                    ) : (
                      <Link
                        className="font-secondary text-white text-center bg-danger-500 font-medium rounded-md py-2 px-2 w-[100px] flex-none"
                        onClick={() => openCheckoutModalWithId(item.id)}
                      >
                        Check-Out
                      </Link>
                    )
                  ) : (
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          className="justify-center  mx-auto"
                        >
                          <div className="flex justify-center items-center  mx-auto">
                            <BsThreeDotsVertical className="text-default-500 mx-auto" />
                          </div>
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem
                          color="warning"
                          startContent={<FaDownload />}
                          onClick={() => {
                            getPDF(item.id, item.invoices[0].no_invoice);
                          }}
                        >
                          Download Invoice
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal Add Facility */}
      <Modal
        isOpen={facilityModalOpen}
        onOpenChange={onFacilityModalOpenChange}
        size={"2xl"}
      >
        <ModalContent>
          <ModalHeader>
            <div className="flex flex-col items-center w-full">
              <p className="text-center mt-1 uppercase text-[#1E2131] font-bold tracking-[1px]">
                Add Facility
              </p>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className=" grid grid-cols-3 gap-4">
              {fasilitasData.map((facility) => (
                <div key={facility.id} className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      value={facility.id.toString()}
                      onChange={() => handleCheckboxChangeGroup(facility.id)}
                      checked={selectedFacilities.includes(facility.id)}
                    >
                      {facility.nama_fasilitas}
                    </Checkbox>
                  </div>
                  {selectedFacilities.includes(facility.id) && (
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min="0"
                        className="border-2 w-12 h-6 pl-2 rounded-md"
                        value={quantities[facility.id] || 0}
                        onChange={(e) =>
                          handleQuantityChange(
                            facility.id,
                            parseInt(e.target.value, 10)
                          )
                        }
                      />
                      <input
                        type="date"
                        className="border-2 w-[130px] h-6 pl-2 rounded-md"
                        value={dates[facility.id] || ""}
                        onChange={(e) =>
                          handleDateChange(facility.id, e.target.value)
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="flex justify-center mx-auto">
              <button
                className="w-[200px] h-[40px] rounded-md text-black"
                onClick={() => {
                  closeFacilityModal();
                  setSelectedFacilities([]);
                  setQuantities({});
                  setDates({});
                  setCurrentFacilityId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-[#1E2131] text-white w-[200px] h-[40px] rounded-md"
                onClick={() => handleAddFasilitas()}
              >
                Confirm
              </button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Preview Invoice */}
      <Modal
        isOpen={checkoutModalOpen}
        onOpenChange={onCheckoutModalOpenChange}
        scrollBehavior="inside"
        size="2xl"
      >
        <ModalContent>
          {items
            ?.filter((item) => item.id == currentFacilityId)
            .map((item, i) => (
              <ModalHeader key={item.id} className="flex justify-between">
                <p>Detail Reservation</p>
              </ModalHeader>
            ))}
          {items
            ?.filter((item) => item.id == currentFacilityId)
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
                      <p className="">{item.customers.nama}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">Email</p>
                    </div>
                    <div>
                      <p className="">{item.customers.email}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">Phone Number</p>
                    </div>
                    <div>
                      <p className="">{item.customers.no_telepon}</p>
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
                          const jenisKamarCounts = {};
                          bookRoom.forEach((item) => {
                            const jenisKamar =
                              item.jenis_kamars.jenis_kamar;
                            jenisKamarCounts[jenisKamar] =
                              (jenisKamarCounts[jenisKamar] || 0) + 1;
                          });
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
                                item.jenis_kamars.jenis_kamar ==
                                jenisKamar
                            );

                            const reservationFiltered = items?.filter(
                              (item) => item.id == currentFacilityId
                            );

                            const tgl_checkin = new Date(
                              reservationFiltered[0].tgl_checkin
                            );
                            const tgl_checkout = new Date(
                              reservationFiltered[0].tgl_checkout
                            );
                            const jumlahMalam = Math.ceil(
                              (tgl_checkout - tgl_checkin) /
                                (1000 * 60 * 60 * 24)
                            );

                            const hargaPerMalamTotal = filteredItems.reduce(
                              (total, item) => total + item.hargaPerMalam,
                              0
                            );

                            const hargaPerMalam =
                              filteredItems.length > 0
                                ? filteredItems[0].hargaPerMalam
                                : 0;

                            return (
                              <TableRow key={index}>
                                <TableCell>{jumlahMalam}</TableCell>
                                <TableCell>{jenisKamar}</TableCell>
                                <TableCell>{totalKamar}</TableCell>
                                <TableCell>
                                  {formatCurrency(hargaPerMalam)}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(
                                    hargaPerMalamTotal * jumlahMalam
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          });
                        })()}
                      </TableBody>
                    </Table>
                    <div className="bg-white shadow-md rounded-lg p-2">
                      <div className="flex justify-between">
                        <p className="text-right font-medium mr-[50px] px-2">
                          Total Room Price :
                        </p>
                        <p className="text-right font-medium mr-[50px]">
                          {formatCurrency(item.total_harga)}
                        </p>
                      </div>
                    </div>
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
                              {formatCurrency(item.fasilitas_tambahans.harga)}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(item.subtotal)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="bg-white shadow-md rounded-lg p-2">
                      <div className="flex justify-between">
                        <p className="text-right font-medium mr-[50px] px-2">
                          Total Facility Price :
                        </p>
                        <p className="text-right font-medium mr-[40px]">
                          {formatCurrency(
                            facilityBook.reduce(
                              (total, item) => total + item.subtotal,
                              0
                            )
                          )}
                        </p>
                      </div>
                    </div>
                    <p className="text-right mr-[40px]">
                      Tax:{" "}
                      {formatCurrency(
                        facilityBook.reduce(
                          (total, item) => total + item.subtotal,
                          0
                        ) * 0.1
                      )}
                    </p>
                    <p className="text-right font-semibold text-md mr-[40px]">
                      TOTAL :{" "}
                      {formatCurrency(
                        facilityBook.reduce(
                          (total, item) => total + item.subtotal,
                          0
                        ) *
                          0.1 +
                          item.total_harga_all
                      )}
                    </p>
                    <p className="text-right mr-[40px] mt-6">
                      Down Payment : {formatCurrency(item.uang_jaminan)}
                    </p>
                    <p className="text-right mr-[40px]">
                      Deposit : {formatCurrency(item.deposit)}
                    </p>
                    <p className="text-right font-semibold text-lg mr-[40px]">
                      CASH :{" "}
                      {formatCurrency(
                        Math.max(
                          0,
                          facilityBook.reduce(
                            (total, item) => total + item.subtotal,
                            0
                          ) *
                            0.1 +
                            item.total_harga_all -
                            (item.uang_jaminan + item.deposit)
                        )
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-right font-semibold text-md mr-[40px]">
                      TOTAL : {formatCurrency(item.total_harga)}
                    </p>
                    <p className="text-right mr-[40px] mt-6">
                      Down Payment : {formatCurrency(item.uang_jaminan)}
                    </p>
                    <p className="text-right mr-[40px]">
                      Deposit : {formatCurrency(item.deposit)}
                    </p>
                    <p className="text-right font-semibold text-lg mr-[40px]">
                      CASH :{" "}
                      {formatCurrency(
                        Math.max(
                          0,
                          item.total_harga - (item.uang_jaminan + item.deposit)
                        )
                      )}
                    </p>
                  </>
                )}
              </ModalBody>
            ))}
          <ModalFooter>
            <div className="flex justify-center mx-auto">
              <button
                className="bg-[#1E2131] text-white w-[200px] h-[40px] rounded-md"
                onClick={() => {
                  openInputPayModal();
                }}
              >
                Pay
              </button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Input Payment */}
      <Modal
        isOpen={inputPayModalOpen}
        onOpenChange={onInputPayModalOpenChange}
      >
        <ModalContent>
          <ModalHeader>
            <div className="flex flex-col items-center w-full">
              <p className="text-center mt-1 uppercase text-[#1E2131] font-bold tracking-[1px]">
                Input the nominal of payment
              </p>
            </div>
          </ModalHeader>
          <ModalBody>
            <Input
              className="w-full text-medium"
              placeholder="Input payment nominal"
              value={inputPayment}
              onChange={(e) => {
                setInputPayment(e.target.value);
              }}
            />
          </ModalBody>
          <ModalFooter>
            <button
              className="w-[200px] h-[40px] rounded-md text-black"
              onClick={() => {
                closeInputPayModal();
                setInputPayment("");
              }}
            >
              Cancel
            </button>
            <button
              className="bg-[#1E2131] text-white w-[200px] h-[40px] rounded-md"
              onClick={() => {
                !inputPayment
                  ? toast.error("Please fill the input first!", {
                      position: "top-right",
                      hideProgressBar: true,
                      theme: "colored",
                      autoClose: 1000,
                    })
                  : handleCheckout();
              }}
            >
              Confirm
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal After Checkout */}
      <Modal isOpen={paidModalOpen} onOpenChange={onPaidModalOpenChange}>
        <ModalContent>
          <ModalHeader>
            <div className="flex flex-col items-center w-full">
              <p className="text-center mt-1 uppercase text-[#1E2131] font-bold tracking-[1px]">
                Check-Out Successfully
              </p>
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="font-semibold text-center text-danger-500">
              Change Money: {formatCurrency(kembalian)}
            </p>
            <div>
              {items.find((item) => item.id == currentFacilityId) && (
                <div className="flex justify-center mx-auto">
                  {items.find((item) => item.id == currentFacilityId).invoices
                    .length >= 0 && (
                    <button
                      className="border-1 border-[#1E2131] text-[#1E2131] font-semibold w-[200px] h-[40px] rounded-md"
                      onClick={() =>
                        getPDF(
                          currentFacilityId,
                          items.find((item) => item.id == currentFacilityId)
                            .invoices[0]?.no_invoice
                        )
                      }
                    >
                      Download Invoice
                    </button>
                  )}
                </div>
              )}
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="flex justify-center mx-auto">
              <button
                className="bg-[#1E2131] text-white w-[200px] h-[40px] rounded-md"
                onClick={() => {
                  closePaidModal();
                  window.location.reload();
                }}
              >
                Confirm
              </button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  );
};

export default CustomerStay;
