import itemModel from "../models/itemsModel.js";

export const createItem = async (req, res) => {
    const { name, qty, price } = req.body || {};

    if (!name || qty == null || price == null) {
        return res.status(400).json({ success: false, message: "Name, quantity, and price are required" });
    }

    try {
        const newItem = new itemModel({
            name,
            qty,
            price
        });
        await newItem.save();
        res.status(201).json({ success: true, message: "Item Created" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const getAllItems = async (req, res) => {
    try {
        const items = await itemModel.find({});
        res.status(200).json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const updateItem = async (req, res) => {
    const { itemId } = req.params;
    const { name, qty, price } = req.body || {};

    if (!name || qty == null || price == null) {
        return res.status(400).json({ success: false, message: "Name, quantity, and price are required" });
    }

    try {
        const updatedItem = await itemModel.findByIdAndUpdate(itemId, { name, qty, price }, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }
        res.status(200).json({ success: true, message: "Item updated", data: updatedItem });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const deleteItem = async (req, res) => {
    const { itemId } = req.params;
    try {
        const deletedItem = await itemModel.findByIdAndDelete(itemId);
        if (!deletedItem) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }
        res.status(200).json({ success: true, message: "Item deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};