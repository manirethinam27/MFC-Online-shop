import QRCode from "react-qr-code";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const OrderQR = () => {
  const { state } = useLocation();
  const orderId = state?.orderId;
  const paymentStatus = state?.paymentStatuss;
  const orderData = state?.orderData;
  const navigate = useNavigate();

  if (!orderData || !orderId || !paymentStatus) return <p>No order found</p>;

  const totalAmount = orderData.items.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

 const qrPayload = {
    orderId: orderId,
    p: paymentStatus,
    i: orderData.items.map(item => [
      item.name,
      item.qty,
      item.price
    ])
  };

  const qrData = JSON.stringify(qrPayload);

  const goBack = () => {
    alert("you get back to home page");
    alert("Thank you for ordering!");
    
    navigate("/");
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Order Confirmed 🎉</h1>

      
      <QRCode value={qrData} size={220} />

      <div className="w-full max-w-sm bg-white rounded shadow p-4">
        <p><b>Order ID:</b> {orderId}</p>
        <p>
          <b>Payment:</b>{" "}
          <span className={
            paymentStatus === "Paid"
              ? "text-green-600"
              : "text-orange-600"
          }>
            {paymentStatus}
          </span>
        </p>

        <hr className="my-2" />

        {orderData.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="capitalize">
              {item.name} × {item.qty}
            </span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}

        <hr className="my-2" />
        <p className="font-bold">Total: ₹{totalAmount}</p>
      </div>

      <p className="text-gray-500 text-sm text-red-600">
        Show this QR code at the counter to collect your order.
      </p>
      <button onClick={goBack} className="mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded">
        Back to Home
      </button>

    </div>
  );
};

export default OrderQR;
