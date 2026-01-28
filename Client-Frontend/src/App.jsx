import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OrderQR from "./pages/QRPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order-qr" element={<OrderQR />} />
      </Routes>

      <ToastContainer />
    </>
  );
};

export default App;
