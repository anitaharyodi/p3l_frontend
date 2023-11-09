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
} from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { BsFillPersonFill, BsThreeDotsVertical } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { FaCheckDouble, FaEdit, FaHandHoldingUsd } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { TbBrandSupernova } from "react-icons/tb";
import { GiDoubled } from "react-icons/gi";
import { TiFlowChildren } from "react-icons/ti";
import { MdLibraryBooks, MdMeetingRoom } from "react-icons/md";
import { toast } from "react-toastify";
import { FaMoneyBills } from "react-icons/fa6";
import { BiSolidUserDetail } from "react-icons/bi";
import { AiFillEye, AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router";

const CustomerPage = () => {
  const navigate = useNavigate()
  const authToken = localStorage.getItem("tokenPegawai");
  const getIdLogin = localStorage.getItem("idPegawai");
  const [customerData, setCustomerData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const [currentCustomerId, setCurrentCustomerId] = useState(null);
  const [currentCustomerData, setCurrentCustomerData] = useState({
    nama: "",
    email: "",
    nama_institusi: "",
    no_identitas: "",
    no_telepon: "",
    alamat: "",
    role: ""
  });

  const [namaError, setNamaError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [namaInstitusiError, setNamaInstitusiError] = useState(false);
  const [noIdError, setNoIdError] = useState(false);
  const [noTelpError, setNoTelpError] = useState(false);
  const [alamatError, setAlamatError] = useState(false);

  const {
    isOpen: createModalOpen,
    onOpen: openCreateModal,
    onOpenChange: onCreateModalOpenChange,
    onClose: closeCreateModal,
  } = useDisclosure();

  const {
    isOpen: createConfModalOpen,
    onOpen: openCreateConfModal,
    onOpenChange: onCreateConfModalOpenChange,
    onClose: closeCreateConfModal,
  } = useDisclosure();

  // Fetch Data history
  const fetchCustomerData = () => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const apiURL = "http://localhost:8000/api/customer";

    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        setCustomerData(response.data.mess.reverse());
      })
      .catch((error) => {
        console.error("Error fetching customer data: ", error);
      });
  };
  useEffect(() => {
    fetchCustomerData();
  }, [authToken]);

  //Search
  const filteredCustomerData = customerData.filter((item) => {
    const namaCustomer = item.nama.toLowerCase();
    const email = item.email.toLowerCase();
    const namaInstitusi = item.nama_institusi.toLowerCase();
    const searchLower = search.toLowerCase();

    return namaCustomer.includes(searchLower) || email.includes(searchLower) || namaInstitusi.includes(searchLower)
  });

  //Search Pagination
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredCustomerData.slice(start, end);
  }, [page, filteredCustomerData, rowsPerPage]);

  const onClear = React.useCallback(() => {
    setSearch("");
    setPage(1);
  }, []);

  const columns = [
    {
      key: "nama",
      label: "NAME",
    },
    {
      key: "email",
      label: "EMAIL",
    },
    {
      key: "nama_institusi",
      label: "INSTITUTION",
    },
    {
      key: "no_identitas",
      label: "IDENTITY NUMBER",
    },
    {
      key: "no_telepon",
      label: "PHONE NUMBER",
    },
    {
      key: "alamat",
      label: "ADDRESS",
    },
    {
      key: "actions",
      label: "ACTIONS",
    },
  ];

  // Add Customer
  const handleAddCustomer = async () => {
    if (
      !currentCustomerData.nama &&
      !currentCustomerData.email &&
      !currentCustomerData.nama_institusi &&
      !currentCustomerData.no_identitas &&
      !currentCustomerData.no_telepon &&
      !currentCustomerData.alamat
    ) {
      setNamaError(true);
      setEmailError(true);
      setNamaInstitusiError(true);
      setNoIdError(true);
      setNoTelpError(true);
      setAlamatError(true);
    }
    if (!currentCustomerData.nama) {
      setNamaError(true);
      return;
    }
    if (!currentCustomerData.email) {
      setEmailError(true);
      return;
    }
    if (!currentCustomerData.nama_institusi) {
      setNamaInstitusiError(true);
      return;
    }
    if (!currentCustomerData.no_identitas) {
      setNoIdError(true);
      return;
    }
    if (!currentCustomerData.no_telepon) {
      setNoTelpError(true);
      return;
    }
    if (!currentCustomerData.alamat) {
      setAlamatError(true);
      return;
    }

    const body = {
      nama: currentCustomerData.nama,
      email: currentCustomerData.email,
      nama_institusi: currentCustomerData.nama_institusi,
      no_identitas: currentCustomerData.no_identitas,
      no_telepon: currentCustomerData.no_telepon,
      alamat: currentCustomerData.alamat,
      role: "G",
    };

    const apiURL = "http://localhost:8000/api/register";
    // console.log("BODYYY", body);

    axios
      .post(apiURL, body)
      .then((response) => {
        toast.success("Success Add Customer", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        onCreateModalOpenChange(true);
        onCreateConfModalOpenChange(true)
        fetchCustomerData();
        setCurrentCustomerData({
          nama: "",
          email: "",
          nama_institusi: "",
          no_identitas: "",
          no_telepon: "",
          alamat: "",
          role: ""
        });
        setCurrentCustomerId(null);
      })
      .catch((error) => {
        console.error("Error adding customer data: ", error);
        onCreateConfModalOpenChange(true)
      });
  };

  return (
    <section>
      <div className="h2 text-accent p-2 rounded-lg font-semibold text-[30px] uppercase font-tertiary tracking-[2px] flex items-center">
        <BsFillPersonFill className="text-2xl mr-2" />
        Customers
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
        <button
          className="btn btn-primary bg-[#1E2131] hover:bg-[#1E2131] rounded-md py-2 px-2 w-[180px] flex-none"
          onClick={() => {
            openCreateModal();
          }}
        >
          <IoMdAdd className="mr-2" />
          Add Group Cust
        </button>
      </div>
      <Table
        aria-label="Table Facility"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={
                filteredCustomerData.length <= rowsPerPage
                  ? 1
                  : Math.ceil(filteredCustomerData.length / rowsPerPage)
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
              <TableCell className="text-medium">
                {item.nama}
              </TableCell>
              <TableCell className="text-medium">{item.email}</TableCell>
              <TableCell className="text-medium">{item.nama_institusi}</TableCell>
              <TableCell className="text-medium">{item.no_identitas}</TableCell>
              <TableCell className="text-medium">{item.no_telepon}</TableCell>
              <TableCell className="text-medium">{item.alamat}</TableCell>
              <TableCell className="w-[50px]">
                {item.reservations.some(reservation => reservation.id_sm == getIdLogin) ? (
                <div className="relative flex items-center">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly size="sm" variant="light">
                        <BsThreeDotsVertical className="text-default-500" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        color="warning"
                        startContent={<AiOutlinePlus />}
                        onClick={() => {
                          navigate(`/home/reservation?id=${item.id}`);
                        }}
                      >
                        Add Reservation
                      </DropdownItem>
                      <DropdownItem
                        color="primary"
                        startContent={<MdLibraryBooks />}
                        onClick={() => {
                          navigate(`/home/historyReservation?id=${item.id}`);
                        }}
                      >
                        History Reservation
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>

                ):null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal Create Customer */}
      <Modal isOpen={createModalOpen} onOpenChange={onCreateModalOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Add Group Customer
          </ModalHeader>
          <ModalBody>
            <div className="mb-2">
              <Input
                type="text"
                label="Name"
                variant="bordered"
                errorMessage={namaError ? "Name cannot be empty" : ""}
                value={currentCustomerData.nama}
                onChange={(e) => {
                  setCurrentCustomerData({
                    ...currentCustomerData,
                    nama: e.target.value,
                  });
                  setNamaError(false);
                }}
              />
            </div>
            <div className="mb-2">
              <Input
                type="email"
                label="Email"
                variant="bordered"
                errorMessage={emailError ? "Email cannot be empty" : ""}
                value={currentCustomerData.email}
                onChange={(e) => {
                  setCurrentCustomerData({
                    ...currentCustomerData,
                    email: e.target.value,
                  });
                  setEmailError(false);
                }}
              />
            </div>
            <div className="mb-2">
              <Input
                type="text"
                label="Institution"
                variant="bordered"
                errorMessage={namaInstitusiError ? "Institution cannot be empty" : ""}
                value={currentCustomerData.satuan}
                onChange={(e) => {
                  setCurrentCustomerData({
                    ...currentCustomerData,
                    nama_institusi: e.target.value,
                  });
                  setNamaInstitusiError(false);
                }}
              />
            </div>
            <div className="mb-2">
              <Input
                type="text"
                label="Identity Number"
                variant="bordered"
                errorMessage={noIdError ? "Identity Number cannot be empty" : ""}
                value={currentCustomerData.no_identitas}
                onChange={(e) => {
                  setCurrentCustomerData({
                    ...currentCustomerData,
                    no_identitas: e.target.value,
                  });
                  setNoIdError(false);
                }}
              />
            </div>
            <div className="mb-2">
              <Input
                type="numeric"
                label="Phone Number"
                variant="bordered"
                errorMessage={namaInstitusiError ? "Phone Number cannot be empty" : ""}
                value={currentCustomerData.no_telepon}
                onChange={(e) => {
                  setCurrentCustomerData({
                    ...currentCustomerData,
                    no_telepon: e.target.value,
                  });
                  setNoTelpError(false);
                }}
              />
            </div>
            <div className="mb-2">
              <Input
                type="text"
                label="Address"
                variant="bordered"
                errorMessage={alamatError ? "Address cannot be empty" : ""}
                value={currentCustomerData.alamat}
                onChange={(e) => {
                  setCurrentCustomerData({
                    ...currentCustomerData,
                    alamat: e.target.value,
                  });
                  setAlamatError(false);
                }}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              className="btn btn-tertiary h-[40px] rounded-md text-black"
              onClick={() => {
                setCurrentCustomerId(null);
                closeCreateModal();
                setCurrentCustomerData({
                  nama: "",
                  email: "",
                  nama_institusi: "",
                  no_identitas: "",
                  no_telepon: "",
                  alamat: "",
                  role: ""
                });
                setNamaError(false);
                setEmailError(false);
                setNamaInstitusiError(false);
                setNoIdError(false);
                setNoTelpError(false);
                setAlamatError(false);
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary h-[40px] rounded-md"
              onClick={() => {
                openCreateConfModal()
                  
              }}
            >
              <IoMdAdd className="mr-2" />
              Add
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Confirm */}
      <Modal isOpen={createConfModalOpen} onOpenChange={onCreateConfModalOpenChange}>
        <ModalContent>
          <ModalHeader>Add Group Customer</ModalHeader>
          <ModalBody>Are you sure you want to add this group customer?</ModalBody>
          <ModalFooter>
            <button
              className="btn btn-tertiary h-[40px] rounded-md text-black"
              onClick={() => {
                closeCreateConfModal();
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary h-[40px] rounded-md"
              onClick={() =>  handleAddCustomer()}
            >
              Add
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  );
};

export default CustomerPage;
