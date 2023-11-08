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
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { FaCheckDouble, FaEdit, FaHandHoldingUsd } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { TbBrandSupernova } from "react-icons/tb";
import { GiDoubled } from "react-icons/gi";
import { TiFlowChildren } from "react-icons/ti";
import { MdMeetingRoom } from "react-icons/md";
import { toast } from "react-toastify";
import { FaMoneyBills } from "react-icons/fa6";

const FasilitasPage = () => {
  const authToken = localStorage.getItem("tokenPegawai");
  const [fasilitasData, setFasilitasData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const [fasilitasToDelete, setFasilitasToDelete] = useState(null);
  const [currentFasilitasId, setCurrentFasilitasId] = useState(null);
  const [currentFasilitasData, setCurrentFasilitasData] = useState({
    nama_fasilitas: "",
    harga: "",
    satuan: "",
  });

  const [namaFasilitasError, setNamaFasilitasError] = useState(false);
  const [hargaError, setHargaError] = useState(false);
  const [satuanError, setSatuanError] = useState(false);

  const formatCurrencyIDR = (amount) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

    return formatter.format(amount).replace("Rp", "IDR");
  };

  const {
    isOpen: createModalOpen,
    onOpen: openCreateModal,
    onOpenChange: onCreateModalOpenChange,
    onClose: closeCreateModal,
  } = useDisclosure();

  const {
    isOpen: deleteModalOpen,
    onOpen: openDeleteModal,
    onOpenChange: onDeleteModalOpenChange,
    onClose: closeDeleteModal,
  } = useDisclosure();

  const {
    isOpen: editModalOpen,
    onOpen: openEditModal,
    onOpenChange: onEditModalOpenChange,
    onClose: closeEditModal,
  } = useDisclosure();

  const {
    isOpen: createConfModalOpen,
    onOpen: openCreateConfModal,
    onOpenChange: onCreateConfModalOpenChange,
    onClose: closeCreateConfModal,
  } = useDisclosure();

  // Fetch Data Fasilitas
  const fetchFasilitasData = () => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const apiURL = "http://localhost:8000/api/fasilitas";

    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        setFasilitasData(response.data.mess.reverse());
      })
      .catch((error) => {
        console.error("Error fetching fasilitas data: ", error);
      });
  };
  useEffect(() => {
    fetchFasilitasData();
  }, [authToken]);

  //Search
  const filteredFasilitasData = fasilitasData.filter((item) => {
    const namaFasilitas = item.nama_fasilitas.toLowerCase();
    const searchLower = search.toLowerCase();

    return namaFasilitas.includes(searchLower)
  });

  //Search Pagination
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredFasilitasData.slice(start, end);
  }, [page, filteredFasilitasData, rowsPerPage]);

  const onClear = React.useCallback(() => {
    setSearch("");
    setPage(1);
  }, []);

  const handleEditFasilitas = (fasilitasId) => {
    setCurrentFasilitasId(fasilitasId);
    openCreateModal();
  };

  const columns = [
    {
      key: "nama_fasilitas",
      label: "FACILITY NAME",
    },
    {
      key: "harga",
      label: "PRICE",
    },
    {
      key: "satuan",
      label: "UNIT",
    },
    {
      key: "actions",
      label: "ACTIONS",
    },
  ];

  // get Fasilitas by ID
  useEffect(() => {
    if (currentFasilitasId) {
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
      const apiURL = `http://localhost:8000/api/fasilitas/${currentFasilitasId}`;

      axios
        .get(apiURL, axiosConfig)
        .then((response) => {
          console.log("DETAIL ID", JSON.stringify(response.data.data, null, 2));
          setCurrentFasilitasData(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching fasilitas data: ", error);
        });
    }
  }, [authToken, currentFasilitasId]);

  // Add Fasilitas
  const handleAddFasilitas = async () => {
    if (
      !currentFasilitasData.nama_fasilitas &&
      !currentFasilitasData.harga &&
      !currentFasilitasData.satuan
    ) {
      setNamaFasilitasError(true);
      setHargaError(true);
      setSatuanError(true);
    }
    if (!currentFasilitasData.nama_fasilitas) {
      setNamaFasilitasError(true);
      return;
    }
    if (!currentFasilitasData.harga) {
      setHargaError(true);
      return;
    }
    if (!currentFasilitasData.satuan) {
      setSatuanError(true);
      return;
    }

    const body = {
      nama_fasilitas: currentFasilitasData.nama_fasilitas,
      harga: currentFasilitasData.harga,
      satuan: currentFasilitasData.satuan,
    };

    const apiURL = "http://localhost:8000/api/fasilitas";

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const isDuplicate = fasilitasData.some(
      (fasilitas) => fasilitas.nama_fasilitas === currentFasilitasData.nama_fasilitas
    );
    if (isDuplicate) {
      toast.error("Facility name must be unique", {
        position: "top-right",
        hideProgressBar: true,
        theme: "colored",
        autoClose: 1000,
      });
      onCreateConfModalOpenChange(true);
      return;
    }
    // console.log("BODYYY", body);

    axios
      .post(apiURL, body, axiosConfig)
      .then((response) => {
        toast.success("Success Add Fasilitas", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        onCreateModalOpenChange(true);
        onCreateConfModalOpenChange(true)
        fetchFasilitasData();
        setCurrentFasilitasData({
          nama_fasilitas: "",
          harga: "",
          satuan: "",
        });
        setCurrentFasilitasId(null);
      })
      .catch((error) => {
        console.error("Error adding fasilitas data: ", error);
        onCreateConfModalOpenChange(true)
      });
  };

  //Update Fasilitas
  const handleUpdateFasilitas = (fasilitasId) => {
    if (
      !currentFasilitasData.nama_fasilitas &&
      !currentFasilitasData.harga &&
      !currentFasilitasData.satuan
    ) {
      setNamaFasilitasError(true);
      setHargaError(true);
      setSatuanError(true);
    }
    if (!currentFasilitasData.nama_fasilitas) {
      setNamaFasilitasError(true);
      return;
    }
    if (!currentFasilitasData.harga) {
      setHargaError(true);
      return;
    }
    if (!currentFasilitasData.satuan) {
      setSatuanError(true);
      return;
    }

    const body = {
      nama_fasilitas: currentFasilitasData.nama_fasilitas,
      harga: currentFasilitasData.harga.toString(),
      satuan: currentFasilitasData.satuan,
    };

    const apiURL = `http://localhost:8000/api/fasilitas/${fasilitasId}`;
    axios
      .post(apiURL, body, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        console.log("Fasilitas updated successfully:", response.data);
        toast.success("Fasilitas updated successfully", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        onCreateModalOpenChange(true);
        onEditModalOpenChange(true);
        fetchFasilitasData();
        setCurrentFasilitasData({
          nama_fasilitas: "",
          harga: "",
          satuan: "",
        });
        setCurrentFasilitasId(null);
      })
      .catch((error) => {
        console.error("Error updating fasilitas: ", error);
        onEditModalOpenChange(true);
      });
  };

  // Delete Fasilitas
  const handleDeleteFasilitas = (fasilitasId) => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    const apiURL = `http://localhost:8000/api/fasilitas/${fasilitasId}`;

    axios
      .delete(apiURL, axiosConfig)
      .then((response) => {
        console.log("Fasilitas deleted successfully", response);
        toast.success("Success Delete Fasilitas", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        onDeleteModalOpenChange(true);
        fetchFasilitasData();
      })
      .catch((error) => {
        console.error("Error deleting Fasilitas", error);
        toast.error(error.response.data.message, {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
      });
  };

  return (
    <section>
      <div className="h2 text-accent p-2 rounded-lg font-semibold text-[30px] uppercase font-tertiary tracking-[2px] flex items-center">
        <FaHandHoldingUsd className="text-2xl mr-2" />
        Paid Facilities
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
          className="btn btn-primary bg-[#1E2131] hover:bg-[#1E2131] rounded-md py-2 px-2 w-[150px] flex-none"
          onClick={() => {
            openCreateModal();
          }}
        >
          <IoMdAdd className="mr-2" />
          Add Facility
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
                filteredFasilitasData.length <= rowsPerPage
                  ? 1
                  : Math.ceil(filteredFasilitasData.length / rowsPerPage)
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
                {item.nama_fasilitas}
              </TableCell>
              <TableCell className="text-medium">{formatCurrencyIDR(item.harga)}</TableCell>
              <TableCell className="text-medium">{item.satuan}</TableCell>
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
                        color="warning"
                        startContent={<FaEdit />}
                        onClick={() => handleEditFasilitas(item.id)}
                      >
                        Edit
                      </DropdownItem>
                      <DropdownItem
                        color="danger"
                        startContent={<RiDeleteBin6Fill />}
                        onClick={() => {
                          setFasilitasToDelete(item);
                          openDeleteModal();
                        }}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal Create Fasilitas */}
      <Modal isOpen={createModalOpen} onOpenChange={onCreateModalOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {currentFasilitasId ? "Edit Fasilitas" : "Add Fasilitas"}
          </ModalHeader>
          <ModalBody>
            <div className="mb-2">
              <Input
                type="text"
                label="Facility Name"
                variant="bordered"
                errorMessage={namaFasilitasError ? "Facility Name cannot be empty" : ""}
                value={currentFasilitasData.nama_fasilitas}
                onChange={(e) => {
                  setCurrentFasilitasData({
                    ...currentFasilitasData,
                    nama_fasilitas: e.target.value,
                  });
                  setNamaFasilitasError(false);
                }}
              />
            </div>
            <div className="mb-2">
              <Input
                type="numeric"
                label="Price"
                variant="bordered"
                errorMessage={hargaError ? "Price cannot be empty" : ""}
                value={currentFasilitasData.harga}
                onChange={(e) => {
                  setCurrentFasilitasData({
                    ...currentFasilitasData,
                    harga: e.target.value,
                  });
                  setHargaError(false);
                }}
              />
            </div>
            <div className="mb-2">
              <Input
                type="text"
                label="Unit"
                variant="bordered"
                errorMessage={satuanError ? "Unit cannot be empty" : ""}
                value={currentFasilitasData.satuan}
                onChange={(e) => {
                  setCurrentFasilitasData({
                    ...currentFasilitasData,
                    satuan: e.target.value,
                  });
                  setSatuanError(false);
                }}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              className="btn btn-tertiary h-[40px] rounded-md text-black"
              onClick={() => {
                setCurrentFasilitasId(null);
                closeCreateModal();
                setCurrentFasilitasData({
                  nama_fasilitas: "",
                  harga: "",
                  satuan: "",
                });
                setNamaFasilitasError(false);
                setHargaError(false);
                setSatuanError(false);
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary h-[40px] rounded-md"
              onClick={() => {
                if (currentFasilitasId) {
                  openEditModal()
                  
                } else {
                  openCreateConfModal()
                  
                }
              }}
            >
              {!currentFasilitasId ? <IoMdAdd className="mr-2" /> : null}
              {currentFasilitasId ? "Update" : "Add"}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Delete Confirm */}
      <Modal isOpen={deleteModalOpen} onOpenChange={onDeleteModalOpenChange}>
        <ModalContent>
          <ModalHeader>Delete Facility</ModalHeader>
          <ModalBody>Are you sure you want to delete this facility?</ModalBody>
          <ModalFooter>
            <button
              className="btn btn-tertiary h-[40px] rounded-md text-black"
              onClick={() => {
                closeDeleteModal();
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary h-[40px] rounded-md"
              onClick={() => handleDeleteFasilitas(fasilitasToDelete.id)}
            >
              Delete
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Confirm */}
      <Modal isOpen={editModalOpen} onOpenChange={onEditModalOpenChange}>
        <ModalContent>
          <ModalHeader>Edit Facility</ModalHeader>
          <ModalBody>Are you sure you want to update this facility?</ModalBody>
          <ModalFooter>
            <button
              className="btn btn-tertiary h-[40px] rounded-md text-black"
              onClick={() => {
                closeEditModal();
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary h-[40px] rounded-md"
              onClick={() => handleUpdateFasilitas(currentFasilitasId)}
            >
              Update
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Confirm */}
      <Modal isOpen={createConfModalOpen} onOpenChange={onCreateConfModalOpenChange}>
        <ModalContent>
          <ModalHeader>Add Facility</ModalHeader>
          <ModalBody>Are you sure you want to add this facility?</ModalBody>
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
              onClick={() =>  handleAddFasilitas()}
            >
              Add
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  );
};

export default FasilitasPage;
