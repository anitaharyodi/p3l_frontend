import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import RoomDetails from './pages/RoomDetails';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
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
