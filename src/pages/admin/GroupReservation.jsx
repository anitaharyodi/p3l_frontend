import React, { useContext, useEffect, useState } from "react";
import { PiBookOpenTextBold } from "react-icons/pi";
import CheckInGroup from "../../components/admin/CheckInGroup";
import CheckOutGroup from "../../components/admin/CheckOutGroup";
import AdultsInput from "../../components/admin/AdultsInput";
import KidsInput from "../../components/admin/KidsInput";
import CardFindRoomGroup from "../../components/admin/CardFindRoomGroup";
import BookingListGroup from "../../components/admin/BookingListGroup";
import { RoomContext } from "../../context/RoomContext";
import moment from "moment";
import axios from "axios";
import { useLocation, useParams } from "react-router";

const GroupReservation = () => {
  const { handleClickGroup, tglCheckinGroup, tglCheckOutGroup } =
    useContext(RoomContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [jenisKamarBySeason, setJenisKamarBySeason] = useState([]);
  const [ketersediaanKamar, setKetersediaanKamar] = useState([]);

  const formattedDateCheckin = moment(tglCheckinGroup).format("YYYY-MM-DD");
  const formattedDateCheckout = moment(tglCheckOutGroup).format("YYYY-MM-DD");

  const isFormEmpty = !tglCheckinGroup || !tglCheckOutGroup;

  useEffect(() => {
    const apiURL = `https://ah-project.my.id/api/tarifBySeason?tgl_checkin=${formattedDateCheckin}&tgl_checkout=${formattedDateCheckout}`;
    axios
      .get(apiURL)
      .then((response) => {
        // console.log(response)
        setJenisKamarBySeason(response.data.data);
        console.log(
          "MASUK SEARCH",
          JSON.stringify(response.data.data, null, 2)
        );
      })
      .catch((error) => {
        console.error("Error fetching data from the API: " + error);
      });
  }, [tglCheckinGroup, tglCheckOutGroup]);

  useEffect(() => {
    const apiURL = `https://ah-project.my.id/api/ketersediaanKamar?tgl_checkin=${formattedDateCheckin}&tgl_checkout=${formattedDateCheckout}`;
    axios
      .get(apiURL)
      .then((response) => {
        // console.log(response)
        setKetersediaanKamar(response.data.data);
        console.log(
          "MASUK SEARCH",
          JSON.stringify(response.data.data, null, 2)
        );
      })
      .catch((error) => {
        console.error("Error fetching data from the API: " + error);
      });
  }, [tglCheckinGroup, tglCheckOutGroup]);

  return (
    <section>
      <div className="h2 text-accent p-2 rounded-lg font-semibold text-[30px] uppercase font-tertiary tracking-[2px] flex items-center">
        <PiBookOpenTextBold className="text-2xl mr-2" />
        Group Reservation
      </div>
      <div className="">
        <form className="h-[300px] w-full lg:h-[60px]">
          <div className="flex flex-col w-full h-full lg:flex-row">
            <div className="flex-1 border-t-1 border-l-1 border-b-1 rounded-l-md">
              <CheckInGroup />
            </div>
            <div className="flex-1 border-t-1 border-l-1 border-b-1">
              <CheckOutGroup />
            </div>
            <div className="flex-1 border-t-1 border-l-1 border-b-1">
              <AdultsInput />
            </div>
            <div className="flex-1 border-t-1 border-r-1 border-b-1 rounded-r-md">
              <KidsInput />
            </div>
          </div>
        </form>
        <div className="flex flex-col lg:flex-row h-full mt-8">
          <div className="w-full h-full lg:w-[65%] pr-6">
            <div className="mb-6">
              {jenisKamarBySeason.map((item, index) => {
                const totalKamar = ketersediaanKamar?.find(
                  (kk) => kk.id_jenis_kamar == item.id
                )?.totalKamar;

                if (totalKamar > 0) {
                  return (
                    <CardFindRoomGroup
                      key={item.id}
                      jenisKamarBySeason={item}
                      imgIndex={index}
                      ketersediaanKamar={totalKamar}
                    />
                  );
                }

                return null;
              })}
            </div>
          </div>
          <div className="w-full h-full lg:w-[35%] mb-8 sticky top-10">
            <BookingListGroup id={id} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GroupReservation;
