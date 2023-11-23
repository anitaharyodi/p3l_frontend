import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RoomDetails from "./pages/RoomDetails";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useContext, useEffect } from "react";
import { RoomContext } from "./context/RoomContext";
import ForgotPassword from "./pages/ForgotPassword";
import ProfileCustomer from "./pages/ProfileCustomer";
import MyBooking from "./pages/MyBooking";
import LoginAdmin from "./pages/admin/LoginAdmin";
import RoomAdmin from "./pages/admin/RoomAdmin";
import ForgotPasswordPegawai from "./pages/admin/ForgotPasswordPegawai";
import Sidebar from "./components/admin/Sidebar";
import SeasonPage from "./pages/admin/SeasonPage";
import FasilitasPage from "./pages/admin/FasilitasPage";
import TarifPage from "./pages/admin/TarifPage";
import CustomerPage from "./pages/admin/CustomerPage";
import HistoryReservation from "./pages/admin/HistoryReservation";
import SearchBookRoom from "./pages/SearchBookRoom";
import Booking from "./pages/Booking";
import GroupReservation from "./pages/admin/GroupReservation";
import GroupBooking from "./pages/admin/GroupBooking";
import CustomerStay from "./pages/admin/CustomerStay";
import CheckinPage from "./pages/admin/CheckinPage";

const App = () => {
  const { setIsLogin, setIsLoginPegawai } = useContext(RoomContext);
  const pegawaiRole = localStorage.getItem("role");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
    }

    const tokenPegawai = localStorage.getItem("tokenPegawai");
    if (tokenPegawai) {
      setIsLoginPegawai(true);
    }
  }, []);

  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/*"
            element={
              <>
                <Header />
                <Routes>
                  <Route index element={<Home />} />
                  <Route path="/room/:id" element={<RoomDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgotPassword" element={<ForgotPassword />} />
                  <Route path="/profile" element={<ProfileCustomer />} />
                  <Route path="/myBooking" element={<MyBooking />} />
                  <Route path="/searchRoom" element={<SearchBookRoom />} />
                  <Route path="/book/:id" element={<Booking />} />
                </Routes>
                <Footer />
              </>
            }
          />
          <Route path="/admin" element={<LoginAdmin />} />
          <Route
            path="/forgotPassPegawai"
            element={<ForgotPasswordPegawai />}
          />
          <Route
            path="/home/*"
            element={
              <>
                <Sidebar />
                <div className="md:ml-64 px-16 mx-auto">
                  <Routes>
                    <Route path="room" element={<RoomAdmin />} />
                    <Route path="season" element={<SeasonPage />} />
                    <Route path="fasilitas" element={<FasilitasPage />} />
                    <Route path="tarif" element={<TarifPage />} />
                    <Route path="customer" element={<CustomerPage />} />
                    <Route path="reservation" element={<GroupReservation />} />
                    <Route path="historyReservation" element={<HistoryReservation />} />
                    <Route path="bookGroup/:id" element={<GroupBooking />} />
                    <Route path="customerStay" element={<CustomerStay />} />
                    <Route path="checkin" element={<CheckinPage />} />
                  </Routes>
                </div>
              </>
            }
          />
          {/* {pegawaiRole === "Admin" ? (
            <Route path="/roomAdmin" element={<RoomAdmin />} />
          ) : null} */}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
