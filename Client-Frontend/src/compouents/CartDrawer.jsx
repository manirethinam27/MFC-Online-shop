import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash ,faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";


const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart,clearCart } = useCart();

  const totalAmount = cartItems.reduce(
  (total, item) => total + item.price * item.qty,
  0
);

const [paymentMethod, setPaymentMethod] = useState(null);

const placeOrder = async () => {
  const orderData = {
    items: cartItems.map(item => ({
      name: item.name,
      qty: item.qty,
      price: item.price
    })),
    paymentMethod: paymentMethod
  };

  try {
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/orders/createorder`,
      orderData,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    setIsCartOpen(false);
    clearCart();
    alert("Order placed successfully!");
  } catch (error) {
    console.error('Order failed:', error?.response?.data || error.message);
    alert(`Order failed: ${error?.response?.data?.message || error.message}`);
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
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold mb-4">Your Cart</h2>
              <div onClick={() => setIsCartOpen(false)} className="text-xl font-bold mb-4"><FontAwesomeIcon icon={faXmark} /></div>
            </div>

            {cartItems.length === 0 && <p>Cart is empty</p>}

            {cartItems.map((item) => (
              <div key={item.name} className="flex gap-3 mb-4 items-center font-semibold">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded" />
                <div className="flex-1">
                  <p className="font-semibold first-letter:uppercase">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₹{item.price} × {item.qty}
                  </p>
                  
                </div>
                <p className="text-[var(--primary)]"> ₹{item.price * item.qty}</p>
                <button onClick={() => removeFromCart(item.name)}><FontAwesomeIcon icon={faTrash} /></button>
              </div>
              
            ))}
            
            <div className="absolute left-0 bottom-0 w-full">
            <hr />

            <p className="font-bold mx-1">Total: <span className="text-[var(--primary)]">₹{totalAmount}</span></p>

             {cartItems.length !== 0 &&<div className="items-center w-full space-around  flex justify-center">
              <button onClick={() => setPaymentMethod("online")} className={`m-2 p-1 w-1/2 rounded text-white  ${paymentMethod === "online"? "bg-[var(--primary)]": "bg-gray-400"}`}>UPI Payments</button>
              <button onClick={() => setPaymentMethod("counter")} className={`m-2 p-1 w-1/2 rounded bg-[var(--primary)] text-white  ${paymentMethod === "counter"? "bg-[var(--primary)]": "bg-gray-400"}`}>counter to pay</button>
            </div>}


            <button
              disabled={!paymentMethod || cartItems.length === 0}
              className="mx-2 my-4 w-[95%] bg-[var(--primary)] text-white py-2 rounded mx-2  hover:bg-[var(--primary-dark)]"
              onClick={placeOrder}
            >
              place order
            </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
