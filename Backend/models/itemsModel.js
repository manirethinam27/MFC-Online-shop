import mongoose from "mongoose";

const itemsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true }
});

const itemModel = mongoose.models.Item || mongoose.model("Item", itemsSchema);

export default itemModel;