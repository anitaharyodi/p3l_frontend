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
import {
  BsFillTicketPerforatedFill,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { FaCheckDouble, FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { TbBrandSupernova } from "react-icons/tb";
import { GiDoubled } from "react-icons/gi";
import { TiFlowChildren } from "react-icons/ti";
import { MdMeetingRoom } from "react-icons/md";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { format, parseISO } from "date-fns";
import moment from "moment/moment";

const SeasonPage = () => {
  const authToken = localStorage.getItem("tokenPegawai");
  const [seasonData, setSeasonData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const [seasonToDelete, setSeasonToDelete] = useState(null);
  const [currentSeasonId, setCurrentSeasonId] = useState(null);
  const [currentSeasonData, setCurrentSeasonData] = useState({
    nama_season: "",
    jenis_season: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
  });

  const [namaSeasonError, setNamaSeasonError] = useState(false);
  const [jenisSeasonError, setJenisSeasonError] = useState(false);
  const [tglMulaiError, setTglMulaiError] = useState(false);
  const [tglSelesaiError, setTglSelesaiError] = useState(false);

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

  // Fetch Data Season
  const fetchSeasonData = () => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const apiURL = "http://localhost:8000/api/season";

    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        setSeasonData(response.data.mess.reverse());
        console.log(seasonData);
      })
      .catch((error) => {
        console.error("Error fetching season data: ", error);
      });
  };
  useEffect(() => {
    fetchSeasonData();
  }, [authToken]);

  //Search
  const filteredSeasonData = seasonData.filter((item) => {
    const namaSeason = item.nama_season.toLowerCase();
    const jenisSeason = item.jenis_season.toLowerCase();
    const searchLower = search.toLowerCase();

    return (
      namaSeason.includes(searchLower) || jenisSeason.includes(searchLower)
    );
  });

  //Search Pagination
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredSeasonData.slice(start, end);
  }, [page, filteredSeasonData, rowsPerPage]);

  const onClear = React.useCallback(() => {
    setSearch("");
    setPage(1);
  }, []);

  const handleEditSeason = (seasonId) => {
    setCurrentSeasonId(seasonId);
    openCreateModal();
  };
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const jenisSeason = [
    {
      label: "Low",
      value: "Low",
    },
    {
      label: "High",
      value: "High",
    },
  ];

  const columns = [
    {
      key: "nama_season",
      label: "SEASON NAME",
    },
    {
      key: "jenis_season",
      label: "SEASON TYPE",
    },
    {
      key: "tanggal_mulai",
      label: "START DATE",
    },
    {
      key: "tanggal_selesai",
      label: "END DATE",
    },
    {
      key: "actions",
      label: "ACTIONS",
    },
  ];

  // get Season by ID
  useEffect(() => {
    if (currentSeasonId) {
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
      const apiURL = `http://localhost:8000/api/season/${currentSeasonId}`;

      axios
        .get(apiURL, axiosConfig)
        .then((response) => {
          console.log("DETAIL ID", JSON.stringify(response.data.data, null, 2));
          const seasonData = response.data.data;

          seasonData.tanggal_mulai = parseISO(seasonData.tanggal_mulai);
          seasonData.tanggal_selesai = parseISO(seasonData.tanggal_selesai);

          setCurrentSeasonData(seasonData);
          console.log(seasonData);
        })
        .catch((error) => {
          console.error("Error fetching season data: ", error);
        });
    }
  }, [authToken, currentSeasonId]);

  // Add Season
  const handleAddSeason = async () => {
    if (
      !currentSeasonData.nama_season &&
      !currentSeasonData.jenis_season &&
      !currentSeasonData.tanggal_mulai
    ) {
      setNamaSeasonError(true);
      setJenisSeasonError(true);
      setTglMulaiError(true);
      setTglSelesaiError(true);
    }
    if (!currentSeasonData.nama_season) {
      setNamaSeasonError(true);
      return;
    }
    if (!currentSeasonData.jenis_season) {
      setJenisSeasonError(true);
      return;
    }
    if (!currentSeasonData.tanggal_mulai) {
      setTglMulaiError(true);
      return;
    }
    if (!currentSeasonData.tanggal_selesai) {
      setTglSelesaiError(true);
      return;
    }

    const formattedDateMulai = moment(currentSeasonData.tanggal_mulai).format(
      "YYYY-MM-DD"
    );
    const formattedDateSelesai = moment(
      currentSeasonData.tanggal_selesai
    ).format("YYYY-MM-DD");
    console.log(formattedDateMulai);

    const body = {
      nama_season: currentSeasonData.nama_season,
      jenis_season: currentSeasonData.jenis_season,
      tanggal_mulai: formattedDateMulai,
      tanggal_selesai: formattedDateSelesai,
    };

    const apiURL = "http://localhost:8000/api/season";

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    console.log("BODYYY", body);

    axios
      .post(apiURL, body, axiosConfig)
      .then((response) => {
        toast.success("Success Add Season", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        onCreateModalOpenChange(true);
        fetchSeasonData();
        setCurrentSeasonData({
          nama_season: "",
          jenis_season: "",
          tanggal_mulai: "",
          tanggal_selesai: "",
        });
        setCurrentSeasonId(null);
      })
      .catch((error) => {
        console.error("Error adding season data: ", error);
        toast.error(error.response.data.message.tanggal_mulai[0], {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
      });
  };

  //Update Season
  const handleUpdateSeason = (seasonId) => {
    if (
      !currentSeasonData.nama_season &&
      !currentSeasonData.jenis_season &&
      !currentSeasonData.tanggal_mulai
    ) {
      setNamaSeasonError(true);
      setJenisSeasonError(true);
      setTglMulaiError(true);
      setTglSelesaiError(true);
    }
    if (!currentSeasonData.nama_season) {
      setNamaSeasonError(true);
      return;
    }
    if (!currentSeasonData.jenis_season) {
      setJenisSeasonError(true);
      return;
    }
    if (!currentSeasonData.tanggal_mulai) {
      setTglMulaiError(true);
      return;
    }
    if (!currentSeasonData.tanggal_selesai) {
      setTglSelesaiError(true);
      return;
    }

    const formattedDateMulai = moment(currentSeasonData.tanggal_mulai).format(
      "YYYY-MM-DD"
    );
    const formattedDateSelesai = moment(
      currentSeasonData.tanggal_selesai
    ).format("YYYY-MM-DD");
    console.log(formattedDateMulai);
    const body = {
      nama_season: currentSeasonData.nama_season,
      jenis_season: currentSeasonData.jenis_season,
      tanggal_mulai: formattedDateMulai,
      tanggal_selesai: formattedDateSelesai,
    };

    const apiURL = `http://localhost:8000/api/season/${seasonId}`;
    axios
      .post(apiURL, body, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        console.log("Season updated successfully:", response.data);
        toast.success("Season updated successfully", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        onCreateModalOpenChange(true);
        fetchSeasonData();
        setCurrentSeasonData({
          nama_season: "",
          jenis_season: "",
          tanggal_mulai: "",
          tanggal_selesai: "",
        });
        setCurrentSeasonId(null);
      })
      .catch((error) => {
        console.error("Error updating season: ", error);
        toast.error(error.response.data.message.tanggal_mulai[0], {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
      });
  };

  // Delete Season
  const handleDeleteSeason = (seasonId) => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    const apiURL = `http://localhost:8000/api/season/${seasonId}`;

    axios
      .delete(apiURL, axiosConfig)
      .then((response) => {
        console.log("Season deleted successfully", response);
        toast.success("Success Delete Season", {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        onDeleteModalOpenChange(true);
        fetchSeasonData();
      })
      .catch((error) => {
        console.error("Error deleting Season", error);
        toast.error(error.response.data.message, {
          position: "top-right",
          hideProgressBar: true,
          theme: "colored",
          autoClose: 1000,
        });
        onDeleteModalOpenChange(true);
      });
  };

  return (
    <section>
      <div className="h2 text-accent p-2 rounded-lg font-semibold text-[30px] uppercase font-tertiary tracking-[2px] flex items-center">
        <BsFillTicketPerforatedFill className="text-2xl mr-2" />
        Season
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
          Add Season
        </button>
      </div>
      <Table
        aria-label="Table Seasons"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={
                filteredSeasonData.length <= rowsPerPage
                  ? 1
                  : Math.ceil(filteredSeasonData.length / rowsPerPage)
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
              <TableCell className="text-medium">{item.nama_season}</TableCell>
              <TableCell className="text-medium">
                <Chip
                  className={
                    item.jenis_season === "Low"
                      ? "bg-warning-500 text-white"
                      : "bg-danger-500 text-white"
                  }
                >
                  {item.jenis_season}
                </Chip>
              </TableCell>
              <TableCell className="text-medium">
                {formatDate(item.tanggal_mulai)}
              </TableCell>
              <TableCell className="text-medium">
                {formatDate(item.tanggal_selesai)}
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
                        color="warning"
                        startContent={<FaEdit />}
                        onClick={() => {
                          handleEditSeason(item.id);
                          // console.log(item.id)
                        }}
                      >
                        Edit
                      </DropdownItem>
                      <DropdownItem
                        color="danger"
                        startContent={<RiDeleteBin6Fill />}
                        onClick={() => {
                          setSeasonToDelete(item);
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
            {currentSeasonId ? "Edit Season" : "Add Season"}
          </ModalHeader>
          <ModalBody>
            <div className="mb-2">
              <Input
                type="text"
                label="Season Name"
                variant="bordered"
                errorMessage={
                  namaSeasonError ? "Season name cannot be empty" : ""
                }
                value={currentSeasonData.nama_season}
                onChange={(e) => {
                  setCurrentSeasonData({
                    ...currentSeasonData,
                    nama_season: e.target.value,
                  });
                  setNamaSeasonError(false);
                }}
              />
            </div>
            <div className="mb-2">
              <select
                value={currentSeasonData.jenis_season}
                className="border-2 border-gray-200 py-4 px-2 rounded-lg w-full cursor-pointer text-sm"
                onChange={(e) => {
                  setCurrentSeasonData({
                    ...currentSeasonData,
                    jenis_season: e.target.value,
                  });
                  setJenisSeasonError(false);
                }}
              >
                <option hidden className="text-gray-200">
                  Select a season type
                </option>
                {jenisSeason.map((js) => (
                  <option value={js.value} key={js.value}>
                    {js.label}
                  </option>
                ))}
              </select>
              {jenisSeasonError ? (
                <p className="text-xs mt-1 text-pink-500">
                  Season Type cannot be empty
                </p>
              ) : null}
            </div>
            <div className="mb-2 -ml-7">
              <DatePicker
                selected={currentSeasonData.tanggal_mulai}
                onChange={(date) => {
                  setCurrentSeasonData({
                    ...currentSeasonData,
                    tanggal_mulai: date,
                  });
                  setTglMulaiError(false);
                }}
                selectsStart
                startDate={currentSeasonData.tanggal_mulai}
                endDate={currentSeasonData.tanggal_selesai}
                placeholderText="Start Date"
                className="border-2 w-[395px] cursor-pointer rounded-lg h-[50px] px-2 text-gray-600"
                popperPlacement="bottom-end"
              />
            </div>
            <div className="mb-2 -ml-7">
              <DatePicker
                selected={currentSeasonData.tanggal_selesai}
                onChange={(date) => {
                  setCurrentSeasonData({
                    ...currentSeasonData,
                    tanggal_selesai: date,
                  });
                  setTglSelesaiError(false);
                }}
                selectsEnd
                startDate={currentSeasonData.tanggal_mulai}
                endDate={currentSeasonData.tanggal_selesai}
                minDate={currentSeasonData.tanggal_mulai}
                placeholderText="End Date"
                className="border-2 w-[395px] cursor-pointer rounded-lg h-[50px] px-2 text-gray-600"
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              className="btn btn-tertiary h-[40px] rounded-md text-black"
              onClick={() => {
                setCurrentSeasonId(null);
                closeCreateModal();
                setCurrentSeasonData({
                  nama_season: "",
                  jenis_season: "",
                  tanggal_mulai: "",
                  tanggal_selesai: "",
                });
                setNamaSeasonError(false);
                setJenisSeasonError(false);
                setTglMulaiError(false);
                setTglSelesaiError(false);
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary h-[40px] rounded-md"
              onClick={() => {
                if (currentSeasonId) {
                  handleUpdateSeason(currentSeasonId);
                } else {
                  handleAddSeason();
                }
              }}
            >
              {!currentSeasonId ? <IoMdAdd className="mr-2" /> : null}
              {currentSeasonId ? "Update" : "Add"}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Delete Confirm */}
      <Modal isOpen={deleteModalOpen} onOpenChange={onDeleteModalOpenChange}>
        <ModalContent>
          <ModalHeader>Delete Season</ModalHeader>
          <ModalBody>Are you sure you want to delete this season?</ModalBody>
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
              onClick={() => handleDeleteSeason(seasonToDelete.id)}
            >
              Delete
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  );
};

export default SeasonPage;
