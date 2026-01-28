import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
 orderId: { type: String, required: true, unique: true },
  items: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true, min: 0 },
      price: { type: Number, required: true, min: 0 }
    }
  ],
  totalAmount: { type: Number, default: 0 },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String },
  pickupVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'order' });

orderSchema.pre('validate', function () {
  if (this.items && this.items.length) {
    this.totalAmount = this.items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.qty || 0),
      0
    );
  }
});

const orderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default orderModel;