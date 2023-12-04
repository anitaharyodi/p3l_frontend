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

const RoomAdmin = () => {
  const authToken = localStorage.getItem("tokenPegawai");
  const [roomData, setRoomData] = useState([]);
  const [jenisKamarData, setJenisKamarData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const [roomToDelete, setRoomToDelete] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [currentRoomData, setCurrentRoomData] = useState({
    no_kamar: "",
    jenis_kamars: { id: "", jenis_kamar: "" },
    tipe_bed: "",
  });

  const [roomNoError, setRoomNoError] = useState(false);
  const [roomNoErrorUnique, setRoomNoErrorUnique] = useState(false);
  const [jenisKamarError, setJenisKamarError] = useState(false);
  const [tipeBedError, setTipeBedError] = useState(false);

  const availableBedSupDob = ["Double", "Twin"];
  const availableBedExJu = ["King"];

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

  // Fetch Data Kamar
  const fetchRoomData = () => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const apiURL = "https://ah-project.my.id/api/kamar";

    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        setRoomData(response.data.mess.reverse());
        console.log(roomData);
      })
      .catch((error) => {
        console.error("Error fetching room data: ", error);
      });
  };
  useEffect(() => {
    fetchRoomData();
  }, [authToken]);

  //Fetch Jenis Kamar Data
  useEffect(() => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const apiURL = "https://ah-project.my.id/api/jenisKamar";

    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        setJenisKamarData(response.data.mess);
      })
      .catch((error) => {
        console.error("Error fetching room data: ", error);
      });
  }, [authToken]);

  //Search
  const filteredRoomData = roomData.filter((item) => {
    const noKamarString = item.no_kamar.toString().toLowerCase();
    const jenisKamar = item.jenis_kamars.jenis_kamar.toLowerCase();
    const tipeBed = item.tipe_bed.toLowerCase();
    const searchLower = search.toLowerCase();

    return (
      noKamarString.includes(searchLower) ||
      jenisKamar.includes(searchLower) ||
      tipeBed.includes(searchLower)
    );
  });

  //Search Pagination
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredRoomData.slice(start, end);
  }, [page, filteredRoomData, rowsPerPage]);

  const onClear = React.useCallback(() => {
    setSearch("");
    setPage(1);
  }, []);

  const handleEditRoom = (roomId) => {
    setCurrentRoomId(roomId);
    openCreateModal();
  };

  const tipeBed = [
    {
      label: "Double",
      value: "Double",
    },
    {
      label: "Twin",
      value: "Twin",
    },
    {
      label: "King",
      value: "King",
    },
  ];

  const columns = [
    {
      key: "no_kamar",
      label: "ROOM NUMBER",
    },
    {
      key: "jenis_kamar",
      label: "ROOM TYPE",
    },
    {
      key: "tipe_bed",
      label: "BED TYPE",
    },
    {
      key: "actions",
      label: "ACTIONS",
    },
  ];

  // get Kamar by ID
  useEffect(() => {
    if (currentRoomId) {
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
      const apiURL = `https://ah-project.my.id/api/kamar/${currentRoomId}`;

      axios
        .get(apiURL, axiosConfig)
        .then((response) => {
          console.log("DETAIL ID", JSON.stringify(response.data.data, null, 2));
          setCurrentRoomData(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching room data: ", error);
        });
    }
  }, [authToken, currentRoomId]);

  // Add Room
  const handleAddRoom = async () => {
    if (!currentRoomData.no_kamar && !currentRoomData.jenis_kamars.id && !currentRoomData.tipe_bed) {
      setRoomNoError(true);
      setJenisKamarError(true);
      setTipeBedError(true);
    }
    if (!currentRoomData.no_kamar) {
      setRoomNoError(true);
      return;
    }
    if (!currentRoomData.jenis_kamars.id) {
      setJenisKamarError(true);
      return;
    }
    if (!currentRoomData.tipe_bed) {
      setTipeBedError(true);
      return;
    }

    const body = {
      no_kamar: currentRoomData.no_kamar,
      id_jenis_kamar: currentRoomData.jenis_kamars.id,
      tipe_bed: currentRoomData.tipe_bed,
    };

    const apiURL = "https://ah-project.my.id/api/kamar";

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    // console.log("BODYYY", body);

    axios
      .post(apiURL, body, axiosConfig)
      .then((response) => {
        toast.success("Success Add Room", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        onCreateModalOpenChange(true)
        onCreateConfModalOpenChange(true)
        fetchRoomData();
        setCurrentRoomData({
          no_kamar: "",
          jenis_kamars: { id: "", jenis_kamar: "" },
          tipe_bed: "",
        })
        setCurrentRoomId(null)
      })
      .catch((error) => {
        console.error("Error adding room data: ", error);
        setRoomNoErrorUnique(true)
        onCreateConfModalOpenChange(true)
      });
  };

  //Update Room
  const handleUpdateRoom = (roomId) => {
    if (!currentRoomData.no_kamar && !currentRoomData.jenis_kamars.id && !currentRoomData.tipe_bed) {
      setRoomNoError(true);
      setJenisKamarError(true);
      setTipeBedError(true);
    }
    if (!currentRoomData.no_kamar) {
      setRoomNoError(true);
      return;
    }
    if (!currentRoomData.jenis_kamars.id) {
      setJenisKamarError(true);
      return;
    }
    if (!currentRoomData.tipe_bed) {
      setTipeBedError(true);
      return;
    }

    const body = {
      no_kamar: currentRoomData.no_kamar,
      id_jenis_kamar: currentRoomData.jenis_kamars.id,
      tipe_bed: currentRoomData.tipe_bed,
    };

    const apiURL = `https://ah-project.my.id/api/kamar/${roomId}`;
    axios
      .post(apiURL, body, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        console.log("Room updated successfully:", response.data);
        toast.success("Room updated successfully", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        onCreateModalOpenChange(true)
        onEditModalOpenChange(true);
        fetchRoomData()
        setCurrentRoomData({
          no_kamar: "",
          jenis_kamars: { id: "", jenis_kamar: "" },
          tipe_bed: "",
        })
        setCurrentRoomId(null)
      })
      .catch((error) => {
        console.error("Error updating room: ", error);
        setRoomNoErrorUnique(true)
        onEditModalOpenChange(true);
      });
  };

  // Delete Room
  const handleDeleteRoom = (roomId) => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    const apiURL = `https://ah-project.my.id/api/kamar/${roomId}`;

    axios
      .delete(apiURL, axiosConfig)
      .then((response) => {
        console.log("Kamar deleted successfully", response);
        toast.success("Success Delete Room", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        onDeleteModalOpenChange(true);
        fetchRoomData();
      })
      .catch((error) => {
        console.error("Error deleting Jenis Kamar", error);
        toast.error(error, {
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
        <MdMeetingRoom className="text-2xl mr-2" />
        Rooms
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
          Add Rooms
        </button>
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
                filteredRoomData.length <= rowsPerPage
                  ? 1
                  : Math.ceil(filteredRoomData.length / rowsPerPage)
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
              <TableCell className="text-medium">{item.no_kamar}</TableCell>
              <TableCell className="text-medium">
                <Chip
                  className={
                    item.jenis_kamars.jenis_kamar == "Superior"
                      ? "bg-[#D0C379] text-white"
                      : item.jenis_kamars.jenis_kamar == "Double Deluxe"
                      ? "bg-[#587889] text-white"
                      : item.jenis_kamars.jenis_kamar == "Executive Deluxe"
                      ? "bg-[#E69B35] text-white"
                      : "bg-[#334A50] text-white"
                  }
                  startContent={
                    item.jenis_kamars.jenis_kamar == "Superior" ? (
                      <TbBrandSupernova className="ml-2" />
                    ) : item.jenis_kamars.jenis_kamar == "Double Deluxe" ? (
                      <FaCheckDouble className="ml-2" />
                    ) : item.jenis_kamars.jenis_kamar == "Executive Deluxe" ? (
                      <GiDoubled className="ml-2" />
                    ) : (
                      <TiFlowChildren className="ml-2" />
                    )
                  }
                >
                  {item.jenis_kamars.jenis_kamar}
                </Chip>
              </TableCell>
              <TableCell className="text-medium">{item.tipe_bed}</TableCell>
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
                        onClick={() => handleEditRoom(item.id)}
                      >
                        Edit
                      </DropdownItem>
                      <DropdownItem
                        color="danger"
                        startContent={<RiDeleteBin6Fill />}
                        onClick={() => {
                          setRoomToDelete(item);
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

      {/* Modal Create Room */}
      <Modal isOpen={createModalOpen} onOpenChange={onCreateModalOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {currentRoomId ? "Edit Room" : "Add Rooms"}
          </ModalHeader>
          <ModalBody>
            <div className="mb-2">
              <Input
                type="text"
                label="Room Number"
                variant="bordered"
                maxLength={3}
                errorMessage={
                  roomNoError
                    ? "Room number cannot be empty"
                    : roomNoErrorUnique
                    ? "Room number already exist"
                    : ""
                }
                value={currentRoomData.no_kamar}
                onChange={(e) => {
                    setCurrentRoomData({ ...currentRoomData, no_kamar: e.target.value });
                    setRoomNoError(false)
                    setRoomNoErrorUnique(false)
                }}
              />
            </div>
            <div className="mb-2">
              <select
                value={currentRoomData.jenis_kamars.id}
                className="border-2 border-gray-200 py-4 px-2 rounded-lg w-full cursor-pointer text-sm"
                onChange={(e) => {
                  setCurrentRoomData({ ...currentRoomData, jenis_kamars: { ...currentRoomData.jenis_kamars, id: e.target.value } });
                  setJenisKamarError(false)
                }}
              >
                <option hidden className="text-gray-200">
                  Select a room type
                </option>
                {jenisKamarData.map((jk) => (
                  <option value={jk.id} key={jk.id}>{jk.jenis_kamar}</option>
                ))}
              </select>
              {jenisKamarError ? (
                <p className="text-xs mt-1 text-pink-500">Room Type cannot be empty</p>
              ): null}
            </div>
            <div className="mb-2">
              <select
                value={currentRoomData.tipe_bed}
                className="border-2 border-gray-200 py-4 px-2 rounded-lg w-full cursor-pointer text-sm"
                onChange={(e) => {
                    setCurrentRoomData({ ...currentRoomData, tipe_bed: e.target.value });
                    setTipeBedError(false)
                }}
              >
                <option hidden className="text-gray-200">
                  Select a bed type
                </option>
                {tipeBed.filter((item) =>
                  currentRoomData.jenis_kamars.id == "1" || currentRoomData.jenis_kamars.id == "2"
                    ? availableBedSupDob.includes(item.value)
                    : currentRoomData.jenis_kamars.id == "3" || currentRoomData.jenis_kamars.id == "4"
                    ? availableBedExJu.includes(item.value)
                    : null
                ).map((item) => (
                  <option value={item.value} key={item.value} className="p-8">{item.label}</option>
                ))}
              </select>
              {tipeBedError ? (
                <p className="text-xs mt-1 text-pink-500">Bed Type cannot be empty</p>
              ): null}
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              className="btn btn-tertiary h-[40px] rounded-md text-black"
              onClick={() => {
                setCurrentRoomId(null);
                closeCreateModal();
                setCurrentRoomData({
                  no_kamar: "",
                  jenis_kamars: { id: "", jenis_kamar: "" },
                  tipe_bed: "",
                })
                setRoomNoError(false);
                setRoomNoErrorUnique(false);
                setJenisKamarError(false);
                setTipeBedError(false);
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary h-[40px] rounded-md"
              onClick={() => {
                if(currentRoomId) {
                  openEditModal()
                }else {
                  openCreateConfModal()

                }
              }}
            >
              {!currentRoomId ? <IoMdAdd className="mr-2" /> : null}
              {currentRoomId ? "Update" : "Add"}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Delete Confirm */}
      <Modal isOpen={deleteModalOpen} onOpenChange={onDeleteModalOpenChange}>
        <ModalContent>
          <ModalHeader>Delete Room</ModalHeader>
          <ModalBody>Are you sure you want to delete this room?</ModalBody>
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
              onClick={() => handleDeleteRoom(roomToDelete.id)}
            >
              Delete
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Confirm */}
      <Modal isOpen={editModalOpen} onOpenChange={onEditModalOpenChange}>
        <ModalContent>
          <ModalHeader>Edit Room</ModalHeader>
          <ModalBody>Are you sure you want to update this room?</ModalBody>
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
              onClick={() => handleUpdateRoom(currentRoomId)}
            >
              Update
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Confirm */}
      <Modal isOpen={createConfModalOpen} onOpenChange={onCreateConfModalOpenChange}>
        <ModalContent>
          <ModalHeader>Add Room</ModalHeader>
          <ModalBody>Are you sure you want to add this room?</ModalBody>
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
              onClick={() =>  handleAddRoom()}
            >
              Add
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  );
};

export default RoomAdmin;
