import logo from "../assets/logo-mfc.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cartItems, setIsCartOpen } = useCart();

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 flex items-center justify-between
                 border-b border-gray-300 bg-white/70 backdrop-blur-[10px]
                 px-6 py-2"
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="mfc logo" width="44" height="44" />
        <div>
          <h1 className="font-bold text-xl text-[var(--primary)]">MFC</h1>
          <p>order & pickup</p>
        </div>
      </div>

      {/* Cart */}
      <motion.div
        onClick={() => setIsCartOpen(true)}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="relative cursor-pointer text-gray-800 text-xl"
      >
        <FontAwesomeIcon
          icon={faCartShopping}
          className="p-1 rounded border border-gray-300 hover:bg-[var(--primary)]"
        />

        <span className="absolute -top-2 -right-2
                         bg-[#FF4C29] text-white
                         text-xs font-semibold
                         w-5 h-5 rounded-full
                         flex items-center justify-center">
          {cartItems.reduce((a, b) => a + b.qty, 0)}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default Navbar;
