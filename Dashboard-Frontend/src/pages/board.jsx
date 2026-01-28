import { useState } from "react";
import Home from "../compouents/home";
import OrderManage from "../compouents/orderManage";
import ProductsManage from "../compouents/ProductsManage";
import ScanPage from "../compouents/ScanPage"

const Dashboard = () => {
  const [page, setpage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const MenuItems = () => (
    <ul className="space-y-3 font-medium">
      <li onClick={() => { setpage("home"); setMenuOpen(false); }} className="cursor-pointer">
        🏠 Home
      </li>
      <li onClick={() => { setpage("orderpage"); setMenuOpen(false); }} className="cursor-pointer">
        📦 Orders
      </li>
      <li onClick={() => { setpage("itemspage"); setMenuOpen(false); }} className="cursor-pointer">
        🍔 Products
      </li>
      <li onClick={() => { setpage("orderverifypage"); setMenuOpen(false); }} className="cursor-pointer">
        ✅ Order Verfiy
      </li>
      <li onClick={() => { setpage("settingspage"); setMenuOpen(false); }} className="cursor-pointer">
        ⚙️ Settings
      </li>
    </ul>
  );

  return (
    <div className="h-screen w-full flex flex-col">

      {/* Header */}
      <div className="w-full flex justify-between items-center p-4 border-b border-gray-300 relative">
        <h1 className="text-2xl font-bold text-[var(--primary)]">
          MFC Dashboard
        </h1>

        {/* Mobile menu button */}
        <div
          className="text-2xl md:hidden cursor-pointer"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      
      <div
        className={`fixed top-0 right-0 h-screen w-1/2 bg-gray-300 p-4 shadow-lg z-50 transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Menu</h2>
          <div
            className="cursor-pointer text-xl"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </div>
        </div>

        <MenuItems />
      </div>

      <div className="flex flex-1 overflow-hidden">

        
        <aside className="min-w-[220px] bg-[var(--primary)] text-white p-4 hidden md:block">
          <MenuItems />
        </aside>

        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {page === "home" && <Home />}
          {page === "orderpage" && <OrderManage />}
          {page === "itemspage" && <ProductsManage />}
          {page === "orderverifypage" && <ScanPage />}
        </main>

      </div>
    </div>
  );
};

export default Dashboard;
