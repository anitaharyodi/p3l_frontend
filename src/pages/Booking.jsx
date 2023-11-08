import React, { useContext, useEffect, useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import assets from "../assets";
import {
  Breadcrumbs,
  BreadcrumbItem,
  CheckboxGroup,
  Checkbox,
  Textarea,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@nextui-org/react";
import {
  PiNumberCircleOneDuotone,
  PiNumberCircleTwoDuotone,
  PiNumberCircleThreeDuotone,
} from "react-icons/pi";
import { useLocation, useNavigate, useParams } from "react-router";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdOutlinePolicy } from "react-icons/md";
import UploadFile from "../components/UploadFile";
import axios from "axios";
import { toast } from "react-toastify";

const roomImages = [assets.ROOM4, assets.ROOM2, assets.ROOM3, assets.ROOM1];

const Booking = () => {
  const [activeStep, setActiveStep] = useState("booking");
  const location = useLocation();
  const { bookingList } = location.state || { bookingList: null };
  const { id } = useParams()
  const [showOtherTextArea, setShowOtherTextArea] = useState(false);
  const [bookRoom, setBookRoom] = useState([])
  const [fasilitasData, setFasilitasData] = useState([]);
  const [reservation, setReservation] = useState()
  const [customer, setCustomer] = useState()
  const [transaksiFasilitas, setTransaksiFasilitas] = useState([])
  const [quantities, setQuantities] = useState({});
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [otherRequest, setOtherRequest] = useState('');
  const [dates, setDates] = useState({});
  const navigate = useNavigate();
  const authToken = localStorage.getItem("token");

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const handleCheckboxChange = (e) => {
    if (e.target.value === "other") {
      setShowOtherTextArea(e.target.checked);
      setOtherRequest("")
    }
  }; 

  const scrollToPaymentSection = () => {
    const paymentSection = document.getElementById('payment');
    if (paymentSection) {
      // window.location.reload();
      paymentSection.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveStep("payment")
  };

  useEffect(() => {
    if (window.location.href.includes('#payment')) {
      scrollToPaymentSection();
    }
  }, []);

  const {
    isOpen: IsModalOpen,
    onOpen: openModal,
    onOpenChange: onModalOpenChange,
    onClose: closeModal,
  } = useDisclosure();

  const {
    isOpen: TransferIsModalOpen,
    onOpen: openTransferModal,
    onOpenChange: onTransferModalOpenChange,
    onClose: closeTransferModal,
  } = useDisclosure();

  useEffect(() => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    const apiURL = `http://localhost:8000/api/history/${id}`;
    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        setTransaksiFasilitas(response.data.data.transaksi_fasilitas)
        setReservation(response.data.data)
        setCustomer(response.data.data.customers)
        setBookRoom(response.data.data.reservasi_kamars)
      })
      .catch((error) => {
        console.error("Error fetching data from the API: " + error);
      });
  }, [activeStep]);

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

  const checkInDate = new Date(reservation?.tgl_checkin);
  const checkOutDate = new Date(reservation?.tgl_checkout);
  const timeDifference = checkOutDate - checkInDate;

  const [numberOfNights, setNumberOfNights] = useState(0);

  useEffect(() => {
    const nights = timeDifference / (1000 * 60 * 60 * 24);
    const roundedNights = Math.round(nights);
    setNumberOfNights(roundedNights);
  }, [reservation?.tgl_checkin, reservation?.tgl_checkout]);

  const formatCurrency = (number) => {
    return `Rp ${new Intl.NumberFormat("id-ID").format(number)}`;
  };

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const handleCheckboxChangeGroup = (id) => {
    if (selectedFacilities.includes(id)) {
      setSelectedFacilities(selectedFacilities.filter((facilityId) => facilityId !== id));
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
    const tglCheckinDate = new Date(reservation.tgl_checkin);
    const tglCheckoutDate = new Date(reservation.tgl_checkout);
    const selectedDate = new Date(dateValue);
  
    if (selectedDate >= tglCheckinDate && selectedDate <= tglCheckoutDate) {
      setDates({ ...dates, [id]: dateValue });
    } else {
      toast.error('Selected date is outside the range.', {
        position: "top-right",
        hideProgressBar: true,
        theme: "colored",
        autoClose: 1000,
      });
      setDates({ ...dates, [id]: null });
    }
  };

  const handleContinueToReview = () => {
    if(showOtherTextArea && selectedFacilities.length !== 0) {
      console.log("MASUK1")
      const requestData = [];

    selectedFacilities.forEach((facilityId) => {
      requestData.push({
        id_fasilitas: facilityId,
        jumlah: quantities[facilityId] || 0,
        tgl_pemakaian: dates[facilityId] || '',
        subtotal: fasilitasData[facilityId-1].harga * quantities[facilityId] 
      });
    });

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      }, 
    };

    const apiURL = `http://localhost:8000/api/transaksiFasilitas/${id}`
    axios
      .post(apiURL, requestData, axiosConfig)
      .then((response) => {
      })
      .catch((error) => {
        
        console.error(error);
      });

      const body = {
        special_req : otherRequest
      }

      const apiURLReservasi = `http://localhost:8000/api/reservasi/${id}`
      axios
      .post(apiURLReservasi, body, axiosConfig)
      .then((response) => {
      })
      .catch((error) => {
        console.error(error);
      });

      handleStepChange("review")

    }else if(showOtherTextArea) {
      console.log("MASUK 2")
      const body = {
        special_req : otherRequest
      }

      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

      const apiURLReservasi = `http://localhost:8000/api/reservasi/${id}`
      axios
      .post(apiURLReservasi, body, axiosConfig)
      .then((response) => {
        handleStepChange("review")
      })
      .catch((error) => {
        console.error(error);
      });

    }else {
      console.log("MASUK 3")
      const requestData = [];

    selectedFacilities.forEach((facilityId) => {
      requestData.push({
        id_fasilitas: facilityId,
        jumlah: quantities[facilityId] || 0,
        tgl_pemakaian: dates[facilityId] || '',
        subtotal: fasilitasData[facilityId-1].harga * quantities[facilityId] 
      });
    });

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const apiURL = `http://localhost:8000/api/transaksiFasilitas/${id}`

    axios
      .post(apiURL, requestData, axiosConfig)
      .then((response) => {
        handleStepChange("review")
      })
      .catch((error) => {
        
        console.error(error);
      });
    } 
  };

  const special_req_array = reservation?.special_req?.split("\n");

  function countRoomsByJenisKamar(bookRoom) {
    const counts = {};
    for (const room of bookRoom) {
      const jenisKamarId = room.id_jenis_kamar;
      counts[jenisKamarId] = (counts[jenisKamarId] || 0) + 1;
    }
    return counts;
  }
 
  const roomCounts = countRoomsByJenisKamar(bookRoom);

  const handleFileSelection = (file) => {
    setSelectedFile(file);
  };

  // Handle upload pembayaran
  const handlePembayaran = () => {
    if (selectedFile) {
      const body = new FormData();
      body.append('bukti_transfer', selectedFile);

      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const apiURL = `http://localhost:8000/api/reservasi/upload-pembayaran/${id}`;
      axios
        .post(apiURL, body, axiosConfig)
        .then((response) => {
          toast.success('Payment successfully!', {
            position: 'top-right',
            hideProgressBar: true,
            theme: 'colored',
            autoClose: 1000,
          });
          navigate('/myBooking');
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      toast.error('Please select a file for payment proof.', {
        position: 'top-right',
        hideProgressBar: true,
        theme: 'colored',
        autoClose: 1000,
      });
      onTransferModalOpenChange(false)
    }
  }


  console.log(JSON.stringify(transaksiFasilitas, null, 2))
  return (
    <section>
      <ScrollToTop />
      <div className="relative h-[360px]">
        <img
          className="bg-room object-cover w-full h-full"
          src={assets.ROOM8}
          alt=""
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center bg-black/50">
          <h1 className="text-6xl text-white z-20 font-primary text-center mb-10 mt-10">
            Room Booking
          </h1>
          <Breadcrumbs
            underline="hover"
            classNames={{
              list: "bg-[#1E2131] shadow-small w-full px-8 py-2",
            }}
            itemClasses={{
              item: `text-[16px] text-inherit`,
              separator: "text-white/40",
            }}
            variant="solid"
          >
            <BreadcrumbItem
              className={`mx-4 ${
                activeStep === "booking"
                  ? "font-semibold text-white"
                  : "text-white/60"
              }`}
            >
              <PiNumberCircleOneDuotone className="text-xl" /> Booking
            </BreadcrumbItem>
            <BreadcrumbItem
              className={`mx-4 ${
                activeStep === "review"
                  ? "font-semibold text-white"
                  : "text-white/60"
              }`}
            >
              <PiNumberCircleTwoDuotone className="text-xl" /> Review
            </BreadcrumbItem>
            <BreadcrumbItem
              className={`mx-4 ${
                activeStep === "payment"
                  ? "font-semibold text-white"
                  : "text-white/60"
              }`}
            >
              <PiNumberCircleThreeDuotone className="text-xl" /> Payment
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>
      </div>
      <div className="container mx-auto">
        {activeStep === "booking" ? (
          <>
            <h3 className="h3 mt-6">Room Booking Details</h3>
            <p className="font-secondary font-semibold text-[16px] text-gray-500">
              Make sure all the details on this page are correct before
              proceeding to payment.
            </p>
            <div className="flex flex-col lg:flex-row h-full ">
              <div className="w-full h-full lg:w-[62%]">
                <div className="mb-6">
                  <div className="bg-white shadow-md p-6 my-4 rounded-md">
                    <div className="flex items-center">
                      <p className="font-medium mr-2 w-[150px]">Name :</p>
                      <p className="font-semibold"> {customer?.nama}</p>
                    </div>
                    <div className="border-t-2 mt-3 border-gray-100"></div>
                    <div className="flex items-center mt-2">
                      <p className="font-medium mr-2 w-[150px]">Email :</p>
                      <p className="font-semibold"> {customer?.email}</p>
                    </div>
                    <div className="border-t-2 mt-3 border-gray-100"></div>
                    <div className="flex items-center mt-2">
                      <p className="font-medium mr-2 w-[150px]">
                        Phone Number :
                      </p>
                      <p className="font-semibold">{customer?.no_telepon}</p>
                    </div>
                    <div className="border-t-2 mt-3 border-gray-100"></div>
                    <div className="flex items-center mt-2">
                      <p className="font-medium mr-2 w-[150px]">
                        Identity Number :
                      </p>
                      <p className="font-semibold">{customer?.no_identitas}</p>
                    </div>
                    <div className="flex items-center mt-8">
                      <p className="font-medium mr-2 w-[150px]">Check-In :</p>
                      <p className="font-semibold"> {formatDate(reservation?.tgl_checkin)}</p>
                    </div>
                    <div className="border-t-2 mt-3 border-gray-100"></div>
                    <div className="flex items-center mt-2">
                      <p className="font-medium mr-2 w-[150px]">Check-Out :</p>
                      <p className="font-semibold"> {formatDate(reservation?.tgl_checkout)}</p>
                    </div>
                    <div className="border-t-2 mt-3 border-gray-100"></div>
                    <div className="flex items-center mt-2">
                      <p className="font-medium mr-2 w-[150px]">Adults :</p>
                      <p className="font-semibold">{reservation?.jumlah_dewasa}</p>
                    </div>
                    <div className="border-t-2 mt-3 border-gray-100"></div>
                    <div className="flex items-center mt-2">
                      <p className="font-medium mr-2 w-[150px]">Child :</p>
                      <p className="font-semibold">{reservation?.jumlah_anak}</p>
                    </div>
                  </div>
                  <p className="font-secondary font-semibold text-[16px] mt-8">
                    Special Request
                  </p>
                  <div className="bg-white shadow-md my-4 rounded-md">
                    <div className="bg-gray-100 h-[60px] rounded-t-md px-4 py-2">
                      <p className="text-[14px] font-normal">
                        The accommodation will try to fulfill your request based
                        on availability. Note that some requests may require an
                        extra charge and once submitted your request can't be
                        modified.
                      </p>
                    </div>
                    <div className="p-6 grid grid-cols-3 gap-4">
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
                              onChange={(e) => handleQuantityChange(facility.id, parseInt(e.target.value, 10))}
                            />
                            <input
                              type="date"
                              className="border-2 w-[130px] h-6 pl-2 rounded-md"
                              value={dates[facility.id] || ""}
                              onChange={(e) => handleDateChange(facility.id, e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                                       
                      ))}
                      <Checkbox
                        value="other"
                        className="col-span-1"
                        onChange={handleCheckboxChange}
                      >
                        Other
                      </Checkbox>
                      {showOtherTextArea && (
                        <>
                          <p className="col-span-3 mt-2 font-medium text-[14px]">
                            Please explain your another request : Bed type,
                            Smoking / Non Smoking, Food preferences
                          </p>
                          <Textarea
                            className="col-span-3 -mt-2"
                            placeholder="Enter other request here"
                            variant="bordered"
                            value={otherRequest}
                            onChange={(e) => setOtherRequest(e.target.value)}
                          ></Textarea>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full h-full lg:w-[38%] ml-6 mb-8">
                <div className="bg-white min-h-[450px] shadow-md rounded-md flex flex-col justify-between">
                  <div>
                    <div className="bg-[#1E2131] h-[70px] rounded-t-md">
                      <p className="text-white p-4 text-[25px] font-semibold font-tertiary tracking-[1px] flex items-center">
                        Price Details
                      </p>
                    </div>
                    {bookingList?.map((booking, index) => (
                    <div key={booking.jenis_kamar}>
                      <div className="pt-6 px-6 flex items-center">
                        <img
                          src={roomImages[booking.imgIndex]}
                          width={100}
                          height={100}
                          className="rounded-md"
                          alt="Room"
                        />
                        <div className="ml-4">
                          <p className="font-bold font-tertiary tracking-[1px]">
                          ({booking.quantity}x) {booking.jenis_kamar}
                          </p>
                          <p className="text-gray-600 text-[12px]">{numberOfNights} nights</p>
                        </div>
                        <div className="ml-auto">
                          <p className="font-tertiary tracking-[1px] font-semibold text-[17px] text-[#526166]">
                          {formatCurrency(booking.quantity * numberOfNights * booking.hargaPerMalam)}
                          </p>
                        </div>
                      </div>
                      <div className="border-t-2 mt-4 border-gray-100 mx-6"></div>
                      
                    </div>
                    ))}
                  </div>
                  <div className="mt-4 mx-6 mb-4">
                    <div className="border-1 p-3 mb-4 rounded-md">
                      <div className="flex justify-between">
                        <p className="font-tertiary tracking-[1px] text-[20px] font-semibold">
                          Total Price :{" "}
                        </p>
                        <p className="font-tertiary tracking-[1px] font-semibold text-[20px] text-accent">
                          {formatCurrency(reservation?.total_harga)} 
                        </p>
                      </div>
                    </div>
                    <button
                      className="bg-[#1E2131] text-white w-full p-2 font-semibold text-[16px] h-10 rounded-md"
                      onClick={() => openModal()}
                    >
                      Continue to Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <Modal isOpen={IsModalOpen} onOpenChange={onModalOpenChange}>
              <ModalContent>
                <ModalHeader>
                  <div className="flex flex-col items-center w-full">
                    <p className="text-center mt-1 uppercase text-[#1E2131] font-bold tracking-[1px]">
                      Confirmation
                    </p>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <p className="font-semibold">Are the details correct?</p>
                  <p className="font-medium">
                    Make sure your details are correct before continuing to the
                    review page.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <button
                    className="w-[200px] h-[40px] rounded-md text-black"
                    onClick={() => {
                      closeModal();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-[#1E2131] text-white w-[200px] h-[40px] rounded-md"
                    onClick={() => handleContinueToReview()}
                  >
                    Yes, all is correct
                  </button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>


          // Review Page
        ) : activeStep === "review" ? (
          <>
            <ScrollToTop />
            <h3 className="h3 mt-6">Please Review Your Booking</h3>
            <p className="font-secondary font-semibold text-[16px] text-gray-500">
              Please review your booking details before continuing to payment
            </p>
            <div className="flex flex-col lg:flex-row h-full ">
              <div className="w-full h-full lg:w-[60%]">
                <div className="mb-6">
                  <div className="bg-white shadow-md p-6 my-4 rounded-md">
                    <div className="flex items-center">
                      <p className="font-medium mr-2 w-[150px]">Name :</p>
                      <p className="font-semibold"> {customer?.nama}</p>
                    </div>
                    <div className="border-t-2 mt-3 border-gray-100"></div>
                    <div className="flex items-center mt-2">
                      <p className="font-medium mr-2 w-[150px]">Email :</p>
                      <p className="font-semibold">{customer?.email}</p>
                    </div>
                    <div className="border-t-2 mt-3 border-gray-100"></div>
                    <div className="flex items-center mt-2">
                      <p className="font-medium mr-2 w-[150px]">
                        Phone Number :
                      </p>
                      <p className="font-semibold">{customer?.no_telepon}</p>
                    </div>
                    <div className="border-t-2 mt-3 border-gray-100"></div>
                    <div className="flex items-center mt-2">
                      <p className="font-medium mr-2 w-[150px]">
                        Identity Number :
                      </p>
                      <p className="font-semibold">{customer?.no_identitas}</p>
                    </div>
                    <div className="flex items-center mt-8">
                      <p className="font-medium mr-2 w-[150px]">Check-In :</p>
                      <p className="font-semibold">{formatDate(reservation?.tgl_checkin)}</p>
                    </div>
                    <div className="border-t-2 mt-3 border-gray-100"></div>
                    <div className="flex items-center mt-2">
                      <p className="font-medium mr-2 w-[150px]">Check-Out :</p>
                      <p className="font-semibold">{formatDate(reservation?.tgl_checkout)}</p>
                    </div>
                    <div className="border-t-2 mt-3 border-gray-100"></div>
                    <div className="flex items-center mt-2">
                      <p className="font-medium mr-2 w-[150px]">Adults :</p>
                      <p className="font-semibold">{reservation?.jumlah_dewasa}</p>
                    </div>
                    <div className="border-t-2 mt-3 border-gray-100"></div>
                    <div className="flex items-center mt-2">
                      <p className="font-medium mr-2 w-[150px]">Child :</p>
                      <p className="font-semibold">{reservation?.jumlah_anak}</p>
                    </div>
                  </div>
                  <p className="font-secondary font-semibold text-[16px] mt-8">
                    Special Request
                  </p>
                  <div className="bg-white shadow-md my-4 rounded-md p-6 font-medium">
                    <div className="grid grid-cols-2 gap-4">
                    {special_req_array?.length > 0 || transaksiFasilitas?.length > 0 ? (
                        <> 
                          {special_req_array?.map((specialReq) => (
                            <p className="col-span-1">{specialReq}</p>
                          ))}
                          {transaksiFasilitas.map((trxFasilitas) => (
                            <p className="col-span-1">- ({trxFasilitas.jumlah}x) {trxFasilitas.fasilitas_tambahans.nama_fasilitas}</p>
                          ))}
                        </>
                      ) : (
                        <p>No Special Request</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-white min-h-[450px] mt-8 shadow-md rounded-md flex flex-col justify-between">
                    <div>
                      <div className="bg-[#1E2131] h-[70px] rounded-t-md">
                        <p className="text-white p-4 mt-2 text-[22px] font-bold">
                          Price Details
                        </p>
                      </div>
                      {bookingList?.map((booking, index) => (
                        <div key={booking.jenis_kamar}>
                          <div className="pt-6 px-6 flex items-center">
                            <img
                              src={roomImages[booking.imgIndex]}
                              width={100}
                              height={100}
                              className="rounded-md"
                              alt="Room"
                            />
                            <div className="ml-4">
                              <p className="font-bold font-tertiary tracking-[1px]">
                              ({booking.quantity}x) {booking.jenis_kamar}
                              </p>
                              <p className="text-gray-600 text-[12px]">{numberOfNights} nights</p>
                            </div>
                            <div className="ml-auto">
                              <p className="font-tertiary tracking-[1px] font-semibold text-[17px] text-[#526166]">
                              {formatCurrency(booking.quantity * numberOfNights * booking.hargaPerMalam)}
                              </p>
                            </div>
                          </div>
                          <div className="border-t-2 mt-4 border-gray-100 mx-6"></div>
                        </div> 
                        ))}
                    </div>
                    <div className="mt-4 mx-6 mb-4">
                      <div className="border-1 p-3 mb-4 rounded-md">
                        <div className="flex justify-between">
                          <p className="font-tertiary tracking-[1px] text-[20px] font-semibold">
                            Total Price :{" "}
                          </p>
                          <p className="font-tertiary tracking-[1px] font-semibold text-[20px] text-accent">
                          {formatCurrency(reservation?.total_harga)} 
                          </p>
                        </div>
                      </div>
                      <button
                        className="bg-[#1E2131] text-white w-full p-2 font-semibold text-[16px] h-10 rounded-md"
                        onClick={() => handleStepChange("payment")}
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full h-full lg:w-[40%] ml-6 mb-8">
                <div className="bg-white shadow-md my-4 rounded-md font-medium">
                  <div className="bg-gray-100 h-[60px] rounded-t-md px-4 py-2">
                    <p className="text-[20px] font-bold mt-2">
                      Accomodation Policies
                    </p>
                  </div>
                  <div className="mx-6 py-2">
                    <div className="flex items-center">
                      <p className="font-semibold text-[16px] flex items-center">
                        <AiOutlineClockCircle className="mr-2" />{" "}
                        Check-In/Check-Out Time
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-gray-500 ml-6 mt-2">
                        Check-In:{" "}
                        <span className="font-semibold text-black">
                          From 14.00
                        </span>
                      </p>
                      <p className="text-gray-500 ml-6 mt-2">
                        Check-Out:{" "}
                        <span className="font-semibold text-black">
                          Before 12.00
                        </span>
                      </p>
                    </div>
                    <div className="border-t-2 mt-3 border-gray-100"></div>
                    <div className="flex items-center mt-2">
                      <p className="font-semibold text-[16px] flex items-center">
                        <MdOutlinePolicy className="mr-2" /> Additional Policy
                      </p>
                    </div>
                    <p className="text-gray-500 ml-6 my-2">
                      You may be required to present valid government-issued
                      identification at check-in, along with credit card or cash
                      to cover deposits and incidentals. Special request may
                      depend on hotel's availability at check-in and may cost
                      extra fee. Special request availability is not guaranteed.
                      Hotel may charge you additional fee for each extra person
                      after reserved room's maximum capacity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>


        // Payment Page
        ) : (
          <>
          <div id="payment">
            <ScrollToTop />
            <h3 className="h3 mt-6">Payment</h3>
            <p className="font-secondary font-semibold text-[16px] text-gray-500">
              Please complete your payment maximal 1 week before Check-In
            </p>
            <div className="bg-white shadow-md my-4 p-6 rounded-md">
              <p className="font-semibold text-[20px]">Bank Transfer</p>
              <div className="flex items-start">
                <div>
                  <img
                    src={assets.DIAMONDBANK}
                    width={120}
                    height={120}
                    className="border-1 p-2 mr-2 mt-2"
                  />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-[16px] mt-2">770011770022</p>
                  <p className="font-medium text-[16px]">PT Atma Jaya</p>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-md my-4 rounded-md pb-4">
              <div className="bg-[#1E2131] p-6 h-[70px] rounded-t-md text-white">
                <h3 className="h3 text-[20px]">ID Booking #{reservation?.id_booking}</h3>
              </div>
              {bookRoom.filter((room, index, self) => {
                  return self.findIndex((r) => r.id_jenis_kamar === room.id_jenis_kamar) === index;
                })
                .map((room, index) => {
                  return (
                    <div key={room.id_jenis_kamar}>
                      <div className="pt-6 px-6 flex items-center">
                        <img
                          src={roomImages[room.id_jenis_kamar - 1]}
                          width={100}
                          height={100}
                          className="rounded-md"
                          alt="Room"
                        />
                        <div className="ml-4">
                          <p className="font-bold font-tertiary tracking-[1px]">
                            ({roomCounts[room.id_jenis_kamar]}x) {room.jenis_kamars.jenis_kamar}
                          </p>
                          <p className="text-gray-600 text-[12px]">{numberOfNights} nights</p>
                        </div>
                        <div className="ml-auto">
                          <p className="font-tertiary tracking-[1px] font-semibold text-[17px] text-[#526166]">
                          {formatCurrency(roomCounts[room.id_jenis_kamar] * numberOfNights * room.hargaPerMalam)}
                          </p>
                        </div>
                      </div>
                      <div className="border-t-2 mt-4 border-gray-100 mx-6"></div>
                    </div>
                  );
                })}
              <div className="mt-4 mx-6 mb-4">
                <div className="border-1 p-3 mb-4 rounded-md">
                  <div className="flex justify-between">
                    <p className="font-tertiary tracking-[1px] text-[20px] font-semibold">
                      Total Price :{" "}
                    </p>
                    <p className="font-tertiary tracking-[1px] font-semibold text-[20px] text-accent">
                    {formatCurrency(reservation?.total_harga)} 
                    </p>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="font-semibold mb-2">Evidence of Transfer</p>
                  <UploadFile handleFileSelection={handleFileSelection} />
                </div>
                <div className="flex space-x-4">
                  <button
                    className="border-1 border-[#1E2131] text-[#1E2131] w-full p-2 font-semibold text-[16px] h-10 rounded-md"
                    onClick={() => navigate("/myBooking")}
                  >
                    I want to pay later
                  </button>
                  <button
                    className="bg-[#1E2131] text-white w-full p-2 font-semibold text-[16px] h-10 rounded-md"
                    onClick={() => openTransferModal()}
                  >
                    I already paid
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Modal isOpen={TransferIsModalOpen} onOpenChange={onTransferModalOpenChange}>
              <ModalContent>
                <ModalHeader>
                  <div className="flex flex-col items-center w-full">
                    <p className="text-center mt-1 uppercase text-[#1E2131] font-bold tracking-[1px]">
                      Confirmation
                    </p>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <p className="font-semibold">Are you sure want to pay?</p>
                  <p className="font-medium">
                    Make sure your evidence files are correct.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <button
                    className="w-[200px] h-[40px] rounded-md text-black"
                    onClick={() => {
                      closeTransferModal();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-[#1E2131] text-white w-[200px] h-[40px] rounded-md"
                    onClick={() => handlePembayaran()}
                  >
                    I'm sure
                  </button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        )}
      </div>
    </section>
  );
};

export default Booking;
