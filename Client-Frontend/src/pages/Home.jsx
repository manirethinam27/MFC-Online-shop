import { useEffect, useState } from "react";
import axios from "axios";
import FoodCard from "../compouents/ItemCard";
import Navbar from "../compouents/Navbar";
import CartDrawer from "../compouents/CartDrawer";

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/items/getitems`,
          { withCredentials: true }
        );

        console.log("API response:", res.data);

        // ✅ YOUR ACTUAL DATA
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

  return (
    <div className="min-h-screen ">
      <Navbar />
      <CartDrawer />
      {loading ? (
        <p className="text-center mt-10">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-center mt-10">No items found</p>
      ) : (
        <div className="p-2 grid grid-cols-1 justify-items-center align-center sm:grid-cols-2 md:grid-cols-5 gap-6 mt-6">
          {items.map((item) => (
            <FoodCard
              key={item._id}
              name={item.name}
              qty={item.qty}
              price={item.price}
            />
          ))}
        </div>
      )}

    </div>
   
  );
};

export default Home;
