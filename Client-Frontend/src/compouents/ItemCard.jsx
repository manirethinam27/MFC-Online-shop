import { useState } from "react";
import chickenImg from "../assets/chicken-buff.png";
import coffeeImg from "../assets/coffee.png";
import eggImg from "../assets/egg-buff.png";
import paneerImg from "../assets/panneer-buff.png";
import samosaImg from "../assets/samosa.png";
import vegImg from "../assets/veg-buff.png";
import logoImg from "../assets/logo-mfc.png";
import { useCart } from "../context/CartContext";

const images = {
  chicken: chickenImg,
  coffee: coffeeImg,
  egg: eggImg,
  paneer: paneerImg,
  samosa: samosaImg,
  veg: vegImg,
  default: logoImg,
};

function getImageByName(name) {
  if (!name) return images.default;
  const n = name.toLowerCase();
  if (n.includes("chicken")) return images.chicken;
  if (n.includes("coffee")) return images.coffee;
  if (n.includes("egg")) return images.egg;
  if (n.includes("paneer") || n.includes("panneer")) return images.paneer;
  if (n.includes("samosa")) return images.samosa;
  if (n.includes("veg") || n.includes("vegetable")) return images.veg;
  return images.default;
}

const FoodCard = ({ name, price, qty = 1 }) => {
  const [ordercount, setCount] = useState(1);
  const { addToCart } = useCart();

  return (
    <div
      className="w-64 p-4 rounded-[10px] shadow-md"
      style={{ backgroundColor: "var(--card-bg)" }}
    >
      <div className="h-32 rounded mb-3 overflow-hidden">
        <img
          src={getImageByName(name)}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex justify-between items-center mb-3">
        <span className="first-letter:uppercase text-[var(--primary)] font-bold">
          {name}
        </span>

        <div className="flex border border-black rounded items-center">
          <button
            className="px-2 hover:bg-[#FFE5DF]"
            onClick={() => ordercount > 1 && setCount(ordercount - 1)}
          >
            -
          </button>
          <span className="px-3 border-x border-black">{ordercount}</span>
          <button
            className="px-2 hover:bg-[#FFE5DF]"
            onClick={() => setCount(ordercount + 1)}
          >
            +
          </button>
        </div>
      </div>

      {qty > 0 ? (
        <button
          className="w-full text-white rounded-[4px] py-2
                     bg-[var(--primary)] hover:bg-[var(--primary-dark)]
                     transition-colors duration-200"
          onClick={() =>
            addToCart({
              name,
              price,
              qty: ordercount,
              image: getImageByName(name),
            })
            
          }
          
        >
          Add to Cart – ₹{price * ordercount}
        </button>
      ) : (
        <button className="w-full bg-gray-500 rounded-[4px] text-white py-2 cursor-not-allowed">
          Out of Stock
        </button>
      )}
    </div>
  );
};

export default FoodCard;
