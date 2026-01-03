import ordermodel from '../models/orderModel.js';

export const createOrder = async (req, res) => {

    const {items, paymentMethod} = req.body || {};

    if(!items || !paymentMethod) {
        return res.status(400).json({ success : false ,message: "Items and payment method are required"});
    }

    try {
        const newOrder = new ordermodel({
            items,
            paymentMethod
        });
        await newOrder.save();
        res.status(201).json({ success: true, message: "Order Created"});
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    
   try {
        const orders = await ordermodel.find({});
        res.status(200).json({ success: true, data: orders });
   } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
   }

};

export const verifyPickup = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await ordermodel.findOne({ orderId });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        order.pickupVerified = true;
        await order.save();
        res.status(200).json({ success: true, message: "Pickup verified" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const cancelOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        // Use model-level deletion to avoid relying on deprecated/removed document methods
        const deleted = await ordermodel.findOneAndDelete({ orderId });
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({ success: true, message: "Order deleted"});
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};