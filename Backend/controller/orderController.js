import ordermodel from "../models/orderModel.js";
import itemsmodel from "../models/itemsModel.js";

export const createOrder = async (req, res) => {
  const { items, paymentMethod } = req.body || {};

  if (!items || items.length === 0 || !paymentMethod) {
    return res.status(400).json({
      success: false,
      message: "Items and payment method are required",
    });
  }

  try {
    // 1️⃣ Check stock
    for (const orderItem of items) {
      const item = await itemsmodel.findOne({ name: orderItem.name });

      if (!item) {
        return res.status(404).json({
          success: false,
          message: `Item not found: ${orderItem.name}`,
        });
      }

      if (item.qty < Number(orderItem.qty)) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${item.name}`,
        });
      }
    }

    // 2️⃣ Reduce stock
    for (const orderItem of items) {
      await itemsmodel.findOneAndUpdate(
        { name: orderItem.name },
        { $inc: { qty: -Number(orderItem.qty) } }
      );
    }

    // 3️⃣ Save order
    const newOrder = new ordermodel({
      items,
      paymentMethod,
      pickupVerified: false,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order Created",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


/* ================= GET ALL ORDERS ================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await ordermodel.find({});
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
/* ================= update paid ================= */
export const updatePaid = async (req, res) => {
  const { orderId } = req.params;

  try{
    const order = await ordermodel.findById(orderId);

    if(!order){
      return res.status(404).json({
        success:false,
        message:"Order not found"
      });
    }
    if(order.paymentStatus === 'Paid'){
      return  res.status(400).json({
        success:false,
        message:"Order already paid"
      });
    }
    order.paymentStatus = 'Paid';
    await order.save();
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
/* ================= VERIFY PICKUP ================= */
export const verifyPickup = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await ordermodel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.pickupVerified = true;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Pickup verified",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/* ================= CANCEL ORDER ================= */
export const cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await ordermodel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🔁 Restore stock (support orders saved by name+qty)
    for (const orderItem of order.items) {
      const incAmount = Number(orderItem.qty ?? orderItem.quantity ?? 0);
      if (orderItem.itemId) {
        // itemId present in order (legacy/support)
        await itemsmodel.findByIdAndUpdate(orderItem.itemId, { $inc: { qty: incAmount } });
      } else {
        // find by name
        await itemsmodel.findOneAndUpdate({ name: orderItem.name }, { $inc: { qty: incAmount } });
      }
    }

    await ordermodel.findByIdAndDelete(orderId);

    res.status(200).json({
      success: true,
      message: "Order cancelled & stock restored",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
