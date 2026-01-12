import { useEffect, useState } from "react";
import axios from "axios";

const OrderManage = () => {

  const [orders, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/orders/getorders`,
          { withCredentials: true }
        );


        setItems(res.data.data);
      } catch (error) {
        console.error("Error fetching items:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const markAsPaid = async (orderId) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/orders/updatePaid/${orderId}`,
        {},
        { withCredentials: true }
      );

      setItems((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, paymentStatus: "Paid" } : o
        )
      );
    } catch (err) {
      console.error(err.response?.data?.message);
    }
  };

  const markAsPickupVerify = async (orderId) => {
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/orders/verifypickup/${orderId}`,
      {},
      { withCredentials: true }
    );

    setItems((prev) =>
      prev.map((o) =>
        o._id === orderId ? { ...o, pickupVerified: true } : o
      )
    );
  } catch (err) {
    console.error(err.response?.data?.message);
  }
};



  const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} sec ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hr ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
};


const totalOrders = orders.length;
const totalProfit = orders.reduce((acc, order) => acc + order.totalAmount, 0);



    return(
        <>
        <h1 className="text-xl font-semibold mb-4">Order Management</h1>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border border-red-300">
            <thead className="bg-red-300 text-[var(--primary)] font-bold">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold ">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold ">Items</th>
                <th className="px-4 py-3 text-left text-sm font-semibold ">Total</th>
                <th className="px-4 py-3 text-left text-sm font-semibold ">Payment</th>
                <th className="px-4 py-3 text-left text-sm font-semibold ">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold ">Pickup</th>
                <th className="px-4 py-3 text-left text-sm font-semibold ">Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold ">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-red-300">
              {orders.map((item) => (
                <tr className=" hover:bg-gray-100" key={item._id}>
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
                      <span className={`px-2 py-1 text-xs rounded ${item.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                       {item.paymentStatus}
                      </span>
                  </td>

                  <td className="px-4 py-2">{item.pickupVerified===false ? "Pending" : "Picked Up"}</td>
                  <td className="px-4 py-2 text-sm text-gray-500">{timeAgo(item.createdAt)}</td>
                  {item.pickupVerified===false ? (
                  <td className="px-4 py-2">
                    {item.paymentStatus === 'Paid' ? (
                      <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded" onClick={() => markAsPickupVerify(item._id)}>verify</button>
                    ) : (
                      <button className="px-2 py-1 text-xs bg-green-500 text-white rounded" onClick={() => markAsPaid(item._id)}>pay</button>
                    )}
                  </td>
                  ):(
                    <td className="px-4 py-2 text-green-600 font-semibold">Verified</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        </>
    );
}

export default OrderManage;