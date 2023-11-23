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
  const rowsPerPage = 8;

  const {
    isOpen: facilityModalOpen,
    onOpen: openFacilityModal,
    onOpenChange: onFacilityModalOpenChange,
    onClose: closeFacilityModal,
  } = useDisclosure();

  // Fetch Data Kamar
  const fetchCheckInData = () => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const apiURL = "http://localhost:8000/api/dataReservasi";

    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        setReservationData(response.data.mess.reverse());
        // console.log(JSON.stringify(response.data.mess, null, 2))
        // setCustomerData(response.data.mess.customers);
      })
      .catch((error) => {
        console.error("Error fetching room data: ", error);
      });
  };

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
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

  const isCheckInEnabled = (item) => {
    const currentDate = new Date();
    const checkinDate = new Date(item.tgl_checkin);

    currentDate.setHours(0, 0, 0, 0);
    checkinDate.setHours(0, 0, 0, 0);

    if (
      currentDate.getTime() === checkinDate.getTime() ||
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
      currentDate.getTime() === checkoutDate.getTime() &&
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

    const apiURL = "http://localhost:8000/api/fasilitas";

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
      (reservation) => reservation.id === currentFacilityId
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
    const apiURL = `http://localhost:8000/api/invoice-pdf/${idReservation}`;

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

  const handleAddFasilitas = () => {
      const requestData = [];

      selectedFacilities.forEach((facilityId) => {
        requestData.push({
          id_fasilitas: facilityId,
          jumlah: quantities[facilityId] || 0,
          tgl_pemakaian: dates[facilityId] || "",
          subtotal:
            fasilitasData[facilityId - 1].harga * quantities[facilityId],
        });
      });

      console.log(JSON.stringify(requestData,null, 2))

      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

      const apiURL = `http://localhost:8000/api/transaksiFasilitas/${currentFacilityId}`;

      axios
        .post(apiURL, requestData, axiosConfig)
        .then((response) => {
          toast.success("Facility successfully add!", {
            position: "top-right",
            hideProgressBar: true,
            theme: "colored",
            autoClose: 1000,
          });
          onFacilityModalOpenChange(true)
          setSelectedFacilities([])
                setQuantities({})
                setDates({})
                setCurrentFacilityId(null)
        })
        .catch((error) => {
          console.error(error);
          setSelectedFacilities([])
                setQuantities({})
                setDates({})
                setCurrentFacilityId(null)
        });

  };

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
                    item.status === "Paid"
                      ? "success"
                      : item.status === "Confirmed"
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
                  {item.status === "Confirmed" ? (
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
                  ) : item.status === "Check-In" ? (
                    isStay(item) ? (
                      <Link className="font-secondary text-white text-center bg-primary-500 font-medium rounded-md py-2 px-2 w-[100px] flex-none"
                      onClick={() => openFacilityModalWithId(item.id)}>
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
                      <Link className="font-secondary text-white text-center bg-danger-500 font-medium rounded-md py-2 px-2 w-[100px] flex-none">
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
      <Modal isOpen={facilityModalOpen} onOpenChange={onFacilityModalOpenChange} size={'2xl'}>
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
                        <div
                          key={facility.id}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              value={facility.id.toString()}
                              onChange={() =>
                                handleCheckboxChangeGroup(facility.id)
                              }
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
                                  handleDateChange(facility.id, e.target.value )
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
                setSelectedFacilities([])
                setQuantities({})
                setDates({})
                setCurrentFacilityId(null)
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
    </section>
  );
};

export default CustomerStay;
