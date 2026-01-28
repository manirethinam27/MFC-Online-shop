import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    clearCart
  } = useCart();

  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(null);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const placeOrder = async () => {
    if (!paymentMethod) return;

    const orderData = {
      items: cartItems.map(item => ({
        name: item.name,
        qty: item.qty,
        price: item.price
      })),
      paymentMethod
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/orders/createorder`,
        orderData,
        { headers: { "Content-Type": "application/json" } }
      );

      const orderId = res.data.orderId; 
      const paymentStatuss = res.data.paymentStatus;

      clearCart();
      setIsCartOpen(false);

      navigate("/order-qr", {
        state: { orderId, orderData, paymentStatuss }
      });

    } catch (error) {
      console.error("Order failed:", error?.response?.data || error.message);
      alert(
        `Order failed: ${
          error?.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
          />

          <motion.div
            className="fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-xl p-4"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {cartItems.length === 0 && <p>Cart is empty</p>}

            {cartItems.map(item => (
              <div key={item.name} className="flex gap-3 mb-4 items-center">
                <img src={item.image} className="w-12 h-12 rounded" />
                <div className="flex-1">
                  <p className="font-semibold capitalize">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    ₹{item.price} × {item.qty}
                  </p>
                </div>
                <p className="text-[var(--primary)]">
                  ₹{item.price * item.qty}
                </p>
                <button onClick={() => removeFromCart(item.name)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}

            <hr />
            <p className="font-bold">
              Total: <span className="text-[var(--primary)]">₹{totalAmount}</span>
            </p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setPaymentMethod("online")}
                className={`w-1/2 p-2 rounded text-white ${
                  paymentMethod === "online"
                    ? "bg-[var(--primary)]"
                    : "bg-gray-400"
                }`}
              >
                UPI
              </button>

              <button
                onClick={() => setPaymentMethod("counter")}
                className={`w-1/2 p-2 rounded text-white ${
                  paymentMethod === "counter"
                    ? "bg-[var(--primary)]"
                    : "bg-gray-400"
                }`}
              >
                Counter
              </button>
            </div>

            <button
              disabled={!paymentMethod || cartItems.length === 0}
              onClick={placeOrder}
              className="mt-4 w-full bg-[var(--primary)] text-white py-2 rounded"
            >
              Place Order
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
