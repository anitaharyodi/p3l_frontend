import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosBed } from "react-icons/io";
import { IoEnterOutline } from "react-icons/io5";
import { MdBedroomParent, MdLibraryBooks, MdNightsStay } from "react-icons/md";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";

const CheckinPage = () => {
  const authToken = localStorage.getItem("tokenPegawai");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const itemString = queryParams.get("item");
  const item = itemString ? JSON.parse(decodeURIComponent(itemString)) : null;
  const [roomData, setRoomData] = useState([]);
  const numberOfSteps = item.length;
  const [selectedRooms, setSelectedRooms] = useState(
    Array.from({ length: numberOfSteps }, () => "")
  );
  const [noRoomData, setNoRoomData] = useState({
    kamar: [],
    deposit: 300000,
  });
  const [activeStep, setActiveStep] = useState(1);
  const [noRoom, setNoRoom] = useState("");
  const [inputDeposito, setInputDeposito] = useState("300000");
  const navigate = useNavigate();

  const {
    isOpen: createModalOpen,
    onOpen: openCreateModal,
    onOpenChange: onCreateModalOpenChange,
    onClose: closeCreateModal,
  } = useDisclosure();

  // console.log(JSON.stringify(item, null, 2));
  useEffect(() => {
    const fetchRoomData = async () => {
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

      const apiURL = `http://localhost:8000/api/reservasiKamar?tgl_checkin=${item.tgl_checkin}`;

      axios
        .get(apiURL, axiosConfig)
        .then((response) => {
          setRoomData(response.data.rooms);
        })
        .catch((error) => {
          console.error("Error fetching room data: ", error);
        });
    };

    fetchRoomData();
  }, [authToken]);

  const handleCheckin = () => {
    if (inputDeposito !== "300000") {
      toast.error("Deposit must be 300000", {
        position: "top-right",
        hideProgressBar: true,
        theme: "colored",
        autoClose: 1000,
      });
      setInputDeposito("");
    } else {
      setInputDeposito((prevInputDeposito) => {
        console.log("Setting deposit:", parseInt(prevInputDeposito));
        setNoRoomData((prevNoRoomData) => ({
          ...prevNoRoomData,
          deposit: parseInt(prevInputDeposito),
        }));
        return prevInputDeposito;
      });
      const apiURL = `http://localhost:8000/api/checkin/${item.id}`;
      console.log(JSON.stringify(noRoomData, null, 2));
      axios
        .post(apiURL, noRoomData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          toast.success("Check-In successfully", {
            position: "top-right",
            hideProgressBar: true,
            theme: "colored",
            autoClose: 1000,
          });
          onCreateModalOpenChange(true);
          setInputDeposito("");
          navigate("/home/customerStay");
        })
        .catch((error) => {
          console.log("Error checkin: ", error.response.message.data);
        });
    }
  };

  const handleRoomClick = (rooms) => {
    const { room } = rooms;

    if (activeStep <= item.reservasi_kamars.length) {
      const activeReservasiKamar = item.reservasi_kamars[activeStep - 1];

      if (room.id_jenis_kamar !== activeReservasiKamar.id_jenis_kamar) {
        alert(
          `The room must be ${activeReservasiKamar.jenis_kamars.jenis_kamar}!`
        );
        return;
      }

      if (!selectedRooms.includes(room.no_kamar) && rooms.is_available) {
        const updatedSelectedRooms = [...selectedRooms];
        updatedSelectedRooms[activeStep - 1] = room.no_kamar;
        setSelectedRooms(updatedSelectedRooms);
        setNoRoom(room.no_kamar);

        const updatedNoRoomData = { ...noRoomData };

        updatedNoRoomData.kamar.push({
          id: activeReservasiKamar.id,
          id_kamar: room.id,
        });
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
  };

  // console.log(JSON.stringify(noRoomData, null, 2));

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  return (
    <section>
      <div className="h2 text-accent p-2 rounded-lg font-semibold text-[30px] uppercase font-tertiary tracking-[2px] flex items-center">
        <MdBedroomParent className="text-2xl mr-2" />
        Room View
      </div>
      <div className="w-full mb-6 -mt-5 p-2">
        <div className="flex items-center">
          <div className="w-6 h-3 bg-danger-500 rounded-md"></div>
          <p className="font-medium ml-2">Stayover</p>
          <div className="w-6 h-3 bg-success-500 ml-4 rounded-md"></div>
          <p className="font-medium ml-2">Available</p>
        </div>
      </div>
      <div className="container mx-auto max-w-full">
        <div className="flex flex-col lg:flex-row h-full">
          <div className="w-full h-full lg:w-[65%] mr-10 mb-8">
            <div className="grid grid-cols-4 gap-4">
              {roomData
                .sort((a, b) => a.room.no_kamar - b.room.no_kamar)
                .map((item, index) => (
                  <div
                    key={index}
                    className={`border rounded p-4 shadow-md ${
                      item.is_available
                        ? item.room.no_kamar ===
                          selectedRooms.find(
                            (selectedRoom) =>
                              selectedRoom === item.room.no_kamar
                          )
                          ? "bg-[#1E2131]"
                          : "bg-success-500 hover:bg-[#1E2131] cursor-pointer"
                        : "bg-danger-500"
                    }`}
                    onClick={() => handleRoomClick(item)}
                  >
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-white">
                        {item.room.no_kamar}
                      </h3>
                      <div className="flex items-center justify-center">
                        <IoIosBed className="text-white mr-1" />
                        <p className="text-sm text-white">
                          {item.room.tipe_bed}
                        </p>
                      </div>
                      <p className="text-base text-white font-semibold mb-2">
                        {item.room.jenis_kamars.jenis_kamar}
                      </p>
                      {!item.is_available && (
                        <p className="text-sm text-gray-700 font-semibold mb-2 bg-white p-2 rounded-md">
                          {
                            item.room.reservasi_kamars[0]?.reservasis.customers
                              .nama
                          }
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="w-full h-full lg:w-[35%] mb-8 sticky top-10">
            <div className="bg-white min-h-[450px] shadow-md rounded-md justify-between">
              <div className="bg-[#1E2131] h-[70px] rounded-t-md">
                <p className="text-white p-4 text-[25px] font-semibold font-tertiary tracking-[1px] flex items-center">
                  <IoEnterOutline className="text-md mr-2" />
                  Check-In Details
                </p>
              </div>
              <div className="max-h-[450px] overflow-y-auto mb-10">
                <p className="text-right px-4 mt-4 mb-4 font-semibold">
                  Name : {item.customers.nama}
                </p>
                <p className="text-left px-4 mb-2">
                  Check-In : {formatDate(item.tgl_checkin)}
                </p>
                <p className="text-left px-4  mb-2">
                  Check-Out : {formatDate(item.tgl_checkout)}
                </p>
                <p className="text-left px-4  mb-2">
                  Special Request : {item.special_req ? item.special_req : "-"}
                </p>
                <div className="flex items-center p-4">
                  <div className="w-12 bg-gray-100 rounded-tl-md rounded-bl-md p-1 px-2 font-semibold text-center">
                    <p>No</p>
                  </div>
                  <div className="w-[120px] bg-gray-100 p-1 px-2 font-semibold text-center">
                    <p>Room Number</p>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-tr-md rounded-br-md p-1 px-2 font-semibold text-center">
                    <p>Bed Type</p>
                  </div>
                </div>
                {item.reservasi_kamars?.map((reservasi_kamar, index) => (
                  <div
                    key={index}
                    className={`flex items-center px-4 mb-2 mx-4 rounded-md ${
                      activeStep === index + 1 ? "bg-[#1E2131]" : ""
                    }`}
                  >
                    <div
                      className={`w-12 p-1 text-left ${
                        activeStep === index + 1 ? "text-white" : ""
                      }`}
                    >
                      <p>{index + 1}</p>
                    </div>
                    <div className="w-[120px] p-1 text-left">
                      <input
                        type="text"
                        value={
                          activeStep === index + 1 ? "" : selectedRooms[index]
                        }
                        className="w-[120px] px-2 rounded-md bg-gray-100 focus:outline-none"
                        readOnly
                      />
                    </div>
                    <div
                      className={`flex-1 p-1 px-2 text-center ${
                        activeStep === index + 1 ? "text-white" : ""
                      }`}
                    >
                      <p>{reservasi_kamar.jenis_kamars.jenis_kamar}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute w-full bottom-0">
                <button
                  className={`btn btn-secondary p-2 w-full h-10 rounded-bl-md rounded-br-md ${
                    selectedRooms.length < item.reservasi_kamars.length ||
                    selectedRooms.some((room) => room === "")
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => {
                    console.log("Selected Rooms:", selectedRooms);

                    if (
                      selectedRooms.length === item.reservasi_kamars.length &&
                      selectedRooms.every(
                        (room) => room && room.toString().trim() !== ""
                      )
                    ) {
                      openCreateModal();
                    } else {
                      console.log("Please select all rooms.");
                    }
                  }}
                >
                  Check-In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={createModalOpen} onOpenChange={onCreateModalOpenChange}>
        <ModalContent>
          <ModalHeader>
            <div className="flex flex-col items-center w-full">
              <p className="text-center mt-1 uppercase text-[#1E2131] font-bold tracking-[1px]">
                Input the nominal of deposito
              </p>
            </div>
          </ModalHeader>
          <ModalBody>
            <Input
              className="w-full text-medium"
              placeholder="Input deposito nominal"
              value={inputDeposito}
              onChange={(e) => {
                setInputDeposito(e.target.value);
              }}
              readOnly
            />
          </ModalBody>
          <ModalFooter>
            <button
              className="w-[200px] h-[40px] rounded-md text-black"
              onClick={() => {
                closeCreateModal();
                setInputDeposito("");
              }}
            >
              Cancel
            </button>
            <button
              className="bg-[#1E2131] text-white w-[200px] h-[40px] rounded-md"
              onClick={() => {
                inputDeposito
                  ? (setNoRoomData((prevNoRoomData) => ({
                      ...prevNoRoomData,
                      deposit: parseInt(inputDeposito),
                    })),
                    handleCheckin())
                  : toast.error("Please fill the input first!", {
                      position: "top-right",
                      hideProgressBar: true,
                      theme: "colored",
                      autoClose: 1000,
                    });
              }}
            >
              Confirm
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  );
};

export default CheckinPage;
