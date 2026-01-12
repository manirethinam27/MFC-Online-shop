import { useState } from "react";
import Home from "../compouents/home";
import OrderManage from "../compouents/orderManage";
import ProductsManage from "../compouents/ProductsManage";

const Dashboard = () => {

    const [page ,setpage]=useState("home");

  return (
    <div className="h-screen w-full flex flex-col">

      {/* Top Header */}
      <div className="w-full p-4 border-b border-gray-300">
        <h1 className="text-2xl font-bold text-[var(--primary)]">
          MFC Dashboard
        </h1>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-1/10 min-w-[220px] bg-[var(--primary)] text-white p-4">
          <ul className="space-y-3 font-medium">
            <li onClick={()=>{setpage("home")}} className={`cursor-pointer hover:text-[var(--text-dark)] ${page==="home"?"bg-white scale-100 text-[var(--primary)]":"bg-transparent scale-100"}`}>
              🏠 Home
            </li>
            <li onClick={()=>{setpage("orderpage")}} className={`cursor-pointer hover:text-[var(--text-dark)] ${page==="orderpage"?"bg-white scale-100 text-[var(--primary)]":"bg-transparent scale-100"}`}>
              📦 Orders
            </li>
            <li onClick={()=>{setpage("itemspage")}} className={`cursor-pointer hover:text-[var(--text-dark)] ${page==="itemspage"?"bg-white scale-100 text-[var(--primary)]":"bg-transparent scale-100"}`}>
              🍔 Products
            </li>
            <li onClick={()=>{setpage("paymentspage")}} className={`cursor-pointer hover:text-[var(--text-dark)] ${page==="paymentspage"?"bg-white scale-100 text-[var(--primary)]":"bg-transparent scale-100"}`}>
              💰 Payments
            </li>
            <li onClick={()=>{setpage("settingspage")}} className={`cursor-pointer hover:text-[var(--text-dark)] ${page==="settingspage"?"bg-white scale-100 text-[var(--primary)]":"bg-transparent scale-100"}`}>
              ⚙️ Settings
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {page === "home" && (
            <Home />
          )}
          {page === "orderpage" && (
            <OrderManage />
          )}
          {page === "itemspage" && (
            <ProductsManage />
          )}
        </main>

      </div>
    </div>
  );
};

export default Dashboard;
