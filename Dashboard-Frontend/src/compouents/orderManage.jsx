import { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../context/appContext.jsx";

const OrderManage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setOrders: setContextOrders, setProfit: setContextProfit, setPendingOrders } = useAppContext();

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/orders/getorders`,
          { withCredentials: true }
        );
        setOrders(res.data.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Mark as Paid
  const markAsPaid = async (orderId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/orders/updatePaid/${orderId}`,
        {},
        { withCredentials: true }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, paymentStatus: "Paid" } : o
        )
      );
    } catch (err) {
      console.error(err.response?.data?.message);
    }
  };

  // Mark Pickup Verified
  const markAsPickupVerify = async (orderId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/orders/verifypickup/${orderId}`,
        {},
        { withCredentials: true }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, pickupVerified: true } : o
        )
      );
    } catch (err) {
      console.error(err.response?.data?.message);
    }
  };

  // Filter pending orders
  const pendingOrders = orders.filter((order) => !order.pickupVerified);

  // Calculate time ago
  const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hr ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };

  // Update context values
  useEffect(() => {
    const paidOrders = orders.filter((order) => order.paymentStatus === "Paid");
    const totalProfit = paidOrders.reduce((acc, order) => acc + (order.totalAmount ?? 0), 0);
    const unpaidOrders = orders.filter((order) => !order.pickupVerified).length;

    setContextOrders(orders.length);
    setContextProfit(totalProfit);
    setPendingOrders(unpaidOrders);
  }, [orders, setContextOrders, setContextProfit, setPendingOrders]);

  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Order Management</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border border-red-300">
          <thead className="bg-red-300 text-[var(--primary)] font-bold">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Order ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Items</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Total</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Payment</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Pickup</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Time</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-red-300">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-4 py-3 text-center">Loading...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-3 text-center">No orders found.</td>
              </tr>
            ) : pendingOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-3 text-center">No pending orders.</td>
              </tr>
            ) : (
              pendingOrders.map((item) => (
                <tr className="hover:bg-gray-100" key={item._id}>
                  <td className="px-4 py-2">{item.orderId}</td>

                  <td className="px-4 py-2">
                    <ul className="text-sm space-y-1">
                      {item.items.map((product, index) => (
                        <li key={index}>
                          {product.name} × {product.qty}
                        </li>
                      ))}
                    </ul>
                  </td>

                  <td className="px-4 py-2 font-semibold">₹{item.totalAmount}</td>
                  <td className="px-4 py-2">{item.paymentMethod}</td>

                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        item.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.paymentStatus}
                    </span>
                  </td>

                  <td className="px-4 py-2">{item.pickupVerified ? "Picked Up" : "Pending"}</td>
                  <td className="px-4 py-2 text-sm text-gray-500">{timeAgo(item.createdAt)}</td>

                  <td className="px-4 py-2">
                    {!item.pickupVerified ? (
                      item.paymentStatus === "Paid" ? (
                        <button
                          type="button"
                          className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
                          onClick={() => markAsPickupVerify(item.orderId)}
                        >
                          Verify
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="px-2 py-1 text-xs bg-green-500 text-white rounded"
                          onClick={() => markAsPaid(item.orderId)}
                        >
                          Pay
                        </button>
                      )
                    ) : (
                      <span className="text-green-600 font-semibold">Verified</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OrderManage;
