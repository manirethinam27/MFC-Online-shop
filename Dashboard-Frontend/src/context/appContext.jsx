import { createContext, useContext, useState } from "react";


const appContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [profit, setProfit] = useState(0);

  return (
    <appContext.Provider
      value={{
        orders,
        setOrders,
        profit,
        setProfit
      }}
    ></appContext.Provider>
    );
};

export const useAppContext = () => useContext(appContext);