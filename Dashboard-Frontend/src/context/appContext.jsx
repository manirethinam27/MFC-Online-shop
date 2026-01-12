import { createContext, useContext, useState } from "react";


const appContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [orderstotal, setOrders] = useState([]);
  const [profittotal, setProfit] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  return (
    <appContext.Provider
      value={{
        orders: orderstotal,
        setOrders,
        profit: profittotal,
        setProfit,
        pending: pendingOrders,
        setPendingOrders,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export const useAppContext = () => useContext(appContext);
export default appContext;