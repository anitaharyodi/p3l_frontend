import React, { useEffect, useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import assets from "../assets";
import CardBooking from "../components/CardBooking";
import axios from "axios";

const MyBooking = () => {
  const authToken = localStorage.getItem("token");
  const [profileData, setProfileData] = useState();
  const [bookingData, setBookingData] = useState([]);

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const formatCurrency = (number) => {
    return `Rp ${new Intl.NumberFormat("id-ID").format(number)}`;
  };

  useEffect(() => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    const apiURL = "http://localhost:8000/api/history";
    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        const { nama, email, no_telepon } = response.data.mess.customers;
        console.log(JSON.stringify(response.data.mess.customers, null, 2));
        setProfileData({
          name: nama,
          email: email,
          noTelepon: no_telepon,
        });
        console.log(profileData);
        setBookingData(response.data.mess.customers.reservations);
      })
      .catch((error) => {
        console.error("Error fetching data from the API: " + error);
      });
  }, []);

  return (
    <section>
      <ScrollToTop />
      <div className="relative h-[360px]">
        <img
          className="bg-room object-cover w-full h-full"
          src={assets.MYBOOKINGBG}
          alt=""
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/50">
          <h1 className="text-6xl text-white z-20 font-primary text-center">
            My Bookings
          </h1>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="grid grid-rows-1 gap-4 my-10">
          {bookingData.map((booking, index) => (
            <CardBooking
              id={booking.id}
              key={index}
              idBooking={booking.id_booking}
              status={booking.status}
              tglCheckin={formatDate(booking.tgl_checkin)}
              tglCheckout={formatDate(booking.tgl_checkout)}
              tglPembayaran={formatDate(booking.tgl_pembayaran)}
              totalHarga={formatCurrency(booking.total_harga)}
              nama={profileData.name}
              email={profileData.email}
              noTelepon={profileData.noTelepon}
              jmlDewasa={booking.jumlah_dewasa}
              jmlAnak={booking.jumlah_anak}
              uangJaminan={formatCurrency(booking.uang_jaminan)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyBooking;
