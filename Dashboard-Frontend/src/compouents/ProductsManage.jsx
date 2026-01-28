import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


const ProductsManage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addNewItem, setAddItem] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newItem, setNewItem] = useState({
                                        name: "",
                                        price: "",
                                        qty: ""
                                });


  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/items/getitems`,
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

  const fetchItems = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/items/getitems`,
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


  const addItem = async (e) => {
    e.preventDefault();

    try {
        const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/items/createitem`,
        newItem,
        { withCredentials: true }
        );

        setItems((prev) => [...prev, res.data.data]);
        fetchItems();
        setAddItem(false);
        setNewItem({ name: "", price: "", qty: "" });
        toast.success("Item added successfully");
    } catch (error) {
        console.error("Add item failed", error);
        toast.error("Failed to add item");
    }
  };


    

  const filteredItems = items.filter(
  (item) =>
    item?.name?.toLowerCase().includes(search.toLowerCase())
  );


    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/items/updateitem/${currentItem._id}`,
            {
                name: currentItem.name,
                price: currentItem.price,
                qty: currentItem.qty,
            },
            { withCredentials: true }
            );

            // Update UI instantly
            setItems((prev) =>
            prev.map((item) =>
                item._id === currentItem._id ? currentItem : item
            )
            );

            toast.success("Item updated successfully");
            setShowEdit(false);
        } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed to update item");
        }
    };

    const deleteItem = async (itemId) => {
        try {
            await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/items/deleteitem/${itemId}`,
            { withCredentials: true }
            );
            setItems((prev) => prev.filter((item) => item._id !== itemId));
            toast.success("Item deleted successfully");
        } catch (error) {
            console.error("Delete failed", error);
            toast.error("Failed to delete item");
        }
    };

  return (
    <>
    {addNewItem && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
          <h2 className="text-lg font-semibold mb-4">Add New Item</h2>
          <button
            onClick={() => setAddItem(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
          >
            ✕
          </button>
          <form className="space-y-3" onSubmit={addItem}>
            <label htmlFor="name">Name:</label>
            <input
                type="text"
                placeholder="Item name"
                value={newItem.name}
                onChange={(e) =>
                setNewItem({ ...newItem, name: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
                required
            />

            <label htmlFor="price">Price:</label>
            <input
                type="number"
                placeholder="Price"
                value={newItem.price}
                onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
                required
            />

            <label htmlFor="qty">Quantity:</label>
            <input
                type="number"
                placeholder="Quantity"
                value={newItem.qty}
                onChange={(e) =>
                setNewItem({ ...newItem, qty: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
                required
            />

            <button
                type="submit"
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
                Add Item
            </button>
            </form>

        </div>
      </div>
    )}


    {showEdit && currentItem && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">

      <h2 className="text-lg font-semibold mb-4">Edit Product</h2>

      <button
        onClick={() => setShowEdit(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
      >
        ✕
      </button>

      <form className="space-y-3" onSubmit={handleUpdate}>
        <label htmlFor="name pt-2">Name:</label>
        <input
          type="text"
          value={currentItem.name}
          onChange={(e) =>
            setCurrentItem({ ...currentItem, name: e.target.value })
          }
          className="w-full border px-3 pb-2 rounded"
        />

        <label htmlFor="price pt-2">Price:</label>
        <input
          type="number"
          value={currentItem.price}
          onChange={(e) =>
            setCurrentItem({ ...currentItem, price: e.target.value })
          }
          className="w-full border px-3 pb-2 rounded"
        />

        <label htmlFor="qty pt-2">Quantity:</label>
        <input
          type="number"
          value={currentItem.qty}
          onChange={(e) =>
            setCurrentItem({ ...currentItem, qty: e.target.value })
          }
          className="w-full border px-3 pb-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Update Item
        </button>
      </form>
    </div>
  </div>
)}


    <h1 className="text-xl font-semibold mb-4">Products Management</h1>

    <div className="mb-4 flex justify-between items-center">
      <input type="search" placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} className="border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-red-400"/>

      <button onClick={() => setAddItem(true)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
        Add New Item
      </button>
    </div>

    <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border border-red-300">
            <thead className="bg-red-300 text-[var(--primary)] font-bold">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold ">Items</th>
                <th className="px-4 py-3 text-left text-sm font-semibold ">Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold ">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-300">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-4 py-3 text-center">Loading...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-3 text-center">No items found.</td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 py-3 text-sm">{item.name}</td>
                    <td className="px-4 py-3 text-sm">₹{item.price}</td>
                    <td className="px-4 py-3 text-sm">{item.qty}</td>
                    <td className="px-4 py-3 text-sm">
                      <button onClick={() => { setCurrentItem(item); setShowEdit(true); }} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                        Edit
                      </button>
                      <button onClick={()=>{deleteItem(item._id)}} className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
        </table>
    </div>

    </>    
    );
}

export default ProductsManage;