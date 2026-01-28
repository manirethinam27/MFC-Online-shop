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
    /* ================= 1️⃣ CHECK STOCK ================= */
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

    /* ================= 2️⃣ REDUCE STOCK ================= */
    for (const orderItem of items) {
      await itemsmodel.findOneAndUpdate(
        { name: orderItem.name },
        { $inc: { qty: -Number(orderItem.qty) } }
      );
    }

    /* ================= 3️⃣ GENERATE ORDER ID ================= */
    const now = new Date();
    const orderId = `MFC-${now.getFullYear()}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    /* ================= 4️⃣ SAVE ORDER ================= */
    const paymentStatus = paymentMethod === "online" ? "Paid" : "Pending";

    const newOrder = new ordermodel({
      orderId,
      items,
      paymentMethod,
      paymentStatus,
      pickupVerified: false,
    });

    await newOrder.save();

    /* ================= 5️⃣ RESPONSE ================= */
    res.status(201).json({
      success: true,
      message: "Order Created",
      orderId: newOrder.orderId, 
      mongodb: newOrder._id,  
      paymentStatus: paymentStatus,
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
    const order = await ordermodel.findOne({ orderId });

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

    res.status(200).json({
      success: true,
      message: "Order marked as Paid",
      data: order,
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};/* ================= VERIFY PICKUP ================= */
export const verifyPickup = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await ordermodel.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // optional safety checks
    if (order.pickupVerified) {
      return res.status(400).json({
        success: false,
        message: "Order already collected",
      });
    }

    if (order.paymentStatus !== "Paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    order.pickupVerified = true;
    order.pickedUpAt = new Date();
    await order.save();

    res.status(200).json({
      success: true,
      message: "Pickup verified successfully",
      orderId: order.orderId,
    });
  } catch (error) {
    console.error("Verify pickup error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
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
