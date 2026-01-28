import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const ScanPage = () => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

  const html5QrCode = useRef(null);

  // ▶️ Start camera scan
  const startScan = async () => {
    setError("");
    setOrderData(null);

    html5QrCode.current = new Html5Qrcode("reader");

    try {
      await html5QrCode.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          try {
            const data = JSON.parse(decodedText);

            // ✅ Save scanned data
            setOrderData(data);

            // ✅ Stop scanning after success
            await stopScan();
          } catch (err) {
            setError("❌ Invalid QR Code");
          }
        }
      );

      setScanning(true);
    } catch (err) {
      setError("❌ Camera access failed");
    }
  };

  const payNow = async (e) => {
  try {
    setLoading(true);

    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/orders/updatePaid/${orderData.orderId}`,
      {},
      { withCredentials: true }
    );

    alert("✅ Payment successful");
    setOrderData({ ...orderData, p: "Paid" });
     e.preventDefault();
  } catch (err) {
    alert("❌ Payment failed");
  } finally {
    setLoading(false);
  }
};


  // ⛔ Stop camera
  const stopScan = async () => {
    if (html5QrCode.current) {
      await html5QrCode.current.stop();
      await html5QrCode.current.clear();
    }
    setScanning(false);
  };

  const verifyPickup = async (e) => {
    if (!orderData?.orderId) return;

    try {
      setLoading(true);

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/orders/verifypickup/${orderData.orderId}`,
        {},
        { withCredentials: true }
      );

      alert("✅ Pickup verified successfully");
      setOrderData(null);
       e.preventDefault();
    } catch (err) {
      alert(err?.response?.data?.message || "❌ Verification failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => stopScan();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Scan Order QR</h1>

      {!scanning && !orderData && (
        <button
          onClick={startScan}
          className="px-6 py-2 bg-blue-600 text-white rounded"
        >
          Start Scan
        </button>
      )}

      {scanning && (
        <button
          onClick={stopScan}
          className="px-6 py-2 bg-red-500 text-white rounded mb-2"
        >
          Stop Scan
        </button>
      )}

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {/* CAMERA */}
      {!orderData && (
        <div
          id="reader"
          className="w-full max-w-sm h-96 mt-4 border rounded overflow-hidden"
        />
      )}

      {/* 📦 SCANNED ORDER DETAILS */}
      {orderData && (
        <div className="w-full max-w-sm mt-4 border rounded p-4 shadow">
          <h2 className="font-bold text-lg mb-2">Order Details</h2>

          <p><b>Order ID:</b> {orderData.orderId}</p>
          <p><b>Status:</b> {orderData.p}</p>

          <div className="mt-2">
            <b>Items:</b>
            {orderData.i.map((item, index) => (
              <p key={index}>
                {item[0]} × {item[1]} = ₹{item[2]}
              </p>
            ))}
          </div>

          {orderData.p === "Pending" ? (
            <button
              onClick={payNow}
              disabled={loading}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded"
            >
              Pay
            </button>
          ):( <button
            onClick={verifyPickup}
            disabled={loading}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded"
          >
            {loading ? "Verifying..." : "Verify Pickup"}
          </button>)}


        </div>
      )}
    </div>
  );
};

export default ScanPage;
