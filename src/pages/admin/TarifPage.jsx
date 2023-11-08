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
import { FaCheckDouble, FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { TbBrandSupernova } from "react-icons/tb";
import { GiDoubled } from "react-icons/gi";
import { TiFlowChildren } from "react-icons/ti";
import { MdMeetingRoom } from "react-icons/md";
import { toast } from "react-toastify";
import { FaMoneyBills } from "react-icons/fa6";

const TarifPage = () => {
  const authToken = localStorage.getItem("tokenPegawai");
  const [tarifData, setTarifData] = useState([]);
  const [jenisKamarData, setJenisKamarData] = useState([]);
  const [seasonData, setSeasonData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const [tarifToDelete, setTarifToDelete] = useState(null);
  const [currentTarifId, setCurrentTarifId] = useState(null);
  const [currentTarifData, setCurrentTarifData] = useState({
    seasons: { id: "", nama_season: "" },
    jenis_kamars: { id: "", jenis_kamar: "" },
    tarif: "",
  });

  const [seasonError, setSeasonError] = useState(false);
  const [tarifError, setTarifError] = useState(false);

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

  // Fetch Data Tarif
  const fetchTarifData = () => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const apiURL = "http://localhost:8000/api/tarifSeason";

    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        setTarifData(response.data.mess.reverse());
      })
      .catch((error) => {
        console.error("Error fetching tarif data: ", error);
      });
  };
  useEffect(() => {
    fetchTarifData();
    console.log('TEST MASUK', JSON.stringify(tarifData.seasons, null, 2));
  }, [authToken]);

  //Fetch Jenis Kamar Data
  useEffect(() => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const apiURL = "http://localhost:8000/api/jenisKamar";

    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        setJenisKamarData(response.data.mess);
      })
      .catch((error) => {
        console.error("Error fetching room data: ", error);
      });
  }, [authToken]);

  //Fetch Season Data
  useEffect(() => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const apiURL = "http://localhost:8000/api/season";

    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        setSeasonData(response.data.mess);
      })
      .catch((error) => {
        console.error("Error fetching season data: ", error);
      });
  }, [authToken]);

  //Search
  const filteredTarifData = tarifData.filter((item) => {
    const namaSeason = item.seasons.nama_season.toLowerCase();
    const jenisKamar = item.jenis_kamars?.jenis_kamar?.toLowerCase() || '';
    const searchLower = search.toLowerCase();

    return namaSeason.includes(searchLower) ||jenisKamar.includes(searchLower)
  });

  //Search Pagination
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredTarifData.slice(start, end);
  }, [page, filteredTarifData, rowsPerPage]);

  const onClear = React.useCallback(() => {
    setSearch("");
    setPage(1);
  }, []);

  const handleEditTarif = (tarifId) => {
    setCurrentTarifId(tarifId);
    openCreateModal();
  };

  const columns = [
    {
      key: "seasons",
      label: "SEASON NAME",
    },
    {
      key: "jenis_kamar",
      label: "ROOM TYPE",
    },
    {
      key: "tarif",
      label: "TARIF",
    },
    {
      key: "actions",
      label: "ACTIONS",
    },
  ];

  // get Tarif by ID
  useEffect(() => {
    if (currentTarifId) {
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
      const apiURL = `http://localhost:8000/api/tarifSeason/${currentTarifId}`;

      axios
        .get(apiURL, axiosConfig)
        .then((response) => {
          console.log("DETAIL ID", JSON.stringify(response.data.data, null, 2));
          setCurrentTarifData(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching tarif data: ", error);
        });
    }
  }, [authToken, currentTarifId]);

  // Add Tarif
  const handleAddTarif = async () => {
    if (
      !currentTarifData.seasons.id &&
      !currentTarifData.jenis_kamars.id &&
      !currentTarifData.tarif
    ) {
      setSeasonError(true);
      setTarifError(true);
    }
    if (!currentTarifData.seasons.id) {
      setSeasonError(true);
      return;
    }
    if (!currentTarifData.tarif) {
      setTarifError(true);
      return;
    }

    const body = {
      id_season: currentTarifData.seasons.id,
      tarif: currentTarifData.tarif,
      id_jenis_kamar: currentTarifData.jenis_kamars.id,
    };

    const apiURL = "http://localhost:8000/api/tarifSeason";

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    // console.log("BODYYY", body);

    axios
      .post(apiURL, body, axiosConfig)
      .then((response) => {
        toast.success("Success Add Tarif", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        onCreateModalOpenChange(true);
        onCreateConfModalOpenChange(true)
        fetchTarifData();
        setCurrentTarifData({
          seasons: { id: "", nama_season: "" },
          jenis_kamars: { id: "", jenis_kamar: "" },
          tarif: "",
        });
        setCurrentTarifId(null);
      })
      .catch((error) => {
        console.error("Error adding tarif data: ", error);
        toast.error(error.response.data.message, {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        onCreateConfModalOpenChange(true)
      });
  };

  //Update Tarif
  const handleUpdateTarif = (tarifId) => {
    if (
      !currentTarifData.seasons.id &&
      !currentTarifData.jenis_kamars.id &&
      !currentTarifData.tarif
    ) {
      setSeasonError(true);
      setTarifError(true);
    }
    if (!currentTarifData.seasons.id) {
      setSeasonError(true);
      return;
    }
    if (!currentTarifData.tarif) {
      setTarifError(true);
      return;
    }

    const body = {
      id_season: currentTarifData.seasons.id,
      tarif: currentTarifData.tarif.toString(),
      id_jenis_kamar: currentTarifData.jenis_kamars.id,
    };

    const apiURL = `http://localhost:8000/api/tarifSeason/${tarifId}`;
    axios
      .post(apiURL, body, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        console.log("Tarif updated successfully:", response.data);
        toast.success("Tarif updated successfully", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        onCreateModalOpenChange(true);
        onEditModalOpenChange(true);
        fetchTarifData();
        setCurrentTarifData({
          seasons: { id: "", nama_season: "" },
          jenis_kamars: { id: "", jenis_kamar: "" },
          tarif: "",
        });
        setCurrentTarifId(null);
      })
      .catch((error) => {
        console.error("Error updating tarif: ", error);
        onEditModalOpenChange(true);
      });
  };

  // Delete Tarif
  const handleDeleteTarif = (tarifId) => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    const apiURL = `http://localhost:8000/api/tarifSeason/${tarifId}`;

    axios
      .delete(apiURL, axiosConfig)
      .then((response) => {
        console.log("Tarif deleted successfully", response);
        toast.success("Success Delete Tarif", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        onDeleteModalOpenChange(true);
        fetchTarifData();
      })
      .catch((error) => {
        console.error("Error deleting Tarif", error);
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
        <FaMoneyBills className="text-2xl mr-2" />
        Tarif
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
          Add Tarif
        </button>
      </div>
      <Table
        aria-label="Table Tarif"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={
                filteredTarifData.length <= rowsPerPage
                  ? 1
                  : Math.ceil(filteredTarifData.length / rowsPerPage)
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
                {item.seasons.nama_season}
              </TableCell>
              <TableCell className="text-medium">
                <Chip
                  className={
                    item?.jenis_kamars?.jenis_kamar === "Superior"
                      ? "bg-[#D0C379] text-white"
                      : item?.jenis_kamars?.jenis_kamar === "Double Deluxe"
                      ? "bg-[#587889] text-white"
                      : item?.jenis_kamars?.jenis_kamar === "Executive Deluxe"
                      ? "bg-[#E69B35] text-white"
                      : item?.jenis_kamars?.jenis_kamar === "Junior Suite"
                      ? "bg-[#334A50] text-white"
                      : "bg-transparent"
                  }
                  startContent={
                    item?.jenis_kamars?.jenis_kamar === "Superior" ? (
                      <TbBrandSupernova className="ml-2" />
                    ) : item?.jenis_kamars?.jenis_kamar === "Double Deluxe" ? (
                      <FaCheckDouble className="ml-2" />
                    ) : item?.jenis_kamars?.jenis_kamar === "Executive Deluxe" ? (
                      <GiDoubled className="ml-2" />
                    ) : item?.jenis_kamars?.jenis_kamar === "Junior Suite" ? (
                      <TiFlowChildren className="ml-2" />
                    ) : null
                  }
                >
                  {item?.jenis_kamars?.jenis_kamar ? item?.jenis_kamars?.jenis_kamar : "-"}
                </Chip>
              </TableCell>
              <TableCell className="text-medium">{formatCurrencyIDR(item.tarif)}</TableCell>
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
                        onClick={() => handleEditTarif(item.id)}
                      >
                        Edit
                      </DropdownItem>
                      <DropdownItem
                        color="danger"
                        startContent={<RiDeleteBin6Fill />}
                        onClick={() => {
                          setTarifToDelete(item);
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

      {/* Modal Create Tarif */}
      <Modal isOpen={createModalOpen} onOpenChange={onCreateModalOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {currentTarifId ? "Edit Tarif" : "Add Tarif"}
          </ModalHeader>
          <ModalBody>
            <div className="mb-2">
              <select
                value={currentTarifData.seasons.id}
                className="border-2 border-gray-200 py-4 px-2 rounded-lg w-full cursor-pointer text-sm"
                onChange={(e) => {
                  setCurrentTarifData({
                    ...currentTarifData,
                    seasons: {
                      ...currentTarifData.seasons,
                      id: e.target.value,
                    },
                  });
                  setSeasonError(false);
                }}
              >
                <option hidden className="text-gray-200">
                  Select a season
                </option>
                {seasonData.map((s) => (
                  <option value={s.id} key={s.id}>
                    {s.nama_season}
                  </option>
                ))}
              </select>
              {seasonError ? (
                <p className="text-xs mt-1 text-pink-500">
                  Season cannot be empty
                </p>
              ) : null}
            </div>
            <div className="mb-2">
              <select
                value={currentTarifData?.jenis_kamars?.id}
                className="border-2 border-gray-200 py-4 px-2 rounded-lg w-full cursor-pointer text-sm"
                onChange={(e) => {
                  setCurrentTarifData({
                    ...currentTarifData,
                    jenis_kamars: {
                      ...currentTarifData?.jenis_kamars,
                      id: e.target.value,
                    },
                  });
                }}
              >
                <option hidden className="text-gray-200">
                  Select a room type
                </option>
                {jenisKamarData.map((jk) => (
                  <option value={jk.id} key={jk.id}>
                    {jk.jenis_kamar}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <Input
                type="numeric"
                label="Tarif"
                variant="bordered"
                errorMessage={tarifError ? "Tarif cannot be empty" : ""}
                value={currentTarifData.tarif}
                onChange={(e) => {
                  setCurrentTarifData({
                    ...currentTarifData,
                    tarif: e.target.value,
                  });
                  setTarifError(false);
                }}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              className="btn btn-tertiary h-[40px] rounded-md text-black"
              onClick={() => {
                setCurrentTarifId(null);
                closeCreateModal();
                setCurrentTarifData({
                    seasons: { id: "", nama_season: "" },
                    jenis_kamars: { id: "", jenis_kamar: "" },
                    tarif: "",
                  });
                setSeasonError(false);
                setTarifError(false);
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary h-[40px] rounded-md"
              onClick={() => {
                if (currentTarifId) {
                  openEditModal()
                  
                } else {
                  openCreateConfModal()
                 
                }
              }}
            >
              {!currentTarifId ? <IoMdAdd className="mr-2" /> : null}
              {currentTarifId ? "Update" : "Add"}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Delete Confirm */}
      <Modal isOpen={deleteModalOpen} onOpenChange={onDeleteModalOpenChange}>
        <ModalContent>
          <ModalHeader>Delete Tarif</ModalHeader>
          <ModalBody>Are you sure you want to delete this tarif?</ModalBody>
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
              onClick={() => handleDeleteTarif(tarifToDelete.id)}
            >
              Delete
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Confirm */}
      <Modal isOpen={editModalOpen} onOpenChange={onEditModalOpenChange}>
        <ModalContent>
          <ModalHeader>Edit Tarif</ModalHeader>
          <ModalBody>Are you sure you want to update this tarif?</ModalBody>
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
              onClick={() => handleUpdateTarif(currentTarifId)}
            >
              Update
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Confirm */}
      <Modal isOpen={createConfModalOpen} onOpenChange={onCreateConfModalOpenChange}>
        <ModalContent>
          <ModalHeader>Add Tarif</ModalHeader>
          <ModalBody>Are you sure you want to add this tarif?</ModalBody>
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
              onClick={() => handleAddTarif()}
            >
              Add
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  );
};

export default TarifPage;
