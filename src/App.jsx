import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import RoomDetails from './pages/RoomDetails';
import Header from './components/Header';
import Footer from './components/Footer';
import { useContext, useEffect } from 'react';
import { RoomContext } from './context/RoomContext';
import ForgotPassword from './pages/ForgotPassword';
import ProfileCustomer from './pages/ProfileCustomer';
import MyBooking from './pages/MyBooking';


const App = () => {
  const {setIsLogin} = useContext(RoomContext)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
    }
  }, []);
  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="*"
            element={
              <>
                <Header />
                <Routes>
                  <Route index element={<Home />} />
                  <Route path="/room/:id" element={<RoomDetails />} />
                  <Route path="/login" element={<Login/>} />
                  <Route path="/forgotPassword" element={<ForgotPassword/>} />
                  <Route path="/profile" element={<ProfileCustomer/>} />
                  <Route path="/myBooking" element={<MyBooking/>} />
                </Routes>
                <Footer />
              </>
            }
          />
          {/* <Route path="/login" element={<Login/>} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
