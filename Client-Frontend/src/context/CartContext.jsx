import { createContext, useContext, useState } from "react";
import {toast} from "react-toastify";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name
            ? { ...i, qty: i.qty + item.qty }
            : i
        );
      }
      return [...prev, item];
    });
    toast.success(`${item.name} added to cart`); 
  };

  const removeFromCart = (itemName) => {
    setCartItems((prev) => prev.filter((item) => item.name !== itemName));
  };

  const clearCart = () => {
    setCartItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        isCartOpen,
        setIsCartOpen,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
